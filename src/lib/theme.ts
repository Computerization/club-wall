import { useEffect, useState } from 'react';

/** Effective light/dark scheme: respects html[data-theme], falls back to the OS. */
export function isLightScheme(): boolean {
  if (typeof document === 'undefined') return false;
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr === 'light';
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

/** Reactive hook: re-renders when the theme or system scheme flips. */
export function useLightScheme(): boolean {
  const [light, setLight] = useState(isLightScheme);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const update = () => setLight(isLightScheme());
    mq.addEventListener('change', update);
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', update);
      obs.disconnect();
    };
  }, []);
  return light;
}

/** Relative luminance 0..1 for a #rrggbb hex colour. */
export function luminance(hex: string): number {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return 0;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = m.slice(1).map((h) => lin(parseInt(h, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Darken a #rrggbb colour by `t` (0..1, 0 = unchanged). */
export function darken(hex: string, t: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const ch = m.slice(1).map((h) => Math.max(0, Math.round(parseInt(h, 16) * (1 - t))));
  return `#${ch.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
