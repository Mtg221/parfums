'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Diamond, 
  Loader2, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { getProducts } from '@/services/productsService';
import { Product } from '@/types';
import { getWhatsAppNumber, formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

export default function ParfumsAuthentiquesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const whatsappNumber = getWhatsAppNumber();
  const { addItem } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const prodsData = await getProducts();
        setProducts(prodsData);
      } catch (err) {
        console.error('Failed to load Parfums Authentiques:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    const isAuthenticType = (p.isAuthentic || p.priceAuthentic) && !p.isCoffret;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return isAuthenticType && matchesSearch;
  });

  const handleAddToCart = (prod: Product) => {
    const price = prod.priceAuthentic || (prod.formats?.[0]?.price) || 25000;
    addItem({
      productId: prod.id,
      name: prod.name,
      brand: prod.brand,
      category: 'Parfum authentique',
      imageUrl: prod.imageUrl,
      price: price,
      quantity: 1,
      formatName: 'Flacon d\'Origine',
    });
    setAddedMessage(`"${prod.name}" (Parfum Authentique) ajouté au panier !`);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-[#FAF9F6] font-sans">
      
      {/* HERO BANNER */}
      <section className="relative bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm p-8 sm:p-12 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] font-serif font-bold uppercase tracking-[0.25em] text-[#9B7B56] flex items-center space-x-1.5">
              <Diamond className="w-3.5 h-3.5" />
              <span>FLACONS D&apos;ORIGINE & MARQUES OFFICIELLES</span>
            </span>

            <h1 className="text-4xl sm:text-5xl font-serif">
              <span className="font-bold text-stone-900 block uppercase">PARFUMS AUTHENTIQUES</span>
              <span className="italic font-serif text-[#C5928E] block -mt-1">Haute Parfumerie Rares</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md leading-relaxed">
              Les grandes marques internationales dans leurs flacons et packagings d&apos;origine scellés, garantis 100% authentiques.
            </p>
          </div>

          <div className="lg:col-span-5 relative hidden lg:flex justify-end items-center">
            <div className="relative w-72 h-64 border border-stone-200/50 rounded-sm overflow-hidden bg-stone-100/50 flex items-center justify-center">
              <Diamond className="w-16 h-16 text-[#9B7B56]/30" />
            </div>
          </div>
        </div>
      </section>

      {addedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold text-center animate-fadeIn">
          {addedMessage}
        </div>
      )}

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 uppercase tracking-wider">
            CATALOGUE DES PARFUMS AUTHENTIQUES ({filteredProducts.length})
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Découvrez nos flacons scellés en stock et prêts à être livrés partout au Sénégal.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Rechercher par parfum ou marque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-[#9B7B56]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#9B7B56] animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-sm p-8 space-y-3">
          <p className="text-stone-800 font-serif font-bold text-base">Aucun parfum authentique trouvé.</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je recherche un parfum authentique spécifique.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-sm bg-[#9B7B56] text-white text-xs font-serif font-bold uppercase tracking-wider"
          >
            Demander sur WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const displayPrice = prod.priceAuthentic || (prod.formats?.[0]?.price) || 25000;
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
                      <Diamond className="w-10 h-10 text-stone-300" />
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] text-[#9B7B56] font-serif font-bold uppercase tracking-widest block">
                      {prod.brand || 'Parfum Authentique'}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base truncate">
                      {prod.name}
                    </h3>
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
  );
}
