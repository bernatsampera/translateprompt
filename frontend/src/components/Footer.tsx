import {Globe} from "lucide-react";
import {Link} from "react-router-dom";
import type {FooterConfig} from "../types/navigation";

interface FooterProps extends FooterConfig {}

function Footer({companyName, tagline, madeWithText, links}: FooterProps) {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-6 w-6 text-primary" />
          <p className="font-bold text-lg">{companyName}</p>
        </div>
        <p className="text-sm opacity-70">{tagline}</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          {links.map((link) => {
            // Use Link for internal routes, a tag for external
            const isInternal = link.href.startsWith("/");

            if (isInternal) {
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="link link-hover text-sm"
                >
                  {link.label}
                </Link>
              );
            } else {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="link link-hover text-sm"
                >
                  {link.label}
                </a>
              );
            }
          })}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
