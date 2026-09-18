'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  Heart 
} from 'lucide-react';
import { getBrands, Brand } from '@/services/brandsService';
import { getProducts } from '@/services/productsService';
import { Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

function ExtraitsParfumsContent() {
  const searchParams = useSearchParams();
  const initialMaison = searchParams.get('maison');

  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialMaison || null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const whatsappNumber = getWhatsAppNumber();
  const { addItem } = useCart();

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
        console.error('Failed to load Extraits de Parfum data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBrandsList = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBrandProducts = selectedBrand
    ? products.filter(p => p.brand && p.brand.toUpperCase() === selectedBrand.toUpperCase())
    : [];

  const handleAddToCart = (prod: Product) => {
    // Distinct pricing for Extraits de Parfum
    const price = prod.priceExtrait || (prod.formats?.[0]?.price ? Math.round(prod.formats[0].price * 1.3) : 8000);
    addItem({
      productId: prod.id,
      name: prod.name,
      brand: prod.brand,
      category: 'Extrait de parfum',
      imageUrl: prod.imageUrl,
      price: price,
      quantity: 1,
      formatName: 'Extrait 50ml',
    });
    setAddedMessage(`"${prod.name}" (Extrait de Parfum) ajouté au panier !`);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-[#FAF9F6] font-sans">
      
      {/* HERO BANNER */}
      <section className="relative bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm p-8 sm:p-12 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] font-serif font-bold uppercase tracking-[0.25em] text-[#9B7B56] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HAUTE CONCENTRATION</span>
            </span>

            <h1 className="text-4xl sm:text-5xl font-serif">
              <span className="font-bold text-stone-900 block uppercase">EXTRAITS DE PARFUM</span>
              <span className="italic font-serif text-[#C5928E] block -mt-1">Sillage Longue Tenue</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md leading-relaxed">
              Des fragrances intenses aux huiles essentielles rares. Sélectionnez votre maison de parfum pour découvrir les extraits d&apos;exception.
            </p>
          </div>

          <div className="lg:col-span-5 relative hidden lg:flex justify-end items-center">
            <div className="relative w-72 h-64 border border-stone-200/50 rounded-sm overflow-hidden bg-stone-100/50 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-[#9B7B56]/30" />
            </div>
          </div>
        </div>
      </section>

      {addedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold text-center animate-fadeIn">
          {addedMessage}
        </div>
      )}

      {/* VIEW A: MAISONS GRID */}
      {!selectedBrand ? (
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-serif font-bold text-stone-900 uppercase tracking-wider">
                SÉLECTIONNEZ UNE MAISON DE PARFUM
              </h2>
              <p className="text-xs text-stone-500 font-light">
                Choisissez une maison pour afficher ses extraits de parfum.
              </p>
            </div>

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

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#9B7B56] animate-spin" />
            </div>
          ) : filteredBrandsList.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200 rounded-sm p-8 space-y-2">
              <p className="text-stone-800 font-serif font-bold text-base">Aucune maison trouvée.</p>
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
        </section>
      ) : (
        /* VIEW B: PRODUCTS FOR SELECTED MAISON */
        <section className="space-y-8 animate-fadeIn">
          <div className="bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] text-[#9B7B56] font-serif font-bold uppercase tracking-widest">
                EXTRAITS DE PARFUM
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 uppercase tracking-wide">
                MAISON {selectedBrand}
              </h2>
              <p className="text-xs text-stone-600 font-light mt-1">
                Découvrez la collection d&apos;extraits de parfum d&apos;exception de la maison {selectedBrand}.
              </p>
            </div>

            <button
              onClick={() => setSelectedBrand(null)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-white hover:bg-stone-100 border border-stone-300 text-stone-900 font-serif font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Changer de Maison</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider">
              EXTRAITS DE PARFUM DISPONIBLES ({selectedBrandProducts.length})
            </h3>

            {selectedBrandProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-stone-200 rounded-sm p-8 space-y-3">
                <p className="text-stone-800 font-serif font-bold text-base">Aucun extrait de parfum enregistré pour {selectedBrand}.</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour, je recherche un extrait de parfum de la maison ${selectedBrand}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 rounded-sm bg-[#9B7B56] text-white text-xs font-serif font-bold uppercase tracking-wider mt-2"
                >
                  Commander via WhatsApp
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {selectedBrandProducts.map((prod) => {
                  const displayPrice = prod.priceExtrait || (prod.formats?.[0]?.price ? Math.round(prod.formats[0].price * 1.3) : 8000);
                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-stone-200/80 rounded-sm p-4 flex flex-col justify-between space-y-4 group hover:border-[#9B7B56] transition-all shadow-2xs"
                    >
                      <div className="space-y-3 relative">
                        <button className="absolute top-2 right-2 z-10 text-stone-400 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>

                        <div className="relative aspect-square bg-stone-50 rounded-sm overflow-hidden flex items-center justify-center p-2 border border-stone-100">
                          {prod.imageUrl ? (
                            <Image
                              src={prod.imageUrl}
                              alt={prod.name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Sparkles className="w-10 h-10 text-stone-300" />
                          )}
                        </div>

                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-[#9B7B56] font-serif font-bold uppercase tracking-widest block">
                            Extrait de Parfum
                          </span>
                          <h4 className="font-serif font-bold text-stone-900 text-base truncate">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-stone-500 font-sans font-light line-clamp-2">
                            {prod.description}
                          </p>
                          <p className="text-sm font-bold text-stone-900 font-sans pt-1">
                            {formatPrice(displayPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="w-full py-2.5 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-xs uppercase tracking-wider block text-center shadow-2xs transition-colors"
                        >
                          AJOUTER AU PANIER
                        </button>
                        <Link
                          href={`/parfum/${prod.id}`}
                          className="w-full py-2 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-800 font-serif font-semibold text-[10px] uppercase tracking-wider block text-center transition-colors"
                        >
                          VOIR LES DÉTAILS
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}

export default function ExtraitsParfumsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-[#9B7B56] animate-spin" />
      </div>
    }>
      <ExtraitsParfumsContent />
    </Suspense>
  );
}
