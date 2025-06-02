import { iconMap } from '@/context/iconmap';

// types.ts
export interface SectionItem {
  type: string;
  title: string;
  icon: keyof typeof iconMap;
  path: string;
  tags: Array<string>;
}

export interface SectionProps {
  title: string;
  items: SectionItem[];
  sectionID: string;
}