"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  isLogout?: boolean;
}

interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  position?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const baseMenuItems: MenuItem[] = [
    {
      name: "หน้าหลัก",
      href: "/",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "ลงทะเบียนผู้ใช้งาน",
      href: "/userregistration",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "ขอใช้บริการ",
      href: "/userrequest",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "รายงานความเสี่ยง",
      href: "/riskreport",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  const authMenuItem: MenuItem = user
    ? {
        name: "ออกจากระบบ",
        isLogout: true,
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        ),
      }
    : {
        name: "เข้าสู่ระบบ",
        href: "/login",
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        ),
      };

  const menuItems = [...baseMenuItems, authMenuItem];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <svg className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-300 z-40",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={cn("flex-shrink-0 transition-all duration-300", isCollapsed ? "h-10 w-10" : "h-12 w-12")}>
                <div className="rounded-lg overflow-hidden shadow">
                  <Image
                    src="/logo.jpg"
                    alt="โรงพยาบาลแพร่"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    ศูนย์คอมพิวเตอร์
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    โรงพยาบาลแพร่
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block absolute -right-3 top-6 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg
                className={cn("h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform", isCollapsed && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = item.href && pathname === item.href;
                const isLogoutItem = item.isLogout;
                
                return (
                  <li key={item.href || `item-${index}`}>
                    {isLogoutItem ? (
                      <button
                        onClick={handleLogout}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          "text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400",
                          isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <span className="transition-colors">
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="text-sm truncate">{item.name}</span>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={() => window.innerWidth < 1024 && setIsCollapsed(true)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
                          isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <span className={cn(isActive && "text-blue-600 dark:text-blue-400")}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="text-sm truncate">{item.name}</span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {!isCollapsed && user && (
              <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {/* Profile Picture Placeholder */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                    </div>
                  </div>
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user.firstname} {user.lastname}
                    </p>
                    {user.position && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {user.position}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!isCollapsed && (
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                <p>© 2026 โรงพยาบาลแพร่</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
