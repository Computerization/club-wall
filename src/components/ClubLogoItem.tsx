import { useEffect, useState } from 'react';
import type { Club } from '../data/clubs';
import { asset } from '../data/clubs';

interface ClubLogoItemProps {
  club: Club;
  onClick: (id: string) => void;
}

/**
 * Minimal gallery tile: the club logo alone — no card frame, no text, no
 * category chip. Loaded from public/logos/{id}.png (or .jpg as fallback).
 * Clicking opens the club preview.
 */
export default function ClubLogoItem({ club, onClick }: ClubLogoItemProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [club.id]);

  const id = club.id.padStart(2, '0');
  const candidates = [`/logos/${id}.png`, `/logos/${id}.jpg`, '/logos/no-logo.png'];
  const src = candidates[Math.min(index, candidates.length - 1)];

  return (
    <button
      onClick={() => onClick(club.id)}
      className="group block h-full w-full cursor-pointer select-none"
      aria-label={club.name}
      title={club.name}
    >
      <img
        src={asset(src)}
        alt=""
        loading="lazy"
        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 group-active:brightness-75"
        onError={() => setIndex((i) => i + 1)}
      />
    </button>
  );
}
