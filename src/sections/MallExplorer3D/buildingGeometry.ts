import * as THREE from 'three'

// ── American Dream Mall — Accurately Traced from Official Interactive Map ─────
//
// Coordinate system:
//   X = West(-) to East(+)
//   Z = North(-) to South(+)
//   Scale: ~1 unit ≈ 18 meters
//
// The real mall is oriented NW-SE along "American Dream Way".
// The building has two main sections:
//   1. WEST WING: Large entertainment block (Nick Universe + DreamWorks)
//      - Roughly rectangular, footprint ~280m x 200m
//      - Big SNOW rises on the northwest corner
//   2. EAST WING / SPINE: Long retail/luxury strip running east
//      - Tapers eastward, ends in The Avenue/Saks block
//      - Contains The Rink in a central oval position
//
// The two wings form a rough "L" shape that curves/pinches in the middle.

export const FLOOR_H = 3.0   // height of each floor level
export const SLAB    = 0.15  // floor slab thickness

// ── LEVEL 1 & 2: Full mall footprint ─────────────────────────────────────────
// As seen on the official Level 1 map: large western entertainment block
// connected to a long eastern retail spine. The total footprint runs
// from far west (Big SNOW/Nick) to far east (Saks Fifth Avenue).
export function createLevel1Shape(): THREE.Shape {
  const s = new THREE.Shape()

  // Starting at NW corner of Nickelodeon Universe (far west-northwest)
  s.moveTo(-9.0, -4.5)

  // North edge of Nick Universe — runs roughly east
  s.lineTo(-5.5, -5.5)
  // Nick north edge continues to DreamWorks north
  s.lineTo(-1.5, -5.5)
  // North edge DreamWorks — large rectangular protrusion northward
  s.lineTo(1.0, -6.5)
  s.lineTo(3.5, -6.5)
  // Northeast corner of DreamWorks block
  s.lineTo(5.0, -5.0)

  // East edge — transitions from entertainment block to retail spine (pinch)
  s.quadraticCurveTo(6.5, -4.0, 7.0, -2.5)

  // Far east — The Oval / B&B Theatres area (east tip)
  s.lineTo(8.5, -2.0)
  s.lineTo(9.5, -1.0)
  s.quadraticCurveTo(10.0, 0.0, 9.5, 1.0)
  s.lineTo(8.5, 1.5)

  // South edge of east retail spine — runs west
  s.lineTo(7.5, 2.0)
  // Saks / Avenue east end
  s.lineTo(5.5, 2.5)
  s.lineTo(3.5, 2.5)

  // Central south — retail courts, slight notch
  s.lineTo(2.0, 3.0)
  s.lineTo(0.0, 3.0)
  s.lineTo(-2.0, 2.5)

  // South edge of DreamWorks Water Park (south exterior)
  s.quadraticCurveTo(-3.5, 2.0, -4.0, 1.0)

  // Southwest — The Rink + lobby area
  s.lineTo(-5.0, 0.5)
  s.lineTo(-6.0, 0.0)

  // West face — Big SNOW lower section
  s.lineTo(-7.5, -0.5)
  s.lineTo(-9.0, -1.5)

  // NW corner — back to start
  s.lineTo(-9.5, -3.0)
  s.lineTo(-9.0, -4.5)

  return s
}

// ── LEVEL 3: Retail spine + upper entertainment ───────────────────────────────
// Level 3 is significantly narrower than Level 1/2.
// The large western entertainment block (Nick + DreamWorks) shrinks — only
// Big SNOW continues upward on the northwest.
// The eastern section (retail spine, The Oval) continues but narrows.
export function createLevel3Shape(): THREE.Shape {
  const s = new THREE.Shape()

  // Big SNOW top section on northwest
  s.moveTo(-9.0, -4.0)
  s.lineTo(-7.0, -5.0)
  // North edge — narrower than L1/L2
  s.lineTo(-4.0, -4.5)
  s.lineTo(-1.0, -4.5)
  s.lineTo(1.0, -4.0)

  // East — retail spine continues
  s.quadraticCurveTo(4.0, -3.5, 6.0, -2.0)

  // The Oval area on far east — elliptical protrusion
  s.lineTo(8.0, -1.5)
  s.quadraticCurveTo(9.5, -0.5, 9.5, 0.5)
  s.quadraticCurveTo(9.5, 1.5, 8.0, 1.5)

  // South edge of L3 spine
  s.lineTo(6.0, 1.5)
  s.lineTo(4.0, 2.0)
  s.lineTo(1.5, 2.0)
  s.lineTo(-0.5, 1.5)

  // West portion narrows — no DreamWorks here
  s.lineTo(-2.5, 1.0)
  s.lineTo(-4.5, 0.5)
  s.lineTo(-6.5, 0.0)

  // Big SNOW west wall continues up
  s.lineTo(-8.5, -1.0)
  s.lineTo(-9.5, -2.5)
  s.lineTo(-9.0, -4.0)

  return s
}

// ── LEVEL 4: Primarily Big SNOW tower + east theatre block ───────────────────
// Level 4 on the west is almost entirely Big SNOW ski slope.
// On the far east, B&B Theatres + Ninja Kidz are a separate tall block.
export function createLevel4Shape(): THREE.Shape {
  const s = new THREE.Shape()

  // Big SNOW northwest block
  s.moveTo(-9.0, -3.5)
  s.lineTo(-6.5, -5.0)
  s.lineTo(-4.5, -4.5)
  s.lineTo(-4.0, -3.0)
  s.lineTo(-5.0, -1.5)
  s.lineTo(-7.5, -0.5)
  s.lineTo(-9.5, -1.5)
  s.lineTo(-9.0, -3.5)

  return s
}

// ── LEVEL 4 EAST: B&B Theatres + Ninja Kidz block ────────────────────────────
// The east section at Level 4 is a distinct tall pentagonal block.
export function createLevel4EastShape(): THREE.Shape {
  const s = new THREE.Shape()

  s.moveTo(5.5, -2.5)
  s.lineTo(8.0, -2.5)
  s.lineTo(9.5, -1.0)
  s.lineTo(9.5, 1.0)
  s.lineTo(8.0, 1.5)
  s.lineTo(5.5, 1.5)
  s.lineTo(5.0, 0.0)
  s.lineTo(5.5, -2.5)

  return s
}
