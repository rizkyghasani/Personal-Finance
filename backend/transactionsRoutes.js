// backend/transactionsRoutes.js

const express = require('express');
const db = require('./database');
const { authenticateToken } = require('./authRoutes');
const { sendNotificationEmail } = require('./emailService');

const router = express.Router();

// Rute untuk mendapatkan ringkasan pengeluaran dan pemasukan bulanan berdasarkan rentang tanggal
router.get('/summary/monthly', authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    let query = `
        SELECT 
            TO_CHAR(date, 'YYYY-MM') AS month,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
        WHERE user_id = $1
    `;
    const params = [req.user.id];

    if (startDate) {
        params.push(startDate);
        query += ` AND date >= $${params.length}`;
    }
    if (endDate) {
        params.push(endDate);
        query += ` AND date <= $${params.length}`;
    }

    query += ` GROUP BY month ORDER BY month`;

    try {
        const summary = await db.query(query, params);
        res.json(summary.rows);
    } catch (error) {
        console.error('Error fetching monthly summary:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute baru untuk mendapatkan total pemasukan dan pengeluaran berdasarkan rentang tanggal
router.get('/summary/totals', authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    let query = `
        SELECT
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS overall_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS overall_expense
        FROM transactions
        WHERE user_id = $1
    `;
    const params = [req.user.id];

    if (startDate) {
        params.push(startDate);
        query += ` AND date >= $${params.length}`;
    }
    if (endDate) {
        params.push(endDate);
        query += ` AND date <= $${params.length}`;
    }

    try {
        const totals = await db.query(query, params);
        res.json(totals.rows[0]);
    } catch (error) {
        console.error('Error fetching overall totals:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk mendapatkan semua transaksi dan kategori untuk pengguna yang terotentikasi
router.get('/', authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    let query = `
        SELECT
            t.id,
            t.amount,
            t.type,
            t.description,
            t.date,
            t.created_at,
            c.name AS category_name
         FROM transactions t
         LEFT JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1
    `;
    const params = [req.user.id];
    
    if (startDate) {
        params.push(startDate);
        query += ` AND t.date >= $${params.length}`;
    }
    if (endDate) {
        params.push(endDate);
        query += ` AND t.date <= $${params.length}`;
    }

    query += ` ORDER BY t.created_at DESC`;

    try {
        const transactionsResult = await db.query(query, params);

        const categoriesResult = await db.query('SELECT * FROM categories');

        res.json({
            transactions: transactionsResult.rows,
            categories: categoriesResult.rows
        });

    } catch (error) {
        console.error('Error fetching data:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk menambahkan transaksi baru
router.post('/', authenticateToken, async (req, res) => {
    const { amount, type, category_id, description, date } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO transactions (user_id, amount, type, category_id, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.id, amount, type, category_id, description, date]
        );
        
        // Cek jika transaksi adalah pengeluaran besar dan kirim notifikasi email
        if (type === 'expense' && amount > 500000) {
            const userResult = await db.query('SELECT email, username FROM users WHERE id = $1', [req.user.id]);
            const { email, username } = userResult.rows[0];
            
            // Kirim email secara asinkron tanpa menunggu
            sendNotificationEmail(email, username, result.rows[0]);
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding transaction:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk mengupdate transaksi
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { amount, type, category_id, description, date } = req.body;
    try {
        const result = await db.query(
            'UPDATE transactions SET amount = $1, type = $2, category_id = $3, description = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [amount, type, category_id, description, date, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found or not authorized' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating transaction:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk menghapus transaksi
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found or not authorized' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
