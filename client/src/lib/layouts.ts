// Course layouts: each places obstacles along a path with position + rotation.
// Positions are in meters on the XZ ground plane. rotationY in radians.
import { OBSTACLES } from "./obstacles";

export interface PlacedObstacle {
  id: string;
  position: [number, number]; // x, z
  rotationY: number;
}

export interface CourseLayout {
  id: string;
  name: string;
  tagline: string;
  obstacles: PlacedObstacle[];
}

// Helper: serpentine path generator for a given ordered list of obstacle ids.
function serpentine(ids: string[], opts?: { spacing?: number; rowGap?: number; perRow?: number }): PlacedObstacle[] {
  const spacing = opts?.spacing ?? 11;
  const rowGap = opts?.rowGap ?? 14;
  const perRow = opts?.perRow ?? 4;
  const out: PlacedObstacle[] = [];
  ids.forEach((id, i) => {
    const row = Math.floor(i / perRow);
    let col = i % perRow;
    const leftToRight = row % 2 === 0;
    if (!leftToRight) col = perRow - 1 - col;
    const x = (col - (perRow - 1) / 2) * spacing;
    const z = (row - 0) * rowGap - 18;
    out.push({ id, position: [x, z], rotationY: leftToRight ? 0 : Math.PI });
  });
  return out;
}

const allIds = OBSTACLES.map((o) => o.id);

export const LAYOUTS: CourseLayout[] = [
  {
    id: "standard",
    name: "Standard Sequence",
    tagline: "All 16 obstacles in numbered order — full demonstration circuit.",
    obstacles: serpentine(allIds, { perRow: 4, spacing: 12, rowGap: 14 }),
  },
  {
    id: "endurance",
    name: "Endurance Circuit",
    tagline: "Climb & traverse heavy — sustained upper-body load.",
    obstacles: serpentine(
      [
        "knotted-rope-climb",
        "high-cargo-net",
        "monkey-bars",
        "twister",
        "rings",
        "spider-walk",
        "incline-wall",
        "descending-tower",
      ],
      { perRow: 4, spacing: 12, rowGap: 13 },
    ),
  },
  {
    id: "assault",
    name: "Assault Lane",
    tagline: "Walls, crawls & hazards — fast tactical breach lane.",
    obstacles: serpentine(
      [
        "low-crawl",
        "wall-barrier",
        "rabbit-hole",
        "declined-climbing",
        "mud-trap",
        "olympus-wall",
        "hell-climbing",
        "slide-for-life",
      ],
      { perRow: 4, spacing: 12, rowGap: 13 },
    ),
  },
  {
    id: "compact",
    name: "Compact Demo",
    tagline: "Six signature obstacles in a tight footprint for confined sites.",
    obstacles: serpentine(
      ["knotted-rope-climb", "monkey-bars", "olympus-wall", "low-crawl", "high-cargo-net", "slide-for-life"],
      { perRow: 3, spacing: 12, rowGap: 13 },
    ),
  },
];

export function getLayout(id: string) {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}
