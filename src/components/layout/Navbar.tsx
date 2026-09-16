'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu, X, Sparkles } from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AURA PARFUMS';
  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/catalogue', label: 'Nos parfums' },
    { href: '/comment-commander', label: 'Comment commander' },
    { href: '/contact', label: 'Contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-amber-900/20 shadow-xl py-3'
          : 'bg-gradient-to-b from-neutral-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:border-amber-400 transition-colors">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </span>
            <span className="text-xl sm:text-2xl font-serif tracking-widest text-amber-100 font-bold uppercase">
              {siteName}
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider transition-colors duration-200 uppercase font-medium ${
                    isActive
                      ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                      : 'text-neutral-300 hover:text-amber-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP CTA BUTTON */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur vos parfums.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm tracking-wide shadow-lg shadow-emerald-900/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander / WhatsApp</span>
            </a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-amber-100 hover:bg-neutral-900 transition-colors"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-amber-900/20 px-4 pt-4 pb-6 mt-3 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-400'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-amber-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-neutral-900">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur vos parfums.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm tracking-wide shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
