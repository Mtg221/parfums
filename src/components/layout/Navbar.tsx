'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  MessageCircle, 
  Menu, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Truck,
  Camera
} from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY";
  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/catalogue', label: 'Huiles parfumées' },
    { href: '/catalogue', label: 'Extraits de parfum' },
    { href: '/catalogue', label: 'Parfums authentiques' },
    { href: '/comment-commander', label: 'Coffrets' },
    { href: '/contact', label: 'Contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      
      {/* 1. TOP ANNOUNCEMENT BAR (DUSTY ROSE / ROSE GOLD - EXACT FROM EXEMPLE.JPG) */}
      <div className="bg-[#C39493] text-white text-[11px] py-1.5 px-4 sm:px-8 flex items-center justify-between font-sans">
        <div className="flex items-center space-x-2">
          <Truck className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-medium tracking-wide">
            Livraison partout au Sénégal &nbsp;|&nbsp; Paiement à la livraison
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="font-serif italic text-xs tracking-wider opacity-90">
            Your scent. Your signature.
          </span>
          <div className="flex items-center space-x-2 border-l border-white/30 pl-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Instagram">
              <Camera className="w-3.5 h-3.5" />
            </a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="WhatsApp">
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR (DARK LUXURY - EXACT FROM EXEMPLE.JPG) */}
      <div className="bg-[#181516] text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-12 items-center">
            
            {/* Left Icons: Hamburger & Search */}
            <div className="col-span-3 flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-stone-300 hover:text-white transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-stone-300 hover:text-white transition-colors hidden sm:block"
                aria-label="Recherche"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center Logo */}
            <div className="col-span-6 flex justify-center">
              <Link href="/" className="flex flex-col items-center group">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400/40 bg-white mb-0.5">
                  <Image
                    src="/logo.JPG"
                    alt="SONIA’S PERFUMERY Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-base sm:text-xl font-serif font-bold tracking-[0.2em] text-amber-200 uppercase group-hover:text-amber-100 transition-colors text-center leading-tight">
                  {siteName}
                </span>
              </Link>
            </div>

            {/* Right Icons: Account, Wishlist, WhatsApp / Bag */}
            <div className="col-span-3 flex items-center justify-end space-x-3">
              <Link
                href="/login"
                className="p-1.5 text-stone-300 hover:text-amber-200 transition-colors hidden sm:block"
                title="Espace Admin"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/catalogue"
                className="p-1.5 text-stone-300 hover:text-amber-200 transition-colors hidden sm:block"
                title="Mes favoris"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite passer une commande.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1"
                title="WhatsApp Commander"
              >
                <ShoppingBag className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* SEARCH BAR INPUT (TOGGLE) */}
          {searchOpen && (
            <div className="mt-3 pt-2 border-t border-stone-800 flex justify-center animate-fadeIn">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Rechercher une fragrance, marque ou huile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-full text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                />
                <Link
                  href={searchQuery ? `/catalogue?search=${encodeURIComponent(searchQuery)}` : '/catalogue'}
                  className="absolute right-3 top-2 text-stone-400 hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* DESKTOP NAVIGATION BAR (DIRECTLY BELOW LOGO) */}
          <nav className="hidden md:flex justify-center items-center space-x-8 pt-3 pb-1 border-t border-stone-800/60 mt-3 text-xs tracking-wider uppercase">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href && idx === 0;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-amber-300 border-b-2 border-amber-400 font-bold'
                      : 'text-stone-300 hover:text-amber-200 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181516] text-white border-b border-stone-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase text-stone-200 hover:bg-stone-900 hover:text-amber-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-emerald-400 font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Assistance WhatsApp</span>
            </a>
            <Link href="/login" className="text-stone-400 hover:text-amber-300">
              Connexion Admin
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};
