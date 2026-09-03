/**
 * School-website (校网) lookup: for every club on our wall, the official
 * listing's English name and where it appears on the school site
 * (page = which page of the listing, row = vertical row on that page).
 */
export interface SchoolListing {
  en: string;
  page: number;
  row: number;
}

export const schoolMap: Record<string, SchoolListing> = {
  '1':  { en: 'Luminosity Psychology Club', page: 4, row: 4 },
  '2':  { en: 'WFLA Bulletin', page: 2, row: 14 },
  '3':  { en: 'ChemiClub', page: 5, row: 17 },
  '4':  { en: 'WFLA Business Club', page: 2, row: 18 },
  '5':  { en: 'Economics Club', page: 5, row: 19 },
  '6':  { en: 'WFLA Mock Trial', page: 4, row: 10 },
  '7':  { en: 'Model UN Club', page: 6, row: 1 },
  '8':  { en: 'Techomedia', page: 4, row: 12 },
  '9':  { en: 'HIBIKI', page: 4, row: 3 },
  '10': { en: 'WFLA MathClub', page: 3, row: 3 },
  '11': { en: 'Origin', page: 4, row: 11 },
  '12': { en: 'Crunchy Zoo Language Club', page: 6, row: 2 },
  '13': { en: 'Brain Bee Club', page: 3, row: 8 },
  '14': { en: 'Teleskop', page: 4, row: 5 },
  '15': { en: 'Chinese Debate Club', page: 5, row: 16 },
  '16': { en: 'History Club', page: 6, row: 4 },
  '17': { en: 'Le Nord', page: 5, row: 18 },
  '18': { en: 'Bio Club', page: 6, row: 3 },
  '19': { en: 'Physics Society', page: 4, row: 2 },
  '20': { en: 'WFLA Debate League', page: 4, row: 9 },
  '21': { en: 'Mapa Spanish Club', page: 2, row: 9 },
  '22': { en: 'All in one gaze', page: 2, row: 12 },
  '23': { en: 'C-kers', page: 2, row: 1 },
  '24': { en: 'Power Galaxy', page: 1, row: 20 },
  '25': { en: 'Gastronomy Guild', page: 1, row: 13 },
  '26': { en: 'Environmental Science Club', page: 1, row: 9 },
  '27': { en: 'Philosophia', page: 1, row: 11 },
  '28': { en: 'K-Culture', page: 1, row: 15 },
  '29': { en: 'E3 Lab', page: 1, row: 8 },
  '30': { en: 'GeoQuery', page: 1, row: 7 },
  '31': { en: 'AI Lab', page: 1, row: 6 },
  '32': { en: 'SH Londaon', page: 1, row: 2 },
  '33': { en: 'T.T. Club', page: 3, row: 17 },
  '34': { en: 'Go Club', page: 2, row: 6 },
  '35': { en: 'Chess Club', page: 2, row: 5 },
  '36': { en: 'WFLA Volleyball Club', page: 5, row: 2 },
  '37': { en: 'WFLA Badminton Club', page: 2, row: 19 },
  '38': { en: 'Basketball Club', page: 4, row: 19 },
  '39': { en: 'WFLA Running Club', page: 3, row: 11 },
  '40': { en: 'Football Club', page: 4, row: 17 },
  '41': { en: 'Tennis Club', page: 4, row: 18 },
  '42': { en: 'WFLA Darts Club', page: 2, row: 13 },
  '43': { en: 'American Flag Football Club', page: 2, row: 4 },
  '44': { en: 'Disko Elysium Frisbee Society', page: 2, row: 3 },
  '45': { en: "Women's Basketball Club", page: 1, row: 4 },
  '46': { en: "Gentlemen's Billiards Club", page: 1, row: 3 },
  '47': { en: 'Pickleball Club', page: 1, row: 1 },
  '48': { en: 'Dogma95', page: 3, row: 18 },
  '49': { en: 'Radiation Studio', page: 3, row: 4 },
  '50': { en: 'Museholic Singing Club', page: 5, row: 10 },
  '51': { en: 'La Musique', page: 5, row: 11 },
  '52': { en: 'OAU Dance Club', page: 3, row: 5 },
  '53': { en: 'OAO Photography Club', page: 5, row: 13 },
  '54': { en: 'Kaleido Theatre', page: 5, row: 14 },
  '55': { en: 'BlueX', page: 2, row: 11 },
  '56': { en: 'Modeling Dimension', page: 2, row: 8 },
  '57': { en: 'Dokidoki', page: 2, row: 2 },
  '58': { en: 'Chinese Traditional Dance Club', page: 1, row: 18 },
  '59': { en: 'StoryTeller', page: 1, row: 14 },
  '60': { en: 'Resonantia Orchestra', page: 1, row: 17 },
  '61': { en: 'Mystic Flips', page: 1, row: 12 },
  '62': { en: 'Chinese Culture Club', page: 5, row: 9 },
  '63': { en: 'GI Fashion Design and Magazine', page: 5, row: 8 },
  '64': { en: 'WFLA Media Group', page: 4, row: 6 },
  '65': { en: 'BonVista', page: 1, row: 16 },
  '66': { en: 'Asclepius First-Aid Medicine Club', page: 2, row: 15 },
  '67': { en: 'Computerization', page: 4, row: 15 },
  '68': { en: 'JOL', page: 3, row: 14 },
  '69': { en: 'Under the Rainbow - Autism Awareness', page: 4, row: 8 },
  '70': { en: 'WFLA Roots & Shoots', page: 5, row: 3 },
  '71': { en: '1803 ZD', page: 4, row: 13 },
  '72': { en: 'VOICE', page: 5, row: 6 },
  '73': { en: 'WFLA Channel', page: 3, row: 1 },
  '74': { en: 'Careholic', page: 5, row: 4 },
  '75': { en: 'WFLA Student Firm', page: 5, row: 15 },
  '76': { en: 'Prologue Animal Protection Club', page: 2, row: 10 },
};

export function getSchoolListing(club: { id: string }): SchoolListing | null {
  return schoolMap[club.id] ?? null;
}

/** Rows per listing page (from the screenshots). */
export const pageRowCounts: Record<number, number> = {
  1: 20,
  2: 20,
  3: 19,
  4: 20,
  5: 20,
  6: 4,
};

/**
 * Display helper: rows near the bottom of a page are easier to locate when
 * expressed from the end. Rows ≥ 15 → "倒数第 N 行", otherwise "第 N 行".
 */
export function schoolRowText(page: number, row: number): string {
  const total = pageRowCounts[page] ?? 20;
  if (row >= 15) {
    return `倒数第 ${total - row + 1} 行`;
  }
  return `第 ${row} 行`;
}

export const SCHOOL_WEBSITE_URL = 'http://101.227.232.33:8001/';

