import { useEffect, useRef } from "react";

export default function useAsyncEffect(f: () => Promise<void>, deps: any[]) {
  const fRef = useRef(f);
  useEffect(() => {
    fRef.current = f;
  }, [f]);

  useEffect(() => {
    fRef.current();
    // eslint-disable-next-line
  }, deps);
}
