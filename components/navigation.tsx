"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, BookOpen, Menu, X, User, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Settings },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/docs", label: "Documentation", icon: BookOpen },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="bg-black sticky top-0 z-50">
        <div className="container mx-auto container-padding">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src="/images/devil-logo.png"
                    alt="GitHub Auto Committer"
                    className="w-12 h-12"
                  />
                </div>
              </div>
              <div>
                <span className="text-white font-black text-2xl">GITHUB</span>
                <span className="text-red-500 font-black text-2xl block leading-none">
                  AUTO COMMITTER
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    size="lg"
                    className={`${
                      isActive
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "text-white hover:bg-red-500 hover:text-white"
                    } transition-all duration-300 font-bold text-lg px-6 py-3`}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-red-500 font-bold text-lg px-6 py-3"
                    >
                      <User className="h-5 w-5 mr-2" />
                      {userProfile?.displayName || "User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-2 border-red-500">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="font-bold">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="font-bold text-red-500"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowLoginForm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-6 py-3"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-red-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-6 border-t border-red-500">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className={`${
                        isActive
                          ? "bg-red-500 text-white"
                          : "text-white hover:bg-red-500"
                      } justify-start w-full font-bold text-lg`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}

                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start w-full text-red-500 hover:bg-red-500 hover:text-white font-bold text-lg"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowLoginForm(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Form Modal */}
      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
    </>
  );
}
