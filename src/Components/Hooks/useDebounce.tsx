import { debounce } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';

const useDebounce = (callback: any) => {
  const ref: any = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
};

export default useDebounce;
