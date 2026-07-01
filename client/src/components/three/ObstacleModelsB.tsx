// Obstacle models 9-16 + combined registry.
import { useMemo } from "react";
import * as THREE from "three";
import { Beam, Bar, KnottedRope, RopeNet, Pad, MAT } from "./primitives";
import { MODELS_A } from "./ObstacleModels";

type ModelProps = Record<string, never>;

/* 9. DEVELOPED SPIDER WALK (WALL TRAVERSE) --------------------------------- */
function SpiderWalk(_: ModelProps) {
  const H = 3;
  const L = 5.4;
  const holds = useMemo(() => {
    const arr: { x: number; y: number; c: string }[] = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        x: -L / 2 + 0.4 + Math.random() * (L - 0.8),
        y: 0.6 + Math.random() * (H - 1.2),
        c: ["#f5a623", "#e07a5f", "#5cc8a8", "#6aa0e0"][i % 4],
      });
    }
    return arr;
  }, []);
  return (
    <group>
      <Pad size={[L + 1, 2]} />
      {/* support frame */}
      {[-1, 1].map((s) => (
        <Bar key={s} position={[s * L * 0.5, H / 2, -0.15]} length={H} radius={0.1} color={MAT.steelDark} />
      ))}
      <Beam position={[0, H, -0.15]} size={[L + 0.2, 0.16, 0.16]} color={MAT.steelDark} />
      {/* wall face */}
      <Beam position={[0, H / 2, 0]} size={[L, H, 0.16]} color={MAT.wall} />
      {/* climbing holds */}
      {holds.map((h, i) => (
        <mesh key={i} position={[h.x, h.y, 0.12]} castShadow>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color={h.c} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* 10. OLYMPUS WALL --------------------------------------------------------- */
function OlympusWall(_: ModelProps) {
  const H = 3.5;
  const W = 3.4;
  return (
    <group>
      <Pad size={[W + 1, 2.4]} />
      {/* main wall */}
      <Beam position={[0, H / 2, 0]} size={[W, H, 0.25]} color={MAT.timber} />
      {/* plank seams */}
      {[0.8, 1.6, 2.4].map((y, i) => (
        <Beam key={i} position={[0, y, 0.14]} size={[W, 0.04, 0.04]} color={MAT.timberDark} />
      ))}
      {/* top ledge / platform */}
      <Beam position={[0, H + 0.06, -0.3]} size={[W, 0.16, 0.8]} color={MAT.accent} />
      {/* back support braces */}
      {[-1, 1].map((s) => (
        <Bar key={s} position={[s * W * 0.4, H * 0.45, -0.9]} length={H + 0.6} radius={0.09} rotation={[0.45, 0, 0]} color={MAT.timberDark} />
      ))}
    </group>
  );
}

/* 11. RINGS ---------------------------------------------------------------- */
function Rings(_: ModelProps) {
  const H = 2.9;
  const L = 5.4;
  const count = 6;
  return (
    <group>
      <Pad size={[L + 1, 2.2]} />
      {[-1, 1].map((s) => (
        <Bar key={s} position={[s * L * 0.5, H / 2, 0]} length={H} radius={0.1} color={MAT.steel} />
      ))}
      <Beam position={[0, H, 0]} size={[L, 0.14, 0.14]} color={MAT.steelDark} />
      {Array.from({ length: count }).map((_, i) => {
        const x = -L / 2 + 0.4 + ((L - 0.8) / (count - 1)) * i;
        return (
          <group key={i} position={[x, H, 0]}>
            <Bar position={[0, -0.2, 0]} length={0.4} radius={0.015} color={MAT.rope} />
            {/* ring */}
            <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.17, 0.035, 10, 20]} />
              <meshStandardMaterial color={MAT.accent} metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* 12. INCLINE WALL (KNOTTED ROPES OVER BARRIER) ---------------------------- */
function InclineWall(_: ModelProps) {
  const H = 3.4;
  const W = 3.2;
  const incline = Math.PI / 5; // ~36deg from vertical
  return (
    <group>
      <Pad size={[W + 1, 4.5]} />
      {/* inclined panel */}
      <Beam position={[0, H / 2, H * 0.32]} size={[W, H + 0.6, 0.18]} color={MAT.timber} rotation={[incline, 0, 0]} />
      {/* top beam */}
      <Beam position={[0, H, 0]} size={[W + 0.2, 0.18, 0.4]} color={MAT.timberDark} />
      {/* back legs */}
      {[-1, 1].map((s) => (
        <Bar key={s} position={[s * W * 0.45, H * 0.5, -0.9]} length={H + 0.4} radius={0.1} rotation={[-0.4, 0, 0]} color={MAT.timberDark} />
      ))}
      {/* knotted ropes draped over */}
      {[-1, -0.33, 0.33, 1].map((f, i) => (
        <KnottedRope key={i} position={[f * W * 0.4, H - 0.05, 0.2]} length={2.6} knots={5} />
      ))}
    </group>
  );
}

/* 13. WALL BARRIER --------------------------------------------------------- */
function WallBarrier(_: ModelProps) {
  const H = 2;
  const W = 3.2;
  return (
    <group>
      <Pad size={[W + 1, 2]} />
      <Beam position={[0, H / 2, 0]} size={[W, H, 0.22]} color={MAT.timber} />
      {[0.5, 1.0, 1.5].map((y, i) => (
        <Beam key={i} position={[0, y, 0.12]} size={[W, 0.05, 0.04]} color={MAT.timberDark} />
      ))}
      <Beam position={[0, H + 0.05, 0]} size={[W + 0.1, 0.12, 0.3]} color={MAT.accent} />
      {/* side posts */}
      {[-1, 1].map((s) => (
        <Bar key={s} position={[s * W * 0.5, H / 2, 0]} length={H} radius={0.1} color={MAT.timberDark} />
      ))}
    </group>
  );
}

/* 14. HIGH CARGO NET ------------------------------------------------------- */
function HighCargoNet(_: ModelProps) {
  const H = 5;
  const W = 4;
  return (
    <group>
      <Pad size={[W + 1, 5]} />
      {/* A-frame */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Bar position={[s * W * 0.5, H / 2, 1.4]} length={H + 1} radius={0.13} rotation={[0.5, 0, 0]} color={MAT.timber} />
          <Bar position={[s * W * 0.5, H / 2, -1.4]} length={H + 1} radius={0.13} rotation={[-0.5, 0, 0]} color={MAT.timber} />
        </group>
      ))}
      {/* top beam */}
      <Beam position={[0, H, 0]} size={[W + 0.4, 0.2, 0.2]} color={MAT.timberDark} />
      {/* nets on both inclined faces */}
      <RopeNet width={W - 0.3} height={3.4} rows={7} cols={7} position={[0, H * 0.55, 1.45]} rotation={[0.5 - Math.PI / 2 + 0.0, 0, 0]} />
      <RopeNet width={W - 0.3} height={3.4} rows={7} cols={7} position={[0, H * 0.55, -1.45]} rotation={[-(0.5 - Math.PI / 2), 0, 0]} />
    </group>
  );
}

/* 15. MUD TRAP (WATER PIT) ------------------------------------------------- */
function MudTrap(_: ModelProps) {
  const L = 5.4;
  const W = 3.6;
  const depth = 0.5;
  return (
    <group>
      {/* pit walls (rim) */}
      <Beam position={[0, 0.15, W / 2]} size={[L + 0.4, 0.3, 0.2]} color={MAT.timberDark} />
      <Beam position={[0, 0.15, -W / 2]} size={[L + 0.4, 0.3, 0.2]} color={MAT.timberDark} />
      <Beam position={[L / 2, 0.15, 0]} size={[0.2, 0.3, W]} color={MAT.timberDark} />
      <Beam position={[-L / 2, 0.15, 0]} size={[0.2, 0.3, W]} color={MAT.timberDark} />
      {/* water/mud surface (recessed) */}
      <mesh position={[0, -depth * 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial color={MAT.water} metalness={0.3} roughness={0.2} transparent opacity={0.8} />
      </mesh>
      {/* low crossing pipes */}
      {[-1, 0, 1].map((z, i) => (
        <Bar key={i} position={[0, 0.45, z * (W * 0.28)]} length={L} radius={0.06} rotation={[0, 0, Math.PI / 2]} color={MAT.steel} />
      ))}
      {/* support uprights for pipes */}
      {[-1, 1].map((s) =>
        [-1, 0, 1].map((z) => (
          <Bar key={`${s}-${z}`} position={[s * L * 0.45, 0.3, z * (W * 0.28)]} length={0.5} radius={0.04} color={MAT.steelDark} />
        )),
      )}
    </group>
  );
}

/* 16. DESCENDING TOWER (RAPPELLING WALL) ----------------------------------- */
function DescendingTower(_: ModelProps) {
  const H = 6;
  const W = 3;
  const D = 3;
  return (
    <group>
      <Pad size={[W + 2, D + 2]} />
      {/* 4 corner posts */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Bar key={`${sx}-${sz}`} position={[sx * W * 0.5, H / 2, sz * D * 0.5]} length={H} radius={0.13} color={MAT.steelDark} />
        )),
      )}
      {/* platform levels */}
      {[2, 4, H].map((y, i) => (
        <Beam key={i} position={[0, y, 0]} size={[W + 0.2, 0.14, D + 0.2]} color={i === 2 ? MAT.timber : MAT.steel} />
      ))}
      {/* guard rails on top */}
      {[-1, 1].map((sz) => (
        <Beam key={sz} position={[0, H + 0.5, sz * D * 0.5]} size={[W, 0.08, 0.08]} color={MAT.accent} />
      ))}
      {/* rappelling wall face on front */}
      <Beam position={[0, H / 2, D / 2 + 0.1]} size={[W, H, 0.16]} color={MAT.wall} />
      {/* rope down the face */}
      <mesh position={[0.5, H * 0.5, D / 2 + 0.25]}>
        <cylinderGeometry args={[0.03, 0.03, H, 6]} />
        <meshStandardMaterial color={MAT.rope} roughness={0.9} />
      </mesh>
      {/* ladder on back */}
      {Array.from({ length: 9 }).map((_, i) => (
        <Bar key={i} position={[0, 0.6 + i * 0.6, -D / 2 - 0.1]} length={W * 0.7} radius={0.03} rotation={[0, 0, Math.PI / 2]} color={MAT.steel} />
      ))}
    </group>
  );
}

const MODELS_B = {
  "spider-walk": SpiderWalk,
  "olympus-wall": OlympusWall,
  rings: Rings,
  "incline-wall": InclineWall,
  "wall-barrier": WallBarrier,
  "high-cargo-net": HighCargoNet,
  "mud-trap": MudTrap,
  "descending-tower": DescendingTower,
};

export const OBSTACLE_MODELS: Record<string, React.ComponentType> = {
  ...MODELS_A,
  ...MODELS_B,
};
