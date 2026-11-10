export type Gender = 'Pria' | 'Wanita';

export type PekerjaanCategory =
  | 'ASN/TNI/POLRI'
  | 'Pegawai BUMN'
  | 'Pegawai swasta'
  | 'Wiraswasta'
  | 'Lainnya';

export interface Guest {
  id: string;
  no_antrean: string;
  nama: string;
  gender: Gender;
  pekerjaan: PekerjaanCategory;
  pekerjaan_lainnya?: string;
  instansi: string;
  unit_tujuan: string;
  keperluan: string;
  no_hp: string;
  hari: string;
  tanggal: string; // YYYY-MM-DD
  jam: string; // HH:mm:ss
  rating_kepuasan?: number; // 1-5
  ulasan_kepuasan?: string;
  survey_sent_at?: string;
  created_at: string;
}

export interface WhatsAppSurveyConfig {
  survey_url: string;
  wa_message_template: string;
}

export type UserRole = 'admin' | 'operator';
export type UserStatus = 'aktif' | 'nonaktif';

export interface User {
  id: string;
  username: string;
  nama: string;
  password?: string;
  role: UserRole;
  nip: string;
  jabatan: string;
  unit_kerja: string;
  status: UserStatus;
}

export type RunningTextTheme = 'emerald' | 'dark' | 'gold';

export interface RunningTextConfig {
  enabled: boolean;
  text_kiosk: string;
  text_admin: string;
  speed_seconds: number;
  theme: RunningTextTheme;
}

export type NavigationTab =
  | 'kiosk'
  | 'login'
  | 'dashboard'
  | 'tamu'
  | 'survei'
  | 'laporan'
  | 'pengaturan'
  | 'php_source';
