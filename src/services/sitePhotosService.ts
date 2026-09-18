import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SitePhoto {
  id: string;
  key: string; // e.g., 'hero_banner', 'univers_huiles', 'univers_extraits', 'univers_authentiques', 'coffrets_banner'
  label: string; // Human readable title
  url: string;
  createdAt?: any;
}

const PHOTOS_COLLECTION = 'site_photos';

export async function getSitePhotos(): Promise<SitePhoto[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PHOTOS_COLLECTION));
    const photos: SitePhoto[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      photos.push({
        id: docSnap.id,
        key: data.key || '',
        label: data.label || '',
        url: data.url || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      });
    });
    return photos;
  } catch (error) {
    console.error('Error fetching site photos:', error);
    return [];
  }
}

export async function saveSitePhoto(key: string, label: string, url: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, PHOTOS_COLLECTION), {
      key,
      label,
      url,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving site photo:', error);
    throw error;
  }
}

export async function deleteSitePhoto(id: string): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting site photo ${id}:`, error);
    throw error;
  }
}
