<?php
require_once 'config.php';
requireAdmin();

$user = $_SESSION['user'];
$successMsg = '';

// Simpan Pengaturan Sistem & Survei WA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['simpan_pengaturan'])) {
    $rtEnabled = isset($_POST['running_text_enabled']) ? '1' : '0';
    $rtKiosk = trim($_POST['running_text_kiosk']);
    $rtAdmin = trim($_POST['running_text_admin']);
    $rtSpeed = (int)$_POST['running_text_speed'];
    $rtTheme = $_POST['running_text_theme'];
    $waUrl = trim($_POST['wa_survey_url']);
    $waTpl = trim($_POST['wa_message_template']);

    $updates = [
        'running_text_enabled' => $rtEnabled,
        'running_text_kiosk' => $rtKiosk,
        'running_text_admin' => $rtAdmin,
        'running_text_speed' => $rtSpeed,
        'running_text_theme' => $rtTheme,
        'wa_survey_url' => $waUrl,
        'wa_message_template' => $waTpl
    ];

    $stmtUp = $pdo->prepare("INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?) ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
    foreach ($updates as $k => $v) {
        $stmtUp->execute([$k, $v]);
    }
    $successMsg = 'Pengaturan sistem, running text, dan template survei WhatsApp berhasil disimpan!';
}

// Ambil Seluruh Pengaturan
$stmt = $pdo->query("SELECT kunci, nilai FROM pengaturan");
$settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

