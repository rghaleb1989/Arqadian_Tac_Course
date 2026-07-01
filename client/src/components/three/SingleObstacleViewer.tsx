// Renders a single obstacle on a small stage with auto-rotate orbit controls.
// Exposes the model group via ref so the parent can export it to .glb.
import { Suspense, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { Lighting, GroundGrid } from "./SceneEnv";
import { OBSTACLE_MODELS } from "./ObstacleModelsB";
import { getObstacle } from "@/lib/obstacles";
import { exportObjectToGlb } from "@/lib/exportGlb";

export interface SingleViewerHandle {
  exportGlb: (filename: string) => Promise<void>;
  capturePng: (filename: string) => void;
}

function ModelStage({ id, groupRef }: { id: string; groupRef: React.RefObject<THREE.Group | null> }) {
  const Model = OBSTACLE_MODELS[id];
  if (!Model) return null;
  return (
    <group>
      <group ref={groupRef}>
        <Model />
      </group>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={18} blur={2.2} far={9} />
    </group>
  );
}

// Bridge component to capture gl renderer for PNG export.
const GLBridge = forwardRef<{ gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera } | null>(
  (_, ref) => {
    const { gl, scene, camera } = useThree();
    useImperativeHandle(ref, () => ({ gl, scene, camera }), [gl, scene, camera]);
    return null;
  },
);
GLBridge.displayName = "GLBridge";

const SingleObstacleViewer = forwardRef<SingleViewerHandle, { id: string; autoRotate?: boolean }>(
  ({ id, autoRotate = true }, ref) => {
    const meta = getObstacle(id);
    const groupRef = useRef<THREE.Group | null>(null);
    const bridgeRef = useRef<{ gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera } | null>(null);

    useImperativeHandle(ref, () => ({
      exportGlb: async (filename: string) => {
        if (groupRef.current) await exportObjectToGlb(groupRef.current, filename);
      },
      capturePng: (filename: string) => {
        const b = bridgeRef.current;
        if (!b) return;
        b.gl.render(b.scene, b.camera);
        const data = b.gl.domElement.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = data;
        a.download = filename;
        a.click();
      },
    }));

    return (
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [7, 5, 9], fov: 42 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#15181d"]} />
        <fog attach="fog" args={["#15181d", 22, 55]} />
        <Lighting />
        <GroundGrid size={60} />
        <Suspense
          fallback={
            <Html center>
              <div className="font-mono text-xs text-primary">LOADING MODEL…</div>
            </Html>
          }
        >
          <ModelStage id={id} key={id} groupRef={groupRef} />
        </Suspense>
        <GLBridge ref={bridgeRef} />
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          enablePan={false}
          minDistance={4}
          maxDistance={26}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, meta ? Math.min(meta.height * 0.45, 2.2) : 1.5, 0]}
        />
      </Canvas>
    );
  },
);
SingleObstacleViewer.displayName = "SingleObstacleViewer";

export default SingleObstacleViewer;
