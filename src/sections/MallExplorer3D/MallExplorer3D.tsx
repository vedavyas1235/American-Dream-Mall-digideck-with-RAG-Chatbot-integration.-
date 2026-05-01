import { useRef, useState, useCallback, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useDeck } from '../../components/Deck/DeckEngine'
import { ZONES, type ZoneData } from './zoneData'
import { createLevel1Shape, createLevel3Shape, createLevel4Shape, createLevel4EastShape, FLOOR_H, SLAB } from './buildingGeometry'
import './MallExplorer3D.css'

const levelY = (l: number) => (l - 1) * (FLOOR_H + SLAB)

/* ═══════════════════════════════════════════════════════════════════════════
   FLOOR LEVEL — extruded curved shape: slab + glass walls + gold edges
   ═══════════════════════════════════════════════════════════════════════════ */
function FloorLevel({ level, shape }: { level: number; shape: THREE.Shape }) {
  const y = levelY(level)

  // Floor slab geometry (thin extrusion)
  const slabGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: SLAB, bevelEnabled: false })
    g.rotateX(-Math.PI / 2)
    return g
  }, [shape])

  // Glass walls (full floor height extrusion)
  const wallGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: FLOOR_H, bevelEnabled: false })
    g.rotateX(-Math.PI / 2)
    return g
  }, [shape])

  // Edge lines for the walls
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(wallGeo), [wallGeo])

  return (
    <group position={[0, y, 0]}>
      {/* Floor slab */}
      <mesh geometry={slabGeo} receiveShadow>
        <meshStandardMaterial color="#131320" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Glass walls */}
      <mesh geometry={wallGeo}>
        <meshPhysicalMaterial
          color="#7ab8e0"
          transparent opacity={0.09}
          roughness={0.05} metalness={0.45}
          transmission={0.5} thickness={0.4}
          side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>

      {/* Gold edge wireframe */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#c9a84c" transparent opacity={0.22} />
      </lineSegments>

      {/* Ceiling cap */}
      <mesh geometry={slabGeo} position={[0, FLOOR_H, 0]}>
        <meshStandardMaterial color="#18182a" roughness={0.6} metalness={0.4} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ZONE BLOCK — glowing interior element visible through glass
   ═══════════════════════════════════════════════════════════════════════════ */
function ZoneBlock({ zone, isActive, isHovered, onOver, onOut, onClick }: {
  zone: ZoneData; isActive: boolean; isHovered: boolean
  onOver: () => void; onOut: () => void; onClick: () => void
}) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const col = new THREE.Color(zone.color)
  const baseY = levelY(zone.primaryLevel) + SLAB + 0.05
  const blockH = FLOOR_H * 0.6

  const w = zone.size[0]
  const d = zone.size[1]
  const r = Math.max(w, d) / 2

  useFrame((_, dt) => {
    if (!ref.current) return
    const m = ref.current.material as THREE.MeshStandardMaterial
    const tgt = isActive ? 1.4 : isHovered ? 0.85 : 0.3
    m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, tgt, dt * 5)
    if (isActive) m.emissiveIntensity = 1.1 + Math.sin(Date.now() * 0.004) * 0.3
    if (glowRef.current) {
      const g = glowRef.current.material as THREE.MeshStandardMaterial
      g.emissiveIntensity = THREE.MathUtils.lerp(g.emissiveIntensity, isActive ? 3 : isHovered ? 1.5 : 0.25, dt * 4)
    }
  })

  const { geo, wireframe, meshPos, meshRot } = useMemo(() => {
    let g: THREE.BufferGeometry = new THREE.BoxGeometry(w, blockH, d)
    let wf: THREE.BufferGeometry = new THREE.BoxGeometry(w, blockH, d)
    let pos: [number, number, number] = [0, 0, 0]
    let rot: [number, number, number] = [0, 0, 0]

    if (zone.shapeType === 'dome') {
      g = new THREE.SphereGeometry(r * 0.95, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
      wf = new THREE.SphereGeometry(r * 0.95, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)
      pos = [0, -blockH / 2, 0]
    } else if (zone.shapeType === 'cylinder' || zone.shapeType === 'rink' || zone.shapeType === 'oval') {
      const rx = zone.shapeType === 'oval' ? w / 2 : w / 2
      const rz = zone.shapeType === 'oval' ? d / 2 : w / 2
      // Use scaled cylinder for oval
      g = new THREE.CylinderGeometry(rx, rx, blockH, 32)
      wf = new THREE.CylinderGeometry(rx, rx, blockH, 16)
      if (zone.shapeType === 'oval') {
        g.scale(1, 1, rz / rx)
        wf.scale(1, 1, rz / rx)
      }
    } else if (zone.shapeType === 'slope') {
      g = new THREE.BoxGeometry(w, blockH, d * 1.1)
      wf = new THREE.BoxGeometry(w, blockH, d * 1.1)
      rot = [Math.PI / 10, 0, 0]
      pos = [0, blockH * 0.4, 0]
    }

    return { geo: g, wireframe: wf, meshPos: pos, meshRot: rot }
  }, [zone.shapeType, w, d, r, blockH])

  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(wireframe), [wireframe])

  return (
    <group position={[zone.position[0], baseY + blockH / 2, zone.position[1]]}>
      {/* Main block */}
      <mesh ref={ref} castShadow position={meshPos} rotation={meshRot} geometry={geo}
        onPointerOver={e => { e.stopPropagation(); onOver(); document.body.style.cursor = 'pointer' }}
        onPointerOut={e => { e.stopPropagation(); onOut(); document.body.style.cursor = 'default' }}
        onClick={e => { e.stopPropagation(); onClick() }}>
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3}
          transparent opacity={isActive ? 0.88 : isHovered ? 0.72 : 0.5} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Floor glow */}
      <mesh ref={glowRef} position={[0, -blockH / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w + 0.5, d + 0.5]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.25}
          transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Active light beam */}
      {isActive && (
        <mesh position={[0, blockH * 0.7, 0]}>
          <cylinderGeometry args={[0.02, Math.min(w, d) * 0.35, FLOOR_H * 1.3, 16, 1, true]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={2.5}
            transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
      {/* Zone wireframe */}
      <lineSegments geometry={edgeGeo} position={meshPos} rotation={meshRot}>
        <lineBasicMaterial color={zone.color} transparent opacity={isActive ? 0.6 : isHovered ? 0.3 : 0.1} />
      </lineSegments>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING LABEL
   ═══════════════════════════════════════════════════════════════════════════ */
function ZoneLabel({ zone, isActive, isHovered, freeFlow }: {
  zone: ZoneData; isActive: boolean; isHovered: boolean; freeFlow: boolean
}) {
  const y = levelY(zone.primaryLevel) + FLOOR_H * 0.85
  const show = isHovered || isActive || freeFlow
  return (
    <Html position={[zone.position[0], y, zone.position[1]]} center
      style={{ pointerEvents: 'none', transition: 'all 0.35s ease', opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(8px)' }}>
      <div className="zone-hotspot">
        <div className="zone-hotspot__dot" style={{ background: zone.color, boxShadow: `0 0 10px ${zone.color}, 0 0 20px ${zone.color}50` }} />
        <span className="zone-hotspot__name">{zone.name}</span>
      </div>
    </Html>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLES + GROUND
   ═══════════════════════════════════════════════════════════════════════════ */
function Particles() {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const p = new Float32Array(60 * 3)
    for (let i = 0; i < 60; i++) { p[i*3]=(Math.random()-0.5)*28; p[i*3+1]=Math.random()*16; p[i*3+2]=(Math.random()-0.5)*20 }
    return p
  }, [])
  useFrame(s => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.008 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} count={60} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#c9a84c" size={0.04} transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.15,0]} receiveShadow>
        <circleGeometry args={[20,64]} /><meshStandardMaterial color="#0a0a10" roughness={0.9} metalness={0.1} /></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.14,0]}>
        <ringGeometry args={[18,20,64]} /><meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={0.2} transparent opacity={0.12} /></mesh>
      <gridHelper args={[40,40,'#141428','#141428']} position={[0,-0.13,0]} />
    </group>
  )
}

function LevelLabels({ filter }: { filter: number | null }) {
  return <group>{[1,2,3,4].map(l => {
    const y = levelY(l) + FLOOR_H / 2
    const on = filter === null || filter === l
    return <Html key={l} position={[-11, y, 0]} center>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'10px', fontWeight:700, letterSpacing:'0.22em',
        color: on ? '#c9a84c' : 'rgba(201,168,76,0.25)', textShadow: on ? '0 0 12px rgba(201,168,76,0.4)' : 'none',
        transition:'all 0.4s', pointerEvents:'none', whiteSpace:'nowrap' }}>LEVEL {l}</div>
    </Html>
  })}</group>
}

