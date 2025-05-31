import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import { CiMenuFries } from "react-icons/ci";
import Search from "../custom-ui/search";
import Text from "../custom-ui/text";
import { Button } from "../ui/button";
import { Brackets, ArrowDownUp, ServerCrash} from 'lucide-react';
export default function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
const navItems = [
  { path: '#data-structures', label: 'Data Structures', icon: Brackets },       // List fits Data Structures
  { path: '#algorithms', label: 'Algorithms', icon: ArrowDownUp },             // RotateCw suggests process or cycle = Algorithms
  { path: '#common-problems', label: 'Common Problems', icon: ServerCrash },
];


return (
  <nav
    className={`flex items-center justify-between p-2 w-full h-[80px] top-0 fixed z-10
      bg-transparent border-b border-gray-300 dark:border-gray-700
      transition-colors duration-300
      ${hasScrolled ? "backdrop-blur bg-white/30 dark:bg-black/30" : ""}`}
  >
    <Link to="/">
      <h1>
        <Text label="DSAnotes" className="text-xl font-bold text-gray-800 dark:text-gray-200" />
      </h1>
    </Link>

    <div className="hidden md:flex space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a key={item.path} href={item.path} className="no-underline">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          </a>
        );
      })}
    </div>

    <div className="hidden md:flex items-center gap-2">
      <Search />
      <Link to="/">
        <Button variant="outline" className="text-gray-800 dark:text-gray-200">
          Back to Home
        </Button>
      </Link>
    </div>
  </nav>
);

}
