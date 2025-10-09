
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from '@/assets/logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    ...(isAuthenticated ? [{ name: "Dashboard", path: "/dashboard" }] : [])
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="fixed w-full bg-white z-50" style={{ boxShadow: '0 5px 16px 5px #5555550f' }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={Logo} alt="" />
            </a>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a
                className={cn(
                  "font-semibold transition-colors relative group",
                  location === link.path ? "text-primary" : "hover:text-primary"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                  location === link.path ? "w-full" : "w-0 group-hover:w-full"
                )}></span>
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            // Authenticated user menu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:block">{user?.firstName || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <a className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      Dashboard
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="flex items-center gap-2 w-full">
                      <Settings className="h-4 w-4" />
                      Profile
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Guest user buttons
            <>
              <Link href="/login">
                <Button variant="outline" className="hidden md:block border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="hidden md:block bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                  SignUp
                </Button>
              </Link>
            </>
          )}

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild  >
              <Button variant="ghost" size="icon" className="md:hidden" >
                <Menu  className="text-[#a58100]" style={{width:'2rem',height:'2rem'}}/>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.path} href={link.path}
                    className="font-semibold px-4 rounded-lg transition-colors"
                    onClick={() => setIsSheetOpen(false)}>
                    {link.name}
                  </Link>
                ))}
                <Link href="/login" onClick={() => setIsSheetOpen(false)}
                  className="font-semibold  px-4 rounded-lg transition-colors"
                  hidden={isAuthenticated}
                >
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsSheetOpen(false)}
                  className="font-semibold  px-4 rounded-lg transition-colors"
                  hidden={isAuthenticated}
                >
                  Sign Up
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
