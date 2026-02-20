'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Car, Search, LogOut, Crown, BarChart3, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Kentekencheck</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Uitloggen</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-white/60">Welkom terug, {user.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/" className="glass-card p-6 rounded-xl hover:bg-white/10 transition-colors group">
            <Search className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-1">Kenteken Zoeken</h3>
            <p className="text-white/60 text-sm">Zoek voertuiggegevens</p>
          </a>

          <div className="glass-card p-6 rounded-xl">
            <Crown className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Gratis Plan</h3>
            <p className="text-white/60 text-sm mb-3">10 zoekacties per dag</p>
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
              Huidig plan
            </span>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <BarChart3 className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Statistieken</h3>
            <p className="text-white/60 text-sm">Binnenkort beschikbaar</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <Settings className="w-8 h-8 text-white/60 mb-3" />
            <h3 className="text-white font-semibold mb-1">Instellingen</h3>
            <p className="text-white/60 text-sm">Binnenkort beschikbaar</p>
          </div>
        </div>
      </main>
    </div>
  );
}
