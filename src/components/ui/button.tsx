import React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex justify-center items-center disabled:opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background font-medium align-middle transition-colors disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-dark text-primary-light hover:bg-primary-light hover:text-primary-dark",
        accent: "bg-accent text-white hover:bg-accent-light",
        outline:
          "border border-muted bg-transparent hover:bg-muted hover:text-white",
        ghost: "hover:bg-muted/10 hover:text-muted",
        destructive: "bg-destructive text-white hover:bg-destructive/60",
        success: "bg-success text-white hover:bg-success/60",
        warning: "bg-warning text-black hover:bg-warning/60",
        info: "bg-info text-white hover:bg-info/60",
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

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      animation,
      rounded,
      isLoading,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, animation, rounded, className }),
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 -ml-1 w-4 h-4 text-current animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
