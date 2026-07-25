import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Network, RotateCw, Pause, Play, Shuffle, Search, Flame, Zap,
  Route, CheckCircle2, XCircle, GraduationCap, X, BrainCircuit,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SemanticGraph } from '../../engine/graph';
import { SEMANTIC_FIELD } from '../../engine/dataset';
import { SemanticEngine } from '../../engine/semantics';
import { QuizBank, QuizQuestion } from '../../engine/quiz';
import { QUIZZES } from '../../engine/quizzes';
import { KnowledgeEdge, KnowledgeNode, NodeKind, Domain, RelationKind } from '../../engine/types';
import { LearnerModel, levelFromXp, levelBounds, xpForLearn, xpForReview } from '../../engine/learner';

const GRAPH = new SemanticGraph(SEMANTIC_FIELD);
const SEMANTICS = new SemanticEngine(GRAPH);
const QUIZ_BANK = new QuizBank(QUIZZES);
const CONCEPT_IDS = GRAPH.nodes.filter((n) => n.kind === 'concept').map((n) => n.id);

const TYPE_COLOR: Record<NodeKind, number> = {
  synthesizer: 0x4ade80,
  proposer: 0x60a5fa,
  critic: 0xc084fc,
  validator: 0xf472b6,
  concept: 0x22d3ee,
  task: 0xfbbf24,
};

const DOMAIN_COLOR: Record<Domain, number> = {
  foundations: 0x22d3ee,
  swarm: 0x38bdf8,
  protocol: 0xa78bfa,
  economics: 0xf59e0b,
  learning: 0x34d399,
};

const RELATION_COLOR: Record<RelationKind, number> = {
  feeds: 0x3b82f6,
  grounds: 0x22d3ee,
  requires: 0xf59e0b,
  extends: 0x4ade80,
  relates: 0x8b5cf6,
};

const RELATION_SPRING: Record<RelationKind, number> = {
  feeds: 20,
  grounds: 17,
  requires: 14,
  extends: 14,
  relates: 26,
};

const TYPE_SIZE: Record<Exclude<NodeKind, 'concept'>, number> = {
  synthesizer: 6,
  proposer: 3.6,
  critic: 3.6,
  validator: 3.0,
  task: 2.0,
};

const DOMAIN_ORDER: Domain[] = ['foundations', 'swarm', 'protocol', 'economics', 'learning'];
const LEGEND_TYPES: NodeKind[] = ['synthesizer', 'proposer', 'critic', 'validator', 'task'];
const LEGEND_RELATIONS: RelationKind[] = ['feeds', 'grounds', 'requires', 'extends', 'relates'];

const MASTERED_GOLD = 0xfacc15;

function nodeColor(node: KnowledgeNode): number {
  if (node.kind === 'concept' && node.domain) return DOMAIN_COLOR[node.domain];
  return TYPE_COLOR[node.kind];
}

function nodeSize(node: KnowledgeNode): number {
  if (node.kind === 'concept') return 1.8 + node.difficulty * 0.35;
  return TYPE_SIZE[node.kind];
}

