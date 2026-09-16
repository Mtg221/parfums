'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu, X } from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY";
  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs py-3'
          : 'bg-[#faf9f6]/90 backdrop-blur-xs py-4 border-b border-stone-200/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO & BRAND NAME */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-800/30 bg-white flex-shrink-0 shadow-xs group-hover:border-amber-800 transition-colors">
              <Image
                src="/logo.JPG"
                alt="SONIA’S PERFUMERY Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-lg sm:text-xl font-serif font-bold tracking-widest text-stone-900 uppercase">
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
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-amber-800 border-b-2 border-amber-800'
                      : 'text-stone-600 hover:text-stone-900'
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
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs tracking-wider uppercase shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander / WhatsApp</span>
            </a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 mt-3 space-y-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-800'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-stone-100">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur vos parfums.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-700 text-white font-medium text-xs tracking-wider uppercase shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
