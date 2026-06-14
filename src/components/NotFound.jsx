import React, { useRef, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 1: Viking Head standing in front of a sealed wooden door
   ═══════════════════════════════════════════════════════════════════════════ */
function VikingScene() {
  const headRef = useRef();
  useFrame((state) => {
    if (headRef.current) headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.15;
  });
  return (
    <group>
      {/* Stone Wall — fills the background */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[5, 4, 0.5]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.95} />
      </mesh>
      {/* Wooden Door */}
      <mesh position={[0, -0.2, -0.7]}>
        <boxGeometry args={[1.4, 2.2, 0.15]} />
        <meshStandardMaterial color="#3e2312" />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.4, -0.3, -0.55]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#c4a032" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Door planks */}
      {[-0.5, -0.15, 0.2, 0.55].map(x => (
        <mesh key={x} position={[x, -0.2, -0.6]}>
          <boxGeometry args={[0.02, 2.2, 0.02]} />
          <meshStandardMaterial color="#2a1a0a" />
        </mesh>
      ))}

      {/* Viking Head — right at center */}
      <group ref={headRef} position={[0, 0, 0.5]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#f5d0a0" />
        </mesh>
        {/* Moustache */}
        <mesh position={[-0.22, -0.2, 0.51]}>
          <boxGeometry args={[0.35, 0.15, 0.08]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
        <mesh position={[0.22, -0.2, 0.51]}>
          <boxGeometry args={[0.35, 0.15, 0.08]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.22, 0.15, 0.51]}>
          <boxGeometry args={[0.12, 0.12, 0.05]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0.22, 0.15, 0.51]}>
          <boxGeometry args={[0.12, 0.12, 0.05]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Helmet */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.15, 0.35, 1.15]} />
          <meshStandardMaterial color="#777777" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.2, 0.1, 1.1]} />
          <meshStandardMaterial color="#666666" metalness={0.85} />
        </mesh>
        {/* Horns */}
        <mesh position={[-0.65, 0.85, 0]} rotation={[0, 0, Math.PI / 5]}>
          <coneGeometry args={[0.12, 0.7, 4]} />
          <meshStandardMaterial color="#f0e6d0" />
        </mesh>
        <mesh position={[0.65, 0.85, 0]} rotation={[0, 0, -Math.PI / 5]}>
          <coneGeometry args={[0.12, 0.7, 4]} />
          <meshStandardMaterial color="#f0e6d0" />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 2: Car driving on a road
   ═══════════════════════════════════════════════════════════════════════════ */
