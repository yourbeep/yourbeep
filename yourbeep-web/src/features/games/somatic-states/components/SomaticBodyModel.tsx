import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import { Box3, Group, Vector3 } from "three";
import ShimmerBlock from "@components/ui/ShimmerBlock";
import StatusPill from "@components/ui/StatusPill";
import {
  somaticRegionMeta,
  type SomaticRegionKey,
} from "../services/somaticConfig";

type SomaticBodyModelProps = {
  selectedRegion: SomaticRegionKey | null;
  onSelectRegion: (region: SomaticRegionKey) => void;
};

type RegionHotspotProps = {
  region: SomaticRegionKey;
  selectedRegion: SomaticRegionKey | null;
  onSelectRegion: (region: SomaticRegionKey) => void;
};

const BODY_MATERIAL = "#d9e6df";
const BODY_SHADOW = "#bfd3ca";
const MODEL_PATH = "/models/human_body_base_cartoon.glb";

function HumanFigure() {
  return (
    <group position={[0, -0.75, 0]}>
      <mesh position={[0, 2.38, 0]} castShadow>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial
          color={BODY_MATERIAL}
          metalness={0.15}
          roughness={0.72}
        />
      </mesh>
      <mesh position={[0, 1.94, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.14, 0.28, 24]} />
        <meshStandardMaterial
          color={BODY_SHADOW}
          metalness={0.08}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.42, 1.42, 8, 16]} />
        <meshStandardMaterial
          color={BODY_MATERIAL}
          metalness={0.12}
          roughness={0.72}
        />
      </mesh>
      <mesh position={[0, 0.14, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={BODY_SHADOW}
          metalness={0.08}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[-0.78, 1.02, 0]} rotation={[0, 0, -0.42]} castShadow>
        <capsuleGeometry args={[0.14, 1.1, 8, 16]} />
        <meshStandardMaterial
          color={BODY_MATERIAL}
          metalness={0.12}
          roughness={0.74}
        />
      </mesh>
      <mesh position={[0.78, 1.02, 0]} rotation={[0, 0, 0.42]} castShadow>
        <capsuleGeometry args={[0.14, 1.1, 8, 16]} />
        <meshStandardMaterial
          color={BODY_MATERIAL}
          metalness={0.12}
          roughness={0.74}
        />
      </mesh>
      <mesh position={[-0.26, -1.2, 0]} rotation={[0, 0, 0.06]} castShadow>
        <capsuleGeometry args={[0.16, 1.72, 8, 16]} />
        <meshStandardMaterial
          color={BODY_MATERIAL}
          metalness={0.12}
          roughness={0.76}
        />
      </mesh>
      <mesh position={[0.26, -1.2, 0]} rotation={[0, 0, -0.06]} castShadow>
        <capsuleGeometry args={[0.16, 1.72, 8, 16]} />
        <meshStandardMaterial
          color={BODY_MATERIAL}
          metalness={0.12}
          roughness={0.76}
        />
      </mesh>
    </group>
  );
}

function HumanBodyAsset() {
  const { scene } = useGLTF(MODEL_PATH);

  const { clonedScene, scale, offset } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const targetHeight = 4.9;
    const derivedScale = size.y > 0 ? targetHeight / size.y : 1;
    const bottomY = box.min.y;

    clone.traverse((child) => {
      const mesh = child as Group & {
        isMesh?: boolean;
        castShadow?: boolean;
        receiveShadow?: boolean;
      };

      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return {
      clonedScene: clone,
      scale: derivedScale,
      offset: [-center.x, -bottomY - targetHeight / 2 + 2, -center.z] as [
        number,
        number,
        number,
      ],
    };
  }, [scene]);

  return (
    <group scale={[scale, scale, scale]} position={[0, -0.55, 0]}>
      <primitive object={clonedScene} position={offset} />
    </group>
  );
}

function RegionHotspot({
  region,
  selectedRegion,
  onSelectRegion,
}: RegionHotspotProps) {
  const [hovered, setHovered] = useState(false);
  const meta = somaticRegionMeta[region];
  const selected = selectedRegion === region;
  const scale = selected ? 1.4 : hovered ? 1.22 : 1;

  return (
    <Float speed={2.1} rotationIntensity={0.18} floatIntensity={0.18}>
      <group position={meta.position}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelectRegion(region)}
          scale={scale}
        >
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial
            color={meta.color}
            emissive={meta.color}
            emissiveIntensity={selected ? 0.52 : hovered ? 0.34 : 0.18}
            roughness={0.22}
            metalness={0.28}
          />
        </mesh>

        {selected || hovered ? (
          <Html distanceFactor={10} position={[0, 0.24, 0]} center>
            <div className="rounded-full border border-white/80 bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#244046] shadow-[0_10px_28px_rgba(23,43,51,0.16)] backdrop-blur">
              {meta.label}
            </div>
          </Html>
        ) : null}
      </group>
    </Float>
  );
}

function SomaticBodyScene({
  selectedRegion,
  onSelectRegion,
}: SomaticBodyModelProps) {
  const hotspotRegions = useMemo(
    () => Object.keys(somaticRegionMeta) as SomaticRegionKey[],
    [],
  );

  return (
    <Canvas camera={{ position: [5, 0.8, 9], fov: 34 }} shadows>
      <color attach="background" args={["#f4f6f1"]} />
      <ambientLight intensity={1.35} />
      <directionalLight
        castShadow
        intensity={1.2}
        position={[3.8, 5, 6]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.54} position={[-4, 2, -4]} />
      <group position={[0, -0.1, 0]}>
        <HumanBodyAsset />
        {hotspotRegions.map((region) => (
          <RegionHotspot
            key={region}
            region={region}
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
          />
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-0.45}
        maxAzimuthAngle={0.45}
        minPolarAngle={Math.PI / 2.25}
        maxPolarAngle={Math.PI / 1.85}
      />
    </Canvas>
  );
}

export function SomaticBodyModel({
  selectedRegion,
  onSelectRegion,
}: SomaticBodyModelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,_rgba(226,240,234,0.95)_0%,_rgba(245,248,242,1)_68%)] shadow-[0_24px_56px_rgba(36,72,66,0.08)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Somatic Mapping
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--text)]">
            Touch the body area that feels most alive right now
          </h3>
        </div>
        <StatusPill tone={selectedRegion ? "primary" : "muted"} dot>
          {selectedRegion
            ? somaticRegionMeta[selectedRegion].label
            : "Awaiting selection"}
        </StatusPill>
      </div>

      <div className="h-[420px] w-full">
        <Suspense
          fallback={<ShimmerBlock className="h-full w-full rounded-none" />}
        >
          <SomaticBodyScene
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
          />
        </Suspense>
      </div>
    </motion.div>
  );
}

export default SomaticBodyModel;

useGLTF.preload(MODEL_PATH);
