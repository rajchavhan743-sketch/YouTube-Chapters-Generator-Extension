import React, { useState } from 'react';
import { LEMON_SQUEEZY_URL } from '../config';

interface ProFeaturesProps {
  isPro: boolean;
  remainingGenerations: number;
  setLicenseKey: (key: string | null) => void;
}

export const ProFeatures: React.FC<ProFeaturesProps> = ({ isPro, remainingGenerations, setLicenseKey }) => {
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      setLicenseKey(keyInput.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (isPro) {
    return (
      <div className="p-3 text-center text-sm text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-500/50">
        ✨ Pro Activated! Enjoy unlimited generations.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-slate-50 border border-slate-200 rounded-lg dark:bg-slate-900/50 dark:border-slate-700">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          You have <span className="font-bold text-indigo-600 dark:text-indigo-400">{remainingGenerations}</span> free generations remaining this month.
        </p>
        <a
          href={LEMON_SQUEEZY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full p-3 mt-3 text-center text-white bg-emerald-500 rounded-lg shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:ring-offset-slate-800 transition-colors"
        >
          <span className="block text-sm font-semibold">Upgrade to Pro</span>
          <div className="flex items-baseline justify-center gap-2 mt-1">
              <span className="text-xl font-bold">$6/month</span>
              <span className="text-sm line-through text-emerald-200">$9/month</span>
          </div>
          <span className="block text-xs mt-1 font-medium text-emerald-100">Early Bird Offer</span>
        </a>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-slate-50 text-xs text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            Already have a license?
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
          <label htmlFor="license-key-input" className="sr-only">License Key</label>
          <input
          id="license-key-input"
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Enter your license key"
          className="block w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 transition"
        />
        <button
          onClick={handleSaveKey}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 transition-colors whitespace-nowrap"
        >
          {saved ? 'Saved!' : 'Save Key'}
        </button>
      </div>
    </div>
  );
};