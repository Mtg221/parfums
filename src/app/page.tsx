'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  Truck, 
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Search,
  User,
  ShoppingBag
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { getProducts } from '@/services/productsService';
import { Category, Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';

const DEFAULT_UNIVERS_IMAGES: Record<string, string> = {
  'huiles parfumées': 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
  'extraits de parfum': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'parfums authentiques': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
};

const BRAND_MAISONS = [
  { name: 'DIOR', subtitle: 'Haute Parfumerie Paris' },
  { name: 'CHANEL', subtitle: 'N°5 & Collections Exclusives' },
  { name: 'YVES SAINT LAURENT', subtitle: 'Libre & Opium' },
  { name: 'TOM FORD', subtitle: 'Private Blend' },
  { name: 'GIORGIO ARMANI', subtitle: 'Privé Essences' },
  { name: 'GUERLAIN', subtitle: 'L\'Art & La Matière' },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY";
  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          getCategories().catch(() => []),
          getProducts().catch(() => [])
        ]);
        setCategories(cats);
        // Filter best sellers or take top products
        const filteredBest = prods.filter(p => p.isBestSeller !== false);
        setBestSellers(filteredBest.length > 0 ? filteredBest : prods.slice(0, 8));
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FAF9F6]">
      
      {/* 1. HERO BANNER (Exactly as in exemple.jpg) */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#D8A7B1]/30 via-[#FDF6F7] to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FDF6F7] border border-[#D8A7B1]/60 text-[#B76E79] text-xs font-serif italic tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plus qu&apos;un parfum, une émotion.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-tight uppercase">
            L&apos;ÉLÉGANCE OLFACTIVE & <br />
            <span className="italic font-normal text-[#B76E79] capitalize font-serif">L&apos;art des fragrances rares</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Bienvenue chez <strong className="font-semibold text-stone-900">{siteName}</strong>. Découvrez nos huiles parfumées, extraits raffinés et parfums d&apos;exception livrés directement chez vous au Sénégal.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs tracking-widest uppercase shadow-md transition-all hover:shadow-lg"
            >
              <span>Découvrir le Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite commander un parfum chez SONIA’S PERFUMERY.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 font-bold text-xs tracking-widest uppercase shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. NOS 3 UNIVERS (Matching exemple.jpg layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold tracking-widest text-[#B76E79] uppercase">
            Collections Exclusives
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 uppercase tracking-tight">
            NOS 3 UNIVERS
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Découvrez nos collections d&apos;exception adaptées à chaque désir et à chaque instant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* UNIVERS 1: HUILES PARFUMÉES */}
          <div className="group rounded-3xl bg-[#FDF6F7] border border-[#D8A7B1]/40 p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#B76E79] transition-all hover:shadow-md">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-white">
                <Image
                  src={DEFAULT_UNIVERS_IMAGES['huiles parfumées']}
                  alt="Huiles Parfumées"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B76E79]">01. Sillage Intense</span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 uppercase">HUILES PARFUMÉES</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Des essences pures et concentrées sans alcool pour une tenue exceptionnelle tout au long de la journée.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <span>Découvrir l&apos;Univers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* UNIVERS 2: EXTRAITS DE PARFUM */}
          <div className="group rounded-3xl bg-[#FDF6F7] border border-[#D8A7B1]/40 p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#B76E79] transition-all hover:shadow-md">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-white">
                <Image
                  src={DEFAULT_UNIVERS_IMAGES['extraits de parfum']}
                  alt="Extraits de Parfum"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B76E79]">02. Haute Concentré</span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 uppercase">EXTRAITS DE PARFUM</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Des compositions précieuses et intenses créées pour laisser une empreinte inoubliable.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <span>Découvrir l&apos;Univers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* UNIVERS 3: PARFUMS AUTHENTIQUES */}
          <div className="group rounded-3xl bg-[#FDF6F7] border border-[#D8A7B1]/40 p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#B76E79] transition-all hover:shadow-md">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-white">
                <Image
                  src={DEFAULT_UNIVERS_IMAGES['parfums authentiques']}
                  alt="Parfums Authentiques"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B76E79]">03. Grandes Maisons</span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 uppercase">PARFUMS AUTHENTIQUES</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Les créations iconiques des plus célèbres maisons de parfum internationales certifiées 100% originales.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <span>Découvrir l&apos;Univers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. NOS MAISONS DE PARFUM (Brand Grid from exemple.jpg) */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold tracking-widest text-[#B76E79] uppercase">Prestige & Créateurs</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 uppercase tracking-wider">NOS MAISONS DE PARFUM</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BRAND_MAISONS.map((b) => (
              <div
                key={b.name}
                className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200 text-center space-y-1 flex flex-col justify-center items-center hover:border-[#D8A7B1] transition-colors"
              >
                <h3 className="font-serif font-bold text-stone-900 text-sm tracking-widest uppercase">{b.name}</h3>
                <p className="text-[10px] text-stone-500 font-light">{b.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NOS BEST-SELLERS (Product Grid matching exemple.jpg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#B76E79] uppercase">Incontournables</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 uppercase mt-1">NOS BEST-SELLERS</h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#B76E79] hover:text-[#a25a65] uppercase tracking-wider"
          >
            <span>Voir toute la sélection</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-stone-200/60 animate-pulse border border-stone-200" />
            ))}
          </div>
        ) : bestSellers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <p className="text-stone-500 text-sm">Aucun best-seller disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => {
              const mainFormat = prod.formats?.[0] || { sizeMl: 5, price: 3000 };
              const displayImage = prod.imageUrl || DEFAULT_UNIVERS_IMAGES.default;

              return (
                <div
                  key={prod.id}
                  className="group rounded-2xl bg-white border border-stone-200 p-5 shadow-xs hover:border-[#D8A7B1] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-xl bg-[#FAF9F6] overflow-hidden border border-stone-100">
                      <Image
                        src={displayImage}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#B76E79] uppercase tracking-wider shadow-xs">
                        {prod.brand || 'DIOR'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                        {prod.categoryName || 'Eau de Parfum'}
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-[#B76E79] transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 font-light">
                        {prod.description || 'Fragrance d\'exception et sillage raffiné.'}
                      </p>
                    </div>

                    {/* Formats badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prod.formats?.map((f) => (
                        <span key={f.id || f.sizeMl} className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-stone-200 text-[10px] font-bold text-stone-700">
                          {f.sizeMl} mL
                        </span>
                      ))}
                      {prod.allowCustomVolume !== false && (
                        <span className="px-2 py-0.5 rounded bg-[#FDF6F7] border border-[#D8A7B1] text-[10px] font-bold text-[#B76E79]">
                          Sur-mesure
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-stone-500 font-light">À partir de :</span>
                      <span className="text-base font-bold text-[#B76E79]">
                        {formatPrice(mainFormat.price)}
                      </span>
                    </div>

                    <Link
                      href={`/parfum/${prod.id}`}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Commander</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. TRUST BADGES ROW (From exemple.jpg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white border border-stone-200 rounded-3xl shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm uppercase">100% AUTHENTIQUE</h3>
              <p className="text-xs text-stone-500 font-light">Essences et créations certifiées</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm uppercase">LIVRAISON À DOMICILE</h3>
              <p className="text-xs text-stone-500 font-light">Partout au Sénégal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm uppercase">PAIEMENT À LA LIVRAISON</h3>
              <p className="text-xs text-stone-500 font-light">Payez à la réception de votre colis</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm uppercase">SERVICE CLIENT</h3>
              <p className="text-xs text-stone-500 font-light">Assistance directe sur WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM DARK BANNER (From exemple.jpg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white p-10 sm:p-16 text-center space-y-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#B76E79]/20 via-transparent to-[#B76E79]/20 pointer-events-none" />
          
          <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-[#D8A7B1]">
            Collection Exclusive SONIA’S PERFUMERY
          </span>
          <h2 className="relative z-10 text-3xl sm:text-5xl font-serif font-bold tracking-tight uppercase">
            DES PARFUMS POUR TOUTES LES OCCASIONS
          </h2>
          <p className="relative z-10 text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
            Trouvez la fragrance parfaite qui révélera votre personnalité et sublimera votre présence au quotidien.
          </p>
          <div className="relative z-10 pt-4">
            <Link
              href="/catalogue"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
            >
              <span>Découvrir toutes nos fragrances</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
