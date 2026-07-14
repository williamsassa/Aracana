"use client";

import Scene3DLoader from "./Scene3DLoader";
import StateSpaceRadar2D from "./StateSpaceRadar2D";

/** Same 3D-with-2D-fallback pattern as HeroSceneLoader — see Scene3DLoader
 * for the shared rationale (reduced-motion, no WebGL, low-end devices all
 * get the equivalent 2D radar rather than a downgraded experience). */
export default function StateSpaceSceneLoader({ stage }: { stage: number }) {
  return (
    <div className="aspect-[400/320] w-full overflow-hidden rounded-xl bg-[#05060a]">
      <Scene3DLoader
        loadScene={() => import("./three/StateSpaceScene")}
        fallback={<StateSpaceRadar2D stage={stage} />}
        className="h-full w-full"
        sceneProps={{ stage }}
      />
    </div>
  );
}
