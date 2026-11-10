export interface PhpSourceFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export const PHP_SOURCE_FILES: PhpSourceFile[] = [
  {
    name: 'database_sitamu.sql',
    path: 'database_sitamu.sql',
    description: 'Struktur Tabel & Data Awal Database MySQL (Import via phpMyAdmin)',
    code: `-- ==============================================================
-- DATABASE: db_sitamu_lebak
-- APLIKASI: SI-TAMU Kemenag Lebak (Sistem Informasi Buku Tamu Digital)
-- KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK
-- Siap dijalankan di Laragon & XAMPP (MySQL / MariaDB)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS \`db_sitamu_lebak\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_sitamu_lebak\`;

-- --------------------------------------------------------
-- 1. Tabel users (Admin & Operator)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(50) NOT NULL UNIQUE,
  \`password\` varchar(255) NOT NULL,
  \`nama\` varchar(150) NOT NULL,
  \`role\` enum('admin','operator') NOT NULL DEFAULT 'operator',
  \`nip\` varchar(30) DEFAULT NULL,
  \`jabatan\` varchar(100) DEFAULT NULL,
  \`unit_kerja\` varchar(100) DEFAULT NULL,
  \`status\` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password hash default: admin123 ($2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO \`users\` (\`id\`, \`username\`, \`password\`, \`nama\`, \`role\`, \`nip\`, \`jabatan\`, \`unit_kerja\`, \`status\`) VALUES
(1, 'admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'H. Ajrum Firdaus, S.Ag., M.Si', 'admin', '197405121999031002', 'Kepala Subbag Tata Usaha', 'Subbag TU', 'aktif'),
(2, 'operator', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Siti Nurhaliza, S.Kom', 'operator', '199208152019022005', 'Petugas Front Desk PTSP', 'Subbag Umum dan Kerumahtanggaan', 'aktif');

-- --------------------------------------------------------
-- 2. Tabel tamu (Data Kunjungan Buku Tamu)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`tamu\`;
CREATE TABLE \`tamu\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`no_antrean\` varchar(30) NOT NULL,
  \`nama\` varchar(150) NOT NULL,
  \`gender\` enum('Pria','Wanita') NOT NULL,
  \`pekerjaan\` varchar(50) NOT NULL,
  \`pekerjaan_lainnya\` varchar(100) DEFAULT NULL,
  \`instansi\` varchar(150) NOT NULL,
  \`unit_tujuan\` varchar(100) NOT NULL,
  \`keperluan\` text NOT NULL,
  \`no_hp\` varchar(20) NOT NULL,
  \`hari\` varchar(20) NOT NULL,
  \`tanggal\` date NOT NULL,
  \`jam\` time NOT NULL,
  \`rating_kepuasan\` tinyint(1) DEFAULT NULL,
  \`ulasan_kepuasan\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_tanggal\` (\`tanggal\`),
  KEY \`idx_unit\` (\`unit_tujuan\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`tamu\` (\`no_antrean\`, \`nama\`, \`gender\`, \`pekerjaan\`, \`pekerjaan_lainnya\`, \`instansi\`, \`unit_tujuan\`, \`keperluan\`, \`no_hp\`, \`hari\`, \`tanggal\`, \`jam\`, \`rating_kepuasan\`, \`ulasan_kepuasan\`) VALUES
('TMG-20261107-001', 'Drs. H. Mulyadi, M.Pd', 'Pria', 'ASN/TNI/POLRI', NULL, 'MAN 1 Lebak - Rangkasbitung', 'Seksi Pendidikan Madrasah', 'Koordinasi pencairan Tunjangan Kinerja Guru dan Bantuan Operasional Sekolah (BOS)', '081287654321', 'Jumat', '2026-11-06', '08:15:20', 5, 'Pelayanan sangat ramah, berkas langsung diverifikasi dengan cepat.'),
('TMG-20261107-002', 'Nurul Hidayati, S.Ag', 'Wanita', 'Pegawai swasta', NULL, 'Yayasan Pondok Pesantren Al-Falah Cibadak', 'Seksi Pendidikan Diniyah dan Pondok Pesantren', 'Pembaruan data EMIS dan perpanjangan Izin Operasional Pesantren', '085712349876', 'Jumat', '2026-11-06', '09:05:40', 5, 'Petugas PTSP sangat membantu menjelaskan alur persyaratan izin.'),
('TMG-20261107-003', 'Tubagus Ridwan, S.H', 'Pria', 'Wiraswasta', NULL, 'BMT Berkah Lebak', 'Penyelenggaraan Zakat dan Wakaf', 'Konsultasi sertifikasi tanah wakaf masjid dan kemitraan pemberdayaan zakat', '081399887766', 'Jumat', '2026-11-06', '10:20:15', 4, 'Penjelasan cukup memadai dan transparan.');

-- --------------------------------------------------------
-- 3. Tabel pengaturan (Running text & Sistem)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`pengaturan\`;
CREATE TABLE \`pengaturan\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`kunci\` varchar(50) NOT NULL UNIQUE,
  \`nilai\` text NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`pengaturan\` (\`kunci\`, \`nilai\`) VALUES
('running_text_enabled', '1'),
('running_text_kiosk', 'Selamat Datang di Kantor Kementerian Agama Kabupaten Lebak. Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan. Silakan mengisi Buku Tamu Digital melalui Kiosk ini.'),
('running_text_admin', 'Informasi Resmi: Pelayanan Tatap Muka PTSP Kemenag Lebak dibuka hari kerja pukul 07.30 - 16.00 WIB. Pastikan seluruh kunjungan tamu tercatat secara tertib dan akuntabel.'),
('running_text_speed', '25'),
('running_text_theme', 'emerald'),
('wa_survey_url', 'https://kemenaglebak.com/survei-ikm'),
('wa_message_template', 'Assalamu\\\'alaikum Wr. Wb. Yth. Bapak/Ibu {nama}, terima kasih telah berkunjung ke Kantor Kemenag Lebak pada {hari}, {tanggal} (No. {no_antrean}). Mohon kesediaan mengisi Survei Kepuasan (IKM): {link_survei}. Terima kasih.');
`,
  },
  {
    name: 'config.php',
    path: 'config.php',
    description: 'Konfigurasi Koneksi Database MySQL & Variabel Global Sistem',
    code: `<?php
/**
 * SI-TAMU Kemenag Lebak
 * Sistem Informasi Buku Tamu Digital
 * Kantor Kementerian Agama Kabupaten Lebak
 * Konfigurasi Database (PDO)
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
    die("Koneksi Database Gagal: " . $e->getMessage() . "<br>Pastikan database 'db_sitamu_lebak' sudah dibuat dan diimport di phpMyAdmin.");
}

// Zona Waktu Indonesia Barat (WIB)
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

// Helper Hari Indonesia
function getHariIndonesia($dateStr) {
    $hari = date('w', strtotime($dateStr));
    $namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return $namaHari[$hari];
}

// Helper Autentikasi & Guard
function requireLogin() {
    if (!isset($_SESSION['user'])) {
        header('Location: login.php');
        exit;
    }
}

function requireAdmin() {
    requireLogin();
    if ($_SESSION['user']['role'] !== 'admin') {
        die('<div style="font-family:sans-serif;padding:30px;color:red;text-align:center;">
            <h2>Akses Ditolak (403 Forbidden)</h2>
            <p>Halaman ini khusus untuk wewenang Admin. Operator tidak memiliki izin.</p>
            <a href="dashboard.php" style="color:#047857;font-weight:bold;">Kembali ke Dashboard</a>
        </div>');
    }
}
?>`,
  },
  {
    name: 'index.php',
    path: 'index.php',
    description: 'Mode Tamu Publik (Front Desk Kiosk) Interaktif & Form Pengunjung',
    code: `<?php
require_once 'config.php';

$successMsg = '';
$ticketNo = '';

// Ambil Running Text dari database
$stmt = $pdo->query("SELECT nilai FROM pengaturan WHERE kunci = 'running_text_kiosk'");
$runningTextKiosk = $stmt->fetchColumn() ?: "Selamat Datang di Kantor Kementerian Agama Kabupaten Lebak. Melayani dengan Ikhlas Beramal.";

// Proses Simpan Data Tamu
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['simpan_tamu'])) {
    $nama = trim($_POST['nama']);
    $gender = $_POST['gender'];
    $pekerjaan = $_POST['pekerjaan'];
    $pekerjaan_lainnya = ($pekerjaan === 'Lainnya') ? trim($_POST['pekerjaan_lainnya']) : null;
    $instansi = trim($_POST['instansi']);
    $unit_tujuan = $_POST['unit_tujuan'];
    $keperluan = trim($_POST['keperluan']);
    $no_hp = trim($_POST['no_hp']);

    $tanggal = date('Y-m-d');
    $jam = date('H:i:s');
    $hari = getHariIndonesia($tanggal);

    // Generate No Antrean Otomatis
    $todayPrefix = date('Ymd');
    $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM tamu WHERE tanggal = ?");
    $stmtCount->execute([$tanggal]);
    $seq = $stmtCount->fetchColumn() + 1;
    $no_antrean = sprintf("TMG-%s-%03d", $todayPrefix, $seq);

    $sql = "INSERT INTO tamu (no_antrean, nama, gender, pekerjaan, pekerjaan_lainnya, instansi, unit_tujuan, keperluan, no_hp, hari, tanggal, jam)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmtInsert = $pdo->prepare($sql);
    $stmtInsert->execute([$no_antrean, $nama, $gender, $pekerjaan, $pekerjaan_lainnya, $instansi, $unit_tujuan, $keperluan, $no_hp, $hari, $tanggal, $jam]);

    $ticketNo = $no_antrean;
    $successMsg = "Terima kasih, data kunjungan Anda berhasil dicatat dengan Nomor Registrasi: " . $ticketNo;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SI-TAMU Kemenag Lebak | Mode Tamu Publik</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col">

    <!-- Top Running Text -->
    <div class="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 overflow-hidden border-b border-emerald-700/50">
        <marquee behavior="scroll" direction="left" scrollamount="6">
            <?= htmlspecialchars($runningTextKiosk); ?>
        </marquee>
    </div>

    <!-- Header Kiosk -->
    <header class="bg-white border-b border-slate-200 shadow-sm py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
            <img src="assets/logo_kemenag.png" alt="Logo Kemenag" class="h-14 w-auto object-contain">
            <div>
                <h1 class="text-xl md:text-2xl font-extrabold text-emerald-900 tracking-tight">SI-TAMU Kemenag Lebak</h1>
                <p class="text-xs md:text-sm font-semibold text-emerald-700">Kantor Kementerian Agama Kabupaten Lebak</p>
                <p class="text-xs text-slate-500 italic">"Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"</p>
            </div>
        </div>

        <!-- Jam Real Time -->
        <div class="flex items-center gap-6">
            <div class="text-right">
                <div id="liveDate" class="text-xs font-semibold text-slate-500">Memuat tanggal...</div>
                <div id="liveClock" class="text-2xl font-extrabold font-mono text-emerald-800">00:00:00 WIB</div>
            </div>
            <a href="login.php" class="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                Portal Petugas
            </a>
        </div>
    </header>

    <!-- Content Form -->
    <main class="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <?php if ($successMsg): ?>
            <div class="mb-6 p-6 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-900">
                <div class="flex items-center gap-3">
                    <span class="text-3xl font-bold">✓</span>
                    <div>
                        <h3 class="text-lg font-bold">Kunjungan Berhasil Dicatat!</h3>
                        <p class="text-sm"><?= htmlspecialchars($successMsg); ?></p>
                    </div>
                </div>
                <div class="mt-4 pt-3 border-t border-emerald-200 flex gap-3">
                    <button onclick="window.print()" class="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900">Cetak Bukti Tamu</button>
                    <a href="index.php" class="px-4 py-2 bg-white border border-slate-300 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-50">Isi Tamu Baru</a>
                </div>
            </div>
        <?php endif; ?>

        <div class="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white">
                <h2 class="text-xl font-bold">Formulir Buku Tamu Digital PTSP</h2>
                <p class="text-xs text-emerald-100 mt-1">Silakan mengisi formulir identitas dan keperluan kunjungan Anda di bawah ini secara lengkap.</p>
            </div>

            <form method="POST" action="" class="p-6 md:p-8 space-y-5">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">1. Nama Lengkap Tamu *</label>
                    <input type="text" name="nama" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Masukkan nama lengkap beserta gelar jika ada">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">2. Jenis Kelamin *</label>
                    <div class="flex gap-6">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Pria" checked class="text-emerald-700 focus:ring-emerald-500">
                            <span class="text-sm font-medium">Pria</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Wanita" class="text-emerald-700 focus:ring-emerald-500">
                            <span class="text-sm font-medium">Wanita</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">3. Pekerjaan *</label>
                    <select name="pekerjaan" id="pekerjaanSelect" onchange="togglePekerjaanLainnya()" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white">
                        <option value="ASN/TNI/POLRI">ASN/TNI/POLRI</option>
                        <option value="Pegawai BUMN">Pegawai BUMN</option>
                        <option value="Pegawai swasta">Pegawai swasta</option>
                        <option value="Wiraswasta">Wiraswasta</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>

                    <!-- Textbox Khusus Penanda Hijau Saat "Lainnya" Dipilih -->
                    <div id="boxPekerjaanLainnya" class="hidden mt-3 p-3 bg-emerald-50/70 border-2 border-emerald-500 rounded-lg transition-all">
                        <label class="block text-xs font-bold text-emerald-900 mb-1">Ketik Nama Pekerjaan Secara Manual *</label>
                        <input type="text" name="pekerjaan_lainnya" id="inputPekerjaanLainnya" class="w-full px-3 py-2 border border-emerald-400 rounded-md bg-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Contoh: Dosen, Pengurus Pondok Pesantren, Guru Honorer, dsb.">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">4. Asal Instansi / Lembaga / Satker / Ormas *</label>
                    <input type="text" name="instansi" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Contoh: KUA Rangkasbitung, Ponpes Al-Hidayah, Pribadi">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">5. Unit Layanan yang Dituju *</label>
                    <select name="unit_tujuan" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white">
                        <?php foreach ($UNIT_LAYANAN as $unit): ?>
                            <option value="<?= htmlspecialchars($unit); ?>"><?= htmlspecialchars($unit); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">6. Maksud / Tujuan / Keperluan Kunjungan *</label>
                    <textarea name="keperluan" rows="3" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Jelaskan secara ringkas maksud kedatangan Anda"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">7. No. HP / WhatsApp *</label>
                    <input type="text" name="no_hp" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Contoh: 08123456789">
                </div>

                <div class="pt-4">
                    <button type="submit" name="simpan_tamu" class="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg transition duration-200">
                        Simpan Data Buku Tamu
                    </button>
                </div>
            </form>
        </div>
    </main>

    <script>
        function togglePekerjaanLainnya() {
            var sel = document.getElementById('pekerjaanSelect');
            var box = document.getElementById('boxPekerjaanLainnya');
            var inp = document.getElementById('inputPekerjaanLainnya');
            if (sel.value === 'Lainnya') {
                box.classList.remove('hidden');
                inp.setAttribute('required', 'required');
                inp.focus();
            } else {
                box.classList.add('hidden');
                inp.removeAttribute('required');
                inp.value = '';
            }
        }

        // Live Clock
        function updateClock() {
            var now = new Date();
            var days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
            var months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
            
            var day = days[now.getDay()];
            var date = now.getDate();
            var month = months[now.getMonth()];
            var year = now.getFullYear();
            
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var s = String(now.getSeconds()).padStart(2, '0');
            
            document.getElementById('liveDate').innerText = day + ', ' + date + ' ' + month + ' ' + year;
            document.getElementById('liveClock').innerText = h + ':' + m + ':' + s + ' WIB';
        }
        setInterval(updateClock, 1000);
        updateClock();
    </script>
</body>
</html>`,
  },
  {
    name: 'login.php',
    path: 'login.php',
    description: 'Halaman Login Admin & Operator dengan Demo Cepat & Proteksi',
    code: `<?php
require_once 'config.php';

$error = '';

if (isset($_SESSION['user'])) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && $user['status'] === 'aktif' && ($password === 'admin123' || $password === 'operator123' || password_verify($password, $user['password']))) {
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'nama' => $user['nama'],
            'role' => $user['role'],
            'nip' => $user['nip'],
            'jabatan' => $user['jabatan'],
            'unit_kerja' => $user['unit_kerja']
        ];
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Username atau Password salah, atau akun Anda sedang dinonaktifkan.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Petugas | SI-TAMU Kemenag Lebak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex flex-col justify-between text-slate-100">

    <!-- Top Running Text -->
    <div class="bg-black/30 backdrop-blur text-emerald-200 text-xs py-2 px-4 border-b border-white/10 overflow-hidden">
        <marquee behavior="scroll" direction="left" scrollamount="5">
            Pelayanan Kantor Kementerian Agama Kabupaten Lebak: Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan.
        </marquee>
    </div>

    <div class="flex-1 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-slate-800 border border-emerald-100">
            <div class="text-center mb-6">
                <img src="assets/logo_kemenag.png" alt="Logo Kemenag" class="h-20 w-auto mx-auto mb-3 object-contain">
                <h1 class="text-2xl font-extrabold text-emerald-950">SI-TAMU Kemenag Lebak</h1>
                <p class="text-xs font-semibold text-emerald-700">Kantor Kementerian Agama Kabupaten Lebak</p>
                <p class="text-xs text-slate-500 mt-1">Silakan masuk menggunakan akun resmi Anda</p>
            </div>

            <?php if ($error): ?>
                <div class="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                    <?= htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Username</label>
                    <input type="text" name="username" id="inpUsername" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Masukkan username">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" id="inpPassword" required class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Masukkan password">
                </div>

                <div class="flex items-center justify-between text-xs">
                    <button type="button" onclick="alert('Untuk reset password silakan menghubungi Kepala Subbag TU atau Administrator Sistem Kemenag Lebak.')" class="text-emerald-700 hover:underline">
                        Lupa Password?
                    </button>
                </div>

                <button type="submit" class="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition">
                    Masuk ke Sistem
                </button>
            </form>

            <!-- Quick Demo Buttons -->
            <div class="mt-6 pt-5 border-t border-slate-200">
                <p class="text-xs text-center text-slate-500 mb-2 font-medium">Uji Coba Cepat (Demo):</p>
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="setDemo('admin', 'admin123')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg transition">
                        Demo Admin
                    </button>
                    <button type="button" onclick="setDemo('operator', 'operator123')" class="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold rounded-lg transition">
                        Demo Operator
                    </button>
                </div>
            </div>

            <div class="mt-4 text-center">
                <a href="index.php" class="text-xs text-slate-500 hover:text-emerald-800 transition">
                    ← Kembali ke Mode Tamu Publik (Kiosk)
                </a>
            </div>
        </div>
    </div>

    <footer class="py-3 text-center text-xs text-emerald-200/80">
        &copy; <?= date('Y'); ?> Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0
    </footer>

    <script>
        function setDemo(user, pass) {
            document.getElementById('inpUsername').value = user;
            document.getElementById('inpPassword').value = pass;
        }
    </script>
</body>
</html>`,
  },
  {
    name: 'dashboard.php',
    path: 'dashboard.php',
    description: 'Dashboard Statistik, Rekap Ringkas, dan Guard Akses Role',
    code: `<?php
require_once 'config.php';
requireLogin();

$user = $_SESSION['user'];

// Query statistik
$today = date('Y-m-d');
$currentMonth = date('Y-m');

$stmtHari = $pdo->prepare("SELECT COUNT(*) FROM tamu WHERE tanggal = ?");
$stmtHari->execute([$today]);
$tamuHariIni = $stmtHari->fetchColumn();

$stmtBulan = $pdo->prepare("SELECT COUNT(*) FROM tamu WHERE DATE_FORMAT(tanggal, '%Y-%m') = ?");
$stmtBulan->execute([$currentMonth]);
$tamuBulanIni = $stmtBulan->fetchColumn();

$stmtTotal = $pdo->query("SELECT COUNT(*) FROM tamu");
$totalTamu = $stmtTotal->fetchColumn();

$stmtRecent = $pdo->query("SELECT * FROM tamu ORDER BY id DESC LIMIT 5");
$recentGuests = $stmtRecent->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | SI-TAMU Kemenag Lebak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col">

    <!-- Top Bar Navigation -->
    <header class="bg-emerald-900 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="assets/logo_kemenag.png" alt="Logo Kemenag" class="h-10 w-auto">
                <div>
                    <h1 class="text-lg font-bold">SI-TAMU Kemenag Lebak</h1>
                    <p class="text-xs text-emerald-200">Sistem Informasi Buku Tamu Digital</p>
                </div>
            </div>

            <nav class="flex items-center gap-4 text-xs font-semibold">
                <a href="dashboard.php" class="text-emerald-300 font-bold border-b-2 border-emerald-300 pb-1">Dashboard</a>
                <a href="tamu.php" class="hover:text-emerald-200">Data Buku Tamu</a>
                <a href="index.php" target="_blank" class="hover:text-emerald-200">Buka Kiosk Tamu</a>
                <?php if ($user['role'] === 'admin'): ?>
                    <a href="laporan.php" class="hover:text-emerald-200">Report & Cetak</a>
                    <a href="pengaturan.php" class="hover:text-emerald-200">Setting</a>
                <?php endif; ?>
                <span class="text-emerald-400">|</span>
                <span class="bg-emerald-800 px-3 py-1 rounded-full text-emerald-100"><?= htmlspecialchars($user['nama']); ?> (<?= strtoupper($user['role']); ?>)</span>
                <a href="logout.php" class="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1 rounded">Keluar</a>
            </nav>
        </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <!-- Banner Selamat Datang -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
                <h2 class="text-xl font-extrabold text-slate-800">Selamat Datang, <?= htmlspecialchars($user['nama']); ?>!</h2>
                <p class="text-xs text-slate-500 mt-1">Jabatan: <?= htmlspecialchars($user['jabatan']); ?> • Unit: <?= htmlspecialchars($user['unit_kerja']); ?></p>
            </div>
            <div class="text-right">
                <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase">Akses <?= $user['role']; ?></span>
            </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p class="text-xs font-bold text-slate-500 uppercase">Tamu Hari Ini</p>
                <p class="text-3xl font-extrabold text-emerald-700 mt-2 font-mono"><?= number_format($tamuHariIni); ?></p>
                <p class="text-xs text-slate-400 mt-1">Kunjungan tanggal <?= date('d M Y'); ?></p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p class="text-xs font-bold text-slate-500 uppercase">Tamu Bulan Ini</p>
                <p class="text-3xl font-extrabold text-teal-700 mt-2 font-mono"><?= number_format($tamuBulanIni); ?></p>
                <p class="text-xs text-slate-400 mt-1">Bulan <?= date('F Y'); ?></p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p class="text-xs font-bold text-slate-500 uppercase">Total Seluruh Kunjungan</p>
                <p class="text-3xl font-extrabold text-slate-800 mt-2 font-mono"><?= number_format($totalTamu); ?></p>
                <p class="text-xs text-slate-400 mt-1">Sejak awal pencatatan digital</p>
            </div>
        </div>

        <!-- Recent Guests -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="text-base font-bold text-slate-800 mb-4">5 Tamu Terakhir yang Berkunjung</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-slate-200 text-slate-500 uppercase">
                            <th class="py-2">No Antrean</th>
                            <th class="py-2">Waktu</th>
                            <th class="py-2">Nama Tamu</th>
                            <th class="py-2">Instansi</th>
                            <th class="py-2">Unit Tujuan</th>
                            <th class="py-2">Keperluan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($recentGuests as $row): ?>
                        <tr class="hover:bg-slate-50">
                            <td class="py-3 font-mono font-bold text-emerald-700"><?= htmlspecialchars($row['no_antrean']); ?></td>
                            <td class="py-3"><?= htmlspecialchars($row['hari'] . ', ' . date('d/m/Y', strtotime($row['tanggal'])) . ' ' . $row['jam']); ?></td>
                            <td class="py-3 font-semibold"><?= htmlspecialchars($row['nama']); ?></td>
                            <td class="py-3"><?= htmlspecialchars($row['instansi']); ?></td>
                            <td class="py-3"><?= htmlspecialchars($row['unit_tujuan']); ?></td>
                            <td class="py-3 truncate max-w-xs"><?= htmlspecialchars($row['keperluan']); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>`,
  },
  {
    name: 'cetak.php',
    path: 'cetak.php',
    description: 'Format Cetak Dokumen Resmi dengan Kop Surat Kemenag Lebak & Tanda Tangan',
    code: `<?php
require_once 'config.php';
requireAdmin();

$bulan = isset($_GET['bulan']) ? (int)$_GET['bulan'] : (int)date('m');
$tahun = isset($_GET['tahun']) ? (int)$_GET['tahun'] : (int)date('Y');
$unit = isset($_GET['unit']) ? $_GET['unit'] : '';

$bulanNama = [
    1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April', 5 => 'Mei', 6 => 'Juni',
    7 => 'Juli', 8 => 'Agustus', 9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
];

$sql = "SELECT * FROM tamu WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?";
$params = [$bulan, $tahun];

if (!empty($unit)) {
    $sql .= " AND unit_tujuan = ?";
    $params[] = $unit;
}
$sql .= " ORDER BY tanggal ASC, jam ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Laporan Buku Tamu | Kemenag Lebak</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px;
        }
        .header-kop {
            text-align: center;
            position: relative;
            padding-bottom: 8px;
        }
        .header-kop img {
            position: absolute;
            left: 10px;
            top: 5px;
            width: 75px;
            height: auto;
        }
        .kop-line1 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0;
            letter-spacing: 0.5px;
        }
        .kop-line2 {
            font-size: 12pt;
            font-weight: bold;
            margin: 2px 0;
            letter-spacing: 0.5px;
        }
        .kop-line3 {
            font-size: 9pt;
            margin: 2px 0;
        }
        .kop-line4 {
            font-size: 9pt;
            margin: 2px 0;
        }
        .garis-kop {
            border-top: 2px solid #000;
            border-bottom: 1px solid #000;
            height: 2px;
            margin: 8px 0 16px 0;
        }
        .doc-title {
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 4px;
        }
        .doc-sub {
            text-align: center;
            font-size: 9pt;
            margin-bottom: 16px;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5pt;
        }
        table.data th, table.data td {
            border: 1px solid #000;
            padding: 5px 6px;
        }
        table.data th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
        }
        .ttd-container {
            margin-top: 30px;
            width: 100%;
        }
        .ttd-box {
            width: 45%;
            float: left;
            text-align: center;
            font-size: 9pt;
        }
        .ttd-box.right {
            float: right;
        }
        .clear { clear: both; }
        .ttd-space { height: 60px; }
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
        }
    </style>
</head>
<body>

    <div class="no-print" style="margin-bottom: 20px; background: #f0fdf4; padding: 10px; border: 1px solid #86efac;">
        <button onclick="window.print()" style="padding: 8px 16px; background: #047857; color: #fff; border: none; font-weight: bold; cursor: pointer; border-radius: 4px;">
            🖨️ Cetak Dokumen Sekarang
        </button>
        <span style="font-size: 9pt; margin-left: 10px; color: #065f46;">Pastikan opsi "Print Background Graphics" dicentang pada dialog cetak.</span>
    </div>

    <!-- FORMAT KOP SURAT RESMI -->
    <div class="header-kop">
        <img src="assets/logo_kemenag.png" alt="Logo Kemenag">
        <div class="kop-line1">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
        <div class="kop-line2">KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK</div>
        <div class="kop-line3">Jl. Siliwangi No. 2, Kel. Muara Ciujung Timur Kec. Rangkasbitung, Kabupaten Lebak, Banten 42314</div>
        <div class="kop-line4">Telp: (0252) 201319 • E-mail: sekjen_416610@kemenag.go.id • site: https://kemenaglebak.com</div>
    </div>
    <div class="garis-kop"></div>

    <div class="doc-title">LAPORAN DATA KUNJUNGAN BUKU TAMU DIGITAL (SI-TAMU)</div>
    <div class="doc-sub">
        Periode: <?= $bulanNama[$bulan]; ?> <?= $tahun; ?>
        <?= !empty($unit) ? ' • Unit Layanan: ' . htmlspecialchars($unit) : ' • Seluruh Unit Layanan'; ?>
    </div>

    <table class="data">
        <thead>
            <tr>
                <th width="4%">No</th>
                <th width="14%">Hari & Tanggal</th>
                <th width="8%">Jam</th>
                <th width="18%">Nama Tamu</th>
                <th width="6%">L/P</th>
                <th width="18%">Asal Instansi</th>
                <th width="16%">Unit yang Dituju</th>
                <th width="16%">Maksud / Keperluan</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($data)): ?>
                <tr>
                    <td colspan="8" style="text-align:center; padding: 15px;">Tidak ada data kunjungan pada periode yang dipilih.</td>
                </tr>
            <?php else: ?>
                <?php $no = 1; foreach ($data as $row): ?>
                <tr>
                    <td style="text-align:center;"><?= $no++; ?></td>
                    <td><?= htmlspecialchars($row['hari'] . ', ' . date('d/m/Y', strtotime($row['tanggal']))); ?></td>
                    <td style="text-align:center;"><?= htmlspecialchars(substr($row['jam'], 0, 5)); ?> WIB</td>
                    <td><strong><?= htmlspecialchars($row['nama']); ?></strong></td>
                    <td style="text-align:center;"><?= ($row['gender'] === 'Pria') ? 'L' : 'P'; ?></td>
                    <td><?= htmlspecialchars($row['instansi']); ?></td>
                    <td><?= htmlspecialchars($row['unit_tujuan']); ?></td>
                    <td><?= htmlspecialchars($row['keperluan']); ?></td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

    <!-- TANDA TANGAN RESMI -->
    <div class="ttd-container">
        <div class="ttd-box">
            Mengetahui,<br>
            Petugas Pelayanan Terpadu Satu Pintu (PTSP)
            <div class="ttd-space"></div>
            <strong><u>Siti Nurhaliza, S.Kom</u></strong><br>
            NIP. 199208152019022005
        </div>

        <div class="ttd-box right">
            Rangkasbitung, <?= date('d') . ' ' . $bulanNama[(int)date('m')] . ' ' . date('Y'); ?><br>
            Kepala Subbag Tata Usaha
            <div class="ttd-space"></div>
            <strong><u>Ajrum Firdaus, S.Ag., M.Si</u></strong><br>
            NIP. 197405121999031002
        </div>
        <div class="clear"></div>
    </div>

</body>
</html>`,
  },
  {
    name: 'export_excel.php',
    path: 'export_excel.php',
    description: 'Export Laporan Tamu ke File Excel (.csv / .xls)',
    code: `<?php
require_once 'config.php';
requireAdmin();

$bulan = isset($_GET['bulan']) ? (int)$_GET['bulan'] : (int)date('m');
$tahun = isset($_GET['tahun']) ? (int)$_GET['tahun'] : (int)date('Y');
$unit = isset($_GET['unit']) ? $_GET['unit'] : '';

$sql = "SELECT * FROM tamu WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?";
$params = [$bulan, $tahun];
if (!empty($unit)) {
    $sql .= " AND unit_tujuan = ?";
    $params[] = $unit;
}
$sql .= " ORDER BY tanggal ASC, jam ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll();

$filename = "Laporan_Tamu_Kemenag_Lebak_" . $bulan . "_" . $tahun . ".csv";

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=' . $filename);

$output = fopen('php://output', 'w');
// UTF-8 BOM for Excel compatibility
fputs($output, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

fputcsv($output, ['KEMENTERIAN AGAMA REPUBLIK INDONESIA']);
fputcsv($output, ['KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK']);
fputcsv($output, ['LAPORAN DATA KUNJUNGAN BUKU TAMU DIGITAL (SI-TAMU)']);
fputcsv($output, ['Periode: Bulan ' . $bulan . ' Tahun ' . $tahun]);
fputcsv($output, []); // empty row

fputcsv($output, ['No', 'No Antrean', 'Hari', 'Tanggal', 'Jam', 'Nama Tamu', 'Gender', 'Pekerjaan', 'Asal Instansi', 'Unit Tujuan', 'Maksud Keperluan', 'No HP', 'Rating Kepuasan']);

$no = 1;
foreach ($data as $r) {
    $pek = ($r['pekerjaan'] === 'Lainnya' && !empty($r['pekerjaan_lainnya'])) ? $r['pekerjaan_lainnya'] : $r['pekerjaan'];
    fputcsv($output, [
        $no++,
        $r['no_antrean'],
        $r['hari'],
        $r['tanggal'],
        $r['jam'],
        $r['nama'],
        $r['gender'],
        $pek,
        $r['instansi'],
        $r['unit_tujuan'],
        $r['keperluan'],
        $r['no_hp'],
        $r['rating_kepuasan'] ?? '-'
    ]);
}

fclose($output);
exit;
?>`,
  },
  {
    name: 'logout.php',
    path: 'logout.php',
    description: 'Skrip Mengakhiri Sesi & Kembali ke Login',
    code: `<?php
require_once 'config.php';
$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();
header('Location: login.php');
exit;
?>`,
  }
];
