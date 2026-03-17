export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  title: string;
  order: number;
  children?: NavigationItem[];
}

export interface FamilyNavGroup {
  familyId: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  primaryNav: NavigationItem[];
  familyNav: FamilyNavGroup[];
}
