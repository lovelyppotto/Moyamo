import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GlbViewerProps {
  url: string;
  index?: number;
}

// 공유 리소스
const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = null;

export function GlbViewer({ url, index = 0 }: GlbViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);

    // Renderer 설정 (기존 renderer가 있으면 재사용)
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power', // 저전력 모드 사용
      });
    }
    const renderer = rendererRef.current;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(1); // 성능을 위해 픽셀 비율을 1로 고정
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);

    // 기존 모델 제거
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }

    // Light 설정
    const lights = [
      new THREE.AmbientLight('white', 0.7),
      new THREE.DirectionalLight('white', 1.2),
      new THREE.DirectionalLight('white', 0.5),
    ];

    lights[1].position.set(2, 2, 2);
    lights[2].position.set(-2, 0, -2);
    lights.forEach((light) => scene.add(light));

    // Controls 설정
    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    const controls = controlsRef.current;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3;

    // GLB 로딩
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        model.traverse((child: any) => {
          if (child instanceof THREE.Mesh && child.material) {
            child.material.roughness = 0.5;
            child.material.metalness = 0.5;
            child.material.envMapIntensity = 1.2;
          }
        });

        scene.add(model);

        // 모델 크기 조정
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxSize;
        model.scale.multiplyScalar(scale);

        // 모델 위치 조정
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));
        model.position.y -= 0.5;

        // 애니메이션 설정
        if (gltf.animations.length > 0) {
          if (mixerRef.current) {
            mixerRef.current.stopAllAction();
          }
          mixerRef.current = new THREE.AnimationMixer(model);
          const action = mixerRef.current.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      console.error
    );

    // 애니메이션 루프
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material) {
              child.material.dispose();
            }
          }
        });
      }

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      lights.forEach((light) => scene.remove(light));
    };
  }, [url, index]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}
