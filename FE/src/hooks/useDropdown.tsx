import { useState, useRef, useEffect } from 'react';

/**
 * 드롭다운 UI 상태를 관리하는 커스텀 훅
 * @param initialState 초기 드롭다운 열림 상태 (기본값: false)
 * @returns 드롭다운 관련 상태와 핸들러들
 */

export function useDropdown(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 컨테이너 요소에 연결할 ref

  // 드롭다운 열기
  const open = () => setIsOpen(true);

  // 드롭다운 닫기
  const close = () => setIsOpen(false);

  // 드롭다운 토글
  const toggle = () => setIsOpen((prev) => !prev);

  // 드롭다운 이외 다른 부분 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    dropdownRef,
  };
}
