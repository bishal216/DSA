import { LucideIcon } from "lucide-react";
export interface SectionItem {
  type: string;
  title: string;
  icon: LucideIcon;
  path: string;
  tags: Array<string>;
}

export interface SectionProps {
  title: string;
  items: SectionItem[];
  sectionID: string;
}
