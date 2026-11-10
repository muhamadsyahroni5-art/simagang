import React from 'react';
import { User, NavigationTab } from '../types';
import { DigitalClock } from './DigitalClock';
import {
  LayoutDashboard,
  BookOpen,
  HeartHandshake,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  Code2,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onLogout: () => void;
  onOpenPhpModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenPhpModal,
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Wordmark & Identity */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/logo_kemenag_71599073.png"
              alt="Logo Kemenag"
              className="h-11 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-emerald-950 tracking-tight leading-none">
                  SI-TAMU Kemenag Lebak
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {isAdmin ? 'Admin' : 'Operator'}
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-700 leading-tight mt-0.5">
                Kemenag Kabupaten Lebak
              </p>
            </div>
          </div>

          {/* Navigation Links with Role Protection */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('tamu')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'tamu'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Buku Tamu
            </button>

            <button
              onClick={() => onSelectTab('survei')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'survei'
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              Survei Kepuasan
            </button>

            {/* Menu Khusus Admin (Otomatis disembunyikan untuk Operator) */}
            {isAdmin && (
              <>
                <button
                  onClick={() => onSelectTab('laporan')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                    activeTab === 'laporan'
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-100'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Report & Cetak
                </button>

                <button
                  onClick={() => onSelectTab('pengaturan')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                    activeTab === 'pengaturan'
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Setting
                </button>
              </>
            )}

            {/* Tombol Kiosk Publik */}
            <button
              onClick={() => onSelectTab('kiosk')}
              className="px-3 py-2 rounded-lg text-emerald-800 hover:bg-emerald-50 flex items-center gap-1.5 transition whitespace-nowrap border border-emerald-200 cursor-pointer ml-1"
              title="Buka tampilan tamu publik (Kiosk)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Mode Kiosk
            </button>

            {/* Tombol Paket PHP & MySQL */}
            <button
              onClick={onOpenPhpModal}
              className="px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition whitespace-nowrap border border-slate-200 cursor-pointer"
              title="Lihat Source Code PHP Murni & Skema Database MySQL"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-700" />
              PHP & MySQL
            </button>
          </nav>

          {/* Right Area: Digital Clock & User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <DigitalClock variant="compact" />
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile Badge & Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                  {currentUser.nama}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[150px]">
                  {currentUser.jabatan}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                title="Keluar dari Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('tamu')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'tamu' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Buku Tamu
          </button>
          <button
            onClick={() => onSelectTab('survei')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'survei' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Survei
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onSelectTab('laporan')}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'laporan' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600'
                }`}
              >
                Report & Cetak
              </button>
              <button
                onClick={() => onSelectTab('pengaturan')}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'pengaturan' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600'
                }`}
              >
                Setting
              </button>
            </>
          )}
          <button
            onClick={() => onSelectTab('kiosk')}
            className="px-2.5 py-1.5 rounded-lg whitespace-nowrap text-emerald-700 bg-emerald-50 border border-emerald-200"
          >
            Kiosk
          </button>
          <button
            onClick={onOpenPhpModal}
            className="px-2.5 py-1.5 rounded-lg whitespace-nowrap text-slate-700 bg-slate-100 border border-slate-200"
          >
            PHP & MySQL
          </button>
        </div>
      </div>
    </header>
  );
};
