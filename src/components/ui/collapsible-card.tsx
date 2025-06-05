import * as React from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import { iconMap } from "@/context/iconmap";

interface RadixCollapsibleCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const RadixCollapsibleCard = ({
  title,
  defaultOpen = false,
  children,
  className,
  ...props
}: RadixCollapsibleCardProps) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <Card className={cn("overflow-hidden", className)}>
        <CollapsibleTrigger asChild>
          <button
            className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
            aria-expanded={open}
          >
            <span className="text-lg font-semibold">{title}</span>
            <iconMap.ChevronDown
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              size={20}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default RadixCollapsibleCard;
