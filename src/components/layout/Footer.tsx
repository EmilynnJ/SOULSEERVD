import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="glass-effect mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="alex-brush text-2xl pink-text mb-4">SoulSeer</h3>
            <p className="text-sm text-gray-300">
              Connect with gifted psychics for guidance on love, career, and spiritual growth.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/readings" className="text-gray-300 hover:text-primary">Book a Reading</Link></li>
              <li><Link to="/live-streams" className="text-gray-300 hover:text-primary">Live Streams</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-primary">Spiritual Shop</Link></li>
              <li><Link to="/community" className="text-gray-300 hover:text-primary">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-300 hover:text-primary">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-primary">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/policies/terms" className="text-gray-300 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/policies/privacy" className="text-gray-300 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/policies/refund" className="text-gray-300 hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SoulSeer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}