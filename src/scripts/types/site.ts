export interface SiteConfig {
  siteId: string;
  siteTitle: string;
  siteSubtitle: string;
  siteBasePath: string;
  siteUrl: string;
  authorName: string;
  repositoryUrl: string;
  customDomain: string;
  defaultLanguage: string;
  copyrightText: string;
}

export interface SeoConfig {
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  defaultKeywords: string[];
}

export interface FooterSection {
  id: string;
  title: string;
  links: import('./navigation.js').NavigationItem[];
}

export interface FooterConfig {
  footerSections: FooterSection[];
  legalText: string;
}
