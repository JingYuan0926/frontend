import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ParticleBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let animationFrameId;

    const initScene = async () => {
      const THREE = await import('three');

      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current = renderer;

      // Ensure renderer covers full viewport
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Background color (transparent)
      scene.background = new THREE.Color(0x000000);
      scene.background.alpha = 0;

      // Particles
      const particles = new THREE.BufferGeometry();
      const particleCount = 3000;

      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 5;     // x
        posArray[i + 1] = (Math.random() - 0.5) * 5; // y
        posArray[i + 2] = (Math.random() - 0.5) * 5; // z
      }

      particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const material = new THREE.PointsMaterial({
        size: 0.002,
        color: 0xffffff,
        sizeAttenuation: true,
      });

      const particlesMesh = new THREE.Points(particles, material);
      scene.add(particlesMesh);

      camera.position.z = 2;

      // Animation
      const animate = () => {
        if (!sceneRef.current) return;

        particlesMesh.rotation.x += 0.00012;
        particlesMesh.rotation.y += 0.00012;
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!rendererRef.current) return;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (mountRef.current && rendererRef.current.domElement) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        sceneRef.current = null;
        rendererRef.current = null;
      };
    };

    initScene();
  }, [isMounted]);

  return <div ref={mountRef} className="fixed inset-0 w-full h-full" style={{ minHeight: '100vh' }} />;
};

export default dynamic(() => Promise.resolve(ParticleBackground), { ssr: false }); 