import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useInView } from "./hooks/useAnimations";
import { cn } from "./ui/utils";
import * as m from "../../paraglide/messages.js";

interface StateIconProps {
  size?: number;
  color?: string;
  className?: string;
  duration?: number;
}

function useAutoToggle(duration = 2000) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHidden((current) => !current);
    }, duration);

    return () => window.clearInterval(interval);
  }, [duration]);

  return hidden;
}

function EyeToggleIcon({ size = 40, color = "currentColor", className, duration = 2000 }: StateIconProps) {
  const hidden = useAutoToggle(duration);

  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn(className)} style={{ width: size, height: size }}>
      <motion.path
        d="M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={hidden ? { opacity: 0.3 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx="20"
        cy="20"
        r="5"
        stroke={color}
        strokeWidth={2}
        animate={hidden ? { scale: 0.6, opacity: 0.2 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="6"
        y1="34"
        x2="34"
        y2="6"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        animate={hidden ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
    </svg>
  );
}

export interface HandCoinsIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface HandCoinsIconProps {
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  size?: number;
  duration?: number;
}

const CIRCLE_VARIANTS: Variants = {
  normal: {
    translateY: 0,
    opacity: 1,
    transition: {
      opacity: { duration: 0.2 },
      type: "spring",
      stiffness: 150,
      damping: 15,
      bounce: 0.8,
    },
  },
  animate: {
    opacity: [0, 1],
    translateY: [-20, 0],
    transition: {
      opacity: { duration: 0.2 },
      type: "spring",
      stiffness: 150,
      damping: 15,
      bounce: 0.8,
    },
  },
};

const SECOND_CIRCLE_VARIANTS: Variants = {
  normal: {
    translateY: 0,
    opacity: 1,
    transition: {
      opacity: { duration: 0.2 },
      delay: 0.15,
      type: "spring",
      stiffness: 150,
      damping: 15,
      bounce: 0.8,
    },
  },
  animate: {
    opacity: [0, 1],
    translateY: [-20, 0],
    transition: {
      opacity: { duration: 0.2 },
      delay: 0.15,
      type: "spring",
      stiffness: 150,
      damping: 15,
      bounce: 0.8,
    },
  },
};

const HandCoinsIcon = forwardRef<HandCoinsIconHandle, HandCoinsIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 40, duration = 2000 }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          void controls.start("animate");
        },
        stopAnimation: () => {
          void controls.start("normal");
        },
      };
    });

    useEffect(() => {
      let active = true;

      const run = async () => {
        if (!active) return;
        await controls.start("normal");
        if (!active) return;
        await controls.start("animate");
      };

      void run();
      const interval = window.setInterval(() => {
        void run();
      }, duration);

      return () => {
        active = false;
        window.clearInterval(interval);
      };
    }, [controls, duration]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          void controls.start("animate");
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          void controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
          <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
          <path d="m2 16 6 6" />
          <motion.circle animate={controls} cx="16" cy="9" r="2.9" variants={CIRCLE_VARIANTS} />
          <motion.circle animate={controls} cx="6" cy="5" r="3" variants={SECOND_CIRCLE_VARIANTS} />
        </svg>
      </div>
    );
  },
);

HandCoinsIcon.displayName = "HandCoinsIcon";

export interface TrendingUpIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface TrendingUpIconProps {
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  size?: number;
  duration?: number;
}

const SVG_VARIANTS: Variants = {
  animate: {
    x: 0,
    y: 0,
    translateX: [0, 2, 0],
    translateY: [0, -2, 0],
    transition: {
      duration: 0.5,
    },
  },
};

const PATH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
};

const ARROW_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [0.5, 0],
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
};

const TrendingUpIcon = forwardRef<TrendingUpIconHandle, TrendingUpIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 40, duration = 2000 }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          void controls.start("animate");
        },
        stopAnimation: () => {
          void controls.start("normal");
        },
      };
    });

    useEffect(() => {
      let active = true;

      const run = async () => {
        if (!active) return;
        await controls.start("normal");
        if (!active) return;
        await controls.start("animate");
      };

      void run();
      const interval = window.setInterval(() => {
        void run();
      }, duration);

      return () => {
        active = false;
        window.clearInterval(interval);
      };
    }, [controls, duration]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          void controls.start("animate");
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          void controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          variants={SVG_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.polyline
            animate={controls}
            initial="normal"
            points="22 7 13.5 15.5 8.5 10.5 2 17"
            variants={PATH_VARIANTS}
          />
          <motion.polyline
            animate={controls}
            initial="normal"
            points="16 7 22 7 22 13"
            variants={ARROW_VARIANTS}
          />
        </motion.svg>
      </div>
    );
  },
);

TrendingUpIcon.displayName = "TrendingUpIcon";

const benefits = [
  {
    icon: EyeToggleIcon,
    title: m.benefits_title_1(),
    description: m.benefits_desc_1(),
  },
  {
    icon: HandCoinsIcon,
    title: m.benefits_title_2(),
    description: m.benefits_desc_2(),
  },
  {
    icon: TrendingUpIcon,
    title: m.benefits_title_3(),
    description: m.benefits_desc_3(),
  },
];

export function Benefits() {
  const { ref, inView } = useInView(0.15);

  return (
    <section id="miks?" className="bg-[#f5f5f5] py-20 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm px-5 py-1.5 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 5.5L8 1Z" stroke="#505050" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Inter'] text-[#505050]" style={{ fontSize: '14px' }}>{m.benefits_badge()}</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-['Poppins'] text-black" style={{ fontSize: '30px', lineHeight: '1.2' }}>
            <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: '34px' }}>{m.benefits_heading_italic()}</span>
            {m.benefits_heading()}
          </h2>
        </motion.div>

        {/* #3 Benefit Cards — Lift & Glow on hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-8 flex flex-col gap-4 cursor-default group"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                transition: { duration: 0.3 },
              }}
            >
              <b.icon
                size={40}
                duration={2000}
                className="text-[#1977f2] group-hover:text-[#3a50e0] transition-colors duration-300"
              />
              <h3 className="font-['Poppins'] font-semibold text-black" style={{ fontSize: '16px' }}>{b.title}</h3>
              <p className="font-['Poppins'] text-[#505050]" style={{ fontSize: '16px', lineHeight: '1.6' }}>{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
