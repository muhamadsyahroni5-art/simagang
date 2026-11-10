import { Guest, User, RunningTextConfig, PekerjaanCategory } from '../types';

export const UNIT_LAYANAN_LIST: string[] = [
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
  'Seksi Pendidikan Diniyah dan Pondok Pesantren',
];

export const PEKERJAAN_OPTIONS: PekerjaanCategory[] = [
  'ASN/TNI/POLRI',
  'Pegawai BUMN',
  'Pegawai swasta',
  'Wiraswasta',
  'Lainnya',
];

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAY_NAMES: Record<number, string> = {
  0: 'Minggu',
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
};

export const DEFAULT_RUNNING_TEXT: RunningTextConfig = {
  enabled: true,
  text_kiosk: 'Selamat Datang di Kantor Kementerian Agama Kabupaten Lebak. Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan. Silakan mengisi Buku Tamu Digital melalui Kiosk ini.',
  text_admin: 'Informasi Resmi: Pelayanan Tatap Muka PTSP Kemenag Lebak dibuka hari kerja pukul 07.30 - 16.00 WIB. Pastikan seluruh kunjungan tamu tercatat secara tertib dan akuntabel.',
  speed_seconds: 25,
  theme: 'emerald',
};

export const DEFAULT_WA_SURVEY_CONFIG = {
  survey_url: 'https://kemenaglebak.com/survei-ikm',
  wa_message_template: `Assalamu'alaikum Wr. Wb. / Salam Sejahtera,

Yth. Bapak/Ibu *{nama}*,

Terima kasih atas kunjungan Anda ke *Kantor Kementerian Agama Kabupaten Lebak* pada hari *{hari}, {tanggal}* (No. Registrasi: *{no_antrean}*) untuk keperluan pada unit layanan *{unit_tujuan}*.

Sesuai komitmen moto kami: *"Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"*, kami sangat mengharapkan kesediaan Bapak/Ibu meluangkan waktu sejenak (1-2 menit) untuk mengisi *Survei Kepuasan Masyarakat (IKM)* melalui tautan resmi berikut:

👉 *{link_survei}*

Ulasan, kritik, dan saran Bapak/Ibu sangat berharga demi peningkatan mutu pelayanan kami. Terima kasih atas partisipasi dan kerjasamanya.

Wassalamu'alaikum Wr. Wb.
*Pelayanan Terpadu Satu Pintu (PTSP)*
*Kantor Kementerian Agama Kabupaten Lebak*`,
};

