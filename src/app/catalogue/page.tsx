'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Check, 
  Truck, 
  CreditCard, 
  Heart,
  Sliders
} from 'lucide-react';
import { getBrands, Brand } from '@/services/brandsService';
import { getProducts } from '@/services/productsService';
import { Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';

const ALL_MAISONS_LIST = [
  { name: 'DIOR', category: 'maisons' },
  { name: 'CHANEL', category: 'maisons' },
  { name: 'YVES SAINT LAURENT', category: 'maisons' },
  { name: 'GUERLAIN', category: 'maisons' },
  { name: 'TOM FORD', category: 'maisons' },
  { name: 'paco rabanne', category: 'maisons' },
  { name: 'Jean Paul GAULTIER', category: 'maisons' },
  { name: 'Calvin Klein', category: 'maisons' },
  { name: 'LANCÔME', category: 'maisons' },
  { name: 'GIORGIO ARMANI', category: 'maisons' },
  { name: 'AZZARO', category: 'maisons' },
  { name: 'DOLCE & GABBANA', category: 'maisons' },
  { name: 'VIKTOR & ROLF', category: 'maisons' },
  { name: 'narciso rodriguez', category: 'maisons' },
  { name: 'VICTORIA\'S SECRET', category: 'maisons' },
  { name: 'Maison Francis Kurkdjian', category: 'maisons' },
  { name: 'MONTBLANC', category: 'maisons' },
  { name: 'MAISON AL HARAMAIN', category: 'arabes' },
  { name: 'MUGLER', category: 'maisons' },
  { name: 'ZARA', category: 'autres' },
  { name: 'HERMÈS PARIS', category: 'maisons' },
  { name: 'Cartier', category: 'maisons' },
  { name: 'GIVENCHY', category: 'maisons' },
  { name: 'BVLGARI', category: 'maisons' },
  { name: 'CREED', category: 'maisons' },
  { name: 'LOUIS VUITTON', category: 'maisons' },
  { name: 'BOSS', category: 'maisons' },
  { name: 'BURBERRY', category: 'maisons' },
  { name: 'CAROLINA HERRERA', category: 'maisons' },
  { name: 'VERSACE', category: 'maisons' },
  { name: 'VALENTINO', category: 'maisons' },
  { name: 'ROCHAS', category: 'maisons' },
  { name: 'ISSEY MIYAKE', category: 'maisons' },
  { name: 'KENZO', category: 'maisons' },
  { name: 'GUCCI', category: 'maisons' },
  { name: 'ESCADA', category: 'maisons' },
  { name: 'ARMANI PRIVÉ', category: 'maisons' },
  { name: 'NINA RICCI', category: 'maisons' },
  { name: 'YVES ROCHER', category: 'autres' },
  { name: 'DIESEL', category: 'autres' },
  { name: 'MANCERA', category: 'maisons' },
  { name: 'cacharel', category: 'maisons' },
  { name: 'LACOSTE', category: 'autres' },
  { name: 'MARLY PARIS', category: 'maisons' },
  { name: 'XERJOFF', category: 'maisons' },
  { name: 'LIBERTY', category: 'autres' },
  { name: 'Al Rehab', category: 'arabes' },
  { name: 'Chloé', category: 'maisons' },
  { name: 'PARFUMS ARABES', category: 'arabes' },
  { name: 'Autres marques', category: 'autres' }
];

export default function CataloguePage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'toutes' | 'maisons' | 'arabes' | 'autres'>('toutes');
  const [selectedGender, setSelectedGender] = useState<'all' | 'femme' | 'homme' | 'unisexe'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [brandData, prodData] = await Promise.all([
          getBrands().catch(() => []),
          getProducts().catch(() => []),
        ]);
        setBrands(brandData);
        setProducts(prodData);
      } catch (err) {
        console.error('Failed to load catalogue data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Merge Firestore brands with fallback list
  const combinedBrands = Array.from(new Set([
    ...brands.map(b => b.name),
    ...ALL_MAISONS_LIST.map(m => m.name)
  ])).map(name => {
    const existing = brands.find(b => b.name.toUpperCase() === name.toUpperCase());
    const preset = ALL_MAISONS_LIST.find(m => m.name.toUpperCase() === name.toUpperCase());
    return {
      name,
      category: preset ? preset.category : 'maisons',
      subtitle: existing?.subtitle || ''
    };
  });

  // Filter Brands by Search
  const filteredBrandsList = combinedBrands.filter(b => {
    return b.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter Products for Selected Brand
  const selectedBrandProducts = selectedBrand
    ? products.filter(p => {
        const matchesBrand = p.brand && p.brand.toUpperCase() === selectedBrand.toUpperCase();
        const matchesGender = selectedGender === 'all' || 
          p.description.toLowerCase().includes(selectedGender) || 
          (p.categoryName && p.categoryName.toLowerCase().includes(selectedGender));
        return matchesBrand && matchesGender;
      })
    : [];

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-[#FAF9F6] font-sans">
      
      {/* 1. HERO BANNER (1:1 MATCH EXEMPLE1.JPEG) */}
      <section className="relative bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm p-8 sm:p-12 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text Box */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[10px] font-serif font-bold uppercase tracking-[0.25em] text-[#9B7B56]">
              PARFUMS AUTHENTIQUES
            </span>

            <h1 className="text-4xl sm:text-6xl font-serif">
              <span className="font-bold text-stone-900 block uppercase">NOS MAISONS</span>
              <span className="italic font-serif text-[#C5928E] block -mt-2">de Parfum</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md leading-relaxed">
              Découvrez nos plus grandes maisons de parfum et leurs senteurs iconiques.
            </p>

            <div className="pt-2">
              <a
                href="#maisons-grid"
                className="inline-flex items-center space-x-3 px-7 py-3 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-xs uppercase tracking-widest shadow-xs transition-colors"
              >
                <span>EXPLORER LES MAISONS</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* 3 Trust Feature Badges */}
            <div className="pt-4 flex flex-wrap gap-6 text-[11px] text-stone-700 font-sans border-t border-stone-200/60">
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#9B7B56]" />
                <span>Parfums 100% authentiques</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-[#9B7B56]" />
                <span>Livraison partout au Sénégal</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-[#9B7B56]" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Overlay */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-end items-center">
            <div className="relative w-80 h-72">
              <div className="absolute -top-4 right-0 z-20 text-right">
                <p className="italic font-serif text-sm text-[#C5928E] font-medium rotate-[-4deg]">
                  Des marques iconiques pour<br />chaque personnalité.
                </p>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
                alt="Nos Maisons de Parfum"
                fill
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* VIEW A: BRAND CATALOGUE GRID (1:1 MATCH EXEMPLE1.JPEG) */}
      {!selectedBrand ? (
        <section id="maisons-grid" className="space-y-8">
          
          {/* Section Title & Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="text-center sm:text-left w-full sm:w-auto space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-3 text-stone-400 text-xs tracking-widest uppercase font-serif">
                <span className="w-8 h-px bg-stone-300"></span>
                <span>NOS MAISONS DE PARFUM</span>
                <span className="w-8 h-px bg-stone-300"></span>
              </div>
              <p className="text-xs text-stone-500 font-light">
                Choisissez votre maison et découvrez toutes les senteurs disponibles.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Rechercher une maison..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-[#9B7B56]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR FILTERS */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Gender / Senteurs Filter Box */}
              <div className="bg-white border border-stone-200/80 rounded-sm p-4 space-y-3 font-serif shadow-2xs">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center justify-between">
                  <span>FILTRER PAR SENTEUR</span>
                  <Sliders className="w-3.5 h-3.5 text-[#9B7B56]" />
                </h3>

                <button
                  onClick={() => setSelectedGender('all')}
                  className={`w-full flex justify-between items-center py-2 px-2 text-xs transition-colors ${
                    selectedGender === 'all'
                      ? 'font-bold text-[#9B7B56] bg-[#FAF0ED] rounded-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Tous les parfums</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setSelectedGender('femme')}
                  className={`w-full flex justify-between items-center py-2 px-2 text-xs border-t border-stone-100 transition-colors ${
                    selectedGender === 'femme'
                      ? 'font-bold text-[#9B7B56] bg-[#FAF0ED] rounded-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Femme</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setSelectedGender('homme')}
                  className={`w-full flex justify-between items-center py-2 px-2 text-xs border-t border-stone-100 transition-colors ${
                    selectedGender === 'homme'
                      ? 'font-bold text-[#9B7B56] bg-[#FAF0ED] rounded-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Homme</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setSelectedGender('unisexe')}
                  className={`w-full flex justify-between items-center py-2 px-2 text-xs border-t border-stone-100 transition-colors ${
                    selectedGender === 'unisexe'
                      ? 'font-bold text-[#9B7B56] bg-[#FAF0ED] rounded-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Unisexe</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>

            </div>

            {/* RIGHT MAISONS CARDS GRID (1:1 MATCH EXEMPLE1.JPEG) */}
            <div className="lg:col-span-9">
              {filteredBrandsList.length === 0 ? (
                <div className="text-center py-16 bg-white border border-stone-200 rounded-sm p-8 space-y-2">
                  <p className="text-stone-800 font-serif font-bold text-base">Aucune maison de parfum trouvée.</p>
                  <p className="text-xs text-stone-500 font-light">Essayez de modifier vos termes de recherche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {filteredBrandsList.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => setSelectedBrand(b.name)}
                      className="p-4 bg-white border border-stone-200/80 hover:border-[#9B7B56] rounded-sm text-center flex items-center justify-between min-h-[65px] transition-all group shadow-2xs hover:shadow-xs"
                    >
                      <span className="font-serif font-bold text-stone-900 text-xs tracking-wider uppercase truncate">
                        {b.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#9B7B56] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </section>
      ) : (
        /* VIEW B: SELECTED BRAND DETAIL VIEW (1:1 MATCH LOWER HALF OF EXEMPLE1.JPEG) */
        <section className="space-y-8 animate-fadeIn">
          
          {/* BRAND HEADER BANNER */}
          <div className="bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
              <div className="w-24 h-24 bg-white border border-stone-200 rounded-sm p-4 flex items-center justify-center font-serif font-bold text-xl tracking-widest text-stone-900 uppercase">
                {selectedBrand}
              </div>
              <div className="space-y-2 max-w-xl">
                <h2 className="text-3xl font-serif font-bold text-stone-900 uppercase tracking-wide">
                  {selectedBrand}
                </h2>
                <p className="text-xs text-[#9B7B56] font-serif font-semibold italic">
                  L&apos;élégance intemporelle.
                </p>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Découvrez l&apos;univers {selectedBrand}, une maison de parfum emblématique qui incarne le raffinement, la séduction et l&apos;élégance.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBrand(null)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-sm bg-[#E5C1C1] hover:bg-[#d8b0b0] text-stone-900 font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETOUR AUX MAISONS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Senteurs Left Filter Bar */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-stone-200 rounded-sm p-4 space-y-3 font-serif">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
                  FILTRER PAR SENTEUR
                </h3>
                <button
                  onClick={() => setSelectedGender('all')}
                  className={`w-full flex justify-between items-center py-2 text-xs ${
                    selectedGender === 'all' ? 'font-bold text-[#9B7B56]' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Toutes les senteurs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  onClick={() => setSelectedGender('femme')}
                  className={`w-full flex justify-between items-center py-2 text-xs border-t border-stone-100 ${
                    selectedGender === 'femme' ? 'font-bold text-[#9B7B56]' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Femme</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  onClick={() => setSelectedGender('homme')}
                  className={`w-full flex justify-between items-center py-2 text-xs border-t border-stone-100 ${
                    selectedGender === 'homme' ? 'font-bold text-[#9B7B56]' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Homme</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  onClick={() => setSelectedGender('unisexe')}
                  className={`w-full flex justify-between items-center py-2 text-xs border-t border-stone-100 ${
                    selectedGender === 'unisexe' ? 'font-bold text-[#9B7B56]' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Unisexe</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Selected Brand Senteurs Grid */}
            <div className="lg:col-span-9 space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider">
                  LES SENTEURS DISPONIBLES
                </h3>
                <span className="text-[11px] text-stone-500 font-sans">
                  {selectedBrandProducts.length} résultat(s)
                </span>
              </div>

              {selectedBrandProducts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-stone-200 rounded-sm p-8 space-y-3">
                  <p className="text-stone-800 font-serif font-bold text-base">Aucun parfum trouvé pour {selectedBrand}.</p>
                  <p className="text-xs text-stone-500 font-light">Cette maison de parfum n&apos;a pas encore de produits enregistrés.</p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour, je recherche un parfum de la maison ${selectedBrand}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 rounded-sm bg-[#9B7B56] text-white text-xs font-serif font-bold uppercase tracking-wider mt-2"
                  >
                    Demander ce parfum sur WhatsApp
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  {selectedBrandProducts.map((prod) => {
                    return (
                      <div
                        key={prod.id}
                        className="bg-white border border-stone-200/80 rounded-sm p-3.5 flex flex-col justify-between space-y-3 group hover:border-[#9B7B56] transition-all shadow-2xs"
                      >
                        <div className="space-y-2 relative">
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
                            <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-stone-500 font-sans font-light truncate">
                              {prod.categoryName || 'Eau de Parfum'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-1">
                          <Link
                            href={`/parfum/${prod.id}`}
                            className="w-full py-2 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-[10px] uppercase tracking-wider block text-center shadow-2xs transition-colors"
                          >
                            VOIR LES DÉTAILS →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </section>
      )}

    </div>
  );
}
