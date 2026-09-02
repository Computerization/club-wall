import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import type { Club } from '../data/clubs';
import { asset } from '../data/clubs';
import { clubBlurb, getCategoryMeta } from '../data/categoryMeta';
import { getSchoolListing } from '../data/schoolNames';
import ClubCover from './ClubMedia';
import { takeLogoFlyRect } from '../lib/logoFly';

const RATING_IMG: Record<string, string> = {
  'five-star': 'icons/five-star-club.png',
  outstanding: 'icons/good-club.png',
};

const FALLBACK_THEME = ['#FFC9A6', '#FA803D', '#8A3B0E'] as const;

/** Logos at least this wide (width / height) always become a top banner. */
const BANNER_RATIO = 1.75;
const SIDEBAR_COST = 380 + 48;
const MD_BREAKPOINT = 768;

const CLOSE_MS = 150;

/** Only colours deeper than 戏剧社's red (#C00000, luminance ≈0.112) get the
 *  light/white card skin. 戏剧社-level depth is treated as light → dark card. */
const LIGHT_CARD_MAX_LUM = 0.111;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function luminance(hex: string): number {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return 0;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = m.slice(1).map((h) => lin(parseInt(h, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** White or near-black, whichever reads best on the given theme color. */
function onColor(hex: string): string {
  return luminance(hex) > 0.5 ? '#0a0f0d' : '#ffffff';
}

interface ClubPreviewModalProps {
  club: Club | null;
  onClose: () => void;
  onOpenFull: (id: string) => void;
}

/** Measures the club logo's natural pixel dimensions (png, then jpg). */
function useLogoSize(club: Club | null): { w: number; h: number } | null {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const checkedId = useRef<string | null>(null);

  useEffect(() => {
    if (!club) {
      checkedId.current = null;
      setSize(null);
      return;
    }
    const id = club.id.padStart(2, '0');
    if (checkedId.current === id) return;
    checkedId.current = id;
    setSize(null);

    const candidates = [`/logos/${id}.png`, `/logos/${id}.jpg`];
    let i = 0;
    const tryNext = () => {
      if (i >= candidates.length) return;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (w && h) setSize({ w, h });
      };
      img.onerror = () => {
        i += 1;
        tryNext();
      };
      img.src = asset(candidates[i]);
      i += 1;
    };
    tryNext();
  }, [club]);

  return size;
}

/** Current viewport width, kept fresh so the layout adapts on resize. */
function useViewportWidth(): number {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth));
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

export default function ClubPreviewModal({ club, onClose, onOpenFull }: ClubPreviewModalProps) {
  const logo = useLogoSize(club);
  const viewport = useViewportWidth();
  const [closing, setClosing] = useState(false);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const btnTextRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [sweep, setSweep] = useState(0);

  const [light, main, dark] = club?.theme ?? FALLBACK_THEME;

  // Random flight for the club names — randomized once per open.
  const nameFlight = useMemo(
    () => ({
      x: rand(-120, 120),
      y: rand(-90, 90),
      rotate: rand(-14, 14),
      xEn: rand(-90, 90),
      yEn: rand(-70, 70),
      rotateEn: rand(-12, 12),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [club?.id],
  );

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => onClose(), CLOSE_MS);
  };

  // Reset once fully closed so the next open can animate again (unlimited).
  useEffect(() => {
    if (!club) setClosing(false);
  }, [club]);

  // Body scroll lock + Escape.
  useEffect(() => {
    if (!club) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [club, closing]);

  // ----- shared-element logo flight: home position → card position -----
  useLayoutEffect(() => {
    if (!club) return;
    const box = logoBoxRef.current;
    const img = box?.querySelector('img');
    const from = takeLogoFlyRect();
    if (!box || !img || !from) {
      if (img) img.style.opacity = '1';
      return;
    }

    let started = false;
    let revealed = false;
    img.style.opacity = '0';

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      img.style.opacity = '1';
      img.style.transform = '';
    };

    const start = () => {
      if (started) return;
      started = true;
      const to = img.getBoundingClientRect();
      if (!to.width || !to.height) {
        reveal();
        return;
      }
      const sx = from.width / to.width;
      const sy = from.height / to.height;
      const tx = from.left - to.left;
      const ty = from.top - to.top;
      // Origin top-left keeps the mapping pixel-perfect (scale then translate).
      img.style.transformOrigin = '0 0';
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
      img.style.opacity = '1';
      const anim = img.animate(
        [
          { transform: `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})` },
          { transform: 'translate(0px, 0px) scale(1, 1)' },
        ],
        { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      anim.onfinish = () => reveal();
    };

    if (img.complete && img.naturalWidth) {
      start();
    } else {
      img.addEventListener('load', start, { once: true });
      // Safety net: if the image can't load, just show it without a flight.
      window.setTimeout(() => {
        if (!started) reveal();
      }, 800);
    }
  }, [club]);

  // Measure the CTA so the arrow can sweep across the whole button width.
  useLayoutEffect(() => {
    const btn = btnRef.current;
    if (btn) setSweep(Math.max(30, btn.clientWidth - 24));
  }, [club]);

  if (!club) return null;

  const meta = getCategoryMeta(club.category);
  const wideRatio = logo && logo.w >= logo.h && logo.h > 0 ? logo.w / logo.h : 0;
  const twoColumnWidth = 480 * wideRatio + SIDEBAR_COST;
  const showBanner =
    wideRatio >= BANNER_RATIO || (wideRatio > 0 && viewport >= MD_BREAKPOINT && twoColumnWidth > viewport);

  const btnTextColor = onColor(main);
  // A club whose theme is dark needs white text on its CTA → give it a light,
  // white card so its dark-coloured text reads without any text shadow. Only
  // genuinely dark colours (strict luminance cap) trigger the light skin.
  const lightCard = luminance(main) <= LIGHT_CARD_MAX_LUM;
  const themedShadow = lightCard
    ? 'none'
    : '0 2px 14px rgba(0,0,0,0.2)';
  // English name: same theme colour, but ~70% opacity.
  const enNameColor = `${main}B3`;
  const enName = club ? (getSchoolListing(club)?.en ?? club.name) : '';
  const scrVar = { ['--scr' as string]: main };

  const bodyCol = lightCard ? 'rgba(8,12,10,0.84)' : 'rgba(255,255,255,0.84)';
  const softCol = lightCard ? 'rgba(8,12,10,0.6)' : 'rgba(255,255,255,0.62)';
  const faintCol = lightCard ? 'rgba(8,12,10,0.42)' : 'rgba(255,255,255,0.42)';
  const strongCol = lightCard ? 'rgba(8,12,10,0.92)' : 'rgba(255,255,255,0.92)';

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const detailBody = (
    <>
      {/* Chinese club name — flies in from a random direction with a bounce.
          The rating badge (五星/优秀社团) sits to its right. */}
      <div className="flex flex-wrap items-center gap-x-4">
        <motion.h1
          initial={{ opacity: 0, x: nameFlight.x, y: nameFlight.y, rotate: nameFlight.rotate, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 13, delay: 0.08, mass: 0.8 }}
          className="font-display text-4xl font-bold leading-tight sm:text-5xl"
          style={{ color: main, textShadow: themedShadow }}
        >
          {club.name}
        </motion.h1>

        {club.rating && (
          <motion.img
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.3 }}
            src={asset(RATING_IMG[club.rating])}
            alt={club.rating === 'five-star' ? '五星社团' : '优秀社团'}
            className="h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] sm:h-14"
          />
        )}
      </div>

      {/* English name — from the school website listing */}
      <motion.p
        initial={{ opacity: 0, x: nameFlight.xEn, y: nameFlight.yEn, rotate: nameFlight.rotateEn }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 13, delay: 0.16 }}
        className="mt-2 text-lg font-medium tracking-wide sm:text-xl"
        style={{ color: enNameColor, textShadow: themedShadow }}
      >
        {enName}
      </motion.p>

      {/* Category — no longer on top; sits below the names, coloured */}
      <motion.div {...fadeUp(0.24)}>
        <span
          className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{
            color: main,
            border: `1px solid ${main}66`,
            background: lightCard ? `${main}1a` : `${main}1f`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: main }} />
          {meta.cn} · {meta.en}
        </span>
      </motion.div>

      {/* Focus line — white on dark skin, near-black on the light skin */}
      <motion.p
        {...fadeUp(0.28)}
        className="mt-4 text-xs font-semibold uppercase tracking-[0.28em]"
        style={{ color: strongCol }}
      >
        {club.shortDesc}
      </motion.p>

      {club.tags.length > 0 && (
        <motion.div {...fadeUp(0.32)} className="mt-4 flex flex-wrap gap-2">
          {club.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-1 text-xs"
              style={{
                color: bodyCol,
                background: lightCard ? 'rgba(8,12,10,0.05)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${main}33`,
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}

      <motion.p {...fadeUp(0.36)} className="mt-5 text-sm leading-relaxed" style={{ color: bodyCol }}>
        {clubBlurb(club)}
      </motion.p>

      {club.contact?.trim() && (
        <motion.p {...fadeUp(0.4)} className="mt-4 text-sm" style={{ color: softCol }}>
          <span style={{ color: strongCol }}>微信 · Contact：</span> {club.contact}
        </motion.p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
        {/* CTA — the arrow sweeps from the far-left across the button, revealing
            the label as it goes. Text ends on the left, arrow on the right. */}
        <motion.button
          ref={btnRef}
          onClick={() => onOpenFull(club.id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.45 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden rounded-full py-3 pl-6 pr-12 text-sm font-semibold"
          style={{ background: main, color: btnTextColor }}
        >
          <motion.span
            ref={btnTextRef}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.35, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="inline-block whitespace-nowrap"
          >
            查看完整详情
          </motion.span>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <motion.span
              initial={{ x: -sweep, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              className="block"
            >
              <ArrowRight className="h-4 w-4" style={{ color: btnTextColor }} />
            </motion.span>
          </span>
        </motion.button>

        <motion.span {...fadeUp(0.6)} className="inline-flex items-center gap-1.5 text-xs" style={{ color: faintCol }}>
          <Sparkles className="h-3.5 w-3.5" /> 按 Esc 关闭
        </motion.span>
      </div>
    </>
  );

  const closeButton = (
    <button
      onClick={requestClose}
      aria-label="Close preview"
      className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white active:brightness-50"
    >
      <X className="h-4 w-4" />
    </button>
  );

  // Strong, layered theme glows painted over a quiet base so the club's colour
  // reads clearly yet stays natural (deep colour hugging the logo corner, its
  // lighter tint on the opposite side, a dark pool for depth).
  const tintWash = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: lightCard
          ? [
              `radial-gradient(85% 90% at 8% 4%, ${main}66, transparent 76%)`,
              `radial-gradient(65% 70% at 104% 106%, ${light}52, transparent 76%)`,
              `radial-gradient(55% 60% at 90% -10%, ${main}38, transparent 70%)`,
              `linear-gradient(160deg, ${main}24 0%, transparent 58%)`,
            ].join(', ')
          : [
              `radial-gradient(75% 80% at 10% 6%, ${main}6e, transparent 74%)`,
              `radial-gradient(65% 70% at 104% 104%, ${dark}52, transparent 76%)`,
              `radial-gradient(50% 55% at 92% -10%, ${light}40, transparent 70%)`,
              `radial-gradient(45% 45% at 8% 104%, ${main}26, transparent 65%)`,
              `linear-gradient(160deg, ${main}1f 0%, transparent 50%)`,
            ].join(', '),
      }}
    />
  );

  const cardLightStyle: React.CSSProperties = {
    background: [
      'linear-gradient(180deg, rgba(248,246,239,0.96) 0%, rgba(235,229,212,0.96) 100%)',
    ].join(', '),
    border: '0 none',
  };

  const cardDarkStyle: React.CSSProperties = {
    background: [
      'linear-gradient(180deg, rgba(10,15,13,0.78) 0%, rgba(7,11,10,0.6) 100%)',
    ].join(', '),
    border: '0 none',
  };

  const logoPanel = showBanner ? (
    <div ref={logoBoxRef} className="relative flex w-full shrink-0 items-start justify-center overflow-hidden bg-black/30">
      <ClubCover club={club} className="block h-auto w-full max-h-[44vh] object-cover object-top" />
    </div>
  ) : (
    <div ref={logoBoxRef} className="relative flex shrink-0 items-center justify-center overflow-hidden">
      <ClubCover
        club={club}
        className="block mx-auto w-auto max-h-[45vh] max-w-full md:mx-0 md:h-[480px] md:max-h-none md:max-w-none"
      />
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: CLOSE_MS / 1000 }}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${club.name} preview`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {showBanner ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl shadow-lift ${lightCard ? '' : 'glass-strong'}`}
          style={lightCard ? cardLightStyle : cardDarkStyle}
        >
          {tintWash}
          {logoPanel}
          <div
            className="theme-scroll relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto p-6 sm:p-8"
            style={scrVar}
          >
            {detailBody}
          </div>
          {closeButton}
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-10 flex w-full max-w-[95vw] max-h-[90vh] flex-col overflow-hidden rounded-3xl shadow-lift ${lightCard ? '' : 'glass-strong'} md:max-h-none md:w-auto md:flex-row`}
          style={lightCard ? cardLightStyle : cardDarkStyle}
        >
          {tintWash}
          {logoPanel}
          <div
            className="theme-scroll relative z-10 flex w-full flex-1 flex-col overflow-x-hidden overflow-y-auto p-6 sm:p-8 min-h-0 md:h-[480px] md:w-[460px] md:flex-none"
            style={scrVar}
          >
            {detailBody}
          </div>
          {closeButton}
        </div>
      )}
    </motion.div>
  );
}
