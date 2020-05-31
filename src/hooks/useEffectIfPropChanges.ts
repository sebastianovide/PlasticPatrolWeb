import { useEffect, useRef } from "react";

type Effect = () => void | Promise<void>;

export default function useEffectIfPropChanges(effect: Effect, prop: any) {
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    effectRef.current();
  }, [prop]);
}
