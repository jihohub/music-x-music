"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoCompass,
  IoCompassOutline,
  IoFlame,
  IoFlameOutline,
  IoHome,
  IoHomeOutline,
  IoPerson,
  IoPersonOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

export default function Footer() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "홈",
      path: "/",
      icon: <IoHomeOutline size={24} />,
      activeIcon: <IoHome size={24} />,
    },
    {
      name: "검색",
      path: "/search",
      icon: <IoSearchOutline size={24} />,
      activeIcon: <IoSearch size={24} />,
    },
    {
      name: "트렌드",
      path: "/trend",
      icon: <IoFlameOutline size={24} />,
      activeIcon: <IoFlame size={24} />,
    },
    {
      name: "신곡",
      path: "/new",
      icon: <IoCompassOutline size={24} />,
      activeIcon: <IoCompass size={24} />,
    },
    {
      name: "프로필",
      path: "/profile",
      icon: <IoPersonOutline size={24} />,
      activeIcon: <IoPerson size={24} />,
    },
  ];

  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-50 bg-background border-t border-border-color"
      style={{ backgroundColor: "var(--background)" }}
    >
      <nav className="container">
        <ul className="flex h-16 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path} className="flex-1">
                <Link
                  href={item.path}
                  className={`flex flex-col items-center justify-center gap-1 h-full ${
                    isActive
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {isActive ? item.activeIcon : item.icon}
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
