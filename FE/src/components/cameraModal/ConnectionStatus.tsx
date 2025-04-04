interface ConnectionStatusProps {
  isWebSocketConnected: boolean;
  isOpen: boolean;
}

function ConnectionStatus ({ isWebSocketConnected, isOpen }: ConnectionStatusProps){
  if (isWebSocketConnected || !isOpen) {
    return null;
  }

  return (
    <div className="absolute bottom-24 left-0 right-0 flex justify-center">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
        서버 연결 중입니다. 잠시만 기다려주세요.
      </div>
    </div>
  );
};

export default ConnectionStatus;