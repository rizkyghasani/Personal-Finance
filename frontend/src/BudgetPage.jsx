import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Komponen Halaman Anggaran
export default function BudgetPage({ onPageChange, showMessage }) {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spending, setSpending] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // State baru untuk mode edit
  const [selectedBudget, setSelectedBudget] = useState(null); // State untuk melihat detail anggaran
  const [budgetDetails, setBudgetDetails] = useState([]); // State untuk detail transaksi anggaran
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [form, setForm] = useState({
      amount: '',
      categoryId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
  });
  const API_URL = 'http://localhost:3001';
  const token = localStorage.getItem('token');

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/transactions/budgets`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      if (!budgetsRes.ok || !categoriesRes.ok) {
          throw new Error('Gagal memuat data anggaran.');
      }
      
      const budgetsData = await budgetsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setBudgets(budgetsData);
      setCategories(categoriesData.categories.filter(c => c.type === 'expense'));
      setError(null);

      // Fetch spending for each budget
      const spendingPromises = budgetsData.map(async b => {
          const spendingRes = await fetch(`${API_URL}/api/transactions/budgets/spending?month=${b.month}&year=${b.year}&categoryId=${b.category_id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const spendingData = await spendingRes.json();
          return { id: b.id, total_spent: spendingData.total_spent };
      });
      
      const spendingResults = await Promise.all(spendingPromises);
      const spendingMap = spendingResults.reduce((acc, curr) => {
          acc[curr.id] = parseFloat(curr.total_spent);
          return acc;
      }, {});

      setSpending(spendingMap);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data anggaran. Silakan coba masuk kembali.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchData();
  }, [token]);
  
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            ...form,
            amount: parseFloat(form.amount),
            category_id: parseInt(form.categoryId, 10),
            month: parseInt(form.month, 10),
            year: parseInt(form.year, 10),
        };
        
        let response;
        if (editingId) {
            // Edit budget
            response = await fetch(`${API_URL}/api/transactions/budgets/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
        } else {
            // Add new budget
            response = await fetch(`${API_URL}/api/transactions/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menyimpan anggaran.');
        }

        showMessage('Anggaran berhasil disimpan!');
        setEditingId(null);
        setForm({ amount: '', categoryId: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
        fetchData(); // Refresh data
    } catch (err) {
        console.error('Error saving budget:', err);
        showMessage(err.message);
    }
  };

  const handleEditClick = (budget) => {
      setEditingId(budget.id);
      setForm({
          amount: budget.amount,
          categoryId: budget.category_id,
          month: budget.month,
          year: budget.year,
      });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setForm({
          amount: '',
          categoryId: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
      });
  };

  const handleDelete = async (id) => {
      if (!window.confirm("Apakah Anda yakin ingin menghapus anggaran ini?")) {
          return;
      }
      try {
          const response = await fetch(`${API_URL}/api/transactions/budgets/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) {
              throw new Error('Gagal menghapus anggaran.');
          }
          showMessage('Anggaran berhasil dihapus!');
          fetchData();
      } catch (err) {
          console.error('Error deleting budget:', err);
          showMessage(err.message);
      }
  };
  
  const handleShowDetails = async (budget) => {
      setSelectedBudget(budget);
      setDetailsLoading(true);
      try {
          const res = await fetch(`${API_URL}/api/transactions/budgets/details?month=${budget.month}&year=${budget.year}&categoryId=${budget.category_id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const details = await res.json();
          if (res.ok) {
              setBudgetDetails(details);
          } else {
              throw new Error(details.message || 'Gagal memuat detail transaksi.');
          }
      } catch (err) {
          console.error('Error fetching budget details:', err);
          showMessage(err.message);
      } finally {
          setDetailsLoading(false);
      }
  };
  
  const handleCloseDetails = () => {
      setSelectedBudget(null);
      setBudgetDetails([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onPageChange('login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleLogout}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Kembali ke halaman login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Manajemen Anggaran</h2>

      {/* Form Tambah Anggaran */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{editingId ? 'Edit Anggaran' : 'Tambah Anggaran Baru'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Anggaran</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                step="0.01"
                required
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Bulan</label>
                <input
                    type="number"
                    name="month"
                    value={form.month}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                    min="1"
                    max="12"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tahun</label>
                <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                    required
                />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingId ? 'Simpan Perubahan' : 'Simpan Anggaran'}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Anggaran */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Anggaran Anda</h3>
        <div className="max-h-96 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {budgets.length > 0 ? (
              budgets.map(b => {
                const category = categories.find(c => c.id === b.category_id);
                const spent = spending[b.id] || 0;
                const remaining = b.amount - spent;
                const progress = (spent / b.amount) * 100;
                const progressBarColor = progress > 100 ? 'bg-red-500' : 'bg-green-500';

                return (
                  <li key={b.id} className="py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {category ? category.name : 'Unknown Category'} - {b.month}/{b.year}
                        </p>
                        <div className="mt-2 text-xs">
                            <p>Anggaran: Rp {parseFloat(b.amount).toLocaleString('id-ID')}</p>
                            <p>Terpakai: Rp {parseFloat(spent).toLocaleString('id-ID')}</p>
                            <p className={`font-semibold ${remaining < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                              Sisa: Rp {parseFloat(remaining).toLocaleString('id-ID')}
                            </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${progressBarColor}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                          </div>
                          <button
                            onClick={() => handleShowDetails(b)}
                            className="text-xs text-indigo-600 hover:text-indigo-900"
                          >
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => handleEditClick(b)}
                            className="text-xs text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="text-xs text-red-600 hover:text-red-900"
                          >
                            Hapus
                          </button>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada anggaran yang ditetapkan.</p>
            )}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => onPageChange('dashboard')}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          &larr; Kembali ke Dashboard
        </button>
      </div>
      
      {/* Modal untuk Detail Transaksi */}
      {selectedBudget && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="text-xl font-bold">Detail Pengeluaran untuk {categories.find(c => c.id === selectedBudget.category_id)?.name}</h3>
                      <button onClick={handleCloseDetails} className="text-gray-400 hover:text-gray-600">
                          &times;
                      </button>
                  </div>
                  {detailsLoading ? (
                      <p>Memuat detail transaksi...</p>
                  ) : (
                      <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                          {budgetDetails.length > 0 ? (
                              budgetDetails.map(t => (
                                  <li key={t.id} className="py-2">
                                      <div className="flex justify-between">
                                          <div>
                                              <p className="text-sm font-medium">{t.description || 'Tanpa deskripsi'}</p>
                                              <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('id-ID')}</p>
                                          </div>
                                          <div className="text-sm font-semibold text-red-600">
                                              -Rp {parseFloat(t.amount).toLocaleString('id-ID')}
                                          </div>
                                      </div>
                                  </li>
                              ))
                          ) : (
                              <p className="text-center text-gray-500 py-4">Tidak ada transaksi di kategori ini untuk periode ini.</p>
                          )}
                      </ul>
                  )}
              </div>
          </div>
      )}
    </div>
  );
}
