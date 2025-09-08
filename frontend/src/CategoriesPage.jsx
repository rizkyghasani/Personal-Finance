import React, { useState, useEffect } from 'react';

// ========================
// Komponen Halaman Manajemen Kategori
// ========================
export default function CategoriesPage({ onPageChange, showMessage }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    type: 'expense',
  });
  
  const API_URL = '/api';
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Gagal memuat data kategori.');
      }
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Gagal memuat kategori. Silakan coba masuk kembali.');
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
      let response;
      if (editingId) {
        // Edit kategori
        response = await fetch(`${API_URL}/transactions/categories/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
      } else {
        // Tambah kategori baru
        response = await fetch(`${API_URL}/transactions/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan kategori.');
      }
      
      showMessage('Kategori berhasil disimpan!');
      setEditingId(null);
      setForm({ name: '', type: 'expense' });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error saving category:', err);
      showMessage(err.message);
    }
  };

  const handleEditClick = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      type: category.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: '',
      type: 'expense',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
        return;
    }
    try {
      const response = await fetch(`${API_URL}/transactions/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus kategori.');
      }

      showMessage('Kategori berhasil dihapus!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error deleting category:', err);
      showMessage(err.message);
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
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Manajemen Kategori</h2>

      {/* Form Tambah/Edit Kategori */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                required
              />
            </div>
            <div>
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
              {editingId ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Kategori */}
      <div className="p-4 border rounded-lg shadow-sm max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ini Daftar Kategori Anda</h3>
        <ul className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map(c => (
              <li key={c.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{c.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada kategori.</p>
          )}
        </ul>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => onPageChange('dashboard')}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          &larr; Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
