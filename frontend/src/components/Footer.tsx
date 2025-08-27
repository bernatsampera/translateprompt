import {Globe, Heart} from "lucide-react";
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
        <p className="text-xs opacity-50 mt-2">
          {madeWithText} <Heart className="h-3 w-3 inline text-red-500" /> for
          global communication
        </p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link link-hover text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
