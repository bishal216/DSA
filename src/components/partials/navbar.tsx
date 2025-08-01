import { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  Menu,
  Search as SearchIcon,
  ArrowDownUp,
  Brackets,
  ServerCrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Search from "@/components/partials/search";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { path: "algorithms", label: "Algorithms", icon: ArrowDownUp },
    { path: "data-structures", label: "Data Structures", icon: Brackets },
    { path: "common-problems", label: "Common Problems", icon: ServerCrash },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left section - Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] pt-16">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <ScrollLink
                        key={item.path}
                        to={item.path}
                        smooth
                        duration={500}
                        offset={-80}
                        className="cursor-pointer rounded-md"
                        activeClass="bg-accent text-accent-foreground"
                        spy
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Icon className="size-4 mr-2" />
                          <span>{item.label}</span>
                        </Button>
                      </ScrollLink>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold"
              aria-label="Go to Home"
            >
              <img
                src="/logo_h.png"
                alt="DSAnotes Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Center section - Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <ScrollLink
                  key={item.path}
                  to={item.path}
                  smooth
                  duration={500}
                  offset={-80}
                  className="cursor-pointer"
                  activeClass="text-primary"
                  spy
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    rounded={"none"}
                    className="flex items-center gap-2 px-4 text-sm font-medium transition-colors hover:text-secondary"
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
            <div className="hidden md:block w-64">
              <Search />
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Search Panel */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 border-t border-border bg-background p-4 shadow-md md:hidden">
          <Search onSearch={() => setSearchOpen(false)} />
        </div>
      )}
    </>
  );
}
