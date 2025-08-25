// backend/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Mengirim notifikasi email untuk pengeluaran besar.
 * @param {string} userEmail - Alamat email penerima.
 * @param {string} username - Nama pengguna.
 * @param {object} transaction - Objek transaksi.
 */
const sendNotificationEmail = async (userEmail, username, transaction) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Notifikasi Pengeluaran Besar: ${transaction.description}`,
        html: `
            <h1>Notifikasi Pengeluaran Besar</h1>
            <p>Halo, ${username},</p>
            <p>Kami mendeteksi pengeluaran besar dari akun Anda:</p>
            <ul>
                <li><strong>Jumlah:</strong> Rp ${parseFloat(transaction.amount).toLocaleString('id-ID')}</li>
                <li><strong>Deskripsi:</strong> ${transaction.description}</li>
                <li><strong>Tanggal:</strong> ${new Date(transaction.date).toLocaleDateString('id-ID')}</li>
            </ul>
            <p>Terima kasih telah menggunakan aplikasi kami.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email notifikasi berhasil dikirim ke ${userEmail}`);
    } catch (error) {
        console.error('Gagal mengirim email notifikasi:', error);
    }
};

/**
 * Mengirim email selamat datang.
 * @param {string} userEmail - Alamat email penerima.
 * @param {string} username - Nama pengguna.
 */
const sendWelcomeEmail = async (userEmail, username) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Selamat Datang di Aplikasi Keuangan!`,
        html: `
            <h1>Selamat Datang, ${username}!</h1>
            <p>Terima kasih telah bergabung dengan Aplikasi Keuangan kami.</p>
            <p>Dengan aplikasi ini, Anda dapat melacak pemasukan dan pengeluaran Anda dengan mudah.</p>
            <p>Selamat mencoba!</p>
            <p>Salam,</p>
            <p>Tim ur.personalfinance</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email selamat datang berhasil dikirim ke ${userEmail}`);
    } catch (error) {
        console.error('Gagal mengirim email selamat datang:', error);
    }
};

module.exports = { sendNotificationEmail, sendWelcomeEmail };
