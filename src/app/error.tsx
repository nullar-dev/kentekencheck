'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" role="alert">
      <div className="w-full max-w-md text-center">
        <div className="glass-card p-8 rounded-2xl" aria-labelledby="error-title" aria-describedby="error-description">
          <h2 id="error-title" className="text-2xl font-bold text-white mb-4">Er is iets misgegaan</h2>
          <p id="error-description" className="text-white/60 mb-6">
            Er is een onverwachte fout opgetreden. Probeer het opnieuw.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    </div>
  );
}
