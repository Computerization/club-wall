import { useEffect, useState } from 'react';
import type { Club } from '../data/clubs';
import { asset } from '../data/clubs';

// Club media (logo + poster) is loaded dynamically from public/{folder}/{id}.jpg
// (id zero-padded to two digits). Uploading a matching file is enough — no code
// change needed. Each component walks down its list of candidate sources in
// order and, when a file is missing (img onError), advances to the next one.
type SourceList = (id: string) => string[];

interface ClubImageProps {
  club: Club;
  sources: SourceList;
  alt: string;
  className?: string;
}

function ClubImage({ club, sources, alt, className }: ClubImageProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [club.id]);

  const list = sources(club.id.padStart(2, '0'));
  const current = list[Math.min(index, list.length - 1)];

  return (
    <img
      src={asset(current)}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

interface ClubMediaProps {
  club: Club;
  className?: string;
  alt?: string;
}

// Cover uses the club's logo as the primary image, then falls back to the placeholder.
export default function ClubCover({ club, className, alt }: ClubMediaProps) {
  return (
    <ClubImage
      club={club}
      sources={(id) => [`/logos/${id}.png`, `/logos/${id}.jpg`, '/logos/no-logo.png']}
      alt={alt ?? club.name}
      className={className}
    />
  );
}

// Poster falls back to the "no poster" placeholder.
export function ClubPoster({ club, className, alt }: ClubMediaProps) {
  return (
    <ClubImage
      club={club}
      sources={(id) => [`/posters/${id}.jpg`, '/posters/no-poster.png']}
      alt={alt ?? `${club.name} 招新海报`}
      className={className ?? 'w-full rounded-xl ring-1 ring-white/10'}
    />
  );
}

// Club president QR (社长微信): loaded as public/cp-qrcodes/{id}.jpg (no
// zero-padding — files are named 1.jpg, 15.jpg, …). If no matching file
// exists, the whole section (heading + image) is hidden.
export function ClubCpQrcodeSection({ club }: ClubMediaProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [club.id]);

  if (failed) return null;

  return (
    <div className="mt-5 border-t pt-4" style={{ borderColor: 'rgba(128,128,128,0.25)' }}>
      <h3 className="mb-3 text-xs font-semibold text-white/50">
        <span style={{ fontSize: '1.18em' }}>社长微信</span>{' '}
        <span style={{ fontSize: '0.85em' }}>Club President</span>
      </h3>
      <div className="flex flex-col gap-3">
        <img
          src={asset(`/cp-qrcodes/${club.id}.jpg`)}
          alt={`${club.name} 社长微信`}
          loading="lazy"
          className="w-full rounded-lg bg-white p-2"
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}

// Club logo: loaded as public/logos/{id}.png (or .jpg). No frame; hidden
// entirely when the file is missing.
export function ClubLogo({ club, className }: ClubMediaProps) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFailed(false);
  }, [club.id]);

  if (failed) return null;

  const id = club.id.padStart(2, '0');
  const candidates = [`/logos/${id}.png`, `/logos/${id}.jpg`];
  const src = candidates[Math.min(index, candidates.length - 1)];

  return (
    <img
      src={asset(src)}
      alt={`${club.name} 社徽`}
      loading="lazy"
      className={className ?? 'mx-auto w-4/5 max-w-[220px] object-contain'}
      onError={() => {
        if (index < candidates.length - 1) setIndex((i) => i + 1);
        else setFailed(true);
      }}
    />
  );
}
