// Renders a full course layout: obstacles placed along a path with numbered
// markers, plus start/finish markers. Click an obstacle to focus/select it.
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { Lighting, GroundGrid } from "./SceneEnv";
import { OBSTACLE_MODELS } from "./ObstacleModelsB";
import { getObstacle } from "@/lib/obstacles";
import type { CourseLayout } from "@/lib/layouts";

function PlacedModel({
  id,
  position,
  rotationY,
  number,
  selected,
  onSelect,
}: {
  id: string;
  position: [number, number];
  rotationY: number;
  number: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const Model = OBSTACLE_MODELS[id];
  const meta = getObstacle(id);
  if (!Model) return null;
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <Model />
      </group>
      {/* numbered floor marker */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.15, 32]} />
        <meshBasicMaterial color={selected ? "#f5a623" : "#4d586b"} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0, 0.06, 0]} center distanceFactor={28} occlude={false}>
        <div
          className={`font-mono font-bold select-none pointer-events-none ${
            selected ? "text-primary" : "text-white/70"
          }`}
          style={{ fontSize: 22 }}
        >
          {String(number).padStart(2, "0")}
        </div>
      </Html>
      {/* floating label */}
      <Html position={[0, (meta?.height ?? 3) + 1.1, 0]} center distanceFactor={34} occlude={false}>
        <div
          className={`px-2 py-0.5 rounded-sm border font-mono text-[11px] whitespace-nowrap select-none pointer-events-none backdrop-blur-sm ${
            selected
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-black/55 text-white/85 border-white/15"
          }`}
        >
          {meta?.name?.toUpperCase()}
        </div>
      </Html>
    </group>
  );
}

function PathLine({ layout }: { layout: CourseLayout }) {
  const points = useMemo(() => {
    return layout.obstacles.map((o) => new THREE.Vector3(o.position[0], 0.08, o.position[1]));
  }, [layout]);
  if (points.length < 2) return null;
  return <Line points={points} color="#f5a623" lineWidth={1.5} dashed dashSize={0.6} gapSize={0.4} />;
}

function StartFinish({ layout }: { layout: CourseLayout }) {
  if (layout.obstacles.length === 0) return null;
  const first = layout.obstacles[0];
  const last = layout.obstacles[layout.obstacles.length - 1];
  return (
    <>
      <group position={[first.position[0] - 8, 0, first.position[1] - 5]}>
        <Html center distanceFactor={36}>
          <div className="px-2 py-1 rounded-sm bg-emerald-500 text-black font-mono text-[11px] font-bold border border-emerald-300 select-none pointer-events-none">
            START
          </div>
        </Html>
      </group>
      <group position={[last.position[0] + 8, 0, last.position[1] + 5]}>
        <Html center distanceFactor={36}>
          <div className="px-2 py-1 rounded-sm bg-primary text-primary-foreground font-mono text-[11px] font-bold border border-amber-300 select-none pointer-events-none">
            FINISH
          </div>
        </Html>
      </group>
    </>
  );
}

export default function CourseViewer({
  layout,
  selectedId,
  onSelect,
}: {
  layout: CourseLayout;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const center = useMemo(() => {
    if (layout.obstacles.length === 0) return new THREE.Vector3(0, 0, 0);
    const xs = layout.obstacles.map((o) => o.position[0]);
    const zs = layout.obstacles.map((o) => o.position[1]);
    return new THREE.Vector3(
      (Math.min(...xs) + Math.max(...xs)) / 2,
      0,
      (Math.min(...zs) + Math.max(...zs)) / 2,
    );
  }, [layout]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [center.x + 4, 30, center.z + 40], fov: 45 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#15181d"]} />
      <fog attach="fog" args={["#15181d", 60, 150]} />
      <Lighting />
      <GroundGrid size={140} />
      <Suspense
        fallback={
          <Html center>
            <div className="font-mono text-xs text-primary">DEPLOYING COURSE…</div>
          </Html>
        }
      >
        {layout.obstacles.map((o, i) => (
          <PlacedModel
            key={`${o.id}-${i}`}
            id={o.id}
            position={o.position}
            rotationY={o.rotationY}
            number={i + 1}
            selected={selectedId === o.id}
            onSelect={onSelect}
          />
        ))}
        <PathLine layout={layout} />
        <StartFinish layout={layout} />
        <ContactShadows position={[center.x, 0.02, center.z]} opacity={0.35} scale={120} blur={2.5} far={12} />
      </Suspense>
      <OrbitControls
        enablePan
        minDistance={8}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2.05}
        target={[center.x, 2, center.z]}
      />
    </Canvas>
  );
}
