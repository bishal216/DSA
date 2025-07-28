import { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  Menu,
  Search as SearchIcon,
  ArrowDownUp,
  Brackets,
  MessageSquareMore,
  ServerCrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Search from "@/components/partials/search";
import { FeedbackForm } from "@/components/partials/feedback";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { path: "algorithms", label: "Algorithms", icon: ArrowDownUp },
    { path: "data-structures", label: "Data Structures", icon: Brackets },
    { path: "common-problems", label: "Common Problems", icon: ServerCrash },
  ];

  return (
    <>
      <nav
        className="flex items-center justify-between p-2 w-full h-[80px] fixed top-0 z-50
        backdrop-blur border-b border-border primary-foreground"
      >
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-16">
              <div className="flex flex-col space-y-3">
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
                      activeClass="text-primary font-semibold"
                      spy
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <Icon className="size-4 mr-2" />
                        <span>{item.label}</span>
                      </Button>
                    </ScrollLink>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link to="/" aria-label="Go to Home">
          <img src="/logo.png" alt="DSAnotes Logo" className="w-28" />
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex space-x-1">
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
                activeClass="text-primary font-semibold"
                spy
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Button>
              </ScrollLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <SearchIcon className="h-5 w-5" />
          </Button>

          {/* Desktop Search */}
          <div className="hidden md:block w-48">
            <Search />
          </div>

          {/* Feedback (Desktop) */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-1"
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquareMore className="size-4 mr-1" />
            <span>Feedback</span>
          </Button>

          {/* Feedback (Mobile) */}
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquareMore className="size-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile Search Panel */}
      {searchOpen && (
        <div className="fixed top-[80px] left-0 right-0 z-40 bg-background p-4 md:hidden border-b border-border">
          <Search />
        </div>
      )}

      <FeedbackForm
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
