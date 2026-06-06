import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Network, RotateCw, Pause, Play, Shuffle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

type NodeType = 'synthesizer' | 'proposer' | 'critic' | 'validator' | 'concept' | 'task';

interface GraphNode {
  id: string;
  type: NodeType;
}

interface GraphEdge {
  source: string;
  target: string;
}

const TYPE_COLOR: Record<NodeType, number> = {
  synthesizer: 0x4ade80,
  proposer: 0x60a5fa,
  critic: 0xc084fc,
  validator: 0xf472b6,
  concept: 0x22d3ee,
  task: 0xfbbf24,
};

const TYPE_SIZE: Record<NodeType, number> = {
  synthesizer: 6,
  proposer: 3.6,
  critic: 3.6,
  validator: 3.0,
  concept: 2.2,
  task: 2.0,
};

const NODES: GraphNode[] = [
  { id: 'syn', type: 'synthesizer' },
  { id: 'p1', type: 'proposer' },
  { id: 'p2', type: 'proposer' },
  { id: 'p3', type: 'proposer' },
  { id: 'c1', type: 'critic' },
  { id: 'c2', type: 'critic' },
  { id: 'v1', type: 'validator' },
  { id: 'v2', type: 'validator' },
  { id: 'k1', type: 'concept' },
  { id: 'k2', type: 'concept' },
  { id: 'k3', type: 'concept' },
  { id: 'k4', type: 'concept' },
  { id: 'k5', type: 'concept' },
  { id: 'k6', type: 'concept' },
  { id: 't1', type: 'task' },
  { id: 't2', type: 'task' },
  { id: 't3', type: 'task' },
];

const EDGES: GraphEdge[] = [
  { source: 't1', target: 'p1' },
  { source: 't1', target: 'p2' },
  { source: 't2', target: 'p2' },
  { source: 't2', target: 'p3' },
  { source: 't3', target: 'p1' },
  { source: 't3', target: 'p3' },
  { source: 'p1', target: 'c1' },
  { source: 'p2', target: 'c1' },
  { source: 'p3', target: 'c2' },
  { source: 'p1', target: 'c2' },
  { source: 'p2', target: 'c2' },
  { source: 'c1', target: 'syn' },
  { source: 'c2', target: 'syn' },
  { source: 'syn', target: 'v1' },
  { source: 'syn', target: 'v2' },
  { source: 'k1', target: 'p1' },
  { source: 'k2', target: 'p2' },
  { source: 'k3', target: 'p3' },
  { source: 'k4', target: 'syn' },
  { source: 'k5', target: 'c1' },
  { source: 'k6', target: 'c2' },
  { source: 'k1', target: 'syn' },
  { source: 'k3', target: 'syn' },
  { source: 'k6', target: 'p2' },
];

const LEGEND_TYPES: NodeType[] = ['synthesizer', 'proposer', 'critic', 'validator', 'concept', 'task'];

function makeRadialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.18)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function buildGeometry(type: NodeType, size: number): THREE.BufferGeometry {
  switch (type) {
    case 'synthesizer': return new THREE.IcosahedronGeometry(size, 1);
    case 'proposer': return new THREE.OctahedronGeometry(size);
    case 'critic': return new THREE.BoxGeometry(size * 1.25, size * 1.25, size * 1.25);
    case 'validator': return new THREE.TetrahedronGeometry(size * 1.1);
    case 'concept': return new THREE.SphereGeometry(size, 20, 16);
    case 'task': return new THREE.CylinderGeometry(size * 0.55, size * 0.55, size * 1.5, 8);
  }
}

function initialPosition(type: NodeType, idx: number): THREE.Vector3 {
  const rand = () => (Math.random() - 0.5) * 2;
  if (type === 'synthesizer') return new THREE.Vector3(0, 0, 0);
  if (type === 'proposer') return new THREE.Vector3(rand() * 14, 22 + rand() * 5, rand() * 14);
  if (type === 'critic') return new THREE.Vector3(rand() * 20, rand() * 6, rand() * 20);
  if (type === 'validator') return new THREE.Vector3(rand() * 14, -22 + rand() * 5, rand() * 14);
  const r = type === 'concept' ? 42 : 56;
  const t = (idx * 1.7) + Math.random() * 2;
  const p = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
}

