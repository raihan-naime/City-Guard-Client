import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize } from 'react-icons/fi'; // React Icons

// --- 1. Example Slider Data (Move to external JSON/API call in production)
const exampleSlides = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1517457788118-20df1f2010c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODMxOTl8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBhcnQlMjBhYnN0cmFjdHxlbnwwfDB8fHwxNzAzNzY3NzQ4fDA&ixlib=rb-4.0.3&q=80&w=1080",
    headline: "The Future of Design",
    description: "Experience premium, minimalistic, and elegant aesthetics crafted for the next generation of web applications.",
    ctaText: "Explore Now",
    ctaLink: "#explore",
    colorScheme: "bg-blue-600/80"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1549733433-255d6771af6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODMxOTl8MHwxfHNlYXJjaHw1fHx0ZWNobm9sb2d5JTIwc3BhY2V8ZW58MHwwfHx8fDE3MDM3Njc3NzZ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    headline: "Unleash Pure Performance",
    description: "Built with React and Framer Motion for unparalleled speed, buttery smooth transitions, and dynamic user interfaces.",
    ctaText: "Learn More",
    ctaLink: "#performance",
    colorScheme: "bg-purple-600/80"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1563200782-386861298491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODMxOTl8MHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwd2FsbHBhcGVyfGVufDB8MHx8fDE3MDM3Njc4MTB8MA&lib=rb-4.0.3&q=80&w=1080",
    headline: "Elevate Your Presence",
    description: "A professional-grade component, utilizing DaisyUI's clean utility for a truly elegant and modern online showcase.",
    ctaText: "Get Started",
    ctaLink: "#signup",
    colorScheme: "bg-teal-600/80"
  }
];

// --- 2. Framer Motion Variants

// Container for the entire slide (used with AnimatePresence)
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 }
    }
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.8, type: "tween" }
    }
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 }
    }
  })
};

// Variants for the text content
const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2 + 0.5, // Staggered entry after the slide transition starts
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99] // Easing for smooth 'pop'
    }
  })
};

// --- 3. Main Component
const BannerSlider = ({ slides = exampleSlides, autoPlayInterval = 8000, enableAutoPlay = true }) => {
  const [page, setPage] = useState(0); // Current slide index
  const [direction, setDirection] = useState(0); // 1 for next, -1 for previous

  const currentIndex = page % slides.length;
  const slide = slides[currentIndex];
  const totalSlides = slides.length;

  // Framer Motion Hooks for Parallax and 3D effects
  const x = useMotionValue(0); // Tracks drag movement
  // Use useTransform to create a slight rotation and scaling based on drag (3D-like depth)
  const rotateX = useTransform(x, [-300, 300], [-3, 3]);
  const scale = useTransform(x, [-300, 300], [1.02, 0.98]);

  // Parallax transform for background image movement
  const backgroundX = useTransform(x, [-300, 300], ["10%", "-10%"]);

  // Navigation Logic (Go to next/previous)
const paginate = useCallback((newDirection) => {
  setDirection(newDirection);
  setPage(p => p + newDirection);
}, []);

  // Auto-play Effect
  useEffect(() => {
    if (!enableAutoPlay) return;

    const autoPlay = setInterval(() => {
      // Simulate a 'next' click for auto-play
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(autoPlay);
  }, [paginate, autoPlayInterval, enableAutoPlay]);

// 2. Drag End Handler (Uses paginate as a dependency)
const handleDragEnd = useCallback((event, info) => {
  const swipe = info.offset.x;
  const velocity = info.velocity.x;

  if (swipe < -50 || velocity < -500) {
    paginate(1);
  } else if (swipe > 50 || velocity > 500) {
    paginate(-1);
  }
}, [paginate]);

  // Memoized Content for the current slide to prevent unnecessary re-renders
  const CurrentSlideContent = useMemo(() => {
    return (
      <motion.div
        key={slide.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        drag="x" // Enable horizontal drag
        dragConstraints={{ left: 0, right: 0 }} // Don't allow actual drag movement
        onDragEnd={handleDragEnd}
        dragElastic={0.5} // How far you can drag before snap back
        style={{ x, scale, perspective: 1000 }} // Apply 3D perspective and transformations
        className="absolute inset-0 w-full h-full cursor-grab"
      >
        {/* Background Image Container with Parallax Effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${slide.imageUrl})`, x: backgroundX }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Gradient Overlay for Text Readability & Premium Look */}
        <div className={`absolute inset-0 ${slide.colorScheme} opacity-80 backdrop-blur-sm`}></div>

        {/* Content Box */}
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-xl text-white">
            <motion.h1
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
            >
              {slide.headline}
            </motion.h1>

            <motion.p
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl mb-6 font-light drop-shadow"
            >
              {slide.description}
            </motion.p>

            <motion.a
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              href={slide.ctaLink}
              // Scale-in on hover for CTA button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-lg btn-secondary shadow-2xl transition duration-300 ease-in-out"
            >
              {slide.ctaText}
              <FiMaximize className="ml-2" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    );
  }, [slide, direction, handleDragEnd, x, scale, backgroundX]);

  return (
    <div className="relative w-full overflow-hidden shadow-2xl rounded-2xl aspect-video max-h-[60vh]">
      <div className="w-full h-full relative">
        {/* AnimatePresence for smooth slide transitions (fade/slide-out) */}
        <AnimatePresence initial={false} custom={direction}>
          {CurrentSlideContent}
        </AnimatePresence>
      </div>

      {/* --- Navigation Arrows --- */}
      <div className="absolute inset-y-0 w-full flex items-center justify-between z-20 px-4 pointer-events-none">
        <button
          onClick={() => paginate(-1)}
          className="btn btn-circle btn-ghost text-white backdrop-blur-sm pointer-events-auto opacity-70 hover:opacity-100 transition"
          aria-label="Previous Slide"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="btn btn-circle btn-ghost text-white backdrop-blur-sm pointer-events-auto opacity-70 hover:opacity-100 transition"
          aria-label="Next Slide"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* --- Pagination Dots --- */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              // Calculate direction for smooth transition
              const newDirection = index > currentIndex ? 1 : -1;
              setDirection(newDirection);
              setPage(page - currentIndex + index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out backdrop-blur-sm ${
              index === currentIndex
                ? 'bg-white w-6 opacity-100' // Active dot style
                : 'bg-white/50 hover:bg-white/80' // Inactive dot style
            }`}
            whileHover={{ scale: 1.1 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;