import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Building2, Users, Crown, LogOut, Calendar, Rss, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GHL } from '@/lib/ghlConfig';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
      description: "See you next time!"
    });
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Community', path: '/community' },
    { name: 'Membership', path: '/membership' }
  ];

  if (GHL.CONTACT_FORM_URL || GHL.CALENDAR_URL) {
    navItems.splice(3, 0, { name: 'Contact', path: '/contact' });
  }

  const isActive = (path) => location.pathname === path || (path === '/messages' && location.pathname.startsWith('/messages'));

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Building2 className="h-8 w-8 text-yellow-gold" />
              <span className="text-xl font-bold gradient-text font-heading">
                BizLink Alliance
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${
                  isActive(item.path)
                    ? 'text-yellow-gold bg-yellow-gold/10'
                    : 'text-light-grey hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                 <Link to="/messages" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${isActive('/messages') ? 'text-yellow-gold bg-yellow-gold/10' : 'text-light-grey hover:text-white hover:bg-white/5'}`}>
                  <MessageCircle className="h-5 w-5" />
                </Link>
                {user.user_metadata?.membership_type === 'board' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-yellow-gold text-yellow-gold hover:bg-yellow-gold/10 font-body">
                      <Crown className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="font-body">
                    <Users className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="font-body">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-body">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="sacramento-gradient font-body">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${
                    isActive(item.path)
                      ? 'text-yellow-gold bg-yellow-gold/10'
                      : 'text-light-grey hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/10">
                  <Link to="/messages" onClick={() => setIsOpen(false)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${isActive('/messages') ? 'text-yellow-gold bg-yellow-gold/10' : 'text-light-grey hover:text-white hover:bg-white/5'}`}>
                    Messages
                  </Link>
                  {user.user_metadata?.membership_type === 'board' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full border-yellow-gold text-yellow-gold font-body">
                        <Crown className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full font-body">
                      <Users className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full font-body">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/10">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full font-body">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full sacramento-gradient font-body">
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;