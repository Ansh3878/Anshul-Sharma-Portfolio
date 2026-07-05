
import { motion, useScroll } from "motion/react"
import { cn } from "@/lib/utils"

interface ScrollProgressBarProps {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgressBar({ className, ref }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-20 z-50 h-[2px] origin-left bg-white/80",
        className
      )}
      style={{ scaleX: scrollYProgress, willChange: "transform" }}
    />
  )
}
