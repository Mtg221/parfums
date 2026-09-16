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
  Droplet
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { getProducts } from '@/services/productsService';
import { Category, Product } from '@/types';
import { getWhatsAppNumber } from '@/lib/whatsapp';

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  'huiles parfumées': 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
  'extraits de parfum': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'parfums authentiques': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
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
        setFeaturedProducts(prods.slice(0, 8));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FAF9F6]">
      
      {/* 1. HERO SECTION (Light Luxury) */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D8A7B1]/20 via-[#FDF6F7] to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FDF6F7] border border-[#D8A7B1]/40 text-[#B76E79] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plus qu&apos;un parfum, une émotion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            L&apos;élégance olfactive & <br />
            <span className="italic font-normal text-[#B76E79]">l&apos;art des fragrances rares</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Bienvenue chez <strong className="font-semibold text-stone-900">{siteName}</strong>. Découvrez nos huiles parfumées, extraits raffinés et parfums d&apos;exception livrés directement chez vous au Sénégal.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#a25a65] text-white font-semibold text-xs tracking-widest uppercase shadow-md transition-all hover:shadow-lg"
            >
              <span>Explorer la Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite découvrir vos parfums.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs tracking-widest uppercase shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Commander via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ENGAGEMENT & VALEURS (Light Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3 transition-all hover:border-[#D8A7B1]">
            <div className="w-12 h-12 rounded-xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Excellence & Qualité</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Des essences concentrées haut de gamme, sélectionnées auprès des plus grands maîtres parfumeurs.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3 transition-all hover:border-[#D8A7B1]">
            <div className="w-12 h-12 rounded-xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Formats & Sur-Mesure</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Disponibles en 5 mL, 16 mL, 20 mL, 100 mL ainsi qu&apos;en option sur-mesure pour chaque besoin.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3 transition-all hover:border-[#D8A7B1]">
            <div className="w-12 h-12 rounded-xl bg-[#FDF6F7] text-[#B76E79] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Livraison & Service</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Livraison rapide partout au Sénégal et paiement sécurisé à la réception de votre colis.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION NOS COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold tracking-widest text-[#B76E79] uppercase">
            Nos Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Explorez par Catégorie
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Découvrez nos univers olfactifs spécialement imaginés pour chaque personnalité.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-stone-200/60 animate-pulse border border-stone-200" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <p className="text-stone-500 text-sm">Aucune collection disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

              return (
                <Link
                  key={cat.id}
                  href={`/catalogue/${cat.id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#D8A7B1]"
                >
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle soft gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent group-hover:via-stone-950/40 transition-colors" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#FDF6F7] transition-colors uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-200 line-clamp-2 mt-1 font-light opacity-90">
                      {cat.description || 'Découvrez nos fragrances uniques'}
                    </p>
                    <div className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-[#D8A7B1] group-hover:translate-x-1 transition-transform">
                      <span>Explorer la sélection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. NOS PARFUMS D'EXCEPTION */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-semibold tracking-widest text-[#B76E79] uppercase">Sélection Exclusive</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">Nos Meilleures Créations</h2>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-[#B76E79] hover:text-[#a25a65] uppercase tracking-wider"
            >
              <span>Tout le catalogue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/parfum/${prod.id}`}
                className="group rounded-2xl bg-white border border-stone-200 p-4 shadow-xs hover:border-[#D8A7B1] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-xl bg-[#FAF9F6] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                      <Sparkles className="w-10 h-10 text-[#D8A7B1]" />
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#B76E79] tracking-wider">
                      {prod.categoryName || 'Parfum'}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base group-hover:text-[#B76E79] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 font-light">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">
                    {prod.formats?.length ? `Dès ${prod.formats[0].price.toLocaleString('fr-FR')} FCFA` : 'Sur-mesure'}
                  </span>
                  <span className="text-xs font-medium text-[#B76E79] group-hover:translate-x-0.5 transition-transform">
                    Commander &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. GUIDE RAPIDE DE COMMANDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-8 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-[#B76E79] uppercase">Simplicité & Rapidité</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">Comment commander en quelques clics ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/80">
              <span className="w-8 h-8 rounded-full bg-[#FDF6F7] text-[#B76E79] font-bold text-xs flex items-center justify-center mb-3">1</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Choisissez votre parfum</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">Explorez notre catalogue de fragrances d&apos;exception.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/80">
              <span className="w-8 h-8 rounded-full bg-[#FDF6F7] text-[#B76E79] font-bold text-xs flex items-center justify-center mb-3">2</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Sélectionnez le format</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">5 mL, 16 mL, 20 mL, 100 mL ou votre litrage sur-mesure.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/80">
              <span className="w-8 h-8 rounded-full bg-[#FDF6F7] text-[#B76E79] font-bold text-xs flex items-center justify-center mb-3">3</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Validez sur WhatsApp</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">Transmission automatique et échange direct avec notre équipe.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/80">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center mb-3">4</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Livraison rapide</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">Recevez votre parfum partout au Sénégal et payez à la livraison.</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/comment-commander"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#B76E79] hover:text-[#a25a65] uppercase tracking-wider"
            >
              <span>Voir le guide complet de commande</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
