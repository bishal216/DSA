import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/utils/helpers";

type Variant = "default" | "primary" | "danger" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";
type Rounded = "full" | "lg" | "md" | "none";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  variant?: Variant;
  size?: Size;
  rounded?: Rounded;
  withIcon?: boolean;
  thumbClassName?: string;
  disabled?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default:
    "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 border-2 border-transparent",
  primary:
    "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300 border-2 border-transparent",
  danger:
    "data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-300 border-2 border-transparent",
  outline:
    "data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-300 border-2 border-transparent",
  ghost:
    "bg-transparent border border-transparent data-[state=checked]:bg-blue-100/50 data-[state=unchecked]:bg-gray-100/50",
};

const sizeClasses: Record<
  Size,
  { root: string; thumb: string; iconSize: string }
> = {
  sm: {
    root: "h-5 w-9",
    thumb: "h-4 w-4",
    iconSize: "h-2.5 w-2.5",
  },
  md: {
    root: "h-6 w-11",
    thumb: "h-5 w-5",
    iconSize: "h-3 w-3",
  },
  lg: {
    root: "h-7 w-14",
    thumb: "h-6 w-6",
    iconSize: "h-3.5 w-3.5",
  },
};

const roundedClasses: Record<Rounded, string> = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      thumbClassName,
      variant = "default",
      size = "md",
      rounded = "full",
      withIcon = false,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          variantClasses[variant],
          sizeClasses[size].root,
          roundedClasses[rounded],
          isDisabled && "cursor-not-allowed opacity-70",
          loading && "relative overflow-hidden",
          className,
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
        ref={ref}
      >
        {loading && (
          <span className="absolute inset-0 bg-gray-200/50 animate-pulse" />
        )}
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none rounded-full ring-0 transition-transform duration-200 ease-in-out flex items-center justify-center",
            "data-[state=unchecked]:translate-x-[1%]",
            "data-[state=checked]:translate-x-[100%]",
            sizeClasses[size].thumb,
            variant === "outline" || variant === "ghost"
              ? "bg-white border border-gray-200"
              : "bg-white",
            loading && "opacity-80",
            thumbClassName,
          )}
        >
          {withIcon && (
            <>
              <span
                className={cn(
                  "text-gray-400 opacity-100 block data-[state=checked]:opacity-0 data-[state=checked]:hidden transition-opacity",
                  sizeClasses[size].iconSize,
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span
                className={cn(
                  "text-current opacity-0 hidden data-[state=checked]:opacity-100 data-[state=checked]:block transition-opacity",
                  sizeClasses[size].iconSize,
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </>
          )}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  },
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
