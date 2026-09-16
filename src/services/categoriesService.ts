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
import { Category } from '@/types';

const CATEGORIES_COLLECTION = 'categories';

export async function getCategories(): Promise<Category[]> {
  try {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const categories: Category[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      categories.push({
        id: docSnap.id,
        name: data.name || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || '',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    };
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
}

export async function createCategory(data: { name: string; description: string; imageUrl: string }): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, data: Partial<{ name: string; description: string; imageUrl: string }>): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a category safely. Checks if products exist in this category before deletion.
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    // Check if products exist in this category
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('categoryId', '==', id));
    const productsSnap = await getDocs(q);

    if (!productsSnap.empty) {
      throw new Error(`Cette catégorie contient encore ${productsSnap.size} parfum(s). Veuillez déplacer ou supprimer ces parfums avant de supprimer la catégorie.`);
    }

    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
}
