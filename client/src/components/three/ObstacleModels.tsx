// Schematic 3D model builders for all 16 tactical obstacles.
// Each model is centered around the origin on the XZ plane, base at y=0.
// Kept low-poly & clearly readable for presentation contexts.
import { useMemo } from "react";
import * as THREE from "three";
import { Beam, Bar, KnottedRope, Pad, MAT } from "./primitives";

type ModelProps = Record<string, never>;

/* 1. KNOTTED ROPE CLIMB ---------------------------------------------------- */
function KnottedRopeClimb(_: ModelProps) {
  const H = 5;
  const W = 3.4;
  return (
    <group>
      <Pad size={[W + 1.2, 3]} />
      {/* two A-frame leg pairs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Bar position={[s * W * 0.5, H / 2, 0.8]} radius={0.12} length={H + 0.6} rotation={[0.18, 0, 0]} color={MAT.timber} />
          <Bar position={[s * W * 0.5, H / 2, -0.8]} radius={0.12} length={H + 0.6} rotation={[-0.18, 0, 0]} color={MAT.timber} />
        </group>
      ))}
      {/* top crossbeam */}
      <Beam position={[0, H, 0]} size={[W + 0.6, 0.22, 0.22]} color={MAT.timberDark} />
      {/* knotted ropes */}
      {[-1, -0.33, 0.33, 1].map((f, i) => (
        <KnottedRope key={i} position={[f * W * 0.42, H - 0.1, 0]} length={H - 0.4} knots={7} />
      ))}
    </group>
  );
}

/* 2. DECLINED CLIMBING (A-FRAME / SLANTED WALL) ---------------------------- */
function DeclinedClimbing(_: ModelProps) {
  const H = 3;
  const W = 3.2;
  const panel = 2.4;
  return (
    <group>
      <Pad size={[W + 1, 4]} />
      {/* two slanted panels meeting at apex */}
      <Beam position={[0, H / 2, panel * 0.42]} size={[W, panel, 0.18]} color={MAT.timber} rotation={[Math.PI / 4, 0, 0]} />
      <Beam position={[0, H / 2, -panel * 0.42]} size={[W, panel, 0.18]} color={MAT.timberDark} rotation={[-Math.PI / 4, 0, 0]} />
      {/* apex bar */}
      <Beam position={[0, H + 0.05, 0]} size={[W + 0.2, 0.16, 0.3]} color={MAT.steelDark} />
      {/* cross battens on climb face */}
      {[0.5, 1.1, 1.7].map((y, i) => (
        <Beam key={i} position={[0, y, (H - y) * 0.6]} size={[W - 0.2, 0.08, 0.1]} color={MAT.timberDark} rotation={[Math.PI / 4, 0, 0]} />
      ))}
    </group>
  );
}

/* 3. MONKEY BARS ----------------------------------------------------------- */
function MonkeyBars(_: ModelProps) {
  const H = 2.9;
  const L = 5.4;
  const rungs = 9;
  return (
    <group>
      <Pad size={[L + 1, 2.4]} />
      {/* support posts at each end */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Bar position={[s * L * 0.5, H / 2, 0.6]} length={H} radius={0.1} color={MAT.steel} />
          <Bar position={[s * L * 0.5, H / 2, -0.6]} length={H} radius={0.1} color={MAT.steel} />
          <Beam position={[s * L * 0.5, H, 0]} size={[0.16, 0.16, 1.4]} color={MAT.steelDark} />
        </group>
      ))}
      {/* side rails */}
      {[-0.6, 0.6].map((z) => (
        <Beam key={z} position={[0, H, z]} size={[L, 0.12, 0.12]} color={MAT.steelDark} />
      ))}
      {/* rungs */}
      {Array.from({ length: rungs }).map((_, i) => {
        const x = -L / 2 + (L / (rungs - 1)) * i;
        return <Bar key={i} position={[x, H, 0]} length={1.2} radius={0.05} rotation={[Math.PI / 2, 0, 0]} color={MAT.accent} />;
      })}
    </group>
  );
}

