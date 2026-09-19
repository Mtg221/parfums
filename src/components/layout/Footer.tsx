'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, MessageCircle, Heart } from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const whatsappNumber = getWhatsAppNumber();

  return (
    <footer className="bg-[#12100E] text-stone-300 pt-16 pb-12 border-t border-stone-800 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          
          {/* COLUMN 1: BRAND LOGO & TITLE */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-white flex-shrink-0">
                  <Image
                    src="/logo.JPG"
                    alt="SONIA'S PERFUMERY"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-[0.2em] text-[#E5C158] uppercase">
                    SONIA&apos;S
                  </span>
                  <span className="text-[9px] tracking-[0.4em] text-stone-400 uppercase -mt-1">
                    PERFUMERY
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-sm">
              L&apos;élégance olfactive et l&apos;art des fragrances rares livrées chez vous au Sénégal.
            </p>
          </div>

          {/* COLUMN 2: BOUTIQUE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5C158]">Boutique</h4>
            <ul className="space-y-2 text-xs font-sans font-light text-stone-400">
              <li><Link href="/huiles-parfumees" className="hover:text-white transition-colors">Huiles parfumées</Link></li>
              <li><Link href="/extraits-parfums" className="hover:text-white transition-colors">Extraits de parfum</Link></li>
              <li><Link href="/parfums-authentiques" className="hover:text-white transition-colors">Parfums authentiques</Link></li>
              <li><Link href="/coffrets" className="hover:text-white transition-colors">Coffrets</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: INFORMATIONS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5C158]">Informations</h4>
            <ul className="space-y-2 text-xs font-sans font-light text-stone-400">
              <li><Link href="/comment-commander" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/comment-commander" className="hover:text-white transition-colors">Livraison</Link></li>
              <li><Link href="/comment-commander" className="hover:text-white transition-colors">Paiement</Link></li>
              <li><Link href="/comment-commander" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: NOUS SUIVRE & SIGNATURE */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5C158]">Nous suivre</h4>
            <div className="flex items-center space-x-4 text-stone-300">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-stone-900 border border-stone-800 hover:text-white hover:border-stone-700 transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-stone-900 border border-stone-800 hover:text-white hover:border-stone-700 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-2 text-left sm:text-right">
              <p className="italic font-serif text-sm text-[#C5928E]">Your scent, Your signature.</p>
              <Heart className="w-3.5 h-3.5 text-[#C5928E] inline-block mt-1" />
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-stone-800/80 text-center text-[11px] text-stone-500 font-sans font-light">
          © 2026 Sonia&apos;s Perfumery. Tous droits réservés.
        </div>

      </div>
    </footer>
  );
};
