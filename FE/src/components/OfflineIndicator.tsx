import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
      <WifiOff className="w-5 h-5 mr-2" />
      <span>오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.</span>
    </div>
  );
};

export default OfflineIndicator;
