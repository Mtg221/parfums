'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Truck,
  AlertCircle 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getWhatsAppNumber } from '@/lib/whatsapp';
import { createOrder } from '@/services/ordersService';

export default function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const whatsappNumber = getWhatsAppNumber();

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setCheckoutError(null);
    try {
      // Save order to Firestore for each item or main summary
      for (const item of items) {
        await createOrder({
          customerName,
          phone,
          address,
          notes,
          productId: item.productId,
          productName: item.name,
          categoryId: item.category,
          formatId: item.formatName || 'standard',
          sizeMl: 50,
          quantity: item.quantity,
          unitPrice: item.price,
        });
      }

      // Build WhatsApp order summary message
      let msg = `*NOUVELLE COMMANDE - SONIA'S PERFUMERY*\n\n`;
      msg += `👤 *Client :* ${customerName}\n`;
      msg += `📞 *Téléphone :* ${phone}\n`;
      msg += `📍 *Adresse de livraison :* ${address}\n`;
      if (notes) msg += `📝 *Notes :* ${notes}\n`;
      msg += `\n*ARTICLES COMMANDÉS :*\n`;

      items.forEach((item, index) => {
        msg += `${index + 1}. *${item.name}* (${item.category}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`;
      });

      msg += `\n💰 *TOTAL DE LA COMMANDE : ${formatPrice(subtotal)}*\n`;
      msg += `\nMerci de confirmer la prise en charge de ma commande !`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      
      clearCart();
      setOrderSuccess(true);
      window.open(whatsappUrl, '_blank');
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Une erreur est survenue lors de la validation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 bg-[#FAF9F6] font-sans">
      
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-4 space-y-1">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 uppercase tracking-wide">
          VOTRE PANIER
        </h1>
        <p className="text-xs text-stone-500 font-light">
          Vérifiez vos articles avant d&apos;effectuer votre commande.
        </p>
      </div>

      {orderSuccess ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-4 max-w-2xl mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-emerald-950">Commande envoyée avec succès !</h2>
          <p className="text-xs text-stone-700 leading-relaxed">
            Votre commande a été transmise à notre service client et la fenêtre WhatsApp a été ouverte. Nous préparons votre colis pour une livraison rapide.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-sm bg-[#9B7B56] text-white font-serif font-bold text-xs uppercase tracking-wider mt-2"
          >
            Retourner à l&apos;accueil
          </Link>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-sm p-8 space-y-4 max-w-lg mx-auto shadow-2xs">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-stone-900 uppercase">Votre panier est vide</h2>
          <p className="text-xs text-stone-500 font-light">
            Découvrez nos huiles parfumées, extraits de parfum, parfums authentiques et coffrets pour remplir votre panier.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-sm bg-[#9B7B56] text-white font-serif font-bold text-xs uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explorer la boutique</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ITEMS LIST LEFT */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-stone-200/80 rounded-sm p-4 sm:p-6 space-y-4 shadow-2xs">
              <h2 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
                ARTICLES SÉLECTIONNÉS ({items.length})
              </h2>

              <div className="divide-y divide-stone-100">
                {items.map((item) => {
                  const subtotalItem = item.price * item.quantity;
                  return (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 bg-stone-50 border border-stone-200 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-stone-300" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#9B7B56] font-serif font-bold uppercase tracking-widest block">
                            {item.category}
                          </span>
                          <h3 className="font-serif font-bold text-stone-900 text-sm">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-stone-500 font-sans">
                            Prix unitaire : {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* QUANTITY & ACTIONS */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                        <div className="inline-flex items-center space-x-2 bg-stone-50 border border-stone-200 rounded-sm p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded bg-white text-stone-800 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-stone-900 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded bg-white text-stone-800 hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-stone-900 text-sm font-sans min-w-[80px] text-right">
                          {formatPrice(subtotalItem)}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-serif pt-2">
              <Link href="/" className="text-[#9B7B56] font-bold hover:underline flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continuer mes achats</span>
              </Link>
              <button onClick={clearCart} className="text-stone-400 hover:text-red-600 transition-colors">
                Vider le panier
              </button>
            </div>
          </div>

          {/* ORDER FORM & SUMMARY RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-6 shadow-2xs">
              
              <div className="space-y-2 border-b border-stone-100 pb-4">
                <h2 className="text-base font-serif font-bold text-stone-900 uppercase">
                  RÉSUMÉ DE LA COMMANDE
                </h2>
                <div className="flex justify-between text-sm font-serif pt-1">
                  <span className="text-stone-600">Sous-total :</span>
                  <span className="font-bold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-700 font-sans pt-0.5">
                  <span>Paiement à la livraison :</span>
                  <span className="font-bold">Inclus</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#9B7B56] pt-2 border-t border-stone-100">
                  <span>Total :</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* CHECKOUT FORM */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {checkoutError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-center space-x-2 text-red-800 text-xs font-sans font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Informations de livraison (Sénégal)
                </h3>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase text-stone-700">Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aminata Diallo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-[#9B7B56]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase text-stone-700">Téléphone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 77 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-[#9B7B56]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase text-stone-700">Adresse de livraison *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mermoz / Plateau / Almadies, Dakar"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-[#9B7B56]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase text-stone-700">Notes / Instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Précisions pour le livreur..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-[#9B7B56]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-sm bg-[#9B7B56] hover:bg-[#8C6D46] disabled:opacity-50 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-sm transition-colors mt-4"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{submitting ? 'Validation...' : 'CONFIRMER ET COMMANDER SUR WHATSAPP'}</span>
                </button>
              </form>

              <div className="pt-2 text-[11px] text-stone-500 space-y-1.5 border-t border-stone-100 font-sans">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#9B7B56]" />
                  <span>Livraison partout au Sénégal</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9B7B56]" />
                  <span>Paiement à la livraison après inspection</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
