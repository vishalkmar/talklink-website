// One 3D phone for the whole page. Every section has an empty "anchor" box ([data-phone]) beside its
// text; while you scroll, the phone flies from anchor to anchor (position, size, angle), shows that
// chapter's TalkLink screen and brings that chapter's 3D object. The canvas sits fixed behind the text.
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SCREEN_W, SCREEN_H, drawScreenMode } from './screens';

const PHONE_W = 2.3;
const SCREEN_H3 = PHONE_W * (SCREEN_H / SCREEN_W);
const PHONE_H = SCREEN_H3 + 0.32;
const CAM_Z = 12;
const FOV = 35;
const DEG = Math.PI / 180;

const TEAL = '#22878F';
const TEAL_L = '#5FC0C7';
const GOLD = '#E8A23A';
const FLAME = '#F4732A';

const smooth = (x) => x * x * x * (x * (x * 6 - 15) + 10); // smootherstep
const lerp = (a, b, t) => a + (b - a) * t;
const w0 = (w) => Math.max(0.0001, w);

// ---------- anchors (list re-read twice a second, positions every frame) ----------
let anchorCache = [];
let anchorAt = 0;
const anchors = () => {
  const now = performance.now();
  if (now - anchorAt > 500 || !anchorCache.length) {
    anchorAt = now;
    anchorCache = [...document.querySelectorAll('[data-phone]')].map((el) => ({
      el,
      screen: el.dataset.screen || 'home',
      prop: el.dataset.prop || '',
      rot: (el.dataset.rot || '0,0,0').split(',').map((n) => Number(n) * DEG),
    }));
  }
  return anchorCache;
};

/** Where the phone should be now: a blend of the two anchors around the scroll position. */
const target = (vh) => {
  const list = anchors();
  if (!list.length) return null;
  const y = window.scrollY;
  const pts = list.map((a, i) => {
    const r = a.el.getBoundingClientRect();
    const cy = r.top + r.height / 2;
    const active = i === 0 ? Math.min(0, y + cy - vh / 2) : y + cy - vh / 2;
    return { ...a, cx: r.left + r.width / 2, cy, h: r.height, w: r.width, active };
  });
  let i = 0;
  while (i < pts.length - 1 && y >= pts[i + 1].active) i += 1;
  const a = pts[i];
  const b = pts[Math.min(i + 1, pts.length - 1)];
  const raw = a === b ? 0 : Math.min(1, Math.max(0, (y - a.active) / (b.active - a.active)));
  const t = smooth(raw);
  return {
    t,
    a,
    b,
    x: lerp(a.cx, b.cx, t),
    y: lerp(a.cy, b.cy, t),
    hPx: lerp(Math.min(a.h * 0.9, a.w * 1.9), Math.min(b.h * 0.9, b.w * 1.9), t),
    rot: a.rot.map((r, k) => lerp(r, b.rot[k], t)),
    screen: t < 0.5 ? a.screen : b.screen,
  };
};

// ---------- shapes ----------
const roundedRect = (w, h, r) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

// the TalkLink chat bubble (same outline as the app logo), about 2 units wide
const bubbleShape = () => {
  const s = new THREE.Shape();
  const P = (x, y) => [(x - 128) / 100, -(y - 131) / 100];
  s.moveTo(...P(76, 36));
  s.lineTo(...P(180, 36));
  s.quadraticCurveTo(...P(228, 36), ...P(228, 84));
  s.lineTo(...P(228, 138));
  s.quadraticCurveTo(...P(228, 186), ...P(180, 186));
  s.lineTo(...P(122, 186));
  s.lineTo(...P(62, 226));
  s.lineTo(...P(78, 186));
  s.lineTo(...P(76, 186));
  s.quadraticCurveTo(...P(28, 186), ...P(28, 138));
  s.lineTo(...P(28, 84));
  s.quadraticCurveTo(...P(28, 36), ...P(76, 36));
  return s;
};

const shieldShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 1);
  s.bezierCurveTo(0.45, 0.85, 0.75, 0.8, 0.85, 0.75);
  s.bezierCurveTo(0.85, 0.1, 0.6, -0.55, 0, -1);
  s.bezierCurveTo(-0.6, -0.55, -0.85, 0.1, -0.85, 0.75);
  s.bezierCurveTo(-0.75, 0.8, -0.45, 0.85, 0, 1);
  return s;
};

