import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../data/activities';

const SCROLL_KEY = 'activity-scroll';

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

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

const SCROLL = 13000;
const ITEMS = ['表演', '道具', '灯光', '音效', '宣发美术', '妆造', '等等……'];

type Segment = { text: string; red?: boolean };
type Line = { segments: Segment[]; allRed?: boolean; large?: boolean };

const RECRUIT_LINES: Line[] = [
  { segments: [{ text: '我们不设槛，无论是有' }, { text: '经验', red: true }, { text: '还是' }, { text: '零基础', red: true }, { text: '都欢迎尝试!' }] },
  { segments: [{ text: '暑假里的排练活动会提供非常' }, { text: '充足', red: true }, { text: '的C/S时间，减轻大家开学后的负担，' }] },
  { segments: [{ text: '更快适应高中' }, { text: '新环境', red: true }, { text: '，交到志同道合的' }, { text: '新朋友', red: true }, { text: '!' }] },
  { segments: [{ text: '我们欢迎所有' }, { text: '热爱', red: true }, { text: '戏剧艺术的人，与我们在排练中度过' }, { text: '充实', red: true }, { text: '的暑假，' }] },
  { segments: [{ text: '在 Kaleido 大家庭中找到归属感' }], allRed: true, large: true },
];

const PAGE3_LINES: Line[] = [
  { segments: [
    { text: '推荐' }, { text: '私信', red: true }, { text: '与社长沟通具体活动内容，无需任和负担，我们很乐意为你解答，并鼓励你在 Kaleido 发展兴趣、突破自我!' },
  ] },
  { segments: [
    { text: '请在' }, { text: '暑假前', red: true }, { text: '加社微信/招新意向群，我们在7月初就会开始建组，期待大家的到来!' },
  ] },
  { segments: [{ text: '社长（周子涵）微信号：C115777SL' }] },
  { segments: [{ text: '请加社团招新群！（无槛，无负担！）' }] },
];

const QR_LINES_AFTER = 4; // QR appears after this many text lines

const trans = '0.3s cubic-bezier(0.22, 1, 0.36, 1)';