/* 4. HELL CLIMBING (CURVED / WARPED WALL) ---------------------------------- */
function HellClimbing(_: ModelProps) {
  const geom = useMemo(() => {
    // Build a curved concave ramp using an extruded curve profile.
    const shape = new THREE.Shape();
    const H = 4;
    const D = 3;
    shape.moveTo(0, 0);
    shape.lineTo(D, 0);
    // curve up the back
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = H * t;
      // concave: pull the face inward near top
      const z = D - D * Math.pow(t, 1.8);
      shape.lineTo(z, y);
    }
    shape.lineTo(0, 0);
    const extrude = new THREE.ExtrudeGeometry(shape, { depth: 3.4, bevelEnabled: false });
    extrude.translate(0, 0, -1.7);
    extrude.rotateY(Math.PI / 2);
    return extrude;
  }, []);
  return (
    <group>
      <Pad size={[4.4, 4.4]} />
      <mesh geometry={geom} castShadow receiveShadow position={[-1.5, 0, 0]}>
        <meshStandardMaterial color={MAT.wallDark} roughness={0.7} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* top edge */}
      <Beam position={[-1.5, 4, 0]} size={[0.3, 0.18, 3.4]} color={MAT.accent} />
      {/* hang ropes */}
      {[-1, 0, 1].map((z, i) => (
        <KnottedRope key={i} position={[-1.4, 3.9, z]} length={1.6} knots={3} />
      ))}
    </group>
  );
}

/* 5. RABBIT HOLE ----------------------------------------------------------- */
function RabbitHole(_: ModelProps) {
  // Three panels with openings at different heights (low/mid/high)
  const panels = [
    { z: 1.8, holeY: 0.45, holeH: 0.7 }, // low crawl
    { z: 0, holeY: 1.0, holeH: 0.8 }, // mid
    { z: -1.8, holeY: 1.6, holeH: 0.9 }, // high jump-through
  ];
  const W = 3;
  const H = 2.4;
  return (
    <group>
      <Pad size={[4, 5]} />
      {panels.map((p, idx) => {
        const top = p.holeY + p.holeH / 2;
        const botH = p.holeY - p.holeH / 2;
        return (
          <group key={idx} position={[0, 0, p.z]}>
            {/* posts */}
            {[-1, 1].map((s) => (
              <Bar key={s} position={[s * W * 0.5, H / 2, 0]} length={H} radius={0.09} color={MAT.timber} />
            ))}
            {/* bottom solid below hole */}
            {botH > 0.05 && <Beam position={[0, botH / 2, 0]} size={[W, botH, 0.16]} color={MAT.timber} />}
            {/* top solid above hole */}
            <Beam position={[0, top + (H - top) / 2, 0]} size={[W, H - top, 0.16]} color={MAT.timberDark} />
            {/* opening frame accent */}
            <Beam position={[0, top, 0]} size={[W, 0.08, 0.22]} color={MAT.accent} />
          </group>
        );
      })}
    </group>
  );
}

/* 6. LOW CRAWL (BARBED WIRE) ----------------------------------------------- */
function LowCrawl(_: ModelProps) {
  const L = 5.4;
  const W = 2.4;
  const posts = 4;
  const wireY = 0.5;
  return (
    <group>
      {/* sand/dirt pit */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[L + 0.6, W + 0.6]} />
        <meshStandardMaterial color={"#5a4d3a"} roughness={1} />
      </mesh>
      {/* short posts */}
      {Array.from({ length: posts }).map((_, i) => {
        const x = -L / 2 + (L / (posts - 1)) * i;
        return (
          <group key={i}>
            <Bar position={[x, 0.35, W / 2]} length={0.7} radius={0.06} color={MAT.steelDark} />
            <Bar position={[x, 0.35, -W / 2]} length={0.7} radius={0.06} color={MAT.steelDark} />
          </group>
        );
      })}
      {/* horizontal wires */}
      {[wireY, wireY - 0.18].map((y, r) =>
        [-W / 2, 0, W / 2].map((z, c) => (
          <Bar key={`${r}-${c}`} position={[0, y, z]} length={L} radius={0.015} rotation={[0, 0, Math.PI / 2]} color={MAT.steel} />
        )),
      )}
    </group>
  );
}

