import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Brand {
  id: string;
  name: string;
  subtitle?: string;
  createdAt?: any;
}

const BRANDS_COLLECTION = 'brands';

const DEFAULT_BRANDS: Omit<Brand, 'id'>[] = [
  { name: 'DIOR', subtitle: 'Haute Parfumerie Paris' },
  { name: 'CHANEL', subtitle: 'N°5 & Collections Exclusives' },
  { name: 'YVES SAINT LAURENT', subtitle: 'Libre & Opium' },
  { name: 'GUERLAIN', subtitle: 'L\'Art & La Matière' },
  { name: 'TOM FORD', subtitle: 'Private Blend' },
  { name: 'paco rabanne', subtitle: '1 Million & Invictus' },
  { name: 'Jean Paul GAULTIER', subtitle: 'Le Male & Scandal' },
  { name: 'Calvin Klein', subtitle: 'CK One & Eternity' }
];

export async function getBrands(): Promise<Brand[]> {
  try {
    const querySnapshot = await getDocs(collection(db, BRANDS_COLLECTION));
    if (querySnapshot.empty) {
      // Seed default brands if collection is empty
      const seeded: Brand[] = [];
      for (const b of DEFAULT_BRANDS) {
        const docRef = await addDoc(collection(db, BRANDS_COLLECTION), {
          ...b,
          createdAt: serverTimestamp(),
        });
        seeded.push({ id: docRef.id, ...b });
      }
      return seeded;
    }

    const brands: Brand[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      brands.push({
        id: docSnap.id,
        name: data.name || '',
        subtitle: data.subtitle || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      });
    });
    return brands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    // Return defaults in case of error
    return DEFAULT_BRANDS.map((b, index) => ({ id: `default-${index}`, ...b }));
  }
}

export async function createBrand(name: string, subtitle?: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BRANDS_COLLECTION), {
      name: name.trim().toUpperCase(),
      subtitle: subtitle ? subtitle.trim() : '',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
}

export async function deleteBrand(id: string): Promise<void> {
  try {
    const docRef = doc(db, BRANDS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting brand ${id}:`, error);
    throw error;
  }
}
