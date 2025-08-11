"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Role } from "@/lib/types";
import { 
  Bot, 
  Calendar, 
  FileText, 
  GraduationCap, 
  Home, 
  LineChart, 
  Users, 
  Wallet, 
  Settings, 
  CircleSlash, 
  Plane, 
  UserCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navItems: NavItem[] = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      roles: ["admin", "teacher", "upper-management", "high-level-dashboard"] as Role[], 
      icon: Home 
    },
    { 
      href: "/dashboard/requests", 
      label: "Requests", 
      roles: ["admin", "upper-management", "high-level-dashboard"] as Role[], 
      icon: FileText 
    },
    { 
      href: "/dashboard/students", 
      label: "Students", 
      roles: ["admin", "teacher", "upper-management", "high-level-dashboard"] as Role[], 
      icon: GraduationCap 
    },
    { 
      href: "/dashboard/applicants", 
      label: "Applicants", 
      roles: ["admin"] as Role[], 
      icon: UserCheck 
    },
    { 
      href: "/dashboard/users", 
      label: "Users", 
      roles: ["admin", "high-level-dashboard"] as Role[], 
      icon: Users 
    },
    { 
      href: "/dashboard/semesters", 
      label: "Semesters", 
      roles: ["admin"] as Role[], 
      icon: Calendar 
    },
    { 
      href: "/dashboard/leaves", 
      label: "Leaves", 
      roles: ["admin"] as Role[], 
      icon: Plane 
    },
    { 
      href: "/dashboard/exclusions", 
      label: "Exclusions", 
      roles: ["admin"] as Role[], 
      icon: CircleSlash 
    },
    { 
      href: "/dashboard/payments", 
      label: "Payments", 
      roles: ["admin", "upper-management", "high-level-dashboard"] as Role[], 
      icon: Wallet 
    },
    { 
      href: "/dashboard/reports", 
      label: "Reports", 
      roles: ["admin", "upper-management", "high-level-dashboard"] as Role[], 
      icon: LineChart 
    },
    { 
      href: "/dashboard/settings", 
      label: "Settings", 
      roles: ["admin", "high-level-dashboard"] as Role[], 
      icon: Settings 
    },
  ];

  const userHasRole = (roles: Role[]): boolean => {
    return roles.includes(user.activeRole);
  };

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) =>
        userHasRole(item.roles) && (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}