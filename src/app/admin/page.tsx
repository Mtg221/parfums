'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FolderTree, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
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
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-900/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100">
            Tableau de Bord
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Vue d&apos;ensemble des performances et des commandes de votre parfumerie.
          </p>
        </div>

        {newOrders.length > 0 && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>🔴 {newOrders.length} nouvelle(s) commande(s) non traitée(s)</span>
          </div>
        )}
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CATEGORIES CARD */}
        <Link
          href="/admin/categories"
          className="p-6 bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 rounded-2xl space-y-3 transition-all group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-semibold text-neutral-400">Total Catégories</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-amber-100">{categories.length}</p>
          <div className="flex items-center text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
            <span>Gérer les catégories →</span>
          </div>
        </Link>

        {/* PRODUCTS CARD */}
        <Link
          href="/admin/parfums"
          className="p-6 bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 rounded-2xl space-y-3 transition-all group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-semibold text-neutral-400">Total Parfums</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-amber-100">{products.length}</p>
          <div className="flex items-center text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
            <span>Gérer les parfums →</span>
          </div>
        </Link>

        {/* NEW ORDERS CARD */}
        <Link
          href="/admin/commandes"
          className={`p-6 border rounded-2xl space-y-3 transition-all group ${
            newOrders.length > 0
              ? 'bg-red-950/20 border-red-900/40 hover:border-red-500'
              : 'bg-neutral-900/80 border-neutral-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-semibold text-neutral-400">Nouvelles Commandes</span>
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-amber-100">{newOrders.length}</p>
          <div className="flex items-center text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
            <span>Voir les commandes →</span>
          </div>
        </Link>

        {/* REVENUE ESTIMATE CARD */}
        <div className="p-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-semibold text-neutral-400">Chiffre d&apos;Affaires</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 truncate">{formatPrice(totalRevenue)}</p>
          <p className="text-[10px] text-neutral-500">Total cumulé des commandes non annulées</p>
        </div>

      </div>

      {/* ORDERS STATUS BREAKDOWN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center space-x-3">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-400">Nouvelles</p>
            <p className="text-lg font-bold text-amber-200">{newOrders.length}</p>
          </div>
        </div>

        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-400">Confirmées</p>
            <p className="text-lg font-bold text-blue-200">{confirmedOrders.length}</p>
          </div>
        </div>

        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center space-x-3">
          <Truck className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-400">En Livraison</p>
            <p className="text-lg font-bold text-purple-200">{shippingOrders.length}</p>
          </div>
        </div>

        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-neutral-400">Livrées</p>
            <p className="text-lg font-bold text-emerald-300">{deliveredOrders.length}</p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS FEED */}
      <div className="bg-neutral-900/80 border border-amber-900/20 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-amber-100">
            Commandes Récents
          </h2>
          <Link
            href="/admin/commandes"
            className="text-xs font-semibold text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>Toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-neutral-400 py-8 text-center">Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div className="divide-y divide-neutral-800">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold text-neutral-200">{ord.customerName}</span>
                    <span className="text-xs text-neutral-400">({ord.phone})</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Parfum : <strong className="text-amber-200">{ord.productName}</strong> ({ord.sizeMl} mL x{ord.quantity})
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-amber-300">{formatPrice(ord.totalPrice)}</span>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                    ord.status === 'new' ? 'bg-red-950 text-red-300 border-red-800' :
                    ord.status === 'confirmed' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                    ord.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                    'bg-neutral-800 text-neutral-300 border-neutral-700'
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