export function buildWhatsAppSurveyUrl(
  phone: string,
  guest: { nama: string; no_antrean: string; hari: string; tanggal: string; unit_tujuan: string },
  surveyConfig: { survey_url: string; wa_message_template: string }
): { url: string; text: string; cleanPhone: string } {
  // Clean phone number: remove spaces, dashes, parentheses
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }

  // Replace placeholders
  const text = surveyConfig.wa_message_template
    .replace(/{nama}/g, guest.nama)
    .replace(/{no_antrean}/g, guest.no_antrean)
    .replace(/{hari}/g, guest.hari)
    .replace(/{tanggal}/g, guest.tanggal)
    .replace(/{unit_tujuan}/g, guest.unit_tujuan)
    .replace(/{link_survei}/g, surveyConfig.survey_url);

  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?phone=${clean}&text=${encoded}`;

  return { url, text, cleanPhone: clean };
}

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'admin123',
    nama: 'H. Ajrum Firdaus, S.Ag., M.Si',
    role: 'admin',
    nip: '197405121999031002',
    jabatan: 'Kepala Subbag Tata Usaha',
    unit_kerja: 'Subbag TU',
    status: 'aktif',
  },
  {
    id: 'usr-2',
    username: 'operator',
    password: 'operator123',
    nama: 'Siti Nurhaliza, S.Kom',
    role: 'operator',
    nip: '199208152019022005',
    jabatan: 'Petugas Front Desk PTSP',
    unit_kerja: 'Subbag Umum dan Kerumahtanggaan',
    status: 'aktif',
  },
  {
    id: 'usr-3',
    username: 'ahmad.z',
    password: 'password123',
    nama: 'Ahmad Zulfikar, S.H.I',
    role: 'operator',
    nip: '198803102014031001',
    jabatan: 'Operator Pelayanan Bimas Islam',
    unit_kerja: 'Seksi Bimas Islam',
    status: 'aktif',
  },
  {
    id: 'usr-4',
    username: 'dewi.safitri',
    password: 'password123',
    nama: 'Dewi Safitri, M.Pd',
    role: 'operator',
    nip: '199011242018012003',
    jabatan: 'Staff Pendidikan Madrasah',
    unit_kerja: 'Seksi Pendidikan Madrasah',
    status: 'nonaktif',
  },
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'guest-1',
    no_antrean: 'TMG-20261107-001',
    nama: 'Drs. H. Mulyadi, M.Pd',
    gender: 'Pria',
    pekerjaan: 'ASN/TNI/POLRI',
    instansi: 'MAN 1 Lebak - Rangkasbitung',
    unit_tujuan: 'Seksi Pendidikan Madrasah',
    keperluan: 'Koordinasi pencairan Tunjangan Kinerja Guru dan Bantuan Operasional Sekolah (BOS)',
    no_hp: '081287654321',
    hari: 'Jumat',
    tanggal: '2026-11-06',
    jam: '08:15:20',
    rating_kepuasan: 5,
    ulasan_kepuasan: 'Pelayanan sangat ramah, berkas langsung diverifikasi dengan cepat.',
    created_at: '2026-11-06T08:15:20.000Z',
  },
  {
    id: 'guest-2',
    no_antrean: 'TMG-20261107-002',
    nama: 'Nurul Hidayati, S.Ag',
    gender: 'Wanita',
    pekerjaan: 'Pegawai swasta',
    instansi: 'Yayasan Pondok Pesantren Al-Falah Cibadak',
    unit_tujuan: 'Seksi Pendidikan Diniyah dan Pondok Pesantren',
    keperluan: 'Pembaruan data EMIS dan perpanjangan Izin Operasional Pesantren',
    no_hp: '085712349876',
    hari: 'Jumat',
    tanggal: '2026-11-06',
    jam: '09:05:40',
    rating_kepuasan: 5,
    ulasan_kepuasan: 'Petugas PTSP sangat membantu menjelaskan alur persyaratan izin.',
    created_at: '2026-11-06T09:05:40.000Z',
  },
  {
    id: 'guest-3',
    no_antrean: 'TMG-20261107-003',
    nama: 'Tubagus Ridwan, S.H',
    gender: 'Pria',
    pekerjaan: 'Wiraswasta',
    instansi: 'Baitul Maal Wa Tamwil (BMT) Berkah Lebak',
    unit_tujuan: 'Penyelenggaraan Zakat dan Wakaf',
    keperluan: 'Konsultasi sertifikasi tanah wakaf masjid dan kemitraan pemberdayaan zakat',
    no_hp: '081399887766',
    hari: 'Jumat',
    tanggal: '2026-11-06',
    jam: '10:20:15',
    rating_kepuasan: 4,
    ulasan_kepuasan: 'Penjelasan cukup memadai dan transparan.',
    created_at: '2026-11-06T10:20:15.000Z',
  },
  {
    id: 'guest-4',
    no_antrean: 'TMG-20261107-004',
    nama: 'Sri Wahyuningsih, S.E',
    gender: 'Wanita',
    pekerjaan: 'Pegawai BUMN',
    instansi: 'PT Bank Syariah Indonesia (BSI) KCP Rangkasbitung',
    unit_tujuan: 'Subbag Keuangan dan BMN',
    keperluan: 'Rekonsiliasi rekening penampungan dan gaji ASN Kemenag Lebak',
    no_hp: '081905544332',
    hari: 'Jumat',
    tanggal: '2026-11-06',
    jam: '11:10:05',
    rating_kepuasan: 5,
    ulasan_kepuasan: 'Proses sinkronisasi data berlangsung cepat dan tertib.',
    created_at: '2026-11-06T11:10:05.000Z',
  },
  {
    id: 'guest-5',
    no_antrean: 'TMG-20261107-005',
    nama: 'K.H. Hasan Basri',
    gender: 'Pria',
    pekerjaan: 'Lainnya',
    pekerjaan_lainnya: 'Tokoh Agama / Ketua MUI Kecamatan Maja',
    instansi: 'MUI Kecamatan Maja Kab. Lebak',
    unit_tujuan: 'Seksi Bimas Islam',
    keperluan: 'Pengajuan jadwal bimbingan perkawinan dan sosialisasi kalibrasi arah kiblat',
    no_hp: '087812003344',
    hari: 'Jumat',
    tanggal: '2026-11-06',
    jam: '13:40:50',
    rating_kepuasan: 5,
    ulasan_kepuasan: 'Alhamdulillah pelayanan sangat ramah dan memuaskan.',
    created_at: '2026-11-06T13:40:50.000Z',
  },
  {
    id: 'guest-6',
    no_antrean: 'TMG-20261015-012',
    nama: 'Asep Saepullah, S.Pd.I',
    gender: 'Pria',
    pekerjaan: 'ASN/TNI/POLRI',
    instansi: 'SDN 2 Muara Ciujung Timur',
    unit_tujuan: 'Seksi Pendidikan Agama Islam',
    keperluan: 'Validasi berkas PPG Guru Pendidikan Agama Islam tahun 2026',
    no_hp: '082199881122',
    hari: 'Rabu',
    tanggal: '2026-10-15',
    jam: '09:30:10',
    rating_kepuasan: 5,
    ulasan_kepuasan: 'Pelayanan prima, staf Seksi PAI sangat komunikatif.',
    created_at: '2026-10-15T09:30:10.000Z',
  },
  {
    id: 'guest-7',
    no_antrean: 'TMG-20261010-008',
    nama: 'dr. Hj. Ratna Juwita',
    gender: 'Wanita',
    pekerjaan: 'ASN/TNI/POLRI',
    instansi: 'Dinas Kesehatan Kabupaten Lebak',
    unit_tujuan: 'Kepala Kantor',
    keperluan: 'Audiensi persiapan tes kesehatan calon jemaah haji Kabupaten Lebak',
    no_hp: '081234509876',
    hari: 'Senin',
    tanggal: '2026-10-10',
    jam: '10:00:00',
    rating_kepuasan: 5,
    ulasan_kepuasan: 'Diterima langsung dengan sangat baik.',
    created_at: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'guest-8',
    no_antrean: 'TMG-20260905-004',
    nama: 'Bambang Soediro',
    gender: 'Pria',
    pekerjaan: 'Wiraswasta',
    instansi: 'CV Mandiri Grafika Banten',
    unit_tujuan: 'Subbag Perencanaan dan Kehumasan',
    keperluan: 'Konfirmasi pencetakan majalah dan buletin informasi Kemenag Lebak',
    no_hp: '081388771122',
    hari: 'Sabtu',
    tanggal: '2026-09-05',
    jam: '08:45:15',
    rating_kepuasan: 4,
    ulasan_kepuasan: 'Respon cepat dan tepat waktu.',
    created_at: '2026-09-05T08:45:15.000Z',
  },
];
