/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Guest, User, RunningTextConfig, NavigationTab, WhatsAppSurveyConfig } from './types';
import {
  INITIAL_GUESTS,
  INITIAL_USERS,
  DEFAULT_RUNNING_TEXT,
  DEFAULT_WA_SURVEY_CONFIG,
  DAY_NAMES,
  MONTH_NAMES,
} from './data/constants';
import { Navbar } from './components/Navbar';
import { RunningText } from './components/RunningText';
import { KioskGuestView } from './components/KioskGuestView';
import { AdminLogin } from './components/AdminLogin';
import { DashboardView } from './components/DashboardView';
import { GuestBookFormView } from './components/GuestBookFormView';
import { SurveyView } from './components/SurveyView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { PhpMySqlPackageModal } from './components/PhpMySqlPackageModal';

export default function App() {
  // 1. Persistent Guests State
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const stored = localStorage.getItem('sitamu_guests_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_GUESTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitamu_guests_v1', JSON.stringify(guests));
    } catch (e) {
      console.warn('Failed saving guests to localStorage', e);
    }
  }, [guests]);

  // 2. Persistent Users State
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('sitamu_users_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitamu_users_v1', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed saving users to localStorage', e);
    }
  }, [users]);

  // 3. Persistent Running Text State
  const [runningTextConfig, setRunningTextConfig] = useState<RunningTextConfig>(() => {
    try {
      const stored = localStorage.getItem('sitamu_running_text_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_RUNNING_TEXT;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitamu_running_text_v1', JSON.stringify(runningTextConfig));
    } catch (e) {
      console.warn('Failed saving running text to localStorage', e);
    }
  }, [runningTextConfig]);

  // 4. Persistent WhatsApp Survey Configuration
  const [surveyConfig, setSurveyConfig] = useState<WhatsAppSurveyConfig>(() => {
    try {
      const stored = localStorage.getItem('sitamu_wa_survey_config_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_WA_SURVEY_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sitamu_wa_survey_config_v1', JSON.stringify(surveyConfig));
    } catch (e) {
      console.warn('Failed saving survey config to localStorage', e);
    }
  }, [surveyConfig]);

  // 5. Session & Navigation State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem('sitamu_current_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    return currentUser ? 'dashboard' : 'kiosk';
  });

  // Modal PHP & MySQL Source Package
  const [isPhpModalOpen, setIsPhpModalOpen] = useState(false);

  // Sync session storage
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('sitamu_current_user', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('sitamu_current_user');
    setActiveTab('login');
  };

  // Add Guest with Automatic Date, Time, and Queue Number
  const handleAddGuest = (
    guestData: Omit<Guest, 'id' | 'no_antrean' | 'hari' | 'tanggal' | 'jam' | 'created_at'>
  ): Guest => {
    const now = new Date();
    const dayName = DAY_NAMES[now.getDay()];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const tanggalStr = `${year}-${month}-${date}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const jamStr = `${hours}:${minutes}:${seconds}`;

    // Queue sequence for today
    const todayGuestsCount = guests.filter(g => g.tanggal === tanggalStr).length;
    const seq = String(todayGuestsCount + 1).padStart(3, '0');
    const noAntrean = `TMG-${year}${month}${date}-${seq}`;

    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      no_antrean: noAntrean,
      hari: dayName,
      tanggal: tanggalStr,
      jam: jamStr,
      created_at: now.toISOString(),
    };

    setGuests(prev => [newGuest, ...prev]);
    return newGuest;
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateGuestRating = (guestId: string, rating: number, ulasan: string) => {
    setGuests(prev =>
      prev.map(g => (g.id === guestId ? { ...g, rating_kepuasan: rating, ulasan_kepuasan: ulasan } : g))
    );
  };

  // User Management Handlers
  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (id: string, updated: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleSurveySent = (guestId: string) => {
    setGuests(prev =>
      prev.map(g => (g.id === guestId ? { ...g, survey_sent_at: new Date().toISOString() } : g))
    );
  };

  // Safe Navigation with Guard Check for Operator
  const handleSelectTab = (tab: NavigationTab) => {
    // If Operator tries to access Admin-only tab
    if (currentUser?.role === 'operator' && (tab === 'laporan' || tab === 'pengaturan')) {
      alert('Akses Dibatasi: Menu ini hanya dapat diakses oleh Administrator Sistem.');
      setActiveTab('dashboard');
      return;
    }
    setActiveTab(tab);
  };

  // 1. Kiosk View (Public Visitor Mode)
  if (activeTab === 'kiosk') {
    return (
      <>
        <KioskGuestView
          onAddGuest={handleAddGuest}
          onNavigateLogin={() => setActiveTab('login')}
          onOpenPhpModal={() => setIsPhpModalOpen(true)}
          runningTextConfig={runningTextConfig}
        />
        <PhpMySqlPackageModal
          isOpen={isPhpModalOpen}
          onClose={() => setIsPhpModalOpen(false)}
        />
      </>
    );
  }

  // 2. Login View
  if (activeTab === 'login' || !currentUser) {
    return (
      <>
        <AdminLogin
          users={users}
          onLoginSuccess={handleLogin}
          onBackToKiosk={() => setActiveTab('kiosk')}
          runningTextConfig={runningTextConfig}
        />
        <PhpMySqlPackageModal
          isOpen={isPhpModalOpen}
          onClose={() => setIsPhpModalOpen(false)}
        />
      </>
    );
  }

  // 3. Authenticated Admin & Operator Portal
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      <div>
        {/* Top Official Running Text */}
        <RunningText config={runningTextConfig} target="admin" />

        {/* Navbar */}
        <Navbar
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
          onOpenPhpModal={() => setIsPhpModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              guests={guests}
              currentUser={currentUser}
              onNavigateTab={(tab) => {
                if (tab === 'laporan' && !isAdmin) {
                  alert('Akses Dibatasi: Khusus Administrator');
                  return;
                }
                setActiveTab(tab);
              }}
            />
          )}

          {activeTab === 'tamu' && (
            <GuestBookFormView
              guests={guests}
              onAddGuest={handleAddGuest}
              onDeleteGuest={handleDeleteGuest}
              isAdmin={isAdmin}
              surveyConfig={surveyConfig}
              onSurveySent={handleSurveySent}
            />
          )}

          {activeTab === 'survei' && (
            <SurveyView
              guests={guests}
              onUpdateGuestRating={handleUpdateGuestRating}
            />
          )}

          {activeTab === 'laporan' && isAdmin && (
            <ReportsView guests={guests} />
          )}

          {activeTab === 'pengaturan' && isAdmin && (
            <SettingsView
              runningTextConfig={runningTextConfig}
              onUpdateRunningText={setRunningTextConfig}
              surveyConfig={surveyConfig}
              onUpdateSurveyConfig={setSurveyConfig}
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            &copy; {new Date().getFullYear()} Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0
          </span>
          <span className="text-emerald-800 font-semibold italic">
            "Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"
          </span>
        </div>
      </footer>

      {/* Modal Source Code PHP & MySQL */}
      <PhpMySqlPackageModal
        isOpen={isPhpModalOpen}
        onClose={() => setIsPhpModalOpen(false)}
      />
    </div>
  );
}
