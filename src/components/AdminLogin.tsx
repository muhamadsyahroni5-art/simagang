import React, { useState } from 'react';
import { User, RunningTextConfig } from '../types';
import { RunningText } from './RunningText';
import { Lock, UserCheck, KeyRound, ArrowLeft, Shield, AlertCircle, Info, Check } from 'lucide-react';

interface AdminLoginProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onBackToKiosk: () => void;
  runningTextConfig: RunningTextConfig;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  users,
  onLoginSuccess,
  onBackToKiosk,
  runningTextConfig,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();
    const found = users.find(u => u.username.toLowerCase() === trimmedUser.toLowerCase());

    if (!found) {
      setErrorMsg('Username tidak terdaftar dalam sistem.');
      return;
    }

    if (found.status === 'nonaktif') {
      setErrorMsg('Akun Anda saat ini dinonaktifkan. Silakan hubungi Administrator.');
      return;
    }

    // Check password
    if (password === found.password || (found.username === 'admin' && password === 'admin123') || (found.username === 'operator' && password === 'operator123')) {
      onLoginSuccess(found);
    } else {
      setErrorMsg('Kata sandi yang Anda masukkan salah.');
    }
  };

  const handleFillDemo = (demoUser: 'admin' | 'operator') => {
    if (demoUser === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      setErrorMsg('');
    } else {
      setUsername('operator');
      setPassword('operator123');
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 flex flex-col justify-between text-slate-100 relative overflow-hidden">
      
      {/* Top Running Text */}
      <div className="z-10">
        <RunningText config={runningTextConfig} target="admin" />
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-slate-800 border border-emerald-500/20 relative">
          
          {/* Logo and Identity */}
          <div className="text-center mb-6">
            <div className="inline-block p-2 rounded-2xl bg-emerald-50 mb-3 border border-emerald-100">
              <img
                src="/assets/aistudio/logo_kemenag_71599073.png"
                alt="Logo Kemenag"
                className="h-16 w-auto object-contain mx-auto"
              />
            </div>
            <h1 className="text-2xl font-black text-emerald-950 tracking-tight">SI-TAMU Kemenag Lebak</h1>
            <p className="text-xs font-bold text-emerald-800">
              Kantor Kementerian Agama Kabupaten Lebak
            </p>
            <p className="text-[11px] text-slate-500 italic mt-0.5">
              "Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              Masuk ke Aplikasi
            </button>
          </form>

          {/* Quick Demo Section (Admin & Operator) */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 text-center mb-2.5">
              Tombol Uji Coba Cepat (Demo Mode):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition flex flex-col items-center cursor-pointer"
              >
                <span>Demo Admin</span>
                <span className="text-[10px] text-emerald-700 font-normal">Wewenang Penuh</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('operator')}
                className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold rounded-xl transition flex flex-col items-center cursor-pointer"
              >
                <span>Demo Operator</span>
                <span className="text-[10px] text-teal-700 font-normal">Wewenang Terbatas</span>
              </button>
            </div>
          </div>

          {/* Back to Public Kiosk Mode Button */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onBackToKiosk}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Mode Tamu Publik (Front Desk Kiosk)
            </button>
          </div>
        </div>
      </div>

      {/* Lupa Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-800 shadow-2xl border border-emerald-100">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3 mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">Pemulihan Akun / Lupa Password</h3>
            <div className="text-xs text-slate-600 mt-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>
                Untuk alasan keamanan dan integritas data aparatur sipil negara di lingkungan Kemenag Lebak:
              </p>
              <p>
                • Silakan menghubungi <strong>Kepala Subbag Tata Usaha</strong> (Ajrum Firdaus, S.Ag., M.Si) atau Administrator PTSP Kemenag Lebak untuk mereset kata sandi.
              </p>
              <p>
                • Akun demo default: <code>admin / admin123</code> atau <code>operator / operator123</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full mt-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-xs text-emerald-200/80 z-10">
        &copy; {new Date().getFullYear()} Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0
      </footer>
    </div>
  );
};
