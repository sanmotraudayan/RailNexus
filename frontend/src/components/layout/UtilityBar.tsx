import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SYSTEM_UPDATES = [
  'LIVE SYSTEM SIMULATION: NDLS-CNB Corridor track health monitoring active.',
  'BLOCK UPDATE: Block #BLK-104 (TRK) granted on Section 102 (14:00 - 16:30).',
  'AI OPTIMIZATION: Spatial co-location active for Block #BLK-105 (Track + Signal).',
  'TRAIN ALERT: Train #12951 (Rajdhani Exp) delay reduced by 14 mins via slot adjustment.',
  'SYSTEM NOTICE: All metrics generated under SIH 2026 Prototype Simulation mode.'
];

const UtilityBar: React.FC = () => {
  const [updateIdx, setUpdateIdx] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setUpdateIdx((prev) => (prev + 1) % SYSTEM_UPDATES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-ink-900 text-white h-8 flex items-center justify-between px-6 text-[11px] w-full">
      <div className="flex items-center space-x-4">
        <button className="hover:underline focus:ring-2 focus:ring-blue-600 focus:outline-none">{t('Skip to main content')}</button>
        <button className="hover:underline focus:ring-2 focus:ring-blue-600 focus:outline-none">{t('Screen Reader Access')}</button>
      </div>

      {/* Live Simulation Operational Ticker */}
      <div className="hidden md:flex items-center gap-2 max-w-lg truncate bg-black/40 px-3 py-0.5 border border-white/10 rounded-sm">
        <Activity size={12} className="text-saffron-500 animate-pulse shrink-0" />
        <span className="text-[10.5px] font-mono text-grey-200 truncate transition-all duration-500">
          {SYSTEM_UPDATES[updateIdx]}
        </span>
      </div>

      <div className="flex space-x-4 items-center">
        <div className="flex space-x-2">
          <button className="hover:underline focus:ring-2 focus:ring-blue-600 focus:outline-none" aria-label="Decrease font size">A-</button>
          <button className="hover:underline focus:ring-2 focus:ring-blue-600 focus:outline-none" aria-label="Normal font size">A</button>
          <button className="hover:underline focus:ring-2 focus:ring-blue-600 focus:outline-none" aria-label="Increase font size">A+</button>
        </div>
        <button className="hover:underline focus:ring-2 focus:ring-blue-600 focus:outline-none">{t('High Contrast')}</button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
          className="bg-ink-900 text-white border border-grey-600 px-1 py-0.5 focus:ring-2 focus:ring-blue-600 text-[11px] cursor-pointer font-bold"
          aria-label="Language selection"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
    </div>
  );
};

export default UtilityBar;
