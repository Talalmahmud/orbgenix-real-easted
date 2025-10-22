"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Building2,
  BuildingIcon,
} from "lucide-react";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      title: "Users",
      icon: <Users className="w-5 h-5" />,
      sublinks: [
        {
          name: "Agency",
          href: "/dashboard/agencies",
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          name: "Agent",
          href: "/dashboard/agent",
          icon: <BuildingIcon className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
    },
  ];

  const isActive = (href?: string) =>
    href && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3  bg-white">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          {/* Mobile Sidebar Sheet */}
          <SheetContent side="left" className="p-0 w-64">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Admin Dashboard</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-y-auto p-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.sublinks ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenSubmenu(
                            openSubmenu === item.title ? null : item.title
                          )
                        }
                        className={clsx(
                          "flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 transition",
                          openSubmenu === item.title && "bg-gray-100"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <ChevronDown
                          className={clsx(
                            "w-4 h-4 transition-transform",
                            openSubmenu === item.title && "rotate-180"
                          )}
                        />
                      </button>

                      {openSubmenu === item.title && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.sublinks.map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.href}
                              className={clsx(
                                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition",
                                isActive(sub.href)
                                  ? "bg-indigo-100 text-indigo-700 font-medium"
                                  : "hover:bg-gray-50 text-gray-700"
                              )}
                            >
                              {sub.icon}
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={clsx(
                        "flex items-center gap-3 p-2 rounded-md transition",
                        isActive(item.href)
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "hidden md:flex flex-col border-r bg-white min-h-screen transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 ">
          {!collapsed && <h1 className="text-xl font-semibold">Admin</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronRight
              className={clsx(
                "w-5 h-5 transition-transform",
                collapsed && "-rotate-180"
              )}
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.sublinks ? (
                <>
                  <button
                    onClick={() =>
                      setOpenSubmenu(
                        openSubmenu === item.title ? null : item.title
                      )
                    }
                    className={clsx(
                      "flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 transition",
                      openSubmenu === item.title && "bg-gray-100"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={clsx(
                          "w-4 h-4 transition-transform",
                          openSubmenu === item.title && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {openSubmenu === item.title && !collapsed && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.sublinks.map((sub, i) => (
                        <Link
                          key={i}
                          href={sub.href}
                          className={clsx(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition",
                            isActive(sub.href)
                              ? "bg-indigo-100 text-indigo-700 font-medium"
                              : "hover:bg-gray-50 text-gray-700"
                          )}
                        >
                          {sub.icon}
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={clsx(
                    "flex items-center gap-3 p-2 rounded-md transition",
                    isActive(item.href)
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  {item.icon}
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-center text-sm text-gray-500">
          {!collapsed && <p>© 2025 Admin Panel</p>}
        </div>
      </aside>
    </>
  );
}
