
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
        "fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-zinc-500 via-white to-zinc-400 shadow-[0_0_8px_rgba(255,255,255,0.6)]",
        className
      )}
      style={{ scaleX: scrollYProgress, willChange: "transform" }}
    />
  )
}
