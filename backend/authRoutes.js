// backend/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const { sendWelcomeEmail } = require('./emailService');

const router = express.Router();

// Middleware untuk melindungi rute
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// Rute untuk mendapatkan data profil pengguna
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.query('SELECT username, email, created_at FROM users WHERE id = $1', [req.user.id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk mengupdate username
router.put('/profile/username', authenticateToken, async (req, res) => {
    const { username } = req.body;
    try {
        const result = await db.query(
            'UPDATE users SET username = $1 WHERE id = $2 RETURNING username',
            [username, req.user.id]
        );
        res.json({ message: 'Username berhasil diperbarui', username: result.rows[0].username });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Username sudah digunakan' });
        }
        console.error('Error updating username:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk mengupdate password
router.put('/profile/password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password lama salah' });
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, req.user.id]);

        res.json({ message: 'Password berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating password:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk registrasi
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const result = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password_hash]
        );
        const user = result.rows[0];

        // Kirim email selamat datang secara asinkron
        sendWelcomeEmail(user.email, user.username);
        
        res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username } });
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL error code for unique constraint violation
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        console.error('Error during registration:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rute untuk login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { router, authenticateToken };
