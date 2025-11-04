
import React, { useState, useCallback, useMemo } from 'react';
import { Card } from './components/Card';
import { Spinner } from './components/Spinner';
import { CopyIcon, CheckIcon } from './components/Icons';
import { ProFeatures } from './components/ProFeatures';
import { History } from './components/History';
import { useLocalStorage } from './hooks/useLocalStorage';

const N8N_WEBHOOK_URL = 'https://n8n-n8n.ur1bfo.easypanel.host/webhook/timestamps';
const FREE_GENERATIONS_LIMIT = 5;
const FREE_GENERATIONS_WINDOW = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export interface Generation {
  id: number;
  url: string;
  chapters: string;
}

interface Usage {
  count: number;
  firstUsageTimestamp: number;
}

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [chapters, setChapters] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [licenseKey, setLicenseKey] = useLocalStorage<string | null>('licenseKey', null);
  const [history, setHistory] = useLocalStorage<Generation[]>('generationHistory', []);
  const [usage, setUsage] = useLocalStorage<Usage>('freeUsage', { count: 0, firstUsageTimestamp: 0 });

  const isPro = useMemo(() => !!licenseKey, [licenseKey]);
  
  const remainingGenerations = useMemo(() => {
    const now = Date.now();
    if (!usage.firstUsageTimestamp || (now - usage.firstUsageTimestamp > FREE_GENERATIONS_WINDOW)) {
      return FREE_GENERATIONS_LIMIT;
    }
    return Math.max(0, FREE_GENERATIONS_LIMIT - usage.count);
  }, [usage]);

  // FIX: Corrected the type of the event parameter from HTMLFormEvent to HTMLFormElement.
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoUrl.trim()) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    // Check usage limits for free users
    if (!isPro) {
       const now = Date.now();
       let currentUsage = { ...usage };

       if (!currentUsage.firstUsageTimestamp || (now - currentUsage.firstUsageTimestamp > FREE_GENERATIONS_WINDOW)) {
         // Reset window
         currentUsage = { count: 0, firstUsageTimestamp: now };
       }

       if (currentUsage.count >= FREE_GENERATIONS_LIMIT) {
         setError(`You have reached your limit of ${FREE_GENERATIONS_LIMIT} free generations per month. Please upgrade to Pro for unlimited use.`);
         return;
       }
    }

    setError('');
    setChapters('');
    setIsLoading(true);
    setIsCopied(false);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, licenseKey }),
      });

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
            const errorBody = await response.json();
            errorDetail = errorBody.message || JSON.stringify(errorBody);
        } catch {}
        throw new Error(`Failed to generate: ${errorDetail}`);
      }
      
      const result = await response.text();
      setChapters(result);

      // Update usage count for free users on success
      if (!isPro) {
        const now = Date.now();
        if (!usage.firstUsageTimestamp || (now - usage.firstUsageTimestamp > FREE_GENERATIONS_WINDOW)) {
          setUsage({ count: 1, firstUsageTimestamp: now });
        } else {
          setUsage(prev => ({ ...prev, count: prev.count + 1 }));
        }
      }
      
      // Add to history
      setHistory(prev => [
        { id: Date.now(), url: videoUrl, chapters: result },
        ...prev
      ].slice(0, 5));

    } catch (err: any) {
      console.error('Failed to generate chapters:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, licenseKey, isPro, usage, setUsage, setHistory]);

  const handleCopyToClipboard = useCallback(() => {
    if (!chapters) return;
    navigator.clipboard.writeText(chapters).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [chapters]);

  const loadFromHistory = (item: Generation) => {
    setVideoUrl(item.url);
    setChapters(item.chapters);
    setError('');
    window.scrollTo(0, 0);
  }

  return (
    <div className="p-4 font-sans antialiased flex items-center justify-center min-h-full">
      <Card>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            YouTube Chapter Generator
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Paste a YouTube video link to automatically generate timestamps.
          </p>
        </div>

        <ProFeatures isPro={isPro} remainingGenerations={remainingGenerations} setLicenseKey={setLicenseKey} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="youtube-url" className="sr-only">
              YouTube Video URL
            </label>
            <input
              id="youtube-url"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="block w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? ( <> <Spinner /> Generating... </> ) : ( 'Generate Chapters' )}
          </button>
        </form>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/50">
            {error}
          </div>
        )}

        {chapters && (
          <div className="space-y-3 animate-fade-in">
            <textarea
              readOnly
              value={chapters}
              className="w-full h-48 p-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 transition"
              aria-label="Generated Chapters"
            />
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600 dark:ring-offset-slate-800 transition-all"
            >
              {isCopied ? (
                <> <CheckIcon className="w-5 h-5 mr-2 text-emerald-500" /> Copied! </>
              ) : (
                <> <CopyIcon className="w-5 h-5 mr-2" /> Copy to Clipboard </>
              )}
            </button>
          </div>
        )}

        <History history={history} onLoad={loadFromHistory} />
      </Card>
    </div>
  );
};

export default App;