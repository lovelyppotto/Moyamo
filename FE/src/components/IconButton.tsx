import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface IconButtonProps {
  icon: IconDefinition; //FontAwesome 아이콘의 타입을 정의
  tooltipText: string;
  onClick?: () => void;
  className?: string;
}

function IconButton({ icon, tooltipText, onClick, className = '' }: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative font-[NanumSquareRound]">
      {/* 아이콘 버튼 */}
      <button
        className={`w-16 h-16 bg-kr-500 rounded-lg flex items-center justify-center text-white shadow-lg ${className}`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FontAwesomeIcon icon={icon} size="xl" color="white" />
      </button>

      {/* 아이콘 호버했을 때 툴팁 */}
      {showTooltip && (
        <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md px-4 py-2 flex items-center whitespace-nowrap z-10">
          <FontAwesomeIcon icon={faCircleInfo} className="mr-2 text-gray-700" />
          <span className="text-gray-700">{tooltipText}</span>
        </div>
      )}
    </div>
  );
}

export default IconButton;
