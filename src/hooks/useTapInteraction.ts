
import { useState, useCallback } from 'react';

interface TapInteractionOptions {
  likeTapCount?: number; // Default is 2
  swapTapCount?: number; // Default is 3
  tapTimeout?: number; // Default is 500ms
  onLike?: () => void;
  onSwap?: () => void;
}

export const useTapInteraction = ({
  likeTapCount = 2,
  swapTapCount = 3,
  tapTimeout = 500,
  onLike,
  onSwap
}: TapInteractionOptions = {}) => {
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null);

  const resetTapCount = useCallback(() => {
    setTapCount(0);
  }, []);

  const handleTap = useCallback(() => {
    // Clear existing timer
    if (tapTimer) {
      clearTimeout(tapTimer);
    }

    // Increment tap count
    setTapCount(prevCount => {
      const newCount = prevCount + 1;
      
      // Check if we've reached the threshold for like or swap
      if (newCount === likeTapCount) {
        onLike?.();
      } else if (newCount === swapTapCount) {
        onSwap?.();
        return 0; // Reset after swap
      }
      
      return newCount;
    });

    // Set timer to reset tap count after timeout
    const timer = setTimeout(resetTapCount, tapTimeout);
    setTapTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [likeTapCount, swapTapCount, tapTimeout, onLike, onSwap, tapTimer, resetTapCount]);

  return {
    tapCount,
    handleTap,
    resetTapCount
  };
};
