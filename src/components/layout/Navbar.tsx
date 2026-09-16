'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu, X, ShoppingBag } from 'lucide-react';
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
    { href: '/catalogue', label: 'Nos Parfums' },
    { href: '/comment-commander', label: 'Comment Commander' },
    { href: '/contact', label: 'Contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner Dusty Rose */}
      <div className="bg-[#D8A7B1] text-white text-[11px] sm:text-xs tracking-widest uppercase font-medium py-1.5 px-4 text-center">
        <span>✨ Livraison partout au Sénégal &bull; Paiement à la livraison</span>
      </div>

      {/* Main Light Luxury Header */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-3'
            : 'bg-[#faf9f6]/95 backdrop-blur-sm py-4 border-b border-stone-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* LOGO & BRAND NAME */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D8A7B1]/40 bg-white flex-shrink-0 shadow-xs group-hover:border-[#B76E79] transition-colors">
                <Image
                  src="/logo.JPG"
                  alt="SONIA’S PERFUMERY Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-base sm:text-lg font-serif font-bold tracking-wider text-stone-900 uppercase">
                {siteName}
              </span>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-semibold tracking-widest uppercase transition-colors py-1 ${
                      isActive
                        ? 'text-[#B76E79] border-b-2 border-[#B76E79]'
                        : 'text-stone-700 hover:text-[#B76E79]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* DESKTOP CTA BUTTON */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/catalogue"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Catalogue</span>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur vos parfums.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-semibold text-xs tracking-wider uppercase shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
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
          <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 mt-3 space-y-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      isActive
                        ? 'bg-[#FDF6F7] text-[#B76E79] font-bold border-l-4 border-[#B76E79]'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-stone-100 flex flex-col space-y-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur vos parfums.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#B76E79] text-white font-semibold text-xs tracking-wider uppercase shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
