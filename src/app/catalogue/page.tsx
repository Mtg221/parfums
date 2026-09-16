'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
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
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Collections d&apos;Exception</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-amber-100">
          Nos Catégories de Parfums
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto font-light">
          Sélectionnez une collection ci-dessous pour découvrir nos eaux de parfum et choisir votre format idéal.
        </p>
      </div>

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
          <p className="text-neutral-300 font-medium">Aucune catégorie disponible pour le moment.</p>
          <p className="text-xs text-neutral-500">Revenez bientôt pour découvrir nos nouvelles collections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

            return (
              <Link
                key={cat.id}
                href={`/catalogue/${cat.id}`}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-amber-900/30 bg-neutral-900 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-400/60"
              >
                <Image
                  src={imageSrc}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent group-hover:via-neutral-950/50 transition-colors" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end text-neutral-100">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
                    Collection
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-neutral-300 line-clamp-3 mt-2 font-light leading-relaxed">
                    {cat.description || 'Découvrez nos fragrances pour cette catégorie.'}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-200">Voir les parfums</span>
                    <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-950 transition-all">
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-neutral-950" />
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
