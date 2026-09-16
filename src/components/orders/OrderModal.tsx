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
        categoryId: product.categoryId,
        formatId: selectedFormat.id,
        sizeMl: selectedFormat.sizeMl,
        quantity,
      };

      // Step 1: Save order to Firestore first (Requirement #16)
      const createdOrder = await createOrder(orderPayload);
      setSuccessOrder(createdOrder);

      // Step 2: Generate WhatsApp URL
      const whatsappUrl = generateCustomerOrderWhatsAppUrl(createdOrder);

      // Step 3: Open WhatsApp in new window
      window.open(whatsappUrl, '_blank');

    } catch (err: any) {
      console.error('Order error:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-amber-900/30 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-amber-900/20">
          <div className="flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-amber-100">
              Finaliser votre commande
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER RECAP BANNER */}
        <div className="p-6 space-y-6">
          <div className="p-4 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-serif font-bold text-lg text-amber-200">{product.name}</h4>
                <p className="text-sm text-neutral-400">Format : {selectedFormat.sizeMl} mL</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Qté: {quantity}
              </span>
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-neutral-800 text-sm">
              <span className="text-neutral-400">Total à régler :</span>
              <span className="text-lg font-bold text-amber-400">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* SUCCESS SCREEN IF ORDER COMPLETED */}
          {successOrder ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-xl font-serif font-bold text-emerald-300">
                Commande enregistrée avec succès !
              </h4>
              <p className="text-sm text-neutral-300">
                Votre commande a bien été enregistrée dans notre système. WhatsApp s&apos;est ouvert pour envoyer votre récapitulatif.
              </p>
              <div className="pt-4 flex flex-col space-y-3">
                <a
                  href={generateCustomerOrderWhatsAppUrl(successOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Réouvrir WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-sm font-medium hover:bg-neutral-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* CUSTOMER FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-900/40 rounded-xl flex items-center space-x-3 text-red-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Nom complet <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Abdou Ndiaye"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Numéro de téléphone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 77 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Adresse de livraison / Ville <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dakar, Sacré-Cœur 3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Commentaire / Instructions de livraison (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instructions spécifiques pour le livreur..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm tracking-wide shadow-lg shadow-emerald-950/50 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Création de la commande...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
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
