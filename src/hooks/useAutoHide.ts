import { useEffect, useState } from "react";

// TODO(human): items가 바뀔 때(예: 댓글이 추가될 때) true를 켰다가,
// delay(ms) 후 자동으로 false로 꺼지는 useEffect를 작성하세요.
// 6단계에서 Profile.tsx에 직접 썼던 로직(마운트 가드 + setTimeout + cleanup)을
// 이 훅 안으로 그대로 옮겨와 일반화하면 됩니다. items는 빈 배열이면 "아직 아무 것도 없는 상태"로 취급합니다.
function useAutoHide(items: unknown[], delay: number): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if(items.length === 0) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, [items, delay]);
  return visible;
}

export default useAutoHide;
