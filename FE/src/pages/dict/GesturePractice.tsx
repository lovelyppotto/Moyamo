import { useLocation, useNavigate } from 'react-router-dom';
import DictHeader from './header/DictHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useCallback } from 'react';
import GesturePracticeCamera from '../../components/GesturePracticeCamera';
import { GlbViewer } from '@/components/GlbViewer';

function GesturePractice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied' 추가
  const { gesture } = location.state || [];

  const getImageUrl = () => {
    // gestureImage가 있으면 우선 사용 (GLB 파일)
    if (gesture?.gestureImage && gesture.gestureImage.endsWith('.glb')) {
      return gesture.gestureImage;
    }
    // imageUrl이 GLB 파일인 경우 사용
    if (gesture?.imageUrl && gesture.imageUrl.endsWith('.glb')) {
      return gesture.imageUrl;
    }
    // 둘 다 없는 경우 기본 이미지 반환 또는 에러 처리
    return gesture?.gestureImage || gesture?.imageUrl || '';
  };

  console.log(getImageUrl());
  // gesture 없으면 에러 페이지로 이동
  useEffect(() => {
    if (!gesture) {
      navigate('/error');
    }
  }, [gesture, navigate]);

  // 카메라 권한 확인 함수 추가
  const checkCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      // 권한 확인 후 스트림 해제
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error('카메라 접근 권한 오류:', error);
      setCameraPermission('denied');
      return false;
    }
  }, []);

  // 카메라 버튼 클릭 시 카메라로 전환 (권한 확인 로직 추가)
  const toggleScreen = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (hasPermission) {
      setShowCamera(true);
    }
    // 권한이 없으면 setShowCamera(true)를 호출하지 않음 (알림만 표시)
  }, [checkCameraPermission]);

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 dark:text-d-txt-50">
      {/* 헤더 */}
      <DictHeader title="연습하기" className="" />

      {/* 간단한 설명 */}
      <div
        className="font-[NanumSquareRoundB] text-[16px] sm:text-[18px] lg:text-[24px] pt-2 pb-1 px-4
        lg: mt-2 lg:pt-5 text-center flex justify-center items-center"
      >
        <span>제스처를 정확히 따라하면 화면에&nbsp;</span>
        <span className="text-fern-400 font-[NanumSquareRoundEB] sm:text-[22px] lg:text-[28px]">
          O
        </span>
        <span>가 표시됩니다.</span>
      </div>

      {/* 카메라 권한 거부 알림 */}
      {cameraPermission === 'denied' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4 mb-3">
          <p className="font-[NanumSquareRoundB] text-center">
            <strong>알림:</strong> 카메라 사용 권한이 차단되었습니다. 브라우저 설정에서 카메라
            접근을 허용해주세요.
          </p>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col lg:flex-row w-full h-full max-w-full px-2 py-1 flex-1 justify-center items-center lg:gap-8 xl:gap-12">
        {/* 따라할 제스처 */}
        <div className="w-full max-w-[500px] lg:w-auto lg:flex-1 flex justify-center items-center mb-2 lg:mb-0">
          <div
            className="w-full max-w-[500px] md:max-w-[600px] lg:max-w-[100%] h-[38vh] lg:h-[70vh] bg-white rounded-lg drop-shadow-basic 
          flex justify-center items-center p-3"
          >
            <GlbViewer url={getImageUrl()} />
          </div>
        </div>

        {/* 연습화면 */}
        <div
          className="w-full max-w-[500px] md:w-[500px] lg:w-[600px] h-[38vh] lg:h-[70vh] bg-gray-200 rounded-lg drop-shadow-basic 
          flex justify-center items-center cursor-pointer"
          onClick={!showCamera ? toggleScreen : undefined} // 카메라가 보이지 않을 때만 클릭 이벤트 활성화
        >
          {!showCamera ? (
            <div
              className="flex flex-col items-center text-gray-400 font-[NanumSquareRoundB] text-center space-y-2 sm:space-y-3
            rounded-lg drop-shadow-basic"
            >
              <div className="text-8xl lg:text-9xl ">
                <FontAwesomeIcon icon={faCamera} />
              </div>
              <p className="text-xl lg:text-2xl">
                카메라를 클릭 시<br />
                연습을 시작합니다.
              </p>
            </div>
          ) : (
            <GesturePracticeCamera
              guidelineClassName="max-w-[500px] 
              w-[40%] lg:w-[60%]
              top-16 lg:top-22"
              guideText="제스처를 3초간 유지해주세요."
              gestureLabel={gesture.gestureLabel}
              gestureType={gesture.gestureType}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default GesturePractice;
