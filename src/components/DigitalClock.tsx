import React, { useState, useEffect } from 'react';
import { DAY_NAMES, MONTH_NAMES } from '../data/constants';

interface DigitalClockProps {
  variant?: 'compact' | 'kiosk' | 'badge';
}

export const DigitalClock: React.FC<DigitalClockProps> = ({ variant = 'compact' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = DAY_NAMES[time.getDay()];
  const dateNum = time.getDate();
  const monthName = MONTH_NAMES[time.getMonth()];
  const yearNum = time.getFullYear();

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  if (variant === 'kiosk') {
    return (
      <div className="bg-emerald-950/40 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 md:p-5 text-center text-white shadow-lg">
        <div className="text-xs md:text-sm font-medium tracking-wide text-emerald-200 uppercase">
          {dayName}, {dateNum} {monthName} {yearNum}
        </div>
        <div className="text-3xl md:text-5xl font-extrabold font-mono tracking-tight text-white mt-1 tabular-nums">
          <span>{hours}</span>
          <span className="text-emerald-400 animate-pulse">:</span>
          <span>{minutes}</span>
          <span className="text-emerald-400 animate-pulse">:</span>
          <span>{seconds}</span>
          <span className="text-sm md:text-lg font-bold text-emerald-300 ml-2">WIB</span>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium tabular-nums">
        <span className="font-semibold">{dayName}, {dateNum} {monthName} {yearNum}</span>
        <span className="text-slate-300">|</span>
        <span className="font-mono font-bold text-emerald-800">{hours}:{minutes}:{seconds} WIB</span>
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="text-[11px] font-semibold text-slate-500">
        {dayName}, {dateNum} {monthName} {yearNum}
      </div>
      <div className="text-sm md:text-base font-extrabold font-mono text-emerald-800 tabular-nums">
        <span>{hours}:{minutes}:{seconds}</span>
        <span className="text-xs text-emerald-600 font-bold ml-1">WIB</span>
      </div>
    </div>
  );
};
