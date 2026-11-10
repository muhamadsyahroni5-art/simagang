<?php
/**
 * SI-TAMU Kemenag Lebak
 * Sistem Informasi Buku Tamu Digital
 * Kantor Kementerian Agama Kabupaten Lebak
 * Konfigurasi Database (PDO) & Helper Global
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Konfigurasi Database Laragon / XAMPP default
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'db_sitamu_lebak');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("<div style='font-family:sans-serif;padding:30px;color:#991b1b;background:#fef2f2;border:1px solid #f87171;border-radius:12px;max-width:600px;margin:50px auto;'>
        <h3 style='margin-top:0;'>Koneksi Database MySQL Gagal</h3>
        <p>" . htmlspecialchars($e->getMessage()) . "</p>
        <p><strong>Langkah Perbaikan:</strong></p>
        <ol>
            <li>Buka <strong>phpMyAdmin</strong> (<code>http://localhost/phpmyadmin</code>)</li>
            <li>Buat database baru bernama <code>db_sitamu_lebak</code></li>
            <li>Import file <code>database_sitamu.sql</code> yang tersedia di dalam folder ini.</li>
        </ol>
    </div>");
}

// Zona Waktu Resmi Indonesia Barat (WIB)
date_default_timezone_set('Asia/Jakarta');

// Daftar 12 Unit Layanan Kemenag Lebak
$UNIT_LAYANAN = [
    'Kepala Kantor',
    'Kasubbag TU',
    'Subbag Keuangan dan BMN',
    'Subbag Kepegawaian',
    'Subbag Pusdatin',
    'Subbag Perencanaan dan Kehumasan',
    'Subbag Umum dan Kerumahtanggaan',
    'Seksi Bimas Islam',
    'Penyelenggaraan Zakat dan Wakaf',
    'Seksi Pendidikan Madrasah',
    'Seksi Pendidikan Agama Islam',
    'Seksi Pendidikan Diniyah dan Pondok Pesantren'
];

// Helper Nama Hari Indonesia
function getHariIndonesia($dateStr) {
    $hari = date('w', strtotime($dateStr));
    $namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return $namaHari[$hari];
}

// Helper Autentikasi & Guard Akses
function requireLogin() {
    if (!isset($_SESSION['user'])) {
        header('Location: login.php');
        exit;
    }
}

function requireAdmin() {
    requireLogin();
    if ($_SESSION['user']['role'] !== 'admin') {
        die('<div style="font-family:sans-serif;padding:40px;color:#991b1b;background:#fef2f2;text-align:center;max-width:500px;margin:80px auto;border-radius:16px;border:1px solid #fecaca;">
            <h2 style="margin-top:0;">Akses Ditolak (403 Forbidden)</h2>
            <p style="font-size:14px;color:#4b5563;">Menu ini dikhususkan bagi Administrator. Operator tidak memiliki wewenang untuk membuka halaman ini.</p>
            <a href="dashboard.php" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#065f46;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:8px;">Kembali ke Dashboard</a>
        </div>');
    }
}
?>
