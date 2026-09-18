'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  Heart, 
  Droplet, 
  Diamond 
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { getProducts } from '@/services/productsService';
import { getBrands, Brand } from '@/services/brandsService';
import { Category, Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';



export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsData, prodsData] = await Promise.all([
          getCategories().catch(() => []),
          getProducts().catch(() => [])
        ]);
        setCategories(catsData);
        setProducts(prodsData);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Best sellers filtered or top products
  const bestSellers = products.filter(p => p.isBestSeller !== false).slice(0, 6);
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 bg-[#FAF9F6]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 sm:pt-40 sm:pb-28 bg-[#181514] text-white overflow-hidden min-h-[550px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#181514] via-[#181514]/85 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Overlay Text Box */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-serif font-bold uppercase tracking-[0.3em] text-[#E5C158]">
                SONIA&apos;S PERFUMERY
              </span>

              <h1 className="text-4xl sm:text-6xl font-serif leading-tight">
                <span className="font-bold text-white uppercase block">YOUR SCENT,</span>
                <span className="italic font-serif text-[#C5928E] block -mt-2">Your Signature.</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 font-sans font-light max-w-lg leading-relaxed">
                Découvrez des fragrances uniques qui révèlent votre personnalité.
              </p>

              <div className="pt-2">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
                >
                  <span>EXPLORER NOS PRODUITS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-4 text-[11px] text-stone-400 font-serif tracking-widest space-x-2">
                <span>Huiles parfumées</span>
                <span>&bull;</span>
                <span>Extraits de parfum</span>
                <span>&bull;</span>
                <span>Parfums authentiques</span>
              </div>
            </div>

            {/* Right Side Bottle Display */}
            <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-96 flex items-center justify-center border border-stone-800 rounded-sm bg-stone-900/50">
                <p className="italic font-serif text-xl text-[#C5928E] font-medium text-center">
                  Plus qu&apos;un parfum,<br />une émotion.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>





      {/* 2. NOS 3 UNIVERS SECTION (1:1 MATCH EXEMPLE.JPG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-3 text-stone-400 text-xs tracking-widest uppercase font-serif">
            <span className="w-12 h-px bg-stone-300"></span>
            <span>NOS 3 UNIVERS</span>
            <span className="w-12 h-px bg-stone-300"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 uppercase tracking-wide">
            TROUVEZ VOTRE FRAGRANCE
          </h2>
          <p className="text-xs text-stone-500 font-sans font-light italic">
            Trois façons de vivre le parfum, une seule passion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: Huiles parfumées */}
          <div className="bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm overflow-hidden flex flex-col justify-between group shadow-2xs">
            <div className="relative aspect-[4/3] w-full bg-[#FAF0ED] overflow-hidden flex items-center justify-center border-b border-[#E8D5D0]">
              <Droplet className="w-16 h-16 text-[#9B7B56]/30 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 text-center space-y-3">
              <div className="w-8 h-8 mx-auto rounded-full bg-white/80 flex items-center justify-center text-[#9B7B56]">
                <Droplet className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg uppercase tracking-wider">
                HUILES PARFUMÉES
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed min-h-[36px]">
                Des senteurs en format pratique, idéal pour le quotidien.
              </p>
              <div className="pt-2">
                <Link
                  href="/huiles-parfumees"
                  className="inline-block px-6 py-2.5 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-[10px] uppercase tracking-widest shadow-2xs transition-colors"
                >
                  DÉCOUVRIR →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Extraits de parfum */}
          <div className="bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm overflow-hidden flex flex-col justify-between group shadow-2xs">
            <div className="relative aspect-[4/3] w-full bg-[#FAF0ED] overflow-hidden flex items-center justify-center border-b border-[#E8D5D0]">
              <Sparkles className="w-16 h-16 text-[#9B7B56]/30 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 text-center space-y-3">
              <div className="w-8 h-8 mx-auto rounded-full bg-white/80 flex items-center justify-center text-[#9B7B56]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg uppercase tracking-wider">
                EXTRAITS DE PARFUM
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed min-h-[36px]">
                Des fragrances inspirées de vos parfums préférés, en haute concentration.
              </p>
              <div className="pt-2">
                <Link
                  href="/extraits-parfums"
                  className="inline-block px-6 py-2.5 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-[10px] uppercase tracking-widest shadow-2xs transition-colors"
                >
                  DÉCOUVRIR →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Parfums authentiques */}
          <div className="bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm overflow-hidden flex flex-col justify-between group shadow-2xs">
            <div className="relative aspect-[4/3] w-full bg-[#FAF0ED] overflow-hidden flex items-center justify-center border-b border-[#E8D5D0]">
              <Diamond className="w-16 h-16 text-[#9B7B56]/30 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 text-center space-y-3">
              <div className="w-8 h-8 mx-auto rounded-full bg-white/80 flex items-center justify-center text-[#9B7B56]">
                <Diamond className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg uppercase tracking-wider">
                PARFUMS AUTHENTIQUES
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed min-h-[36px]">
                Les vraies marques, dans leurs flacons et packagings d&apos;origine.
              </p>
              <div className="pt-2">
                <Link
                  href="/parfums-authentiques"
                  className="inline-block px-6 py-2.5 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-[10px] uppercase tracking-widest shadow-2xs transition-colors"
                >
                  DÉCOUVRIR →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. NOS MAISONS DE PARFUM (1:1 MATCH EXEMPLE.JPG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 uppercase tracking-wider">
              NOS MAISONS DE PARFUM
            </h2>
            <p className="text-xs text-stone-500 font-sans font-light">
              Les plus grandes marques, réunies pour vous.
            </p>
          </div>
          <Link
            href="/parfums-authentiques"
            className="text-[11px] font-serif font-bold text-stone-600 hover:text-stone-900 uppercase tracking-wider flex items-center space-x-1"
          >
            <span>VOIR TOUTES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brand Logos Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {['DIOR', 'CHANEL', 'YVES SAINT LAURENT', 'GUERLAIN', 'TOM FORD', 'PACO RABANNE', 'JEAN PAUL GAULTIER', 'CALVIN KLEIN'].map((bName) => (
            <Link
              key={bName}
              href={`/huiles-parfumees?maison=${encodeURIComponent(bName)}`}
              className="bg-white border border-stone-200/80 hover:border-[#9B7B56] rounded-sm p-4 flex items-center justify-center text-center h-16 shadow-2xs transition-all hover:shadow-xs group"
            >
              <span className="font-serif font-bold text-xs tracking-wider text-stone-900 group-hover:text-[#9B7B56] transition-colors uppercase truncate">
                {bName}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NOS BEST-SELLERS (DYNAMIC BEST-SELLERS FROM FIRESTORE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 uppercase tracking-wider">
            NOS BEST-SELLERS
          </h2>
          <p className="text-xs text-stone-500 font-sans font-light mt-0.5">
            Les fragrances que vous aimez le plus.
          </p>
        </div>

        {/* 6 Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {displayBestSellers.map((prod) => {
            const firstFmt = prod.formats?.[0] || { sizeMl: 5, price: 15000 };
            const displayPrice = firstFmt.price;

            return (
              <div
                key={prod.id}
                className="bg-white border border-stone-200/80 rounded-sm p-3.5 flex flex-col justify-between space-y-3 group hover:border-[#9B7B56] transition-all"
              >
                <div className="space-y-2 relative">
                  
                  {/* Heart Icon Top Right */}
                  <button className="absolute top-2 right-2 z-10 text-stone-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>

                  <div className="relative aspect-square bg-stone-50 rounded-sm overflow-hidden flex items-center justify-center p-2 border border-stone-100">
                    {prod.imageUrl ? (
                      <Image
                        src={prod.imageUrl}
                        alt={prod.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Sparkles className="w-8 h-8 text-stone-300" />
                    )}
                  </div>

                  <div className="text-center pt-1">
                    <h3 className="font-serif font-bold text-stone-900 text-sm truncate">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-sans font-light truncate">
                      {prod.categoryName || 'Parfum'}
                    </p>
                    <p className="text-xs font-bold text-stone-900 font-sans mt-1">
                      {formatPrice(displayPrice)}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour, je souhaite commander le parfum ${prod.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-[10px] uppercase tracking-wider block text-center shadow-2xs transition-colors"
                  >
                    AJOUTER AU PANIER
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 5. TRUST BADGES ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white border border-stone-200/80 rounded-sm divide-y sm:divide-y-0 lg:divide-x divide-stone-200">
          
          <div className="flex items-center space-x-3.5 p-2 justify-center">
            <Truck className="w-6 h-6 text-stone-800 flex-shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-xs text-stone-900 uppercase">Livraison rapide</h3>
              <p className="text-[11px] text-stone-500 font-sans font-light">Partout au Sénégal</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2 justify-center pt-4 sm:pt-2">
            <ShieldCheck className="w-6 h-6 text-stone-800 flex-shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-xs text-stone-900 uppercase">Produits authentiques</h3>
              <p className="text-[11px] text-stone-500 font-sans font-light">100% originaux</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2 justify-center pt-4 lg:pt-2">
            <CreditCard className="w-6 h-6 text-stone-800 flex-shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-xs text-stone-900 uppercase">Paiement à la livraison</h3>
              <p className="text-[11px] text-stone-500 font-sans font-light">Simple et sécurisé</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2 justify-center pt-4 lg:pt-2">
            <Headphones className="w-6 h-6 text-stone-800 flex-shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-xs text-stone-900 uppercase">Service client</h3>
              <p className="text-[11px] text-stone-500 font-sans font-light">Toujours à votre écoute</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM DARK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-[#181514] text-white p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-xl sm:text-3xl font-serif font-bold uppercase tracking-wider text-white">
              DES PARFUMS<br />POUR TOUTES LES OCCASIONS
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-sans font-light leading-relaxed">
              Qu&apos;il s&apos;agisse d&apos;un rendez-vous, d&apos;une soirée ou simplement de votre quotidien, trouvez le parfum qui vous ressemble.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/catalogue"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-sm bg-white text-stone-900 hover:bg-stone-100 font-serif font-bold text-xs uppercase tracking-widest transition-colors shadow-md"
            >
              <span>EXPLORER LA BOUTIQUE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
