// Export the currently rendered three.js scene (or a sub-object) to a .glb file.
// We hook into the live R3F scene via a captured THREE.Scene reference.
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as THREE from "three";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Exports a THREE.Object3D (e.g. the obstacle group) to a binary .glb file.
 * Strips helper objects (grid, lights are optional to include).
 */
export function exportObjectToGlb(object: THREE.Object3D, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      object,
      (result) => {
        if (result instanceof ArrayBuffer) {
          downloadBlob(new Blob([result], { type: "model/gltf-binary" }), filename);
          resolve();
        } else {
          const json = JSON.stringify(result);
          downloadBlob(new Blob([json], { type: "application/json" }), filename.replace(/\.glb$/, ".gltf"));
          resolve();
        }
      },
      (err) => reject(err),
      { binary: true },
    );
  });
}
