import {
  collection,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductFormat } from '@/types';
import {
  SONIA_CATALOGUE,
  EXTRAIT_FORMATS,
  HUILE_FORMATS,
  DEFAULT_STOCK,
} from '@/data/soniaCatalogue';

const PRODUCTS_COLLECTION = 'products';
const BATCH_LIMIT = 400; // Firestore limite à 500 opérations par batch

export type ScentType = 'extrait' | 'huile';
export type ImportTargetCategory = 'all' | 'extraits-parfums' | 'huiles-parfumees';

export interface CatalogueImportResult {
  targetCategory: ImportTargetCategory;
  extraitsCreated: number;
  extraitsUpdated: number;
  huilesCreated: number;
  huilesUpdated: number;
  totalProcessed: number;
}

/** Normalise un nom pour la comparaison (casse, accents, apostrophes, espaces). */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Vrai si deux noms désignent la même senteur (ex. "Addict" et "Dior Addict"). */
function isSameScent(a: string, b: string, brand: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  const brandWord = normalize(brand).split(' ')[0];
  return na === `${brandWord} ${nb}` || nb === `${brandWord} ${na}`;
}

export function buildStandardFormats(type: ScentType): ProductFormat[] {
  const source = type === 'extrait' ? EXTRAIT_FORMATS : HUILE_FORMATS;
  const prefix = type === 'extrait' ? 'ext' : 'huile';
  return source.map((f) => ({
    id: `${prefix}-${f.sizeMl}ml`,
    sizeMl: f.sizeMl,
    price: f.price,
    stock: DEFAULT_STOCK,
  }));
}

function getType(data: DocumentData): ScentType | null {
  if (data.isAuthentic || data.isCoffret || data.priceAuthentic || data.priceCoffret) return null;
  const isExtrait = !!data.priceExtrait || (data.categoryName || '').toLowerCase().includes('extrait');
  return isExtrait ? 'extrait' : 'huile';
}

/**
 * Importe (ou met à jour) les senteurs du catalogue Sonia's Perfumery
 * en fonction de la catégorie ciblée :
 * - 'extraits-parfums' : formats 16, 20, 30, 50, 100 mL | prix 1 500 à 15 000 | stock 50
 * - 'huiles-parfumees' : formats 3, 5, 6, 10, 15, 20 mL | prix 1 000 à 5 000 | stock 50
 * - 'all' : les deux catégories
 * L'opération est idempotente : une senteur déjà présente est mise à jour, jamais dupliquée.
 */
export async function importSoniaCatalogue(
  targetCategory: ImportTargetCategory = 'all'
): Promise<CatalogueImportResult> {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

  const existing: { id: string; name: string; brand: string; type: ScentType }[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const type = getType(data);
    if (!type || !data.brand) return;
    existing.push({ id: docSnap.id, name: data.name || '', brand: (data.brand || '').toUpperCase(), type });
  });

  const result: CatalogueImportResult = {
    targetCategory,
    extraitsCreated: 0,
    extraitsUpdated: 0,
    huilesCreated: 0,
    huilesUpdated: 0,
    totalProcessed: 0,
  };

  const operations: ((batch: ReturnType<typeof writeBatch>) => void)[] = [];
  const updatedIds = new Set<string>();

  const extraitFormats = buildStandardFormats('extrait');
  const huileFormats = buildStandardFormats('huile');

  const typesToProcess: ScentType[] =
    targetCategory === 'extraits-parfums'
      ? ['extrait']
      : targetCategory === 'huiles-parfumees'
      ? ['huile']
      : ['extrait', 'huile'];

  const pricingFor = (type: ScentType) => ({
    formats: type === 'extrait' ? extraitFormats : huileFormats,
    priceExtrait: type === 'extrait' ? EXTRAIT_FORMATS[0].price : null,
    priceHuile: type === 'huile' ? HUILE_FORMATS[0].price : null,
    categoryName: type === 'extrait' ? 'Extraits de parfum' : 'Huiles parfumées',
  });

  for (const house of SONIA_CATALOGUE) {
    for (const scent of house.scents) {
      for (const type of typesToProcess) {
        const pricing = pricingFor(type);
        const match = existing.find(
          (p) => p.type === type && p.brand === house.brand && isSameScent(p.name, scent.name, house.brand)
        );

        if (match) {
          if (updatedIds.has(match.id)) continue;
          updatedIds.add(match.id);
          operations.push((batch) =>
            batch.update(doc(db, PRODUCTS_COLLECTION, match.id), {
              ...pricing,
              updatedAt: serverTimestamp(),
            })
          );
          if (type === 'extrait') result.extraitsUpdated++;
          else result.huilesUpdated++;
        } else {
          const description =
            type === 'extrait'
              ? `Extrait de parfum inspiré de ${scent.name} (${house.brand}), en haute concentration pour un sillage intense.`
              : `Huile parfumée sans alcool inspirée de ${scent.name} (${house.brand}), idéale pour une tenue prolongée toute la journée.`;
          const newRef = doc(collection(db, PRODUCTS_COLLECTION));
          operations.push((batch) =>
            batch.set(newRef, {
              name: scent.name,
              brand: house.brand,
              description,
              imageUrl: '',
              gender: scent.gender,
              ...pricing,
              categoryIds: [],
              categoryNames: [pricing.categoryName],
              priceAuthentic: null,
              priceCoffret: null,
              isAuthentic: false,
              isCoffret: false,
              coffretContent: [],
              allowCustomVolume: true,
              isBestSeller: false,
              active: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            })
          );
          if (type === 'extrait') result.extraitsCreated++;
          else result.huilesCreated++;
        }
      }
    }
  }

  // Applique aussi les formats / prix / stock standards aux autres extraits et huiles de maisons déjà enregistrés
  for (const p of existing) {
    if (!typesToProcess.includes(p.type)) continue;
    if (updatedIds.has(p.id)) continue;
    updatedIds.add(p.id);
    const pricing = pricingFor(p.type);
    operations.push((batch) =>
      batch.update(doc(db, PRODUCTS_COLLECTION, p.id), {
        ...pricing,
        updatedAt: serverTimestamp(),
      })
    );
    if (p.type === 'extrait') result.extraitsUpdated++;
    else result.huilesUpdated++;
  }

  result.totalProcessed =
    result.extraitsCreated +
    result.extraitsUpdated +
    result.huilesCreated +
    result.huilesUpdated;

  for (let i = 0; i < operations.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    operations.slice(i, i + BATCH_LIMIT).forEach((op) => op(batch));
    await batch.commit();
  }

  return result;
}
