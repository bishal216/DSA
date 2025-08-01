import { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  Search as SearchIcon,
  ArrowDownUp,
  Brackets,
  ServerCrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Search from "@/components/partials/search";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { path: "algorithms", label: "Algorithms", icon: ArrowDownUp },
    { path: "data-structures", label: "Data Structures", icon: Brackets },
    { path: "common-problems", label: "Common Problems", icon: ServerCrash },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary backdrop-blur ">
      <div className="container mx-auto">
        <div className=" flex h-16 items-center justify-between px-4">
          {/* Left section - Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold logo"
              aria-label="Go to Home"
            >
              DSANotes
            </Link>
          </div>

          {/* Center section - Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-0 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <ScrollLink
                  key={item.path}
                  to={item.path}
                  smooth
                  duration={500}
                  offset={-80}
                  className="cursor-pointer h-full"
                  activeClass="text-primary-light bg-primary-dark"
                  spy
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    rounded={"none"}
                    className="flex items-center gap-2 px-4 text-sm font-medium transition-colors hover:text-primary-dark h-full"
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Button>
                </ScrollLink>
              );
            })}
          </div>

          {/* Right section - Search */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {/* Desktop Search */}
            <div className="hidden md:block w-120 h-full">
              <Search />
            </div>
          </div>
        </div>

        {/* Mobile Search Panel */}
        {searchOpen && (
          <div className="absolute top-16 left-0 right-0 z-40 border-t border-border bg-primary p-4 shadow-md md:hidden">
            <Search onSearch={() => setSearchOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  );
}
