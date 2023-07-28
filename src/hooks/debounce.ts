import { useEffect, useState } from 'react';

export default function useDebounce(value: string, delay: number = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const hanlder = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(hanlder);
  }, [value, delay]);

  return debounced;
}
