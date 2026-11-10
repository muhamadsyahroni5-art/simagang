import React, { useState } from 'react';
import { User, RunningTextConfig, RunningTextTheme, UserRole, UserStatus, WhatsAppSurveyConfig } from '../types';
import { DEFAULT_RUNNING_TEXT, DEFAULT_WA_SURVEY_CONFIG, UNIT_LAYANAN_LIST } from '../data/constants';
import {
  Sliders,
  Users,
  Save,
  RotateCcw,
  CheckCircle2,
  Plus,
  KeyRound,
  Trash2,
  Edit2,
  Shield,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye,
  MessageSquareShare,
  Send,
  ExternalLink,
  Phone,
} from 'lucide-react';

interface SettingsViewProps {
  runningTextConfig: RunningTextConfig;
  onUpdateRunningText: (newConfig: RunningTextConfig) => void;
  surveyConfig: WhatsAppSurveyConfig;
  onUpdateSurveyConfig: (newConfig: WhatsAppSurveyConfig) => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: string, updated: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  runningTextConfig,
  onUpdateRunningText,
  surveyConfig,
  onUpdateSurveyConfig,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<'runningText' | 'surveyWa' | 'users'>('runningText');

  // Running Text Form State
  const [rtEnabled, setRtEnabled] = useState(runningTextConfig.enabled);
  const [rtKiosk, setRtKiosk] = useState(runningTextConfig.text_kiosk);
  const [rtAdmin, setRtAdmin] = useState(runningTextConfig.text_admin);
  const [rtSpeed, setRtSpeed] = useState(runningTextConfig.speed_seconds);
  const [rtTheme, setRtTheme] = useState<RunningTextTheme>(runningTextConfig.theme);
  const [saveRtSuccess, setSaveRtSuccess] = useState(false);

  // WhatsApp Survey State
  const [waSurveyUrl, setWaSurveyUrl] = useState(surveyConfig.survey_url);
  const [waTemplate, setWaTemplate] = useState(surveyConfig.wa_message_template);
  const [saveSurveySuccess, setSaveSurveySuccess] = useState(false);

  // User Management State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Add User Form State
  const [uNama, setUNama] = useState('');
  const [uUsername, setUUsername] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [uRole, setURole] = useState<UserRole>('operator');
  const [uNip, setUNip] = useState('');
  const [uJabatan, setUJabatan] = useState('');
  const [uUnitKerja, setUUnitKerja] = useState(UNIT_LAYANAN_LIST[0]);
  const [userError, setUserError] = useState('');

