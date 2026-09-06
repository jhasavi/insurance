import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageHeroProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  variant?: "dark" | "light" | "emerald"
  align?: "center" | "left"
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  variant = "dark",
  align = "center",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        variant === "dark" && "fintech-hero-dark text-white",
        variant === "light" && "fintech-hero-light text-slate-900",
        variant === "emerald" && "fintech-hero-emerald text-white",
        className
      )}
    >
      <div className="fintech-hero-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className={cn(
          "container relative mx-auto max-w-6xl px-4 py-16 md:py-24",
          align === "center" && "text-center",
          align === "left" && "text-left"
        )}
      >
        {eyebrow && (
          <p className="fintech-eyebrow mb-4 inline-block">{eyebrow}</p>
        )}
        <h1
          className={cn(
            "text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl max-w-4xl",
            align === "center" && "mx-auto"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-5 text-lg md:text-xl leading-relaxed max-w-2xl",
              align === "center" && "mx-auto",
              variant === "dark" && "text-slate-300",
              variant === "emerald" && "text-emerald-100/90",
              variant === "light" && "text-slate-600"
            )}
          >
            {description}
          </p>
        )}
        {children && (
          <div
            className={cn(
              "mt-8 flex flex-wrap gap-3",
              align === "center" && "justify-center"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
