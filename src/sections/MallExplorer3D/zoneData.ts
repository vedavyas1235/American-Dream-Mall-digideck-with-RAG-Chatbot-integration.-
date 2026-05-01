// ── Zone Data — American Dream Mall 3D Explorer ──────────────────────────────
// Positions re-traced from official americandream.com/map screenshots
// X = West(-)/East(+),  Z = North(-)/South(+)
// Scale: ~1 unit ≈ 18 metres

export interface ZoneStat { v: string; l: string }

export interface ZoneData {
  id: string
  name: string
  tagline: string
  levels: number[]
  primaryLevel: number
  category: 'entertainment' | 'luxury' | 'adventure' | 'dining' | 'culture' | 'retail'
  color: string
  shapeType?: 'box' | 'dome' | 'cylinder' | 'slope' | 'rink' | 'oval'
  position: [number, number]   // [x, z]
  size: [number, number]       // [width, depth]
  stats: ZoneStat[]
  tenants: string[]
  available: string[]
  ctaSlideId: string
  ctaLabel: string
}

export const LEVEL_Y: Record<number, number> = { 1: 0, 2: 3.15, 3: 6.3, 4: 9.45 }
export const PLATE_THICKNESS = 0.15
export const ZONE_HEIGHT = 0.14
export function zoneY(level: number) {
  return LEVEL_Y[level] + PLATE_THICKNESS / 2 + ZONE_HEIGHT / 2
}

