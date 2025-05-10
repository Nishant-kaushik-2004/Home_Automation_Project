"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Particle3DUniverse = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Renderer config
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    const initialMountNode = mountNode; // Store the initial value of mountRef.current

    // Camera position
    camera.position.z = 30;

    // Controls (disable zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Particle system setup
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 50;
      posArray[i + 1] = (Math.random() - 0.5) * 50;
      posArray[i + 2] = (Math.random() - 0.5) * 50;

      colorArray[i] = Math.random();
      colorArray[i + 1] = Math.random();
      colorArray[i + 2] = Math.random();
    }

    particles.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update particle positions
      const positions = particles.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.002;
        positions[i + 1] += Math.cos(elapsedTime + i) * 0.002;
        positions[i + 2] += Math.sin(elapsedTime * 0.5 + i) * 0.002;
      }
      particles.attributes.position.needsUpdate = true;

      // Rotate entire system
      particleSystem.rotation.y = elapsedTime * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (initialMountNode && initialMountNode.contains(renderer.domElement)) {
        initialMountNode.removeChild(renderer.domElement);
      }

      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      scene.remove(particleSystem);
      particles.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Particle3DUniverse;
