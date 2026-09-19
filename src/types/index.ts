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
  categoryId?: string; // Optional category ID
  categoryName?: string;
  categoryIds?: string[]; // Multiple categories / universes
  categoryNames?: string[];
  imageUrl?: string;
  images?: string[]; // Gallery images
  formats: ProductFormat[];
  priceHuile?: number; // Separate price for Huile Parfumée
  priceExtrait?: number; // Separate price for Extrait de Parfum
  priceAuthentic?: number; // Price for Authentic Parfum
  priceCoffret?: number; // Price for Coffret
  isAuthentic?: boolean;
  isCoffret?: boolean;
  coffretContent?: string[]; // E.g. ["Parfum A x 1", "Huile B x 1"]
  active?: boolean;
  stock?: number;
  gender?: 'homme' | 'femme' | 'unisexe';
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
