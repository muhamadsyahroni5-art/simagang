import React, { useState } from 'react';
import { Guest } from '../types';
import { UNIT_LAYANAN_LIST, MONTH_NAMES } from '../data/constants';
import { OfficialPrintModal } from './OfficialPrintModal';
import {
  Printer,
  Download,
  Filter,
  FileSpreadsheet,
  BarChart3,
  Search,
  CheckCircle,
} from 'lucide-react';

interface ReportsViewProps {
  guests: Guest[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ guests }) => {
  const [activeTab, setActiveTab] = useState<'kunjungan' | 'rekapitulasi'>('kunjungan');
  
  // Filters
  const [filterBulan, setFilterBulan] = useState<number>(0); // 0 = Semua, 1-12
  const [filterTahun, setFilterTahun] = useState<number>(2026); // 2025, 2026, 2027
  const [filterUnit, setFilterUnit] = useState<string>(''); // empty = Semua
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal Cetak Resmi
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printMode, setPrintMode] = useState<'detail' | 'rekap'>('detail');

  // Filter application
  const filteredGuests = guests.filter(g => {
    // Tanggal format: YYYY-MM-DD
    const [yearStr, monthStr] = g.tanggal.split('-');
    const guestYear = parseInt(yearStr, 10);
    const guestMonth = parseInt(monthStr, 10);

    if (filterTahun > 0 && guestYear !== filterTahun) return false;
    if (filterBulan > 0 && guestMonth !== filterBulan) return false;
    if (filterUnit && g.unit_tujuan !== filterUnit) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        g.nama.toLowerCase().includes(q) ||
        g.instansi.toLowerCase().includes(q) ||
        g.keperluan.toLowerCase().includes(q) ||
        g.no_antrean.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Rekapitulasi per 12 Unit Layanan
  const rekapData = UNIT_LAYANAN_LIST.map((unitName, index) => {
    const guestsInUnit = filteredGuests.filter(g => g.unit_tujuan === unitName);
    const pria = guestsInUnit.filter(g => g.gender === 'Pria').length;
    const wanita = guestsInUnit.filter(g => g.gender === 'Wanita').length;
    const total = guestsInUnit.length;
    const pct = filteredGuests.length > 0 ? ((total / filteredGuests.length) * 100).toFixed(1) : '0';

    return {
      no: index + 1,
      unitName,
      pria,
      wanita,
      total,
      pct,
    };
  });

  const totalFilteredPria = filteredGuests.filter(g => g.gender === 'Pria').length;
  const totalFilteredWanita = filteredGuests.filter(g => g.gender === 'Wanita').length;

  const handleOpenPrint = (mode: 'detail' | 'rekap') => {
    setPrintMode(mode);
    setIsPrintModalOpen(true);
  };

  const handleExportCSV = () => {
    let csvContent = '\uFEFF';
    csvContent += 'KEMENTERIAN AGAMA REPUBLIK INDONESIA\r\n';
    csvContent += 'KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK\r\n';
    csvContent += 'LAPORAN DATA KUNJUNGAN BUKU TAMU DIGITAL (SI-TAMU)\r\n';
    csvContent += `Periode: Bulan ${filterBulan === 0 ? 'Semua' : MONTH_NAMES[filterBulan - 1]} Tahun ${filterTahun}\r\n\r\n`;

    if (activeTab === 'kunjungan') {
      csvContent += 'No,No Antrean,Hari & Tanggal,Jam,Nama Tamu,Jenis Kelamin,Pekerjaan,Asal Instansi,Unit Dituju,Maksud Keperluan,No HP\r\n';
      filteredGuests.forEach((g, idx) => {
        const pek = g.pekerjaan === 'Lainnya' && g.pekerjaan_lainnya ? g.pekerjaan_lainnya : g.pekerjaan;
        csvContent += `"${idx + 1}","${g.no_antrean}","${g.hari}, ${g.tanggal}","${g.jam}","${g.nama}","${g.gender}","${pek}","${g.instansi}","${g.unit_tujuan}","${g.keperluan.replace(/"/g, '""')}","${g.no_hp}"\r\n`;
      });
    } else {
      csvContent += 'No,Unit Layanan Kemenag Lebak,Pria,Wanita,Total Tamu,Persentase (%)\r\n';
      rekapData.forEach(r => {
        csvContent += `"${r.no}","${r.unitName}","${r.pria}","${r.wanita}","${r.total}","${r.pct}%"\r\n`;
      });
      csvContent += `"","TOTAL SELURUH KUNJUNGAN","${totalFilteredPria}","${totalFilteredWanita}","${filteredGuests.length}","100%"\r\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_SI_TAMU_Kemenag_Lebak_${activeTab}_${filterTahun}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Menu Khusus Admin
              </span>
              <span className="text-xs text-slate-500">• Hak Akses Penuh</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Report Data Tamu & Form Cetak Dokumen Resmi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kop Surat resmi Kemenag Lebak, filter berkala, tanda tangan pejabat, dan ekspor data Excel / PDF
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              Unduh Excel (.csv)
            </button>
            <button
              onClick={() => handleOpenPrint(activeTab === 'kunjungan' ? 'detail' : 'rekap')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen Resmi
            </button>
          </div>
        </div>

        {/* 2 Tabs Segmented Control */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('kunjungan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'kunjungan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Tab 1: Report Data Kunjungan Tamu
          </button>
          <button
            onClick={() => setActiveTab('rekapitulasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'rekapitulasi'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Tab 2: Rekapitulasi Data Kunjungan Unit
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filter Laporan Data:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter Bulan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter per Bulan:
            </label>
            <select
              value={filterBulan}
              onChange={e => setFilterBulan(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white cursor-pointer"
            >
              <option value={0}>Semua Bulan (Januari s.d Desember)</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tahun */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter per Tahun:
            </label>
            <select
              value={filterTahun}
              onChange={e => setFilterTahun(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white cursor-pointer"
            >
              <option value={0}>Semua Tahun</option>
              <option value={2025}>Tahun 2025</option>
              <option value={2026}>Tahun 2026</option>
              <option value={2027}>Tahun 2027</option>
            </select>
          </div>

          {/* Filter Unit Layanan (12 Units) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter Unit Layanan:
            </label>
            <select
              value={filterUnit}
              onChange={e => setFilterUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white cursor-pointer"
            >
              <option value="">Semua Unit Layanan (12 Unit)</option>
              {UNIT_LAYANAN_LIST.map((u, i) => (
                <option key={u} value={u}>
                  {i + 1}. {u}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Pencarian Cepat:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama / instansi..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Filter Indicator */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menemukan <strong>{filteredGuests.length}</strong> data kunjungan tamu pada filter ini.
          </span>
          {(filterBulan > 0 || filterUnit || searchQuery) && (
            <button
              onClick={() => {
                setFilterBulan(0);
                setFilterUnit('');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Content for Tab 1: Detailed Guest Report */}
      {activeTab === 'kunjungan' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tabel Riwayat Kunjungan Tamu Resmi
              </h3>
              <p className="text-xs text-slate-500">
                Kolom: No, Hari & Tanggal, Jam Kunjungan, Nama Tamu, Gender, Asal Instansi, Unit yang Dituju, Maksud/Keperluan
              </p>
            </div>
            <button
              onClick={() => handleOpenPrint('detail')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Pratinjau Cetak
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-3 font-semibold text-center w-10">No</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Hari & Tanggal</th>
                  <th className="py-3 px-3 font-semibold text-center">Jam</th>
                  <th className="py-3 px-4 font-semibold">Nama Tamu</th>
                  <th className="py-3 px-3 font-semibold text-center">L/P</th>
                  <th className="py-3 px-4 font-semibold">Asal Instansi</th>
                  <th className="py-3 px-4 font-semibold">Unit yang Dituju</th>
                  <th className="py-3 px-4 font-semibold">Maksud / Keperluan</th>
                  <th className="py-3 px-3 font-semibold text-center">No HP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Tidak ada data kunjungan pada filter periode ini.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((g, idx) => (
                    <tr key={g.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                        <span className="font-semibold">{g.hari}</span>, {g.tanggal}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600 whitespace-nowrap">
                        {g.jam.slice(0, 5)} WIB
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {g.nama}
                        <span className="block text-[11px] font-normal text-slate-500">
                          {g.pekerjaan === 'Lainnya' && g.pekerjaan_lainnya ? g.pekerjaan_lainnya : g.pekerjaan}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          g.gender === 'Pria' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {g.gender === 'Pria' ? 'L' : 'P'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{g.instansi}</td>
                      <td className="py-3 px-4 text-emerald-950 font-bold">{g.unit_tujuan}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-sm" title={g.keperluan}>
                        {g.keperluan}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600 whitespace-nowrap">
                        {g.no_hp}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for Tab 2: Rekapitulasi Data Kunjungan */}
      {activeTab === 'rekapitulasi' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tabel Rekapitulasi Data Kunjungan Berdasarkan Unit Layanan Dituju
              </h3>
              <p className="text-xs text-slate-500">
                Total data tamu terpilah berdasarkan 12 unit kerja dan jenis kelamin
              </p>
            </div>
            <button
              onClick={() => handleOpenPrint('rekap')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Rekapitulasi
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-center w-12">No</th>
                  <th className="py-3 px-6 font-semibold">Unit Layanan Kemenag Lebak</th>
                  <th className="py-3 px-4 font-semibold text-center w-28">Tamu Pria</th>
                  <th className="py-3 px-4 font-semibold text-center w-28">Tamu Wanita</th>
                  <th className="py-3 px-4 font-semibold text-center w-36">Total Kunjungan</th>
                  <th className="py-3 px-4 font-semibold text-center w-32">Persentase (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rekapData.map(r => (
                  <tr key={r.unitName} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{r.no}</td>
                    <td className="py-3 px-6 font-bold text-slate-800">{r.unitName}</td>
                    <td className="py-3 px-4 text-center font-mono">{r.pria} orang</td>
                    <td className="py-3 px-4 text-center font-mono">{r.wanita} orang</td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-emerald-800">
                      {r.total} orang
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-slate-600">
                      {r.pct}%
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-emerald-50/80 font-bold text-slate-900 border-t-2 border-emerald-300">
                  <td colSpan={2} className="py-3 px-6 text-center text-emerald-950 uppercase tracking-wider">
                    Total Keseluruhan Tamu
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-950">
                    {totalFilteredPria} orang
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-950">
                    {totalFilteredWanita} orang
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-950 text-sm">
                    {filteredGuests.length} orang
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-950">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Print Modal */}
      <OfficialPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        guests={filteredGuests}
        mode={printMode}
        filterBulan={filterBulan}
        filterTahun={filterTahun}
        filterUnit={filterUnit}
      />

    </div>
  );
};
