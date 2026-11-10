import React from 'react';
import { Guest, User } from '../types';
import { UNIT_LAYANAN_LIST, PEKERJAAN_OPTIONS, MONTH_NAMES } from '../data/constants';
import {
  Users,
  CalendarCheck,
  Building2,
  Star,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  guests: Guest[];
  currentUser: User;
  onNavigateTab: (tab: 'tamu' | 'survei' | 'laporan' | 'kiosk') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  guests,
  currentUser,
  onNavigateTab,
}) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const tamuHariIni = guests.filter(g => g.tanggal === todayStr).length;
  const tamuBulanIni = guests.filter(g => g.tanggal.startsWith(currentMonthPrefix)).length;
  const totalTamu = guests.length;

  // Average Rating
  const ratedGuests = guests.filter(g => g.rating_kepuasan && g.rating_kepuasan > 0);
  const avgRating =
    ratedGuests.length > 0
      ? (ratedGuests.reduce((acc, g) => acc + (g.rating_kepuasan || 0), 0) / ratedGuests.length).toFixed(1)
      : '5.0';

  // Unit Layanan Breakdown
  const unitCounts: Record<string, number> = {};
  UNIT_LAYANAN_LIST.forEach(u => (unitCounts[u] = 0));
  guests.forEach(g => {
    unitCounts[g.unit_tujuan] = (unitCounts[g.unit_tujuan] || 0) + 1;
  });
  const topUnits = Object.entries(unitCounts).sort((a, b) => b[1] - a[1]);

  // Pekerjaan Breakdown
  const pekerjaanCounts: Record<string, number> = {};
  PEKERJAAN_OPTIONS.forEach(p => (pekerjaanCounts[p] = 0));
  guests.forEach(g => {
    pekerjaanCounts[g.pekerjaan] = (pekerjaanCounts[g.pekerjaan] || 0) + 1;
  });

  const recentGuests = guests.slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-md inline-block mb-2">
            Panel Informasi PTSP Kemenag Lebak
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Selamat Datang, {currentUser.nama}!
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 mt-1">
            {currentUser.jabatan} • NIP: {currentUser.nip} • {currentUser.unit_kerja}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('tamu')}
            className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            + Tambah Tamu Baru
          </button>
          <button
            onClick={() => onNavigateTab('kiosk')}
            className="px-4 py-2 bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 text-xs font-semibold rounded-xl border border-emerald-600/50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Kiosk Publik
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tamu Hari Ini
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-800 font-mono tabular-nums">
              {tamuHariIni}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">orang</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Kunjungan tanggal {today.getDate()} {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tamu Bulan Ini
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-teal-800 font-mono tabular-nums">
              {tamuBulanIni}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">orang</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Periode {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Seluruh Tamu
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-800 font-mono tabular-nums">
              {totalTamu}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">tercatat</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Database buku tamu digital
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Indeks Kepuasan (IKM)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
              {avgRating}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Berdasarkan {ratedGuests.length} responden survei
          </p>
        </div>
      </div>

      {/* Grid: Unit Layanan Distribution & Pekerjaan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Unit Layanan Dituju (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Distribusi Kunjungan per Unit Layanan</h3>
              <p className="text-xs text-slate-500">12 Unit Kerja Kantor Kementerian Agama Kabupaten Lebak</p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Total 12 Unit
            </span>
          </div>

          <div className="space-y-3">
            {topUnits.slice(0, 7).map(([unit, count]) => {
              const pct = totalTamu > 0 ? ((count / totalTamu) * 100).toFixed(0) : '0';
              return (
                <div key={unit} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate pr-2">{unit}</span>
                    <span className="text-slate-500 font-mono tabular-nums shrink-0">
                      {count} tamu ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, Number(pct))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pekerjaan Breakdown (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Kategori Pekerjaan Tamu</h3>
            <p className="text-xs text-slate-500 mb-4">Klasifikasi profesi pengunjung PTSP</p>

            <div className="space-y-3">
              {PEKERJAAN_OPTIONS.map(pek => {
                const count = pekerjaanCounts[pek] || 0;
                const pct = totalTamu > 0 ? ((count / totalTamu) * 100).toFixed(0) : '0';
                return (
                  <div key={pek} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">{pek}</span>
                    <span className="font-mono font-bold text-emerald-800 tabular-nums">
                      {count} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Sistem mencatat pekerjaan spesifik saat pengunjung memilih kategori "Lainnya".
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Riwayat Kunjungan Tamu Terakhir</h3>
            <p className="text-xs text-slate-500">6 data tamu terbaru yang terdaftar di sistem</p>
          </div>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigateTab('laporan')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              Lihat Seluruh Laporan
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">No Antrean</th>
                <th className="py-3 px-4 font-semibold">Waktu Kunjungan</th>
                <th className="py-3 px-4 font-semibold">Nama Tamu</th>
                <th className="py-3 px-4 font-semibold">L/P</th>
                <th className="py-3 px-4 font-semibold">Asal Instansi</th>
                <th className="py-3 px-4 font-semibold">Unit Dituju</th>
                <th className="py-3 px-4 font-semibold">Maksud / Keperluan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentGuests.map(g => (
                <tr key={g.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                    {g.no_antrean}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                    <span className="font-medium">{g.hari}, {g.tanggal}</span>
                    <span className="text-slate-400 block text-[11px] font-mono">{g.jam} WIB</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {g.nama}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {g.pekerjaan === 'Lainnya' && g.pekerjaan_lainnya ? g.pekerjaan_lainnya : g.pekerjaan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      g.gender === 'Pria' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {g.gender}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{g.instansi}</td>
                  <td className="py-3 px-4 text-emerald-900 font-semibold">{g.unit_tujuan}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-xs" title={g.keperluan}>
                    {g.keperluan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
