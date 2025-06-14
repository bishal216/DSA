// types/interfaces.ts
import { ComponentType } from "react";
import { LucideIcon } from "lucide-react";

export type RouteConfig = {
  title: string;
  path: `/${string}`;
  icon: LucideIcon;
  type: string;
  pageComponent: ComponentType;
  tags: readonly string[];
};
