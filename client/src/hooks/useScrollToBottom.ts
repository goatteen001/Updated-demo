import { useState, useEffect } from "react";

export function useScrollToBottom(offset: number = 10) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If they've already hit the bottom, no need to keep checking
      if (hasScrolledToBottom) return;

      const isBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - offset;

      if (isBottom) {
        setHasScrolledToBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check immediately in case the screen is large enough that no scrolling is needed
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledToBottom, offset]);

  return hasScrolledToBottom;
}
