export interface NavItem {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  companyName: string;
  tagline: string;
  madeWithText: string;
  links: FooterLink[];
}