export default function ActivityDetailHTML(_props: Props) {
  const navigate = useNavigate();
  const [st, setSt] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [page2Boost, setPage2Boost] = useState(1);
  const [page4Boost, setPage4Boost] = useState(1);

  // Responsive scale: shrink on mobile, caps at 1 on desktop
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setScale(Math.min(1, w / 1400));
      setPage2Boost(w < 768 ? 2 : 1);
      setPage4Boost(w < 768 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Restore scroll position on mount (e.g. after Back from club detail)
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved && scrollRef.current) {
      scrollRef.current.scrollTop = Number(saved);
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  // Apply activity colour to scrollbar / theme variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-light', '#C00000');
    root.style.setProperty('--theme', '#C00000');
    root.style.setProperty('--theme-dark', '#600000');
    return () => {
      root.style.setProperty('--theme-light', '#2dd4a7');
      root.style.setProperty('--theme', '#1A5F4A');
      root.style.setProperty('--theme-dark', '#0f3d2f');
    };
  }, []);

  const onScroll = useCallback(() => {
    setSt(scrollRef.current?.scrollTop ?? 0);
  }, []);

  const goToClub = useCallback(() => {
    sessionStorage.setItem(SCROLL_KEY, String(scrollRef.current?.scrollTop ?? 0));
    navigate('/club/15', { state: { fromActivity: true } });
  }, [navigate]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  const showSignup = st < SCROLL * 0.78;

  // ==== Title animation (0 … 28%) ====
  const t = clamp(st / (SCROLL * 0.28), 0, 1);
  const titleSize = 5.625 - t * (5.625 - 3.25);
  const daxiBlend = clamp((t - 0.1) / 0.6, 0, 1);
  const daxiColor = `rgb(${Math.round(192 + daxiBlend * 63)},${Math.round(daxiBlend * 255)},${Math.round(daxiBlend * 255)})`;
  const subtitleOpacity = clamp((t - 0.3) / 0.5, 0, 1);
  const subtitleSize = titleSize * subtitleOpacity;

  // ==== Crossfade s1→s2 (28% … 34%) ====
  const x0 = clamp((st - SCROLL * 0.28) / (SCROLL * 0.06), 0, 1);
  const s1opacity = 1 - x0;

  // ==== s2 + items (34% … 52%) ====
  const s2phase = clamp((st - SCROLL * 0.34) / (SCROLL * 0.18), 0, 1);
  const itemsStart = SCROLL * 0.36;
  const itemsPer = (SCROLL * 0.14) / ITEMS.length;
  const itemOpacities = ITEMS.map((_, i) =>
    clamp((st - (itemsStart + i * itemsPer * 0.3)) / (itemsPer * 0.7), 0, 1)
  );

  // ==== Crossfade page1→page2 (52% … 58%) ====
  const x1 = clamp((st - SCROLL * 0.52) / (SCROLL * 0.06), 0, 1);
  const page1opacity = 1 - x1;

  // ==== Page 2 lines (58% … 82%) ====
  const p2start = SCROLL * 0.60;
  const p2per = (SCROLL * 0.22) / RECRUIT_LINES.length;
  const recruitOpacities = RECRUIT_LINES.map((_, i) =>
    clamp((st - (p2start + i * p2per * 0.3)) / (p2per * 0.7), 0, 1)
  );
  const page2opacity = clamp((st - SCROLL * 0.56) / (SCROLL * 0.04), 0, 1);

  // ==== Crossfade page2→page3 (82% … 88%) ====
  const x2 = clamp((st - SCROLL * 0.82) / (SCROLL * 0.06), 0, 1);
  const p2out = 1 - x2;
  const p3in = x2;

  // ==== Page 3 lines (88% … 100%) ====
  const p3start = SCROLL * 0.88;
  const p3per = (SCROLL * 0.12) / (PAGE3_LINES.length + 1); // +1 for QR
  const page3Opacities = PAGE3_LINES.map((_, i) =>
    clamp((st - (p3start + i * p3per * 0.3)) / (p3per * 0.7), 0, 1)
  );
  const qrOpacity = clamp((st - (p3start + QR_LINES_AFTER * p3per * 0.3)) / (p3per * 0.7), 0, 1);

  return (
      <div
        ref={scrollRef}
        className="h-dvh overflow-y-auto bg-black"
        onScroll={onScroll}
        style={{
          fontFamily: '"STZhongsong", "华文中宋", serif',
          animation: 'page-fade-in 0.6s ease both',
        }}
      >
      <style>{fontFace}</style>
      <div style={{ height: SCROLL }} />

      <div
        className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >

        {/* ==================== PAGE 1: 标题 ==================== */}
        <h1
          className="absolute whitespace-nowrap text-center font-bold text-white"
          style={{
            fontSize: `${titleSize}rem`,
            opacity: s1opacity * page1opacity,
            transition: `opacity ${trans}`,
            willChange: 'font-size, opacity',
          }}
        >
          Kaleido戏剧社 2026年度<span style={{ color: daxiColor }}>大戏</span>
          <span
            className="font-bold"
            style={{
              fontSize: `${subtitleSize}rem`,
              opacity: subtitleOpacity,
              transition: `opacity ${trans}`,
              willChange: 'font-size, opacity',
            }}
          >
            在<span style={{ color: '#C00000' }}>暑假</span>就要开始筹备了!
          </span>
        </h1>

        {/* ==================== PAGE 2: 加入我们 + 条目 ==================== */}
        <div
          className="absolute flex flex-col items-center gap-5"
          style={{
            opacity: s2phase * page1opacity,
            transition: `opacity ${trans}`,
            transform: `scale(${page2Boost})`,
            transformOrigin: 'center center',
          }}
        >
          <h2 className="whitespace-nowrap text-center font-bold text-white" style={{ fontSize: '3.25rem' }}>
            <span style={{ color: '#C00000' }}>加入</span>我们，你可以参与——
          </h2>
          <div className="flex flex-col items-center gap-4">
            {ITEMS.map((item, i) => (
              <span
                key={item}
                className="whitespace-nowrap font-bold"
                style={{
                  fontSize: '3rem',
                  opacity: itemOpacities[i],
                  color: item === '表演' ? '#C00000' : '#fff',
                  transition: `opacity ${trans}`,
                  willChange: 'opacity',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ==================== PAGE 3: 招募文案 ==================== */}
        <div
          className="absolute flex flex-col items-center gap-6 px-4"
          style={{ opacity: page2opacity * p2out, transition: `opacity ${trans}` }}
        >
          {RECRUIT_LINES.map((line, i) => {
            const isLarge = line.large;
            const isAllRed = line.allRed;
            return (
              <p
                key={i}
                className="whitespace-nowrap text-center font-bold"
                style={{
                  fontSize: isLarge ? '5.25rem' : '2.625rem',
                  opacity: recruitOpacities[i],
                  color: isAllRed ? '#C00000' : '#fff',
                  transition: `opacity ${trans}`,
                  willChange: 'opacity',
                  lineHeight: 2.4,
                }}
              >
                {line.segments.map((seg, j) => (
                  <span key={j} style={seg.red && !isAllRed ? { color: '#C00000' } : undefined}>
                    {seg.text}
                  </span>
                ))}
              </p>
            );
          })}
        </div>

        {/* ==================== PAGE 4: 报名方式 ==================== */}
        <div
          className="absolute flex flex-col items-center gap-5"
          style={{
            opacity: p3in,
            transition: `opacity ${trans}`,
            transform: `scale(${page4Boost})`,
            transformOrigin: 'center center',
          }}
        >
          <h3 className="text-center font-bold text-white" style={{ fontSize: '3rem' }}>
            报名方式：
          </h3>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            <div className="flex flex-col items-start gap-5">
              {PAGE3_LINES.map((line, i) => (
                <p
                  key={i}
                  className="text-left font-bold"
                  style={{
                    fontSize: '2.25rem',
                    opacity: page3Opacities[i],
                    color: '#fff',
                    transition: `opacity ${trans}`,
                    willChange: 'opacity',
                    maxWidth: '800px',
                    lineHeight: 1.8,
                  }}
                >
                  {line.segments.map((seg, j) => (
                    <span key={j} style={seg.red ? { color: '#C00000' } : undefined}>
                      {seg.text}
                    </span>
                  ))}
                </p>
              ))}
            </div>
            <div className="flex flex-row items-start gap-4 md:flex-col md:items-center">
              <img
                src="/qrcodes/kaleido.jpg"
                alt="Kaleido QR"
                className="flex-shrink-0 rounded-2xl"
                style={{
                  width: '200px',
                  opacity: qrOpacity,
                  transition: `opacity ${trans}`,
                  willChange: 'opacity',
                }}
              />
              <div
                className="pointer-events-auto cursor-pointer rounded-2xl ring-1 ring-white/10 transition-shadow"
                style={{
                  opacity: qrOpacity,
                  transition: `opacity ${trans}`,
                }}
                onClick={goToClub}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(192,0,0,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <img
                  src="/covers/f41.jpg"
                  alt="Kaleido 万华境戏剧社"
                  className="h-32 w-48 rounded-t-2xl object-cover"
                />
                <div className="rounded-b-2xl bg-white/5 px-4 py-3 text-center">
                  <p className="text-sm font-bold text-white">Kaleido 万华境戏剧社</p>
                  <p className="mt-0.5 text-xs text-white/50">查看详情</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="fixed left-6 top-6 z-50 inline-flex items-center justify-center rounded-full glass-strong p-3 text-white/80 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {showSignup && (
        <button
          onClick={scrollToBottom}
          className="fixed left-20 top-6 z-50 rounded-full glass-strong px-5 py-2.5 text-sm font-bold text-white/80 transition-all hover:text-white hover:scale-105"
        >
          报名
        </button>
      )}

      {st === 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/30">
          <span
            className="text-lg font-bold"
            style={{ animation: 'bob-up 2s ease-in-out infinite' }}
          >^</span>
          <span className="text-sm tracking-widest">向上滑动</span>
        </div>
      )}
      <style>{`
        @keyframes bob-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes page-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
