import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    const shouldUpdate = confirm('새 버전이 있습니다. 업데이트하시겠습니까?');
    if (shouldUpdate) {
      updateSW();
    }
  },
  onOfflineReady() {
    // 오프라인에서도 사용 가능함을 알리는 토스트 메시지나 알림 표시
    const offlineToast = document.createElement('div');
    offlineToast.className = 'offline-toast';
    offlineToast.textContent = '오프라인에서도 사용 가능합니다';
    document.body.appendChild(offlineToast);

    // 3초 후 토스트 메시지 제거
    setTimeout(() => {
      offlineToast.remove();
    }, 3000);
  },
  // 업데이트 간격 설정 (1시간마다 확인)
  onRegisteredSW(swUrl, registration) {
    // 콘솔에 출력
    console.log(`서비스 워커가 ${swUrl}에 등록되었습니다`);

    // registration이 존재하는지 확인 후 업데이트 설정
    if (registration) {
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000
      ); // 1시간마다
    }
  },
});

// CSS 추가 (토스트 메시지용)
const style = document.createElement('style');
style.textContent = `
  .offline-toast {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeInOut 3s ease-in-out;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);

export default updateSW;
