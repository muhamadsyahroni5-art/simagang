-- ==============================================================
-- DATABASE: db_sitamu_lebak
-- APLIKASI: SI-TAMU Kemenag Lebak (Sistem Informasi Buku Tamu Digital)
-- KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK
-- Siap dijalankan di Laragon & XAMPP (MySQL / MariaDB)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `db_sitamu_lebak` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_sitamu_lebak`;

-- --------------------------------------------------------
-- 1. Tabel users (Admin & Operator)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `role` enum('admin','operator') NOT NULL DEFAULT 'operator',
  `nip` varchar(30) DEFAULT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `unit_kerja` varchar(100) DEFAULT NULL,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password hash default: admin123 ($2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO `users` (`id`, `username`, `password`, `nama`, `role`, `nip`, `jabatan`, `unit_kerja`, `status`) VALUES
(1, 'admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'H. Ajrum Firdaus, S.Ag., M.Si', 'admin', '197405121999031002', 'Kepala Subbag Tata Usaha', 'Subbag TU', 'aktif'),
(2, 'operator', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Siti Nurhaliza, S.Kom', 'operator', '199208152019022005', 'Petugas Front Desk PTSP', 'Subbag Umum dan Kerumahtanggaan', 'aktif');

-- --------------------------------------------------------
-- 2. Tabel tamu (Data Kunjungan Buku Tamu)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `tamu`;
CREATE TABLE `tamu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `no_antrean` varchar(30) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `gender` enum('Pria','Wanita') NOT NULL,
  `pekerjaan` varchar(50) NOT NULL,
  `pekerjaan_lainnya` varchar(100) DEFAULT NULL,
  `instansi` varchar(150) NOT NULL,
  `unit_tujuan` varchar(100) NOT NULL,
  `keperluan` text NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `hari` varchar(20) NOT NULL,
  `tanggal` date NOT NULL,
  `jam` time NOT NULL,
  `rating_kepuasan` tinyint(1) DEFAULT NULL,
  `ulasan_kepuasan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tanggal` (`tanggal`),
  KEY `idx_unit` (`unit_tujuan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tamu` (`no_antrean`, `nama`, `gender`, `pekerjaan`, `pekerjaan_lainnya`, `instansi`, `unit_tujuan`, `keperluan`, `no_hp`, `hari`, `tanggal`, `jam`, `rating_kepuasan`, `ulasan_kepuasan`) VALUES
('TMG-20261107-001', 'Drs. H. Mulyadi, M.Pd', 'Pria', 'ASN/TNI/POLRI', NULL, 'MAN 1 Lebak - Rangkasbitung', 'Seksi Pendidikan Madrasah', 'Koordinasi pencairan Tunjangan Kinerja Guru dan Bantuan Operasional Sekolah (BOS)', '081287654321', 'Jumat', '2026-11-06', '08:15:20', 5, 'Pelayanan sangat ramah, berkas langsung diverifikasi dengan cepat.'),
('TMG-20261107-002', 'Nurul Hidayati, S.Ag', 'Wanita', 'Pegawai swasta', NULL, 'Yayasan Pondok Pesantren Al-Falah Cibadak', 'Seksi Pendidikan Diniyah dan Pondok Pesantren', 'Pembaruan data EMIS dan perpanjangan Izin Operasional Pesantren', '085712349876', 'Jumat', '2026-11-06', '09:05:40', 5, 'Petugas PTSP sangat membantu menjelaskan alur persyaratan izin.'),
('TMG-20261107-003', 'Tubagus Ridwan, S.H', 'Pria', 'Wiraswasta', NULL, 'BMT Berkah Lebak', 'Penyelenggaraan Zakat dan Wakaf', 'Konsultasi sertifikasi tanah wakaf masjid dan kemitraan pemberdayaan zakat', '081399887766', 'Jumat', '2026-11-06', '10:20:15', 4, 'Penjelasan cukup memadai dan transparan.');

-- --------------------------------------------------------
-- 3. Tabel pengaturan (Running text & Sistem)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pengaturan`;
CREATE TABLE `pengaturan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kunci` varchar(50) NOT NULL UNIQUE,
  `nilai` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `pengaturan` (`kunci`, `nilai`) VALUES
('running_text_enabled', '1'),
('running_text_kiosk', 'Selamat Datang di Kantor Kementerian Agama Kabupaten Lebak. Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan. Silakan mengisi Buku Tamu Digital melalui Kiosk ini.'),
('running_text_admin', 'Informasi Resmi: Pelayanan Tatap Muka PTSP Kemenag Lebak dibuka hari kerja pukul 07.30 - 16.00 WIB. Pastikan seluruh kunjungan tamu tercatat secara tertib dan akuntabel.'),
('running_text_speed', '25'),
('running_text_theme', 'emerald'),
('wa_survey_url', 'https://kemenaglebak.com/survei-ikm'),
('wa_message_template', 'Assalamu\'alaikum Wr. Wb. Yth. Bapak/Ibu {nama}, terima kasih telah berkunjung ke Kantor Kemenag Lebak pada {hari}, {tanggal} (No. {no_antrean}). Mohon kesediaan mengisi Survei Kepuasan (IKM): {link_survei}. Terima kasih.');
