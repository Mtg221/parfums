import { Order } from '@/types';

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

export const getWhatsAppNumber = (): string => {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '221768360829';
  return rawNumber.replace(/[^0-9]/g, '');
};

export const generateCustomerOrderWhatsAppUrl = (order: Partial<Order>): string => {
  const number = getWhatsAppNumber();
  const formatLabel = order.sizeMl && order.sizeMl > 0 ? `${order.sizeMl} mL` : "Flacon d'origine";
  
  const text = `Bonjour, je souhaite passer une commande.

Parfum : ${order.productName}
Format : ${formatLabel}
Prix unitaire : ${formatPrice(order.unitPrice || 0)}
Quantité : ${order.quantity}
Total : ${formatPrice(order.totalPrice || 0)}

Nom : ${order.customerName}
Téléphone : ${order.phone}
Adresse : ${order.address}${order.notes ? `\nNote : ${order.notes}` : ''}
ID Commande : ${order.id || 'N/A'}

Merci.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const generateAdminWhatsAppUrl = (order: Order): string => {
  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
  const formatLabel = order.sizeMl && order.sizeMl > 0 ? `${order.sizeMl} mL` : "Flacon d'origine";
  
  const text = `Bonjour ${order.customerName},

Nous vous contactons concernant votre commande #${order.id.slice(0, 8).toUpperCase()}.

Produit : ${order.productName}
Format : ${formatLabel}
Quantité : ${order.quantity}
Total : ${formatPrice(order.totalPrice)}

Merci.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
