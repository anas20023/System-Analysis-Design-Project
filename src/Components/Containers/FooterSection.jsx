import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  Download,
  BookOpen,
  Users
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Featured Resources", href: "/resources/featured" },
      { name: "Categories", href: "/categories" },
      { name: "Upload Resource", href: "/upload" },
      { name: "Search", href: "/search" },
      { name: "Mobile App", href: "/download" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press Kit", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Data Processing", href: "/data-processing" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };


  const socialLinks = [
    { icon: Github, href: "https://github.com", name: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", name: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@cse-rsp.com", name: "Email" },
  ];

  return (
    <footer className="bg-slate-900 text-white">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col lg:w-1/4">
            <Link to="/" className="flex items-center mb-6">
              <span className="text-2xl font-bold font-[archivo] tracking-wide">
                [CSE-RSP]
              </span>
            </Link>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Empowering computer science students with high-quality educational resources,
              study materials, and a collaborative learning community.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center text-slate-300">
                <MapPin size={16} className="mr-3 text-slate-400" />
                <span className="text-sm">Computer Science Department, University Campus</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Phone size={16} className="mr-3 text-slate-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail size={16} className="mr-3 text-slate-400" />
                <span className="text-sm">support@cse-rsp.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 group"
                  aria-label={social.name}
                >
                  <social.icon
                    size={18}
                    className="text-slate-300 group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="flex flex-wrap gap-8 lg:gap-12 lg:flex-1">
            {/* Product Links */}
            <div className="flex flex-col flex-1 min-w-[150px]">
              <h3 className="font-bold text-white font-[archivo] mb-4 text-lg">
                Product
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="flex flex-col flex-1 min-w-[150px]">
              <h3 className="font-bold text-white font-[archivo] mb-4 text-lg">
                Company
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="flex flex-col flex-1 min-w-[150px]">
              <h3 className="font-bold text-white font-[archivo] mb-4 text-lg">
                Support
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col flex-1 min-w-[150px]">
              <h3 className="font-bold text-white font-[archivo] mb-4 text-lg">
                Legal
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-12 pt-12 border-t border-slate-700">
          <div className="flex flex-col lg:flex-1">
            <h3 className="font-bold text-white font-[archivo] mb-2 text-lg">
              Stay Updated
            </h3>
            <p className="text-slate-300 text-sm">
              Subscribe to our newsletter for the latest resources and updates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
            />
            <button className="flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap">
              <Mail size={16} className="mr-2" />
              Subscribe
            </button>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-slate-400 text-sm">
              <span>© {currentYear} CSE Resource Sharing Platform. Made with</span>
              <Heart size={14} className="mx-1 text-red-400 fill-current" />
              <span>for students worldwide.</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;