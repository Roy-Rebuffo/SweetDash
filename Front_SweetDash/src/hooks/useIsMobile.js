import { useState, useEffect } from "react";

export default function useIsMobile(bp = 768) {
  const [mob, setMob] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mob;
}
