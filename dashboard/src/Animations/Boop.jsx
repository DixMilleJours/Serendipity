import React from "react";

export const Boop = ({ translateY = 0, rotation = 0, timing = 150, children }) => {
  const [isBooped, setIsBooped] = React.useState(false);
  const style = {
    display: 'inline-block',
    backfaceVisibility: 'hidden',
    transform: isBooped
      ? `rotate(${rotation}deg) translateY(${translateY}px)`
      : `rotate(0deg) translateY(0px)`,
    transition: `transform ${timing}ms`,
  };
  React.useEffect(() => {
    if (!isBooped) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setIsBooped(false);
    }, timing);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isBooped, timing]);

  const trigger = () => {
    setIsBooped(true);
  };

  return (
    <span onMouseEnter={trigger} style={style}>
      {children}
    </span>
  );
};
