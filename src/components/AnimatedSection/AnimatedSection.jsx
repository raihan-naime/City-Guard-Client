import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import PropTypes from 'prop-types';

const AnimatedSection = ({ children, className = "", direction = "up", delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    // Parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const yMove = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const smoothY = useSpring(yMove, { stiffness: 100, damping: 30 });

    const variants = {
        hidden: { 
            opacity: 0, 
            y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
            x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0,
            scale: 0.95,
            rotateX: 5
        },
        visible: { 
            opacity: 1, 
            y: 0,
            x: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8,
                delay: delay
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ y: smoothY }} // Adds subtle parallax to every section
            className={`perspective-1000 ${className}`}
        >
            {children}
        </motion.div>
    );
};

AnimatedSection.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    direction: PropTypes.oneOf(['up', 'down', 'left', 'right', 'none']),
    delay: PropTypes.number
};

export default AnimatedSection;
