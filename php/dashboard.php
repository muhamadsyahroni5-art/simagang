<?php
require_once 'config.php';
requireLogin();

$user = $_SESSION['user'];

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
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col justify-between">

    <!-- Top Navbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="assets/logo_kemenag.png" alt="Logo Kemenag" class="h-10 w-auto">
                <div>
                    <h1 class="text-base font-black text-emerald-950 leading-tight">SI-TAMU Kemenag Lebak</h1>
                    <p class="text-[11px] font-bold text-emerald-700">Kemenag Kabupaten Lebak</p>
                </div>
            </div>

            <nav class="flex items-center gap-2 text-xs font-semibold">
                <a href="dashboard.php" class="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold">Dashboard</a>
                <a href="tamu.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Buku Tamu</a>
                <a href="index.php" target="_blank" class="px-3 py-1.5 text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded-lg">Buka Kiosk</a>
                <?php if ($user['role'] === 'admin'): ?>
                    <a href="laporan.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Report & Cetak</a>
                    <a href="pengaturan.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Setting</a>
                <?php endif; ?>
                <span class="text-slate-300">|</span>
                <span class="text-xs font-bold text-slate-700"><?= htmlspecialchars($user['nama']); ?> (<?= strtoupper($user['role']); ?>)</span>
                <a href="logout.php" class="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold">Keluar</a>
            </nav>
        </div>
    </header>

    <main class="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
            <div>
                <span class="text-[11px] font-bold uppercase tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded text-emerald-300">Panel PTSP Kemenag Lebak</span>
                <h2 class="text-2xl font-black text-white mt-1">Selamat Datang, <?= htmlspecialchars($user['nama']); ?>!</h2>
                <p class="text-xs text-emerald-100 mt-1"><?= htmlspecialchars($user['jabatan']); ?> • NIP: <?= htmlspecialchars($user['nip']); ?> • <?= htmlspecialchars($user['unit_kerja']); ?></p>
            </div>
            <a href="tamu.php" class="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-xs transition">
                + Entri Tamu / Kirim Survei
            </a>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Tamu Hari Ini</p>
                <p class="text-3xl font-extrabold text-emerald-700 font-mono mt-2"><?= number_format($tamuHariIni); ?> <span class="text-xs font-normal text-slate-500">orang</span></p>
                <p class="text-[11px] text-slate-400 mt-1">Tanggal: <?= date('d M Y'); ?></p>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Tamu Bulan Ini</p>
                <p class="text-3xl font-extrabold text-teal-700 font-mono mt-2"><?= number_format($tamuBulanIni); ?> <span class="text-xs font-normal text-slate-500">orang</span></p>
                <p class="text-[11px] text-slate-400 mt-1">Bulan: <?= date('F Y'); ?></p>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Seluruh Tamu</p>
                <p class="text-3xl font-extrabold text-slate-800 font-mono mt-2"><?= number_format($totalTamu); ?> <span class="text-xs font-normal text-slate-500">tercatat</span></p>
                <p class="text-[11px] text-slate-400 mt-1">Basis data buku tamu digital</p>
            </div>
        </div>

        <!-- Recent Guests -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-hidden">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-slate-800">5 Tamu Terakhir yang Berkunjung</h3>
                <a href="tamu.php" class="text-xs font-bold text-emerald-800 hover:underline">Kelola & Kirim Survei →</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 uppercase border-b">
                            <th class="py-2.5 px-3">No Antrean</th>
                            <th class="py-2.5 px-3">Waktu</th>
                            <th class="py-2.5 px-3">Nama Tamu</th>
                            <th class="py-2.5 px-3">Instansi</th>
                            <th class="py-2.5 px-3">Unit Dituju</th>
                            <th class="py-2.5 px-3">Keperluan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($recentGuests as $row): ?>
                        <tr class="hover:bg-slate-50">
                            <td class="py-3 px-3 font-mono font-bold text-emerald-800"><?= htmlspecialchars($row['no_antrean']); ?></td>
                            <td class="py-3 px-3"><?= htmlspecialchars($row['hari'] . ', ' . $row['tanggal'] . ' ' . substr($row['jam'], 0, 5)); ?> WIB</td>
                            <td class="py-3 px-3 font-bold"><?= htmlspecialchars($row['nama']); ?></td>
                            <td class="py-3 px-3"><?= htmlspecialchars($row['instansi']); ?></td>
                            <td class="py-3 px-3 text-emerald-950 font-semibold"><?= htmlspecialchars($row['unit_tujuan']); ?></td>
                            <td class="py-3 px-3 truncate max-w-xs"><?= htmlspecialchars($row['keperluan']); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        &copy; <?= date('Y'); ?> Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0
    </footer>
</body>
</html>
