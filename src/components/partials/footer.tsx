import { BookOpen, Instagram, Twitter, Mail } from "lucide-react";
import { FeedbackForm } from "@/components/partials/feedback";
import { useState } from "react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="bg-muted/50 border-t border-border" id="contact">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <BookOpen className="h-6 w-6 text-muted" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  DSANotes
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Making data structures and algorithms accessible through
                interactive visualizations and comprehensive educational
                content.
              </p>
              <ul className="flex space-x-4">
                {[
                  {
                    name: "Instagram",
                    href: "https://www.instagram.com/dsanotesbydsanotes/",
                    Icon: Instagram,
                  },
                  {
                    name: "Twitter",
                    href: "https://twitter.com/yourprofile",
                    Icon: Twitter,
                  },
                  {
                    name: "Mail",
                    href: "mailto:support@dsanotes.com",
                    Icon: Mail,
                  },
                ].map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-background hover:bg-accent transition-colors"
                      aria-label={name}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Home", href: "/" },
                  { name: "Algorithms", href: "#algorithms" },
                  { name: "Data Structures", href: "#data-structures" },
                  { name: "Common Problems", href: "#common-problems" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} DSANotes. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
      <FeedbackForm
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
};

export default Footer;
