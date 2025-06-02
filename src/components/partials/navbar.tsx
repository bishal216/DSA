import { Link } from "react-router-dom";
import Search from "../custom-ui/search";
import Text from "../custom-ui/text";
import { Button } from "../ui/button";
import { iconMap } from "@/context/iconmap";
// import { Brackets, ArrowDownUp, ServerCrash } from 'lucide-react';
// @ts-expect-error available at build time
const BASE = typeof __BASE__ !== "undefined" ? __BASE__ : "";

export default function Navbar() {
  const navItems = [
    {
      path: `${BASE}/#data-structures`,
      label: "Data Structures",
      icon: iconMap.Brackets,
    },
    {
      path: `${BASE}//#algorithms`,
      label: "Algorithms",
      icon: iconMap.ArrowDownUp,
    },
    {
      path: `${BASE}//#common-problems`,
      label: "Common Problems",
      icon: iconMap.ServerCrash,
    },
  ];

  return (
    <nav
      className={`flex items-center justify-between p-2 w-full h-[80px] fixed top-0 z-10
    backdrop-blur bg-violet-100/70 dark:bg-violet-900/30
    border-b border-gray-300 dark:border-gray-700
    transition-colors duration-300`}
    >
      <Link to="/">
        <h1>
          <Text
            label="DSAnotes"
            className="text-xl font-bold text-gray-800 dark:text-gray-200"
          />
        </h1>
      </Link>

      <div className="hidden md:flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.path} href={item.path} className="no-underline">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {/* Search stays hidden on small screens */}
        <div className="hidden md:block">
          <Search />
        </div>

        {/* Back to Home always visible */}
        <Link to="/">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-800 dark:text-gray-200"
          >
            <iconMap.HomeIcon className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
