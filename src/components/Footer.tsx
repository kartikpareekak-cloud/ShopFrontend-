import { MessageCircle, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-automotive text-automotive-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Panditji Auto Connect</h3>
            <p className="text-automotive-foreground/80 mb-6 max-w-md">
              Your trusted partner for premium auto parts, accessories, and automotive solutions. 
              Quality guaranteed with fast delivery across India.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-green-400 hover:bg-green-400/10"
                onClick={() => window.open('https://wa.me/9876543210', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-pink-400 hover:bg-pink-400/10"
                onClick={() => window.open('https://instagram.com/panditjiautoconnect', '_blank')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-automotive-foreground/80">
              <li>
                <button 
                  onClick={() => navigate('/')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/about')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/search?q=horns')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Horns & Sounds
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/search?q=lights')} 
                  className="hover:text-primary transition-colors text-left"
                >
                  Auxiliary Lights
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-automotive-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@panditjiautoconnect.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span>123 Auto Parts Street, Sector 15, Noida, UP - 201301</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-automotive-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-automotive-foreground/60">
          <p>&copy; 2025 Panditji Auto Connect. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/privacy-policy')} 
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => navigate('/terms-of-service')} 
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="hover:text-primary transition-colors"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;