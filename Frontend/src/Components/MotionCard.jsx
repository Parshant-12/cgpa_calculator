import { motion, useReducedMotion } from "framer-motion";

const cardTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

export default function MotionCard({ children, className = "", delay = 0, hover = true }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.98 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ ...cardTransition, delay }}
      whileHover={hover && !reduceMotion ? { y: -6, transition: { duration: 0.22 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
