import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize } from 'react-icons/fi';

// --- 1. Example Slider Data
const exampleSlides = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1517457788118-20df1f2010c7?auto=format&fit=crop&q=80&w=1920",
    headline: "The Future of Design",
    description: "Experience premium, 3D animated aesthetics crafted for the next generation of web applications.",
    ctaText: "Explore Now",
    ctaLink: "#explore",
    colorScheme: "bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-black/80"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1549733433-255d6771af6a?auto=format&fit=crop&q=80&w=1920",
    headline: "Unleash Pure Performance",
    description: "Built with React and Framer Motion for unparalleled speed, buttery smooth transitions, and dynamic interfaces.",
    ctaText: "Learn More",
    ctaLink: "#performance",
    colorScheme: "bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-black/80"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1563200782-386861298491?auto=format&fit=crop&q=80&w=1920",
    headline: "Elevate Your Presence",
    description: "A professional-grade component, utilizing glassmorphism for a truly elegant and modern online showcase.",
    ctaText: "Get Started",
    ctaLink: "#signup",
    colorScheme: "bg-gradient-to-r from-fuchsia-900/90 via-pink-900/90 to-black/80"
  }
];

// --- 2. Framer Motion Variants
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

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2 + 0.5,
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  })
};

// --- 3. Main Component
const BannerSlider = ({ slides = exampleSlides, autoPlayInterval = 8000, enableAutoPlay = true }) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentIndex = page % slides.length;
  const slide = slides[currentIndex];

  const x = useMotionValue(0);
  const rotateX = useTransform(x, [-300, 300], [-3, 3]);
  const scale = useTransform(x, [-300, 300], [1.02, 0.98]);
  const backgroundX = useTransform(x, [-300, 300], ["10%", "-10%"]);

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setPage(p => p + newDirection);
  }, []);

  useEffect(() => {
    if (!enableAutoPlay) return;
    const autoPlay = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);
    return () => clearInterval(autoPlay);
  }, [paginate, autoPlayInterval, enableAutoPlay]);

  const handleDragEnd = useCallback((event, info) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    if (swipe < -50 || velocity < -500) {
      paginate(1);
    } else if (swipe > 50 || velocity > 500) {
      paginate(-1);
    }
  }, [paginate]);

  const CurrentSlideContent = useMemo(() => {
    return (
      <motion.div
        key={slide.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        dragElastic={0.5}
        style={{ x, scale, perspective: 1000 }}
        className="absolute inset-0 w-full h-full cursor-grab"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${slide.imageUrl})`, x: backgroundX }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className={`absolute inset-0 ${slide.colorScheme} opacity-80 backdrop-blur-sm`}></div>
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
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-lg btn-primary-lendex transition duration-300 ease-in-out"
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
    <div className="relative w-full overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2rem] aspect-video max-h-[75vh] mx-auto mt-28 mb-12 border border-white/20">
      <div className="w-full h-full relative">
        <AnimatePresence initial={false} custom={direction}>
          {CurrentSlideContent}
        </AnimatePresence>
      </div>

      <div className="absolute inset-y-0 w-full flex items-center justify-between z-20 px-4 pointer-events-none">
        <button
          onClick={() => paginate(-1)}
          className="btn btn-circle glass-effect text-white pointer-events-auto hover:scale-110 transition border-none"
          aria-label="Previous Slide"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="btn btn-circle glass-effect text-white pointer-events-auto hover:scale-110 transition border-none"
          aria-label="Next Slide"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              const newDirection = index > currentIndex ? 1 : -1;
              setDirection(newDirection);
              setPage(page - currentIndex + index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out backdrop-blur-sm ${
              index === currentIndex
                ? 'bg-white w-6 opacity-100'
                : 'bg-white/50 hover:bg-white/80'
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