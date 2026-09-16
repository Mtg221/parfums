'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Truck, 
  Camera, 
  MessageCircle,
  X 
} from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/catalogue/huiles-parfumees', label: 'Huiles parfumées' },
    { href: '/catalogue/extraits-de-parfum', label: 'Extraits de parfum' },
    { href: '/catalogue/parfums-authentiques', label: 'Parfums authentiques' },
    { href: '/catalogue/coffrets', label: 'Coffrets' },
    { href: '/contact', label: 'Contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      
      {/* 1. TOP DUSTY ROSE ANNOUNCEMENT BAR (EXACT MATCH EXEMPLE.JPG) */}
      <div className="bg-[#C5928E] text-white py-1.5 px-4 sm:px-8 text-[11px] sm:text-xs flex justify-between items-center font-serif">
        <div className="flex items-center space-x-2">
          <Truck className="w-3.5 h-3.5" />
          <span>Livraison partout au Sénégal &nbsp;|&nbsp; Paiement à la livraison</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <span className="italic font-serif tracking-wide text-white/90">Your scent, Your signature.</span>
          <div className="flex items-center space-x-3 text-white/90">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Camera className="w-3.5 h-3.5" /></a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-white"><MessageCircle className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </div>

      {/* 2. MAIN LUXURY DARK NAVBAR (EXACT MATCH EXEMPLE.JPG) */}
      <div className={`bg-[#141211] text-white transition-all duration-300 border-b border-stone-800 ${isScrolled ? 'py-2 shadow-xl' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between">
            
            {/* LEFT ICONS */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-stone-300 hover:text-white transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button 
                className="p-1.5 text-stone-300 hover:text-white transition-colors hidden sm:block"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* CENTER BRAND LOGO (SONIA'S PERFUMERY GOLD EMBLEM) */}
            <Link href="/" className="flex flex-col items-center group">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-white">
                  <Image
                    src="/logo.JPG"
                    alt="SONIA'S PERFUMERY"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-serif font-bold tracking-[0.25em] text-[#E5C158] uppercase">
                    SONIA&apos;S
                  </span>
                  <span className="text-[9px] font-serif tracking-[0.4em] text-stone-300 uppercase -mt-1">
                    PERFUMERY
                  </span>
                </div>
              </div>
            </Link>

            {/* RIGHT ICONS */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="p-1.5 text-stone-300 hover:text-white transition-colors hidden sm:block">
                <User className="w-5 h-5" />
              </Link>
              <button className="p-1.5 text-stone-300 hover:text-white transition-colors hidden sm:block">
                <Heart className="w-5 h-5" />
              </button>
              <Link href="/catalogue" className="p-1.5 text-stone-300 hover:text-white transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5928E] text-white text-[10px] font-bold flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>

          </div>

          {/* SECONDARY NAVIGATION BAR UNDER LOGO */}
          <div className="hidden md:flex items-center justify-center space-x-8 pt-4 pb-1 border-t border-stone-800/60 mt-3 text-xs tracking-widest uppercase font-serif">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pb-1 transition-colors relative ${
                    isActive
                      ? 'text-stone-100 font-bold border-b-2 border-[#D4AF37]'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181514] text-white border-b border-stone-800 px-6 py-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col space-y-3 font-serif">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 text-xs font-semibold tracking-widest uppercase border-b border-stone-800/50 ${
                    isActive ? 'text-[#E5C158]' : 'text-stone-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite me renseigner sur vos parfums.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded bg-[#C5928E] text-white font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact WhatsApp</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
