import type { ThreeElements } from "@react-three/fiber";

// With jsx:"preserve", TypeScript resolves intrinsic elements through the
// GLOBAL JSX namespace. @react-three/fiber only augments the `react`,
// `react/jsx-runtime` and `react/jsx-dev-runtime` module namespaces, so we
// bridge its element typings into the global JSX namespace here.
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
