// backend/database.js

const { Pool } = require('pg');

// Menggunakan variabel lingkungan yang sudah Anda definisikan di docker-compose.yml
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
});

// Verifikasi koneksi ke database
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to database!');
    client.release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
