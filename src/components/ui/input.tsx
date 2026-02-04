import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-slate-600 bg-slate-800/50 px-3 py-1 text-base text-slate-200 shadow-sm transition-colors placeholder:text-slate-500 outline-none",
        "focus-visible:border-ness focus-visible:ring-2 focus-visible:ring-ness/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-200",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
