import { BookOpen, Instagram, Twitter, Mail } from "lucide-react";
import { FeedbackForm } from "@/components/partials/feedback";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquareMore } from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="bg-muted/50 border-t border-border" id="contact">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-sm">
                  <BookOpen className="h-6 w-6 text-muted" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  DSANotes
                </span>
              </div>
              <p className="text-muted-foreground mb-4 w-full">
                Making data structures and algorithms accessible through
                interactive visualizations and comprehensive educational
                content.
              </p>
              <ul className="flex gap-0">
                {[
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
                ].map(({ name, href, Icon }) => (
                  <li
                    key={name}
                    className="w-12 h-12 p-0 rounded-lg  hover:bg-accent transition-colors"
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full h-full"
                      aria-label={name}
                    >
                      <Icon className="w-8 h-8 text-muted-foreground hover:text-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="col-span-1 md:col-span-1">
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

            {/* Contact */}
            <div className="col-span-1 md:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Contact Us
              </h3>

              <p className="text-muted-foreground">
                Have questions or feedback? We'd love to hear from you!
              </p>

              <div className="flex flex-col space-y-4">
                <Button
                  onClick={() => setFeedbackOpen(true)}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                  aria-label="Open feedback form"
                >
                  <MessageSquareMore className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>

                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">Or email us at:</span>
                  <Link
                    to="mailto:support@dsanotes.com"
                    className="flex items-center text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                    aria-label="Email support"
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    support@dsanotes.com
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-md">
              © {currentYear} DSANotes. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-md transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-md transition-colors"
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
