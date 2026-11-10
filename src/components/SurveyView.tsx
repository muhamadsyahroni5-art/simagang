import React, { useState } from 'react';
import { Guest } from '../types';
import { Star, MessageSquareHeart, CheckCircle2, TrendingUp, ThumbsUp } from 'lucide-react';

interface SurveyViewProps {
  guests: Guest[];
  onUpdateGuestRating: (guestId: string, rating: number, ulasan: string) => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ guests, onUpdateGuestRating }) => {
  const [selectedGuestId, setSelectedGuestId] = useState(guests[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [ulasan, setUlasan] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const ratedGuests = guests.filter(g => g.rating_kepuasan && g.rating_kepuasan > 0);
  const avgRating =
    ratedGuests.length > 0
      ? (ratedGuests.reduce((acc, g) => acc + (g.rating_kepuasan || 0), 0) / ratedGuests.length).toFixed(1)
      : '5.0';

  // Breakdown 5 stars down to 1
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = ratedGuests.filter(g => g.rating_kepuasan === stars).length;
    const pct = ratedGuests.length > 0 ? ((count / ratedGuests.length) * 100).toFixed(0) : '0';
    return { stars, count, pct };
  });

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuestId) return;

    onUpdateGuestRating(selectedGuestId, rating, ulasan);
    setSuccessNotice(true);
    setUlasan('');
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-md inline-block mb-2">
            Survei Kepuasan Masyarakat (IKM)
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Indeks Kepuasan Layanan PTSP Kemenag Lebak
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
            Pengukuran kepuasan masyarakat terhadap mutu layanan terpadu satu pintu demi mewujudkan pelayanan yang prima, akuntabel, dan berintegritas.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center shrink-0">
          <p className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider">Nilai Rata-rata IKM</p>
          <div className="text-3xl font-extrabold text-amber-300 font-mono flex items-center justify-center gap-1 mt-1">
            <Star className="w-6 h-6 fill-amber-300" />
            <span>{avgRating}</span>
            <span className="text-xs text-emerald-200 font-normal">/ 5.0</span>
          </div>
          <p className="text-[10px] text-emerald-200 mt-1">Kategori: Sangat Baik</p>
        </div>
      </div>

      {/* Grid: Rating Breakdown & Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rating Breakdown Card (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Distribusi Penilaian Bintang</h3>
            <p className="text-xs text-slate-500 mb-4">Total {ratedGuests.length} responden survei</p>

            <div className="space-y-3">
              {ratingDistribution.map(item => (
                <div key={item.stars} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <span>{item.stars}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                    <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                      {item.count} tamu ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(4, Number(item.pct))}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl">
            <ThumbsUp className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium">
              Tingkat kepuasan masyarakat mencapai <strong>98.4%</strong> dengan indeks kepuasan sangat tinggi.
            </span>
          </div>
        </div>

        {/* Input Form for PTSP Desk (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Input / Tambah Penilaian Kepuasan Tamu</h3>
            <p className="text-xs text-slate-500">Pilih tamu dan simpan umpan balik kepuasan</p>
          </div>

          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Penilaian dan ulasan tamu berhasil diperbarui dalam sistem!</span>
            </div>
          )}

          <form onSubmit={handleSaveSurvey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Pilih Tamu Terdaftar
              </label>
              <select
                value={selectedGuestId}
                onChange={e => setSelectedGuestId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                {guests.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.no_antrean} - {g.nama} ({g.instansi} • {g.unit_tujuan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Tingkat Kepuasan Pelayanan
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRating(st)}
                    className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 cursor-pointer ${
                      rating === st
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        st <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                      }`}
                    />
                    <span className="text-[10px] font-bold">
                      {st === 5 ? 'Sangat Puas' : st === 4 ? 'Puas' : st === 3 ? 'Cukup' : st === 2 ? 'Kurang' : 'Buruk'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Ulasan / Saran / Catatan Pengunjung
              </label>
              <textarea
                rows={3}
                value={ulasan}
                onChange={e => setUlasan(e.target.value)}
                placeholder="Tuliskan masukan atau testimoni pengunjung terkait kecepatan dan keramahan petugas PTSP..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Simpan Penilaian Kepuasan
            </button>
          </form>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Daftar Testimoni & Ulasan Tamu</h3>
            <p className="text-xs text-slate-500">Transparansi umpan balik pelayanan masyarakat</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {ratedGuests.length} Ulasan
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ratedGuests.map(g => (
            <div key={g.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: g.rating_kepuasan || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{g.hari}, {g.tanggal}</span>
                </div>
                <p className="text-xs text-slate-700 italic">
                  "{g.ulasan_kepuasan || 'Pelayanan sangat memuaskan, cepat dan ramah.'}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs flex justify-between items-center text-slate-600">
                <span className="font-bold text-slate-800">{g.nama}</span>
                <span className="text-[11px] text-emerald-800 font-medium">{g.unit_tujuan}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
