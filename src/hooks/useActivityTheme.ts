import { useEffect, useRef } from 'react';
import type { Activity } from '../data/activities';

const DEFAULTS = {
  light: '#2dd4a7',
  theme: '#1A5F4A',
  dark: '#0f3d2f',
};

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function lightenHex(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(lerp(r, 255, t), lerp(g, 255, t), lerp(b, 255, t));
}

function darkenHex(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(lerp(r, 0, t), lerp(g, 0, t), lerp(b, 0, t));
}

function applyTheme(color: string | null) {
  const root = document.documentElement;
  if (color) {
    root.style.setProperty('--theme-light', lightenHex(color, 0.4));
    root.style.setProperty('--theme', color);
    root.style.setProperty('--theme-dark', darkenHex(color, 0.6));
  } else {
    root.style.setProperty('--theme-light', DEFAULTS.light);
    root.style.setProperty('--theme', DEFAULTS.theme);
    root.style.setProperty('--theme-dark', DEFAULTS.dark);
  }
}

export default function useActivityTheme(
  activity: Activity | undefined,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const visible = useRef(false);
  const landscape = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.intersectionRatio > 0.5;
        refresh();
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(el);

    const onResize = () => {
      landscape.current = window.innerWidth > window.innerHeight;
      refresh();
    };
    onResize();
    window.addEventListener('resize', onResize);

    function refresh() {
      if (landscape.current && visible.current && activity) {
        applyTheme(activity.color);
      } else {
        applyTheme(null);
      }
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      applyTheme(null);
    };
  }, [activity, containerRef]);

  useEffect(() => {
    return () => {
      applyTheme(null);
    };
  }, []);
}
