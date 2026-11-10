import React from 'react';
import { Guest } from '../types';
import { MONTH_NAMES } from '../data/constants';
import { Printer, Download, X } from 'lucide-react';

interface OfficialPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  mode: 'detail' | 'rekap';
  filterBulan: number; // 0 for all, 1-12
  filterTahun: number; // 0 for all, or 2025/2026/2027
  filterUnit: string;
}

export const OfficialPrintModal: React.FC<OfficialPrintModalProps> = ({
  isOpen,
  onClose,
  guests,
  mode,
  filterBulan,
  filterTahun,
  filterUnit,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const printDateStr = `${today.getDate()} ${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;

  // Period string for header
  let periodStr = '';
  if (filterBulan > 0 && filterTahun > 0) {
    periodStr = `Bulan ${MONTH_NAMES[filterBulan - 1]} Tahun ${filterTahun}`;
  } else if (filterTahun > 0) {
    periodStr = `Tahun ${filterTahun}`;
  } else {
    periodStr = `Tahun ${today.getFullYear()}`;
  }

  // Rekapitulasi calculation if mode === 'rekap'
  const unitStatsMap = new Map<string, { pria: number; wanita: number; total: number }>();
  guests.forEach(g => {
    const current = unitStatsMap.get(g.unit_tujuan) || { pria: 0, wanita: 0, total: 0 };
    if (g.gender === 'Pria') current.pria += 1;
    else current.wanita += 1;
    current.total += 1;
    unitStatsMap.set(g.unit_tujuan, current);
  });
  const rekapList = Array.from(unitStatsMap.entries()).sort((a, b) => b[1].total - a[1].total);
  const totalRekap = guests.length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'KEMENTERIAN AGAMA REPUBLIK INDONESIA\r\n';
    csvContent += 'KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK\r\n';
    csvContent += `LAPORAN DATA KUNJUNGAN BUKU TAMU DIGITAL (SI-TAMU)\r\n`;
    csvContent += `Periode: ${periodStr} - Unit: ${filterUnit || 'Semua Unit'}\r\n\r\n`;

    if (mode === 'detail') {
      csvContent += 'No,No Antrean,Hari & Tanggal,Jam Kunjungan,Nama Tamu,Jenis Kelamin,Pekerjaan,Asal Instansi,Unit Tujuan,Maksud/Keperluan,No HP\r\n';
      guests.forEach((g, idx) => {
        const pek = g.pekerjaan === 'Lainnya' && g.pekerjaan_lainnya ? g.pekerjaan_lainnya : g.pekerjaan;
        csvContent += `"${idx + 1}","${g.no_antrean}","${g.hari}, ${g.tanggal}","${g.jam}","${g.nama}","${g.gender}","${pek}","${g.instansi}","${g.unit_tujuan}","${g.keperluan.replace(/"/g, '""')}","${g.no_hp}"\r\n`;
      });
    } else {
      csvContent += 'No,Unit Layanan Kemenag Lebak,Jumlah Tamu Pria,Jumlah Tamu Wanita,Total Kunjungan,Persentase (%)\r\n';
      rekapList.forEach(([unitName, counts], idx) => {
        const pct = totalRekap > 0 ? ((counts.total / totalRekap) * 100).toFixed(1) : '0';
        csvContent += `"${idx + 1}","${unitName}","${counts.pria}","${counts.wanita}","${counts.total}","${pct}%"\r\n`;
      });
      csvContent += `"","TOTAL SELURUH KUNJUNGAN","","","${totalRekap}","100%"\r\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SI_TAMU_Kemenag_Lebak_${mode}_${periodStr.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-8">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-auto border border-slate-200">
        
        {/* Top Action Bar (No Print) */}
        <div className="no-print bg-slate-100 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 rounded-t-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Pratinjau Dokumen Resmi Kemenag Lebak ({mode === 'detail' ? 'Data Kunjungan' : 'Rekapitulasi Unit'})
            </h3>
            <p className="text-xs text-slate-500">
              Dokumen telah disesuaikan dengan standar Kop Surat resmi & kolom tanda tangan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              Unduh Excel (.csv)
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Exact Official Arial Hierarchy) */}
        <div className="p-8 sm:p-12 overflow-x-auto bg-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          
          {/* KOP SURAT RESMI */}
          <div className="relative pb-2 text-center">
            {/* Logo Kemenag */}
            <div className="absolute left-2 top-0">
              <img
                src="/assets/aistudio/logo_kemenag_71599073.png"
                alt="Logo Kemenag"
                className="w-20 h-auto object-contain"
              />
            </div>

            {/* Hierarchy Header */}
            <div className="pr-4 pl-20">
              <h1
                style={{ fontFamily: 'Arial', fontSize: '14pt', fontWeight: 'bold' }}
                className="tracking-tight text-black leading-tight uppercase"
              >
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </h1>
              <h2
                style={{ fontFamily: 'Arial', fontSize: '12pt', fontWeight: 'bold' }}
                className="tracking-tight text-black leading-tight mt-0.5 uppercase"
              >
                KANTOR KEMENTERIAN AGAMA KABUPATEN LEBAK
              </h2>
              <p
                style={{ fontFamily: 'Arial', fontSize: '9pt' }}
                className="text-black leading-tight mt-1"
              >
                Jl. Siliwangi No. 2, Kel. Muara Ciujung Timur Kec. Rangkasbitung, Kabupaten Lebak, Banten 42314
              </p>
              <p
                style={{ fontFamily: 'Arial', fontSize: '9pt' }}
                className="text-black leading-tight mt-0.5"
              >
                Telp: (0252) 201319 • E-mail: sekjen_416610@kemenag.go.id • site: https://kemenaglebak.com
              </p>
            </div>
          </div>

          {/* Garis Ganda Kop Surat */}
          <div className="mt-2 mb-5">
            <div className="border-t-2 border-black"></div>
            <div className="border-t border-black mt-0.5"></div>
          </div>

          {/* Judul Dokumen */}
          <div className="text-center mb-6">
            <h3 className="text-sm font-bold uppercase underline tracking-wider text-black">
              {mode === 'detail'
                ? 'LAPORAN DATA KUNJUNGAN BUKU TAMU DIGITAL (SI-TAMU)'
                : 'REKAPITULASI KUNJUNGAN TAMU BERDASARKAN UNIT LAYANAN'}
            </h3>
            <p className="text-xs text-black mt-1">
              Periode: {periodStr}
              {filterUnit ? ` • Unit Layanan: ${filterUnit}` : ' • Seluruh Unit Layanan PTSP'}
            </p>
          </div>

          {/* Table Data */}
          {mode === 'detail' ? (
            <table className="w-full border-collapse border border-black text-[9pt]">
              <thead>
                <tr className="bg-slate-100 text-center font-bold">
                  <th className="border border-black p-1.5 w-8">No</th>
                  <th className="border border-black p-1.5 w-28">Hari & Tanggal</th>
                  <th className="border border-black p-1.5 w-16">Jam</th>
                  <th className="border border-black p-1.5">Nama Tamu</th>
                  <th className="border border-black p-1.5 w-10">L/P</th>
                  <th className="border border-black p-1.5">Asal Instansi</th>
                  <th className="border border-black p-1.5">Unit Tujuan</th>
                  <th className="border border-black p-1.5">Maksud / Keperluan</th>
                </tr>
              </thead>
              <tbody>
                {guests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-black p-4 text-center italic text-slate-500">
                      Tidak ada data kunjungan pada filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  guests.map((g, idx) => (
                    <tr key={g.id}>
                      <td className="border border-black p-1 text-center">{idx + 1}</td>
                      <td className="border border-black p-1 text-center whitespace-nowrap">
                        {g.hari}, {g.tanggal}
                      </td>
                      <td className="border border-black p-1 text-center whitespace-nowrap">
                        {g.jam.slice(0, 5)} WIB
                      </td>
                      <td className="border border-black p-1 font-semibold">{g.nama}</td>
                      <td className="border border-black p-1 text-center">
                        {g.gender === 'Pria' ? 'L' : 'P'}
                      </td>
                      <td className="border border-black p-1">{g.instansi}</td>
                      <td className="border border-black p-1">{g.unit_tujuan}</td>
                      <td className="border border-black p-1 text-xs">{g.keperluan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse border border-black text-[9pt]">
              <thead>
                <tr className="bg-slate-100 text-center font-bold">
                  <th className="border border-black p-1.5 w-10">No</th>
                  <th className="border border-black p-1.5">Unit Layanan Dituju</th>
                  <th className="border border-black p-1.5 w-20">Pria</th>
                  <th className="border border-black p-1.5 w-20">Wanita</th>
                  <th className="border border-black p-1.5 w-28">Total Tamu</th>
                  <th className="border border-black p-1.5 w-24">Persentase (%)</th>
                </tr>
              </thead>
              <tbody>
                {rekapList.map(([unitName, counts], idx) => {
                  const pct = totalRekap > 0 ? ((counts.total / totalRekap) * 100).toFixed(1) : '0';
                  return (
                    <tr key={unitName}>
                      <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-black p-1.5 font-medium">{unitName}</td>
                      <td className="border border-black p-1.5 text-center">{counts.pria}</td>
                      <td className="border border-black p-1.5 text-center">{counts.wanita}</td>
                      <td className="border border-black p-1.5 text-center font-bold">{counts.total} orang</td>
                      <td className="border border-black p-1.5 text-center">{pct}%</td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-slate-50">
                  <td colSpan={2} className="border border-black p-1.5 text-center">
                    TOTAL KESELURUHAN
                  </td>
                  <td className="border border-black p-1.5 text-center">
                    {guests.filter(g => g.gender === 'Pria').length}
                  </td>
                  <td className="border border-black p-1.5 text-center">
                    {guests.filter(g => g.gender === 'Wanita').length}
                  </td>
                  <td className="border border-black p-1.5 text-center">{totalRekap} orang</td>
                  <td className="border border-black p-1.5 text-center">100%</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Kolom Tanda Tangan Resmi */}
          <div className="mt-12 pt-4 grid grid-cols-2 text-center text-[9pt] leading-relaxed">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Petugas Pelayanan Terpadu Satu Pintu (PTSP)</p>
              <div className="h-20"></div>
              <p className="font-bold underline">Siti Nurhaliza, S.Kom</p>
              <p>NIP. 199208152019022005</p>
            </div>

            <div>
              <p>Rangkasbitung, {printDateStr}</p>
              <p className="font-semibold">Kepala Subbag Tata Usaha</p>
              <div className="h-20"></div>
              <p className="font-bold underline">Ajrum Firdaus, S.Ag., M.Si</p>
              <p>NIP. 197405121999031002</p>
            </div>
          </div>

        </div>

        {/* Footer (No Print) */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-3 text-right rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
