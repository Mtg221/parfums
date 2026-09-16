'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Award,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { Category } from '@/types';
import { DEFAULT_CATEGORY_IMAGES } from '@/lib/cloudinary';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SONIA’S PERFUMERY";
  const siteSlogan = process.env.NEXT_PUBLIC_SITE_SLOGAN || "L'Essence de l'Élégance & du Raffinement";

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#faf9f6] via-amber-50/30 to-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold tracking-wider uppercase">
                <span>Maison de Parfumerie Exclusive</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1.15]">
                {siteName} <br />
                <span className="text-amber-800 italic font-normal">
                  {siteSlogan}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Plongez dans l&apos;univers raffiné de nos élixirs. Une signature olfactive inoubliable, élaborée avec précision pour révéler le prestige et l&apos;élégance de chaque instant.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/catalogue"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs tracking-wider uppercase shadow-sm transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Découvrir nos parfums</span>
                </Link>

                <Link
                  href="/comment-commander"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-medium text-xs tracking-wider uppercase transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-800" />
                  <span>Comment commander</span>
                </Link>
              </div>
            </div>

            {/* Right Column Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-stone-200 shadow-md group">
                <Image
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"
                  alt="SONIA’S PERFUMERY Flacon de Luxe"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-stone-200 text-stone-900">
                  <p className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold">Haute Concentration</p>
                  <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">Eaux de Parfum Intenses</p>
                  <p className="text-xs text-stone-500 mt-0.5 font-light">Sillage envoûtant longue tenue</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PRÉSENTATION DE LA MARQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/40 rounded-2xl border border-amber-200/60 p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
              Notre Philosophie
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              L&apos;Art de la Haute Parfumerie
            </h2>
            <p className="text-stone-600 leading-relaxed font-light text-base sm:text-lg">
              Chez <strong className="text-stone-900 font-semibold">{siteName}</strong>, nous croyons qu&apos;un parfum n&apos;est pas un simple accessoire, mais l&apos;empreinte invisible de votre personnalité. Chaque fragrance est soigneusement élaborée pour associer la noblesse des matières premières à la subtilité des accords contemporains.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
              <div className="p-6 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                <Award className="w-6 h-6 text-amber-800" />
                <h3 className="font-serif font-bold text-stone-900 text-base">Excellence & Qualité</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Des essences concentrées, sélectionnées auprès des meilleurs maîtres parfumeurs.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                <Sparkles className="w-6 h-6 text-amber-800" />
                <h3 className="font-serif font-bold text-stone-900 text-base">Signature Unique</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Des compositions rares qui s&apos;adaptent subtilement à la peau pour un rendu exclusif.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                <Truck className="w-6 h-6 text-amber-800" />
                <h3 className="font-serif font-bold text-stone-900 text-base">Livraison & Service</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Commandez en un instant via WhatsApp et bénéficiez d&apos;un accompagnement dédié.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
            Nos Collections
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            Explorez par Catégorie
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto font-light">
            Découvrez nos univers olfactifs spécialement imaginés pour chaque personnalité.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-stone-200 animate-pulse border border-stone-300" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-500 text-sm">Aucune collection disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

              return (
                <Link
                  key={cat.id}
                  href={`/catalogue/${cat.id}`}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-700/50"
                >
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent group-hover:via-stone-950/40 transition-colors" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-amber-200 transition-colors uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-200 line-clamp-2 mt-1 font-light opacity-90">
                      {cat.description || 'Découvrir nos créations d\'exception'}
                    </p>
                    <div className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-300 group-hover:translate-x-1 transition-transform">
                      <span>Découvrir la collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. GUIDE RAPIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center space-y-8 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-emerald-800 uppercase">Simplicité & Rapidité</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Comment commander en quelques clics ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-3">1</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Choisissez votre parfum</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">Parcourez notre catalogue d&apos;exception.</p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-3">2</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Sélectionnez le format</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">30 mL, 50 mL ou 100 mL selon vos besoins.</p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-3">3</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Validez la commande</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">Enregistrement sécurisé et transmission WhatsApp.</p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center mb-3">4</span>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Livraison rapide</h3>
              <p className="text-xs text-stone-500 mt-1 font-light">Notre équipe prépare et livre votre colis.</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/comment-commander"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-800 hover:text-amber-900 uppercase tracking-wider"
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
