'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Gift, 
  Loader2, 
  Heart,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { getProducts } from '@/services/productsService';
import { Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

export default function CoffretsPage() {
  const [coffrets, setCoffrets] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const whatsappNumber = getWhatsAppNumber();
  const { addItem } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const prodsData = await getProducts();
        // Filter products that are coffrets or fallbacks
        const coffretList = prodsData.filter(p => p.isCoffret || p.categoryName?.toLowerCase().includes('coffret'));
        
        setCoffrets(coffretList);
      } catch (err) {
        console.error('Failed to load Coffrets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddToCart = (coffret: Product) => {
    const price = coffret.priceCoffret || (coffret.formats?.[0]?.price) || 35000;
    addItem({
      productId: coffret.id,
      name: coffret.name,
      brand: coffret.brand || 'Coffret Cadeau',
      category: 'Coffret',
      imageUrl: coffret.imageUrl,
      price: price,
      quantity: 1,
      formatName: 'Écrin Cadeau',
    });
    setAddedMessage(`"${coffret.name}" ajouté au panier !`);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-[#FAF9F6] font-sans">
      
      {/* HERO BANNER */}
      <section className="relative bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm p-8 sm:p-12 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] font-serif font-bold uppercase tracking-[0.25em] text-[#9B7B56] flex items-center space-x-1.5">
              <Gift className="w-3.5 h-3.5" />
              <span>ENSEMBLES CADEAUX D&apos;EXCEPTION</span>
            </span>

            <h1 className="text-4xl sm:text-5xl font-serif">
              <span className="font-bold text-stone-900 block uppercase">NOS COFFRETS</span>
              <span className="italic font-serif text-[#C5928E] block -mt-1">& Écrins Olfactifs</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md leading-relaxed">
              Offrez l&apos;élégance absolue. Des coffrets cadeaux soigneusement préparés réunissant parfums, huiles et accessoires rares.
            </p>
          </div>

          <div className="lg:col-span-5 relative hidden lg:flex justify-end items-center">
            <div className="relative w-72 h-64 border border-stone-200/50 rounded-sm overflow-hidden bg-stone-100/50 flex items-center justify-center">
              <Gift className="w-16 h-16 text-[#9B7B56]/30" />
            </div>
          </div>
        </div>
      </section>

      {addedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold text-center animate-fadeIn">
          {addedMessage}
        </div>
      )}

      {/* COFFRETS GRID */}
      <div className="space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 uppercase tracking-wider">
            COFFRETS DISPONIBLES ({coffrets.length})
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Découvrez nos ensembles cadeaux complets prêts à offrir.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#9B7B56] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coffrets.map((coffret) => {
              const displayPrice = coffret.priceCoffret || (coffret.formats?.[0]?.price) || 35000;
              const contentList = coffret.coffretContent && coffret.coffretContent.length > 0 
                ? coffret.coffretContent 
                : ['Parfum 50ml', 'Huile parfumée 16ml', 'Écrin de luxe'];

              return (
                <div
                  key={coffret.id}
                  className="bg-white border border-stone-200/80 rounded-sm p-5 flex flex-col justify-between space-y-4 group hover:border-[#9B7B56] transition-all shadow-2xs"
                >
                  <div className="space-y-3 relative">
                    <button className="absolute top-2 right-2 z-10 text-stone-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>

                    <div className="relative aspect-[4/3] bg-stone-50 rounded-sm overflow-hidden flex items-center justify-center border border-stone-100">
                      {coffret.imageUrl ? (
                        <Image
                          src={coffret.imageUrl}
                          alt={coffret.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Gift className="w-12 h-12 text-stone-300" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-[#9B7B56] font-serif font-bold uppercase tracking-widest block">
                        Coffret Cadeau
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 text-lg">
                        {coffret.name}
                      </h3>
                      <p className="text-xs text-stone-600 font-sans font-light leading-relaxed">
                        {coffret.description}
                      </p>

                      {/* Content Details */}
                      <div className="pt-2 border-t border-stone-100 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-stone-500 flex items-center space-x-1">
                          <PackageCheck className="w-3.5 h-3.5 text-[#9B7B56]" />
                          <span>Contenu du coffret :</span>
                        </span>
                        <ul className="text-xs text-stone-700 space-y-0.5 pl-4 list-disc font-sans">
                          {contentList.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <p className="text-base font-bold text-stone-900 font-sans">
                          {formatPrice(displayPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => handleAddToCart(coffret)}
                      className="w-full py-3 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-xs uppercase tracking-wider block text-center shadow-2xs transition-colors"
                    >
                      AJOUTER AU PANIER
                    </button>
                    <Link
                      href={`/coffrets/${coffret.id}`}
                      className="w-full py-2 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-800 font-serif font-semibold text-[10px] uppercase tracking-wider block text-center transition-colors"
                    >
                      VOIR LE COFFRET
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
