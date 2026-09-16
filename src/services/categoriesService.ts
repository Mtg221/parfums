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

export async function getCategoryById(idOrSlug: string): Promise<Category | null> {
  try {
    const allCategories = await getCategories();
    
    // First try direct ID match
    const byId = allCategories.find(c => c.id === idOrSlug);
    if (byId) return byId;

    // Normalize slug for comparison (e.g. huiles-parfumees -> huiles parfumees)
    const normalizedSlug = idOrSlug.toLowerCase().replace(/-/g, ' ');

    // Match by category name containing slug keywords
    const byName = allCategories.find(c => {
      const normName = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const normQuery = normalizedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normName.includes(normQuery) || normQuery.includes(normName);
    });

    if (byName) return byName;

    // Fallback: Return custom category object for standard universe slugs
    if (idOrSlug === 'huiles-parfumees') {
      return { id: 'huiles-parfumees', name: 'Huiles Parfumées', description: 'Des senteurs en format pratique sans alcool, idéal pour le quotidien.', imageUrl: '' };
    }
    if (idOrSlug === 'extraits-de-parfum') {
      return { id: 'extraits-de-parfum', name: 'Extraits de Parfum', description: 'Des fragrances inspirées de vos parfums préférés, en haute concentration.', imageUrl: '' };
    }
    if (idOrSlug === 'parfums-authentiques') {
      return { id: 'parfums-authentiques', name: 'Parfums Authentiques', description: 'Les vraies marques, dans leurs flacons et packagings d\'origine.', imageUrl: '' };
    }
    if (idOrSlug === 'coffrets') {
      return { id: 'coffrets', name: 'Coffrets & Écrins', description: 'Des coffrets d\'exception et ensembles cadeaux pour offrir ou se faire plaisir.', imageUrl: '' };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching category ${idOrSlug}:`, error);
    return null;
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

export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
}
