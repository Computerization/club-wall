import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../data/activities';

const fontFace = `
@font-face {
  font-family: 'STZhongsong';
  src: url('/fonts/stzhongsong.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

interface Props {
  activity: Activity;
}

const htmlStyle: React.CSSProperties = {
  fontFamily: '"STZhongsong", "华文中宋", serif',
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function ActivityDetailHTML(_props: Props) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const scrollTo = useCallback((delta: number) => {
    setProgress((prev) => clamp(prev + delta, 0, 1));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.02 : -0.02;
      scrollTo(delta);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY.current - e.touches[0].clientY;
      scrollTo(dy * 0.003);
      touchStartY.current = e.touches[0].clientY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [scrollTo]);

  // Title font size: 5.625rem → 3.25rem
  const titleSize = 5.625 - progress * (5.625 - 3.25);
  // "大戏" color: from #C00000 to white
  const daxiR = Math.round(192 + progress * (255 - 192));
  const daxiG = Math.round(0 + progress * (255 - 0));
  const daxiB = Math.round(0 + progress * (255 - 0));
  const daxiColor = `rgb(${daxiR},${daxiG},${daxiB})`;
  // Subtitle opacity: 0 → 1 (starts after 30% progress)
  const subtitleOpacity = clamp((progress - 0.3) / 0.7, 0, 1);
  // Subtitle font-size: 0 → titleSize (collapses width when hidden, keeping title centered)
  const subtitleSize = titleSize * subtitleOpacity;

  return (
    <div
      ref={containerRef}
      className="relative flex h-dvh flex-col overflow-hidden bg-black"
      style={htmlStyle}
    >
      <style>{fontFace}</style>
      <button
        onClick={() => navigate('/')}
        className="absolute left-6 top-6 z-50 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-sm text-white/80 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">返回 Back</span>
      </button>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <h1
          className="text-center font-bold text-white"
          style={{
            fontSize: `${titleSize}rem`,
            transition: 'font-size 0.1s linear',
          }}
        >
          Kaleido戏剧社 2026年度<span style={{ color: daxiColor }}>大戏</span>
          <span
            className="font-bold text-white"
            style={{
              fontSize: `${subtitleSize}rem`,
              opacity: subtitleOpacity,
              transition: 'opacity 0.1s linear, font-size 0.1s linear',
            }}
          >
            在<span style={{ color: '#C00000' }}>暑假</span>就要开始筹备了!
          </span>
        </h1>
      </main>

      <div className="flex flex-col items-center gap-2 pb-8 text-white/30">
        <span className="text-lg font-bold">^</span>
        <span className="text-sm tracking-widest">向上滑动</span>
      </div>
    </div>
  );
}
