import { createCategory } from './categoriesService';
import { createProduct } from './productsService';
import { DEFAULT_CATEGORY_IMAGES } from '@/lib/cloudinary';

export async function seedInitialData() {
  // Sample Categories
  const categoriesData = [
    {
      name: 'Homme',
      description: 'Fragrances intenses, boisées et charismatiques conçues pour les hommes d\'exception.',
      imageUrl: DEFAULT_CATEGORY_IMAGES.homme,
    },
    {
      name: 'Femme',
      description: 'Senteurs florales, fruitées et envoûtantes célébrant la féminité et l\'élégance.',
      imageUrl: DEFAULT_CATEGORY_IMAGES.femme,
    },
    {
      name: 'Unisexe',
      description: 'Créations olfactives harmonieuses convenant aussi bien aux femmes qu\'aux hommes.',
      imageUrl: DEFAULT_CATEGORY_IMAGES.unisexe,
    },
    {
      name: 'Oriental',
      description: 'Eaux de parfum rares à base d\'oud, d\'ambre et d\'épices précieuses d\'Orient.',
      imageUrl: DEFAULT_CATEGORY_IMAGES.oriental,
    },
  ];

  const categoryIds: Record<string, string> = {};

  for (const cat of categoriesData) {
    const id = await createCategory(cat);
    categoryIds[cat.name] = id;
  }

  // Sample Products
  const productsData = [
    {
      name: 'Dior Sauvage',
      description: 'Une composition à la fraîcheur radieuse, dictée par un nom qui sonne comme un manifeste. Des notes d\'ambrée suave et de bergamote régalent les sens.',
      categoryId: categoryIds['Homme'],
      categoryName: 'Homme',
      formats: [
        { id: 'f1', sizeMl: 30, price: 15000, stock: 20 },
        { id: 'f2', sizeMl: 50, price: 22000, stock: 15 },
        { id: 'f3', sizeMl: 100, price: 35000, stock: 8 },
      ],
    },
    {
      name: 'Bleu de Chanel',
      description: 'Éloge de la liberté qui s\'exprime dans un aromatique-boisé au sillage captivant. Une fragrance intemporelle et anticonformiste.',
      categoryId: categoryIds['Homme'],
      categoryName: 'Homme',
      formats: [
        { id: 'f4', sizeMl: 50, price: 25000, stock: 12 },
        { id: 'f5', sizeMl: 100, price: 40000, stock: 5 },
      ],
    },
    {
      name: 'Libre Yves Saint Laurent',
      description: 'La tension entre la sensualité brûlante de la fleur d\'oranger du Maroc et la de la lavande de France réinventée avec audace.',
      categoryId: categoryIds['Femme'],
      categoryName: 'Femme',
      formats: [
        { id: 'f6', sizeMl: 30, price: 18000, stock: 18 },
        { id: 'f7', sizeMl: 50, price: 28000, stock: 10 },
        { id: 'f8', sizeMl: 100, price: 42000, stock: 6 },
      ],
    },
    {
      name: 'Oud Royal',
      description: 'Nectar mystique révélant le bois d\'agar le plus noble et les accords chaleureux d\'encens et d\'épices d\'Orient.',
      categoryId: categoryIds['Oriental'],
      categoryName: 'Oriental',
      formats: [
        { id: 'f9', sizeMl: 50, price: 35000, stock: 10 },
        { id: 'f10', sizeMl: 100, price: 55000, stock: 4 },
      ],
    },
  ];

  for (const prod of productsData) {
    await createProduct(prod);
  }
}
