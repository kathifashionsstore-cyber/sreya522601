export function IVFLoader({ inline = false }) {
  const loader = (
    <div className="flex flex-col items-center gap-3">
      <style>{`
        @keyframes sreyaLogoPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 18px 50px rgba(13, 148, 136, 0.16); }
          50% { transform: scale(1.045); box-shadow: 0 24px 70px rgba(13, 148, 136, 0.28); }
        }
        @keyframes sreyaLoadingDots {
          0%, 20% { content: "."; }
          40% { content: ".."; }
          60%, 100% { content: "..."; }
        }
        .sreya-loading-dots::after {
          content: ".";
          animation: sreyaLoadingDots 1.25s infinite steps(1, end);
        }
      `}</style>
      <div
        className="grid size-24 place-items-center rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-soft sm:size-28"
        style={{ animation: 'sreyaLogoPulse 1.8s ease-in-out infinite' }}
      >
        <img src="/logo.webp" alt="Sreya Hospitals" className="max-h-full max-w-full object-contain" />
      </div>
      <p className="sreya-loading-dots text-sm font-black uppercase tracking-[0.22em] text-primary">
        Loading
      </p>
      <p className="text-xs font-bold text-text-secondary">Sreya Hospitals & IVF Centre</p>
    </div>
  )

  if (inline) {
    return <div className="grid place-items-center py-8">{loader}</div>
  }

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-[var(--color-bg-base)] px-4 text-text-primary">
      {loader}
    </div>
  )
}
