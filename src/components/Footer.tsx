import { Link } from 'react-router-dom';
import { clubs, asset } from '../data/clubs';
import { useLightScheme } from '../lib/theme';

// Credit links to our own club's page on the wall.
const computerizationClub = clubs.find((club) => club.name.includes('信息化'));

interface FooterProps {
  /** Page skin above the footer. Defaults to the global/system scheme. */
  light?: boolean;
}

export default function Footer({ light: lightOverride }: FooterProps) {
  const autoLight = useLightScheme();
  const light = lightOverride ?? autoLight;

  return (
    <footer
      className={`relative mt-auto border-t px-6 py-12 ${
        light ? 'border-black/10 bg-transparent' : 'border-white/10 bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <img
            src={asset('icons/WFLA.png')}
            alt="Club Wall"
            className="h-6 w-auto object-contain"
          />
          <span
            className={`font-display text-xl font-bold ${light ? 'text-ink-950' : 'text-white'}`}
          >
            Club Wall
          </span>
          {computerizationClub && (
            <Link
              to={`/club/${computerizationClub.id}`}
              className={`text-sm transition-colors ${
                light ? 'font-semibold text-black/70 hover:text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              by Computerization
            </Link>
          )}
        </div>
        <p className={`max-w-md text-sm ${light ? 'font-medium text-black/75' : 'text-white/60'}`}>
          世外 WFLA 社团招新 · 寻找属于你的舞台。<br />
          Discover, preview, and join the community that's right for you.
        </p>
        <p className={`mt-2 text-xs ${light ? 'text-black/55' : 'text-white/40'}`}>
          © {new Date().getFullYear()} WFLA Club Wall · Made for incoming students
        </p>
      </div>
    </footer>
  );
}
