"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiFileText, FiMail, FiBriefcase, FiLogOut, FiMenu, FiX, FiBarChart2 } from "react-icons/fi";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: FiHome
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: FiBriefcase
    },
    {
      name: "Resume",
      path: "/admin/resume",
      icon: FiFileText
    },
    {
      name: "Statistics",
      path: "/admin/stats",
      icon: FiBarChart2
    },
    {
      name: "Contact",
      path: "/admin/contact",
      icon: FiMail
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-[#1a1a1a] border-b border-accent/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">A</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">Admin Panel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    pathname === link.path
                      ? "bg-accent text-primary font-semibold"
                      : "text-white/80 hover:text-accent hover:bg-accent/10"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* View Site Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:block text-sm text-white/60 hover:text-accent transition-colors"
            >
              View Site →
            </Link>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2"
            >
              <FiLogOut />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl text-white"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-accent/20">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      pathname === link.path
                        ? "bg-accent text-primary font-semibold"
                        : "text-white/80 hover:bg-accent/10"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-accent/20 my-2"></div>
              <Link
                href="/"
                target="_blank"
                className="px-4 py-3 text-white/60 hover:text-accent"
              >
                View Site →
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <FiLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNav;
