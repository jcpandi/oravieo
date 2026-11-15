/*
  Procedural porcelain molar, ported from the standalone tooth.js (written for three r128)
  to current three.js. Color management and light intensities are set so the scene keeps the
  look of the original legacy-lighting renderer.
*/
import * as THREE from "three";

export type MolarMode = "hybrid" | "wireframe" | "enamel";

export interface MolarApi {
  setMode: (mode: MolarMode) => void;
  /** Hero scroll progress, 0–1. */
  setProgress: (value: number) => void;
  reset: () => void;
  dispose: () => void;
}

interface MolarOptions {
  onReadyChange?: (ready: boolean) => void;
  onDraggingChange?: (dragging: boolean) => void;
}

/**
 * three r128's additive blending, which also scaled the alpha channel by source alpha.
 * Current AdditiveBlending adds alpha 1:1, which dims glows over the transparent canvas.
 */
const LEGACY_ADDITIVE = {
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.SrcAlphaFactor,
  blendDstAlpha: THREE.OneFactor,
} as const;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** Crown with 4 cusps, central fossa and 2 roots, as a parametric surface. */
function createMolarGeometry() {
  const uSteps = 96;
  const vSteps = 88;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iv = 0; iv <= vSteps; iv++) {
    const v = iv / vSteps; // 0 = root tip, 1 = occlusal centre
    for (let iu = 0; iu <= uSteps; iu++) {
      const u = iu / uSteps;
      const theta = u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const cos2T = Math.cos(2 * theta);
      const sin2T = Math.sin(2 * theta);
      const cos4T = Math.cos(4 * theta);
      let x: number;
      let y: number;
      let z: number;

      if (v >= 0.44) {
        // Crown and occlusal surface.
        const tv = (v - 0.44) / 0.56;
        const squarish = 1.0 + 0.085 * -cos4T + 0.04 * cos2T;
        let radialEnvelope: number;
        if (tv < 0.72) {
          radialEnvelope = 0.86 + Math.sin((tv / 0.72) * Math.PI * 0.78) * 0.46;
        } else {
          const p = (tv - 0.72) / 0.28;
          const startR = 0.86 + Math.sin(0.78 * Math.PI) * 0.46;
          radialEnvelope = startR * (1 - Math.pow(p, 1.35));
        }
        const r = radialEnvelope * squarish;
        x = r * cosT * 1.06;
        z = r * sinT * 0.94;

        let baseH: number;
        if (tv < 0.72) {
          baseH = -0.15 + Math.pow(tv / 0.72, 0.82) * 1.48;
        } else {
          const p = (tv - 0.72) / 0.28;
          const cuspWave = 0.24 * Math.pow(Math.sin(2 * theta + 0.05), 2) + 0.05 * Math.sin(theta) + 0.04 * cosT;
          const ridgeProfile = Math.sin((1 - p) * Math.PI * 0.5);
          const centralPit = -0.26 * Math.pow(p, 1.7);
          const grooveDepth =
            -0.065 * Math.exp(-Math.pow(sin2T * 3.5, 2)) * (1 - Math.pow(p, 2)) * smoothstep(0.0, 0.3, p);
          baseH = 1.33 + cuspWave * ridgeProfile + centralPit + grooveDepth;
        }

        const wallGroove =
          -0.035 * Math.exp(-Math.pow(cos2T * 2.8, 2)) * smoothstep(0.25, 0.75, tv) * (1 - smoothstep(0.75, 0.95, tv));
        x += cosT * wallGroove;
        z += sinT * wallGroove;
        y = baseH;
      } else {
        // Furcation and bifurcated roots.
        const rv = v / 0.44;
        const splitFactor = Math.pow(1 - rv, 1.25);
        const rootTaper = Math.pow(rv, 0.52);
        const neckRadius = 0.86 * (1.0 + 0.05 * cos2T);
        const pinch = 1.0 - 0.68 * smoothstep(0.85, 0.15, rv) * Math.pow(Math.sin(theta), 2);
        const rootSpreadX = Math.sign(cosT) * Math.pow(Math.abs(cosT), 0.65) * splitFactor * 0.32;
        const distalCurve = Math.pow(1 - rv, 2.2) * 0.12;
        const r = neckRadius * rootTaper;
        x = r * cosT * 1.06 + rootSpreadX + distalCurve;
        z = r * sinT * 0.84 * pinch;
        const furcationArch = 0.58 * smoothstep(0.82, 0.1, rv) * Math.exp(-Math.pow(cosT * 2.6, 2));
        y = -0.15 - (1 - rv) * 1.95 + furcationArch;
      }

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  for (let iv = 0; iv < vSteps; iv++) {
    for (let iu = 0; iu < uSteps; iu++) {
      const a = iv * (uSteps + 1) + iu;
      const b = a + uSteps + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createGridTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const cells = 36;
  const step = 1024 / cells;
  ctx.strokeStyle = "rgba(220, 244, 255, 0.55)";
  ctx.lineWidth = 1.6;
  for (let i = 0; i <= cells; i++) {
    const pos = i * step;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(1024, pos);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function createFlareTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 60);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.22, "rgba(165, 235, 255, 0.92)");
  grad.addColorStop(0.55, "rgba(70, 190, 255, 0.35)");
  grad.addColorStop(1, "rgba(0, 140, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(8, 64);
  ctx.lineTo(120, 64);
  ctx.moveTo(64, 8);
  ctx.lineTo(64, 120);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/** Mounts the molar canvas into `container`. Throws if WebGL is unavailable. */
export function createMolar(container: HTMLElement, options: MolarOptions = {}): MolarApi {
  // The original scene was tuned without colour management (three r128 defaults).
  THREE.ColorManagement.enabled = false;

  const width = container.clientWidth || 700;
  const height = container.clientHeight || 620;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
  camera.position.set(0, 0.45, 7.6);
  camera.lookAt(0, -0.1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const masterGroup = new THREE.Group();
  masterGroup.position.set(0, -0.18, 0);
  scene.add(masterGroup);

  // Porcelain enamel.
  const geometry = createMolarGeometry();
  const porcelainMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#eef6fc"),
    emissive: new THREE.Color("#1d4466"),
    emissiveIntensity: 0.18,
    roughness: 0.11,
    metalness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 1.0,
    transparent: true,
    opacity: 0.97,
  });
  const molarMesh = new THREE.Mesh(geometry, porcelainMaterial);
  molarMesh.rotation.set(0.08, -0.38, -0.03);
  masterGroup.add(molarMesh);

  // CAD grid overlay on a slightly inflated copy of the surface.
  const gridTexture = createGridTexture();
  const gridOverlayMat = new THREE.MeshBasicMaterial({
    map: gridTexture,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
    ...LEGACY_ADDITIVE,
  });
  const wireframeOverlayMesh = new THREE.Mesh(geometry.clone(), gridOverlayMat);
  wireframeOverlayMesh.scale.setScalar(1.003);
  wireframeOverlayMesh.rotation.copy(molarMesh.rotation);
  masterGroup.add(wireframeOverlayMesh);
  // Current three.js sorts transparent meshes by bounding-sphere depth, which can put the
  // slightly inflated overlay before the porcelain. Fix the draw order explicitly.
  molarMesh.renderOrder = 0;
  wireframeOverlayMesh.renderOrder = 1;

  // Holographic bounding box around the crown.
  const bboxGroup = new THREE.Group();
  bboxGroup.rotation.set(0.07, -0.58, 0);
  bboxGroup.position.set(0, 0.34, 0);
  masterGroup.add(bboxGroup);

  const bw = 1.56;
  const bh = 1.08;
  const bd = 1.48;
  const mid = -bh * 0.55;
  const low = -bh * 1.35;
  // prettier-ignore
  const lineVertices = new Float32Array([
    -bw, bh, -bd, bw, bh, -bd,   bw, bh, -bd, bw, bh, bd,   bw, bh, bd, -bw, bh, bd,   -bw, bh, bd, -bw, bh, -bd,
    -bw, mid, -bd, bw, mid, -bd, bw, mid, -bd, bw, mid, bd, bw, mid, bd, -bw, mid, bd, -bw, mid, bd, -bw, mid, -bd,
    -bw, bh, -bd, -bw, low, -bd, bw, bh, -bd, bw, low, -bd, bw, bh, bd, bw, low, bd,   -bw, bh, bd, -bw, low, bd,
  ]);
  const bboxLineGeo = new THREE.BufferGeometry();
  bboxLineGeo.setAttribute("position", new THREE.BufferAttribute(lineVertices, 3));
  bboxGroup.add(
    new THREE.LineSegments(
      bboxLineGeo,
      new THREE.LineBasicMaterial({ color: "#9be7ff", transparent: true, opacity: 0.85, ...LEGACY_ADDITIVE }),
    ),
  );
  const coreLines = new THREE.LineSegments(
    bboxLineGeo,
    new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.95, ...LEGACY_ADDITIVE }),
  );
  coreLines.scale.setScalar(1.001);
  bboxGroup.add(coreLines);

  // Star-flare nodes at the eight corners; the front-right one is larger.
  const flareTexture = createFlareTexture();
  const flareMaterial = new THREE.SpriteMaterial({
    map: flareTexture,
    color: 0xffffff,
    transparent: true,
    ...LEGACY_ADDITIVE,
    depthTest: false,
  });
  const corners: [number, number, number][] = [
    [-bw, bh, -bd], [bw, bh, -bd], [bw, bh, bd], [-bw, bh, bd],
    [-bw, mid, -bd], [bw, mid, -bd], [bw, mid, bd], [-bw, mid, bd],
  ];
  corners.forEach(([x, y, z], index) => {
    const sprite = new THREE.Sprite(flareMaterial);
    sprite.position.set(x, y, z);
    const scale = index === 6 ? 0.68 : 0.36;
    sprite.scale.set(scale, scale, 1);
    bboxGroup.add(sprite);
  });

  // Scanning laser plane inside the box.
  const scanPlaneMat = new THREE.MeshBasicMaterial({
    color: "#7ce0ff",
    transparent: true,
    opacity: 0.11,
    side: THREE.DoubleSide,
    ...LEGACY_ADDITIVE,
    depthWrite: false,
  });
  const scanPlane = new THREE.Mesh(new THREE.PlaneGeometry(bw * 2, bd * 2), scanPlaneMat);
  scanPlane.rotation.x = Math.PI / 2;
  scanPlane.position.y = mid;
  bboxGroup.add(scanPlane);

  // Studio lighting. Intensities × π (and decay 0 on point/spot lights) reproduce
  // three r128's legacy light units; the point light also keeps its old falloff.
  const PI = Math.PI;
  scene.add(new THREE.AmbientLight(0xd8ecff, 0.85 * PI));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2 * PI);
  keyLight.position.set(3.5, 6.0, 4.5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x7acaff, 1.5 * PI);
  rimLight.position.set(-5.0, 2.5, 2.5);
  scene.add(rimLight);
  const fillLight = new THREE.PointLight(0x9bdcff, 1.6 * 0.65 * PI, 12, 0);
  fillLight.position.set(0.8, -0.5, 4.2);
  scene.add(fillLight);
  const backLight = new THREE.SpotLight(0xffffff, 1.8 * PI, 0, PI / 3, 0, 0);
  backLight.position.set(0, 4, -5);
  scene.add(backLight);

  // Render loop: runs only while visible, honours reduced motion.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = { mode: "hybrid" as MolarMode, progress: 0, x: 0, y: 0, visible: true, disposed: false };
  let frame = 0;
  let elapsed = 0;
  let lastTime = performance.now();
  let drag: { id: number; x: number; y: number; rx: number; ry: number } | null = null;
  let contextLost = false;

  function render(now = performance.now()) {
    frame = 0;
    if (state.disposed || contextLost) return;
    const moving = state.visible && !document.hidden && !reducedMotion.matches;
    if (moving) elapsed += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const sp = reducedMotion.matches ? 0 : state.progress;
    const t = reducedMotion.matches ? 0 : elapsed;
    masterGroup.position.y = -0.18 + Math.sin(t * 1.35) * 0.045 + sp * 0.28;
    masterGroup.scale.setScalar(1 + sp * 0.12);
    const smoothing = reducedMotion.matches ? 1 : 0.11;
    masterGroup.rotation.y += (state.x + sp * 1.15 - masterGroup.rotation.y) * smoothing;
    masterGroup.rotation.x += (state.y - sp * 0.22 - masterGroup.rotation.x) * smoothing;
    bboxGroup.rotation.y = -0.58 + sp * 0.85;
    scanPlane.position.y = mid + ((Math.sin(t * 1.8 + sp * 5) + 1) * 0.5) * bh * 1.45;
    scanPlaneMat.opacity = 0.08 + Math.sin(t * 3.6) * 0.04;
    renderer.render(scene, camera);
    options.onReadyChange?.(true);
    if (moving) frame = requestAnimationFrame(render);
  }
  function wake() {
    if (!frame && !state.disposed && state.visible && !document.hidden) {
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    }
  }
  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function setMode(mode: MolarMode) {
    state.mode = mode;
    wireframeOverlayMesh.visible = mode !== "enamel";
    gridOverlayMat.opacity = mode === "wireframe" ? 0.98 : 0.54;
    porcelainMaterial.opacity = mode === "wireframe" ? 0.22 : 0.97;
    porcelainMaterial.roughness = mode === "enamel" ? 0.08 : 0.11;
    bboxGroup.visible = mode !== "enamel";
    wake();
  }
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 0.9 ? 8.4 : 7.6;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 640 ? 1.5 : 2));
    renderer.setSize(w, h);
    wake();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      state.visible = entries[0].isIntersecting;
      if (state.visible) wake();
      else pause();
    },
    { rootMargin: "40px" },
  );
  intersectionObserver.observe(container);

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, rx: state.x, ry: state.y };
    container.setPointerCapture(event.pointerId);
    options.onDraggingChange?.(true);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    state.x = drag.rx + (event.clientX - drag.x) * 0.009;
    state.y = clamp(drag.ry + (event.clientY - drag.y) * 0.006, -0.65, 0.65);
    wake();
  };
  const stopDrag = () => {
    drag = null;
    options.onDraggingChange?.(false);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") state.x -= 0.2;
    if (event.key === "ArrowRight") state.x += 0.2;
    if (event.key === "ArrowUp") state.y = clamp(state.y - 0.15, -0.65, 0.65);
    if (event.key === "ArrowDown") state.y = clamp(state.y + 0.15, -0.65, 0.65);
    if (event.key === "Home") {
      state.x = 0;
      state.y = 0;
    }
    wake();
  };
  const onVisibility = () => (document.hidden ? pause() : wake());
  const onMotionChange = () => {
    pause();
    wake();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    pause();
    options.onReadyChange?.(false);
  };
  const onContextRestored = () => {
    contextLost = false;
    resize();
    wake();
  };

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", stopDrag);
  container.addEventListener("pointercancel", stopDrag);
  container.addEventListener("lostpointercapture", stopDrag);
  container.addEventListener("keydown", onKeyDown);
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", onMotionChange);
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

  function dispose() {
    if (state.disposed) return;
    state.disposed = true;
    pause();
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    container.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerup", stopDrag);
    container.removeEventListener("pointercancel", stopDrag);
    container.removeEventListener("lostpointercapture", stopDrag);
    container.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("visibilitychange", onVisibility);
    reducedMotion.removeEventListener("change", onMotionChange);
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    scene.traverse((object) => {
      const item = object as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
      if (item.geometry) geometries.add(item.geometry);
      if (item.material) (Array.isArray(item.material) ? item.material : [item.material]).forEach((m) => materials.add(m));
    });
    geometries.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    gridTexture.dispose();
    flareTexture.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    options.onReadyChange?.(false);
  }

  bboxGroup.traverse((object) => {
    object.renderOrder = 2;
  });

  setMode("hybrid");
  resize();

  return {
    setMode,
    setProgress(value) {
      state.progress = value;
    },
    reset() {
      state.x = 0;
      state.y = 0;
      wake();
    },
    dispose,
  };
}
