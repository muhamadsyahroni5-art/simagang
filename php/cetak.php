<?php
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

    <div class="no-print" style="margin-bottom: 20px; background: #f0fdf4; padding: 10px; border: 1px solid #86efac; border-radius: 8px;">
        <button onclick="window.print()" style="padding: 8px 16px; background: #047857; color: #fff; border: none; font-weight: bold; cursor: pointer; border-radius: 6px;">
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
        <?= !empty($unit) ? ' • Unit Layanan: ' . htmlspecialchars($unit) : ' • Seluruh Unit Layanan PTSP'; ?>
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
</html>
