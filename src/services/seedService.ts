import { createCategory } from './categoriesService';
import { createProduct } from './productsService';
import { DEFAULT_CATEGORY_IMAGES } from '@/lib/cloudinary';

export async function seedInitialData() {
  // Sample Categories reflecting the 3 Univers from exemple.jpg
  const categoriesData = [
    {
      name: 'Huiles parfumées',
      description: 'Des senteurs en format pratique, idéal pour le quotidien.',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Extraits de parfum',
      description: 'Des fragrances inspirées de vos parfums préférés, en haute concentration.',
      imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Parfums authentiques',
      description: 'Les vraies marques, dans leurs flacons et packagings d\'origine.',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Coffrets',
      description: 'Des coffrets cadeaux d\'exception pour faire plaisir ou se faire plaisir.',
      imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
    }
  ];

  const categoryIds: Record<string, string> = {};

  for (const cat of categoriesData) {
    const id = await createCategory(cat);
    categoryIds[cat.name] = id;
  }

  // Sample Products with standard sizes: 5 mL, 16 mL, 20 mL, 100 mL
  const productsData = [
    {
      name: 'Bleu de Chanel',
      description: 'Éloge de la liberté qui s\'exprime dans un aromatique-boisé au sillage captivant.',
      categoryId: categoryIds['Huiles parfumées'] || Object.values(categoryIds)[0],
      categoryName: 'Huiles parfumées',
      formats: [
        { id: 'f1', sizeMl: 5, price: 5000, stock: 30 },
        { id: 'f2', sizeMl: 16, price: 10000, stock: 25 },
        { id: 'f3', sizeMl: 20, price: 12000, stock: 20 },
        { id: 'f4', sizeMl: 100, price: 25000, stock: 10 },
      ],
    },
    {
      name: 'Yara Candy',
      description: 'Une fragrance gourmande, fruitée et irrésistiblement sucrée.',
      categoryId: categoryIds['Extraits de parfum'] || Object.values(categoryIds)[0],
      categoryName: 'Extraits de parfum',
      formats: [
        { id: 'f5', sizeMl: 5, price: 6000, stock: 25 },
        { id: 'f6', sizeMl: 16, price: 12000, stock: 20 },
        { id: 'f7', sizeMl: 20, price: 15000, stock: 15 },
        { id: 'f8', sizeMl: 100, price: 30000, stock: 8 },
      ],
    },
    {
      name: 'Kay Ali 81',
      description: 'Nectar captivant aux notes de vanille sensuelle et de bois précieux.',
      categoryId: categoryIds['Extraits de parfum'] || Object.values(categoryIds)[0],
      categoryName: 'Extraits de parfum',
      formats: [
        { id: 'f9', sizeMl: 5, price: 6000, stock: 20 },
        { id: 'f10', sizeMl: 16, price: 12000, stock: 18 },
        { id: 'f11', sizeMl: 20, price: 15000, stock: 12 },
        { id: 'f12', sizeMl: 100, price: 32000, stock: 6 },
      ],
    },
    {
      name: 'Good Girl',
      description: 'L\'audace de la tubéreuse alliée à la fève tonka torréfiée pour une féminité affirmée.',
      categoryId: categoryIds['Parfums authentiques'] || Object.values(categoryIds)[0],
      categoryName: 'Parfums authentiques',
      formats: [
        { id: 'f13', sizeMl: 16, price: 16000, stock: 15 },
        { id: 'f14', sizeMl: 20, price: 20000, stock: 10 },
        { id: 'f15', sizeMl: 100, price: 45000, stock: 5 },
      ],
    },
  ];

  for (const prod of productsData) {
    await createProduct(prod);
  }
}