  // Handle Save Running Text
  const handleSaveRunningText = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RunningTextConfig = {
      enabled: rtEnabled,
      text_kiosk: rtKiosk.trim() || DEFAULT_RUNNING_TEXT.text_kiosk,
      text_admin: rtAdmin.trim() || DEFAULT_RUNNING_TEXT.text_admin,
      speed_seconds: Number(rtSpeed) || 25,
      theme: rtTheme,
    };
    onUpdateRunningText(updated);
    setSaveRtSuccess(true);
    setTimeout(() => setSaveRtSuccess(false), 3000);
  };

  // Handle Reset Running Text to Default
  const handleResetRunningText = () => {
    setRtEnabled(DEFAULT_RUNNING_TEXT.enabled);
    setRtKiosk(DEFAULT_RUNNING_TEXT.text_kiosk);
    setRtAdmin(DEFAULT_RUNNING_TEXT.text_admin);
    setRtSpeed(DEFAULT_RUNNING_TEXT.speed_seconds);
    setRtTheme(DEFAULT_RUNNING_TEXT.theme);
    onUpdateRunningText(DEFAULT_RUNNING_TEXT);
    setSaveRtSuccess(true);
    setTimeout(() => setSaveRtSuccess(false), 3000);
  };

  // Handle Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');

    if (!uNama.trim() || !uUsername.trim() || !uPassword.trim()) {
      setUserError('Nama, Username, dan Password wajib diisi.');
      return;
    }

    const exists = users.some(u => u.username.toLowerCase() === uUsername.trim().toLowerCase());
    if (exists) {
      setUserError(`Username "${uUsername}" sudah digunakan oleh akun lain.`);
      return;
    }

    onAddUser({
      nama: uNama.trim(),
      username: uUsername.trim(),
      password: uPassword,
      role: uRole,
      nip: uNip.trim() || '-',
      jabatan: uJabatan.trim() || 'Staf Pelayanan PTSP',
      unit_kerja: uUnitKerja,
      status: 'aktif',
    });

    setShowAddUserModal(false);
    // Reset Form
    setUNama('');
    setUUsername('');
    setUPassword('');
    setURole('operator');
    setUNip('');
    setUJabatan('');
    setUUnitKerja(UNIT_LAYANAN_LIST[0]);
  };

  // Handle Save Edited User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, {
      nama: editingUser.nama,
      role: editingUser.role,
      nip: editingUser.nip,
      jabatan: editingUser.jabatan,
      unit_kerja: editingUser.unit_kerja,
      status: editingUser.status,
    });
    setEditingUser(null);
  };

  // Handle Reset Password Submit
  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newPassword.trim()) return;
    onUpdateUser(resettingUser.id, { password: newPassword.trim() });
    setResettingUser(null);
    setNewPassword('');
  };

  // Live preview styles
  const previewThemeClass =
    rtTheme === 'dark'
      ? 'bg-slate-950 text-slate-100 border-slate-800'
      : rtTheme === 'gold'
      ? 'bg-amber-900 text-amber-50 border-amber-700'
      : 'bg-emerald-900 text-emerald-100 border-emerald-700';

  // Handle Save WhatsApp Survey Config
  const handleSaveSurveyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSurveyConfig({
      survey_url: waSurveyUrl.trim() || DEFAULT_WA_SURVEY_CONFIG.survey_url,
      wa_message_template: waTemplate.trim() || DEFAULT_WA_SURVEY_CONFIG.wa_message_template,
    });
    setSaveSurveySuccess(true);
    setTimeout(() => setSaveSurveySuccess(false), 3000);
  };

  const handleResetSurveyConfig = () => {
    setWaSurveyUrl(DEFAULT_WA_SURVEY_CONFIG.survey_url);
    setWaTemplate(DEFAULT_WA_SURVEY_CONFIG.wa_message_template);
    onUpdateSurveyConfig(DEFAULT_WA_SURVEY_CONFIG);
    setSaveSurveySuccess(true);
    setTimeout(() => setSaveSurveySuccess(false), 3000);
  };

  const handleInsertTag = (tag: string) => {
    setWaTemplate(prev => prev + ' ' + tag);
  };

  // Sample preview of the rendered WhatsApp message
  const previewWaRendered = waTemplate
    .replace(/{nama}/g, 'Drs. H. Mulyadi, M.Pd')
    .replace(/{no_antrean}/g, 'TMG-20261107-001')
    .replace(/{hari}/g, 'Jumat')
    .replace(/{tanggal}/g, '06/11/2026')
    .replace(/{unit_tujuan}/g, 'Seksi Pendidikan Madrasah')
    .replace(/{link_survei}/g, waSurveyUrl || 'https://kemenaglebak.com/survei-ikm');

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Menu Setting
              </span>
              <span className="text-xs text-slate-500">• Pengaturan Sistem Kemenag Lebak</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Pengaturan Sistem & Manajemen Pengguna
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola teks pengumuman berjalan, link survei & pesan WhatsApp, dan daftar akun petugas (Admin & Operator)
            </p>
          </div>
        </div>

        {/* 3 Tabs Segmented Control */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('runningText')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'runningText'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Tab 1: Pengaturan Running Text
          </button>

          <button
            onClick={() => setActiveTab('surveyWa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'surveyWa'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquareShare className="w-4 h-4 text-emerald-300" />
            Tab 2: Ucapan & Link Survei WA
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Tab 3: Manajemen Pengguna
          </button>
        </div>
      </div>

      {/* TAB 1: RUNNING TEXT CONFIGURATION */}
      {activeTab === 'runningText' && (
        <div className="space-y-6">
          
          {/* Live Preview Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-700" />
                Live Preview Interaktif Real-Time:
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Status: {rtEnabled ? '🟢 Aktif' : '🔴 Dinonaktifkan'} • Tema: {rtTheme.toUpperCase()} • {rtSpeed}s
              </span>
            </div>

            {rtEnabled ? (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-500">Pratinjau Kiosk Tamu:</p>
                <div className={`p-3 rounded-xl border text-xs overflow-hidden flex items-center gap-3 ${previewThemeClass}`}>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/20 border border-white/20 shrink-0">
                    Info Pelayanan
                  </span>
                  <div className="flex-1 overflow-hidden whitespace-nowrap">
                    <div
                      className="inline-block animate-marquee"
                      style={{ animationDuration: `${rtSpeed}s` }}
                    >
                      <span className="font-semibold mr-12">{rtKiosk}</span>
                      <span className="font-semibold mr-12 opacity-80">{rtKiosk}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-semibold text-slate-500 pt-1">Pratinjau Portal Admin:</p>
                <div className={`p-3 rounded-xl border text-xs overflow-hidden flex items-center gap-3 ${previewThemeClass}`}>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/20 border border-white/20 shrink-0">
                    Pengumuman Resmi
                  </span>
                  <div className="flex-1 overflow-hidden whitespace-nowrap">
                    <div
                      className="inline-block animate-marquee"
                      style={{ animationDuration: `${rtSpeed}s` }}
                    >
                      <span className="font-semibold mr-12">{rtAdmin}</span>
                      <span className="font-semibold mr-12 opacity-80">{rtAdmin}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                Running text saat ini dalam keadaan NONAKTIF (Off). Tidak akan muncul di Kiosk maupun Portal Admin.
              </div>
            )}
          </div>

          {/* Form Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            {saveRtSuccess && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Pengaturan running text berhasil disimpan dan diperbarui di browser (localStorage)!</span>
              </div>
            )}

            <form onSubmit={handleSaveRunningText} className="space-y-5">
              
              {/* Saklar On/Off */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    Saklar Aktifkan / Nonaktifkan Running Text
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Matikan sewaktu-waktu jika tidak ingin menampilkan teks berjalan di layar kiosk & portal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRtEnabled(!rtEnabled)}
                  className={`p-1.5 rounded-xl flex items-center gap-2 text-xs font-bold transition cursor-pointer ${
                    rtEnabled
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {rtEnabled ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-300" />
                      <span>Aktif (ON)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                      <span>Nonaktif (OFF)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Input Teks Kiosk */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Pesan Running Text untuk Tamu Publik (Front Desk Kiosk)
                </label>
                <textarea
                  rows={2}
                  required
                  value={rtKiosk}
                  onChange={e => setRtKiosk(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Masukkan kalimat sambutan dan arahan bagi pengunjung PTSP..."
                ></textarea>
              </div>

              {/* Input Teks Admin */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Pesan Running Text untuk Admin & Operator
                </label>
                <textarea
                  rows={2}
                  required
                  value={rtAdmin}
                  onChange={e => setRtAdmin(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Masukkan pengumuman dinas internal untuk petugas..."
                ></textarea>
              </div>

              {/* Kecepatan & Pilihan Tema Warna */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Kecepatan */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Durasi Kecepatan Putaran Teks: <span className="text-emerald-800">{rtSpeed} Detik</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={rtSpeed}
                    onChange={e => setRtSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10s (Cepat)</span>
                    <span>25s (Standar)</span>
                    <span>60s (Lambat)</span>
                  </div>
                </div>

                {/* Tema Warna */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Pilihan Tema Warna Ticker
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRtTheme('emerald')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                        rtTheme === 'emerald'
                          ? 'bg-emerald-900 text-white border-emerald-600 ring-2 ring-emerald-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-600"></span>
                      <span>Emerald Kemenag</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRtTheme('dark')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                        rtTheme === 'dark'
                          ? 'bg-slate-900 text-white border-slate-700 ring-2 ring-slate-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-950"></span>
                      <span>Dark Executive</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRtTheme('gold')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                        rtTheme === 'gold'
                          ? 'bg-amber-900 text-white border-amber-600 ring-2 ring-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                      <span>Gold Amber</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Pengaturan Running Text
                </button>
                <button
                  type="button"
                  onClick={handleResetRunningText}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Kembalikan ke Default
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN SURVEI WHATSAPP & LINK IKM */}
      {activeTab === 'surveyWa' && (
        <div className="space-y-6">
          
          {/* Header Info Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <MessageSquareShare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Konfigurasi Pesan WhatsApp Otomatis & Tautan Survei (IKM)
                </h4>
                <p className="text-emerald-800 text-[11px] mt-0.5">
                  Teks dan tautan ini akan otomatis digunakan saat operator atau admin mengklik tombol "Kirim Survei" di daftar buku tamu.
                </p>
              </div>
            </div>
            <a
              href={waSurveyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-lg font-bold flex items-center gap-1.5 transition shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              Uji Tautan Survei
            </a>
          </div>

          {/* Form and Preview Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Form Side */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              {saveSurveySuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Pengaturan link dan template survei WhatsApp berhasil disimpan!</span>
                </div>
              )}

              <form onSubmit={handleSaveSurveyConfig} className="space-y-4">
                {/* Link Survei URL */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    1. Link / URL Tautan Survei Kepuasan (IKM) *
                  </label>
                  <input
                    type="url"
                    required
                    value={waSurveyUrl}
                    onChange={e => setWaSurveyUrl(e.target.value)}
                    placeholder="Contoh: https://kemenaglebak.com/survei-ikm atau link Google Form"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Dapat berupa URL survei website Kemenag Lebak, Google Form, atau aplikasi e-Survey resmi lainnya.
                  </p>
                </div>

                {/* Template Message */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase text-slate-700">
                      2. Template Ucapan & Pesan WhatsApp *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Gunakan format teks WhatsApp (*tebal*, _miring_)
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    required
                    value={waTemplate}
                    onChange={e => setWaTemplate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-sans leading-relaxed"
                    placeholder="Ketik draf pesan WhatsApp..."
                  ></textarea>

                  {/* Placeholder Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-600 mb-1.5">
                      Sisipkan Tag Otomatis (Klik untuk menambahkan ke pesan):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { tag: '{nama}', desc: 'Nama Tamu' },
                        { tag: '{no_antrean}', desc: 'No. Registrasi' },
                        { tag: '{unit_tujuan}', desc: 'Unit Dituju' },
                        { tag: '{hari}', desc: 'Hari' },
                        { tag: '{tanggal}', desc: 'Tanggal' },
                        { tag: '{link_survei}', desc: 'Link Survei' },
                      ].map(t => (
                        <button
                          key={t.tag}
                          type="button"
                          onClick={() => handleInsertTag(t.tag)}
                          className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-lg text-[10px] font-mono transition cursor-pointer"
                          title={`Sisipkan ${t.desc}`}
                        >
                          + {t.tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap gap-3 border-t border-slate-200">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Pengaturan Survei WA
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSurveyConfig}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Kembalikan Template Default
                  </button>
                </div>
              </form>
            </div>

            {/* Live WhatsApp Chat Bubble Preview Side */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-700" />
                    Pratinjau Gelembung Chat WhatsApp:
                  </h3>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Simulasi Penerima
                  </span>
                </div>

                {/* WhatsApp Chat mockup */}
                <div className="bg-[#ECE5DD] p-4 rounded-2xl border border-slate-300 shadow-inner">
                  {/* WhatsApp contact bar */}
                  <div className="bg-[#075E54] text-white p-2.5 rounded-xl mb-3 flex items-center gap-2.5 shadow-xs">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs">
                      KL
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">PTSP Kemenag Lebak Resmi</p>
                      <p className="text-[10px] text-emerald-200 mt-0.5 leading-none">Akun Bisnis Terverifikasi</p>
                    </div>
                  </div>

                  {/* Chat Bubble */}
                  <div className="bg-white rounded-xl rounded-tr-none p-3.5 shadow-sm text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text border border-emerald-100">
                    {previewWaRendered}
                    <div className="text-[10px] text-slate-400 text-right mt-2 font-mono flex items-center justify-end gap-1">
                      <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-blue-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                Pesan akan dikirim langsung ke nomor WhatsApp tamu melalui tautan <code>api.whatsapp.com</code> saat operator/admin menekan tombol <strong>Kirim Survei</strong>.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Daftar Pengguna Sistem (Admin & Operator PTSP)
                </h3>
                <p className="text-xs text-slate-500">
                  Wewenang Role: Admin (Wewenang Penuh) • Operator (Dashboard, Buku Tamu, Survei)
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                + Tambah Pengguna Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold">Nama Pengguna</th>
                    <th className="py-3 px-4 font-semibold">Username</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">NIP</th>
                    <th className="py-3 px-4 font-semibold">Jabatan</th>
                    <th className="py-3 px-4 font-semibold">Unit Penugasan</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => {
                    const isProtectedAdmin = u.username === 'admin';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {u.nama}
                          {isProtectedAdmin && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              Akun Utama
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                          {u.username}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{u.nip}</td>
                        <td className="py-3 px-4 text-slate-700">{u.jabatan}</td>
                        <td className="py-3 px-4 text-emerald-950 font-medium">{u.unit_kerja}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            disabled={isProtectedAdmin}
                            onClick={() =>
                              onUpdateUser(u.id, {
                                status: u.status === 'aktif' ? 'nonaktif' : 'aktif',
                              })
                            }
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                              isProtectedAdmin
                                ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed opacity-90'
                                : u.status === 'aktif'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer'
                            }`}
                            title={isProtectedAdmin ? 'Akun admin utama tidak dapat dinonaktifkan' : 'Klik untuk ubah status'}
                          >
                            {u.status}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Edit */}
                            <button
                              onClick={() => setEditingUser(u)}
                              className="p-1 text-slate-500 hover:text-emerald-700 rounded transition cursor-pointer"
                              title="Edit Data Pengguna"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Password */}
                            <button
                              onClick={() => setResettingUser(u)}
                              className="p-1 text-slate-500 hover:text-amber-700 rounded transition cursor-pointer"
                              title="Reset Password Pengguna"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            {!isProtectedAdmin ? (
                              <button
                                onClick={() => {
                                  if (confirm(`Yakin ingin menghapus pengguna "${u.nama}"?`)) {
                                    onDeleteUser(u.id);
                                  }
                                }}
                                className="p-1 text-slate-500 hover:text-rose-600 rounded transition cursor-pointer"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="p-1 text-slate-300" title="Akun dilindungi">
                                <Shield className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Pengguna Baru */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full text-slate-800 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Pengguna Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Lengkapi data petugas untuk diberikan hak akses sistem</p>

            {userError && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {userError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={uNama}
                  onChange={e => setUNama(e.target.value)}
                  placeholder="Contoh: H. Ahmad Zulfikar, S.H.I"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={uUsername}
                    onChange={e => setUUsername(e.target.value)}
                    placeholder="Contoh: ahmad.z"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={uPassword}
                    onChange={e => setUPassword(e.target.value)}
                    placeholder="Kata sandi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Role / Hak Akses *</label>
                  <select
                    value={uRole}
                    onChange={e => setURole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="operator">Operator (Terbatas)</option>
                    <option value="admin">Admin (Wewenang Penuh)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    value={uNip}
                    onChange={e => setUNip(e.target.value)}
                    placeholder="198803102014..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Jabatan Pegawai</label>
                <input
                  type="text"
                  value={uJabatan}
                  onChange={e => setUJabatan(e.target.value)}
                  placeholder="Contoh: Petugas Front Desk PTSP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Unit Kerja Penugasan</label>
                <select
                  value={uUnitKerja}
                  onChange={e => setUUnitKerja(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  {UNIT_LAYANAN_LIST.map((unit, i) => (
                    <option key={unit} value={unit}>
                      {i + 1}. {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full text-slate-800 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Edit Data Pengguna</h3>
            <p className="text-xs text-slate-500 mb-4">Ubah detail akun pengguna {editingUser.username}</p>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingUser.nama}
                  onChange={e => setEditingUser({ ...editingUser, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Role / Hak Akses</label>
                  <select
                    disabled={editingUser.username === 'admin'}
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="operator">Operator (Terbatas)</option>
                    <option value="admin">Admin (Wewenang Penuh)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Status</label>
                  <select
                    disabled={editingUser.username === 'admin'}
                    value={editingUser.status}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">NIP</label>
                <input
                  type="text"
                  value={editingUser.nip}
                  onChange={e => setEditingUser({ ...editingUser, nip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={editingUser.jabatan}
                  onChange={e => setEditingUser({ ...editingUser, jabatan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Unit Kerja</label>
                <select
                  value={editingUser.unit_kerja}
                  onChange={e => setEditingUser({ ...editingUser, unit_kerja: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  {UNIT_LAYANAN_LIST.map((unit, i) => (
                    <option key={unit} value={unit}>
                      {i + 1}. {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-800 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Reset Password Pengguna</h3>
            <p className="text-xs text-slate-500 mb-3">
              Ketik kata sandi baru untuk akun <strong>{resettingUser.username}</strong> ({resettingUser.nama})
            </p>

            <form onSubmit={handleSaveResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Password Baru *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
