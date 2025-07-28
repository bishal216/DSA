// types/interfaces.ts
import { ComponentType } from "react";
import { LucideIcon } from "lucide-react";

export type RouteConfig = {
  title: string;
  description: string;
  path: `/${string}`;
  id: string;
  icon: LucideIcon;
  type: string;
  status: "active" | "in-development" | "beta";
  pageComponent: ComponentType;
  tags: readonly string[];
  features: string[];
};
