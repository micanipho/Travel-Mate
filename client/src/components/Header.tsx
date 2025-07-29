
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" }
    
  ];

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <a className="flex items-center gap-3">
              <span className="font-fredoka text-2xl text-primary ">Travel Mate</span>
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
