/**
 * Catalogue des senteurs par Maison de Parfum (Homme / Femme / Unisexe).
 * Source : public/Sonia_Perfumery_Selection_Homme_Femme_Unisexe.pdf
 * Chaque senteur est disponible en Extrait de parfum et en Huile parfumée.
 */

export type ScentGender = 'homme' | 'femme' | 'unisexe';

export interface CatalogueScent {
  name: string;
  gender: ScentGender;
}

export interface CatalogueHouse {
  brand: string; // Doit correspondre au nom (en majuscules) de la Maison dans brandsService
  scents: CatalogueScent[];
}

/** Formats Extraits de parfum : 16 / 20 / 30 / 50 / 100 mL */
export const EXTRAIT_FORMATS = [
  { sizeMl: 16, price: 1500 },
  { sizeMl: 20, price: 3000 },
  { sizeMl: 30, price: 5000 },
  { sizeMl: 50, price: 8000 },
  { sizeMl: 100, price: 15000 },
];

/** Formats Huiles parfumées : 3 / 5 / 6 / 10 / 15 / 20 mL */
export const HUILE_FORMATS = [
  { sizeMl: 3, price: 1000 },
  { sizeMl: 5, price: 1500 },
  { sizeMl: 6, price: 2000 },
  { sizeMl: 10, price: 3000 },
  { sizeMl: 15, price: 4000 },
  { sizeMl: 20, price: 5000 },
];

/** Stock par défaut appliqué à chaque format */
export const DEFAULT_STOCK = 50;

