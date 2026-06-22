export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light/15 ring-1 ring-brand-light/40">
            <span className="font-display text-lg font-bold text-brand-light">C</span>
          </span>
          <span className="font-display text-xl font-semibold text-white">Club Wall</span>
        </div>
        <p className="max-w-md text-sm text-white/45">
          世外 WFLA 社团招新 · 寻找属于你的舞台。<br />
          Discover, preview, and join the community that's right for you.
        </p>
        <p className="mt-2 text-xs text-white/30">
          © {new Date().getFullYear()} WFLA Club Wall · Made for incoming students
        </p>
      </div>
    </footer>
  );
}
