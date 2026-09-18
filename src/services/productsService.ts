import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, ProductFormat } from '@/types';
import { getCategoryById } from './categoriesService';

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const catIds: string[] = data.categoryIds || (data.categoryId ? [data.categoryId] : []);
      const catNames: string[] = data.categoryNames || (data.categoryName ? [data.categoryName] : []);

      products.push({
        id: docSnap.id,
        name: data.name || '',
        brand: data.brand || '',
        description: data.description || '',
        categoryId: data.categoryId || (catIds[0] || ''),
        categoryName: data.categoryName || (catNames[0] || ''),
        categoryIds: catIds,
        categoryNames: catNames,
        imageUrl: data.imageUrl || '',
        images: data.images || [],
        formats: data.formats || [],
        priceHuile: data.priceHuile,
        priceExtrait: data.priceExtrait,
        priceAuthentic: data.priceAuthentic,
        priceCoffret: data.priceCoffret,
        isAuthentic: data.isAuthentic ?? false,
        isCoffret: data.isCoffret ?? false,
        coffretContent: data.coffretContent || [],
        active: data.active ?? true,
        allowCustomVolume: data.allowCustomVolume ?? true,
        isBestSeller: data.isBestSeller ?? true,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductsByCategory(idOrSlug: string): Promise<Product[]> {
  try {
    const allProducts = await getProducts();
    const cat = await getCategoryById(idOrSlug);

    const targetId = cat ? cat.id : idOrSlug;
    const targetName = cat ? cat.name.toLowerCase() : idOrSlug.toLowerCase().replace(/-/g, ' ');

    return allProducts.filter(p => {
      if (p.categoryId === targetId) return true;
      if (p.categoryIds && p.categoryIds.includes(targetId)) return true;

      const pCatName = (p.categoryName || '').toLowerCase();
      const pCatNames = (p.categoryNames || []).map(n => n.toLowerCase());

      const keywords = targetName.split(' ').filter(w => w.length > 3);
      for (const kw of keywords) {
        if (pCatName.includes(kw)) return true;
        if (pCatNames.some(n => n.includes(kw))) return true;
      }

      return false;
    });
  } catch (error) {
    console.error(`Error fetching products for category ${idOrSlug}:`, error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    const catIds: string[] = data.categoryIds || (data.categoryId ? [data.categoryId] : []);
    const catNames: string[] = data.categoryNames || (data.categoryName ? [data.categoryName] : []);

    return {
      id: docSnap.id,
      name: data.name || '',
      brand: data.brand || '',
      description: data.description || '',
      categoryId: data.categoryId || (catIds[0] || ''),
      categoryName: data.categoryName || (catNames[0] || ''),
      categoryIds: catIds,
      categoryNames: catNames,
      imageUrl: data.imageUrl || '',
      images: data.images || [],
      formats: data.formats || [],
      priceHuile: data.priceHuile,
      priceExtrait: data.priceExtrait,
      priceAuthentic: data.priceAuthentic,
      priceCoffret: data.priceCoffret,
      isAuthentic: data.isAuthentic ?? false,
      isCoffret: data.isCoffret ?? false,
      coffretContent: data.coffretContent || [],
      active: data.active ?? true,
      allowCustomVolume: data.allowCustomVolume ?? true,
      isBestSeller: data.isBestSeller ?? true,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

export async function createProduct(data: {
  name: string;
  brand?: string;
  description: string;
  categoryId?: string;
  categoryName?: string;
  categoryIds?: string[];
  categoryNames?: string[];
  imageUrl?: string;
  formats: ProductFormat[];
  allowCustomVolume?: boolean;
  isBestSeller?: boolean;
}): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      categoryIds: data.categoryIds || (data.categoryId ? [data.categoryId] : []),
      categoryNames: data.categoryNames || (data.categoryName ? [data.categoryName] : []),
      allowCustomVolume: data.allowCustomVolume ?? true,
      isBestSeller: data.isBestSeller ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    brand?: string;
    description: string;
    categoryId: string;
    categoryName?: string;
    categoryIds?: string[];
    categoryNames?: string[];
    imageUrl?: string;
    formats: ProductFormat[];
    allowCustomVolume?: boolean;
    isBestSeller?: boolean;
  }>
): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}
