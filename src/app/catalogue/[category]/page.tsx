'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* NAVIGATION BACK BUTTON */}
      <div>
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux collections</span>
        </Link>
      </div>

      {/* CATEGORY BANNER HEADER */}
      <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-8 sm:p-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-amber-900 text-xs font-semibold uppercase">
          <span>Collection {category?.name || ''}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
          Parfums {category?.name || ''}
        </h1>
        
        {category?.description && (
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* PRODUCTS LIST GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
          <p className="text-stone-700 font-medium text-sm">Aucun parfum enregistré dans cette catégorie pour le moment.</p>
          <Link
            href="/catalogue"
            className="inline-block text-xs font-semibold text-amber-800 hover:underline"
          >
            Découvrir d&apos;autres collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const lowestPrice = product.formats.length > 0 
              ? Math.min(...product.formats.map(f => f.price))
              : 0;

            const isOutOfStock = product.formats.every(f => f.stock <= 0);

            return (
              <div
                key={product.id}
                className="bg-white border border-stone-200 hover:border-amber-700/40 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-serif font-bold text-stone-900">{product.name}</h2>
                    {isOutOfStock ? (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        Épuisé
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        En Stock
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                    {product.description || 'Une eau de parfum d\'exception aux notes captivantes.'}
                  </p>
                </div>

                {/* FORMATS CHIPS SUMMARY */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <div className="flex flex-wrap gap-2">
                    {product.formats.map((fmt) => (
                      <span
                        key={fmt.id}
                        className={`text-xs px-2.5 py-1 rounded-md border ${
                          fmt.stock > 0
                            ? 'bg-stone-50 text-stone-700 border-stone-200'
                            : 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                        }`}
                      >
                        {fmt.sizeMl} mL — {formatPrice(fmt.price)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-stone-400">À partir de</p>
                      <p className="text-lg font-bold text-amber-800">
                        {lowestPrice > 0 ? formatPrice(lowestPrice) : 'Prix variable'}
                      </p>
                    </div>

                    <Link
                      href={`/parfum/${product.id}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold uppercase tracking-wider transition-colors"
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
