
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <a className="flex items-center gap-3">
              <span className="font-fredoka text-2xl bg-black text-white ">Travel Mate</span>
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
                <Button className="bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                  SignUp
                </Button>
              </Link>
            </>
          )}
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    <a
                      className={cn(
                        "font-semibold py-2 px-4 rounded-lg transition-colors",
                        location === link.path 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-primary/5 hover:text-primary"
                      )}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {link.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
