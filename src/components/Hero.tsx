import { ChevronDown, Shuffle } from 'lucide-react';

interface HeroProps {
  clubCount: number;
  categoryCount: number;
  /** Opens a randomly chosen club in the preview modal. */
  onRandomClub: () => void;
  /** Hide the random button — the easter egg has taken it away. */
  hideRandom?: boolean;
}

/**
 * Full-viewport, editorial opening for the wall. Sets the tone — immersive,
 * premium, alive — before the gallery rows begin.
 */
export default function Hero({ clubCount, categoryCount, onRandomClub, hideRandom = false }: HeroProps) {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Floating ambient orbs */}
      <div
        className="pointer-events-none absolute left-[8%] top-[18%] h-72 w-72 rounded-full blur-3xl animate-float"
        style={{ backgroundColor: 'color-mix(in srgb, var(--theme-light) 20%, transparent)', transition: 'background-color 0.8s ease' }}
      />
      <div
        className="pointer-events-none absolute bottom-[12%] right-[10%] h-80 w-80 rounded-full blur-3xl animate-float delay-300"
        style={{ backgroundColor: 'color-mix(in srgb, var(--theme) 30%, transparent)', transition: 'background-color 0.8s ease' }}
      />

      <p className="eyebrow mb-6 animate-fade-up text-xs font-medium" style={{ color: 'var(--theme-light)', transition: 'color 0.6s ease' }}>
        WFLA · 2026 招新季 Club Recruitment
      </p>

      <h1 className="animate-fade-up delay-100 font-display text-5xl font-bold leading-[1.05] sm:text-7xl md:text-8xl">
        <span className="text-gradient">The Club Wall</span>
      </h1>

      <p className="mt-4 animate-fade-up delay-200 font-display text-2xl italic text-white/80 sm:text-3xl">
        寻找属于你的社团
      </p>

      <p className="mt-6 max-w-xl animate-fade-up delay-300 text-base leading-relaxed text-white/55">
        探索校园里每一个充满热情的社团。浏览、预览、加入 —— 你的高中故事，从这里开始。
      </p>

      {/* Stats */}
      <div className="mt-10 flex animate-fade-up delay-500 items-center gap-8 sm:gap-12">
        {/* Round down to a clean marketing figure (e.g. 73 clubs → "70+"). */}
        <Stat value={`${Math.floor(clubCount / 10) * 10}+`} label="社团 Clubs" />
        <div className="h-10 w-px bg-white/15" />
        <Stat value={`${categoryCount}`} label="领域 Categories" />
        <div className="h-10 w-px bg-white/15" />
        <Stat value="∞" label="可能 Possibilities" />
      </div>

      {/* Actions */}
      {!hideRandom && (
        <div className="mt-10 flex animate-fade-up delay-500 flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRandomClub}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900
                       shadow-lg transition-all duration-300 hover:scale-105 hover:text-white"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Shuffle className="h-4 w-4" />
            <span>随机社团 Surprise Me</span>
          </button>
        </div>
      )}

      {/* Scroll cue */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40 animate-pulse-soft">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-white/45">{label}</div>
    </div>
  );
}
