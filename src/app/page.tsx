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

const DEFAULT_UNIVERS_IMAGES: Record<string, string> = {
  'huiles parfumées': 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
  'extraits de parfum': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'parfums authentiques': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsData, prodsData, brandsData] = await Promise.all([
          getCategories().catch(() => []),
          getProducts().catch(() => []),
          getBrands().catch(() => [])
        ]);
        setCategories(catsData);
        setProducts(prodsData);
        setBrands(brandsData);
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
      
      {/* 1. HERO SECTION (RELIABLE HIGH RES IMAGE FIX) */}
      <section className="relative pt-36 pb-20 sm:pt-40 sm:pb-28 bg-[#181514] text-white overflow-hidden min-h-[550px] flex items-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=80"
            alt="Perfume Luxury Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
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

              <div className="flex items-center space-x-2 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9B7B56]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600"></span>
              </div>
            </div>

            {/* Right Side Bottle Display */}
            <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-96">
                <div className="absolute -top-6 -left-6 z-20 text-right">
                  <p className="italic font-serif text-xl text-[#C5928E] font-medium rotate-[-6deg]">
                    Plus qu&apos;un parfum,<br />une émotion.
                  </p>
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
                  alt="Chanel Perfume Bottle"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 3. NOS MAISONS DE PARFUM (DYNAMIC BRANDS FROM FIRESTORE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex justify-between items-end border-b border-stone-200/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 uppercase tracking-wider">
              NOS MAISONS DE PARFUM
            </h2>
            <p className="text-xs text-stone-500 font-sans font-light mt-0.5">
              Les plus grandes marques, réunies pour vous.
            </p>
          </div>
          <Link
            href="/catalogue"
            className="text-xs font-serif font-bold text-stone-800 hover:text-[#9B7B56] uppercase tracking-wider flex items-center space-x-1"
          >
            <span>VOIR TOUTES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Carousel Row with Dynamic Brands */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="p-5 bg-white border border-stone-200/80 rounded-sm text-center flex flex-col items-center justify-center min-h-[75px] shadow-2xs hover:border-[#9B7B56] transition-colors"
              >
                <span className="font-serif font-bold text-stone-900 text-sm tracking-widest uppercase">
                  {brand.name}
                </span>
                {brand.subtitle && (
                  <span className="text-[9px] text-stone-400 font-sans font-light truncate max-w-full">
                    {brand.subtitle}
                  </span>
                )}
              </div>
            ))}
          </div>
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
                    <Image
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"}
                      alt={prod.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
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
