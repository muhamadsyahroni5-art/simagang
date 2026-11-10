import React, { useState } from 'react';
import { Guest, Gender, PekerjaanCategory, WhatsAppSurveyConfig } from '../types';
import { UNIT_LAYANAN_LIST, PEKERJAAN_OPTIONS } from '../data/constants';
import { SendSurveyModal } from './SendSurveyModal';
import { CheckCircle2, Search, Trash2, Printer, Plus, UserPlus, MessageSquareShare, Check } from 'lucide-react';

interface GuestBookFormViewProps {
  guests: Guest[];
  onAddGuest: (newGuest: Omit<Guest, 'id' | 'no_antrean' | 'hari' | 'tanggal' | 'jam' | 'created_at'>) => Guest;
  onDeleteGuest: (id: string) => void;
  isAdmin: boolean;
  surveyConfig: WhatsAppSurveyConfig;
  onSurveySent: (guestId: string) => void;
}

export const GuestBookFormView: React.FC<GuestBookFormViewProps> = ({
  guests,
  onAddGuest,
  onDeleteGuest,
  isAdmin,
  surveyConfig,
  onSurveySent,
}) => {
  const [showForm, setShowForm] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurveyGuest, setSelectedSurveyGuest] = useState<Guest | null>(null);

  // Form State
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState<Gender>('Pria');
  const [pekerjaan, setPekerjaan] = useState<PekerjaanCategory>('ASN/TNI/POLRI');
  const [pekerjaanLainnya, setPekerjaanLainnya] = useState('');
  const [instansi, setInstansi] = useState('');
  const [unitTujuan, setUnitTujuan] = useState(UNIT_LAYANAN_LIST[0]);
  const [keperluan, setKeperluan] = useState('');
  const [noHp, setNoHp] = useState('');
  const [lastSaved, setLastSaved] = useState<Guest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !instansi.trim() || !keperluan.trim() || !noHp.trim()) return;
    if (pekerjaan === 'Lainnya' && !pekerjaanLainnya.trim()) return;

    const saved = onAddGuest({
      nama: nama.trim(),
      gender,
      pekerjaan,
      pekerjaan_lainnya: pekerjaan === 'Lainnya' ? pekerjaanLainnya.trim() : undefined,
      instansi: instansi.trim(),
      unit_tujuan: unitTujuan,
      keperluan: keperluan.trim(),
      no_hp: noHp.trim(),
    });

    setLastSaved(saved);
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

  const filteredGuests = guests.filter(g => {
    const q = searchQuery.toLowerCase();
    return (
      g.nama.toLowerCase().includes(q) ||
      g.instansi.toLowerCase().includes(q) ||
      g.unit_tujuan.toLowerCase().includes(q) ||
      g.no_antrean.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Manajemen Data Buku Tamu PTSP</h2>
          <p className="text-xs text-slate-500">Pencatatan tamu langsung oleh operator atau sinkronisasi dengan Kiosk</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          {showForm ? 'Sembunyikan Form Entri' : '+ Tampilkan Form Entri Tamu'}
        </button>
      </div>

      {/* Success Notification Bar */}
      {lastSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>
              Tamu <strong>{lastSaved.nama}</strong> berhasil disimpan dengan nomor registrasi <strong>{lastSaved.no_antrean}</strong> ({lastSaved.hari}, {lastSaved.jam} WIB)
            </span>
          </div>
          <button
            onClick={() => setLastSaved(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Entry Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-300" />
              Formulir Input Data Tamu PTSP
            </h3>
            <span className="text-xs text-emerald-200">
              Hari, Tanggal & Jam Tercatat Otomatis
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                1. Nama Lengkap Tamu *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Nama lengkap pengunjung"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* 2. Jenis Kelamin */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                2. Jenis Kelamin *
              </label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="genderForm"
                    value="Pria"
                    checked={gender === 'Pria'}
                    onChange={() => setGender('Pria')}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Pria</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="genderForm"
                    value="Wanita"
                    checked={gender === 'Wanita'}
                    onChange={() => setGender('Wanita')}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Wanita</span>
                </label>
              </div>
            </div>

            {/* 3. Pekerjaan */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                3. Pekerjaan *
              </label>
              <select
                value={pekerjaan}
                onChange={e => setPekerjaan(e.target.value as PekerjaanCategory)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                {PEKERJAAN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {/* Textbox khusus penanda hijau */}
              {pekerjaan === 'Lainnya' && (
                <div className="mt-2.5 p-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    Ketik Nama Pekerjaan Manual *
                  </label>
                  <input
                    type="text"
                    required
                    value={pekerjaanLainnya}
                    onChange={e => setPekerjaanLainnya(e.target.value)}
                    placeholder="Contoh: Guru Honorer, Dosen, Pengurus Ormas"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-400 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* 4. Asal Instansi */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                4. Asal Instansi / Lembaga / Satker / Ormas *
              </label>
              <input
                type="text"
                required
                value={instansi}
                onChange={e => setInstansi(e.target.value)}
                placeholder="Instansi / Satker asal"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* 5. Unit Layanan yang Dituju */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                5. Unit Layanan yang Dituju (12 Unit) *
              </label>
              <select
                value={unitTujuan}
                onChange={e => setUnitTujuan(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                {UNIT_LAYANAN_LIST.map((u, i) => (
                  <option key={u} value={u}>
                    {i + 1}. {u}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. No. HP */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                7. No. HP / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={noHp}
                onChange={e => setNoHp(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* 6. Maksud / Tujuan (Span 2) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                6. Maksud / Tujuan / Keperluan Kunjungan *
              </label>
              <textarea
                rows={2}
                required
                value={keperluan}
                onChange={e => setKeperluan(e.target.value)}
                placeholder="Keperluan kunjungan ke kantor Kemenag Lebak"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Simpan Data Buku Tamu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guest Table with Live Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari tamu berdasarkan nama, instansi, atau no antrean..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Menampilkan {filteredGuests.length} dari total {guests.length} tamu
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">No</th>
                <th className="py-3 px-4 font-semibold">No Antrean</th>
                <th className="py-3 px-4 font-semibold">Hari & Waktu</th>
                <th className="py-3 px-4 font-semibold">Nama Tamu</th>
                <th className="py-3 px-4 font-semibold">L/P</th>
                <th className="py-3 px-4 font-semibold">Pekerjaan</th>
                <th className="py-3 px-4 font-semibold">Instansi</th>
                <th className="py-3 px-4 font-semibold">Unit Tujuan</th>
                <th className="py-3 px-4 font-semibold">Keperluan</th>
                <th className="py-3 px-4 font-semibold">No HP</th>
                <th className="py-3 px-4 font-semibold text-center">Status Survei</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi Layanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data tamu yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {g.no_antrean}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <div>{g.hari}, {g.tanggal}</div>
                      <div className="text-[11px] font-mono text-slate-400">{g.jam} WIB</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{g.nama}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        g.gender === 'Pria' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {g.gender === 'Pria' ? 'L' : 'P'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {g.pekerjaan === 'Lainnya' && g.pekerjaan_lainnya ? g.pekerjaan_lainnya : g.pekerjaan}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{g.instansi}</td>
                    <td className="py-3 px-4 text-emerald-900 font-semibold">{g.unit_tujuan}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={g.keperluan}>
                      {g.keperluan}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">{g.no_hp}</td>
                    <td className="py-3 px-4 text-center">
                      {g.survey_sent_at ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3" />
                          Terkirim WA
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Belum Dikirim</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSurveyGuest(g)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold rounded-lg text-xs transition cursor-pointer"
                          title="Kirim Link Survei Kepuasan (IKM) ke WhatsApp Tamu"
                        >
                          <MessageSquareShare className="w-3.5 h-3.5" />
                          <span>Kirim Survei</span>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteGuest(g.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                            title="Hapus Data Tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Survey Modal */}
      <SendSurveyModal
        isOpen={Boolean(selectedSurveyGuest)}
        onClose={() => setSelectedSurveyGuest(null)}
        guest={selectedSurveyGuest}
        surveyConfig={surveyConfig}
        onSurveySent={(guestId) => {
          onSurveySent(guestId);
          setSelectedSurveyGuest(null);
        }}
      />
    </div>
  );
};