function CarScene() {
  const linesRef = useRef();
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.position.x = (state.clock.getElapsedTime() * 3) % 2;
    }
  });

  return (
    <group>
      {/* Road surface */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[14, 0.1, 3.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Road edges */}
      <mesh position={[0, -0.57, 1.6]}>
        <boxGeometry args={[14, 0.08, 0.12]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh position={[0, -0.57, -1.6]}>
        <boxGeometry args={[14, 0.08, 0.12]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>

      {/* Animated dashed center lines */}
      <group ref={linesRef}>
        {[-6, -4, -2, 0, 2, 4, 6].map((x) => (
          <mesh key={x} position={[x, -0.54, 0]}>
            <boxGeometry args={[0.8, 0.04, 0.15]} />
            <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Car — centered on the road */}
      <group position={[0, -0.15, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 0.45, 1.1]} />
          <meshStandardMaterial color="#cc2222" />
        </mesh>
        <mesh position={[-0.15, 0.42, 0]}>
          <boxGeometry args={[1.1, 0.4, 0.9]} />
          <meshStandardMaterial color="#66ddff" opacity={0.55} transparent />
        </mesh>
        <mesh position={[1.15, -0.1, 0]}>
          <boxGeometry args={[0.15, 0.25, 1.15]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        {[[-0.7, -0.25, 0.56], [0.7, -0.25, 0.56], [-0.7, -0.25, -0.56], [0.7, -0.25, -0.56]].map((pos, i) => (
          <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        ))}
        {/* Headlights */}
        <mesh position={[1.12, 0.05, 0.35]}>
          <boxGeometry args={[0.06, 0.12, 0.18]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={2} />
        </mesh>
        <mesh position={[1.12, 0.05, -0.35]}>
          <boxGeometry args={[0.06, 0.12, 0.18]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={2} />
        </mesh>
        {/* Taillights */}
        <mesh position={[-1.12, 0.05, 0.35]}>
          <boxGeometry args={[0.06, 0.1, 0.15]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
        </mesh>
        <mesh position={[-1.12, 0.05, -0.35]}>
          <boxGeometry args={[0.06, 0.1, 0.15]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Scene 3: Rifleman guard blocking a castle gate
   ═══════════════════════════════════════════════════════════════════════════ */
function CastleGuardScene() {
  const guardRef = useRef();
  useFrame((state) => {
    if (guardRef.current) guardRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.1;
  });
  return (
    <group>
      {/* Castle Wall — wide, fills the background */}
      <mesh position={[0, 0.5, -1.5]}>
        <boxGeometry args={[7, 4.5, 0.8]} />
        <meshStandardMaterial color="#505050" roughness={0.9} />
      </mesh>
      {/* Battlements on top */}
      {[-2.8, -1.4, 0, 1.4, 2.8].map((x) => (
        <mesh key={x} position={[x, 3, -1.5]}>
          <boxGeometry args={[0.8, 0.5, 0.8]} />
          <meshStandardMaterial color="#484848" roughness={0.9} />
        </mesh>
      ))}
      {/* Dark Iron Gate */}
      <mesh position={[0, -0.2, -1.05]}>
        <boxGeometry args={[1.6, 2.4, 0.1]} />
        <meshStandardMaterial color="#0e0e0e" metalness={0.95} roughness={0.3} />
      </mesh>
      {/* Gate bars */}
      {[-0.55, -0.2, 0.15, 0.5].map((x) => (
        <mesh key={x} position={[x, -0.2, -0.95]}>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color="#222222" metalness={0.9} />
        </mesh>
      ))}

      {/* Rifleman Guard — centered in front of the gate */}
      <group ref={guardRef} position={[0, -0.6, 0.3]}>
        {/* Legs */}
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.2]} />
          <meshStandardMaterial color="#2a3a2a" />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.2]} />
          <meshStandardMaterial color="#2a3a2a" />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.45, 0.6, 0.25]} />
          <meshStandardMaterial color="#334433" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#f5d0a0" />
        </mesh>
        {/* Guard helmet */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.35, 0.12, 0.35]} />
          <meshStandardMaterial color="#555555" metalness={0.8} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.3, 0.5, 0]}>
          <boxGeometry args={[0.12, 0.5, 0.15]} />
          <meshStandardMaterial color="#334433" />
        </mesh>
        <mesh position={[0.3, 0.45, 0.05]}>
          <boxGeometry args={[0.12, 0.55, 0.15]} />
          <meshStandardMaterial color="#334433" />
        </mesh>
        {/* Rifle */}
        <mesh position={[0.3, 0.1, 0.25]} rotation={[Math.PI / 3.5, 0, -0.15]}>
          <boxGeometry args={[0.05, 1, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Wrapper — gentle bobbing
   ═══════════════════════════════════════════════════════════════════════════ */
function SceneWrapper({ children }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   NotFound — main export
   ═══════════════════════════════════════════════════════════════════════════ */
export default function NotFound() {
  const sceneIndex = useMemo(() => Math.floor(Math.random() * 3), []);

  const scenes = [
    {
      title: "404: DOOR SEALED",
      desc: "You've wandered into the frozen north. The Viking chief blocking this door says this data node never existed.",
      cam: [0, 0.3, 3],       // eye-level, straight on
      target: [0, 0.1, 0],    // look at center of head
      orbit: false,
    },
    {
      title: "404: PATH BROKEN",
      desc: "The path to your location seems broken. Do you want to head back to your destination or stop at the docs junction?",
      cam: [1.5, 0.8, 3],     // slightly side, slightly above road
      target: [0, -0.1, 0],   // look at car center
      orbit: true,
    },
    {
      title: "404: CASTLE CLOSED",
      desc: "Our rifleman is blocking the castle gate. This sector is under active investigation for missing content.",
      cam: [0, 0.5, 3.5],     // straight on, eye-level with guard
      target: [0, 0, 0],      // look at center
      orbit: false,
    },
  ];

  const sceneComponents = [<VikingScene />, <CarScene />, <CastleGuardScene />];
  const active = scenes[sceneIndex];

  return (
    <div style={{ padding: '0', textAlign: 'center', color: 'var(--text-main)', minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* 3D Canvas */}
      <div style={{
        position: 'relative',
        width: 'calc(100% - 4rem)',
        height: '50vh',
        background: 'radial-gradient(ellipse at 50% 50%, #0a1a2e 0%, #040a12 60%, #000000 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line-primary)',
        overflow: 'hidden',
        margin: '2rem auto 0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        <Canvas
          style={{ width: '100%', height: '100%', display: 'block' }}
          camera={{ position: active.cam, fov: 50 }}
          onCreated={({ camera }) => {
            camera.lookAt(new THREE.Vector3(...active.target));
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-4, 3, 2]} intensity={0.6} color="#88ccff" />
            <SceneWrapper>{sceneComponents[sceneIndex]}</SceneWrapper>
            {active.orbit ? (
              <OrbitControls
                target={active.target}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={1.2}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 4}
                enablePan={false}
              />
            ) : (
              <OrbitControls target={active.target} enableZoom={false} enableRotate={false} enablePan={false} />
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* Text Content Below */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', margin: '0 0 0.5rem 0', fontWeight: '900', letterSpacing: '-1px', textShadow: '0 0 10px rgba(0,255,255,0.3)' }}>
          {active.title}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          {active.desc}
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ padding: '0.85rem 1.75rem', backgroundColor: 'var(--doc-primary)', color: '#fff', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 'bold', transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--doc-primary)'}>
            Head Back to Destination
          </Link>
          <Link to="/docs" style={{ padding: '0.85rem 1.75rem', backgroundColor: 'transparent', color: 'var(--text-bright)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 'bold', border: '1px solid var(--line-primary)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'var(--text-bright)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = 'var(--line-primary)'; }}>
            Stop at Docs Junction
          </Link>
        </div>
      </div>
    </div>
  );
}
