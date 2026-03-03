// src/components/ui/button-variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex justify-center items-center disabled:opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background font-medium align-middle transition-colors disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-background hover:bg-primary-dark",
        secondary: "bg-secondary text-foreground hover:bg-muted",
        outline:
          "border border-border bg-transparent hover:bg-muted hover:text-foreground",
        ghost: "bg-transparent hover:bg-muted hover:text-foreground",
        dark: "bg-foreground text-background hover:bg-foreground/80",
        destructive: "bg-destructive text-white hover:bg-destructive/80",
        success: "bg-success text-white hover:bg-success/80",
        warning: "bg-warning text-black hover:bg-warning/80",
        info: "bg-info text-white hover:bg-info/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
        custom: "",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      animation: "none",
      rounded: "default",
    },
  },
);
