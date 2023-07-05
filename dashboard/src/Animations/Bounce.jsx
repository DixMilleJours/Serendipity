import React from "react";
import { useSpring, animated } from '@react-spring/web'

export const Bounce = ({ x = 0,
    y = 0,
    rotation = 0,
    scale = 1,
    timing = 150,
    children }) => {

    const [isBounced, setIsBounced] = React.useState(false);
    const style = useSpring({
        display: 'inline-block',
        backfaceVisibility: 'hidden',
        transform: isBounced
            ? `translate(${x}px, ${y}px)
               rotate(${rotation}deg)
               scale(${scale})`
            : `translate(0px, 0px)
               rotate(0deg)
               scale(1)`,
        config: {
            tension: 300,
            friction: 10,
        },
    });

    React.useEffect(() => {
        if (!isBounced) {
            return;
        }
        const timeoutId = window.setTimeout(() => {
            setIsBounced(false);
        }, timing);
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isBounced, timing]);

    const trigger = () => {
        setIsBounced(true);
    };

    return (
        <animated.span onMouseEnter={trigger} style={style}>
            {children}
        </animated.span>
    );
}







