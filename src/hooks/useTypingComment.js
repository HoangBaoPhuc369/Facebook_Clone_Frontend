import { useEffect, useState } from "react";

const useTypingComment = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const startTyping = () => {
    setIsKeyPressed(true);
    setCountdown(3);
    setIsTyping(true);
  };

  const stopTyping = () => {
    setIsKeyPressed(false);
  };

  const cancelTyping = () => {
    setCountdown(0);
  };

  useEffect(() => {
    let interval;
    if (isKeyPressed === false) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (isKeyPressed || countdown === 0) {
      clearInterval(interval);
    }

    if (countdown === 0) {
      setIsTyping(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isKeyPressed, countdown]);

  return { isTyping, startTyping, stopTyping, cancelTyping };
};

export default useTypingComment;
