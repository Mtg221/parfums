'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Sparkles, Send, CheckCircle2 } from 'lucide-react';
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
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* HEADER BANNER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Service Client & Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-amber-100">
          Contactez-nous
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Notre équipe est à votre entière disposition pour vous conseiller et répondre à toutes vos questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT DETAILS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900/80 border border-amber-900/20 rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-amber-100">
              Nos Coordonnées
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <Phone className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">Téléphone Direct</h4>
                  <p className="text-neutral-300 mt-0.5">+{whatsappNumber}</p>
                  <p className="text-xs text-neutral-500 mt-1">Du Lundi au Samedi: 9h - 20h</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <MessageCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm">Assistance WhatsApp</h4>
                  <p className="text-neutral-300 mt-0.5">Réponse rapide & conseils personnalisés</p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Bonjour, je souhaite contacter votre service client.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-inline-block text-xs font-semibold text-emerald-400 hover:underline mt-1"
                  >
                    Ouvrir une discussion WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <Mail className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">Adresse Email</h4>
                  <p className="text-neutral-300 mt-0.5">contact@auraparfums.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">Boutique & Showroom</h4>
                  <p className="text-neutral-300 mt-0.5">Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
                  <p className="text-xs text-neutral-500 mt-1">Livraison express dans toute la région</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INQUIRY FORM */}
        <div className="lg:col-span-7">
          <div className="bg-neutral-900/80 border border-amber-900/20 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-amber-100">
              Envoyez-nous un Message
            </h3>

            {sent ? (
              <div className="p-8 text-center space-y-4 bg-neutral-950 rounded-2xl border border-emerald-900/40">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-serif font-bold text-emerald-300">Message envoyé !</h4>
                <p className="text-sm text-neutral-300">
                  Merci pour votre message. Notre équipe {siteName} vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                      Votre Nom
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fatou Sow"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                      Votre Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: fatou@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Votre Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all duration-300"
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
