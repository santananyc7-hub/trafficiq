import {
  LayoutDashboard,
  Route,
  Map,
  Megaphone,
  Handshake,
  GitBranch,
  Users,
  Target,
  FileBarChart,
  Plug,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary product navigation. */
export const NAV: NavItem[] = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Acquisition", href: "/acquisition", icon: Route },
  { label: "Traffic Map", href: "/traffic-map", icon: Map },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Partners", href: "/partners", icon: Handshake },
  { label: "Attribution", href: "/attribution", icon: GitBranch },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Opportunities", href: "/opportunities", icon: Target },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

/** Secondary navigation (below the divider). */
export const NAV_SECONDARY: NavItem[] = [
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const STORES = [
  { id: "all", name: "All locations", sub: "3 stores" },
  { id: "midtown", name: "Midtown Manhattan", sub: "350 5th Ave" },
  { id: "williamsburg", name: "Williamsburg", sub: "184 Bedford Ave" },
  { id: "lic", name: "Long Island City", sub: "27 Jackson Ave" },
] as const;
