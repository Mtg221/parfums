import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, ProductFormat } from '@/types';

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        id: docSnap.id,
        name: data.name || '',
        brand: data.brand || '',
        description: data.description || '',
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        imageUrl: data.imageUrl || '',
        formats: data.formats || [],
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

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, where('categoryId', '==', categoryId));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        id: docSnap.id,
        name: data.name || '',
        brand: data.brand || '',
        description: data.description || '',
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        imageUrl: data.imageUrl || '',
        formats: data.formats || [],
        allowCustomVolume: data.allowCustomVolume ?? true,
        isBestSeller: data.isBestSeller ?? true,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      });
    });
    return products;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || '',
      brand: data.brand || '',
      description: data.description || '',
      categoryId: data.categoryId || '',
      categoryName: data.categoryName || '',
      imageUrl: data.imageUrl || '',
      formats: data.formats || [],
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
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  formats: ProductFormat[];
  allowCustomVolume?: boolean;
  isBestSeller?: boolean;
}): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
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
