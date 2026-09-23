import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Group,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

/**
 * Hero particle field, rendered with plain three.js.
 *
 * It reproduces the previous @react-three/fiber + drei setup 1:1 (same camera,
 * renderer defaults, round-point shader, colour, size and rotation speed) but
 * without the fiber reconciler and drei, which were ~300 KB of extra JS.
 *
 * Performance notes:
 * - Geometry is uploaded once (drei re-uploaded every position every frame).
 * - The loop pauses while the hero is off-screen or the tab is hidden.
 * - Fewer particles and a lower pixel-ratio cap on small screens.
 * - prefers-reduced-motion renders a single static frame.
 * - Everything is disposed on unmount.
 */

const DESKTOP_PARTICLES = 2000;
const MOBILE_PARTICLES = 1200;
const SPREAD = 10;

// Same fragment patch as drei's <PointMaterial>: soft round points.
const roundPoints = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <opaque_fragment>",
    `#include <opaque_fragment>
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      float r = dot(cxy, cxy);
      float delta = fwidth(r);
      float mask = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
      gl_FragColor = vec4(gl_FragColor.rgb, mask * gl_FragColor.a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>`
  );
};

function createPositions(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * SPREAD;
  }
  return positions;
}

export function ParticleBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // No WebGL (very old device / disabled GPU): the hero simply has no particles.
      return;
    }

    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1), isSmallScreen ? 1.5 : 2));

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(createPositions(isSmallScreen ? MOBILE_PARTICLES : DESKTOP_PARTICLES), 3)
    );

    const material = new PointsMaterial({
      transparent: true,
      color: "#8B5CF6",
      size: 0.015,
      sizeAttenuation: true,
      depthWrite: false,
    });
    material.onBeforeCompile = roundPoints;

    const points = new Points(geometry, material);
    points.frustumCulled = false;

    const group = new Group();
    group.rotation.set(0, 0, Math.PI / 4);
    group.add(points);
    scene.add(group);

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = container;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    let elapsed = 0;
    let lastTime = 0;
    let frameId = 0;
    let inView = true;

    const renderFrame = () => {
      points.rotation.x = elapsed * 0.05;
      points.rotation.y = elapsed * 0.075;
      renderer.render(scene, camera);
    };

    const tick = (now) => {
      // Accumulate only running time so the rotation resumes smoothly after a pause.
      elapsed += Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      renderFrame();
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId || reducedMotion || !inView || document.hidden) return;
      lastTime = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!frameId) renderFrame();
    });
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    visibilityObserver.observe(container);

    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", handleVisibility);

    renderFrame();
    start();
    // Fade in once the first frame is on screen (the canvas mounts after the hero paints).
    requestAnimationFrame(() => canvas.classList.add("opacity-100"));

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-0 transition-opacity duration-700"
      />
    </div>
  );
}

export default ParticleBackground;
