import { useState } from 'react';
import { PageHeader, ProtoLabel } from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [lang, setLang] = useState('en');
  const [contrast, setContrast] = useState('NORMAL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Prototype System Settings" subtitle="Display preferences & session configuration" role={user?.department || 'Administration'} />

      <form onSubmit={handleSave} className="bg-white border border-grey-300 p-5 space-y-4 text-[13px] max-w-xl">
        <div className="flex items-center gap-2 border-b border-grey-200 pb-3">
          <SettingsIcon size={18} className="text-navy-900" />
          <h3 className="font-bold text-[14px] text-navy-900">General Display & Operational Preferences</h3>
        </div>

        {saved && (
          <div className="p-2.5 bg-green-100 border border-green-400 text-green-800 text-[12px] font-bold">
            Settings saved successfully.
          </div>
        )}

        <div>
          <label className="block font-semibold text-navy-900 mb-1">Operational Interface Language</label>
          <select value={lang} onChange={e => setLang(e.target.value)} className="w-full border border-grey-300 px-3 py-2 text-[13px]">
            <option value="en">English (Official Operations)</option>
            <option value="hi">हिंदी (Hindi Operations)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-navy-900 mb-1">Visual Contrast & Display Mode</label>
          <select value={contrast} onChange={e => setContrast(e.target.value)} className="w-full border border-grey-300 px-3 py-2 text-[13px]">
            <option value="NORMAL">Standard Government Blue/Grey Contrast</option>
            <option value="HIGH">High-Contrast Operations Mode</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-grey-100">
          <div>
            <span className="font-semibold text-navy-900 block">Auto-refresh Live Feeds</span>
            <span className="text-[11px] text-grey-500">Periodically ping backend for block updates</span>
          </div>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={e => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
        </div>

        <div className="pt-3 border-t border-grey-200 flex justify-end">
          <button type="submit" className="flex items-center gap-1.5 bg-navy-900 text-white font-bold px-4 py-2 hover:bg-navy-800 transition-colors">
            <Save size={14} /> Save Preferences
          </button>
        </div>
      </form>

      <ProtoLabel />
    </div>
  );
}
