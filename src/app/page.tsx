'use client';

import { Providers } from '@/components/Providers';
import SearchForm from '@/components/features/SearchForm';

export default function Home() {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <header className="glass sticky top-0 z-50 border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                <svg className="w-6 h-6 text-background-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">NULLAR</h1>
                <p className="text-xs text-text-tertiary -mt-0.5">Kentekencheck</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="hidden sm:inline">Officiële RDW Data</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-3 sm:px-4 md:px-6 py-6 sm:py-10">
          <SearchForm />
        </main>

        <footer className="border-t border-border-subtle py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-tertiary">
            <p>© 2026 NULLAR - RDW Open Data</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg> Privacy
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg> Officiële data
              </span>
            </div>
          </div>
        </footer>
      </div>
    </Providers>
  );
}
