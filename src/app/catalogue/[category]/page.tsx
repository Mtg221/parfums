'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { getProductsByCategory } from '@/services/productsService';
import { getCategoryById } from '@/services/categoriesService';
import { Category, Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.category;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const [catData, prodData] = await Promise.all([
          getCategoryById(categoryId),
          getProductsByCategory(categoryId),
        ]);
        setCategory(catData);
        setProducts(prodData);
      } catch (err) {
        console.error('Error loading category products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [categoryId]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* NAVIGATION BACK BUTTON */}
      <div>
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux collections</span>
        </Link>
      </div>

      {/* CATEGORY BANNER HEADER */}
      <div className="bg-neutral-900/60 border border-amber-900/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Collection {category?.name || ''}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100">
          Parfums {category?.name || ''}
        </h1>
        
        {category?.description && (
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* PRODUCTS LIST GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
          <p className="text-neutral-300 font-medium">Aucun parfum enregistré dans cette catégorie pour le moment.</p>
          <Link
            href="/catalogue"
            className="inline-block text-xs font-semibold text-amber-400 hover:underline"
          >
            Découvrir d&apos;autres collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            // Find lowest price format
            const lowestPrice = product.formats.length > 0 
              ? Math.min(...product.formats.map(f => f.price))
              : 0;

            const isOutOfStock = product.formats.every(f => f.stock <= 0);

            return (
              <div
                key={product.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-serif font-bold text-amber-100">{product.name}</h3>
                    {isOutOfStock ? (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                        Épuisé
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        En Stock
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                    {product.description || 'Une eau de parfum d\'exception aux notes captivantes.'}
                  </p>
                </div>

                {/* FORMATS CHIPS SUMMARY */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <div className="flex flex-wrap gap-2">
                    {product.formats.map((fmt) => (
                      <span
                        key={fmt.id}
                        className={`text-xs px-2.5 py-1 rounded-lg border ${
                          fmt.stock > 0
                            ? 'bg-neutral-950 text-neutral-300 border-neutral-800'
                            : 'bg-neutral-950/40 text-neutral-500 border-neutral-900 line-through'
                        }`}
                      >
                        {fmt.sizeMl} mL — {formatPrice(fmt.price)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">À partir de</p>
                      <p className="text-lg font-bold text-amber-400">
                        {lowestPrice > 0 ? formatPrice(lowestPrice) : 'Prix variable'}
                      </p>
                    </div>

                    <Link
                      href={`/parfum/${product.id}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                    >
                      <span>Voir le parfum</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
