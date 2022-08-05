import { useEffect, useState } from 'react';

export const useDebounce = (value: any, delay = 300) => {
  const [debVal, setDebVal] = useState(value);

  useEffect(() => {
    if (!value) {
      setDebVal(value);
      return;
    }
    const taskId = setTimeout(() => {
      setDebVal(value);
    }, delay);

    return () => clearTimeout(taskId);
  }, [value]);

  return debVal;
};
