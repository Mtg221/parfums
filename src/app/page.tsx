'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Award,
  HelpCircle
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { Category } from '@/types';
import { DEFAULT_CATEGORY_IMAGES } from '@/lib/cloudinary';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AURA PARFUMS';
  const siteSlogan = process.env.NEXT_PUBLIC_SITE_SLOGAN || "L'Essence du Luxe & de l'Élégance";

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
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text narrative */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Maison de Parfumerie Exclusive</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-neutral-50 leading-[1.1]">
                {siteName} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                  {siteSlogan}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Plongez dans l&apos;univers raffiné de nos élixirs. Une signature olfactive inoubliable, élaborée avec précision pour révéler le prestige et l&apos;élégance de chaque instant.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/catalogue"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Découvrir nos parfums</span>
                </Link>

                <Link
                  href="/comment-commander"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-100 font-medium text-sm tracking-wider uppercase transition-all duration-300"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Comment commander</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Premium luxury Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-950/40 group">
                <Image
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"
                  alt="Aura Parfums Flacon de Luxe"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-neutral-950/70 backdrop-blur-md border border-neutral-800 text-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Haute Concentration</p>
                  <p className="text-sm font-serif font-bold text-amber-100 mt-1">Eaux de Parfum Intenses</p>
                  <p className="text-xs text-neutral-400 mt-1">Sillage envoûtant longue tenue</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION PRÉSENTATION DE LA MARQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900/60 rounded-3xl border border-amber-900/20 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
              Notre Philosophie
            </h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              L&apos;Art de la Haute Parfumerie
            </h3>
            <p className="text-neutral-300 leading-relaxed font-light text-base sm:text-lg">
              Chez <strong className="text-amber-300 font-semibold">{siteName}</strong>, nous croyons qu&apos;un parfum n&apos;est pas un simple accessoire, mais l&apos;empreinte invisible de votre personnalité. Chaque fragrance est soigneusement élaborée pour associer la noblesse des matières premières à la subtilité des accords contemporains.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
              <div className="p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800 space-y-3">
                <Award className="w-8 h-8 text-amber-400" />
                <h4 className="font-serif font-bold text-amber-200 text-lg">Excellence & Qualité</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Des essences concentrées, testées et sélectionnées auprès des meilleurs maîtres parfumeurs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800 space-y-3">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <h4 className="font-serif font-bold text-amber-200 text-lg">Signature Unique</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Des compositions rares qui s&apos;adaptent subtilement au pH de votre peau pour un rendu exclusif.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800 space-y-3">
                <Truck className="w-8 h-8 text-amber-400" />
                <h4 className="font-serif font-bold text-amber-200 text-lg">Service Client & Livraison</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Commandez en un instant via WhatsApp et bénéficiez d&apos;un accompagnement personnalisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION COLLECTIONS (DYNAMIQUES DEPUIS FIRESTORE ET CLOUDINARY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
            Nos Collections
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100">
            Explorez par Catégorie
          </h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto font-light">
            Découvrez nos univers olfactifs spécialement imaginés pour chaque personnalité.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-neutral-900 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/40 rounded-2xl border border-neutral-800">
            <p className="text-neutral-400">Aucune collection disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;

              return (
                <Link
                  key={cat.id}
                  href={`/catalogue/${cat.id}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-amber-900/30 bg-neutral-900 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-400/50"
                >
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent group-hover:via-neutral-950/60 transition-colors" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-neutral-100">
                    <h4 className="text-2xl font-serif font-bold tracking-wide text-amber-100 group-hover:text-amber-300 transition-colors uppercase">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-neutral-300 line-clamp-2 mt-1 font-light opacity-90">
                      {cat.description || 'Découvrir nos créations d\'exception'}
                    </p>
                    <div className="mt-4 inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Découvrir la collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. SECTION PROCESSUS RAPIDE (COMMENT COMMANDER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl border border-neutral-800 p-8 sm:p-12 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Simplicité & Rapidité</span>
            <h3 className="text-3xl font-serif font-bold text-amber-100">Comment commander en quelques clics ?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center mb-3">1</span>
              <h5 className="font-bold text-neutral-200 text-sm">Choisissez votre parfum</h5>
              <p className="text-xs text-neutral-400 mt-1">Parcourez notre catalogue d&apos;exception.</p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center mb-3">2</span>
              <h5 className="font-bold text-neutral-200 text-sm">Sélectionnez le format</h5>
              <p className="text-xs text-neutral-400 mt-1">30 mL, 50 mL ou 100 mL selon vos besoins.</p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center mb-3">3</span>
              <h5 className="font-bold text-neutral-200 text-sm">Validez la commande</h5>
              <p className="text-xs text-neutral-400 mt-1">Votre commande est enregistrée et transmise sur WhatsApp.</p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">4</span>
              <h5 className="font-bold text-neutral-200 text-sm">Livraison rapide</h5>
              <p className="text-xs text-neutral-400 mt-1">Notre équipe confirme et prépare votre colis.</p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/comment-commander"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
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
