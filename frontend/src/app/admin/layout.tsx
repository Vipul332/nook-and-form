"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { adminAuthApi } from "@/lib/api";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Designs", href: "/admin/designs" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Services", href: "/admin/services" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "About", href: "/admin/about" },
  { label: "Office", href: "/admin/office" },
];

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean | null>(null);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    let cancelled = false;

    const verifyAdminSession = async () => {
      try {
        await adminAuthApi.me();

        if (!cancelled) {
          setIsAuthenticated(true);
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      }
    };

    void verifyAdminSession();

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2]">
        <p className="text-base font-medium text-[#171614]">
          Checking admin authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2]">
        <p className="text-base font-medium text-[#171614]">
          Redirecting to login...
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    adminAuthApi.logout();
    setIsAuthenticated(false);
    router.replace("/admin/login");
  };

  const isActive = (href: string) => {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#171614]">
      {/* =====================================================
          DESKTOP ADMIN SIDEBAR
      ====================================================== */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          flex-col
          border-r
          border-[#393632]
          bg-[#24221f]
          lg:flex
        "
      >
        {/* =================================================
            LOGO
        ================================================== */}
        <div className="shrink-0 border-b border-[#45413b] px-6 py-6">
          <Link
            href="/admin"
            className="text-xl font-bold tracking-tight text-white"
          >
            Interior Admin
          </Link>

          <p className="mt-1 text-xs font-medium text-[#d6d1ca]">
            Management Panel
          </p>

          {/* =================================================
              VIEW PUBLIC WEBSITE
          ================================================== */}
          <Link
            href="/"
            className="
              mt-5
              flex
              items-center
              justify-center
              rounded-lg
              border
              border-[#716b63]
              bg-transparent
              px-4
              py-2.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#e7e3dd]
              transition
              hover:border-[#aaa298]
              hover:bg-[#2c2a27]
              hover:text-white
            "
          >
            View Website
          </Link>
        </div>

        {/* =================================================
            DESKTOP NAVIGATION
            Only this area can scroll.
        ================================================== */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1.5">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white text-[#171614] shadow-sm"
                      : "text-[#e7e3dd] hover:bg-[#2c2a27] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            FIXED BOTTOM LOGOUT
            This stays at the bottom of the sidebar.
        ================================================== */}
        <div className="shrink-0 border-t border-[#45413b] bg-[#24221f] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              rounded-lg
              border
              border-[#716b63]
              bg-transparent
              px-4
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:border-[#aaa298]
              hover:bg-[#2c2a27]
            "
          >
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}
      <div className="min-h-screen lg:ml-64">
        <div className="flex min-h-screen flex-col bg-[#f7f5f2]">
          {/* =================================================
              HEADER
          ================================================== */}
          <header className="sticky top-0 z-30 border-b border-[#ded9d1] bg-white">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <h1 className="text-lg font-semibold text-[#171614]">
                Admin Panel
              </h1>

              {/* Mobile logout only */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-lg
                  border
                  border-[#c9c3ba]
                  bg-white
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-[#171614]
                  transition
                  hover:bg-[#f3f0eb]
                  lg:hidden
                "
              >
                Logout
              </button>
            </div>

            {/* =================================================
                MOBILE NAVIGATION
            ================================================== */}
            <div className="overflow-x-auto border-t border-[#ebe7e1] bg-white lg:hidden">
              <nav className="flex min-w-max gap-2 p-3">
                {navigation.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[#24221f] text-white"
                          : "bg-[#f0ede8] text-[#4b4741] hover:bg-[#e5e0d8]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
          ================================================== */}
          <main
            className="
              min-h-[calc(100vh-73px)]
              flex-1
              bg-[#f7f5f2]
              p-4
              text-[#171614]
              lg:p-8
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}