function settleForces(
  positions: Map<string, THREE.Vector3>,
  velocities: Map<string, THREE.Vector3>,
  edges: GraphEdge[],
  steps: number,
) {
  const ids = Array.from(positions.keys());
  const repulsion = 420;
  const springK = 0.028;
  const springLen = 19;
  const gravity = 0.012;
  const damping = 0.78;
  const dt = 0.5;

  const tmp = new THREE.Vector3();
  const forces = new Map<string, THREE.Vector3>();
  for (const id of ids) forces.set(id, new THREE.Vector3());

  for (let s = 0; s < steps; s++) {
    for (const id of ids) forces.get(id)!.set(0, 0, 0);

    for (let i = 0; i < ids.length; i++) {
      const pi = positions.get(ids[i])!;
      for (let j = i + 1; j < ids.length; j++) {
        const pj = positions.get(ids[j])!;
        tmp.subVectors(pi, pj);
        const dist = Math.max(1, tmp.length());
        const mag = repulsion / (dist * dist);
        tmp.normalize().multiplyScalar(mag);
        forces.get(ids[i])!.add(tmp);
        forces.get(ids[j])!.sub(tmp);
      }
    }

    for (const e of edges) {
      const ps = positions.get(e.source);
      const pt = positions.get(e.target);
      if (!ps || !pt) continue;
      tmp.subVectors(pt, ps);
      const dist = tmp.length();
      if (dist < 0.001) continue;
      const stretch = dist - springLen;
      tmp.normalize().multiplyScalar(stretch * springK);
      forces.get(e.source)!.add(tmp);
      forces.get(e.target)!.sub(tmp);
    }

    for (const id of ids) {
      const p = positions.get(id)!;
      tmp.copy(p).multiplyScalar(-gravity);
      forces.get(id)!.add(tmp);
    }

    const syn = positions.get('syn');
    if (syn) {
      syn.set(0, 0, 0);
      velocities.get('syn')?.set(0, 0, 0);
    }

    for (const id of ids) {
      if (id === 'syn') continue;
      const v = velocities.get(id)!;
      v.add(forces.get(id)!.multiplyScalar(dt));
      v.multiplyScalar(damping);
      positions.get(id)!.add(tmp.copy(v).multiplyScalar(dt));
    }
  }
}

interface OrbitState {
  update: () => void;
  dispose: () => void;
  setAutoRotate: (v: boolean) => void;
  movedRef: { value: number };
}

