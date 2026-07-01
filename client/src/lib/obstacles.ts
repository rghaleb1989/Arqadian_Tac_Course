// Obstacle registry — metadata for all 16 tactical training obstacles.
// The actual 3D geometry builders live in ObstacleModels.tsx, keyed by `id`.

export interface ObstacleMeta {
  id: string;
  index: number; // 1-based course number
  name: string;
  aka?: string; // alternate / universal name
  category: "Climb" | "Crawl" | "Traverse" | "Wall" | "Hazard" | "Tower";
  /** schematic footprint in meters [width(x), depth(z)] used for course layout spacing */
  footprint: [number, number];
  /** approximate height in meters for display */
  height: number;
  /** short operational description shown in the inspector */
  description: string;
  /** difficulty 1-5 */
  difficulty: number;
}

export const OBSTACLES: ObstacleMeta[] = [
  {
    id: "knotted-rope-climb",
    index: 1,
    name: "Knotted Rope Climb",
    aka: "Rope Climb",
    category: "Climb",
    footprint: [4, 3],
    height: 5,
    difficulty: 3,
    description:
      "Tall timber A-frame with knotted ropes suspended from a top crossbeam. Trainees ascend using the knots for grip, building upper-body and grip strength.",
  },
  {
    id: "declined-climbing",
    index: 2,
    name: "Declined Climbing",
    aka: "A-Frame / Slanted Wall",
    category: "Wall",
    footprint: [4, 4],
    height: 3,
    difficulty: 2,
    description:
      "Inverted-V slanted wall barrier set at roughly 45°. Trainees climb up one face and descend the other, testing footing on an inclined surface.",
  },
  {
    id: "monkey-bars",
    index: 3,
    name: "Monkey Bars",
    aka: "Overhead Ladder",
    category: "Traverse",
    footprint: [6, 2.5],
    height: 3,
    difficulty: 3,
    description:
      "Horizontal overhead ladder spanning two support towers. Trainees traverse hand-over-hand across the rungs without touching the ground.",
  },
  {
    id: "hell-climbing",
    index: 4,
    name: "Hell Climbing",
    aka: "Tall Curved / Warped Wall",
    category: "Wall",
    footprint: [4, 4],
    height: 4,
    difficulty: 5,
    description:
      "Tall concave curved wall. Trainees sprint up the curve and grab the top edge or hang ropes to pull over, demanding explosive power.",
  },
  {
    id: "rabbit-hole",
    index: 5,
    name: "Rabbit Hole",
    aka: "Through-Holes",
    category: "Crawl",
    footprint: [6, 3],
    height: 2.4,
    difficulty: 3,
    description:
      "A run of vertical panels with openings at varying heights. Trainees alternate between crawling, mid-crawling and jumping through each gap.",
  },
  {
    id: "low-crawl",
    index: 6,
    name: "Low Crawl",
    aka: "Barbed Wire Crawl",
    category: "Crawl",
    footprint: [6, 3],
    height: 0.6,
    difficulty: 2,
    description:
      "Low horizontal wires strung over a pit. Trainees low-crawl beneath the wires keeping their body flat to the ground.",
  },
  {
    id: "twister",
    index: 7,
    name: "Twister",
    aka: "Rotating Handles",
    category: "Traverse",
    footprint: [6, 2.5],
    height: 3,
    difficulty: 4,
    description:
      "Overhead beam fitted with free-rotating T-handles. Trainees traverse while the handles spin, challenging grip and core control.",
  },
  {
    id: "slide-for-life",
    index: 8,
    name: "Slide For Life",
    aka: "Zip Line",
    category: "Tower",
    footprint: [4, 10],
    height: 6,
    difficulty: 4,
    description:
      "A high start tower connected by a descending cable to a low end post. Trainees ride the cable down, releasing over a landing zone.",
  },
  {
    id: "spider-walk",
    index: 9,
    name: "Developed Spider Walk",
    aka: "Wall Traverse",
    category: "Traverse",
    footprint: [6, 2],
    height: 3,
    difficulty: 4,
    description:
      "Vertical wall fitted with small hand and foot holds. Trainees traverse sideways across the face without dropping to the ground.",
  },
  {
    id: "olympus-wall",
    index: 10,
    name: "Olympus Wall",
    aka: "High Wall",
    category: "Wall",
    footprint: [4, 2.5],
    height: 3.5,
    difficulty: 5,
    description:
      "A tall vertical wall with a top platform ledge. Trainees mantle up and over, often assisted by teammates, testing power and teamwork.",
  },
  {
    id: "rings",
    index: 11,
    name: "Rings",
    aka: "Gymnastic Rings",
    category: "Traverse",
    footprint: [6, 2.5],
    height: 3,
    difficulty: 4,
    description:
      "Overhead beam with a row of suspended gymnastic rings. Trainees swing ring-to-ring across the span, similar to the Twister but with rings.",
  },
  {
    id: "incline-wall",
    index: 12,
    name: "Incline Wall",
    aka: "Knotted Ropes Over Barrier",
    category: "Wall",
    footprint: [4, 4],
    height: 3.5,
    difficulty: 3,
    description:
      "An inclined wall barrier with knotted ropes draped over the top. Trainees haul themselves up the slope using the ropes.",
  },
  {
    id: "wall-barrier",
    index: 13,
    name: "Wall Barrier",
    aka: "Vault Wall",
    category: "Wall",
    footprint: [3.5, 2],
    height: 2,
    difficulty: 2,
    description:
      "A straightforward vertical timber wall. Trainees vault or climb over the top edge and drop down the far side.",
  },
  {
    id: "high-cargo-net",
    index: 14,
    name: "High Cargo Net",
    aka: "Climbing Net",
    category: "Climb",
    footprint: [5, 5],
    height: 5,
    difficulty: 3,
    description:
      "A tall frame supporting a rope cargo net. Trainees climb up one side of the net, over the top beam, and descend the other side.",
  },
  {
    id: "mud-trap",
    index: 15,
    name: "Mud Trap",
    aka: "Water Pit",
    category: "Hazard",
    footprint: [6, 4],
    height: 0.4,
    difficulty: 2,
    description:
      "A recessed pit filled with water or mud, often spanned by low pipes or grids. Trainees wade, crawl or pull across the hazard.",
  },
  {
    id: "descending-tower",
    index: 16,
    name: "Descending Tower",
    aka: "Rappelling Wall",
    category: "Tower",
    footprint: [5, 5],
    height: 6,
    difficulty: 5,
    description:
      "A multi-level tower with a vertical wall face. Trainees rappel down the face from the top platform under rope control.",
  },
];

export const CATEGORY_COLORS: Record<ObstacleMeta["category"], string> = {
  Climb: "#f5a623",
  Crawl: "#5cc8a8",
  Traverse: "#6aa0e0",
  Wall: "#e07a5f",
  Hazard: "#c98bdb",
  Tower: "#e0b84a",
};

export function getObstacle(id: string) {
  return OBSTACLES.find((o) => o.id === id);
}
