'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AURA PARFUMS';
  const siteSlogan = process.env.NEXT_PUBLIC_SITE_SLOGAN || "L'Essence du Luxe & de l'Élégance";
  const whatsappNumber = getWhatsAppNumber();

  return (
    <footer className="bg-neutral-950 border-t border-amber-900/20 text-neutral-400 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </span>
              <span className="text-xl font-serif tracking-widest text-amber-100 font-bold uppercase">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              {siteSlogan}. Une sélection exclusive de parfums d&apos;exception pour affirmer votre personnalité unique.
            </p>
          </div>

          {/* NAVIGATION COLUMN */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-amber-200 uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-amber-400 transition-colors">
                  Nos parfums
                </Link>
              </li>
              <li>
                <Link href="/comment-commander" className="hover:text-amber-400 transition-colors">
                  Comment commander
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT COLUMN */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-amber-200 uppercase">
              Contact & Service
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+{whatsappNumber}</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Assistance WhatsApp
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>contact@auraparfums.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Boutique & Livraison Express</span>
              </li>
            </ul>
          </div>

          {/* ENGAGEMENT & ADMIN LINK */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-amber-200 uppercase">
              Qualité Garantie
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Toutes nos fragrances sont authenticatées et conditionnées selon les standards internationaux de la haute parfumerie.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-2 text-xs text-neutral-500 hover:text-amber-400 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Espace Administration</span>
              </Link>
            </div>
          </div>

        </div>

        {/* COPYRIGHT BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-neutral-900 text-center md:flex md:items-center md:justify-between text-xs text-neutral-400">
          <p>© 2026 {siteName}. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0 font-serif italic text-amber-300/80">
            Conçu pour l&apos;Élégance & le Luxe
          </p>
        </div>
      </div>
    </footer>
  );
};
