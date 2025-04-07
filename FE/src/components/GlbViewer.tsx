import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GlbViewerProps {
  url: string;
  animationIndex?: number;
}

export function GlbViewer({ url, animationIndex = 0 }: GlbViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  // 씬, 카메라, 렌더러 초기화 및 모델 로드
  useEffect(() => {
    if (!containerRef.current) return;

    // 기존 렌더러 정리
    if (rendererRef.current) {
      rendererRef.current.dispose();
      containerRef.current.removeChild(rendererRef.current.domElement);
    }

    // Scene 설정
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.y = 0;
    camera.position.z = 2.5;
    scene.add(camera);

    // Renderer 설정
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    const renderer = rendererRef.current;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    containerRef.current.appendChild(renderer.domElement);

    // Light 설정
    const ambientLight = new THREE.AmbientLight('#fff9e6', 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffe0b3', 1.2);
    directionalLight.position.x = 1;
    directionalLight.position.z = 1;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight('#ffefcf', 0.8);
    fillLight.position.x = -1;
    fillLight.position.z = 1;
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight('#ffeedd', 0.9);
    backLight.position.z = -2;
    backLight.position.y = 1;
    scene.add(backLight);

    // Controls 설정 - 좌우로만 회전 가능하도록 제한
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: null,
      RIGHT: null,
    };

    // 애니메이션 루프
    const clock = new THREE.Clock();

    function draw() {
      const delta = clock.getDelta();

      // 애니메이션 업데이트 - 단일 믹서만 사용
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      requestAnimationFrame(draw);
    }

    // 리사이즈 핸들러
    function handleResize() {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );

      if (sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }

    window.addEventListener('resize', handleResize);
    draw();

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }

      // 모델 제거
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    };
  }, []);

  // GLB 모델 로드 - URL이 변경될 때마다 다시 로드
  useEffect(() => {
    if (!sceneRef.current) return;

    // 기존 모델 및 애니메이션 정리
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }

    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    // GLB/GLTF 로더
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        console.log('Model loaded successfully:', gltf);
        console.log('Animations available:', gltf.animations.length);
        gltf.animations.forEach((anim, idx) => {
          console.log(`Animation ${idx}: ${anim.name}, duration: ${anim.duration}`);
        });

        const model = gltf.scene;
        modelRef.current = model;

        // 모델 재질 설정
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            child.material.roughness = 1.0;
            child.material.metalness = 0.1;
            child.material.envMapIntensity = 0.6;
          }
        });

        // 씬에 모델 추가
        sceneRef.current?.add(model);

        // 모델 크기 자동 조정
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxSize;
        model.scale.multiplyScalar(scale);

        // 모델 위치 중앙 정렬
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));

        // 애니메이션 처리 - 단일 믹서만 사용
        if (gltf.animations && gltf.animations.length > 0) {
          // 선택된 애니메이션 인덱스가 유효한지 확인
          let selectedAnimIndex = 0;
          if (animationIndex >= 0 && animationIndex < gltf.animations.length) {
            selectedAnimIndex = animationIndex;
          }

          console.log(
            `Using animation index ${selectedAnimIndex}: ${gltf.animations[selectedAnimIndex]?.name || 'unnamed'}`
          );

          // 단일 믹서 사용
          mixerRef.current = new THREE.AnimationMixer(model);

          // 선택된 애니메이션만 재생
          const action = mixerRef.current.clipAction(gltf.animations[selectedAnimIndex]);
          action.timeScale = 0.5;
          action.play();

          // 두 개의 애니메이션 모델인 경우에는 모델의 특정 부분만 애니메이션 적용 가능 (선택 사항)
          // 여기서는 사용하지 않음
        }
      },
      (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
        console.log('Loading progress:', percentage + '%');
      },
      (error) => {
        console.error('\n GLB/GLTF 로딩 에러:', error);
      }
    );

    return () => {
      // URL이 변경될 때 클린업
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [url, animationIndex]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
