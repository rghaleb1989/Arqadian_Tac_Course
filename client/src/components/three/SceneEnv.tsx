// Shared scene environment: lighting, blueprint ground grid, ground plane.
import { Grid } from "@react-three/drei";
import * as THREE from "three";

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#cfe0ff", "#1a1d24", 0.5]} />
      <directionalLight
        position={[14, 22, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={90}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-12, 10, -8]} intensity={0.35} color="#9db4d8" />
    </>
  );
}

export function GroundGrid({ size = 120 }: { size?: number }) {
  return (
    <>
      {/* solid ground plane to catch shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#23272f" roughness={1} />
      </mesh>
      {/* blueprint grid */}
      <Grid
        args={[size, size]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#39404d"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#4d586b"
        fadeDistance={70}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0.01, 0]}
      />
    </>
  );
}

export const fogColor = new THREE.Color("#15181d");
