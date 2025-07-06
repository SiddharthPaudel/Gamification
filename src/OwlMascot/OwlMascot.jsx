import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

const OwlModel = () => {
  const ref = useRef();
  const { scene } = useGLTF("/owl.glb");

  // Set initial rotation once when model is loaded
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = Math.PI / 2; // Rotate 90 degrees on Y axis to face front
    }
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Floating animation (up/down)
      ref.current.position.y = -0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      // Slight tilt down for better look
      ref.current.rotation.x = -0.1;
      // Y rotation is fixed by useEffect
    }
  });

  return <primitive ref={ref} object={scene} scale={0.08} />;
};

const OwlMascot = ({ message }) => {
  const [position, setPosition] = useState({ right: 20, bottom: 250 });
  const draggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startPos = useRef(position);

  // Drag handlers for mascot container
  const onPointerDown = (e) => {
    // Drag only with SHIFT key held to avoid conflict with orbit controls
    if (!e.shiftKey) return;
    draggingRef.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startPos.current = position;
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = dragStartPos.current.x - e.clientX;
    const dy = dragStartPos.current.y - e.clientY;

    setPosition({
      right: Math.max(0, startPos.current.right + dx),
      bottom: Math.max(0, startPos.current.bottom + dy),
    });
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      onPointerDown={onPointerDown}
      title="Hold SHIFT and drag to move me"
      style={{
        position: "fixed",
        right: position.right,
        bottom: position.bottom,
        width: 160,
        height: 160,
        zIndex: 1000,
        userSelect: "none",
        touchAction: "none",
        pointerEvents: "auto",
        cursor: draggingRef.current ? "grabbing" : "grab",
      }}
    >
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 5]} intensity={0.6} />
        <OwlModel />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.8}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 10,
          left: "-160px",
          width: 140,
          padding: "10px 15px",
          backgroundColor: "rgba(255,255,255,0.9)",
          color: "#222",
          borderRadius: "15px",
          fontWeight: "600",
          fontSize: "14px",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1.3,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-15px",
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: "15px solid rgba(255,255,255,0.9)",
            transform: "translateY(-50%)",
          }}
        />
        {message}
      </div>
    </div>
  );
};

export default OwlMascot;
