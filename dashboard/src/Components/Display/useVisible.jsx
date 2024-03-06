import { useEffect, useState } from 'react';

const useVisible = (ref, rootMargin = '0px') => {
  // State and setter for storing whether the element is visible
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when the observer callback fires
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin]); // Empty array ensures effect is only run on mount and unmount

  return isVisible;
};

export default useVisible;