// Ambil Daftar Pengguna
$stmtUsers = $pdo->query("SELECT * FROM users ORDER BY id ASC");
$usersList = $stmtUsers->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setting Sistem | SI-TAMU Kemenag Lebak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
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
                <a href="tamu.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Buku Tamu</a>
                <a href="index.php" target="_blank" class="px-3 py-1.5 text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded-lg">Buka Kiosk</a>
                <a href="laporan.php" class="px-3 py-1.5 text-slate-600 hover:text-emerald-900 rounded-lg">Report & Cetak</a>
                <a href="pengaturan.php" class="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold">Setting</a>
                <span class="text-slate-300">|</span>
                <span class="text-xs font-bold text-slate-700"><?= htmlspecialchars($user['nama']); ?></span>
                <a href="logout.php" class="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold">Keluar</a>
            </nav>
        </div>
    </header>

    <main class="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">
        <?php if ($successMsg): ?>
            <div class="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
                <strong>✓ Berhasil:</strong> <?= htmlspecialchars($successMsg); ?>
            </div>
        <?php endif; ?>

        <!-- Form Pengaturan -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h2 class="text-base font-bold text-slate-900 mb-1">Pengaturan Running Text & Survei WhatsApp (IKM)</h2>
            <p class="text-xs text-slate-500 mb-6">Atur pengumuman kedinasan dan template ucapan WhatsApp ke nomor tamu</p>

            <form method="POST" action="" class="space-y-5 text-xs">
                
                <!-- WhatsApp Survey Section -->
                <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
                    <h3 class="font-bold text-emerald-950 text-sm flex items-center gap-2">
                        <span>📲 Konfigurasi Pesan WhatsApp & Tautan Survei IKM</span>
                    </h3>
                    <div>
                        <label class="block font-bold uppercase text-slate-700 mb-1">1. Link / URL Tautan Survei Kepuasan (IKM) *</label>
                        <input type="url" name="wa_survey_url" required value="<?= htmlspecialchars($settings['wa_survey_url'] ?? 'https://kemenaglebak.com/survei-ikm'); ?>" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono" placeholder="https://...">
                    </div>
                    <div>
                        <label class="block font-bold uppercase text-slate-700 mb-1">2. Template Ucapan & Pesan WhatsApp ke Nomor Tamu *</label>
                        <textarea name="wa_message_template" rows="5" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white leading-relaxed"><?= htmlspecialchars($settings['wa_message_template'] ?? ''); ?></textarea>
                        <p class="text-[11px] text-slate-500 mt-1">Tag otomatis yang tersedia: <code>{nama}</code>, <code>{no_antrean}</code>, <code>{hari}</code>, <code>{tanggal}</code>, <code>{unit_tujuan}</code>, <code>{link_survei}</code></p>
                    </div>
                </div>

                <!-- Running Text Section -->
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <h3 class="font-bold text-slate-800 text-sm">📢 Pengaturan Informasi Running Text</h3>
                    <div class="flex items-center gap-3">
                        <input type="checkbox" name="running_text_enabled" id="rtEn" value="1" <?= (isset($settings['running_text_enabled']) && $settings['running_text_enabled'] == '1') ? 'checked' : ''; ?> class="w-4 h-4 text-emerald-700">
                        <label for="rtEn" class="font-bold text-slate-800">Aktifkan Teks Berjalan di Layar</label>
                    </div>
                    <div>
                        <label class="block font-bold uppercase text-slate-700 mb-1">Pesan Teks Kiosk Tamu</label>
                        <input type="text" name="running_text_kiosk" value="<?= htmlspecialchars($settings['running_text_kiosk'] ?? ''); ?>" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white">
                    </div>
                    <div>
                        <label class="block font-bold uppercase text-slate-700 mb-1">Pesan Teks Admin / Operator</label>
                        <input type="text" name="running_text_admin" value="<?= htmlspecialchars($settings['running_text_admin'] ?? ''); ?>" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold uppercase text-slate-700 mb-1">Kecepatan Putaran (Detik)</label>
                            <input type="number" name="running_text_speed" value="<?= htmlspecialchars($settings['running_text_speed'] ?? '25'); ?>" min="10" max="60" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white">
                        </div>
                        <div>
                            <label class="block font-bold uppercase text-slate-700 mb-1">Tema Warna</label>
                            <select name="running_text_theme" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white">
                                <option value="emerald" <?= (($settings['running_text_theme'] ?? '') === 'emerald') ? 'selected' : ''; ?>>Emerald Kemenag</option>
                                <option value="dark" <?= (($settings['running_text_theme'] ?? '') === 'dark') ? 'selected' : ''; ?>>Dark Executive</option>
                                <option value="gold" <?= (($settings['running_text_theme'] ?? '') === 'gold') ? 'selected' : ''; ?>>Gold Amber</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button type="submit" name="simpan_pengaturan" class="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition">
                    Simpan Pengaturan
                </button>
            </form>
        </div>

        <!-- Tabel Pengguna -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 class="text-base font-bold text-slate-900 mb-1">Daftar Akun Pengguna (Admin & Operator)</h3>
            <p class="text-xs text-slate-500 mb-4">Pengguna terdaftar di database MySQL</p>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="bg-slate-50 border-b text-slate-600 uppercase">
                            <th class="py-2.5 px-3">Nama Lengkap</th>
                            <th class="py-2.5 px-3">Username</th>
                            <th class="py-2.5 px-3">Role</th>
                            <th class="py-2.5 px-3">NIP</th>
                            <th class="py-2.5 px-3">Jabatan</th>
                            <th class="py-2.5 px-3">Unit Kerja</th>
                            <th class="py-2.5 px-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($usersList as $u): ?>
                        <tr class="hover:bg-slate-50">
                            <td class="py-3 px-3 font-bold"><?= htmlspecialchars($u['nama']); ?></td>
                            <td class="py-3 px-3 font-mono font-bold text-emerald-800"><?= htmlspecialchars($u['username']); ?></td>
                            <td class="py-3 px-3 uppercase text-[10px] font-bold"><?= htmlspecialchars($u['role']); ?></td>
                            <td class="py-3 px-3 font-mono"><?= htmlspecialchars($u['nip'] ?? '-'); ?></td>
                            <td class="py-3 px-3"><?= htmlspecialchars($u['jabatan']); ?></td>
                            <td class="py-3 px-3"><?= htmlspecialchars($u['unit_kerja']); ?></td>
                            <td class="py-3 px-3 text-center">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= ($u['status'] === 'aktif') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'; ?>">
                                    <?= strtoupper($u['status']); ?>
                                </span>
                            </td>
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
