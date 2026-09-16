'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Headphones,
  Heart,
  Droplet,
  Sparkles,
  Award
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { getProducts } from '@/services/productsService';
import { Category, Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY";

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const perfumeHouses = [
    { name: 'DIOR', font: 'font-serif tracking-widest' },
    { name: 'CHANEL', font: 'font-sans font-bold tracking-widest' },
    { name: 'YVESSAINTLAURENT', font: 'font-serif italic tracking-wider' },
    { name: 'GUERLAIN', font: 'font-serif tracking-widest' },
    { name: 'TOM FORD', font: 'font-sans font-bold tracking-widest' },
    { name: 'paco rabanne', font: 'font-sans text-xs tracking-wider' },
    { name: 'Jean Paul GAULTIER', font: 'font-serif tracking-wide' },
    { name: 'Calvin Klein', font: 'font-sans tracking-wide' },
  ];

  return (
    <div className="space-y-16 pb-16 pt-24 sm:pt-28">
      
      {/* 1. HERO SLIDER BANNER (EXACT LAYOUT FROM EXEMPLE.JPG) */}
      <section className="relative bg-[#F9F5F1] py-12 sm:py-20 overflow-hidden border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <span className="text-xs font-semibold tracking-[0.25em] text-stone-500 uppercase">
                {siteName}
              </span>

              <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-stone-900 leading-[1.1]">
                YOUR SCENT, <br />
                <span className="font-serif italic font-normal text-[#9E7B56] block mt-1">
                  Your Signature.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-stone-600 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Découvrez des fragrances uniques qui révèlent votre personnalité.
              </p>

              <div className="pt-2">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-sm bg-[#9E7B56] hover:bg-[#886744] text-white font-semibold text-xs tracking-widest uppercase transition-colors shadow-sm"
                >
                  <span>EXPLORER NOS PRODUITS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-xs text-stone-500 pt-2 font-light tracking-wide">
                Huiles parfumées &nbsp;&middot;&nbsp; Extraits de parfum &nbsp;&middot;&nbsp; Parfums authentiques
              </p>
            </div>

            {/* Right Column Image with Script Badge */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-lg overflow-hidden border border-stone-200 shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"
                  alt="SONIA’S PERFUMERY Chanel Coco Mademoiselle"
                  fill
                  priority
                  className="object-cover"
                />
                
                {/* Script Badge on Top Right */}
                <div className="absolute top-6 right-6 bg-stone-900/80 backdrop-blur-xs text-amber-200 px-4 py-2 rounded-full border border-amber-300/30 text-xs font-serif italic shadow-lg">
                  Plus qu&apos;un parfum, une émotion.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. NOS 3 UNIVERS SECTION (EXACT FROM EXEMPLE.JPG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-[0.25em] text-[#9E7B56] uppercase">
            NOS 3 UNIVERS
          </span>
          <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-wide">
            TROUVEZ VOTRE FRAGRANCE
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Trois façons de vivre le parfum, une seule passion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Huiles parfumées */}
          <div className="bg-[#F5ECE9] rounded-lg overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between text-center p-6 space-y-6">
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-white shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop"
                  alt="Huiles parfumées"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-[#9E7B56] mb-2">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg uppercase tracking-wider">
                  HUILES PARFUMÉES
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Des senteurs en format pratique, idéal pour le quotidien.
                </p>
              </div>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center space-x-2 py-2.5 px-6 rounded-sm bg-[#9E7B56] hover:bg-[#886744] text-white font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              <span>DÉCOUVRIR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Extraits de parfum */}
          <div className="bg-[#F5ECE9] rounded-lg overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between text-center p-6 space-y-6">
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-white shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"
                  alt="Extraits de parfum"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-[#9E7B56] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg uppercase tracking-wider">
                  EXTRAITS DE PARFUM
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Des fragrances inspirées de vos parfums préférés, en haute concentration.
                </p>
              </div>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center space-x-2 py-2.5 px-6 rounded-sm bg-[#9E7B56] hover:bg-[#886744] text-white font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              <span>DÉCOUVRIR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Parfums authentiques */}
          <div className="bg-[#F5ECE9] rounded-lg overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between text-center p-6 space-y-6">
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-white shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop"
                  alt="Parfums authentiques"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-[#9E7B56] mb-2">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg uppercase tracking-wider">
                  PARFUMS AUTHENTIQUES
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Les vraies marques, dans leurs flacons et packagings d&apos;origine.
                </p>
              </div>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center space-x-2 py-2.5 px-6 rounded-sm bg-[#9E7B56] hover:bg-[#886744] text-white font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              <span>DÉCOUVRIR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. NOS MAISONS DE PARFUM (BRAND LOGOS CAROUSEL / GRID FROM EXEMPLE.JPG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#9E7B56] uppercase">
              NOS MAISONS DE PARFUM
            </span>
            <p className="text-xs text-stone-500 font-light">Les plus grandes marques, réunies pour vous.</p>
          </div>
          <Link href="/catalogue" className="text-xs font-semibold text-[#9E7B56] hover:underline flex items-center space-x-1">
            <span>VOIR TOUTES</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {perfumeHouses.map((house, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-stone-200 rounded-md text-center flex items-center justify-center h-16 shadow-2xs hover:border-amber-700/40 transition-colors"
            >
              <span className={`text-stone-800 text-xs font-bold ${house.font}`}>
                {house.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NOS BEST-SELLERS SECTION (EXACT FROM EXEMPLE.JPG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold tracking-widest text-[#9E7B56] uppercase">
            NOS BEST-SELLERS
          </span>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Les fragrances que vous aimez le plus.
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-md bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.slice(0, 6).map((prod) => {
              const minPrice = prod.formats.length > 0 ? Math.min(...prod.formats.map(f => f.price)) : 15000;

              return (
                <div
                  key={prod.id}
                  className="bg-white border border-stone-200 rounded-md p-3.5 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs transition-shadow relative"
                >
                  <button className="absolute top-2 right-2 text-stone-400 hover:text-red-500">
                    <Heart className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-2">
                    <div className="relative w-full aspect-[4/5] bg-stone-50 rounded-sm overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400&auto=format&fit=crop"
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="text-center space-y-0.5">
                      <h3 className="font-serif font-bold text-stone-900 text-sm">{prod.name}</h3>
                      <p className="text-[10px] text-stone-500">{prod.categoryName || 'Parfum'}</p>
                      <p className="text-xs font-bold text-stone-900 pt-1">{formatPrice(minPrice)}</p>
                    </div>
                  </div>

                  <Link
                    href={`/parfum/${prod.id}`}
                    className="w-full text-center py-2 px-2 rounded-sm bg-[#9E7B56] hover:bg-[#886744] text-white font-semibold text-[10px] tracking-wider uppercase transition-colors block"
                  >
                    AJOUTER AU PANIER
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. TRUST BADGES ROW (EXACT FROM EXEMPLE.JPG) */}
      <section className="bg-white border-y border-stone-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-2 p-3">
              <Truck className="w-6 h-6 text-[#9E7B56]" />
              <h4 className="font-bold text-stone-900 text-xs">Livraison rapide</h4>
              <p className="text-[11px] text-stone-500 font-light">Partout au Sénégal</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-3 border-l sm:border-l-0 border-stone-200">
              <ShieldCheck className="w-6 h-6 text-[#9E7B56]" />
              <h4 className="font-bold text-stone-900 text-xs">Produits authentiques</h4>
              <p className="text-[11px] text-stone-500 font-light">100% origineux</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-3">
              <CreditCard className="w-6 h-6 text-[#9E7B56]" />
              <h4 className="font-bold text-stone-900 text-xs">Paiement à la livraison</h4>
              <p className="text-[11px] text-stone-500 font-light">Simple et sécurisé</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-3 border-l sm:border-l-0 border-stone-200">
              <Headphones className="w-6 h-6 text-[#9E7B56]" />
              <h4 className="font-bold text-stone-900 text-xs">Service client</h4>
              <p className="text-[11px] text-stone-500 font-light">Toujours à votre écoute</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BOTTOM BANNER (DES PARFUMS POUR TOUTES LES OCCASIONS - FROM EXEMPLE.JPG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden bg-stone-900 text-white p-8 sm:p-14 border border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-bold tracking-[0.25em] text-amber-300 uppercase">SONIA’S PERFUMERY</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wide">
              DES PARFUMS POUR TOUTES LES OCCASIONS
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Qu&apos;il s&apos;agisse d&apos;un rendez-vous, d&apos;une soirée ou simplement de votre quotidien, trouvez le parfum qui vous ressemble.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-sm bg-[#F5ECE9] hover:bg-white text-stone-900 font-bold text-xs tracking-widest uppercase transition-colors flex-shrink-0"
          >
            <span>EXPLORER LA BOUTIQUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
