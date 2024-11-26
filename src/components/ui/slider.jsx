import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative flex w-full touch-none select-none items-center">
    <input
      type="range"
      className={cn(
        "w-full h-2 bg-slate-200 dark:bg-slate-700 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
Slider.displayName = "Slider"

export { Slider }