'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Loader2, 
  AlertCircle,
  X,
  Filter
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/services/ordersService';
import { Order, OrderStatus } from '@/types';
import { formatPrice, generateAdminWhatsAppUrl } from '@/lib/whatsapp';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Impossible de charger la liste des commandes.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      console.error('Status update failed:', err);
      alert('Échec de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-red-950/80 text-red-300 border-red-800';
      case 'confirmed':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'preparing':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'shipping':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'delivered':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'cancelled':
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
      default:
        return 'bg-neutral-900 text-neutral-300 border-neutral-800';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-900/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 flex items-center space-x-3">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <span>Gestion des Commandes</span>
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Consultez les commandes reçues, modifiez leur statut et contactez directement vos clients sur WhatsApp.
          </p>
        </div>
      </div>

      {/* STATUS FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-neutral-900/60 rounded-2xl border border-neutral-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 text-amber-400 mr-1" />
          Statut :
        </span>

        {[
          { key: 'all', label: 'Toutes' },
          { key: 'new', label: '🔴 Nouvelles' },
          { key: 'confirmed', label: 'Confirmées' },
          { key: 'preparing', label: 'En préparation' },
          { key: 'shipping', label: 'En livraison' },
          { key: 'delivered', label: 'Livrées' },
          { key: 'cancelled', label: 'Annulées' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(item.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filterStatus === item.key
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800">
          <p className="text-neutral-300 font-medium">Aucune commande ne correspond à ce filtre.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto bg-neutral-900/80 border border-amber-900/20 rounded-2xl shadow-xl">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 uppercase font-semibold text-amber-200 border-b border-neutral-800">
                <tr>
                  <th className="p-4">ID Commande</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Téléphone</th>
                  <th className="p-4">Parfum & Format</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-950/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-semibold text-neutral-100">{ord.customerName}</td>
                    <td className="p-4">{ord.phone}</td>
                    <td className="p-4">
                      <span className="font-semibold text-amber-200">{ord.productName}</span> ({ord.sizeMl} mL x{ord.quantity})
                    </td>
                    <td className="p-4 font-bold text-amber-300">{formatPrice(ord.totalPrice)}</td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase focus:outline-none ${getStatusBadgeClass(ord.status)}`}
                      >
                        <option value="new">Nouvelle</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="preparing">En préparation</option>
                        <option value="shipping">En livraison</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition-colors"
                        title="Détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={generateAdminWhatsAppUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-inline-block p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
                        title="Contacter sur WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </span>
                    <h4 className="font-bold text-amber-100 text-base">{ord.customerName}</h4>
                    <p className="text-xs text-neutral-400">{ord.phone}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(ord.status)}`}>
                    {ord.status}
                  </span>
                </div>

                <div className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                  <p>Parfum : <strong className="text-amber-200">{ord.productName}</strong></p>
                  <p>Format : {ord.sizeMl} mL — Qté : {ord.quantity}</p>
                  <p className="text-amber-400 font-bold pt-1 text-sm">Total : {formatPrice(ord.totalPrice)}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-bold text-amber-300"
                  >
                    <option value="new">Nouvelle</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="preparing">En préparation</option>
                    <option value="shipping">En livraison</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-2 rounded-lg bg-neutral-800 text-amber-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={generateAdminWhatsAppUrl(ord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DETAILED ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-900 border border-amber-900/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-xl font-serif font-bold text-amber-100">
                  Détail de la Commande
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <p className="text-neutral-400 uppercase font-semibold text-[10px]">Information Client</p>
                <p className="text-sm font-bold text-amber-100">{selectedOrder.customerName}</p>
                <p className="text-neutral-300">Téléphone : <span className="font-mono">{selectedOrder.phone}</span></p>
                <p className="text-neutral-300">Adresse : {selectedOrder.address}</p>
                {selectedOrder.notes && (
                  <p className="text-neutral-400 italic pt-1">Note : &quot;{selectedOrder.notes}&quot;</p>
                )}
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <p className="text-neutral-400 uppercase font-semibold text-[10px]">Article Commandé</p>
                <div className="flex justify-between text-sm font-bold text-amber-200">
                  <span>{selectedOrder.productName}</span>
                  <span>{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
                <p className="text-neutral-400">
                  Format : {selectedOrder.sizeMl} mL — Quantité : x{selectedOrder.quantity} (Prix unit: {formatPrice(selectedOrder.unitPrice)})
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <p className="text-neutral-400 uppercase font-semibold text-[10px]">Mise à jour du statut</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold uppercase ${getStatusBadgeClass(selectedOrder.status)}`}
                >
                  <option value="new">Nouvelle</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="preparing">En préparation</option>
                  <option value="shipping">En livraison</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={generateAdminWhatsAppUrl(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter le client sur WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 rounded-xl bg-neutral-800 text-neutral-300 font-semibold text-xs uppercase"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
