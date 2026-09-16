'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, MessageCircle, Truck, ArrowRight } from 'lucide-react';

export default function HowToOrderPage() {
  const steps = [
    {
      num: '01',
      title: 'Choisissez votre parfum',
      desc: 'Parcourez nos collections (Homme, Femme, Unisexe, Oriental) et sélectionnez la fragrance qui vous inspire.',
      icon: ShoppingBag,
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
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER BANNER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/60 text-amber-900 text-xs font-semibold uppercase">
          <span>Guide de Commande</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
          Comment Passer Commande ?
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-light leading-relaxed">
          Un parcours simple, rapide et sécurisé en 7 étapes pour recevoir vos parfums préférés.
        </p>
      </div>

      {/* STEPS LIST */}
      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white border border-stone-200 hover:border-amber-700/40 rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 shadow-xs transition-colors"
            >
              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-xl font-serif font-bold text-amber-800 bg-amber-50 border border-amber-200 w-11 h-11 rounded-lg flex items-center justify-center">
                  {step.num}
                </span>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-amber-800 sm:hidden">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-grow space-y-1">
                <h2 className="text-base font-serif font-bold text-stone-900">{step.title}</h2>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{step.desc}</p>
              </div>

              <div className="hidden sm:block p-3 rounded-lg bg-stone-50 border border-stone-200 text-amber-800 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CALL TO ACTION */}
      <div className="text-center pt-4">
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs tracking-wider uppercase shadow-xs transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Découvrir nos parfums et commander</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
