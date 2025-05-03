import { Link } from "react-router-dom";
import { Menu, X, User, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Simple auth placeholder - no reference to fine
  const userSession = null; // TODO: Implement authentication
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative z-50 w-full glass-effect">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="alex-brush text-4xl md:text-5xl header-glow">SoulSeer</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6">
              <Link to="/" className="text-white hover:text-primary">Home</Link>
              <Link to="/readers" className="text-white hover:text-primary">Readers</Link>
              <Link to="/live-streams" className="text-white hover:text-primary">Live Streams</Link>
              <Link to="/shop" className="text-white hover:text-primary">Shop</Link>
              <Link to="/community" className="text-white hover:text-primary">Community</Link>
              <Link to="/messages" className="text-white hover:text-primary">Messages</Link>
              <Link to="/dashboard" className="text-white hover:text-primary">Dashboard</Link>
              <Link to="/help" className="text-white hover:text-primary">Help</Link>
              <Link to="/profile" className="text-white hover:text-primary">Profile</Link>
              <Link to="/policies" className="text-white hover:text-primary">Policies</Link>
              <Link to="/about" className="text-white hover:text-primary">About</Link>
            </div>
            
            {userSession?.user ? (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => navigate('/logout')}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-primary hover:bg-transparent"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  <span>Sign In</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-white focus:outline-none" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect absolute w-full">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-white hover:text-primary">Home</Link>
            <Link to="/readers" className="block text-white hover:text-primary">Readers</Link>
            <Link to="/live-streams" className="block text-white hover:text-primary">Live Streams</Link>
            <Link to="/shop" className="block text-white hover:text-primary">Shop</Link>
            <Link to="/community" className="block text-white hover:text-primary">Community</Link>
            <Link to="/messages" className="block text-white hover:text-primary">Messages</Link>
            <Link to="/dashboard" className="block text-white hover:text-primary">Dashboard</Link>
            <Link to="/help" className="block text-white hover:text-primary">Help</Link>
            <Link to="/profile" className="block text-white hover:text-primary">Profile</Link>
            <Link to="/policies" className="block text-white hover:text-primary">Policies</Link>
            <Link to="/about" className="block text-white hover:text-primary">About</Link>
            
            {userSession?.user ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    navigate('/logout');
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full text-white hover:text-primary hover:bg-transparent justify-start"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  <span>Sign In</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}