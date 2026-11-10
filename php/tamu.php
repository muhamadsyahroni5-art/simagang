<?php
require_once 'config.php';
requireLogin();

$user = $_SESSION['user'];

// Ambil Template Survei WA
$stmtWa = $pdo->query("SELECT nilai FROM pengaturan WHERE kunci = 'wa_survey_url'");
$surveyUrl = $stmtWa->fetchColumn() ?: "https://kemenaglebak.com/survei-ikm";

$stmtTpl = $pdo->query("SELECT nilai FROM pengaturan WHERE kunci = 'wa_message_template'");
$surveyTpl = $stmtTpl->fetchColumn() ?: "Assalamu'alaikum Wr. Wb. Yth. Bapak/Ibu {nama}, terima kasih atas kunjungan Anda ke Kantor Kemenag Lebak pada {hari}, {tanggal} ({no_antrean}). Mohon kesediaan mengisi Survei Kepuasan (IKM): {link_survei}. Terima kasih.";

// Tandai Survei Terkirim jika aksi diklik
if (isset($_GET['mark_sent'])) {
    $guestId = (int)$_GET['mark_sent'];
    $stmtMark = $pdo->prepare("UPDATE tamu SET survey_sent_at = NOW() WHERE id = ?");
    $stmtMark->execute([$guestId]);
    header('Location: tamu.php');
    exit;
}

// Pencarian
$search = isset($_GET['q']) ? trim($_GET['q']) : '';
if (!empty($search)) {
    $stmt = $pdo->prepare("SELECT * FROM tamu WHERE nama LIKE ? OR instansi LIKE ? OR no_antrean LIKE ? ORDER BY id DESC");
    $stmt->execute(["%$search%", "%$search%", "%$search%"]);
} else {
    $stmt = $pdo->query("SELECT * FROM tamu ORDER BY id DESC");
}
$guests = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Buku Tamu & Kirim Survei | SI-TAMU Kemenag Lebak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col justify-between">

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
                <a href="dashboard.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Dashboard</a>
                <a href="tamu.php" class="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold">Buku Tamu</a>
                <a href="index.php" target="_blank" class="px-3 py-1.5 text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded-lg">Buka Kiosk</a>
                <?php if ($user['role'] === 'admin'): ?>
                    <a href="laporan.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Report & Cetak</a>
                    <a href="pengaturan.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Setting</a>
                <?php endif; ?>
                <span class="text-slate-300">|</span>
                <span class="text-xs font-bold text-slate-700"><?= htmlspecialchars($user['nama']); ?></span>
                <a href="logout.php" class="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold">Keluar</a>
            </nav>
        </div>
    </header>

    <main class="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h2 class="text-lg font-bold text-slate-900">Data Buku Tamu & Aksi Kirim Survei WhatsApp</h2>
                    <p class="text-xs text-slate-500">Klik tombol "Kirim Survei" untuk mengirimkan pesan WhatsApp otomatis ke nomor tamu</p>
                </div>
                <div class="flex gap-2">
                    <form method="GET" action="" class="flex gap-2">
                        <input type="text" name="q" value="<?= htmlspecialchars($search); ?>" placeholder="Cari nama / instansi..." class="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600">
                        <button type="submit" class="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold">Cari</button>
                    </form>
                </div>
            </div>

            <div class="overflow-x-auto mt-4">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="bg-slate-50 text-slate-600 uppercase border-b">
                            <th class="py-3 px-3">No Antrean</th>
                            <th class="py-3 px-3">Waktu</th>
                            <th class="py-3 px-3">Nama Tamu</th>
                            <th class="py-3 px-3">L/P</th>
                            <th class="py-3 px-3">Pekerjaan</th>
                            <th class="py-3 px-3">Instansi</th>
                            <th class="py-3 px-3">Unit Dituju</th>
                            <th class="py-3 px-3">No. WhatsApp</th>
                            <th class="py-3 px-3 text-center">Status Survei</th>
                            <th class="py-3 px-3 text-center">Aksi Layanan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php if (empty($guests)): ?>
                            <tr>
                                <td colspan="10" class="py-8 text-center text-slate-400">Belum ada data kunjungan tamu.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($guests as $row): 
                                // Clean phone
                                $cleanPhone = preg_replace('/[^0-9]/', '', $row['no_hp']);
                                if (strpos($cleanPhone, '0') === 0) {
                                    $cleanPhone = '62' . substr($cleanPhone, 1);
                                } elseif (strpos($cleanPhone, '62') !== 0) {
                                    $cleanPhone = '62' . $cleanPhone;
                                }

                                // Personalize WA message
                                $waMsg = str_replace(
                                    ['{nama}', '{no_antrean}', '{hari}', '{tanggal}', '{unit_tujuan}', '{link_survei}'],
                                    [$row['nama'], $row['no_antrean'], $row['hari'], $row['tanggal'], $row['unit_tujuan'], $surveyUrl],
                                    $surveyTpl
                                );
                                $waUrl = "https://api.whatsapp.com/send?phone=" . $cleanPhone . "&text=" . urlencode($waMsg);
                            ?>
                            <tr class="hover:bg-slate-50">
                                <td class="py-3 px-3 font-mono font-bold text-emerald-800"><?= htmlspecialchars($row['no_antrean']); ?></td>
                                <td class="py-3 px-3 whitespace-nowrap"><?= htmlspecialchars($row['hari'] . ', ' . $row['tanggal']); ?></td>
                                <td class="py-3 px-3 font-bold"><?= htmlspecialchars($row['nama']); ?></td>
                                <td class="py-3 px-3"><?= ($row['gender'] === 'Pria') ? 'L' : 'P'; ?></td>
                                <td class="py-3 px-3"><?= htmlspecialchars(!empty($row['pekerjaan_lainnya']) ? $row['pekerjaan_lainnya'] : $row['pekerjaan']); ?></td>
                                <td class="py-3 px-3"><?= htmlspecialchars($row['instansi']); ?></td>
                                <td class="py-3 px-3 text-emerald-950 font-semibold"><?= htmlspecialchars($row['unit_tujuan']); ?></td>
                                <td class="py-3 px-3 font-mono"><?= htmlspecialchars($row['no_hp']); ?></td>
                                <td class="py-3 px-3 text-center">
                                    <?php if (!empty($row['survey_sent_at'])): ?>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Terkirim WA ✓</span>
                                    <?php else: ?>
                                        <span class="text-[10px] text-slate-400">Belum Dikirim</span>
                                    <?php endif; ?>
                                </td>
                                <td class="py-3 px-3 text-center">
                                    <a href="<?= $waUrl; ?>" target="_blank" onclick="setTimeout(function(){ window.location.href='tamu.php?mark_sent=<?= $row['id']; ?>'; }, 1000);" class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition">
                                        Kirim Survei WA
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
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
