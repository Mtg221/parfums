export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

export interface ProductFormat {
  id: string;
  sizeMl: number; // size in mL, e.g. 30, 50, 100
  price: number; // price in FCFA
  stock: number; // available quantity
}

export interface Product {
  id: string;
  name: string;
  brand?: string; // Maison de Parfum (e.g. Dior, Chanel, YSL)
  description: string;
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  formats: ProductFormat[];
  allowCustomVolume?: boolean; // If true, customer can choose custom mL
  isBestSeller?: boolean; // Display in Best-Sellers section
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  
  productId: string;
  productName: string;
  categoryId: string;
  categoryName?: string;
  
  formatId: string;
  sizeMl: number;
  quantity: number;
  
  unitPrice: number;
  totalPrice: number;
  
  status: OrderStatus;
  whatsappOpened: boolean;
  
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

export interface OrderFormData {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  productId: string;
  productName: string;
  categoryId: string;
  formatId: string;
  sizeMl: number;
  quantity: number;
}
