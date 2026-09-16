'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, CheckCircle2, MessageCircle, Truck, ArrowRight } from 'lucide-react';

export default function HowToOrderPage() {
  const steps = [
    {
      num: '01',
      title: 'Choisissez votre parfum',
      desc: 'Parcourez nos collections (Homme, Femme, Unisexe, Oriental) et sélectionnez la fragrance qui vous inspire.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'Choisissez votre format en mL',
      desc: 'Chaque parfum est décliné sous plusieurs formats (30 mL, 50 mL, 100 mL...). Choisissez celui qui vous convient.',
      icon: ShoppingBag,
    },
    {
      num: '03',
      title: 'Choisissez la quantité',
      desc: 'Ajustez le nombre de flacons souhaités grâce au compteur de quantité.',
      icon: CheckCircle2,
    },
    {
      num: '04',
      title: 'Cliquez sur "Commander"',
      desc: 'Renseignez vos coordonnées de livraison (Nom, Téléphone, Adresse) sur le formulaire sécurisé.',
      icon: ShoppingBag,
    },
    {
      num: '05',
      title: 'Redirection automatique vers WhatsApp',
      desc: 'Votre commande est enregistrée dans notre système et un message WhatsApp prérempli avec vos détails s\'ouvre immédiatement.',
      icon: MessageCircle,
    },
    {
      num: '06',
      title: 'Confirmation par notre équipe',
      desc: 'Notre service client valide instantanément votre commande avec vous sur WhatsApp.',
      icon: CheckCircle2,
    },
    {
      num: '07',
      title: 'Livraison à domicile',
      desc: 'Recevez votre colis d\'exception selon les modalités de livraison disponibles.',
      icon: Truck,
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* HEADER BANNER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Guide de Commande</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-amber-100">
          Comment Passer Commande ?
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Un parcours simple, rapide et sécurisé en 7 étapes pour recevoir vos parfums préférés.
        </p>
      </div>

      {/* STEPS LIST */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-neutral-900/80 border border-amber-900/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xl transition-all duration-300 hover:border-amber-500/40"
            >
              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-2xl font-serif font-bold text-amber-400/80 bg-amber-500/10 border border-amber-500/30 w-12 h-12 rounded-xl flex items-center justify-center">
                  {step.num}
                </span>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 sm:hidden">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-grow space-y-1">
                <h3 className="text-lg font-serif font-bold text-amber-100">{step.title}</h3>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">{step.desc}</p>
              </div>

              <div className="hidden sm:block p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CALL TO ACTION */}
      <div className="text-center pt-6">
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all duration-300"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Découvrir nos parfums et commander</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
