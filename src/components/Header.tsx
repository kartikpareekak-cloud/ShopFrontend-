import { ShoppingCart, MessageCircle, Instagram, Search, Menu, User, LogOut, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import AdvancedSearch from "@/components/AdvancedSearch";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearch?: (query: string) => void;
}

const Header = ({ cartItemCount, onCartClick, onSearch }: HeaderProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Horns & Sounds",
    "Auxiliary Lights", 
    "Modifications",
    "Accessories",
    "Wheels",
    "Switches",
    "Hot Deals"
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAdvancedSearch = (query: string, filters?: any) => {
    // Advanced search with filters
    const searchParams = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          searchParams.set(key, Array.isArray(value) ? value.join(',') : value.toString());
        }
      });
    }
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Top bar with shipping info */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          Free shipping on orders over ₹999
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-automotive">Panditji.shop</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => navigate('/')}
                    className="text-sm font-medium cursor-pointer hover:text-automotive transition-colors"
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Shop Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50 bg-background border shadow-lg">
                    <div className="grid w-[400px] gap-2 p-4 bg-background">
                      {categories.map((category) => (
                        <NavigationMenuLink
                          key={category}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          <div className="text-sm font-medium leading-none text-automotive">
                            {category}
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => navigate('/about')}
                    className="text-sm font-medium cursor-pointer hover:text-automotive transition-colors"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => navigate('/contact')}
                    className="text-sm font-medium cursor-pointer hover:text-automotive transition-colors"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Advanced Search */}
            <div className="hidden md:block">
              <AdvancedSearch 
                onSearch={handleAdvancedSearch}
                placeholder="Find Parts For Vehicle"
                className="w-80"
              />
            </div>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <User className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}

            {/* WhatsApp */}
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:bg-green-50"
              onClick={() => window.open('https://wa.me/9034667768', '_blank')}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Instagram */}
            <Button
              variant="ghost"
              size="icon"
              className="text-pink-600 hover:bg-pink-50"
              onClick={() => window.open('https://instagram.com', '_blank')}
            >
              <Instagram className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Find Parts For Vehicle"
                      className="pl-10"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                  </form>

                  {/* Mobile User Actions */}
                  {user ? (
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => navigate('/orders')}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Button>
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => navigate('/admin')}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </Button>
                      <Button 
                        className="w-full"
                        onClick={() => navigate('/register')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Navigation</h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate('/')}
                      >
                        Home
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate('/about')}
                      >
                        About Us
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate('/contact')}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant="ghost"
                          className="w-full justify-start text-left"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 flex space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-green-600"
                      onClick={() => window.open('https://wa.me/9034667768', '_blank')}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-pink-600"
                      onClick={() => window.open('https://instagram.com', '_blank')}
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
