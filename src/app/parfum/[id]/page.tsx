'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Parfum introuvable</h1>
        <p className="text-stone-600 text-sm">Le parfum que vous recherchez n&apos;existe pas ou a été retiré.</p>
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-800 text-white font-bold text-xs uppercase"
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
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux parfums</span>
        </Link>
      </div>

      {/* PRODUCT CONTAINER */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* HEADER & DESCRIPTION */}
        <div className="space-y-3 border-b border-stone-100 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold uppercase">
            <span>Eau de Parfum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            {product.name}
          </h1>

          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
            {product.description || 'Une création parfumée d\'exception élaborée avec passion et raffinement.'}
          </p>
        </div>

        {/* FORMAT SELECTOR */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            1. Choisissez votre format en mL :
          </h2>

          {product.formats.length === 0 ? (
            <p className="text-sm text-stone-500">Aucun format disponible pour ce parfum.</p>
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
                      setQuantity(1);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-700 text-amber-900 ring-1 ring-amber-700/30 shadow-xs'
                        : outOfStock
                        ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                        : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-lg">{fmt.sizeMl} mL</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-800" />}
                    </div>
                    <p className="text-sm font-bold text-amber-800 mt-1">
                      {formatPrice(fmt.price)}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-1">
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
          <div className="p-6 bg-stone-50 rounded-xl border border-stone-200/80 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* QUANTITY COUNTER */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  2. Quantité :
                </label>
                <div className="inline-flex items-center space-x-3 bg-white border border-stone-200 rounded-lg p-1.5 shadow-xs">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1 || isSelectedFormatOutOfStock}
                    className="p-2 rounded bg-stone-100 text-stone-800 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-10 text-center font-bold text-stone-900 text-lg">
                    {quantity}
                  </span>

                  <button
                    onClick={incrementQty}
                    disabled={quantity >= selectedFormat.stock || isSelectedFormatOutOfStock}
                    className="p-2 rounded bg-stone-100 text-stone-800 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TOTAL DISPLAY */}
              <div className="sm:text-right space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Total de la commande :
                </span>
                <p className="text-3xl font-bold text-amber-800">
                  {formatPrice(totalPrice)}
                </p>
                <p className="text-xs text-stone-500 font-light">
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
                className="w-full flex items-center justify-center space-x-2 py-4 px-8 rounded-lg bg-amber-800 hover:bg-amber-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider shadow-sm transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
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
