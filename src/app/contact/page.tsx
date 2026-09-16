'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { getWhatsAppNumber } from '@/lib/whatsapp';

export default function ContactPage() {
  const whatsappNumber = getWhatsAppNumber();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AURA PARFUMS';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER BANNER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-amber-900 text-xs font-semibold uppercase">
          <span>Service Client & Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
          Contactez-nous
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-light leading-relaxed">
          Notre équipe est à votre entière disposition pour vous conseiller et répondre à toutes vos questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT DETAILS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Nos Coordonnées
            </h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <Phone className="w-5 h-5 text-amber-800 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900 text-xs">Téléphone Direct</h3>
                  <p className="text-stone-700 mt-0.5">+{whatsappNumber}</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Du Lundi au Samedi: 9h - 20h</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <MessageCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-950 text-xs">Assistance WhatsApp</h3>
                  <p className="text-stone-700 mt-0.5">Réponse rapide & conseils personnalisés</p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite contacter votre service client.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-semibold text-emerald-800 hover:underline mt-1"
                  >
                    Ouvrir une discussion WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <Mail className="w-5 h-5 text-amber-800 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900 text-xs">Adresse Email</h3>
                  <p className="text-stone-700 mt-0.5">contact@auraparfums.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <MapPin className="w-5 h-5 text-amber-800 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900 text-xs">Boutique & Showroom</h3>
                  <p className="text-stone-700 mt-0.5">Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Livraison express dans toute la région</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INQUIRY FORM */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Envoyez-nous un Message
            </h2>

            {sent ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-emerald-950">Message envoyé !</h3>
                <p className="text-xs text-stone-700 font-light">
                  Merci pour votre message. Notre équipe {siteName} vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Votre Nom
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fatou Sow"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Votre Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: fatou@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Votre Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs tracking-wider uppercase shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer le message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
