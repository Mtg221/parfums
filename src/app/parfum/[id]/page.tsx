'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Plus, Minus, ShoppingBag, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getProductById } from '@/services/productsService';
import { Product, ProductFormat } from '@/types';
import { formatPrice } from '@/lib/whatsapp';
import { OrderModal } from '@/components/orders/OrderModal';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const prod = await getProductById(productId);
        if (prod) {
          setProduct(prod);
          // Default to first available format or first format in list
          if (prod.formats && prod.formats.length > 0) {
            const inStockFormat = prod.formats.find(f => f.stock > 0) || prod.formats[0];
            setSelectedFormat(inStockFormat);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <h1 className="text-3xl font-serif font-bold text-amber-100">Parfum introuvable</h1>
        <p className="text-neutral-400 text-sm">Le parfum que vous recherchez n&apos;existe pas ou a été retiré.</p>
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-amber-500 text-neutral-950 font-bold text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
    );
  }

  const isSelectedFormatOutOfStock = selectedFormat ? selectedFormat.stock <= 0 : true;
  const totalPrice = selectedFormat ? selectedFormat.price * quantity : 0;

  const incrementQty = () => {
    if (!selectedFormat) return;
    if (quantity < selectedFormat.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* BACK BUTTON */}
      <div>
        <Link
          href={product.categoryId ? `/catalogue/${product.categoryId}` : '/catalogue'}
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux parfums</span>
        </Link>
      </div>

      {/* PRODUCT CARD CONTAINER */}
      <div className="bg-neutral-900/80 border border-amber-900/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* HEADER & DESCRIPTION */}
        <div className="space-y-4 border-b border-neutral-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Eau de Parfum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100">
            {product.name}
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
            {product.description || 'Une création parfumée d\'exception élaborée avec passion et raffinement.'}
          </p>
        </div>

        {/* FORMAT SELECTOR */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
            1. Choisissez votre format en mL :
          </h3>

          {product.formats.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucun format disponible pour ce parfum.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {product.formats.map((fmt) => {
                const isSelected = selectedFormat?.id === fmt.id || selectedFormat?.sizeMl === fmt.sizeMl;
                const outOfStock = fmt.stock <= 0;

                return (
                  <button
                    key={fmt.id || fmt.sizeMl}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => {
                      setSelectedFormat(fmt);
                      setQuantity(1); // Reset qty on format change
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/50'
                        : outOfStock
                        ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-50'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-lg">{fmt.sizeMl} mL</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-sm font-semibold text-amber-300 mt-1">
                      {formatPrice(fmt.price)}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      {outOfStock ? 'Stock épuisé' : `Stock : ${fmt.stock} disponible(s)`}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* QUANTITY & TOTAL PRICE SECTION */}
        {selectedFormat && (
          <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* QUANTITY COUNTER */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  2. Quantité :
                </label>
                <div className="inline-flex items-center space-x-3 bg-neutral-900 border border-neutral-800 rounded-xl p-1.5">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1 || isSelectedFormatOutOfStock}
                    className="p-2 rounded-lg bg-neutral-800 text-amber-100 hover:bg-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-10 text-center font-bold text-amber-100 text-lg">
                    {quantity}
                  </span>

                  <button
                    onClick={incrementQty}
                    disabled={quantity >= selectedFormat.stock || isSelectedFormatOutOfStock}
                    className="p-2 rounded-lg bg-neutral-800 text-amber-100 hover:bg-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TOTAL DISPLAY */}
              <div className="sm:text-right space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Total de la commande :
                </span>
                <p className="text-3xl font-bold text-amber-400">
                  {formatPrice(totalPrice)}
                </p>
                <p className="text-xs text-neutral-500">
                  ({quantity} x {selectedFormat.sizeMl} mL à {formatPrice(selectedFormat.price)})
                </p>
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSelectedFormatOutOfStock}
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center space-x-3 py-4 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-950 font-bold text-base uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isSelectedFormatOutOfStock ? 'Rupture de stock' : 'Commander ce parfum'}</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ORDER CHECKOUT MODAL */}
      {selectedFormat && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
          selectedFormat={selectedFormat}
          quantity={quantity}
        />
      )}

    </div>
  );
}
