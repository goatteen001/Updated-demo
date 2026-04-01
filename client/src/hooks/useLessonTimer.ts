import { useState, useEffect } from "react";

export function useLessonTimer(seconds: number) {
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeUp(true);
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return isTimeUp;
}