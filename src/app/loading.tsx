export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite" aria-label="Laden">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" aria-hidden="true"></div>
        <p className="text-white/60 text-sm">Laden...</p>
      </div>
    </div>
  );
}