export const ZONES: ZoneData[] = [

  // ── NICKELODEON UNIVERSE ───────────────────────────────────────────────────
  // NW quadrant of building, large roughly-rectangular block
  {
    id: 'nickelodeon',
    name: 'Nickelodeon Universe',
    tagline: "North America's Largest Indoor Theme Park",
    levels: [1, 2],
    primaryLevel: 1,
    category: 'entertainment',
    color: '#ff6b00',
    shapeType: 'dome',
    position: [-5.5, -3.5],
    size: [5.5, 3.8],
    stats: [
      { v: '8', l: 'Acres Indoor' },
      { v: '35+', l: 'Rides & Attractions' },
      { v: '5,000+', l: 'Buyout Capacity' },
    ],
    tenants: ['Nickelodeon / Paramount (IP Partner since 2019)', 'SpongeBob, PAW Patrol, TMNT'],
    available: ['Full park private buyout', 'Brand activation zones (500–2,000 sq ft)', 'Character appearance integration'],
    ctaSlideId: 'attractions',
    ctaLabel: 'Explore Attractions',
  },

  // ── DREAMWORKS WATER PARK ─────────────────────────────────────────────────
  // North-central block, large — juts northward beyond Nick
  {
    id: 'dreamworks',
    name: 'DreamWorks Water Park',
    tagline: "North America's Largest Indoor Water Park",
    levels: [1, 2],
    primaryLevel: 1,
    category: 'entertainment',
    color: '#00b4d8',
    shapeType: 'dome',
    position: [1.5, -4.5],
    size: [5.0, 3.8],
    stats: [
      { v: '532K', l: 'Sq Ft' },
      { v: '40+', l: 'Water Attractions' },
      { v: '2,000+', l: 'Buyout Capacity' },
    ],
    tenants: ['DreamWorks / Universal (since 2020)', 'Shrek, Madagascar, Trolls, Kung Fu Panda'],
    available: ['19 branded cabanas', '28 luxury skyboxes', 'Naming rights opportunity'],
    ctaSlideId: 'venue-detail',
    ctaLabel: 'See Venue Details',
  },

  // ── BIG SNOW ─────────────────────────────────────────────────────────────
  // Far NW corner, rises all the way to Level 4
  {
    id: 'bigsnow',
    name: 'Big SNOW',
    tagline: "North America's Only Indoor Real-Snow Ski Slope",
    levels: [2, 3, 4],
    primaryLevel: 2,
    category: 'adventure',
    color: '#a8d8ea',
    shapeType: 'slope',
    position: [-7.5, -2.5],
    size: [3.5, 5.0],
    stats: [
      { v: '180K', l: 'Sq Ft of Snow' },
      { v: '12', l: 'Ski Runs' },
      { v: '28°F', l: 'Year-Round' },
    ],
    tenants: ['Big SNOW (Operated Independently)'],
    available: ['Private slope booking (2–4 month lead)', 'Corporate team building', 'Film production bookings'],
    ctaSlideId: 'venue-detail',
    ctaLabel: 'See Venue Details',
  },

  // ── THE RINK ──────────────────────────────────────────────────────────────
  // Central oval on Level 1 — inside the main corridor
  {
    id: 'therink',
    name: 'The Rink',
    tagline: 'Year-Round Indoor Ice Skating',
    levels: [1],
    primaryLevel: 1,
    category: 'adventure',
    color: '#d4af37',
    shapeType: 'rink',
    position: [-3.0, 0.5],
    size: [2.2, 2.2],
    stats: [
      { v: '18K', l: 'Sq Ft Ice Surface' },
      { v: '200', l: 'Skater Capacity' },
      { v: '365', l: 'Days a Year' },
    ],
    tenants: ['The Rink (American Dream)'],
    available: ['Private ice parties (1–3 month lead)', 'Ice show production', 'Holiday events'],
    ctaSlideId: 'venue-detail',
    ctaLabel: 'Book The Rink',
  },

  // ── THE AVENUE — LUXURY WING ──────────────────────────────────────────────
  // Long thin east-west corridor along the south side, Level 1–2
  {
    id: 'avenue',
    name: 'The Avenue — Luxury Wing',
    tagline: 'The Most Ambitious Luxury Retail in the Western Hemisphere',
    levels: [1, 2],
    primaryLevel: 1,
    category: 'luxury',
    color: '#c9a84c',
    position: [4.5, 2.2],
    size: [7.0, 1.2],
    stats: [
      { v: '30+', l: 'Luxury Boutiques' },
      { v: '$245', l: 'Avg Spend / Visit' },
      { v: '$104K+', l: 'Avg Household Income' },
    ],
    tenants: ['Saks Fifth Avenue', 'Gucci', 'Saint Laurent', 'Hermès', 'Ferrari', 'Rolex', 'Tiffany & Co.', 'Balenciaga', 'Dolce & Gabbana', 'Watches of Switzerland'],
    available: ['2 boutique spaces: 2,000–4,500 sq ft', 'The Avenue Atrium pop-up (400–800 sq ft)', 'Digital brand integration'],
    ctaSlideId: 'luxury',
    ctaLabel: 'Explore The Avenue',
  },

  // ── RETAIL COURTS ─────────────────────────────────────────────────────────
  // Center-south retail spine, Levels 1–2
  {
    id: 'retail',
    name: 'Retail Courts (A–E)',
    tagline: 'Six Distinct Courts, One Address',
    levels: [1, 2],
    primaryLevel: 1,
    category: 'retail',
    color: '#8B7355',
    position: [1.0, 1.0],
    size: [6.0, 1.8],
    stats: [
      { v: '450+', l: 'Total Tenants' },
      { v: '3M+', l: 'Total Sq Ft GLA' },
      { v: '3.2×', l: 'Conversion Rate vs Avg Mall' },
    ],
    tenants: ['Zara', 'H&M', 'Primark', 'Uniqlo', 'Aritzia', 'Lululemon', 'Anthropologie', 'Toys "R" Us'],
    available: ['Standard retail: 4,000–20,000 sq ft', 'Seasonal pods: 200–400 sq ft (30–90 day terms)', 'Pop-up studios: 800–2,000 sq ft'],
    ctaSlideId: 'leasing-intro',
    ctaLabel: 'Explore Leasing',
  },

  // ── SEA LIFE AQUARIUM ─────────────────────────────────────────────────────
  // West side, Level 2–3 — north of The Rink
  {
    id: 'sealife',
    name: 'SEA LIFE Aquarium',
    tagline: 'Unique Private Event Backdrop',
    levels: [2, 3],
    primaryLevel: 2,
    category: 'culture',
    color: '#00897b',
    shapeType: 'cylinder',
    position: [-4.5, -1.2],
    size: [2.2, 2.2],
    stats: [
      { v: '200+', l: 'Marine Species' },
      { v: '360°', l: 'Underwater Tunnel' },
      { v: '500', l: 'Private Event Cap.' },
    ],
    tenants: ['Merlin Entertainments (since 2021)'],
    available: ['Premium private dinners', 'Charity galas', 'Photography shoots (2–4 month lead)'],
    ctaSlideId: 'venue-detail',
    ctaLabel: 'Book SEA LIFE',
  },

  // ── ANGRY BIRDS MINI GOLF ─────────────────────────────────────────────────
  // West-central area, Level 2–3
  {
    id: 'angrybirds',
    name: 'Angry Birds Mini Golf',
    tagline: '18-Hole Indoor Mini Golf Experience',
    levels: [2, 3],
    primaryLevel: 2,
    category: 'entertainment',
    color: '#ff4500',
    position: [-2.0, -1.5],
    size: [2.5, 1.8],
    stats: [
      { v: '18', l: 'Holes' },
      { v: 'Indoor', l: 'Year-Round' },
      { v: 'Rovio', l: 'IP Partner since 2021' },
    ],
    tenants: ['Rovio Entertainment (Angry Birds IP)'],
    available: ['Private group bookings', 'Brand activation overlay'],
    ctaSlideId: 'existing-partners',
    ctaLabel: 'See Partnerships',
  },

  // ── CMX CINÉBISTRO ────────────────────────────────────────────────────────
  // East section Level 2–3
  {
    id: 'cmx',
    name: 'CMX Cinébistro',
    tagline: 'Premium Cinema + Full-Service Dining',
    levels: [2, 3],
    primaryLevel: 2,
    category: 'entertainment',
    color: '#4a1942',
    position: [6.5, -0.5],
    size: [2.8, 2.5],
    stats: [
      { v: 'Multi', l: 'Premium Screens' },
      { v: 'Full', l: 'Bar & Restaurant' },
      { v: 'Private', l: 'Screening Available' },
    ],
    tenants: ['CMX Cinemas (Operator)'],
    available: ['Private screenings', 'Corporate film launches', 'Branded screening nights'],
    ctaSlideId: 'events',
    ctaLabel: 'Explore Events',
  },

  // ── LEGOLAND DISCOVERY CENTER ─────────────────────────────────────────────
  // Level 3, central area (above retail courts)
  {
    id: 'legoland',
    name: 'LEGOLAND Discovery Center',
    tagline: '4D Cinema, Miniland NYC & LEGO Experiences',
    levels: [3],
    primaryLevel: 3,
    category: 'culture',
    color: '#e8001a',
    position: [-1.0, -0.5],
    size: [3.0, 2.0],
    stats: [
      { v: '4D', l: 'Cinema Experience' },
      { v: 'Miniland', l: 'NYC/NJ Skyline' },
      { v: 'LEGO', l: 'Master Builder Program' },
    ],
    tenants: ['LEGO / Merlin Entertainments (since 2021)'],
    available: ['Private event booking', 'School programs', 'Corporate LEGO workshops'],
    ctaSlideId: 'existing-partners',
    ctaLabel: 'See Partnerships',
  },

  // ── MUSEUM OF ILLUSIONS ───────────────────────────────────────────────────
  // Level 3, adjacent to Legoland
  {
    id: 'museum',
    name: 'Museum of Illusions',
    tagline: 'Immersive, Shareable, Social-First Experiences',
    levels: [3],
    primaryLevel: 3,
    category: 'culture',
    color: '#7b2ff7',
    position: [2.5, -0.5],
    size: [2.8, 2.0],
    stats: [
      { v: 'Social', l: 'Content-First Design' },
      { v: 'All Ages', l: 'Family + Adult' },
      { v: 'Indoor', l: 'Year-Round' },
    ],
    tenants: ['Museum of Illusions (Operator)'],
    available: ['Private booking', 'Brand activation overlay', 'Influencer event packages'],
    ctaSlideId: 'events',
    ctaLabel: 'Explore Events',
  },

  // ── THE DINING TERRACE ────────────────────────────────────────────────────
  // Level 3, center-east
  {
    id: 'dining',
    name: 'The Dining Terrace',
    tagline: '100+ Concepts — From QSR to Fine Dining',
    levels: [3],
    primaryLevel: 3,
    category: 'dining',
    color: '#f26522',
    position: [4.5, 0.5],
    size: [3.5, 2.0],
    stats: [
      { v: '100+', l: 'Dining Concepts' },
      { v: '78%', l: 'Visitors Dine On-Site' },
      { v: '$245', l: 'Avg Total Spend/Visit' },
    ],
    tenants: ['Wagyu House', 'Carpaccio', 'Shake Shack', 'Don Angie', 'Wolfgangs Steakhouse'],
    available: ['F&B leasing 1,500–15,000 sq ft', 'Food hall kiosks from 200 sq ft', '6 format tiers available'],
    ctaSlideId: 'leasing-formats',
    ctaLabel: 'Explore Leasing Formats',
  },

  // ── THE OVAL ─────────────────────────────────────────────────────────────
  // Far east, Level 3–4 — elliptical event space
  {
    id: 'oval',
    name: 'The Oval',
    tagline: 'Premium East Wing Multi-Purpose Event Space',
    levels: [3, 4],
    primaryLevel: 3,
    category: 'entertainment',
    color: '#e8e8d0',
    shapeType: 'oval',
    position: [8.5, 0.0],
    size: [2.0, 2.5],
    stats: [
      { v: 'East', l: 'Wing Location' },
      { v: 'Multi', l: 'Purpose Event Space' },
      { v: 'Private', l: 'Event Booking' },
    ],
    tenants: ['American Dream Events'],
    available: ['Conferences', 'Product launches', 'Experiential marketing'],
    ctaSlideId: 'cta',
    ctaLabel: 'Submit Inquiry',
  },

  // ── B&B THEATRES / NINJA KIDZ ─────────────────────────────────────────────
  // Level 4 east block — a separate tall structure
  {
    id: 'theatres',
    name: 'B&B Theatres + Ninja Kidz',
    tagline: 'Premium Cinema & Family Entertainment',
    levels: [4],
    primaryLevel: 4,
    category: 'entertainment',
    color: '#334466',
    position: [7.5, -0.5],
    size: [3.0, 3.0],
    stats: [
      { v: 'Level 4', l: 'Exclusive Location' },
      { v: 'Cinema', l: '& Entertainment' },
      { v: 'Private', l: 'Event Screening' },
    ],
    tenants: ['B&B Theatres', 'Ninja Kidz'],
    available: ['Private screenings', 'Group bookings'],
    ctaSlideId: 'events',
    ctaLabel: 'Explore Events',
  },

  // ── A'MUSE ENTERTAINMENT ──────────────────────────────────────────────────
  // Level 1 — central area near DreamWorks entry
  {
    id: 'amuse',
    name: "A'MUSE Entertainment",
    tagline: 'Family Entertainment & Guest Hub',
    levels: [1],
    primaryLevel: 1,
    category: 'entertainment',
    color: '#9b59b6',
    position: [3.0, -1.5],
    size: [2.5, 2.0],
    stats: [
      { v: '40M+', l: 'Annual Visitors' },
      { v: 'Level 1', l: 'Prime Entry Location' },
      { v: 'Year-Round', l: 'Operations' },
    ],
    tenants: ["A'MUSE Operator", 'Guest Services Hub'],
    available: ['Brand activation space', 'Pop-up experience zones'],
    ctaSlideId: 'events',
    ctaLabel: 'Explore Events',
  },
]
