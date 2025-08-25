// backend/transactionsRoutes.js

const express = require('express');
const db = require('./database');
const { authenticateToken } = require('./authRoutes');

const router = express.Router();

// Rute untuk mendapatkan semua transaksi dan kategori untuk pengguna yang terotentikasi
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Ambil transaksi milik pengguna
        const transactionsResult = await db.query(
            `SELECT
                t.id,
                t.amount,
                t.type,
                t.description,
                t.date,
                c.name AS category_name
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1
             ORDER BY t.date DESC`,
            [req.user.id]
        );

        // Ambil semua kategori
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
