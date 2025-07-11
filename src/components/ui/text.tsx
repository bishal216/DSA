import { cn } from "@/utils/helpers";
import { HTMLAttributes } from "react";

interface TextProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  label: string;
}

export default function Text({ className, label, ...props }: TextProps) {
  return (
    <div
      {...props}
      className={cn(
        "text-transparent bg-linear-to-br from-primary to-primary hover:to-base bg-clip-text",
        className,
      )}
    >
      {label}
    </div>
  );
}
