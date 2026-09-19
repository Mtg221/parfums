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
  { name: 'PACO RABANNE', subtitle: '1 Million & Invictus' },
  { name: 'JEAN PAUL GAULTIER', subtitle: 'Le Male & Scandal' },
  { name: 'CALVIN KLEIN', subtitle: 'CK One & Eternity' },
  { name: 'LANCÔME', subtitle: 'La Vie Est Belle' },
  { name: 'GIORGIO ARMANI', subtitle: 'Acqua Di Giò & Si' },
  { name: 'AZZARO', subtitle: 'Wanted & Chrome' },
  { name: 'DOLCE & GABBANA', subtitle: 'Light Blue & The One' },
  { name: 'VIKTOR & ROLF', subtitle: 'Flowerbomb & Spicebomb' },
  { name: 'NARCISO RODRIGUEZ', subtitle: 'For Her & For Him' },
  { name: 'VICTORIA\'S SECRET', subtitle: 'Brumes & Parfums Iconiques' },
  { name: 'MAISON FRANCIS KURKDJIAN', subtitle: 'Baccarat Rouge 540' },
  { name: 'MONTBLANC', subtitle: 'Legend & Explorer' },
  { name: 'MAISON AL HARAMAIN', subtitle: 'Parfums Orientaux' },
  { name: 'MUGLER', subtitle: 'Angel & Alien' },
  { name: 'ZARA', subtitle: 'Collections Parfums' },
  { name: 'HERMÈS PARIS', subtitle: 'Terre d\'Hermès & Twilly' },
  { name: 'CARTIER', subtitle: 'La Panthère & Déclaration' },
  { name: 'GIVENCHY', subtitle: 'L\'Interdit & Gentleman' },
  { name: 'BVLGARI', subtitle: 'Man In Black & Omnia' },
  { name: 'CREED', subtitle: 'Aventus & Collections Exclusives' },
  { name: 'LOUIS VUITTON', subtitle: 'Parfums d\'Exception' },
  { name: 'BOSS', subtitle: 'Boss Bottled & The Scent' },
  { name: 'BURBERRY', subtitle: 'Hero & Goddess' },
  { name: 'CAROLINA HERRERA', subtitle: 'Good Girl & Bad Boy' },
  { name: 'VERSACE', subtitle: 'Eros & Dylan Blue' },
  { name: 'VALENTINO', subtitle: 'Born In Roma' },
  { name: 'ROCHAS', subtitle: 'Eau de Rochas & Man' },
  { name: 'ISSEY MIYAKE', subtitle: 'L\'Eau d\'Issey' },
  { name: 'KENZO', subtitle: 'Flower BY KENZO' },
  { name: 'GUCCI', subtitle: 'Bloom & Flora' },
  { name: 'ESCADA', subtitle: 'Fragrances Estivales' },
  { name: 'ARMANI PRIVÉ', subtitle: 'Haute Parfumerie' },
  { name: 'NINA RICCI', subtitle: 'Nina & L\'Air du Temps' },
  { name: 'YVES ROCHER', subtitle: 'Senteurs Naturelles' },
  { name: 'DIESEL', subtitle: 'Only The Brave & Fuel For Life' },
  { name: 'MANCERA', subtitle: 'Cedrat Boise & Collections Niche' },
  { name: 'CACHAREL', subtitle: 'Amor Amor & Anais Anais' },
  { name: 'LACOSTE', subtitle: 'L.12.12 Blanc & Pour Femme' },
  { name: 'MARLY PARIS', subtitle: 'Parfums de Marly - Delina & Layton' },
  { name: 'XERJOFF', subtitle: 'Erba Pura & Collections Luxueuses' },
  { name: 'LIBERTY', subtitle: 'Senteurs Elegantes' },
  { name: 'AL REHAB', subtitle: 'Huiles & Fragrances Orientales' },
  { name: 'CHLOÉ', subtitle: 'Nomade & Signature' },
  { name: 'PARFUMS ARABES', subtitle: 'Fragrances Orientales et Attars' },
  { name: 'AUTRES MARQUES', subtitle: 'Sélection Spéciale' }
];

export async function getBrands(): Promise<Brand[]> {
  try {
    const querySnapshot = await getDocs(collection(db, BRANDS_COLLECTION));
    const firestoreBrands: Brand[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      firestoreBrands.push({
        id: docSnap.id,
        name: (data.name || '').toUpperCase(),
        subtitle: data.subtitle || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      });
    });

    // Map default brands with fixed IDs
    const defaultBrandsList: Brand[] = DEFAULT_BRANDS.map((b, index) => ({
      id: `default-brand-${index}`,
      name: b.name.toUpperCase(),
      subtitle: b.subtitle,
    }));

    // Merge: start with default brands, then override or append firestore brands by uppercase name
    const brandsMap = new Map<string, Brand>();
    defaultBrandsList.forEach(b => brandsMap.set(b.name, b));
    firestoreBrands.forEach(b => brandsMap.set(b.name, b));

    return Array.from(brandsMap.values());
  } catch (error) {
    console.warn('Firestore brands fetch error, fallback to default brands:', error);
    return DEFAULT_BRANDS.map((b, index) => ({
      id: `default-brand-${index}`,
      name: b.name.toUpperCase(),
      subtitle: b.subtitle,
    }));
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
