import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', 'aria-label': 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', 'aria-label': 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com', 'aria-label': 'Facebook' },
  ];

  const footerLinks = [
    { title: 'About Us', href: '#' },
    { title: 'Contact', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Terms of Service', href: '#' },
  ];

  return (
    <footer className="bg-black/20 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-yellow-gold" />
              <span className="text-xl font-bold gradient-text">
                BizLink Alliance
              </span>
            </Link>
            <p className="text-light-grey text-sm">
              Connecting Sacramento's premier businesses for growth and collaboration.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link['aria-label']}
                  className="text-light-grey hover:text-yellow-gold transition-colors"
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                  <p className="font-semibold text-white tracking-wider uppercase">Navigate</p>
                  <ul className="mt-4 space-y-2">
                      <li><Link to="/directory" className="text-light-grey hover:text-white text-sm">Directory</Link></li>
                      <li><Link to="/events" className="text-light-grey hover:text-white text-sm">Events</Link></li>
                      <li><Link to="/blog" className="text-light-grey hover:text-white text-sm">Blog</Link></li>
                      <li><Link to="/community" className="text-light-grey hover:text-white text-sm">Community</Link></li>
                  </ul>
              </div>
              <div>
                  <p className="font-semibold text-white tracking-wider uppercase">Membership</p>
                  <ul className="mt-4 space-y-2">
                      <li><Link to="/membership" className="text-light-grey hover:text-white text-sm">Plans</Link></li>
                      <li><Link to="/register" className="text-light-grey hover:text-white text-sm">Join Now</Link></li>
                      <li><Link to="/login" className="text-light-grey hover:text-white text-sm">Login</Link></li>
                  </ul>
              </div>
              <div>
                  <p className="font-semibold text-white tracking-wider uppercase">Resources</p>
                  <ul className="mt-4 space-y-2">
                      <li><a href="#" className="text-light-grey hover:text-white text-sm">FAQ</a></li>
                      <li><a href="#" className="text-light-grey hover:text-white text-sm">Support</a></li>
                  </ul>
              </div>
              <div>
                  <p className="font-semibold text-white tracking-wider uppercase">Legal</p>
                  <ul className="mt-4 space-y-2">
                      {footerLinks.slice(2).map(link => (
                          <li key={link.title}><a href={link.href} className="text-light-grey hover:text-white text-sm">{link.title}</a></li>
                      ))}
                  </ul>
              </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-dark-grey text-sm">
          <p>&copy; {new Date().getFullYear()} BizLink Alliance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;