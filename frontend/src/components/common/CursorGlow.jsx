import { useState, useEffect, useRef } from "react";

/**
 * Professional Mouse Cursor Interaction System
 *
 * Theme:
 * - Primary accent: #00FF00 (Neon Green)
 * - Background: #050505
 *
 * Visual Components:
 * 1. Precision central cursor dot (#00FF00)
 * 2. Subtle transparent cursor ring with smooth trailing
 * 3. Soft neon-green ambient radial glow
 *
 * Behaviors & States:
 * - Smooth trailing linear interpolation (lerp) via requestAnimationFrame
 * - Magnetic attraction when hovering interactive buttons & links
 * - Contextual hover scaling for links/buttons, project cards, and media
 * - Snappy click/mousedown compression feedback
 * - Disables completely on touch / mobile / tablet devices
 * - Respects prefers-reduced-motion (disables lag & excessive motion)
 * - Fully non-blocking (pointer-events: none) preserving native text selection and accessibility
 */
export function CursorGlow() {
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  // Position tracking (viewport client coordinates)
  const mousePos = useRef({ x: -200, y: -200 });
  const dotPos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const glowPos = useRef({ x: -200, y: -200 });

  // Interactive state
  const stateRef = useRef({
    hoverType: "default", // "default" | "pointer" | "card" | "media" | "input"
    isDown: false,
    isVisible: false,
    isMagnetic: false,
    magneticCenter: { x: 0, y: 0 },
  });

  useEffect(() => {
    // 1. Device check: Only activate for fine pointer & hover devices (desktop mouse/trackpad)
    const checkPointerSupport = () => {
      const hasFinePointer =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(pointer: fine) and (hover: hover)").matches &&
        !window.matchMedia("(pointer: coarse)").matches;
      setIsPointerDevice(Boolean(hasFinePointer));
    };

    checkPointerSupport();

    const pointerMedia = window.matchMedia("(pointer: fine)");
    const handleMediaChange = () => checkPointerSupport();

    if (pointerMedia?.addEventListener) {
      pointerMedia.addEventListener("change", handleMediaChange);
    } else if (pointerMedia?.addListener) {
      pointerMedia.addListener(handleMediaChange);
    }

    return () => {
      if (pointerMedia?.removeEventListener) {
        pointerMedia.removeEventListener("change", handleMediaChange);
      } else if (pointerMedia?.removeListener) {
        pointerMedia.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPointerDevice) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = motionQuery.matches;

    const handleMotionChange = (e) => {
      isReducedMotion = e.matches;
    };

    if (motionQuery?.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    }

    // --- Animation loop control ---
    // The loop sleeps once the dot, ring and glow have caught up with the mouse
    // and wakes on the next mouse event, so an idle cursor costs no frames.
    let animationFrameId = 0;
    let settledFrames = 0;
    const wake = () => {
      settledFrames = 0;
      if (!animationFrameId) animationFrameId = requestAnimationFrame(render);
    };

    // --- Mouse Event Handlers ---
    const handleMouseMove = (e) => {
      wake();
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      stateRef.current.isVisible = true;

      // Detect target element
      const target = e.target;
      if (!target) return;

      // A. Text Inputs & Editable areas (fade custom cursor to allow native I-beam)
      if (target.closest('input, textarea, [contenteditable="true"], select')) {
        stateRef.current.hoverType = "input";
        stateRef.current.isMagnetic = false;
        return;
      }

      // B. Buttons, Links & Clickable elements (Magnetic interaction)
      const magneticEl = target.closest(
        'a, button, [role="button"], .btn-hero, .skill-icon, [data-cursor="pointer"], [data-cursor-magnetic], .cursor-pointer'
      );
      if (magneticEl) {
        stateRef.current.hoverType = "pointer";

        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.hypot(distX, distY);
        const maxMagneticDistance = Math.max(rect.width, rect.height) * 0.85 + 24;

        if (distance < maxMagneticDistance) {
          stateRef.current.isMagnetic = true;
          // Smooth subtle magnetic pull towards the element center
          stateRef.current.magneticCenter = {
            x: centerX + distX * 0.32,
            y: centerY + distY * 0.32,
          };
        } else {
          stateRef.current.isMagnetic = false;
        }
        return;
      }

      // C. Project Cards
      const cardEl = target.closest('.project-card, [data-cursor="card"], [data-slot="card"]');
      if (cardEl) {
        stateRef.current.hoverType = "card";
        stateRef.current.isMagnetic = false;
        return;
      }

      // D. Images & Media
      const mediaEl = target.closest('img, video, canvas, [data-cursor="media"]');
      if (mediaEl) {
        stateRef.current.hoverType = "media";
        stateRef.current.isMagnetic = false;
        return;
      }

      // E. Default state
      stateRef.current.hoverType = "default";
      stateRef.current.isMagnetic = false;
    };

    const handleMouseDown = () => {
      stateRef.current.isDown = true;
      wake();
    };

    const handleMouseUp = () => {
      stateRef.current.isDown = false;
      wake();
    };

    const handleMouseLeave = () => {
      stateRef.current.isVisible = false;
      wake();
    };

    const handleMouseEnter = () => {
      stateRef.current.isVisible = true;
      wake();
    };

    const handleWindowBlur = () => {
      stateRef.current.isVisible = false;
      wake();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.documentElement.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("blur", handleWindowBlur);

    // --- Animation Loop ---
    function render() {
      const { hoverType, isDown, isVisible, isMagnetic, magneticCenter } = stateRef.current;

      // Lerp speeds: instant if reduced motion is requested
      const dotLerp = isReducedMotion ? 1.0 : 0.85;
      const ringLerp = isReducedMotion ? 1.0 : 0.18;
      const glowLerp = isReducedMotion ? 1.0 : 0.08;

      const targetDotX = mousePos.current.x;
      const targetDotY = mousePos.current.y;

      const targetRingX = isMagnetic ? magneticCenter.x : mousePos.current.x;
      const targetRingY = isMagnetic ? magneticCenter.y : mousePos.current.y;

      const targetGlowX = mousePos.current.x;
      const targetGlowY = mousePos.current.y;

      // Update positions with linear interpolation
      dotPos.current.x += (targetDotX - dotPos.current.x) * dotLerp;
      dotPos.current.y += (targetDotY - dotPos.current.y) * dotLerp;

      ringPos.current.x += (targetRingX - ringPos.current.x) * ringLerp;
      ringPos.current.y += (targetRingY - ringPos.current.y) * ringLerp;

      glowPos.current.x += (targetGlowX - glowPos.current.x) * glowLerp;
      glowPos.current.y += (targetGlowY - glowPos.current.y) * glowLerp;

      // Compute style properties based on current state
      let dotScale = 1;
      let dotOpacity = 1;
      let ringScale = 1;
      let ringOpacity = 0.85;
      let ringBorder = "rgba(0, 255, 0, 0.45)";
      let ringBg = "rgba(0, 255, 0, 0.02)";
      let ringShadow = "0 0 10px rgba(0, 255, 0, 0.15)";
      let glowScale = 1;
      let glowOpacity = 0.55;

      switch (hoverType) {
        case "input":
          dotScale = 0;
          dotOpacity = 0;
          ringScale = 0.4;
          ringOpacity = 0;
          glowScale = 0.8;
          glowOpacity = 0.15;
          break;

        case "pointer":
          dotScale = isDown ? 0.7 : 0.85;
          dotOpacity = 1;
          ringScale = isDown ? 1.3 : 1.55;
          ringOpacity = 1;
          ringBorder = "rgba(0, 255, 0, 0.9)";
          ringBg = "rgba(0, 255, 0, 0.08)";
          ringShadow = "0 0 16px rgba(0, 255, 0, 0.4)";
          glowScale = isDown ? 1.15 : 1.35;
          glowOpacity = 0.85;
          break;

        case "card":
          dotScale = isDown ? 0.75 : 1;
          dotOpacity = 1;
          ringScale = isDown ? 1.5 : 1.85;
          ringOpacity = 0.9;
          ringBorder = "rgba(0, 255, 0, 0.65)";
          ringBg = "rgba(0, 255, 0, 0.04)";
          ringShadow = "0 0 20px rgba(0, 255, 0, 0.25)";
          glowScale = isDown ? 1.25 : 1.5;
          glowOpacity = 0.75;
          break;

        case "media":
          dotScale = isDown ? 0.7 : 0.9;
          dotOpacity = 1;
          ringScale = isDown ? 1.3 : 1.6;
          ringOpacity = 0.9;
          ringBorder = "rgba(0, 255, 0, 0.75)";
          ringBg = "rgba(0, 255, 0, 0.06)";
          ringShadow = "0 0 16px rgba(0, 255, 0, 0.3)";
          glowScale = 1.3;
          glowOpacity = 0.75;
          break;

        case "default":
        default:
          dotScale = isDown ? 0.7 : 1;
          dotOpacity = 1;
          ringScale = isDown ? 0.8 : 1;
          ringOpacity = 0.85;
          ringBorder = "rgba(0, 255, 0, 0.45)";
          ringBg = "rgba(0, 255, 0, 0.02)";
          ringShadow = "0 0 10px rgba(0, 255, 0, 0.15)";
          glowScale = isDown ? 0.9 : 1;
          glowOpacity = 0.55;
          break;
      }

      // Apply transforms and styles directly via DOM refs (0 React re-renders)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.opacity = isVisible ? dotOpacity : 0;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.opacity = isVisible ? ringOpacity : 0;
        ringRef.current.style.borderColor = ringBorder;
        ringRef.current.style.backgroundColor = ringBg;
        ringRef.current.style.boxShadow = ringShadow;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%) scale(${glowScale})`;
        glowRef.current.style.opacity = isVisible ? glowOpacity : 0;
      }

      // Keep running until every layer is within a fraction of a pixel of its
      // target for a few consecutive frames, then sleep until the next event.
      const remaining = Math.max(
        Math.abs(targetDotX - dotPos.current.x),
        Math.abs(targetDotY - dotPos.current.y),
        Math.abs(targetRingX - ringPos.current.x),
        Math.abs(targetRingY - ringPos.current.y),
        Math.abs(targetGlowX - glowPos.current.x),
        Math.abs(targetGlowY - glowPos.current.y)
      );
      settledFrames = remaining < 0.1 ? settledFrames + 1 : 0;
      animationFrameId = settledFrames > 3 ? 0 : requestAnimationFrame(render);
    }

    wake();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("blur", handleWindowBlur);
      if (motionQuery?.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPointerDevice]);

  if (!isPointerDevice) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
    >
      {/* 1. Soft Ambient Green Radial Glow */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[340px] h-[340px] rounded-full pointer-events-none transition-opacity duration-300 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 255, 0, 0.12) 0%, rgba(0, 255, 0, 0.035) 40%, rgba(0, 255, 0, 0) 70%)",
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%) scale(1)",
          opacity: 0,
        }}
      />

      {/* 2. Sleek Responsive Trailing Ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-[34px] h-[34px] rounded-full pointer-events-none border border-[#00FF00]/50 bg-[#00FF00]/[0.02] transition-[border-color,background-color,box-shadow,opacity] duration-200 ease-out will-change-transform"
        style={{
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%) scale(1)",
          opacity: 0,
        }}
      />

      {/* 3. Small Precision Center Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none bg-[#00FF00] shadow-[0_0_8px_#00FF00,0_0_2px_#ffffff] transition-opacity duration-150 will-change-transform"
        style={{
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%) scale(1)",
          opacity: 0,
        }}
      />
    </div>
  );
}