const useBubbleGeo = () =>
  useMemo(() => {
    const g = new THREE.ExtrudeGeometry(bubbleShape(), {
      depth: 0.3,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 5,
      curveSegments: 18,
    });
    g.center();
    return g;
  }, []);

// ---------- 3D props (one per chapter, faded in by weight) ----------

/** hero: logo bubbles drifting around the phone */
const Sparks = ({ weight }) => {
  const ref = useRef();
  const geo = useBubbleGeo();
  const items = useMemo(
    () => [
      { p: [-2.4, 1.6, 0.4], s: 0.55, c: TEAL },
      { p: [2.3, 0.9, -0.2], s: 0.42, c: '#ffffff' },
      { p: [-2.1, -1.8, 0.2], s: 0.36, c: GOLD },
      { p: [2.2, -1.9, 0.5], s: 0.5, c: TEAL_L },
    ],
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current?.children.forEach((m, i) => {
      const it = items[i];
      m.position.set(it.p[0] + Math.sin(t * 0.6 + i) * 0.15, it.p[1] + Math.sin(t * 1.1 + i * 2) * 0.22, it.p[2]);
      m.rotation.y = Math.sin(t * 0.7 + i) * 0.6;
      m.rotation.z = Math.sin(t * 0.5 + i) * 0.15;
      m.scale.setScalar(w0(weight.current) * it.s);
    });
  });
  return (
    <group ref={ref}>
      {items.map((it, i) => (
        <mesh key={i} geometry={geo}>
          <meshPhysicalMaterial color={it.c} metalness={0.15} roughness={0.25} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
};

/** random talk: sound rings pulsing out from the phone + dancing voice bars */
const Waves = ({ weight }) => {
  const rings = useRef();
  const bars = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const w = weight.current;
    rings.current?.children.forEach((m, i) => {
      const p = (t * 0.45 + i / 3) % 1;
      m.scale.setScalar(0.6 + p * 1.6);
      m.material.opacity = (1 - p) * 0.6 * w;
    });
    bars.current?.children.forEach((m, i) => {
      m.scale.set(1, 0.4 + Math.abs(Math.sin(t * 4 + i * 0.9)) * 1.2, 1);
    });
    if (bars.current) bars.current.scale.setScalar(w0(w));
  });
  return (
    <group>
      <group ref={rings} position={[0, 0, -0.4]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <torusGeometry args={[2.2, 0.03, 12, 120]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <group ref={bars} position={[2.35, 1.3, 0.5]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[(i - 2) * 0.22, 0, 0]}>
            <capsuleGeometry args={[0.07, 0.5, 6, 12]} />
            <meshStandardMaterial color={i % 2 ? TEAL_L : TEAL} metalness={0.3} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/** calls: little avatars orbiting the phone on a tilted ring */
const ORBIT_COLORS = ['#8E44C9', GOLD, '#2E9E5B', '#2E7CC4', FLAME];
const Orbit = ({ weight }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (!g) return;
    g.scale.setScalar(w0(weight.current));
    g.children.forEach((m, i) => {
      if (i === 0) return; // the ring itself
      const a = t * 0.45 + ((i - 1) / ORBIT_COLORS.length) * Math.PI * 2;
      m.position.set(Math.cos(a) * 2.6, Math.sin(a) * 0.9, Math.sin(a) * 1.2);
    });
  });
  return (
    <group ref={ref} rotation={[0.25, 0, -0.2]}>
      <mesh rotation={[Math.PI / 2 - 0.35, 0, 0]}>
        <torusGeometry args={[2.6, 0.02, 8, 140]} />
        <meshBasicMaterial color={TEAL_L} transparent opacity={0.6} />
      </mesh>
      {ORBIT_COLORS.map((c) => (
        <mesh key={c}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshPhysicalMaterial color={c} roughness={0.25} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
};

/** chat: 3D chat bubbles rising beside the phone */
const Bubbles = ({ weight }) => {
  const ref = useRef();
  const geo = useBubbleGeo();
  const items = useMemo(
    () => [
      { x: -2.3, s: 0.55, c: '#ffffff', off: 0 },
      { x: 2.3, s: 0.45, c: TEAL, off: 0.33 },
      { x: -2.0, s: 0.38, c: TEAL_L, off: 0.66 },
      { x: 2.5, s: 0.35, c: '#ffffff', off: 0.5 },
    ],
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current?.children.forEach((m, i) => {
      const it = items[i];
      const p = (t * 0.12 + it.off) % 1;
      m.position.set(it.x + Math.sin(t + i) * 0.15, -2.6 + p * 5.2, 0.3);
      m.rotation.y = (it.x < 0 ? 0.5 : -0.5) + Math.sin(t * 0.8 + i) * 0.2;
      const s = w0(weight.current * Math.sin(p * Math.PI)) * it.s;
      m.scale.set(it.x < 0 ? s : -s, s, s);
    });
  });
  return (
    <group ref={ref}>
      {items.map((it, i) => (
        <mesh key={i} geometry={geo}>
          <meshPhysicalMaterial color={it.c} roughness={0.25} clearcoat={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

/** status: the story ring arcs spinning behind the phone */
const RING_COLORS = [FLAME, GOLD, '#D63384'];
const Rings = ({ weight }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (!g) return;
    g.scale.setScalar(w0(weight.current));
    g.children.forEach((m, i) => {
      m.rotation.z = t * (0.3 + i * 0.15) * (i % 2 ? -1 : 1);
      m.rotation.x = Math.sin(t * 0.5 + i) * 0.25;
    });
  });
  return (
    <group ref={ref} position={[0, 0, -0.6]}>
      {RING_COLORS.map((c, i) => (
        <mesh key={c}>
          <torusGeometry args={[2.1 + i * 0.35, 0.07, 12, 100, Math.PI * (1.2 - i * 0.2)]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} metalness={0.3} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

/** rewards: gold coins orbiting */
const Coins = ({ weight }) => {
  const ref = useRef();
  const coins = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2,
        radius: 2.5 + (i % 3) * 0.4,
        y: -2.2 + ((i * 0.55) % 4.4),
        speed: 0.25 + (i % 4) * 0.05,
        size: 0.22 + (i % 3) * 0.06,
      })),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const w = weight.current;
    ref.current?.children.forEach((m, i) => {
      const c = coins[i];
      const a = c.angle + t * c.speed;
      m.position.set(Math.cos(a) * c.radius, c.y + Math.sin(t + i) * 0.2, Math.sin(a) * c.radius * 0.6 - 0.3);
      m.rotation.x = Math.PI / 2 + Math.sin(t * 1.5 + i) * 0.5;
      m.rotation.z = t * 1.6 + i;
      m.scale.setScalar(w0(w));
    });
  });
  return (
    <group ref={ref}>
      {coins.map((c, i) => (
        <mesh key={i}>
          <cylinderGeometry args={[c.size, c.size, 0.07, 36]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? FLAME : GOLD}
            metalness={0.7}
            roughness={0.2}
            emissive={i % 3 === 0 ? '#5a2006' : '#4a3006'}
          />
        </mesh>
      ))}
    </group>
  );
};

const Shield = ({ weight }) => {
  const ref = useRef();
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shieldShape(), {
      depth: 0.25,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 4,
    });
    g.center();
    return g;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (g) {
      g.rotation.y = 0.5 + Math.sin(t * 0.8) * 0.5;
      g.position.y = -1.4 + Math.sin(t * 1.2) * 0.18;
      g.scale.setScalar(w0(weight.current) * 0.85);
    }
  });
  return (
    <group ref={ref} position={[-2.3, -1.4, 0.5]}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={TEAL} metalness={0.3} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0.06, 0.02, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.75, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.16, -0.12, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.38, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const DownloadArrow = ({ weight }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const g = ref.current;
    if (g) {
      g.position.y = 1.5 - Math.abs(Math.sin(t * 2)) * 0.35;
      g.rotation.y = t * 0.9;
      g.scale.setScalar(w0(weight.current));
    }
  });
  return (
    <group ref={ref} position={[2.2, 1.5, 0.4]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.8, 24]} />
        <meshStandardMaterial color={TEAL} metalness={0.4} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.42, 0.55, 32]} />
        <meshStandardMaterial color="#1B6E75" metalness={0.4} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.06, 12, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
};

const PROPS = {
  sparks: Sparks,
  waves: Waves,
  orbit: Orbit,
  bubbles: Bubbles,
  rings: Rings,
  coins: Coins,
  shield: Shield,
  download: DownloadArrow,
};

// ---------- the phone ----------
const Rig = () => {
  const rig = useRef();
  const phone = useRef();
  const { size, camera } = useThree();
  const weights = useRef(Object.fromEntries(Object.keys(PROPS).map((k) => [k, { current: 0 }]))).current;
  const pointer = useRef({ x: 0, y: 0 });
  const current = useRef(null);
  const lastKey = useRef('');
  const lastScreen = useRef('home');

  const { ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SCREEN_W;
    c.height = SCREEN_H;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { ctx: c.getContext('2d'), texture: tex };
  }, []);

  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(PHONE_W + 0.16, PHONE_H, 0.42), {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 6,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);
  const screen = useMemo(() => {
    const g = new THREE.ShapeGeometry(roundedRect(PHONE_W, SCREEN_H3, 0.32), 24);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i += 1) {
      uv.setXY(i, pos.getX(i) / PHONE_W + 0.5, pos.getY(i) / SCREEN_H3 + 0.5);
    }
    return g;
  }, []);

  useEffect(() => {
    const on = (e) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => {
      window.removeEventListener('pointermove', on);
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const vw = size.width;
    const vh = size.height;
    const tg = target(vh);
    if (!tg || !rig.current) return;
    const visH = 2 * CAM_Z * Math.tan((FOV * DEG) / 2);
    const visW = visH * (vw / vh);
    const mobile = vw < 900;
    // on phones the text spans the width: the phone shrinks while it travels between chapters
    const travel = mobile ? 1 - 0.85 * Math.sin(Math.PI * tg.t) : 1;
    const goal = {
      x: (tg.x / vw - 0.5) * visW,
      y: -(tg.y / vh - 0.5) * visH,
      s: ((tg.hPx / vh) * visH * travel) / PHONE_H,
    };
    const c = current.current || (current.current = { ...goal });
    const k = 0.14;
    c.x = lerp(c.x, goal.x, k);
    c.y = lerp(c.y, goal.y, k);
    c.s = lerp(c.s, goal.s, k);
    rig.current.position.set(c.x, c.y, 0);
    rig.current.scale.setScalar(w0(c.s));

    const p = pointer.current;
    const ph = phone.current;
    // a quarter twist while travelling, so the next screen "opens up" as it lands
    const spin = Math.sin(Math.PI * tg.t) * 0.4;
    ph.rotation.x = lerp(ph.rotation.x, tg.rot[0] - p.y * 0.12 + Math.sin(time * 0.7) * 0.04, 0.08);
    ph.rotation.y = lerp(ph.rotation.y, tg.rot[1] + p.x * 0.22 + Math.sin(time * 0.5) * 0.06 + spin, 0.08);
    ph.rotation.z = lerp(ph.rotation.z, tg.rot[2], 0.08);
    ph.position.y = Math.sin(time * 1.1) * 0.1;

    Object.keys(weights).forEach((name) => {
      const want = (tg.a.prop === name ? 1 - tg.t : 0) + (tg.b.prop === name ? tg.t : 0);
      weights[name].current = lerp(weights[name].current, Math.min(1, want), 0.1);
    });

    if (tg.screen !== lastScreen.current) {
      lastScreen.current = tg.screen;
      lastKey.current = '';
    }
    const key = drawScreenMode(ctx, tg.screen, time);
    if (key !== lastKey.current) {
      lastKey.current = key;
      texture.needsUpdate = true;
    }
    if (camera.position.z !== CAM_Z) camera.position.z = CAM_Z;
  });

  return (
    <group ref={rig}>
      {Object.entries(PROPS).map(([name, Prop]) => (
        <Prop key={name} weight={weights[name]} />
      ))}
      <group ref={phone}>
        <mesh geometry={body}>
          <meshPhysicalMaterial color="#14262A" metalness={0.6} roughness={0.3} clearcoat={1} clearcoatRoughness={0.2} />
        </mesh>
        <mesh geometry={screen} position={[0, 0, 0.196]}>
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, PHONE_H / 2 - 0.27, 0.2]}>
          <circleGeometry args={[0.055, 24]} />
          <meshBasicMaterial color="#05090a" />
        </mesh>
        <mesh position={[PHONE_W / 2 + 0.16, 0.9, 0]}>
          <boxGeometry args={[0.05, 0.6, 0.12]} />
          <meshStandardMaterial color="#25393E" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const StoryScene = ({ onReady }) => (
  <div className="scene" aria-hidden="true">
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 6]} intensity={1.7} />
      <pointLight position={[-6, -2, 5]} intensity={40} color={TEAL_L} />
      <pointLight position={[6, 3, -2]} intensity={26} color="#FFD08A" />
      <Rig />
    </Canvas>
  </div>
);

export default StoryScene;
