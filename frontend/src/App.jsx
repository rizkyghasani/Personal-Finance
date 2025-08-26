import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import BudgetPage from './BudgetPage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
    if (currentPage === 'profile') return <ProfilePage onPageChange={setCurrentPage} showMessage={showMessage} />;
    if (currentPage === 'transactions') return <TransactionsPage onPageChange={setCurrentPage} showMessage={showMessage} />;
    if (currentPage === 'budgets') return <BudgetPage onPageChange={setCurrentPage} showMessage={showMessage} />;
    return <RegisterPage onPageChange={setCurrentPage} showMessage={showMessage} />;
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'register';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isAuthPage && (
        <Navbar onPageChange={setCurrentPage} showMessage={showMessage} />
      )}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">ur.FinancialApp</h1>
          {renderPage()}
          {message && (
            <div className="mt-4 p-3 bg-indigo-100 text-indigo-700 rounded-lg text-center font-medium">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================
// Komponen Navbar
// ========================
function Navbar({ onPageChange, showMessage }) {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const API_URL = 'http://localhost:3001';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onPageChange('login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex justify-between items-center px-4 md:px-8 shadow-md bg-white">
              {/* Logo */}
              <div>
                <button 
                  onClick={() => onPageChange('dashboard')} 
                  className="flex items-center py-4 px-2"
                >
                  <span className="font-bold text-indigo-600 text-xl">FinApp</span>
                </button>
              </div>

              {/* Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => onPageChange('dashboard')}
                  className={`py-4 px-2 font-semibold transition duration-300`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => onPageChange('transactions')}
                  className={`py-4 px-2 font-semibold transition duration-300`}
                >
                  Riwayat Transaksi
                </button>

                <button
                  onClick={() => onPageChange('budgets')}
                  className={`py-4 px-2 font-semibold transition duration-300`}
                >
                  Anggaran
                </button>
              </div>
            </div>

          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button onClick={() => { onPageChange('profile'); setShowProfileMenu(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      Lihat Profil
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
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

// ========================
// Komponen Halaman Profil Pengguna
// ========================
function ProfilePage({ onPageChange, showMessage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:3001';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil data profil.');
        }
        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Gagal memuat data profil. Silakan coba masuk kembali.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      onPageChange('login');
    }
  }, [token, onPageChange]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onPageChange('login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Memuat data profil...</p>
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
        <h2 className="text-2xl font-bold text-gray-700">Profil Pengguna</h2>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Username</h4>
          <p className="text-lg font-semibold text-gray-900">{user.username}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Email</h4>
          <p className="text-lg font-semibold text-gray-900">{user.email}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Tanggal Bergabung</h4>
          <p className="text-lg font-semibold text-gray-900">{new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
    </div>
  );
}

// ========================
// Komponen Halaman Riwayat Transaksi
// ========================
function TransactionsPage({ onPageChange, showMessage }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const API_URL = 'http://localhost:3001';
  const token = localStorage.getItem('token');

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    categoryId: '',
    description: '',
    date: today,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      if (!transactionsRes.ok || !categoriesRes.ok) {
        throw new Error('Gagal memuat data.');
      }
      const transactionsData = await transactionsRes.json();
      const categoriesData = await categoriesRes.json();
      setTransactions(transactionsData.transactions);
      setCategories(categoriesData.categories);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Gagal memuat riwayat transaksi. Silakan coba masuk kembali.');
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
      date: today,
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
        date: today,
      });
      fetchData(); // Refresh all data
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
      fetchData(); // Refresh all data
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
        <p>Memuat riwayat transaksi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={handleLogout} className="font-medium text-indigo-600 hover:text-indigo-500">
          Kembali ke halaman login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Riwayat Transaksi Lengkap</h2>
      <div className="p-4 border rounded-lg shadow-sm">
        <ul className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <li key={t.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t.description || t.category_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}Rp {parseFloat(t.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada transaksi.</p>
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

// ========================
// Komponen Halaman Dashboard
// ========================
function DashboardPage({ onPageChange, showMessage }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [spending, setSpending] = useState({});
  const [summaryData, setSummaryData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({ overall_income: 0, overall_expense: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [dateRange, setDateRange] = useState({
      startDate: firstDayOfMonth,
      endDate: today,
  });

  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    categoryId: '',
    description: '',
    date: today,
  });

  const API_URL = 'http://localhost:3001';
  const token = localStorage.getItem('token');

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(dateRange).toString();
      
      const [transactionsRes, categoriesRes, summaryRes, totalsRes, budgetsRes] = await Promise.all([
        fetch(`${API_URL}/api/transactions?${urlParams}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/transactions/summary/monthly?${urlParams}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/transactions/summary/totals?${urlParams}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/transactions/budgets`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      if (!transactionsRes.ok || !categoriesRes.ok || !summaryRes.ok || !totalsRes.ok || !budgetsRes.ok) {
        throw new Error('Failed to fetch data.');
      }
      
      const transactionsData = await transactionsRes.json();
      const summaryData = await summaryRes.json();
      const totalsData = await totalsRes.json();
      const budgetsData = await budgetsRes.json();
      
      setTransactions(transactionsData.transactions);
      setCategories(transactionsData.categories);
      setSummaryData(summaryData);
      setTotalSummary(totalsData);
      setBudgets(budgetsData);
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
      setError('Gagal memuat data. Silakan coba masuk kembali.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

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
      date: today,
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
        date: today,
      });
      fetchData(); // Refresh all data
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
      fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error deleting transaction:', err);
      showMessage('Gagal menghapus transaksi. Coba lagi.');
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onPageChange('login');
  };

  // Prepare data for the chart
  const chartLabels = summaryData.map(d => d.month);
  const chartIncome = summaryData.map(d => d.total_income);
  const chartExpense = summaryData.map(d => d.total_expense);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Pemasukan',
        data: chartIncome,
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
      },
      {
        label: 'Pengeluaran',
        data: chartExpense,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const formattedIncome = parseFloat(totalSummary.overall_income || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  const formattedExpense = parseFloat(totalSummary.overall_expense || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  const formattedBalance = (parseFloat(totalSummary.overall_income || 0) - parseFloat(totalSummary.overall_expense || 0)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => onPageChange('profile')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Profil
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Bagian Grafik dan Summary */}
      <div className="p-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Ringkasan</h3>
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Periode:</label>
                <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className="px-2 py-1 border rounded-md shadow-sm text-sm"
                />
                <span>-</span>
                <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    className="px-2 py-1 border rounded-md shadow-sm text-sm"
                />
            </div>
        </div>
        {summaryData.length > 0 ? (
            <div className="space-y-4">
                <div className="w-full h-64">
                  <Bar
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: false } } }}
                      data={chartData}
                  />
                </div>
                
                {/* Tampilan Total Pemasukan dan Pengeluaran */}
                <div className="flex justify-between space-x-2 text-sm">
                    <div className="flex-1 bg-green-50 p-3 rounded-lg shadow-md border border-green-200">
                        <h4 className="font-medium text-green-700">Total Pemasukan</h4>
                        <p className="text-xl font-bold text-green-800 mt-1">{formattedIncome}</p>
                    </div>
                    <div className="flex-1 bg-red-50 p-3 rounded-lg shadow-md border border-red-200">
                        <h4 className="font-medium text-red-700">Total Pengeluaran</h4>
                        <p className="text-xl font-bold text-red-800 mt-1">{formattedExpense}</p>
                    </div>
                    <div className="flex-1 bg-blue-50 p-3 rounded-lg shadow-md border border-blue-200">
                        <h4 className="font-medium text-blue-700">Saldo</h4>
                        <p className="text-xl font-bold text-blue-800 mt-1">{formattedBalance}</p>
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-center text-gray-500 py-4">Belum ada data untuk ditampilkan di grafik.</p>
        )}
      </div>

      {/* Form Tambah/Edit Transaksi */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
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
                {categories
                  .filter(c => c.type === form.type)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
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
      <div className="p-4 border rounded-lg shadow-sm max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Riwayat Transaksi</h3>
        <ul className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <li key={t.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t.description || t.category_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()} pada pukul {new Date(t.created_at).toLocaleTimeString('id-ID')}
                    </p>
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
