import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GlbViewerProps {
  url: string;
  index?: number;
}

export function GlbViewer({ url, index = 0 }: GlbViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene 설정
    const scene = new THREE.Scene();

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.y = 1.5;
    camera.position.z = 2.5; // 4에서 2.5로 변경하여 카메라를 더 가까이 배치
    scene.add(camera);

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.outputEncoding = THREE.sRGBEncoding; // sRGB 색상 공간 사용
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 톤 매핑 추가
    renderer.toneMappingExposure = 1.5; // 노출 증가 (1.0에서 1.5로 변경)
    containerRef.current.appendChild(renderer.domElement);

    // Light 설정 - 더 밝고 따뜻한 조명으로 변경
    const ambientLight = new THREE.AmbientLight('#fff9e6', 0.8); // 따뜻한 색상, 강도 증가
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffe0b3', 1.2); // 따뜻한 톤의 주 조명, 강도 증가
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    // 추가 조명으로 부드러운 채우기 조명 추가
    const fillLight = new THREE.DirectionalLight('#ffefcf', 0.8);
    fillLight.position.x = -1;
    fillLight.position.z = 1;
    scene.add(fillLight);

    // 뒷면 조명 추가
    const backLight = new THREE.DirectionalLight('#ffeedd', 0.9);
    backLight.position.z = -2;
    backLight.position.y = 1;
    scene.add(backLight);

    // Controls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation Mixer
    let mixer: THREE.AnimationMixer | null = null;

    // GLB/GLTF 로더
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        console.log('Model loaded successfully:', gltf);
        const model = gltf.scene;

        // 모델 재질 설정 - 원래 재질이 더 잘 드러나도록 수정
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              // 금속성과 거칠기를 원본 느낌이 더 살도록 조정
              child.material.roughness = 1.0; // 거칠기 증가 (덜 반짝이게)
              child.material.metalness = 0.1; // 금속성 감소
              child.material.envMapIntensity = 0.6; // 환경 맵 강도 감소
            }
          }
        });

        scene.add(model);

        // 모델 크기 자동 조정
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxSize;
        model.scale.multiplyScalar(scale);

        // 모델 위치 중앙 정렬
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));

        // 애니메이션 설정
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const animation = gltf.animations[0]; // 첫 번째 애니메이션 사용
          const action = mixer.clipAction(animation);
          action.play();
          console.log('Animation loaded:', animation.name);
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

    // 애니메이션 루프
    const clock = new THREE.Clock();

    function draw() {
      const delta = clock.getDelta();

      // 애니메이션 업데이트
      if (mixer) {
        mixer.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(draw);
    }

    // 리사이즈 핸들러
    function handleResize() {
      if (!containerRef.current) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', handleResize);
    draw();

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mixer) {
        mixer.stopAllAction();
      }
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [url, index]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
