'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { Category } from '@/types';
import { DEFAULT_CATEGORY_IMAGES } from '@/lib/cloudinary';

export default function CataloguePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* HEADER BANNER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold tracking-wider uppercase">
          <span>Collections d&apos;Exception</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
          Nos Catégories de Parfums
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-light">
          Sélectionnez une collection ci-dessous pour découvrir nos eaux de parfum et choisir votre format idéal.
        </p>
      </div>

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
          <p className="text-stone-700 font-medium text-sm">Aucune catégorie disponible pour le moment.</p>
          <p className="text-xs text-stone-500">Revenez bientôt pour découvrir nos nouvelles collections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

            return (
              <Link
                key={cat.id}
                href={`/catalogue/${cat.id}`}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-700/50"
              >
                <Image
                  src={imageSrc}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent group-hover:via-stone-950/40 transition-colors" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold mb-1">
                    Collection
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-white group-hover:text-amber-200 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-stone-200 line-clamp-3 mt-1.5 font-light leading-relaxed">
                    {cat.description || 'Découvrez nos fragrances pour cette catégorie.'}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-200">Voir les parfums</span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-amber-700 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