export const SONIA_CATALOGUE: CatalogueHouse[] = [
  {
    brand: 'DIOR',
    scents: [
      { name: 'Sauvage', gender: 'homme' },
      { name: 'Sauvage EDP', gender: 'homme' },
      { name: 'Sauvage élixir', gender: 'homme' },
      { name: 'Dior Homme Intense', gender: 'homme' },
      { name: 'Dior Homme Sport', gender: 'homme' },
      { name: "J'adore", gender: 'femme' },
      { name: 'Miss Dior Chérie', gender: 'femme' },
      { name: 'Poison', gender: 'femme' },
      { name: 'Hypnotic Poison', gender: 'femme' },
      { name: 'Addict', gender: 'femme' },
      { name: "Bois d'argent", gender: 'unisexe' },
      { name: 'Bonne étoile', gender: 'unisexe' },
      { name: 'Gris Montaigne', gender: 'unisexe' },
      { name: 'Oud Ispahan', gender: 'unisexe' },
    ],
  },
  {
    brand: 'CHANEL',
    scents: [
      { name: 'Bleu de Chanel', gender: 'homme' },
      { name: 'Allure Homme', gender: 'homme' },
      { name: 'Allure Sport', gender: 'homme' },
      { name: 'Chanel N°5', gender: 'femme' },
      { name: 'Coco Mademoiselle', gender: 'femme' },
      { name: 'Chance', gender: 'femme' },
      { name: 'Gabrielle', gender: 'femme' },
      { name: 'Allure Sensuelle', gender: 'femme' },
      { name: 'Coco Chanel', gender: 'unisexe' },
    ],
  },
  {
    brand: 'YVES SAINT LAURENT',
    scents: [
      { name: "La Nuit de l'homme", gender: 'homme' },
      { name: "L'homme", gender: 'homme' },
      { name: "L'homme EDP", gender: 'homme' },
      { name: 'Y', gender: 'homme' },
      { name: 'Kouros', gender: 'homme' },
      { name: 'Libre', gender: 'femme' },
      { name: 'Libre Intense', gender: 'femme' },
      { name: 'Manifesto', gender: 'femme' },
      { name: 'Black Opium', gender: 'femme' },
      { name: 'Mon Paris', gender: 'femme' },
      { name: 'Opium Homme', gender: 'unisexe' },
      { name: "L'homme libre", gender: 'unisexe' },
      { name: 'Cuir', gender: 'unisexe' },
      { name: 'Collection M7 Oud', gender: 'unisexe' },
      { name: 'Suprême Bouquet', gender: 'unisexe' },
    ],
  },
  {
    brand: 'GUERLAIN',
    scents: [
      { name: "L'homme Idéal", gender: 'homme' },
      { name: 'Habit Rouge', gender: 'homme' },
      { name: "L'instant de Guerlain H", gender: 'homme' },
      { name: 'Shalimar', gender: 'femme' },
      { name: 'Idylle', gender: 'femme' },
      { name: 'La Petite Robe Noire', gender: 'femme' },
      { name: 'Insolence', gender: 'femme' },
      { name: 'Mon Guerlain', gender: 'femme' },
      { name: 'Santal Royal', gender: 'unisexe' },
      { name: 'Jicky', gender: 'unisexe' },
      { name: 'Oud Essentiel', gender: 'unisexe' },
      { name: 'Bois Mystérieux', gender: 'unisexe' },
      { name: 'Tonka Impériale', gender: 'unisexe' },
    ],
  },
  {
    brand: 'TOM FORD',
    scents: [
      { name: 'Tom Ford Noir', gender: 'homme' },
      { name: 'Noir Extrême', gender: 'homme' },
      { name: 'Tom Ford Extrême', gender: 'homme' },
      { name: 'Tobacco Oud', gender: 'homme' },
      { name: 'Lost Cherry', gender: 'femme' },
      { name: 'Black Orchid', gender: 'femme' },
      { name: "Rose d'Amalfi", gender: 'femme' },
      { name: 'Métallique', gender: 'femme' },
      { name: 'Oud Wood', gender: 'unisexe' },
      { name: 'Tobacco Vanille', gender: 'unisexe' },
      { name: 'Tuscan Leather', gender: 'unisexe' },
      { name: 'Ombré Leather', gender: 'unisexe' },
    ],
  },
  {
    brand: 'PACO RABANNE',
    scents: [
      { name: 'One Million', gender: 'homme' },
      { name: 'One Million Privé', gender: 'homme' },
      { name: 'One Million Lucky', gender: 'homme' },
      { name: 'One Million élixir', gender: 'homme' },
      { name: 'Invictus', gender: 'homme' },
      { name: 'Lady Million', gender: 'femme' },
      { name: 'Olympéa', gender: 'femme' },
      { name: 'Black XS Femme', gender: 'femme' },
      { name: 'Pure XS femme', gender: 'femme' },
      { name: 'Fame', gender: 'femme' },
      { name: "Black XS l'excès", gender: 'unisexe' },
      { name: 'Black XS Homme', gender: 'unisexe' },
      { name: 'One Million Intense', gender: 'unisexe' },
      { name: 'Strong me', gender: 'unisexe' },
      { name: 'Erotic Me', gender: 'unisexe' },
    ],
  },
  {
    brand: 'JEAN PAUL GAULTIER',
    scents: [
      { name: 'Le Mâle', gender: 'homme' },
      { name: 'Ultra Mâle', gender: 'homme' },
      { name: 'Le Beau', gender: 'homme' },
      { name: 'Le Mâle élixir', gender: 'homme' },
      { name: 'Scandale Homme', gender: 'homme' },
      { name: 'Scandal', gender: 'femme' },
      { name: 'So Scandal', gender: 'femme' },
      { name: 'Scandale à Paris', gender: 'femme' },
      { name: 'La Belle', gender: 'femme' },
      { name: 'Divine', gender: 'femme' },
      { name: 'Le Beau Paradise Garden', gender: 'unisexe' },
    ],
  },
  {
    brand: 'CALVIN KLEIN',
    scents: [
      { name: 'Eternity (Homme)', gender: 'homme' },
      { name: 'Euphoria H', gender: 'homme' },
      { name: 'Euphoria F', gender: 'femme' },
      { name: 'Eternity (Femme)', gender: 'femme' },
      { name: 'CK One', gender: 'unisexe' },
    ],
  },
  {
    brand: 'LANCÔME',
    scents: [
      { name: 'La Vie Est Belle', gender: 'femme' },
      { name: 'Idôle', gender: 'femme' },
      { name: 'Hypnose', gender: 'femme' },
      { name: 'Poème', gender: 'femme' },
      { name: 'La Nuit Du Trésor', gender: 'femme' },
      { name: 'Trésor', gender: 'unisexe' },
      { name: 'Miracle', gender: 'unisexe' },
      { name: 'Oud Bouquet', gender: 'unisexe' },
    ],
  },
  {
    brand: 'GIORGIO ARMANI',
    scents: [
      { name: 'Acqua Di Gio Profumo', gender: 'homme' },
      { name: 'Acqua Di Gio', gender: 'homme' },
      { name: 'Armani Code', gender: 'homme' },
      { name: 'Stronger With You', gender: 'homme' },
      { name: 'Armani Code Absolu', gender: 'homme' },
      { name: 'Si', gender: 'femme' },
      { name: 'Si Passionné', gender: 'femme' },
      { name: 'Si Fiorie', gender: 'femme' },
      { name: 'My Way', gender: 'femme' },
      { name: 'Acqua Di Gio Femme', gender: 'femme' },
      { name: 'You Oud', gender: 'unisexe' },
    ],
  },
  {
    brand: 'AZZARO',
    scents: [
      { name: 'Azzaro Chrome', gender: 'homme' },
      { name: 'Azzaro Wanted', gender: 'homme' },
      { name: 'Wanted By Night', gender: 'homme' },
      { name: 'Azzaro Sport', gender: 'homme' },
      { name: 'Azzaro Visit', gender: 'homme' },
      { name: 'Wanted Girl', gender: 'femme' },
      { name: 'Chrome Legend', gender: 'unisexe' },
    ],
  },
  {
    brand: 'DOLCE & GABBANA',
    scents: [
      { name: 'Classic', gender: 'homme' },
      { name: 'Intenso', gender: 'homme' },
      { name: 'K', gender: 'homme' },
      { name: 'The One', gender: 'homme' },
      { name: 'The One Sport', gender: 'homme' },
      { name: 'The One Femme', gender: 'femme' },
      { name: 'The Only One', gender: 'femme' },
      { name: 'Q', gender: 'femme' },
      { name: 'Light Blue Femme', gender: 'femme' },
      { name: "L'Impératrice", gender: 'femme' },
      { name: 'Light Blue', gender: 'unisexe' },
      { name: 'The One Desire', gender: 'unisexe' },
      { name: 'Velvet Desert Oud', gender: 'unisexe' },
    ],
  },
  {
    brand: 'VIKTOR & ROLF',
    scents: [
      { name: 'Spice Bomb', gender: 'homme' },
      { name: 'Flower Bomb', gender: 'femme' },
      { name: 'Good Fortune', gender: 'femme' },
      { name: 'Bon Bon', gender: 'femme' },
    ],
  },
  {
    brand: 'NARCISO RODRIGUEZ',
    scents: [
      { name: 'For Him', gender: 'homme' },
      { name: 'For Her', gender: 'femme' },
      { name: 'Fleur Musc', gender: 'femme' },
      { name: 'Narciso Poudrée', gender: 'femme' },
      { name: 'Narciso Rouge', gender: 'femme' },
      { name: 'Musc Noir', gender: 'femme' },
      { name: 'Pure Musk', gender: 'unisexe' },
      { name: 'Oud Musk', gender: 'unisexe' },
    ],
  },
  {
    brand: "VICTORIA'S SECRET",
    scents: [
      { name: 'Eau So Sexy', gender: 'femme' },
      { name: 'Wicked', gender: 'femme' },
      { name: 'Tease Noire', gender: 'femme' },
      { name: 'Bomb Shell', gender: 'femme' },
      { name: 'Pure Seduction', gender: 'femme' },
      { name: 'Melon Sorbet', gender: 'unisexe' },
      { name: 'Tease Crème Cloud', gender: 'unisexe' },
      { name: 'Tease Sugar Fleur', gender: 'unisexe' },
      { name: 'Coconut Passion', gender: 'unisexe' },
      { name: 'Midnight Bloom', gender: 'unisexe' },
    ],
  },
  {
    brand: 'MAISON FRANCIS KURKDJIAN',
    scents: [
      { name: 'Baccarat Rouge 540', gender: 'unisexe' },
      { name: 'Grand Soir', gender: 'unisexe' },
      { name: 'Oud Satin Mood', gender: 'unisexe' },
    ],
  },
  {
    brand: 'MONTBLANC',
    scents: [
      { name: 'Legend', gender: 'homme' },
      { name: 'Emblem', gender: 'homme' },
      { name: 'Signature', gender: 'femme' },
    ],
  },
  {
    brand: 'MAISON AL HARAMAIN',
    scents: [
      { name: 'Oud Al Haramain', gender: 'homme' },
      { name: 'Amber Oud', gender: 'unisexe' },
    ],
  },
  {
    brand: 'MUGLER',
    scents: [
      { name: 'Angel', gender: 'femme' },
      { name: 'Angel Nova', gender: 'femme' },
      { name: 'Alien', gender: 'femme' },
      { name: 'Aura', gender: 'femme' },
      { name: 'Angel élixir', gender: 'femme' },
    ],
  },
  {
    brand: 'ZARA',
    scents: [
      { name: 'Zara Femme', gender: 'femme' },
      { name: 'Black Amber', gender: 'unisexe' },
      { name: 'Zara Gold', gender: 'unisexe' },
      { name: 'Zara Silver', gender: 'unisexe' },
    ],
  },
  {
    brand: 'HERMÈS PARIS',
    scents: [
      { name: "Terre d'Hermès", gender: 'homme' },
      { name: 'H24', gender: 'homme' },
      { name: 'Voyage (Homme)', gender: 'homme' },
      { name: 'Twilly', gender: 'femme' },
      { name: 'Voyage (Unisexe)', gender: 'unisexe' },
    ],
  },
  {
    brand: 'CARTIER',
    scents: [
      { name: 'Déclaration', gender: 'homme' },
      { name: "Déclaration d'un soir", gender: 'homme' },
      { name: "L'envol", gender: 'homme' },
      { name: 'Baiser Volé', gender: 'femme' },
      { name: 'La Panthère', gender: 'femme' },
    ],
  },
  {
    brand: 'GIVENCHY',
    scents: [
      { name: 'Pi', gender: 'homme' },
      { name: 'Gentleman', gender: 'homme' },
      { name: 'Play Homme', gender: 'homme' },
      { name: 'Very Irresistible H', gender: 'homme' },
      { name: "L'interdit", gender: 'femme' },
      { name: "L'interdit Rouge", gender: 'femme' },
      { name: 'Ange ou Démon', gender: 'femme' },
      { name: 'Organza', gender: 'femme' },
      { name: 'Amarige', gender: 'femme' },
      { name: 'Accord Particulier', gender: 'unisexe' },
      { name: 'Hot Couture', gender: 'unisexe' },
    ],
  },
  {
    brand: 'BVLGARI',
    scents: [
      { name: 'Bvlgari Man', gender: 'homme' },
      { name: 'Bvlgari Wood Essence', gender: 'homme' },
    ],
  },
  {
    brand: 'CREED',
    scents: [
      { name: 'Aventus', gender: 'homme' },
      { name: 'Aventus For Her', gender: 'femme' },
    ],
  },
  {
    brand: 'LOUIS VUITTON',
    scents: [
      { name: "L'immensité", gender: 'homme' },
      { name: 'Imagination', gender: 'homme' },
      { name: 'Ombré Nomade', gender: 'homme' },
      { name: "Heures d'absence", gender: 'femme' },
      { name: 'Apogée', gender: 'femme' },
      { name: 'City Of Stars', gender: 'unisexe' },
      { name: 'California Dream', gender: 'unisexe' },
      { name: 'On The Beach', gender: 'unisexe' },
    ],
  },
  {
    brand: 'BOSS',
    scents: [
      { name: 'Hugo Boss', gender: 'homme' },
      { name: 'Boss Orange', gender: 'homme' },
      { name: 'Boss Bottled', gender: 'homme' },
      { name: 'Boss Ma Vie', gender: 'femme' },
      { name: 'Hugo XX', gender: 'unisexe' },
    ],
  },
  {
    brand: 'BURBERRY',
    scents: [
      { name: 'Week End', gender: 'homme' },
      { name: 'Burberry Her', gender: 'femme' },
      { name: 'Goddess', gender: 'femme' },
      { name: 'My Burberry', gender: 'femme' },
    ],
  },
  {
    brand: 'CAROLINA HERRERA',
    scents: [
      { name: '212 Men', gender: 'homme' },
      { name: '212 VIP Men', gender: 'homme' },
      { name: '212 Heroes', gender: 'homme' },
      { name: 'Good Girl', gender: 'femme' },
      { name: '212 VIP rosé', gender: 'femme' },
    ],
  },
  {
    brand: 'VERSACE',
    scents: [
      { name: 'Eros Homme', gender: 'homme' },
      { name: 'Dreamer', gender: 'homme' },
      { name: 'Crystal Noir', gender: 'femme' },
      { name: 'Bright Crystal', gender: 'femme' },
      { name: 'Eros Femme', gender: 'femme' },
      { name: 'Yellow Diamond', gender: 'femme' },
    ],
  },
  {
    brand: 'VALENTINO',
    scents: [
      { name: 'Valentino UOMO', gender: 'homme' },
      { name: 'Voce Viva', gender: 'femme' },
      { name: 'Valentino', gender: 'femme' },
    ],
  },
  {
    brand: 'ROCHAS',
    scents: [
      { name: 'Rochas Man', gender: 'homme' },
      { name: 'Rochas Girl', gender: 'femme' },
    ],
  },
  {
    brand: 'ISSEY MIYAKE',
    scents: [
      { name: "L'eau d'ISSEY", gender: 'homme' },
      { name: "L'eau d'ISSEY Rose", gender: 'femme' },
    ],
  },
  {
    brand: 'KENZO',
    scents: [
      { name: 'Kenzo Amour', gender: 'femme' },
      { name: 'Kenzo Jungle', gender: 'femme' },
      { name: 'Kenzo World', gender: 'femme' },
      { name: 'Flower Elixir', gender: 'femme' },
      { name: 'Flower Ikebana', gender: 'femme' },
      { name: 'Kenzoki', gender: 'unisexe' },
    ],
  },
  {
    brand: 'GUCCI',
    scents: [
      { name: 'Gucci Guilty Absolutely', gender: 'homme' },
      { name: 'Gucci Guilty', gender: 'homme' },
      { name: 'Gucci Oud', gender: 'homme' },
      { name: 'Gucci Bloom', gender: 'femme' },
      { name: 'Gucci Flora', gender: 'femme' },
      { name: 'Gucci Bamboo', gender: 'femme' },
      { name: 'Gucci Blood', gender: 'unisexe' },
      { name: 'Gucci Bloob', gender: 'unisexe' },
    ],
  },
  {
    brand: 'ESCADA',
    scents: [
      { name: 'Taj Sunset', gender: 'femme' },
      { name: 'Candy Love', gender: 'femme' },
      { name: 'Party Love', gender: 'femme' },
      { name: 'Sorbetto Rosso', gender: 'femme' },
      { name: 'Miami Blossom', gender: 'femme' },
      { name: 'Turquoise Summer', gender: 'unisexe' },
      { name: 'Sexy Graffiti', gender: 'unisexe' },
      { name: 'Rock in Rio', gender: 'unisexe' },
      { name: 'Magnétisme', gender: 'unisexe' },
      { name: 'Paradise', gender: 'unisexe' },
    ],
  },
  {
    brand: 'ARMANI PRIVÉ',
    scents: [
      { name: "Rose d'arabie", gender: 'femme' },
      { name: 'Rouge Malachite', gender: 'femme' },
      { name: 'Vert Malachite', gender: 'unisexe' },
      { name: "Sable d'or", gender: 'unisexe' },
      { name: 'Oud Royal', gender: 'unisexe' },
      { name: 'Cuir Majesté', gender: 'unisexe' },
      { name: "Bois d'encens", gender: 'unisexe' },
    ],
  },
  {
    brand: 'LATTAFA',
    scents: [
      { name: 'Yara Asad', gender: 'homme' },
      { name: 'Hayaati (Homme)', gender: 'homme' },
      { name: 'Oud For Glory', gender: 'homme' },
      { name: 'Oud Velvet', gender: 'homme' },
      { name: 'Najdia', gender: 'homme' },
      { name: 'Yara Pink', gender: 'femme' },
      { name: 'Yara White', gender: 'femme' },
      { name: 'Yara Tous', gender: 'femme' },
      { name: 'Yara Yellow', gender: 'femme' },
      { name: 'Hayaati (Femme)', gender: 'femme' },
      { name: 'Khamrah', gender: 'unisexe' },
      { name: 'Moussuf Marron', gender: 'unisexe' },
      { name: 'Ana Abeyadh', gender: 'unisexe' },
      { name: 'Raghba', gender: 'unisexe' },
      { name: "Qua'eed", gender: 'unisexe' },
    ],
  },
  {
    brand: 'NINA RICCI',
    scents: [
      { name: 'Nina', gender: 'femme' },
      { name: 'Ricci Ricci', gender: 'femme' },
      { name: "L'Extase", gender: 'femme' },
      { name: 'Bella', gender: 'femme' },
      { name: 'Luna', gender: 'femme' },
      { name: 'Premier Jour', gender: 'unisexe' },
    ],
  },
  {
    brand: 'YVES ROCHER',
    scents: [
      { name: 'Evidence Homme', gender: 'homme' },
      { name: 'Evidence', gender: 'femme' },
      { name: 'So Elixir', gender: 'femme' },
      { name: 'Framboise', gender: 'femme' },
      { name: "Quelques Notes d'Amour", gender: 'femme' },
    ],
  },
  {
    brand: 'DIESEL',
    scents: [
      { name: 'Fuel For Life', gender: 'homme' },
      { name: 'Only The Brave', gender: 'homme' },
      { name: 'Loverdose Tattoo', gender: 'femme' },
    ],
  },
  {
    brand: 'MANCERA',
    scents: [
      { name: 'Red Tobacco', gender: 'homme' },
      { name: 'Rose Vanille', gender: 'femme' },
      { name: 'Coco Vanille', gender: 'femme' },
    ],
  },
  {
    brand: 'CACHAREL',
    scents: [
      { name: 'Amor Amor', gender: 'femme' },
      { name: 'Liberté', gender: 'femme' },
      { name: 'Loulou', gender: 'femme' },
      { name: 'Anais, Anais', gender: 'femme' },
      { name: 'Yes I Am', gender: 'femme' },
    ],
  },
  {
    brand: 'LACOSTE',
    scents: [
      { name: 'Lacoste Blanc', gender: 'homme' },
      { name: 'Lacoste Rouge', gender: 'homme' },
      { name: 'Lacoste Bleu', gender: 'homme' },
      { name: 'Lacoste Noir', gender: 'homme' },
      { name: "L'homme Lacoste", gender: 'homme' },
      { name: 'Lacoste Jaune', gender: 'femme' },
      { name: 'Match Point', gender: 'unisexe' },
      { name: 'Lacoste Booster', gender: 'unisexe' },
    ],
  },
  {
    brand: 'MARLY PARIS',
    scents: [
      { name: 'Layton', gender: 'homme' },
      { name: 'Pegasus', gender: 'homme' },
      { name: 'Délina La Rosée', gender: 'femme' },
    ],
  },
  {
    brand: 'XERJOFF',
    scents: [
      { name: 'La Capitale', gender: 'unisexe' },
      { name: 'Erba Pura', gender: 'unisexe' },
    ],
  },
  {
    brand: 'LIBERTY',
    scents: [
      { name: 'Aqua Silver', gender: 'unisexe' },
      { name: 'Aqua White', gender: 'unisexe' },
    ],
  },
  {
    brand: 'AL REHAB',
    scents: [
      { name: 'Faris', gender: 'homme' },
      { name: 'Sabaya', gender: 'femme' },
      { name: 'Soft', gender: 'femme' },
      { name: 'Musc Makkah', gender: 'unisexe' },
    ],
  },
  {
    brand: 'CHLOÉ',
    scents: [
      { name: "L'eau de Chloé", gender: 'femme' },
      { name: 'Nomade', gender: 'femme' },
      { name: 'Love Story', gender: 'femme' },
    ],
  },
  {
    brand: 'LOLITA LEMPICKA',
    scents: [
      { name: 'Lolita Lempicka', gender: 'femme' },
      { name: 'Lolita Sweet', gender: 'femme' },
    ],
  },
  {
    brand: 'PARFUMS ARABES',
    scents: [
      { name: 'Oud El Cheikh', gender: 'homme' },
      { name: 'Oud Malaki', gender: 'homme' },
      { name: 'Musk Yémen', gender: 'femme' },
      { name: 'Musk Tahara', gender: 'femme' },
      { name: 'Musc Rose Vanille', gender: 'femme' },
      { name: 'Bakhour', gender: 'unisexe' },
      { name: 'Oud Maknoon', gender: 'unisexe' },
      { name: 'Oud Blanc', gender: 'unisexe' },
      { name: 'Musc Noir', gender: 'unisexe' },
      { name: 'Dalal', gender: 'unisexe' },
    ],
  },
  {
    brand: 'AUTRES MARQUES',
    scents: [
      { name: 'Sculpture NIKOS', gender: 'homme' },
      { name: 'Mercedes Benz', gender: 'homme' },
      { name: 'Polo Sport', gender: 'homme' },
      { name: 'Cool Water DAVIDOFF', gender: 'homme' },
      { name: 'Nautica Voyage', gender: 'homme' },
      { name: "Poussière d'or", gender: 'femme' },
      { name: 'Kim K', gender: 'femme' },
      { name: 'Elie Saab', gender: 'femme' },
      { name: 'Prada Paradoxe', gender: 'femme' },
      { name: 'Kay Ali vanilla', gender: 'femme' },
      { name: 'Blue Seduction', gender: 'unisexe' },
      { name: 'Magic', gender: 'unisexe' },
      { name: 'Cuir Rouge', gender: 'unisexe' },
      { name: 'Bibliothèque', gender: 'unisexe' },
      { name: 'Rouge Intense', gender: 'unisexe' },
    ],
  },
];
