'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FolderTree, 
  Package, 
  DollarSign, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Loader2
} from 'lucide-react';
import { getCategories } from '@/services/categoriesService';
import { getProducts } from '@/services/productsService';
import { getOrders } from '@/services/ordersService';
import { Category, Product, Order } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [catData, prodData, ordData] = await Promise.all([
          getCategories(),
          getProducts(),
          getOrders(),
        ]);
        setCategories(catData);
        setProducts(prodData);
        setOrders(ordData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const newOrders = orders.filter(o => o.status === 'new');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const shippingOrders = orders.filter(o => o.status === 'shipping' || o.status === 'preparing');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Tableau de Bord
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Vue d&apos;ensemble des performances et des commandes de votre parfumerie.
          </p>
        </div>

        {newOrders.length > 0 && (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>🔴 {newOrders.length} nouvelle(s) commande(s) non traitée(s)</span>
          </div>
        )}
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* PRODUCTS CARD */}
        <Link
          href="/admin/parfums"
          className="p-6 bg-white border border-stone-200 hover:border-amber-700/50 rounded-xl space-y-3 shadow-xs transition-all group"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Total Parfums</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{products.length}</p>
          <div className="flex items-center text-xs text-amber-800 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Gérer les parfums →</span>
          </div>
        </Link>

        {/* NEW ORDERS CARD */}
        <Link
          href="/admin/commandes"
          className={`p-6 border rounded-xl space-y-3 shadow-xs transition-all group ${
            newOrders.length > 0
              ? 'bg-red-50/50 border-red-200 hover:border-red-300'
              : 'bg-white border-stone-200 hover:border-amber-700/50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Nouvelles Commandes</span>
            <div className="p-2 rounded-lg bg-red-100 text-red-700 border border-red-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{newOrders.length}</p>
          <div className="flex items-center text-xs text-amber-800 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Voir les commandes →</span>
          </div>
        </Link>

        {/* REVENUE ESTIMATE CARD */}
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Chiffre d&apos;Affaires</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-800 truncate">{formatPrice(totalRevenue)}</p>
          <p className="text-[10px] text-stone-400">Total cumulé des commandes non annulées</p>
        </div>

      </div>

      {/* ORDERS STATUS BREAKDOWN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center space-x-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-800 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-stone-500">Nouvelles</p>
            <p className="text-lg font-bold text-stone-900">{newOrders.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center space-x-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-stone-500">Confirmées</p>
            <p className="text-lg font-bold text-stone-900">{confirmedOrders.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center space-x-3 shadow-xs">
          <Truck className="w-5 h-5 text-purple-700 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-stone-500">En Livraison</p>
            <p className="text-lg font-bold text-stone-900">{shippingOrders.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center space-x-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-stone-500">Livrées</p>
            <p className="text-lg font-bold text-stone-900">{deliveredOrders.length}</p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS FEED */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Commandes Récentes
          </h2>
          <Link
            href="/admin/commandes"
            className="text-xs font-semibold text-amber-800 hover:underline flex items-center space-x-1"
          >
            <span>Toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-stone-500 py-8 text-center">Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-amber-800 font-bold">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-stone-900">{ord.customerName}</span>
                    <span className="text-xs text-stone-500">({ord.phone})</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Parfum : <strong className="text-stone-900">{ord.productName}</strong> ({ord.sizeMl} mL x{ord.quantity})
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-stone-900">{formatPrice(ord.totalPrice)}</span>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                    ord.status === 'new' ? 'bg-red-50 text-red-800 border-red-200' :
                    ord.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    'bg-stone-100 text-stone-700 border-stone-200'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
