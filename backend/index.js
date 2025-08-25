// backend/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');
const { router: authRoutes } = require('./authRoutes');
const transactionsRoutes = require('./transactionsRoutes'); // Impor rute transaksi

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verifikasi koneksi database saat server berjalan
db.query('SELECT 1')
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error', err.stack));

// Pasang rute-rute otentikasi
app.use('/api/auth', authRoutes);

// Pasang rute-rute transaksi, dilindungi oleh middleware otentikasi
app.use('/api/transactions', transactionsRoutes);

// Route Sederhana
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
