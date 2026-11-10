<?php
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
// UTF-8 BOM for Microsoft Excel compatibility
fputs($output, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

fputcsv($output, ['KEMENTERIAN AGAMA REPUBLIK INDONESIA']);
fputcsv($output, ['KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK']);
fputcsv($output, ['LAPORAN DATA KUNJUNGAN BUKU TAMU DIGITAL (SI-TAMU)']);
fputcsv($output, ['Periode: Bulan ' . $bulan . ' Tahun ' . $tahun]);
fputcsv($output, []);

fputcsv($output, ['No', 'No Antrean', 'Hari', 'Tanggal', 'Jam', 'Nama Tamu', 'Gender', 'Pekerjaan', 'Asal Instansi', 'Unit Tujuan', 'Maksud Keperluan', 'No HP', 'Rating Kepuasan', 'Survei WA Terkirim']);

$no = 1;
foreach ($data as $r) {
    $pek = (!empty($r['pekerjaan_lainnya'])) ? $r['pekerjaan_lainnya'] : $r['pekerjaan'];
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
        $r['rating_kepuasan'] ?? '-',
        !empty($r['survey_sent_at']) ? 'Sudah' : 'Belum'
    ]);
}

fclose($output);
exit;
?>
