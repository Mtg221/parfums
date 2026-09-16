'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Heart, 
  Filter, 
  Building2, 
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { getProducts } from '@/services/productsService';
import { getBrands, Brand } from '@/services/brandsService';
import { Category, Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';

export default function CataloguePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const whatsappNumber = getWhatsAppNumber();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catData, brandData, prodData] = await Promise.all([
          getCategories().catch(() => []),
          getBrands().catch(() => []),
          getProducts().catch(() => []),
        ]);
        setCategories(catData);
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

  // Filtered Products Calculation
  const filteredProducts = products.filter((p) => {
    const matchesBrand = selectedBrandFilter === 'all' || 
      (p.brand && p.brand.toUpperCase() === selectedBrandFilter.toUpperCase());
    
    const matchesCategory = selectedCategoryFilter === 'all' ||
      p.categoryId === selectedCategoryFilter ||
      (p.categoryIds && p.categoryIds.includes(selectedCategoryFilter));

    return matchesBrand && matchesCategory;
  });

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-[#FAF9F6]">
      
      {/* 1. CATALOGUE HEADER BANNER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FDF6F7] border border-[#D8A7B1]/60 text-[#B76E79] text-xs font-serif font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalogue Officiel SONIA’S PERFUMERY</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight uppercase">
          CATALOGUE DE PARFUMS
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto font-sans font-light leading-relaxed">
          Découvrez nos collections d&apos;exception, explorez les plus grandes maisons de parfum et choisissez vos flacons ou déclinaisons sur-mesure.
        </p>
      </div>

      {/* 2. NOS MAISONS DE PARFUM (BRAND GRID & FILTERS) */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center space-x-2.5 text-stone-900">
            <Building2 className="w-5 h-5 text-[#B76E79]" />
            <h2 className="font-serif font-bold text-lg sm:text-xl uppercase tracking-wider">
              NOS MAISONS DE PARFUM
            </h2>
          </div>
          {selectedBrandFilter !== 'all' && (
            <button
              onClick={() => setSelectedBrandFilter('all')}
              className="text-xs text-[#B76E79] hover:underline font-semibold"
            >
              Afficher toutes les maisons
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <button
            onClick={() => setSelectedBrandFilter('all')}
            className={`p-4 rounded-xl border text-center font-serif text-xs font-bold uppercase transition-all ${
              selectedBrandFilter === 'all'
                ? 'bg-[#B76E79] text-white border-[#B76E79] shadow-xs'
                : 'bg-[#FAF9F6] text-stone-700 border-stone-200 hover:border-[#D8A7B1]'
            }`}
          >
            Toutes ({products.length})
          </button>
          {brands.map((b) => {
            const isSelected = selectedBrandFilter.toUpperCase() === b.name.toUpperCase();
            const count = products.filter(p => p.brand && p.brand.toUpperCase() === b.name.toUpperCase()).length;

            return (
              <button
                key={b.id}
                onClick={() => setSelectedBrandFilter(b.name)}
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#B76E79] text-white border-[#B76E79] shadow-xs font-bold'
                    : 'bg-[#FAF9F6] text-stone-900 border-stone-200 hover:border-[#D8A7B1]'
                }`}
              >
                <span className="font-serif font-bold text-xs uppercase tracking-wider">{b.name}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                  {count} parfum{count > 1 ? 's' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. NOS UNIVERS & CATÉGORIES FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <Filter className="w-4 h-4 text-[#B76E79]" />
          <span>Filtrer par univers :</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#B76E79] text-white font-bold'
                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            Tous les univers
          </button>
          {categories.map((c) => {
            const isSelected = selectedCategoryFilter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(c.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? 'bg-[#B76E79] text-white font-bold'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FULL PRODUCTS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#B76E79] animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-xs">
          <p className="text-stone-700 font-serif font-bold text-lg">Aucun parfum trouvé pour ce filtre.</p>
          <p className="text-xs text-stone-500 font-sans">Essayez de réinitialiser vos filtres de recherche.</p>
          <button
            onClick={() => {
              setSelectedBrandFilter('all');
              setSelectedCategoryFilter('all');
            }}
            className="inline-block text-xs font-semibold text-[#B76E79] hover:underline uppercase pt-2"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const firstFmt = prod.formats?.[0] || { sizeMl: 5, price: 15000 };
            const displayImage = prod.imageUrl || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={prod.id}
                className="group rounded-2xl bg-white border border-stone-200 p-5 shadow-xs hover:border-[#D8A7B1] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3 relative">
                  
                  {/* Heart Icon Top Right */}
                  <button className="absolute top-2 right-2 z-10 text-stone-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>

                  <div className="relative aspect-square rounded-xl bg-[#FAF9F6] overflow-hidden border border-stone-100">
                    <Image
                      src={displayImage}
                      alt={prod.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#B76E79] uppercase tracking-wider shadow-xs border border-stone-200">
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

                  {/* Formats chips */}
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
                      {formatPrice(firstFmt.price)}
                    </span>
                  </div>

                  <Link
                    href={`/parfum/${prod.id}`}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#a25a65] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander ce parfum</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
