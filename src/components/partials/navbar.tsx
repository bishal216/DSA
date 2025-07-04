import { Link } from "react-router-dom";
import { useState } from "react";
import Search from "@/components/ui/search";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "@/components/partials/feedback";
import {
  ArrowDownUp,
  Brackets,
  MessageSquareMore,
  ServerCrash,
} from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

export default function Navbar() {
  const navItems = [
    {
      path: "algorithms",
      label: "Algorithms",
      icon: ArrowDownUp,
    },
    {
      path: "data-structures",
      label: "Data Structures",
      icon: Brackets,
    },
    {
      path: "common-problems",
      label: "Common Problems",
      icon: ServerCrash,
    },
  ];

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <nav
        className={`flex items-center justify-between p-2 w-full h-[80px] fixed top-0 z-10
        backdrop-blur
        border-b border-gray-300
        transition-colors duration-300`}
      >
        {/* Logo and Home Link */}
        <Link to="/" aria-label="Go to Home">
          <h1>
            <Text
              label="DSAnotes"
              className="text-xl font-bold text-gray-800"
            />
          </h1>
        </Link>

        {/* Navigation Links - visible on md and up */}
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <ScrollLink
                key={item.path}
                to={item.path}
                smooth={true}
                duration={500}
                offset={-80} // offset for fixed navbar height
                className="no-underline cursor-pointer"
                activeClass="text-violet-600  font-semibold"
                spy={true}
                aria-label={`Scroll to ${item.label}`}
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

        {/* Search and Home Button */}
        <div className="flex items-center gap-2">
          {/* Search hidden on small screens */}
          <div className="hidden md:block">
            <Search />
          </div>

          {/* Home button always visible */}
          <Button
            variant="outline"
            size="sm"
            className="text-gray-800 flex items-center gap-1"
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquareMore className="size-4 mr-1" />
            <span>Feedback</span>
          </Button>
        </div>
      </nav>
      <FeedbackForm
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}