function hex(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

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

function buildGeometry(node: KnowledgeNode): THREE.BufferGeometry {
  const size = nodeSize(node);
  switch (node.kind) {
    case 'synthesizer': return new THREE.IcosahedronGeometry(size, 1);
    case 'proposer': return new THREE.OctahedronGeometry(size);
    case 'critic': return new THREE.BoxGeometry(size * 1.25, size * 1.25, size * 1.25);
    case 'validator': return new THREE.TetrahedronGeometry(size * 1.1);
    case 'concept': return new THREE.SphereGeometry(size, 20, 16);
    case 'task': return new THREE.CylinderGeometry(size * 0.55, size * 0.55, size * 1.5, 8);
  }
}

function initialPosition(node: KnowledgeNode, idx: number): THREE.Vector3 {
  const rand = () => (Math.random() - 0.5) * 2;
  switch (node.kind) {
    case 'synthesizer': return new THREE.Vector3(0, 0, 0);
    case 'proposer': return new THREE.Vector3(rand() * 14, 22 + rand() * 5, rand() * 14);
    case 'critic': return new THREE.Vector3(rand() * 20, rand() * 6, rand() * 20);
    case 'validator': return new THREE.Vector3(rand() * 14, -22 + rand() * 5, rand() * 14);
    case 'task': {
      const t = idx * 2.1 + Math.random();
      return new THREE.Vector3(Math.cos(t) * 58, rand() * 18, Math.sin(t) * 58);
    }
    case 'concept': {
      // Concepts start inside an angular sector per domain so force settling
      // preserves visible domain clusters.
      const domainIdx = node.domain ? DOMAIN_ORDER.indexOf(node.domain) : 0;
      const base = (domainIdx / DOMAIN_ORDER.length) * Math.PI * 2;
      const theta = base + (Math.random() - 0.5) * 1.0;
      const r = 38 + node.difficulty * 4 + Math.random() * 6;
      const y = (Math.random() - 0.5) * 44;
      return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
    }
  }
}

function settleForces(
  positions: Map<string, THREE.Vector3>,
  velocities: Map<string, THREE.Vector3>,
  edges: KnowledgeEdge[],
  steps: number,
) {
  const ids = Array.from(positions.keys());
  const repulsion = 460;
  const springK = 0.028;
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
      const springLen = RELATION_SPRING[e.relation] / (0.6 + e.weight * 0.4);
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
    spherical.radius = Math.max(45, Math.min(320, spherical.radius));
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
  const [query, setQuery] = useState('');
  const [pathIds, setPathIds] = useState<string[] | null>(null);
  const [learner] = useState(() => new LearnerModel());
  const [learnerTick, setLearnerTick] = useState(0);
  const [xpToast, setXpToast] = useState<{ amount: number; ts: number } | null>(null);
  const [quiz, setQuiz] = useState<{
    node: KnowledgeNode;
    q: QuizQuestion;
    selected: number | null;
    answered: boolean;
    passed: boolean;
    awarded: number;
  } | null>(null);

  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const highlightRef = useRef<Set<string> | null>(null);
  const setHoveredFn = useRef(setHoveredId);
  const setSelectedFn = useRef(setSelectedId);
  const orbitRef = useRef<OrbitState | null>(null);
  const wireMatsRef = useRef<Map<string, THREE.MeshBasicMaterial>>(new Map());

  useEffect(() => { hoveredRef.current = hoveredId; }, [hoveredId]);
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);
  useEffect(() => { setHoveredFn.current = setHoveredId; }, [setHoveredId]);
  useEffect(() => { setSelectedFn.current = setSelectedId; }, [setSelectedId]);
  useEffect(() => { orbitRef.current?.setAutoRotate(autoRotate); }, [autoRotate]);

  const { t, language } = useLanguage();
  const lang = (t as any).knowledgeGraph;

  const mastered = useMemo(() => learner.masteredSet(), [learner, learnerTick]);
  const searchHits = useMemo(
    () => (query.trim() ? SEMANTICS.search(query, language) : []),
    [query, language],
  );
  const frontier = useMemo(() => GRAPH.frontier(mastered, 3), [mastered]);

  useEffect(() => {
    if (query.trim()) {
      highlightRef.current = new Set(searchHits.map((h) => h.node.id));
    } else if (pathIds) {
      highlightRef.current = new Set(pathIds);
    } else {
      highlightRef.current = null;
    }
  }, [query, searchHits, pathIds]);

  useEffect(() => {
    if (!xpToast) return;
    const timer = setTimeout(() => setXpToast(null), 1800);
    return () => clearTimeout(timer);
  }, [xpToast]);

  // Mastery halo: gold wireframe on mastered nodes.
  useEffect(() => {
    for (const [id, mat] of wireMatsRef.current) {
      const isMastered = mastered.has(id);
      mat.color.setHex(isMastered ? MASTERED_GOLD : 0xffffff);
      mat.opacity = isMastered ? 0.6 : 0.22;
    }
  }, [mastered, reshuffleSignal]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.0045);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1200);
    camera.position.set(0, 38, 140);

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
      const r = 340 + Math.random() * 220;
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
      new THREE.IcosahedronGeometry(96, 1),
      new THREE.MeshBasicMaterial({ color: 0x1d4ed8, wireframe: true, transparent: true, opacity: 0.08 }),
    );
    scene.add(boundary);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    const positions = new Map<string, THREE.Vector3>();
    const velocities = new Map<string, THREE.Vector3>();
    GRAPH.nodes.forEach((n, i) => {
      positions.set(n.id, initialPosition(n, i));
      velocities.set(n.id, new THREE.Vector3());
    });
    settleForces(positions, velocities, GRAPH.edges, 280);

    const radialTex = makeRadialTexture();

    const nodeMeshes = new Map<string, THREE.Mesh>();
    const nodeGroups = new Map<string, THREE.Group>();
    const nodeSprites = new Map<string, THREE.Sprite>();
    const disposables: { dispose?: () => void }[] = [];
    wireMatsRef.current = new Map();

    for (const node of GRAPH.nodes) {
      const color = nodeColor(node);
      const size = nodeSize(node);
      const geo = buildGeometry(node);
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
      wireMatsRef.current.set(node.id, wireMat);

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
      nodeSprites.set(node.id, sprite);
      disposables.push(geo, mat, wireGeo, wireMat, sprite.material as THREE.Material);
    }

    const edgeLines: { line: THREE.Line; edge: KnowledgeEdge; mat: THREE.LineBasicMaterial }[] = [];
    const edgePulses: { sprite: THREE.Sprite; source: string; target: string; t: number; speed: number; mat: THREE.SpriteMaterial }[] = [];

    for (const e of GRAPH.edges) {
      const ps = positions.get(e.source)!;
      const pt = positions.get(e.target)!;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([ps.clone(), pt.clone()]);
      const lineMat = new THREE.LineBasicMaterial({
        color: RELATION_COLOR[e.relation], transparent: true, opacity: 0.3,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.userData.edge = e;
      graphGroup.add(line);
      edgeLines.push({ line, edge: e, mat: lineMat });
      disposables.push(lineGeo, lineMat);

      // Animated pulses only along the live inference pipeline.
      if (e.relation === 'feeds') {
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
      const highlight = highlightRef.current;

      for (const [id, grp] of nodeGroups) {
        const mesh = nodeMeshes.get(id)!;
        mesh.rotation.y += 0.006;
        mesh.rotation.x += 0.0035;
        const breathing = 1 + Math.sin(elapsed * 1.8 + id.charCodeAt(0)) * 0.045;

        const inHighlight = highlight ? highlight.has(id) : true;
        let emphasis: number;
        if (focusId === id) emphasis = 1.32;
        else if (!inHighlight) emphasis = 0.55;
        else if (focusId != null) emphasis = 0.88;
        else emphasis = 1;

        const targetScale = breathing * emphasis;
        grp.scale.lerp(tmpV.set(targetScale, targetScale, targetScale), 0.18);

        const sprite = nodeSprites.get(id)!;
        let spriteOpacity: number;
        if (focusId === id) spriteOpacity = 0.95;
        else if (!inHighlight) spriteOpacity = 0.12;
        else if (focusId != null) spriteOpacity = 0.45;
        else spriteOpacity = 0.7;
        (sprite.material as THREE.SpriteMaterial).opacity = spriteOpacity;
      }

      for (const ep of edgePulses) {
        ep.t += ep.speed;
        if (ep.t > 1) ep.t = 0;
        const ps = nodeGroups.get(ep.source)!.position;
        const pt = nodeGroups.get(ep.target)!.position;
        ep.sprite.position.lerpVectors(ps, pt, ep.t);
        const isFocused = focusId === ep.source || focusId === ep.target;
        const inHighlight = highlight
          ? highlight.has(ep.source) && highlight.has(ep.target)
          : true;
        ep.mat.opacity = isFocused ? 1 : !inHighlight ? 0.08 : focusId == null ? 0.75 : 0.3;
      }

      for (const el of edgeLines) {
        const isFocused = focusId === el.edge.source || focusId === el.edge.target;
        const inHighlight = highlight
          ? highlight.has(el.edge.source) && highlight.has(el.edge.target)
          : true;
        el.mat.opacity = isFocused ? 0.9 : !inHighlight ? 0.05 : focusId == null ? 0.3 : 0.12;
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
      wireMatsRef.current = new Map();
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
  const focusNode = focusId ? GRAPH.node(focusId) ?? null : null;

  const now = Date.now();
  const focusProgress = focusNode ? learner.state.progress[focusNode.id] : undefined;
  const focusDue = focusProgress ? focusProgress.dueAt <= now : false;
  const relatedNodes = focusNode ? SEMANTICS.related(focusNode.id, 4) : [];
  const prereqNodes = focusNode ? GRAPH.prerequisites(focusNode.id) : [];

  const xp = learner.state.xp;
  const level = levelFromXp(xp);
  const bounds = levelBounds(xp);
  const levelPct = Math.min(100, Math.round(((xp - bounds.current) / Math.max(1, bounds.next - bounds.current)) * 100));
  const masteryPct = Math.round(learner.masteryRatio(CONCEPT_IDS) * 100);
  const dueCount = learner.dueIds(now).length;
  const accuracy = learner.accuracy();

  const handleStudy = (node: KnowledgeNode) => {
    const q = QUIZ_BANK.pick(node.id, learner.attemptCount(node.id));
    if (!q) {
      // No quiz card authored for this concept — legacy one-click study.
      const gained = learner.study(node, Date.now());
      if (gained > 0) setXpToast({ amount: gained, ts: Date.now() });
      setLearnerTick((v) => v + 1);
      return;
    }
    setQuiz({ node, q, selected: null, answered: false, passed: false, awarded: 0 });
  };

  const handleQuizSubmit = () => {
    if (!quiz || quiz.selected === null || quiz.answered) return;
    const passed = quiz.selected === quiz.q.correct;
    const awarded = learner.study(quiz.node, Date.now(), passed);
    if (awarded > 0) setXpToast({ amount: awarded, ts: Date.now() });
    setQuiz({ ...quiz, answered: true, passed, awarded });
    setLearnerTick((v) => v + 1);
  };

  const handleBuildPath = (id: string) => {
    setQuery('');
    setPathIds(GRAPH.learningPath(id).map((n) => n.id));
  };

  const labelOf = (n: KnowledgeNode) => n.label[language];

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

        {/* Semantic search */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[340px]">
          <div className="glass-panel rounded-xl flex items-center gap-2 px-3 py-2">
            <Search size={14} className="text-cyan-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang.searchPlaceholder}
              className="bg-transparent outline-none text-xs text-slate-200 placeholder-slate-500 w-full font-mono"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-200">
                <X size={12} />
              </button>
            )}
          </div>
          {query.trim() && (
            <div className="glass-panel rounded-xl mt-1 py-1 max-h-[240px] overflow-y-auto">
              {searchHits.map((h) => (
                <button
                  key={h.node.id}
                  onClick={() => setSelectedId(h.node.id)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-cyber-700/50 flex items-center gap-2"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: hex(nodeColor(h.node)) }}
                  />
                  <span className="text-slate-200 truncate">{labelOf(h.node)}</span>
                  <span className="ml-auto text-[9px] font-mono text-slate-500 uppercase shrink-0">
                    {h.node.domain ? lang.domains[h.node.domain] : lang.types[h.node.kind]}
                  </span>
                </button>
              ))}
              {searchHits.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500 font-mono">∅</div>
              )}
            </div>
          )}
        </div>

        {/* Legend: agents, domains, relations */}
        <div className="absolute top-4 left-4 glass-panel rounded-xl p-3 z-10 w-[210px]">
          <div className="text-cyan-300 text-[10px] uppercase font-mono mb-2 tracking-widest">{lang.legend}</div>
          <div className="space-y-1">
            {LEGEND_TYPES.map((tp) => (
              <div key={tp} className="flex items-center gap-2 text-[11px]">
                <span
                  className="w-2.5 h-2.5 rounded-sm shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: hex(TYPE_COLOR[tp]), color: hex(TYPE_COLOR[tp]) }}
                />
                <span className="text-slate-300">{lang.types[tp]}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-cyber-700/60 space-y-1">
            {DOMAIN_ORDER.map((d) => (
              <div key={d} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: hex(DOMAIN_COLOR[d]), color: hex(DOMAIN_COLOR[d]) }}
                  />
                  <span className="text-slate-300">{lang.domains[d]}</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {GRAPH.nodes.filter((n) => n.domain === d).length}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-cyber-700/60">
            <div className="text-cyan-300 text-[9px] uppercase font-mono mb-1.5 tracking-widest">{lang.relations}</div>
            <div className="space-y-1">
              {LEGEND_RELATIONS.map((r) => (
                <div key={r} className="flex items-center gap-2 text-[10px]">
                  <span className="w-4 h-[2px]" style={{ backgroundColor: hex(RELATION_COLOR[r]) }} />
                  <span className="text-slate-400 font-mono">{lang.relationNames[r]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learner HUD + metrics */}
        <div className="absolute top-4 right-4 glass-panel rounded-xl p-3 z-10 w-[210px]">
          <div className="text-cyan-300 text-[10px] uppercase font-mono mb-2 tracking-widest flex items-center gap-1.5">
            <GraduationCap size={11} />
            {lang.progress}
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-400">{lang.level} <span className="text-white text-sm font-bold">{level}</span></span>
            <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1"><Zap size={10} />{xp} {lang.xp}</span>
          </div>
          <div className="h-1.5 rounded-full bg-cyber-800 overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500" style={{ width: `${levelPct}%` }} />
          </div>
          <div className="grid grid-cols-4 gap-1 text-center mb-2">
            <div>
              <div className="text-white font-mono text-sm font-bold flex items-center justify-center gap-0.5">
                <Flame size={11} className="text-orange-400" />{learner.state.streakDays}
              </div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">{lang.streak}</div>
            </div>
            <div>
              <div className="text-white font-mono text-sm font-bold">{masteryPct}%</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">{lang.mastery}</div>
            </div>
            <div>
              <div className="text-white font-mono text-sm font-bold">{accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`}</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">{lang.accuracy}</div>
            </div>
            <div>
              <div className={`font-mono text-sm font-bold ${dueCount > 0 ? 'text-amber-300' : 'text-white'}`}>{dueCount}</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">{lang.due}</div>
            </div>
          </div>
          {frontier.length > 0 && (
            <div className="pt-2 border-t border-cyber-700/60">
              <div className="text-cyan-300 text-[9px] uppercase font-mono mb-1.5 tracking-widest">{lang.nextUp}</div>
              <div className="space-y-1">
                {frontier.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedId(n.id)}
                    className="w-full text-left text-[11px] text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex(nodeColor(n)) }} />
                    <span className="truncate">{labelOf(n)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-cyber-700/60 flex gap-2">
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

        {/* Learning path */}
        {pathIds && !query.trim() && (
          <div className="absolute left-4 bottom-4 z-10 glass-panel rounded-xl p-3 w-[230px] max-h-[45%] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-cyan-300 text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5">
                <Route size={11} />
                {lang.pathTitle}
              </div>
              <button
                onClick={() => setPathIds(null)}
                className="text-[9px] font-mono text-slate-500 hover:text-slate-200 uppercase"
              >
                {lang.clearPath}
              </button>
            </div>
            <div className="space-y-1">
              {pathIds.map((id, i) => {
                const n = GRAPH.node(id);
                if (!n) return null;
                const done = mastered.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className="w-full flex items-center gap-2 text-left text-[11px] px-1 py-1 rounded hover:bg-cyber-700/40 transition-colors"
                  >
                    <span className={`font-mono text-[9px] w-4 shrink-0 ${done ? 'text-amber-300' : 'text-slate-500'}`}>
                      {i + 1}
                    </span>
                    {done
                      ? <CheckCircle2 size={12} className="text-amber-300 shrink-0" />
                      : <span className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />}
                    <span className={done ? 'text-slate-500 line-through' : 'text-slate-200'}>{labelOf(n)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* XP toast */}
        {xpToast && (
          <div key={xpToast.ts} className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="text-amber-300 font-mono font-bold text-lg animate-bounce flex items-center gap-1 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
              <Zap size={16} />+{xpToast.amount} {lang.xp}
            </div>
          </div>
        )}

        {/* Knowledge check (quiz) */}
        {quiz && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="glass-panel rounded-xl p-5 w-full max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit size={14} className="text-cyan-400" />
                <span className="text-cyan-300 text-[10px] uppercase font-mono tracking-widest">{lang.quizTitle}</span>
                <span className="text-slate-400 text-[10px] font-mono truncate">· {labelOf(quiz.node)}</span>
                <button
                  onClick={() => setQuiz(null)}
                  className="ml-auto text-slate-500 hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">{quiz.q.prompt[language]}</p>

              <div className="space-y-2 mb-4">
                {quiz.q.options.map((opt, i) => {
                  let cls = 'border-cyber-600 text-slate-300 hover:border-cyan-500/50';
                  if (!quiz.answered && quiz.selected === i) {
                    cls = 'border-cyan-400 text-cyan-200 bg-cyan-500/10';
                  } else if (quiz.answered && i === quiz.q.correct) {
                    cls = 'border-green-400/70 text-green-300 bg-green-500/10';
                  } else if (quiz.answered && quiz.selected === i) {
                    cls = 'border-red-400/70 text-red-300 bg-red-500/10';
                  } else if (quiz.answered) {
                    cls = 'border-cyber-700 text-slate-500';
                  }
                  return (
                    <button
                      key={i}
                      disabled={quiz.answered}
                      onClick={() => setQuiz({ ...quiz, selected: i })}
                      className={`w-full text-left text-xs px-3 py-2 rounded border transition-colors ${cls}`}
                    >
                      <span className="font-mono text-[10px] mr-2 opacity-60">{String.fromCharCode(65 + i)}</span>
                      {opt[language]}
                    </button>
                  );
                })}
              </div>

              {quiz.answered && (
                <div className={`mb-4 rounded-lg border p-3 ${quiz.passed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div className={`flex items-center gap-1.5 text-xs font-bold mb-1 ${quiz.passed ? 'text-green-300' : 'text-red-300'}`}>
                    {quiz.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {quiz.passed ? lang.quizCorrect : lang.quizWrong}
                    {quiz.awarded > 0 && (
                      <span className="ml-auto text-amber-300 font-mono flex items-center gap-0.5">
                        <Zap size={11} />+{quiz.awarded} {lang.xp}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{quiz.q.explanation[language]}</p>
                </div>
              )}

              <div className="flex justify-end">
                {!quiz.answered ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={quiz.selected === null}
                    className="px-4 py-1.5 rounded text-[10px] font-mono uppercase border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {lang.quizSubmit}
                  </button>
                ) : (
                  <button
                    onClick={() => setQuiz(null)}
                    className="px-4 py-1.5 rounded text-[10px] font-mono uppercase border border-cyber-600 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    {lang.quizContinue}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inspector */}
        {focusNode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4 pointer-events-none">
            <div className="glass-panel rounded-xl p-4 pointer-events-auto">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span
                  className="w-3.5 h-3.5 rounded-sm shadow-[0_0_12px_currentColor]"
                  style={{ backgroundColor: hex(nodeColor(focusNode)), color: hex(nodeColor(focusNode)) }}
                />
                <h3 className="text-white font-bold text-sm">{labelOf(focusNode)}</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyber-700/60 text-slate-300">
                  {lang.types[focusNode.kind]}
                </span>
                {focusNode.domain && (
                  <span
                    className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border"
                    style={{ color: hex(DOMAIN_COLOR[focusNode.domain]), borderColor: `${hex(DOMAIN_COLOR[focusNode.domain])}66` }}
                  >
                    {lang.domains[focusNode.domain]}
                  </span>
                )}
                <span className="flex items-center gap-0.5" title={lang.difficulty}>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <span
                      key={d}
                      className={`w-1.5 h-1.5 rounded-full ${d <= focusNode.difficulty ? 'bg-cyan-400' : 'bg-cyber-700'}`}
                    />
                  ))}
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

              <p className="text-xs text-slate-400 leading-relaxed mb-2">{focusNode.desc[language]}</p>

              {prereqNodes.length > 0 && (
                <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-mono text-amber-400/80 uppercase tracking-widest">{lang.prereqs}:</span>
                  {prereqNodes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                        mastered.has(p.id)
                          ? 'border-amber-400/40 text-amber-300'
                          : 'border-cyber-600 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mastered.has(p.id) ? '✓ ' : ''}{labelOf(p)}
                    </button>
                  ))}
                </div>
              )}

              {relatedNodes.length > 0 && (
                <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest">{lang.related}:</span>
                  {relatedNodes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyber-600 text-slate-400 hover:text-cyan-300 transition-colors"
                    >
                      {labelOf(r)}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                {focusNode.kind === 'concept' && (
                  <>
                    {!learner.isLearned(focusNode.id) ? (
                      <button
                        onClick={() => handleStudy(focusNode)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono uppercase border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      >
                        <GraduationCap size={12} />
                        {lang.learnBtn} +{xpForLearn(focusNode)} {lang.xp}
                      </button>
                    ) : focusDue ? (
                      <button
                        onClick={() => handleStudy(focusNode)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono uppercase border border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
                      >
                        <RotateCw size={12} />
                        {lang.reviewBtn} +{xpForReview(focusNode)} {lang.xp}
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono uppercase border border-amber-400/30 text-amber-300/90">
                        <CheckCircle2 size={12} />
                        {lang.learnedBadge}
                      </span>
                    )}
                    <button
                      onClick={() => handleBuildPath(focusNode.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono uppercase border border-cyber-600 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                    >
                      <Route size={12} />
                      {lang.buildPath}
                    </button>
                  </>
                )}
                <span className="ml-auto text-[10px] text-cyan-400 font-mono uppercase tracking-widest">
                  {lang.connections}: {GRAPH.degree(focusNode.id)}
                </span>
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
