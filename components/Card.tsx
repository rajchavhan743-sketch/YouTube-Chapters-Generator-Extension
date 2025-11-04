import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="w-full max-w-lg p-6 space-y-6 bg-white rounded-xl shadow-lg border border-slate-200 md:p-8 dark:bg-slate-800 dark:border-slate-700">
      {children}
    </div>
  );
};