function createOrbit(camera: THREE.PerspectiveCamera, dom: HTMLElement): OrbitState {
  const target = new THREE.Vector3(0, 0, 0);
  const spherical = new THREE.Spherical();
  spherical.setFromVector3(camera.position.clone().sub(target));
  let isDragging = false;
  let px = 0, py = 0;
  let autoRotate = true;
  const movedRef = { value: 0 };

  function update() {
    if (autoRotate && !isDragging) {
      spherical.theta += 0.0012;
    }
    spherical.phi = Math.max(0.18, Math.min(Math.PI - 0.18, spherical.phi));
    const pos = new THREE.Vector3().setFromSpherical(spherical).add(target);
    camera.position.copy(pos);
    camera.lookAt(target);
  }

  function onDown(e: PointerEvent) {
    if (e.button !== 0) return;
    isDragging = true;
    px = e.clientX;
    py = e.clientY;
    movedRef.value = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onMove(e: PointerEvent) {
    if (!isDragging) return;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    movedRef.value += Math.hypot(dx, dy);
    spherical.theta -= dx * 0.005;
    spherical.phi -= dy * 0.005;
    px = e.clientX;
    py = e.clientY;
  }
  function onUp() { isDragging = false; }
  function onWheel(e: WheelEvent) {
    e.preventDefault();
    spherical.radius *= e.deltaY > 0 ? 1.08 : 0.92;
    spherical.radius = Math.max(45, Math.min(280, spherical.radius));
  }

  dom.addEventListener('pointerdown', onDown);
  dom.addEventListener('pointermove', onMove);
  dom.addEventListener('pointerup', onUp);
  dom.addEventListener('pointercancel', onUp);
  dom.addEventListener('wheel', onWheel, { passive: false });

  return {
    update,
    setAutoRotate: (v) => { autoRotate = v; },
    movedRef,
    dispose: () => {
      dom.removeEventListener('pointerdown', onDown);
      dom.removeEventListener('pointermove', onMove);
      dom.removeEventListener('pointerup', onUp);
      dom.removeEventListener('pointercancel', onUp);
      dom.removeEventListener('wheel', onWheel);
    }
  };
}

export const KnowledgeGraphView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [reshuffleSignal, setReshuffleSignal] = useState(0);

  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const setHoveredFn = useRef(setHoveredId);
  const setSelectedFn = useRef(setSelectedId);
  const orbitRef = useRef<OrbitState | null>(null);

  useEffect(() => { hoveredRef.current = hoveredId; }, [hoveredId]);
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);
  useEffect(() => { setHoveredFn.current = setHoveredId; }, [setHoveredId]);
  useEffect(() => { setSelectedFn.current = setSelectedId; }, [setSelectedId]);
  useEffect(() => { orbitRef.current?.setAutoRotate(autoRotate); }, [autoRotate]);

  const { t } = useLanguage();
  const lang = (t as any).knowledgeGraph;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.0045);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1200);
    camera.position.set(0, 38, 130);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050b14, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x405068, 0.45));
    const keyLight = new THREE.PointLight(0x60a5fa, 1.4, 400);
    keyLight.position.set(70, 90, 70);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xc084fc, 0.9, 400);
    fillLight.position.set(-80, -50, 70);
    scene.add(fillLight);
    const rim = new THREE.PointLight(0x22d3ee, 0.7, 400);
    rim.position.set(0, -80, -90);
    scene.add(rim);

    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 320 + Math.random() * 220;
      const t1 = Math.random() * Math.PI * 2;
      const t2 = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(t2) * Math.cos(t1);
      starPos[i * 3 + 1] = r * Math.sin(t2) * Math.sin(t1);
      starPos[i * 3 + 2] = r * Math.cos(t2);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x60a5fa, size: 0.8, transparent: true, opacity: 0.55, sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const boundary = new THREE.Mesh(
      new THREE.IcosahedronGeometry(88, 1),
      new THREE.MeshBasicMaterial({ color: 0x1d4ed8, wireframe: true, transparent: true, opacity: 0.08 }),
    );
    scene.add(boundary);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    const positions = new Map<string, THREE.Vector3>();
    const velocities = new Map<string, THREE.Vector3>();
    NODES.forEach((n, i) => {
      positions.set(n.id, initialPosition(n.type, i));
      velocities.set(n.id, new THREE.Vector3());
    });
    settleForces(positions, velocities, EDGES, 260);

    const radialTex = makeRadialTexture();

    const nodeMeshes = new Map<string, THREE.Mesh>();
    const nodeGroups = new Map<string, THREE.Group>();
    const nodeWires = new Map<string, THREE.Mesh>();
    const nodeSprites = new Map<string, THREE.Sprite>();
    const disposables: { dispose?: () => void }[] = [];

    for (const node of NODES) {
      const color = TYPE_COLOR[node.type];
      const size = TYPE_SIZE[node.type];
      const geo = buildGeometry(node.type, size);
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.65, metalness: 0.45, roughness: 0.28,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.id = node.id;

      const wireGeo = geo.clone();
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff, wireframe: true, transparent: true, opacity: 0.22,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.scale.setScalar(1.06);
      mesh.add(wire);

      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialTex, color, transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      sprite.scale.setScalar(size * 5);

      const grp = new THREE.Group();
      grp.add(sprite);
      grp.add(mesh);
      grp.position.copy(positions.get(node.id)!);
      grp.userData.id = node.id;
      graphGroup.add(grp);

      nodeMeshes.set(node.id, mesh);
      nodeGroups.set(node.id, grp);
      nodeWires.set(node.id, wire);
      nodeSprites.set(node.id, sprite);
      disposables.push(geo, mat, wireGeo, wireMat, sprite.material as THREE.Material);
    }

    const edgeLines: { line: THREE.Line; edge: GraphEdge; mat: THREE.LineBasicMaterial }[] = [];
    const edgePulses: { sprite: THREE.Sprite; source: string; target: string; t: number; speed: number; mat: THREE.SpriteMaterial }[] = [];

    for (const e of EDGES) {
      const ps = positions.get(e.source)!;
      const pt = positions.get(e.target)!;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([ps.clone(), pt.clone()]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.32 });
      const line = new THREE.Line(lineGeo, lineMat);
      line.userData.edge = e;
      graphGroup.add(line);
      edgeLines.push({ line, edge: e, mat: lineMat });
      disposables.push(lineGeo, lineMat);

      const pulseMat = new THREE.SpriteMaterial({
        map: radialTex, color: 0x22d3ee, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const pulse = new THREE.Sprite(pulseMat);
      pulse.scale.setScalar(2.4);
      graphGroup.add(pulse);
      edgePulses.push({
        sprite: pulse, source: e.source, target: e.target,
        t: Math.random(), speed: 0.0035 + Math.random() * 0.005, mat: pulseMat,
      });
      disposables.push(pulseMat);
    }

    const orbit = createOrbit(camera, renderer.domElement);
    orbitRef.current = orbit;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerInside = false;

    function onPointerMove(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerInside = true;
    }
    function onPointerLeave() { pointerInside = false; }
    function onClick() {
      if (orbit.movedRef.value > 6) return;
      setSelectedFn.current(hoveredRef.current);
    }
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

    const ro = new ResizeObserver(() => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    const clock = new THREE.Clock();
    let frameId = 0;

    const meshArray = Array.from(nodeMeshes.values());
    const tmpV = new THREE.Vector3();

    function animate() {
      frameId = requestAnimationFrame(animate);
      clock.getDelta();
      const elapsed = clock.elapsedTime;

      stars.rotation.y += 0.00018;
      boundary.rotation.x += 0.00045;
      boundary.rotation.y += 0.0007;

      const focusId = selectedRef.current ?? hoveredRef.current;

      for (const [id, grp] of nodeGroups) {
        const mesh = nodeMeshes.get(id)!;
        mesh.rotation.y += 0.006;
        mesh.rotation.x += 0.0035;
        const breathing = 1 + Math.sin(elapsed * 1.8 + id.charCodeAt(0)) * 0.045;
        const focused = focusId === id ? 1.32 : focusId == null ? 1 : 0.88;
        const targetScale = breathing * focused;
        grp.scale.lerp(tmpV.set(targetScale, targetScale, targetScale), 0.18);
        const spriteOpacity = focusId === id ? 0.95 : (focusId == null ? 0.7 : 0.45);
        const sprite = nodeSprites.get(id)!;
        (sprite.material as THREE.SpriteMaterial).opacity = spriteOpacity;
      }

      for (const ep of edgePulses) {
        ep.t += ep.speed;
        if (ep.t > 1) ep.t = 0;
        const ps = nodeGroups.get(ep.source)!.position;
        const pt = nodeGroups.get(ep.target)!.position;
        ep.sprite.position.lerpVectors(ps, pt, ep.t);
        const isFocused = focusId === ep.source || focusId === ep.target;
        ep.mat.opacity = isFocused ? 1 : (focusId == null ? 0.75 : 0.3);
      }

      for (const el of edgeLines) {
        const isFocused = focusId === el.edge.source || focusId === el.edge.target;
        el.mat.color.setHex(isFocused ? 0x22d3ee : 0x3b82f6);
        el.mat.opacity = isFocused ? 0.85 : (focusId == null ? 0.32 : 0.14);
      }

      if (pointerInside) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(meshArray, false);
        const newHover = hits.length > 0 ? (hits[0].object.userData.id as string) : null;
        if (newHover !== hoveredRef.current) {
          setHoveredFn.current(newHover);
          renderer.domElement.style.cursor = newHover ? 'pointer' : 'grab';
        }
      } else if (hoveredRef.current !== null) {
        setHoveredFn.current(null);
        renderer.domElement.style.cursor = 'grab';
      }

      orbit.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      orbit.dispose();
      orbitRef.current = null;
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      for (const d of disposables) d.dispose?.();
      radialTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      boundary.geometry.dispose();
      (boundary.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [reshuffleSignal]);

  const focusId = selectedId ?? hoveredId;
  const focusNode = focusId ? NODES.find((n) => n.id === focusId) ?? null : null;
  const focusConnections = focusNode
    ? EDGES.filter((e) => e.source === focusNode.id || e.target === focusNode.id).length
    : 0;

  const typeCounts: Record<NodeType, number> = {
    synthesizer: 0, proposer: 0, critic: 0, validator: 0, concept: 0, task: 0,
  };
  for (const n of NODES) typeCounts[n.type]++;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="px-8 pt-8 pb-4 border-b border-cyber-700 z-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Network className="text-cyan-400" />
          {lang.title}
        </h2>
        <p className="text-slate-400 max-w-3xl">{lang.desc}</p>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" />

        <div className="absolute top-4 left-4 glass-panel rounded-xl p-3 z-10 w-[200px]">
          <div className="text-cyan-300 text-[10px] uppercase font-mono mb-2 tracking-widest">{lang.legend}</div>
          <div className="space-y-1.5">
            {LEGEND_TYPES.map((tp) => (
              <button
                key={tp}
                onMouseEnter={() => setHoveredId(null)}
                className="w-full flex items-center justify-between text-xs hover:bg-cyber-700/40 px-1 py-0.5 rounded transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: `#${TYPE_COLOR[tp].toString(16).padStart(6, '0')}`, color: `#${TYPE_COLOR[tp].toString(16).padStart(6, '0')}` }}
                  />
                  <span className="text-slate-200">{lang.types[tp]}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{typeCounts[tp]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 glass-panel rounded-xl p-3 z-10 min-w-[180px]">
          <div className="text-cyan-300 text-[10px] uppercase font-mono mb-2 tracking-widest">{lang.stats}</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">{lang.nodes}</span><span className="font-mono text-white">{NODES.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">{lang.edges}</span><span className="font-mono text-white">{EDGES.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">{lang.dim}</span><span className="font-mono text-cyan-400">3D</span></div>
            <div className="flex justify-between"><span className="text-slate-400">{lang.layout}</span><span className="font-mono text-green-400">{lang.forceLayout}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-cyber-700/60 flex gap-2">
            <button
              onClick={() => setAutoRotate((v) => !v)}
              title={lang.autoRotate}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-mono uppercase border transition-colors ${
                autoRotate
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                  : 'bg-cyber-800 border-cyber-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              {autoRotate ? <Pause size={11} /> : <Play size={11} />}
              <RotateCw size={11} />
            </button>
            <button
              onClick={() => { setSelectedId(null); setReshuffleSignal((s) => s + 1); }}
              title={lang.reshuffle}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-mono uppercase border bg-cyber-800 border-cyber-600 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Shuffle size={11} />
            </button>
          </div>
        </div>

        {focusNode && (
          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
            <div className="glass-panel rounded-xl p-4 max-w-xl w-full pointer-events-auto">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-3.5 h-3.5 rounded-sm shadow-[0_0_12px_currentColor]"
                  style={{ backgroundColor: `#${TYPE_COLOR[focusNode.type].toString(16).padStart(6, '0')}`, color: `#${TYPE_COLOR[focusNode.type].toString(16).padStart(6, '0')}` }}
                />
                <h3 className="text-white font-bold text-sm">{lang.labels[focusNode.id]}</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyber-700/60 text-slate-300">
                  {lang.types[focusNode.type]}
                </span>
                {selectedId && (
                  <button
                    onClick={() => setSelectedId(null)}
                    className="ml-auto text-[10px] font-mono text-slate-500 hover:text-slate-200 uppercase"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{lang.descs[focusNode.id]}</p>
              <div className="mt-2 text-[10px] text-cyan-400 font-mono uppercase tracking-widest">
                {lang.connections}: {focusConnections}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-4 text-[9px] text-slate-500 font-mono uppercase tracking-widest z-10 pointer-events-none">
          {lang.hint}
        </div>
      </div>
    </div>
  );
};
