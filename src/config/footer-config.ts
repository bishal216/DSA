import { Instagram, Mail, Twitter, type LucideIcon } from "lucide-react";

export interface SocialLink {
  name: string;
  href: string;
  Icon: LucideIcon;
}

export interface NavLink {
  name: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/dsanotesbydsanotes/",
    Icon: Instagram,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/dsanotes",
    Icon: Twitter,
  },
  {
    name: "Mail",
    href: "mailto:support@dsanotes.com",
    Icon: Mail,
  },
];

export const quickLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Algorithms", href: "/#algorithms" },
  { name: "Data Structures", href: "/#data-structures" },
  { name: "Common Problems", href: "/#common-problems" },
];

export const legalLinks: NavLink[] = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
];
