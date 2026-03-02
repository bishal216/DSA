import { FeedbackForm } from "@/components/partials/feedback";
import { Button } from "@/components/ui/button";
import { legalLinks, quickLinks, socialLinks } from "@/config/footer-config";
import { Mail, MessageSquareMore } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const isExternal = (href: string) =>
  href.startsWith("http") || href.startsWith("mailto:");

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const id = href.replace("/#", "");

    const scrollToId = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    if (location.pathname !== "/") {
      void navigate("/");
      setTimeout(scrollToId, 100);
    } else {
      scrollToId();
    }
  };

  return (
    <>
      <footer
        className="bg-primary border-t border-border text-dark"
        id="contact"
      >
        <div className="container mx-auto pt-8 pb-4">
          {/* Main grid — items-stretch so all columns are equal height */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-stretch">
            {/* Brand — logo fills the full column height */}
            <div className="col-span-1 md:col-span-2 flex items-stretch gap-6">
              {/* Logo container with fixed height - now fits within max-h-48 */}
              <div className="shrink-0 h-48">
                {" "}
                {/* ← changed from self-stretch to h-16 */}
                <img
                  src="logo.png"
                  alt="DSANotes Logo"
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Text + socials fill remaining width */}
              <div className="flex flex-col justify-between space-y-4">
                <p className="text-dark max-w-md text-xl">
                  Making data structures and algorithms accessible through
                  interactive visualizations and comprehensive educational
                  content.
                </p>

                <ul className="flex gap-2">
                  {socialLinks.map(({ name, href, Icon }) => (
                    <li
                      key={name}
                      className="w-12 h-12 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-full"
                        aria-label={name}
                      >
                        <Icon className="w-6 h-6 text-dark hover:text-light" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/#") ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleAnchorLink(e, link.href)}
                        className="text-foreground/80 hover:text-primary-dark transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : isExternal(link.href) ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
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
            <div className="col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-dark">Contact Us</h3>
              <p className="text-dark">
                Have questions or feedback? We&apos;d love to hear from you!
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
                  <a
                    href="mailto:support@dsanotes.com"
                    className="flex items-center text-dark hover:text-light transition-colors underline underline-offset-4"
                    aria-label="Email support"
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    support@dsanotes.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark text-sm">
              &copy; {currentYear} DSANotes. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {legalLinks.map((link) => (
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
