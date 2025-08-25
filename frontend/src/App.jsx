import React, { useState, useEffect } from 'react';
import './index.css';

// Main App component
export default function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentPage('dashboard');
    }
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const renderPage = () => {
    if (currentPage === 'login') return <LoginPage onPageChange={setCurrentPage} showMessage={showMessage} />;
    if (currentPage === 'dashboard') return <DashboardPage onPageChange={setCurrentPage} showMessage={showMessage} />;
    return <RegisterPage onPageChange={setCurrentPage} showMessage={showMessage} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Aplikasi Keuangan</h1>
        {renderPage()}
        {message && (
          <div className="mt-4 p-3 bg-indigo-100 text-indigo-700 rounded-lg text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================
// Komponen Halaman Registrasi
// ========================
function RegisterPage({ onPageChange, showMessage }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3001';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Pendaftaran berhasil! Silakan masuk.');
        onPageChange('login');
      } else {
        showMessage(data.message || 'Pendaftaran gagal');
      }
    } catch (error) {
      console.error(error);
      showMessage('Terjadi kesalahan koneksi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Daftar</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        Sudah punya akun?{' '}
        <button
          className="font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => onPageChange('login')}
        >
          Masuk
        </button>
      </div>
    </div>
  );
}

// ========================
// Komponen Halaman Login
// ========================
function LoginPage({ onPageChange, showMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://localhost:3001';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        showMessage('Berhasil masuk!');
        onPageChange('dashboard');
      } else {
        showMessage(data.message || 'Login gagal. Periksa email dan kata sandi.');
      }
    } catch (error) {
      console.error(error);
      showMessage('Terjadi kesalahan koneksi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Masuk</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        Belum punya akun?{' '}
        <button
          className="font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => onPageChange('register')}
        >
          Daftar
        </button>
      </div>
    </div>
  );
}

// Komponen Halaman Dashboard
function DashboardPage({ onPageChange, showMessage }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    categoryId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const API_URL = 'http://localhost:3001';
  const token = localStorage.getItem('token');

  // Fetch data from API
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data.');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data. Silakan coba masuk kembali.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (transaction) => {
    setEditingId(transaction.id);
    setForm({
      amount: transaction.amount,
      type: transaction.type,
      categoryId: categories.find(c => c.name === transaction.category_name)?.id,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0],
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      amount: '',
      type: 'expense',
      categoryId: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      category_id: parseInt(form.categoryId, 10),
    };

    try {
      let response;
      if (editingId) {
        // Edit transaction
        response = await fetch(`${API_URL}/api/transactions/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Add new transaction
        response = await fetch(`${API_URL}/api/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save transaction.');
      }
      
      showMessage('Transaksi berhasil disimpan!');
      setEditingId(null);
      setForm({
        amount: '',
        type: 'expense',
        categoryId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchTransactions(); // Refresh data
    } catch (err) {
      console.error('Error saving transaction:', err);
      showMessage('Gagal menyimpan transaksi. Coba lagi.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
        return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction.');
      }

      showMessage('Transaksi berhasil dihapus!');
      fetchTransactions(); // Refresh data
    } catch (err) {
      console.error('Error deleting transaction:', err);
      showMessage('Gagal menghapus transaksi. Coba lagi.');
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
      
      {/* Form Tambah/Edit Transaksi */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Jumlah</label>
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Tipe</label>
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories
                  .filter(c => c.type === form.type)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
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
              {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Transaksi */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Riwayat Transaksi</h3>
        <ul className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <li key={t.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t.description || t.category_name}</p>
                    <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}Rp {parseFloat(t.amount).toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => handleEditClick(t)}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada transaksi.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
