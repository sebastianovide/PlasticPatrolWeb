import { useEffect, useRef } from "react";

type Effect = () => void | Promise<void>;

export default function useEffectOnMount(effect: Effect) {
  const ref = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      effect();
      ref.current = true;
    }
  }, [effect]);
}
