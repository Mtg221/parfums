'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Eye, 
  Loader2, 
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
        return 'bg-red-50 text-red-800 border-red-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'shipping':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center space-x-3">
            <ShoppingBag className="w-7 h-7 text-amber-800" />
            <span>Gestion des Commandes</span>
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Consultez les commandes reçues, modifiez leur statut et contactez directement vos clients sur WhatsApp.
          </p>
        </div>
      </div>

      {/* STATUS FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 text-amber-800 mr-1" />
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === item.key
                ? 'bg-amber-800 text-white font-bold'
                : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <p className="text-stone-700 font-medium text-sm">Aucune commande ne correspond à ce filtre.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto bg-white border border-stone-200 rounded-xl shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 uppercase font-semibold text-stone-800 border-b border-stone-200">
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
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-800">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-bold text-stone-900">{ord.customerName}</td>
                    <td className="p-4">{ord.phone}</td>
                    <td className="p-4">
                      <span className="font-semibold text-stone-900">{ord.productName}</span> ({ord.sizeMl} mL x{ord.quantity})
                    </td>
                    <td className="p-4 font-bold text-amber-800">{formatPrice(ord.totalPrice)}</td>
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
                        className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                        title="Détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={generateAdminWhatsAppUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-inline-block p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
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
                className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </span>
                    <h2 className="font-bold text-stone-900 text-base">{ord.customerName}</h2>
                    <p className="text-xs text-stone-500">{ord.phone}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(ord.status)}`}>
                    {ord.status}
                  </span>
                </div>

                <div className="text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                  <p>Parfum : <strong className="text-stone-900">{ord.productName}</strong></p>
                  <p>Format : {ord.sizeMl} mL — Qté : {ord.quantity}</p>
                  <p className="text-amber-800 font-bold pt-1 text-sm">Total : {formatPrice(ord.totalPrice)}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-bold text-stone-900"
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
                      className="p-2 rounded-lg bg-stone-100 text-stone-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={generateAdminWhatsAppUrl(ord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-700 text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800">
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Détail de la Commande
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <p className="text-stone-500 uppercase font-semibold text-[10px]">Information Client</p>
                <p className="text-sm font-bold text-stone-900">{selectedOrder.customerName}</p>
                <p className="text-stone-700">Téléphone : <span className="font-mono">{selectedOrder.phone}</span></p>
                <p className="text-stone-700">Adresse : {selectedOrder.address}</p>
                {selectedOrder.notes && (
                  <p className="text-stone-500 italic pt-1">Note : &quot;{selectedOrder.notes}&quot;</p>
                )}
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <p className="text-stone-500 uppercase font-semibold text-[10px]">Article Commandé</p>
                <div className="flex justify-between text-sm font-bold text-stone-900">
                  <span>{selectedOrder.productName}</span>
                  <span className="text-amber-800">{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
                <p className="text-stone-600">
                  Format : {selectedOrder.sizeMl} mL — Quantité : x{selectedOrder.quantity} (Prix unit: {formatPrice(selectedOrder.unitPrice)})
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <p className="text-stone-500 uppercase font-semibold text-[10px]">Mise à jour du statut</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-bold uppercase ${getStatusBadgeClass(selectedOrder.status)}`}
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
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter le client sur WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 rounded-lg bg-stone-100 text-stone-700 font-semibold text-xs uppercase"
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
