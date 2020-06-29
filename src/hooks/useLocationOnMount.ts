import { useRef } from "react";
import { useLocation } from "react-router-dom";

export default function useLocationOnMount<P>() {
  const location = useLocation<P>();
  const locationRef = useRef(location);

  return locationRef.current;
}
