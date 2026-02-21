import {
  social_links,
  quick_links,
  legal_links,
} from "@/context/footer_config";
import { Mail } from "lucide-react";
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
      <footer className="bg-primary border-t border-border" id="contact">
        <div className="container mx-auto pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="logo_h.png" alt="DSANotes Logo" className="h-16" />
              </div>
              <p className="text-dark mb-4 w-full">
                Making data structures and algorithms accessible through
                interactive visualizations and comprehensive educational
                content.
              </p>
              <ul className="flex gap-0">
                {social_links.map(({ name, href, Icon }) => (
                  <li
                    key={name}
                    className="w-12 h-12 p-0 rounded-lg  hover:bg-primary-dark transition-colors"
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full h-full"
                      aria-label={name}
                    >
                      <Icon className="w-8 h-8 text-dark hover:text-light" />
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
                {quick_links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('http') || link.href.startsWith('mailto:') || link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        className="text-foreground/80 hover:text-primary-dark transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-foreground/80 hover:text-primary-dark transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-1 md:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-dark">Contact Us</h3>

              <p className="text-dark">
                Have questions or feedback? We'd love to hear from you!
              </p>

              <div className="flex flex-col space-y-4">
                <Button
                  onClick={() => setFeedbackOpen(true)}
                  variant="dark"
                  size="sm"
                  className="w-full sm:w-auto"
                  aria-label="Open feedback form"
                >
                  <MessageSquareMore className="mr-2 h-4 w-4" />
                  Send Feedback
                </Button>

                <div className="flex items-center text-sm text-dark">
                  <span className="mr-2">Or email us at:</span>
                  <Link
                    to="mailto:support@dsanotes.com"
                    className="flex items-center text-dark hover:text-light transition-colors underline underline-offset-4"
                    aria-label="Email support"
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    support@dsanotes.com
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark text-sm">
              © {currentYear} DSANotes. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {legal_links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-dark hover:text-light text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
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
