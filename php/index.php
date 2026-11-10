<?php
require_once 'config.php';

$successMsg = '';
$ticketNo = '';
$submittedData = null;

// Ambil Pengaturan
$stmt = $pdo->query("SELECT kunci, nilai FROM pengaturan");
$settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

$runningTextEnabled = isset($settings['running_text_enabled']) && $settings['running_text_enabled'] == '1';
$runningTextKiosk = $settings['running_text_kiosk'] ?? "Selamat Datang di Kantor Kementerian Agama Kabupaten Lebak. Melayani dengan Ikhlas Beramal.";

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
    $submittedData = [
        'no_antrean' => $no_antrean,
        'nama' => $nama,
        'instansi' => $instansi,
        'unit_tujuan' => $unit_tujuan,
        'hari' => $hari,
        'tanggal' => $tanggal,
        'jam' => $jam
    ];
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SI-TAMU Kemenag Lebak | Kiosk Tamu Digital</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 25s linear infinite;
        }
    </style>
</head>
<body class="relative min-h-screen flex flex-col justify-between text-slate-800 bg-slate-950 overflow-x-hidden selection:bg-emerald-600 selection:text-white">

    <!-- GAMBAR BACKGROUND TRANSPARAN PETUGAS KEMENAG MENYAMBUT -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <!-- Foto Petugas Transparan -->
        <div class="absolute inset-0 bg-cover bg-right-bottom md:bg-[center_right_10%] bg-no-repeat opacity-25 mix-blend-luminosity filter contrast-125 brightness-110" style="background-image: url('assets/kemenag_greeting.png');"></div>
        <!-- Gradient Overlay Deep Emerald -->
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-950/94 via-emerald-900/88 to-slate-950/95"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-black/50"></div>
    </div>

    <!-- MAIN CONTENT WRAPPER -->
    <div class="relative z-10 flex flex-col min-h-screen justify-between">
        
        <!-- Top Running Text -->
        <?php if ($runningTextEnabled): ?>
        <div class="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-500/30 overflow-hidden flex items-center gap-3">
            <span class="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-900 border border-emerald-600/40 text-emerald-300">
                Info Pelayanan
            </span>
            <div class="flex-1 overflow-hidden whitespace-nowrap">
                <div class="animate-marquee">
                    <span class="mr-12 font-medium"><?= htmlspecialchars($runningTextKiosk); ?></span>
                    <span class="mr-12 font-medium opacity-80"><?= htmlspecialchars($runningTextKiosk); ?></span>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- Kiosk Header -->
        <header class="bg-emerald-950/70 backdrop-blur-md border-b border-emerald-500/20 py-4 px-6 md:px-12 shadow-xl">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <img src="assets/logo_kemenag.png" alt="Logo Kemenag" class="h-16 w-auto object-contain drop-shadow">
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">SI-TAMU Kemenag Lebak</h1>
                            <span class="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">KIOSK PTSP</span>
                        </div>
                        <p class="text-xs md:text-sm font-bold text-emerald-300">Kantor Kementerian Agama Kabupaten Lebak</p>
                        <p class="text-[11px] text-emerald-100/80 italic">"Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"</p>
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <div class="text-right bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/15">
                        <div id="liveDate" class="text-[11px] font-semibold text-emerald-200">Memuat tanggal...</div>
                        <div id="liveClock" class="text-xl md:text-2xl font-extrabold font-mono text-white">00:00:00 WIB</div>
                    </div>
                    <a href="login.php" class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition">
                        Portal Petugas
                    </a>
                </div>
            </div>
        </header>

        <!-- Main Workspace: 2-Column Split -->
        <main class="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col justify-center">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Left Column: Welcome & Banner Card -->
                <div className="lg:col-span-5 space-y-6" style="grid-column: span 5 / span 5;">
                    <div class="bg-emerald-950/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-2xl text-white">
                        
                        <!-- Greeting Image Banner -->
                        <div class="relative overflow-hidden rounded-2xl border border-emerald-500/30 mb-5 shadow-lg">
                            <img src="assets/kemenag_greeting.png" alt="Petugas Kemenag Menyambut" class="w-full h-44 object-cover object-top opacity-85">
                            <div class="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent"></div>
                            <div class="absolute bottom-3 left-4 right-4">
                                <span class="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                                    Pelayanan Prima 5S
                                </span>
                                <p class="text-white font-bold text-xs mt-1">Senyum • Salam • Sapa • Sopan • Santun</p>
                            </div>
                        </div>

                        <h2 class="text-2xl font-extrabold text-white">Buku Tamu Digital PTSP</h2>
                        <p class="text-xs text-emerald-100/90 mt-2 leading-relaxed">
                            Silakan mengisi identitas kunjungan Anda secara mandiri untuk kemudahan antrean dan tertib administrasi kedinasan.
                        </p>

                        <!-- Flow Guide -->
                        <div class="mt-5 pt-4 border-t border-emerald-500/30 space-y-3 text-xs">
                            <div class="flex items-start gap-3">
                                <div class="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</div>
                                <div><strong>Isi Formulir Tamu:</strong> Nama, instansi, unit yang dituju, & WhatsApp.</div>
                            </div>
                            <div class="flex items-start gap-3">
                                <div class="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</div>
                                <div><strong>Dapatkan Nomor Antrean:</strong> Sistem otomatis mencatat hari, tanggal, & jam.</div>
                            </div>
                            <div class="flex items-start gap-3">
                                <div class="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">3</div>
                                <div><strong>Layanan & Survei IKM:</strong> Tautan kepuasan dapat dikirim ke nomor WhatsApp Anda.</div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white text-xs space-y-1.5 shadow-lg">
                        <div class="text-emerald-300 font-bold">⏰ Jam Pelayanan PTSP:</div>
                        <p class="text-emerald-100/80 text-[11px]">• Senin - Kamis: 07.30 - 16.00 WIB</p>
                        <p class="text-emerald-100/80 text-[11px]">• Jumat: 07.30 - 16.30 WIB (Istirahat 11.30 - 13.00)</p>
                    </div>
                </div>

                <!-- Right Column: Form -->
                <div className="lg:col-span-7" style="grid-column: span 7 / span 7;">
                    <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden text-slate-800">
                        <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 p-6 text-white flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-bold">Formulir Pendaftaran Tamu PTSP</h3>
                                <p class="text-xs text-emerald-100 mt-0.5">Lengkapi 7 data isian wajib bertanda (*)</p>
                            </div>
                            <span class="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full text-emerald-100">WIB Aktif</span>
                        </div>

                        <form method="POST" action="" class="p-6 md:p-8 space-y-4 text-xs">
                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1">1. Nama Lengkap Tamu *</label>
                                <input type="text" name="nama" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Masukkan nama lengkap beserta gelar jika ada">
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">2. Jenis Kelamin *</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <label class="p-2.5 border rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 font-bold">
                                        <input type="radio" name="gender" value="Pria" checked class="text-emerald-700">
                                        <span>Pria (Laki-laki)</span>
                                    </label>
                                    <label class="p-2.5 border rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 font-bold">
                                        <input type="radio" name="gender" value="Wanita" class="text-emerald-700">
                                        <span>Wanita (Perempuan)</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1">3. Pekerjaan *</label>
                                <select name="pekerjaan" id="pekerjaanSelect" onchange="togglePekerjaanLainnya()" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white cursor-pointer">
                                    <option value="ASN/TNI/POLRI">ASN/TNI/POLRI</option>
                                    <option value="Pegawai BUMN">Pegawai BUMN</option>
                                    <option value="Pegawai swasta">Pegawai swasta</option>
                                    <option value="Wiraswasta">Wiraswasta</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>

                                <!-- Textbox Khusus Penanda Hijau Saat "Lainnya" Dipilih -->
                                <div id="boxPekerjaanLainnya" class="hidden mt-3 p-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                                    <label class="block font-bold text-emerald-950 mb-1">Ketik Nama Pekerjaan Secara Manual *</label>
                                    <input type="text" name="pekerjaan_lainnya" id="inputPekerjaanLainnya" class="w-full px-3 py-2 border border-emerald-400 rounded-lg bg-white text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Contoh: Dosen, Guru Honorer, Pengasuh Pesantren">
                                </div>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1">4. Asal Instansi / Lembaga / Satker / Ormas *</label>
                                <input type="text" name="instansi" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Contoh: KUA Rangkasbitung, Ponpes Al-Falah, Bank BSI, Pribadi">
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1">5. Unit Layanan yang Dituju (12 Unit) *</label>
                                <select name="unit_tujuan" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white cursor-pointer">
                                    <?php foreach ($UNIT_LAYANAN as $unit): ?>
                                        <option value="<?= htmlspecialchars($unit); ?>"><?= htmlspecialchars($unit); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1">6. Maksud / Tujuan / Keperluan Kunjungan *</label>
                                <textarea name="keperluan" rows="2" required class="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Jelaskan ringkasan keperluan Anda"></textarea>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 mb-1">7. No. HP / WhatsApp *</label>
                                <input type="text" name="no_hp" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono" placeholder="Contoh: 081234567890">
                            </div>

                            <div class="pt-2">
                                <button type="submit" name="simpan_tamu" class="w-full py-3.5 bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-black text-sm rounded-xl shadow-lg transition duration-200">
                                    Simpan Data Buku Tamu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </main>

        <!-- Pop up Modal Konfirmasi Tiket Tamu -->
        <?php if ($submittedData): ?>
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-200">
                <div class="bg-emerald-900 text-white p-6 text-center">
                    <h3 class="text-xl font-black">Data Kunjungan Berhasil Disimpan!</h3>
                    <p class="text-xs text-emerald-200 mt-1">Kantor Kementerian Agama Kabupaten Lebak</p>
                </div>
                <div class="p-6 space-y-4 text-xs">
                    <div class="bg-slate-50 border-2 border-dashed border-emerald-400 p-4 rounded-2xl text-center">
                        <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full">NOMOR REGISTRASI</span>
                        <p class="text-3xl font-mono font-black text-emerald-950 mt-2"><?= htmlspecialchars($submittedData['no_antrean']); ?></p>
                        <p class="text-slate-500 mt-1"><?= htmlspecialchars($submittedData['hari'] . ', ' . $submittedData['tanggal'] . ' ' . $submittedData['jam']); ?> WIB</p>
                    </div>
                    <div class="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-1">
                        <div><strong>Nama:</strong> <?= htmlspecialchars($submittedData['nama']); ?></div>
                        <div><strong>Instansi:</strong> <?= htmlspecialchars($submittedData['instansi']); ?></div>
                        <div><strong>Unit Dituju:</strong> <?= htmlspecialchars($submittedData['unit_tujuan']); ?></div>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button onclick="window.print()" class="flex-1 py-2.5 bg-slate-100 border text-slate-700 font-bold rounded-xl">Cetak Tiket</button>
                        <a href="index.php" class="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-center">Tamu Baru</a>
                    </div>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- Footer -->
        <footer class="bg-emerald-950/70 backdrop-blur-md border-t border-emerald-500/20 py-3 px-6 text-center text-xs text-emerald-200/80">
            &copy; <?= date('Y'); ?> Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0 • Melayani dengan Ikhlas Beramal
        </footer>

    </div>

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

        // Live Clock WIB
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
</html>
