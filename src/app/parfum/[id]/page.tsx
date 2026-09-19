'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, ShoppingBag, CheckCircle2, Sliders, Loader2 } from 'lucide-react';
import { getProductById } from '@/services/productsService';
import { Product, ProductFormat } from '@/types';
import { formatPrice } from '@/lib/whatsapp';
import { OrderModal } from '@/components/orders/OrderModal';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | null>(null);
  const [isCustomFormat, setIsCustomFormat] = useState<boolean>(false);
  const [customMl, setCustomMl] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const { addItem } = useCart();

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
        <Loader2 className="w-8 h-8 text-[#9E7B56] animate-spin" />
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
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-sm bg-[#9E7B56] text-white font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
    );
  }

  // Calculate price per mL from available formats (e.g. average price/mL or first format price/mL)
  const basePricePerMl = product.formats.length > 0
    ? Math.round(product.formats[0].price / (product.formats[0].sizeMl || 1))
    : 300;

  const customPrice = customMl * basePricePerMl;

  const activeFormat: ProductFormat = isCustomFormat
    ? {
        id: 'custom-' + customMl,
        sizeMl: customMl,
        price: customPrice,
        stock: 99,
      }
    : (selectedFormat || {
        id: 'default',
        sizeMl: 5,
        price: 5000,
        stock: 10,
      });

  const isSelectedFormatOutOfStock = !isCustomFormat && activeFormat.stock <= 0;
  const totalPrice = activeFormat.price * quantity;

  const incrementQty = () => {
    if (quantity < (activeFormat.stock || 99)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || isSelectedFormatOutOfStock) return;
    const formatName = isCustomFormat ? `Sur-mesure (${activeFormat.sizeMl} mL)` : `${activeFormat.sizeMl} mL`;
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      category: product.categoryName || 'Parfum',
      imageUrl: product.imageUrl,
      price: activeFormat.price,
      quantity: quantity,
      formatName: formatName,
    });
    setAddedMessage(`"${product.name}" (${formatName}) ajouté au panier avec succès !`);
    setTimeout(() => setAddedMessage(null), 4000);
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {addedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold text-center animate-fadeIn">
          {addedMessage}
        </div>
      )}
      
      {/* BACK BUTTON */}
      <div>
        <Link
          href={product.categoryId ? `/catalogue/${product.categoryId}` : '/catalogue'}
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#9E7B56] hover:text-[#886744] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux parfums</span>
        </Link>
      </div>

      {/* PRODUCT CONTAINER */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* HEADER & DESCRIPTION */}
        <div className="space-y-3 border-b border-stone-100 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F5ECE9] border border-amber-300/40 text-[#9E7B56] text-xs font-semibold uppercase">
            <span>{product.categoryName || 'Eau de Parfum'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            {product.name}
          </h1>

          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
            {product.description || 'Une création parfumée d\'exception élaborée avec passion et raffinement.'}
          </p>
        </div>

        {/* FORMAT SELECTOR (5 mL, 16 mL, 20 mL, 100 mL + CUSTOM FORMAT OPTION) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              1. Choisissez votre format (mL) :
            </h2>
            <span className="text-[11px] text-[#9E7B56] font-medium">Formats standards & Sur-mesure</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {product.formats.map((fmt) => {
              const isSelected = !isCustomFormat && selectedFormat?.id === fmt.id;
              const outOfStock = fmt.stock <= 0;

              return (
                <button
                  key={fmt.id || fmt.sizeMl}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => {
                    setIsCustomFormat(false);
                    setSelectedFormat(fmt);
                    setQuantity(1);
                  }}
                  className={`p-3.5 rounded-md border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#F5ECE9] border-[#9E7B56] text-stone-900 ring-1 ring-[#9E7B56]/40 shadow-xs'
                      : outOfStock
                      ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                      : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-base">{fmt.sizeMl} mL</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#9E7B56]" />}
                  </div>
                  <p className="text-xs font-bold text-[#9E7B56] mt-1">
                    {formatPrice(fmt.price)}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    {outOfStock ? 'Épuisé' : `Stock : ${fmt.stock}`}
                  </p>
                </button>
              );
            })}

            {/* CUSTOM SIZE OPTION (PERSONNALISÉ SUR-MESURE) */}
            {product.allowCustomVolume !== false && (
              <button
                type="button"
                onClick={() => {
                  setIsCustomFormat(true);
                  setQuantity(1);
                }}
                className={`p-3.5 rounded-md border text-left transition-all relative overflow-hidden ${
                  isCustomFormat
                    ? 'bg-amber-50 border-[#9E7B56] text-stone-900 ring-1 ring-[#9E7B56]/40 shadow-xs'
                    : 'bg-stone-50 border-dashed border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-serif font-bold text-xs uppercase flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#9E7B56]" />
                    <span>Sur-mesure</span>
                  </span>
                  {isCustomFormat && <CheckCircle2 className="w-4 h-4 text-[#9E7B56]" />}
                </div>
                <p className="text-[11px] font-semibold text-[#9E7B56] mt-1">
                  Choisir son mL
                </p>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Volume au choix
                </p>
              </button>
            )}
          </div>

          {/* CUSTOM ML INPUT IF CUSTOM OPTION IS ACTIVE */}
          {isCustomFormat && (
            <div className="p-4 bg-amber-50/60 border border-amber-300/60 rounded-md space-y-2 animate-fadeIn">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                Indiquez le volume exact de votre choix (en mL) :
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={customMl}
                  onChange={(e) => setCustomMl(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 font-bold focus:outline-none focus:border-[#9E7B56]"
                />
                <span className="text-xs text-stone-600 font-medium">mL</span>
                <span className="text-xs text-[#9E7B56] font-bold">
                  (Prix estimé : {formatPrice(customPrice)})
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-light">
                Notre équipe préparera un flacon exactement ajusté à votre besoin de {customMl} mL.
              </p>
            </div>
          )}

        </div>

        {/* QUANTITY & TOTAL PRICE SECTION */}
        <div className="p-6 bg-[#F9F5F1] rounded-md border border-stone-200 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* QUANTITY COUNTER */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Quantité :
              </label>
              <div className="inline-flex items-center space-x-3 bg-white border border-stone-200 rounded-md p-1.5 shadow-xs">
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
                  disabled={isSelectedFormatOutOfStock}
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
              <p className="text-3xl font-bold text-[#9E7B56]">
                {formatPrice(totalPrice)}
              </p>
              <p className="text-xs text-stone-500 font-light">
                ({quantity} x {activeFormat.sizeMl} mL à {formatPrice(activeFormat.price)})
              </p>
            </div>

          </div>

          {/* ACTION BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSelectedFormatOutOfStock}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 py-4 px-8 rounded-sm bg-[#9E7B56] hover:bg-[#886744] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isSelectedFormatOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ORDER CHECKOUT MODAL */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        selectedFormat={activeFormat}
        quantity={quantity}
      />

    </div>
  );
}
