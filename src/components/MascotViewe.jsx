// src/components/MascotViewer.jsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Komponen internal untuk me-load model .glb
function Model(props) {
  // Path ke model Anda di dalam folder /public
  const { scene } = useGLTF('/maskot-statis.glb'); 
  return <primitive object={scene} {...props} />;
}

export default function MascotViewer() {
  return (
    // Canvas adalah area untuk merender 3D
    <Canvas camera={{ position: [0, 0, 5], fov: 25 }}>
      {/* Pencahayaan untuk model */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Suspense diperlukan untuk menunggu model selesai di-load */}
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      
      {/* Kontrol untuk memutar dan zoom model dengan mouse */}
      <OrbitControls />
    </Canvas>
  );
}