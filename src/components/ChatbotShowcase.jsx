// src/components/ChatbotShowcase.jsx
// Pastikan Anda sudah menginstal: npm install three @react-three/fiber @react-three/drei

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';

/**
 * Komponen untuk menampilkan model 3D Cirion dan animasinya.
 * @param {boolean} isTalking - State yang menentukan apakah animasi berbicara harus diputar.
 * @param {string | null} chatMessage - Pesan yang akan ditampilkan di gelembung obrolan.
 */
function CirionModel({ isTalking, chatMessage }) {
  const group = useRef();
  // Muat model GLB dari folder /public
  const { scene, animations } = useGLTF('/cirion-animated.glb');
  // Hubungkan animasi dengan model
  const { actions } = useAnimations(animations, group);

  // State untuk menyimpan nama bone kepala
  const [headBone, setHeadBone] = useState(null);

  // Efek untuk mencari bone kepala saat model dimuat
  useEffect(() => {
    if (scene) {
      // Telusuri scene untuk menemukan objek bone kepala
      // CATATAN: Nama 'Head' mungkin berbeda di file Blender Anda.
      // Anda bisa console.log(scene) untuk melihat strukturnya dan menemukan nama yang benar.
      scene.traverse((object) => {
        if (object.isBone && object.name === 'spine.006') { // Ganti 'Head' jika perlu
          setHeadBone(object);
        }
      });
    }
  }, [scene]);

  // Efek untuk mengontrol animasi berdasarkan state isTalking
  useEffect(() => {
    // Ganti 'talk_animation' dan 'idle_animation' dengan nama animasi Anda dari Blender.
    const talkAction = actions['talk_animation']; 
    const idleAction = actions['idle_animation'];

    if (isTalking) {
      // Mainkan animasi berbicara dan hentikan animasi diam
      if (idleAction) idleAction.fadeOut(0.5);
      if (talkAction) {
        talkAction.reset().fadeIn(0.5).play();
      }
    } else {
      // Mainkan animasi diam dan hentikan animasi berbicara
      if (talkAction) talkAction.fadeOut(0.5);
      if (idleAction) {
        idleAction.reset().fadeIn(0.5).play();
      }
    }
    // Cleanup saat komponen di-unmount
    return () => {
      if (talkAction) talkAction.stop();
      if (idleAction) idleAction.stop();
    };
  }, [isTalking, actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
      {/* Tampilkan gelembung obrolan hanya jika ada pesan dan bone kepala ditemukan */}
      {headBone && chatMessage && (
        // Lampirkan komponen HTML ke bone kepala
        <primitive object={headBone}>
          <Html position={[0, 0.5, 0.5]} center>
            <div className="bg-white bg-opacity-90 p-4 rounded-xl shadow-lg max-w-xs text-center">
              <p className="text-gray-800 text-sm">{chatMessage}</p>
            </div>
          </Html>
        </primitive>
      )}
    </group>
  );
}

// Preload model agar lebih cepat tampil
useGLTF.preload('/cirion-animated.glb');

/**
 * Komponen utama untuk halaman showcase chatbot 3D.
 */
export default function ChatbotShowcase() {
  const [isTalking, setIsTalking] = useState(false);
  const [chatMessage, setChatMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menyimulasikan percakapan
  const handleAskQuestion = () => {
    if (isLoading) return;

    setIsLoading(true);
    setChatMessage(null);
    setIsTalking(false);

    // Simulasikan waktu tunggu untuk respons AI
    setTimeout(() => {
      const responses = [
        "Halo! Saya Cirion, asisten AI dari FTMM. Ada yang bisa saya bantu?",
        "Tentu, di FTMM ada 5 program studi: Teknik Elektro, Teknik Industri, Rekayasa Nanoteknologi, Teknik Robotika & AI, dan Teknologi Sains Data.",
        "Visi FTMM adalah menjadi fakultas teknik yang unggul dan bermartabat.",
        "Anda bisa menemukan informasi lebih lanjut di website ftmm.unair.ac.id."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setIsLoading(false);
      setChatMessage(randomResponse); // Tampilkan pesan
      setIsTalking(true); // Mulai animasi berbicara

      // Hentikan animasi setelah beberapa saat
      setTimeout(() => {
        setIsTalking(false);
        setChatMessage(null); // Sembunyikan gelembung
      }, 7000); // Pesan akan tampil selama 7 detik

    }, 2000); // AI "berpikir" selama 2 detik
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full h-3/4 max-w-4xl rounded-lg shadow-2xl bg-white">
        <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={1} />
          <Suspense fallback={null}>
            <CirionModel isTalking={isTalking} chatMessage={chatMessage} />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={8} />
        </Canvas>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleAskQuestion}
          disabled={isLoading}
          className="px-8 py-4 bg-ftmm-prussian text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Thinking...' : 'Ask a Question'}
        </button>
        <p className="mt-4 text-gray-500 text-sm">
          Klik tombol untuk melihat simulasi chatbot menjawab pertanyaan.
        </p>
      </div>
    </div>
  );
}