import React, { useState, useCallback } from 'react';
import type { Generation } from '../App';
import { CopyIcon, CheckIcon } from './Icons';

interface HistoryItemProps {
  item: Generation;
  onLoad: (item: Generation) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onLoad }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.chapters).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [item.chapters]);

  return (
    <li className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-2 transition-all">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onLoad(item)}
          className="text-left flex-grow min-w-0"
          title="Load this generation"
        >
          <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-200 hover:underline">
            {item.url}
          </span>
        </button>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center text-sm px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors"
          aria-label="Copy chapters to clipboard"
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-1.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <details>
        <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 rounded">
          View Chapters
        </summary>
        <pre className="mt-2 p-2 text-xs text-slate-800 bg-white dark:bg-slate-900 dark:text-slate-200 rounded-md overflow-x-auto whitespace-pre-wrap font-mono border border-slate-200 dark:border-slate-700">
          {item.chapters}
        </pre>
      </details>
    </li>
  );
};

export const History: React.FC<{
  history: Generation[];
  onLoad: (item: Generation) => void;
}> = ({ history, onLoad }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
        Recent Generations
      </h2>
      <ul className="space-y-3">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} onLoad={onLoad} />
        ))}
      </ul>
    </div>
  );
};