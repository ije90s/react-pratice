import { useEffect, useState } from "react";

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