/* ═══════════════════════════════════════════════════════════════════════════
   ZONE DETAIL PANEL
   ═══════════════════════════════════════════════════════════════════════════ */
function Panel({ zone, onClose, onNav }: { zone: ZoneData; onClose: () => void; onNav: (id: string) => void }) {
  const cat: Record<string,string> = { entertainment:'Entertainment', luxury:'Luxury Retail', adventure:'Adventure',
    dining:'Dining & F&B', culture:'Culture & Family', retail:'Retail' }
  return (
    <motion.div className="zone-panel" style={{ border:`1px solid ${zone.color}44` }}
      initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:60 }}
      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
      <div className="zone-panel__accent" style={{ background: zone.color }} />
      <button className="zone-panel__close" onClick={onClose}>×</button>
      <div className="zone-panel__body">
        <div className="zone-panel__meta">
          <span className="zone-panel__level-badge" style={{ color:zone.color }}>
            {zone.levels.length > 1 ? `L${zone.levels[0]}–L${zone.levels.at(-1)}` : `Level ${zone.levels[0]}`}
          </span>
          <span className="zone-panel__category">{cat[zone.category]}</span>
        </div>
        <h2 className="zone-panel__name">{zone.name}</h2>
        <p className="zone-panel__tagline">{zone.tagline}</p>
        <div className="zone-panel__divider" />
        <div className="zone-panel__stats">{zone.stats.map(s =>
          <div key={s.l} className="zone-panel__stat">
            <span className="zone-panel__stat-val" style={{ color:zone.color }}>{s.v}</span>
            <span className="zone-panel__stat-lbl">{s.l}</span>
          </div>)}</div>
        {zone.tenants.length > 0 && <>
          <span className="zone-panel__section-label">Brands & Tenants</span>
          <ul className="zone-panel__tenants">{zone.tenants.slice(0,8).map(t => <li key={t}>{t}</li>)}</ul></>}
        <span className="zone-panel__section-label">Available Opportunities</span>
        <ul className="zone-panel__available">{zone.available.map(a => <li key={a}>{a}</li>)}</ul>
        <div className="zone-panel__ctas">
          <button className="zone-panel__cta-primary" style={{ background:zone.color, color:'#08080a' }}
            onClick={() => onNav(zone.ctaSlideId)}>{zone.ctaLabel} →</button>
          <button className="zone-panel__cta-secondary" onClick={() => onNav('cta')}>Submit Inquiry →</button>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function MallExplorer3D() {
  const { goToSlideById } = useDeck()
  const [activeZone, setActiveZone] = useState<ZoneData | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [freeFlow, setFreeFlow] = useState(false)
  const [lvlFilter, setLvlFilter] = useState<number | null>(null)
  const [hint, setHint] = useState(false)
  const [hintDone, setHintDone] = useState(false)

  const clickZone = useCallback((z: ZoneData) => setActiveZone(p => p?.id === z.id ? null : z), [])
  const toggleFF = () => { const n = !freeFlow; setFreeFlow(n); if (n && !hintDone) { setHint(true); setHintDone(true); setTimeout(() => setHint(false), 3000) } }
  const nav = useCallback((id: string) => goToSlideById(id), [goToSlideById])

  // Shapes per level
  const shapeL12 = useMemo(() => createLevel1Shape(), [])
  const shapeL3 = useMemo(() => createLevel3Shape(), [])
  const shapeL4 = useMemo(() => createLevel4Shape(), [])
  const shapeL4East = useMemo(() => createLevel4EastShape(), [])

  const visZones = lvlFilter ? ZONES.filter(z => z.levels.includes(lvlFilter)) : ZONES

  return (
    <section className="explorer-section">
      <div className="explorer-header">
        <div className="explorer-header__left">
          <span className="explorer-header__eyebrow">Interactive Floor Map</span>
          <span className="explorer-header__title">American Dream Mall — 3D Explorer</span>
        </div>
      </div>

      <div className="explorer-canvas-wrap">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [14, 16, 22], fov: 42, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: '#060608' }}
          onPointerMissed={() => setActiveZone(null)}>
          <color attach="background" args={['#060608']} />
          <fog attach="fog" args={['#060608', 38, 75]} />

          <ambientLight intensity={0.12} />
          <directionalLight position={[14, 22, 12]} intensity={1.6} color="#fff6e6" castShadow shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[-10, 14, -10]} intensity={0.35} color="#6688ff" />
          <pointLight position={[0, 20, 0]} intensity={0.7} color="#c9a84c" distance={45} />

          <OrbitControls enabled={freeFlow} enablePan enableZoom enableRotate={freeFlow}
            autoRotate={!freeFlow} autoRotateSpeed={0.3}
            minPolarAngle={0.15} maxPolarAngle={Math.PI / 2 - 0.08}
            minDistance={8} maxDistance={45} target={[0, 5, 0]} makeDefault />

          <Suspense fallback={null}>
            <Ground />

            {/* ── Building Levels (curved extruded shapes) ── */}
            {(!lvlFilter || lvlFilter === 1) && <FloorLevel level={1} shape={shapeL12} />}
            {(!lvlFilter || lvlFilter === 2) && <FloorLevel level={2} shape={shapeL12} />}
            {(!lvlFilter || lvlFilter === 3) && <FloorLevel level={3} shape={shapeL3} />}
            {(!lvlFilter || lvlFilter === 4) && <FloorLevel level={4} shape={shapeL4} />}
            {(!lvlFilter || lvlFilter === 4) && <FloorLevel level={4} shape={shapeL4East} />}

            {/* ── Interior Zone Blocks ── */}
            {visZones.map(z => <ZoneBlock key={z.id} zone={z}
              isActive={activeZone?.id === z.id} isHovered={hovered === z.id}
              onOver={() => setHovered(z.id)} onOut={() => setHovered(null)}
              onClick={() => clickZone(z)} />)}

            {/* ── Labels ── */}
            {visZones.map(z => <ZoneLabel key={z.id + '-l'} zone={z}
              isActive={activeZone?.id === z.id} isHovered={hovered === z.id} freeFlow={freeFlow} />)}

            <LevelLabels filter={lvlFilter} />
            <Particles />
          </Suspense>

          <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.4} intensity={0.9} radius={0.5} />
          </EffectComposer>
        </Canvas>

        <AnimatePresence>
          {hint && <motion.div className="explorer-freeflow-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="explorer-freeflow-hint__icon">🖱️</div>
            <div className="explorer-freeflow-hint__text">Drag · Scroll · Explore</div>
          </motion.div>}
        </AnimatePresence>

        <AnimatePresence>
          {activeZone && <Panel zone={activeZone} onClose={() => setActiveZone(null)} onNav={nav} />}
        </AnimatePresence>
      </div>

      <div className="explorer-controls">
        {[null, 1, 2, 3, 4].map(l => <button key={String(l)}
          className={`explorer-btn ${lvlFilter === l ? 'explorer-btn--active' : ''}`}
          onClick={() => setLvlFilter(l)}>{l === null ? 'All Levels' : `Level ${l}`}</button>)}
        <div className="explorer-controls__divider" />
        <button className={`explorer-btn explorer-btn--freeflow ${freeFlow ? 'is-active' : ''}`} onClick={toggleFF}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>{freeFlow ? 'Lock View' : 'Free Flow'}
        </button>
        <div className="explorer-controls__divider" />
        <button className="explorer-btn" onClick={() => { setFreeFlow(false); setLvlFilter(null); setActiveZone(null) }}>Reset</button>
      </div>
    </section>
  )
}
