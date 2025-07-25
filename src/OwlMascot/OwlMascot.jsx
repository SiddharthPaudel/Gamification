import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

const OwlModel = ({ isInCongrats }) => {
  const ref = useRef();
  const { scene } = useGLTF("/owl.glb");

  // Set initial rotation once when model is loaded
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = Math.PI / 2; // Rotate 90 degrees on Y axis to face front
      ref.current.rotation.x = 0.3; // Initial downward tilt
    }
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Different animations based on context
      if (isInCongrats) {
        // More celebratory animation for congrats
        ref.current.position.y = -0.2 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
        ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 2) * 0.1; // Side to side celebration
        ref.current.rotation.x = 0.25 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05; // Nodding with downward tilt
      } else {
        // Normal floating animation with downward tilt
        ref.current.position.y = -0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
        ref.current.rotation.x = 0.3; // Tilted down
        ref.current.rotation.z = 0;
      }
    }
  });

  return <primitive ref={ref} object={scene} scale={isInCongrats ? 0.12 : 0.08} />;
};

const OwlMascot = ({ 
  message, 
  isInCongrats = false,
  position = "fixed", // "fixed", "absolute", "relative", "static"
  positionProps = {}, // Custom positioning props like { top: 20, left: 50 }
  size = 160, // Size of the mascot container
  isDraggable = true, // Whether the mascot can be dragged
  showMessage = true, // Whether to show the speech bubble
  style = {}, // Additional custom styles
  className = "", // Custom CSS class
  zIndex = 1000 // Z-index for positioning
}) => {
  // Default position state for fixed positioning
  const [defaultPosition, setDefaultPosition] = useState({ right: 20, bottom: 250 });
  const draggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startPos = useRef(defaultPosition);

  // Drag handlers for mascot container
  const onPointerDown = (e) => {
    if (isInCongrats || !isDraggable) return;
    // Drag only with SHIFT key held to avoid conflict with orbit controls
    if (!e.shiftKey) return;
    draggingRef.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startPos.current = defaultPosition;
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || isInCongrats || !isDraggable) return;
    const dx = dragStartPos.current.x - e.clientX;
    const dy = dragStartPos.current.y - e.clientY;

    setDefaultPosition({
      right: Math.max(0, startPos.current.right + dx),
      bottom: Math.max(0, startPos.current.bottom + dy),
    });
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    if (isDraggable && !isInCongrats) {
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointermove", onPointerMove);
      return () => {
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointermove", onPointerMove);
      };
    }
  }, [isInCongrats, isDraggable]);

  // Build container styles based on position type
  const getContainerStyle = () => {
    let baseStyle = {
      width: size,
      height: size,
      userSelect: "none",
      touchAction: "none",
      pointerEvents: "auto",
      ...style
    };

    if (position === "fixed") {
      return {
        ...baseStyle,
        position: "fixed",
        right: positionProps.right ?? defaultPosition.right,
        bottom: positionProps.bottom ?? defaultPosition.bottom,
        top: positionProps.top,
        left: positionProps.left,
        zIndex: positionProps.zIndex ?? zIndex,
        cursor: isDraggable ? (draggingRef.current ? "grabbing" : "grab") : "default",
      };
    } else if (position === "absolute") {
      return {
        ...baseStyle,
        position: "absolute",
        top: positionProps.top ?? 0,
        left: positionProps.left ?? 0,
        right: positionProps.right,
        bottom: positionProps.bottom,
        zIndex: positionProps.zIndex ?? zIndex,
      };
    } else if (position === "relative") {
      return {
        ...baseStyle,
        position: "relative",
        top: positionProps.top,
        left: positionProps.left,
        right: positionProps.right,
        bottom: positionProps.bottom,
        zIndex: positionProps.zIndex ?? zIndex,
      };
    } else {
      // Static or custom positioning
      return {
        ...baseStyle,
        position: position,
        ...positionProps,
      };
    }
  };

  // Speech bubble positioning based on container position
  const getSpeechBubbleStyle = () => {
    const baseStyle = {
    position: "absolute",
    top: isInCongrats ? "-50px" : "-70px",
    left: "50%",
    transform: "translateX(-50%)",
    maxWidth: "220px",
    minWidth: "120px",
    padding: "12px 16px",
    backgroundColor: "#fff5cc",
    color: "#5b4d00",
    borderRadius: "16px",
    fontWeight: 600,
    fontSize: "13px",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    border: "2px solid #ffd93b",
    textAlign: "center",
    lineHeight: 1.4,
    zIndex: 10,
    userSelect: "none",
    pointerEvents: "none",
    transition: "all 0.3s ease",

    // 🔥 Ensure text wraps horizontally
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    display: "inline-block",
    };

    // Position bubble above the owl's head
    return {
      ...baseStyle,
      top: isInCongrats ? "-50px" : "-60px",
      left: "50%",
      transform: "translateX(-50%)",
    };
  };

  return (
    <div
      onPointerDown={onPointerDown}
      title={
        isInCongrats 
          ? "Congratulations Owl!" 
          : isDraggable 
            ? "Hold SHIFT and drag to move me" 
            : "Owl Mascot"
      }
      style={getContainerStyle()}
      className={className}
    >
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={isInCongrats ? 1.2 : 0.8} />
        <directionalLight position={[2, 2, 5]} intensity={isInCongrats ? 0.8 : 0.6} />
        <OwlModel isInCongrats={isInCongrats} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={isInCongrats ? 1.2 : 0.8}
          enableDamping
          dampingFactor={0.05}
          enabled={!isInCongrats} // Disable controls in congrats mode
        />
      </Canvas>

      {showMessage && message && (
        <div style={getSpeechBubbleStyle()}>
          {/* Duolingo-style speech bubble arrow pointing down to the owl's head */}
         <div
  style={{
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "10px solid #fff5cc",
    zIndex: 11,
  }}
/>
<div
  style={{
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "12px solid transparent",
    borderRight: "12px solid transparent",
    borderTop: "12px solid #ffd93b",
    zIndex: 10,
  }}
/>

          {message}
        </div>
      )}
    </div>
  );
};

export default OwlMascot;