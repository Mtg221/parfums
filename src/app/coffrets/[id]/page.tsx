'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, ShoppingBag, CheckCircle2, Gift, Loader2, PackageCheck } from 'lucide-react';
import { getProductById } from '@/services/productsService';
import { Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

export default function CoffretDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const coffretId = resolvedParams.id;

  const [coffret, setCoffret] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    async function loadCoffret() {
      try {
        if (coffretId.startsWith('coffret-')) {
          setCoffret({
            id: coffretId,
            name: coffretId === 'coffret-1' ? 'Coffret Élégance Royale' : coffretId === 'coffret-2' ? 'Coffret Senteurs d\'Orient' : 'Coffret Prestige Féminin',
            description: 'Un coffret cadeau d\'exception conçu avec soin pour offrir une expérience olfactive unique.',
            formats: [{ id: 'fmt-c', sizeMl: 100, price: 35000, stock: 10 }],
            imageUrl: '',
            images: [],
            coffretContent: ['Parfum Haute Concentration 50ml', 'Huile Parfumée 16ml', 'Extrait Rapprochement 20ml'],
            priceCoffret: 35000,
            isCoffret: true,
            stock: 10,
          });
        } else {
          const prod = await getProductById(coffretId);
          if (prod) setCoffret(prod);
        }
      } catch (err) {
        console.error('Error fetching coffret detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCoffret();
  }, [coffretId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-[#9B7B56] animate-spin" />
      </div>
    );
  }

  if (!coffret) {
    return (
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Coffret introuvable</h1>
        <p className="text-stone-600 text-sm">Le coffret demandé n&apos;existe pas ou n&apos;est plus disponible.</p>
        <Link
          href="/coffrets"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-sm bg-[#9B7B56] text-white font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux coffrets</span>
        </Link>
      </div>
    );
  }

  const price = coffret.priceCoffret || coffret.formats?.[0]?.price || 35000;
  const totalPrice = price * quantity;
  const contentList = coffret.coffretContent && coffret.coffretContent.length > 0 
    ? coffret.coffretContent 
    : ['Parfum principal 50ml', 'Huile parfumée 16ml', 'Flacon de voyage', 'Écrin coffret de luxe'];

  const handleAddToCart = () => {
    addItem({
      productId: coffret.id,
      name: coffret.name,
      brand: coffret.brand || 'Coffret Cadeau',
      category: 'Coffret',
      imageUrl: coffret.imageUrl,
      price: price,
      quantity: quantity,
      formatName: 'Écrin Cadeau',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-[#FAF9F6] font-sans">
      <div>
        <Link
          href="/coffrets"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#9B7B56] hover:text-[#886744] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux coffrets</span>
        </Link>
      </div>

      {added && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold text-center flex items-center justify-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Le coffret &quot;{coffret.name}&quot; a bien été ajouté à votre panier !</span>
          <Link href="/panier" className="underline text-emerald-950 font-bold ml-2">Voir mon panier →</Link>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-10 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* GALLERY LEFT */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square bg-stone-50 border border-stone-200 rounded-sm overflow-hidden flex items-center justify-center">
            {coffret.imageUrl ? (
              <Image
                src={coffret.imageUrl}
                alt={coffret.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Gift className="w-16 h-16 text-stone-300" />
            )}
          </div>

          {/* Thumbnail Gallery */}
          {coffret.images && coffret.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {coffret.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-stone-50 border border-stone-200 rounded-sm overflow-hidden cursor-pointer">
                  <Image src={img} alt={`${coffret.name} ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS RIGHT */}
        <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF0ED] text-[#9B7B56] text-[10px] font-bold uppercase tracking-widest border border-[#E8D5D0]">
              <Gift className="w-3.5 h-3.5" />
              <span>COFFRET DE LUXE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              {coffret.name}
            </h1>

            <p className="text-2xl font-bold text-[#9B7B56] font-sans">
              {formatPrice(price)}
            </p>

            <p className="text-xs text-stone-600 font-light leading-relaxed">
              {coffret.description}
            </p>

            {/* Content Box */}
            <div className="p-4 bg-[#FAF0ED] border border-[#E8D5D0] rounded-sm space-y-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 flex items-center space-x-1.5">
                <PackageCheck className="w-4 h-4 text-[#9B7B56]" />
                <span>CONTENU DÉTAILLÉ DU COFFRET :</span>
              </span>
              <ul className="text-xs text-stone-700 space-y-1 pl-5 list-disc font-sans">
                {contentList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-stone-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Disponibilité : <strong className="text-stone-800">En stock</strong> (Stock limité)</span>
            </div>
          </div>

          {/* QUANTITY & ADD TO CART */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Quantité :</span>
              <div className="inline-flex items-center space-x-3 bg-stone-50 border border-stone-200 rounded-sm p-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded bg-white text-stone-800 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-stone-900 text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-1.5 rounded bg-white text-stone-800 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] text-white font-serif font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>AJOUTER AU PANIER ({formatPrice(totalPrice)})</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
