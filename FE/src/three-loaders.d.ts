// three-loaders.d.ts 파일 생성하기
// 프로젝트 루트 또는 src 폴더에 저장

// Three.js 모듈 선언
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, Scene, Loader } from 'three';

  export interface GLTF {
    scene: Scene;
    scenes: Scene[];
    animations: any[];
    cameras: any[];
    asset: any;
  }

  export class GLTFLoader extends Loader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, Vector3 } from 'three';

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement);

    enabled: boolean;
    target: Vector3;

    // 댐핑 관련 속성 추가
    enableDamping: boolean;
    dampingFactor: number;

    update(): boolean;
    dispose(): void;

    // 추가적인 메서드와 속성
    minDistance: number;
    maxDistance: number;
    enableZoom: boolean;
    enableRotate: boolean;
    enablePan: boolean;
  }
}
