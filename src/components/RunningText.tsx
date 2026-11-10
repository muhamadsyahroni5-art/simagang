import React from 'react';
import { RunningTextConfig } from '../types';

interface RunningTextProps {
  config: RunningTextConfig;
  target?: 'kiosk' | 'admin';
}

export const RunningText: React.FC<RunningTextProps> = ({ config, target = 'kiosk' }) => {
  if (!config.enabled) {
    return null;
  }

  const message = target === 'kiosk' ? config.text_kiosk : config.text_admin;

  // Theme styling
  let themeStyles = 'bg-emerald-900 text-emerald-100 border-emerald-700/60';
  let badgeStyles = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40';

  if (config.theme === 'dark') {
    themeStyles = 'bg-slate-950 text-slate-100 border-slate-800';
    badgeStyles = 'bg-slate-900 text-slate-300 border-slate-700';
  } else if (config.theme === 'gold') {
    themeStyles = 'bg-amber-900 text-amber-50 border-amber-700/80';
    badgeStyles = 'bg-amber-950/80 text-amber-300 border-amber-600/50';
  }

  const durationSec = Math.max(8, Math.min(60, config.speed_seconds || 25));

  return (
    <div className={`w-full py-2 px-4 border-b text-xs flex items-center gap-3 overflow-hidden select-none ${themeStyles}`}>
      <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${badgeStyles}`}>
        {target === 'kiosk' ? 'Info Pelayanan' : 'Pengumuman Resmi'}
      </span>
      <div className="flex-1 overflow-hidden relative whitespace-nowrap group">
        <div
          className="inline-block animate-marquee group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${durationSec}s` }}
        >
          <span className="font-medium mr-12">{message}</span>
          <span className="font-medium mr-12 opacity-80">{message}</span>
        </div>
      </div>
    </div>
  );
};
