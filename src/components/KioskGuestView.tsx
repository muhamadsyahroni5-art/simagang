import React, { useState } from 'react';
import { Guest, Gender, PekerjaanCategory, RunningTextConfig } from '../types';
import { UNIT_LAYANAN_LIST, PEKERJAAN_OPTIONS, DAY_NAMES } from '../data/constants';
import { DigitalClock } from './DigitalClock';
import { RunningText } from './RunningText';
import {
  CheckCircle2,
  UserCheck,
  Printer,
  Star,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building,
  Clock,
  MapPin,
  Calendar,
  FileText,
  Phone,
  MessageSquare,
  QrCode,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface KioskGuestViewProps {
  onAddGuest: (newGuest: Omit<Guest, 'id' | 'no_antrean' | 'hari' | 'tanggal' | 'jam' | 'created_at'>) => Guest;
  onNavigateLogin: () => void;
  onOpenPhpModal: () => void;
  runningTextConfig: RunningTextConfig;
}

export const KioskGuestView: React.FC<KioskGuestViewProps> = ({
  onAddGuest,
  onNavigateLogin,
  onOpenPhpModal,
  runningTextConfig,
}) => {
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState<Gender>('Pria');
  const [pekerjaan, setPekerjaan] = useState<PekerjaanCategory>('ASN/TNI/POLRI');
  const [pekerjaanLainnya, setPekerjaanLainnya] = useState('');
  const [instansi, setInstansi] = useState('');
  const [unitTujuan, setUnitTujuan] = useState(UNIT_LAYANAN_LIST[0]);
  const [keperluan, setKeperluan] = useState('');
  const [noHp, setNoHp] = useState('');

  // Ticket modal after submission
  const [submittedGuest, setSubmittedGuest] = useState<Guest | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [ulasan, setUlasan] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !instansi.trim() || !keperluan.trim() || !noHp.trim()) {
      return;
    }

    if (pekerjaan === 'Lainnya' && !pekerjaanLainnya.trim()) {
      return;
    }

    const created = onAddGuest({
      nama: nama.trim(),
      gender,
      pekerjaan,
      pekerjaan_lainnya: pekerjaan === 'Lainnya' ? pekerjaanLainnya.trim() : undefined,
      instansi: instansi.trim(),
      unit_tujuan: unitTujuan,
      keperluan: keperluan.trim(),
      no_hp: noHp.trim(),
    });

    setSubmittedGuest(created);
    setSurveySubmitted(false);

    // Reset form
    setNama('');
    setGender('Pria');
    setPekerjaan('ASN/TNI/POLRI');
    setPekerjaanLainnya('');
    setInstansi('');
    setUnitTujuan(UNIT_LAYANAN_LIST[0]);
    setKeperluan('');
    setNoHp('');
  };

  const handleSaveSurvey = () => {
    if (submittedGuest) {
      submittedGuest.rating_kepuasan = rating;
      submittedGuest.ulasan_kepuasan = ulasan;
      setSurveySubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* BACKGROUND IMAGE DENGAN GAMBAR PETUGAS KEMENAG TRANSPARAN ELEGAN */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Layer 1: Gambar Petugas Kemenag Ramah Menyambut (Transparan Elegan) */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-right-bottom md:bg-[center_right_15%] opacity-25 mix-blend-luminosity filter contrast-110 brightness-110"
          style={{
            backgroundImage: `url('/assets/kemenag_greeting.png')`,
          }}
        />

        {/* Layer 2: Halus Arsitektural Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: `url('/src/assets/images/kiosk_bg_pattern_1794034518606.jpg')`,
          }}
        />

        {/* Layer 3: Emerald & Gold Architectural Gradient Tint Scrim */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/94 via-emerald-900/88 to-slate-950/95" />
        
        {/* Layer 4: Radial Top Amber Highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-black/50" />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Top Running Text */}
        <RunningText config={runningTextConfig} target="kiosk" />

        {/* Modern Glassmorphic Kiosk Header */}
        <header className="bg-emerald-950/70 backdrop-blur-md border-b border-emerald-500/20 py-4 px-6 md:px-12 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Identity & Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/assets/aistudio/logo_kemenag_71599073.png"
                  alt="Logo Kemenag"
                  className="h-16 md:h-18 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    SI-TAMU Kemenag Lebak
                  </h1>
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                    KIOSK PTSP
                  </span>
                </div>
                <p className="text-xs md:text-sm font-bold text-emerald-300 mt-0.5">
                  Kantor Kementerian Agama Kabupaten Lebak
                </p>
                <p className="text-[11px] text-emerald-100/80 italic mt-0.5 font-light">
                  "Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"
                </p>
              </div>
            </div>

            {/* Live Clock & Action Navigation */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-inner">
                <DigitalClock variant="compact" />
              </div>

              <div className="h-9 w-px bg-emerald-500/30 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenPhpModal}
                  className="px-3.5 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                  title="Source Code PHP Murni & Skema Database MySQL untuk Laragon / XAMPP"
                >
                  PHP & MySQL
                </button>
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer border border-emerald-400/40"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  Login Petugas
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* Main 2-Column Split View */}
        <main className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Prestigious Government Welcome & Service Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Glass Welcome Card */}
              <div className="bg-emerald-950/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                {/* Banner Foto Petugas Kemenag Ramah Menyambut (Transparan Elegan) */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 mb-5 group shadow-lg">
                  <img
                    src="/assets/kemenag_greeting.png"
                    alt="Petugas Pelayanan PTSP Kemenag Lebak"
                    className="w-full h-44 md:h-48 object-cover object-top opacity-85 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded shadow-xs">
                        Pelayanan Prima 5S
                      </span>
                      <p className="text-white font-bold text-xs mt-1 drop-shadow-sm">
                        Senyum • Salam • Sapa • Sopan • Santun
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pelayanan Terpadu Satu Pintu (PTSP)</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  Buku Tamu Digital Terintegrasi
                </h2>
                
                <p className="text-xs md:text-sm text-emerald-100/90 mt-2 leading-relaxed font-normal">
                  Selamat datang di Kantor Kementerian Agama Kabupaten Lebak. Silakan daftarkan kehadiran dan maksud kunjungan Anda secara mandiri untuk kemudahan antrean dan tertib administrasi kedinasan.
                </p>

                {/* 3 Step Service Flow */}
                <div className="mt-6 pt-5 border-t border-emerald-500/30 space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-white">Isi Formulir Identitas</p>
                      <p className="text-emerald-200/80 text-[11px]">Nama, instansi, unit layanan yang dituju, dan nomor WhatsApp.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-white">Dapatkan Nomor Antrean / Registrasi</p>
                      <p className="text-emerald-200/80 text-[11px]">Sistem mencatat otomatis hari, tanggal, dan jam kunjungan resmi.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-white">Menuju Loket Layanan & Survei IKM</p>
                      <p className="text-emerald-200/80 text-[11px]">Petugas kami akan melayani Anda, tautan survei kepuasan dapat dikirim ke WhatsApp.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Details Widget */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white text-xs space-y-3 shadow-lg">
                <div className="flex items-center gap-2.5 text-emerald-300 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Jam Operasional Pelayanan PTSP:</span>
                </div>
                <div className="pl-6 text-[11px] text-emerald-100/80 space-y-1">
                  <p>• Senin - Kamis: <strong>07.30 - 16.00 WIB</strong></p>
                  <p>• Jumat: <strong>07.30 - 16.30 WIB</strong> (Istirahat Shalat Jumat 11.30 - 13.00 WIB)</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-start gap-2.5 text-[11px] text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Jl. Siliwangi No. 2, Kel. Muara Ciujung Timur Kec. Rangkasbitung, Kabupaten Lebak, Banten 42314
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: High-End Form Card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden text-slate-800">
                
                {/* Form Top Header */}
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 p-6 text-white flex items-center justify-between border-b border-emerald-700/60">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      Formulir Tamu Digital PTSP
                    </h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Silakan isi 7 rincian data di bawah ini dengan benar
                    </p>
                  </div>
                  <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20 text-emerald-100 hidden sm:block">
                    Pencatatan Otomatis (WIB)
                  </span>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-xs">
                  
                  {/* 1. Nama Lengkap */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      1. Nama Lengkap Pengunjung / Tamu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={e => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap beserta gelar jika ada"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition bg-white"
                    />
                  </div>

                  {/* 2. Jenis Kelamin (Sleek Buttons) */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-2">
                      2. Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('Pria')}
                        className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                          gender === 'Pria'
                            ? 'bg-emerald-800 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/50'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full border-2 ${gender === 'Pria' ? 'bg-white border-white' : 'border-slate-400'}`} />
                        <span>Pria (Laki-laki)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGender('Wanita')}
                        className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                          gender === 'Wanita'
                            ? 'bg-emerald-800 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/50'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full border-2 ${gender === 'Wanita' ? 'bg-white border-white' : 'border-slate-400'}`} />
                        <span>Wanita (Perempuan)</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Pekerjaan (Dropdown + Penanda Hijau Saat "Lainnya") */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      3. Pekerjaan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={pekerjaan}
                      onChange={e => setPekerjaan(e.target.value as PekerjaanCategory)}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none bg-white transition cursor-pointer"
                    >
                      {PEKERJAAN_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {/* KONDISI KHUSUS: Textbox khusus penanda hijau saat "Lainnya" dipilih */}
                    {pekerjaan === 'Lainnya' && (
                      <div className="mt-3 p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl transition-all shadow-xs">
                        <label className="block font-bold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          Ketik Nama Pekerjaan Secara Manual <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={pekerjaanLainnya}
                          onChange={e => setPekerjaanLainnya(e.target.value)}
                          placeholder="Contoh: Dosen, Guru Honorer, Pengasuh Pondok Pesantren, Tokoh Agama"
                          className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-emerald-400 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  {/* 4. Asal Instansi / Satker */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      4. Asal Instansi / Lembaga / Satker / Ormas <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={instansi}
                      onChange={e => setInstansi(e.target.value)}
                      placeholder="Contoh: KUA Rangkasbitung, Ponpes Al-Falah, Bank BSI, Pribadi"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition bg-white"
                    />
                  </div>

                  {/* 5. Unit Layanan yang Dituju (12 Unit) */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      5. Unit Layanan yang Dituju (12 Unit Kerja) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={unitTujuan}
                      onChange={e => setUnitTujuan(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none bg-white transition cursor-pointer"
                    >
                      {UNIT_LAYANAN_LIST.map((u, i) => (
                        <option key={u} value={u}>
                          {i + 1}. {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Maksud / Tujuan Keperluan */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      6. Maksud / Tujuan / Keperluan Kunjungan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={keperluan}
                      onChange={e => setKeperluan(e.target.value)}
                      placeholder="Jelaskan secara ringkas perihal keperluan kunjungan Anda di Kemenag Lebak"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition bg-white"
                    ></textarea>
                  </div>

                  {/* 7. No. HP / WhatsApp */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        7. No. HP / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Untuk Tautan Survei IKM via WhatsApp
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={noHp}
                      onChange={e => setNoHp(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition bg-white font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-black text-sm md:text-base rounded-2xl shadow-xl hover:shadow-2xl transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-emerald-600/40"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-300" />
                      <span>Simpan Data Buku Tamu</span>
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </main>

        {/* Modal Tiket Kunjungan Tamu */}
        {submittedGuest && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-200">
              
              {/* Modal Banner */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-6 text-center relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                  <CheckCircle2 className="w-8 h-8 text-amber-300" />
                </div>
                <h3 className="text-xl font-black">Data Kunjungan Berhasil Dicatat!</h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Kantor Kementerian Agama Kabupaten Lebak
                </p>
              </div>

              {/* Ticket Content */}
              <div className="p-6 space-y-4">
                
                {/* Antrean Box */}
                <div className="bg-slate-50 border-2 border-dashed border-emerald-300 rounded-2xl p-5 text-center relative">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    NOMOR REGISTRASI KUNJUNGAN
                  </span>
                  <p className="text-3xl font-mono font-black text-emerald-950 mt-2 tracking-tight">
                    {submittedGuest.no_antrean}
                  </p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex justify-center gap-4 font-medium">
                    <span>📅 {submittedGuest.hari}, {submittedGuest.tanggal}</span>
                    <span>⏰ {submittedGuest.jam} WIB</span>
                  </div>
                </div>

                {/* Identity Summary */}
                <div className="text-xs space-y-1.5 text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Tamu:</span>
                    <span className="font-bold text-slate-900">{submittedGuest.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instansi:</span>
                    <span className="font-medium text-slate-800">{submittedGuest.instansi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Dituju:</span>
                    <span className="font-bold text-emerald-950">{submittedGuest.unit_tujuan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. WhatsApp:</span>
                    <span className="font-mono text-slate-800">{submittedGuest.no_hp}</span>
                  </div>
                </div>

                {/* Quick Satisfaction Rating */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700 text-center mb-2">
                    Bantu kami meningkatkan mutu pelayanan dengan memberikan penilaian:
                  </p>
                  {!surveySubmitted ? (
                    <div className="space-y-3">
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= rating
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={ulasan}
                        onChange={e => setUlasan(e.target.value)}
                        placeholder="Tulis saran atau komentar singkat (opsional)..."
                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={handleSaveSurvey}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Kirim Penilaian Kepuasan
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-2.5 bg-emerald-50 rounded-xl text-emerald-900 text-xs font-semibold">
                      ✓ Terima kasih atas ulasan dan penilaian kepuasan Anda!
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Bukti Tamu
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedGuest(null)}
                    className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Selesai / Tamu Baru
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-emerald-950/70 backdrop-blur-md border-t border-emerald-500/20 py-3.5 px-6 text-center text-xs text-emerald-200/80">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              &copy; {new Date().getFullYear()} Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0
            </span>
            <span className="italic font-medium text-amber-300">
              "Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
};
