import { useRef, useEffect } from 'react';

const usePrevious = <T>(value: T, initialValue: T): T => {
  const ref = useRef<T>(initialValue);
  useEffect((): void => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePrevious;