/* 7. TWISTER (ROTATING HANDLES) -------------------------------------------- */
function Twister(_: ModelProps) {
  const H = 2.9;
  const L = 5.4;
  const handles = 7;
  return (
    <group>
      <Pad size={[L + 1, 2.2]} />
      {[-1, 1].map((s) => (
        <Bar key={s} position={[s * L * 0.5, H / 2, 0]} length={H} radius={0.1} color={MAT.steel} />
      ))}
      <Beam position={[0, H, 0]} size={[L, 0.14, 0.14]} color={MAT.steelDark} />
      {Array.from({ length: handles }).map((_, i) => {
        const x = -L / 2 + (L / (handles - 1)) * i;
        return (
          <group key={i} position={[x, H, 0]}>
            <Bar position={[0, -0.25, 0]} length={0.5} radius={0.02} color={MAT.steel} />
            {/* T-handle */}
            <Bar position={[0, -0.5, 0]} length={0.38} radius={0.04} rotation={[Math.PI / 2, 0, 0]} color={MAT.accent} />
          </group>
        );
      })}
    </group>
  );
}

/* 8. SLIDE FOR LIFE (ZIP LINE) --------------------------------------------- */
function SlideForLife(_: ModelProps) {
  const startH = 6;
  const endH = 1.6;
  const span = 9;
  const cable = useMemo(() => {
    const start = new THREE.Vector3(0, startH - 0.2, span / 2);
    const end = new THREE.Vector3(0, endH, -span / 2);
    return [start, end] as const;
  }, []);
  // cable as a thin rotated cylinder
  const mid = new THREE.Vector3().addVectors(cable[0], cable[1]).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(cable[1], cable[0]);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  const euler = new THREE.Euler().setFromQuaternion(quat);
  return (
    <group>
      {/* start tower */}
      <group position={[0, 0, span / 2]}>
        {[-0.7, 0.7].map((x) =>
          [-0.7, 0.7].map((z) => (
            <Bar key={`${x}-${z}`} position={[x, startH / 2, z]} length={startH} radius={0.1} color={MAT.timber} />
          )),
        )}
        <Beam position={[0, startH, 0]} size={[1.8, 0.2, 1.8]} color={MAT.timberDark} />
        {/* platform deck */}
        <Beam position={[0, startH - 0.15, 0]} size={[1.7, 0.12, 1.7]} color={MAT.timber} />
        {/* ladder hint */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Bar key={i} position={[0.75, i * 0.9, 0.75]} length={1.4} radius={0.025} rotation={[0, 0, Math.PI / 2]} color={MAT.steel} />
        ))}
      </group>
      {/* end post */}
      <group position={[0, 0, -span / 2]}>
        <Bar position={[0, endH / 2, 0]} length={endH} radius={0.1} color={MAT.steel} />
      </group>
      {/* cable */}
      <mesh position={[mid.x, mid.y, mid.z]} rotation={euler}>
        <cylinderGeometry args={[0.03, 0.03, len, 6]} />
        <meshStandardMaterial color={MAT.steel} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* trolley handle */}
      <mesh position={[mid.x, mid.y + 0.05, mid.z]}>
        <boxGeometry args={[0.18, 0.12, 0.18]} />
        <meshStandardMaterial color={MAT.accent} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, span + 1]} />
        <meshStandardMaterial color={MAT.water} roughness={0.5} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export const MODELS_A = {
  "knotted-rope-climb": KnottedRopeClimb,
  "declined-climbing": DeclinedClimbing,
  "monkey-bars": MonkeyBars,
  "hell-climbing": HellClimbing,
  "rabbit-hole": RabbitHole,
  "low-crawl": LowCrawl,
  twister: Twister,
  "slide-for-life": SlideForLife,
};
