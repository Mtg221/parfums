'use client';

import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle, CheckCircle2, Loader2, PackageCheck } from 'lucide-react';
import { Product, ProductFormat, OrderFormData } from '@/types';
import { formatPrice, generateCustomerOrderWhatsAppUrl } from '@/lib/whatsapp';
import { createOrder } from '@/services/ordersService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedFormat: ProductFormat;
  quantity: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedFormat,
  quantity,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const totalPrice = selectedFormat.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Veuillez saisir votre nom complet.');
      return;
    }
    if (!phone.trim()) {
      setError('Veuillez saisir votre numéro de téléphone.');
      return;
    }
    if (!address.trim()) {
      setError('Veuillez indiquer votre adresse de livraison.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload: OrderFormData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        productId: product.id,
        productName: product.name,
        categoryId: product.categoryId || '',
        formatId: selectedFormat.id,
        sizeMl: selectedFormat.sizeMl,
        quantity,
      };

      const createdOrder = await createOrder(orderPayload);
      setSuccessOrder(createdOrder);

      const whatsappUrl = generateCustomerOrderWhatsAppUrl(createdOrder);
      window.open(whatsappUrl, '_blank');

    } catch (err: any) {
      console.error('Order error:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-stone-200 rounded-2xl shadow-xl text-stone-900">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-amber-800" />
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Finaliser votre commande
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER RECAP BANNER */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">{product.name}</h3>
                <p className="text-xs text-stone-600">Format : {selectedFormat.sizeMl} mL</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80">
                Qté: {quantity}
              </span>
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-amber-200/60 text-xs">
              <span className="text-stone-600">Total à régler :</span>
              <span className="text-lg font-bold text-amber-900">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* SUCCESS SCREEN */}
          {successOrder ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-xl font-serif font-bold text-emerald-900">
                Commande enregistrée avec succès !
              </h3>
              <p className="text-xs text-stone-600 font-light">
                Votre commande a bien été enregistrée. WhatsApp s&apos;est ouvert pour envoyer votre récapitulatif.
              </p>
              <div className="pt-2 flex flex-col space-y-2">
                <a
                  href={generateCustomerOrderWhatsAppUrl(successOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs tracking-wider uppercase transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Réouvrir WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* CUSTOMER FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Nom complet <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Abdou Ndiaye"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Numéro de téléphone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 77 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Adresse de livraison / Ville <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dakar, Sacré-Cœur 3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Commentaire / Instructions de livraison (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instructions spécifiques pour le livreur..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs tracking-wider uppercase shadow-xs transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Création de la commande...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirmer et Commander sur WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
