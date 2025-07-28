import React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex justify-center items-center disabled:opacity-50 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 font-medium align-middle transition-colors disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-800 text-white hover:bg-gray-700",
        outline:
          "border border-gray-700 hover:bg-gray-700 dark:text-white hover:text-white",
        ghost: "hover:bg-gray-800 hover:text-white dark:text-white",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-[2rem] px-3 text-xs",
        md: "min-h-[2.5rem] px-4 text-sm",
        lg: "min-h-[3rem] px-6 text-base",
        icon: "min-h-[2.5rem] min-w-[2.5rem]",
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
              className="mr-2 -ml-1 w-4 h-4 text-white animate-spin"
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

export type ExploreButtonProps = {
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

export function ExploreButton({ variant }: ExploreButtonProps) {
  return (
    <div className="flex justify-center items-center bg-[#1E0F21] w-screen h-screen font-mono">
      <Button
        variant={variant}
        className="group relative flex justify-center items-center bg-white w-64 h-16 overflow-hidden font-semibold text-[#1E0F21] text-lg uppercase tracking-wider transition-all duration-1000 ease-in-out"
      >
        <span className="z-10 relative group-hover:text-white transition-all duration-1000 ease-in-out">
          Get Ticket
        </span>
        <span className="absolute inset-0 bg-[#3ad2d0] group-hover:rounded-none rounded-t-full scale-y-50 group-hover:scale-y-100 transition-all translate-y-full group-hover:translate-y-0 duration-1000 ease-in-out transform"></span>
      </Button>
    </div>
  );
}

export { Button, buttonVariants };
