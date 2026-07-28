import type { Recipe } from './types';

/**
 * A handful of complete recipes inserted on first launch so the library, detail
 * and cook screens are populated before the user imports anything. Photos are
 * intentionally null — they render as themed gradient tiles, the same drop-slots
 * the design uses, so the seed needs no network.
 */

const now = Date.now();
const day = 86_400_000;

function make(
  id: string,
  data: Omit<
    Recipe,
    'id' | 'notes' | 'rating' | 'sourceUrl' | 'sourcePlatform' | 'sourceAuthor' | 'imageUrl'
  > &
    Partial<Pick<Recipe, 'notes' | 'rating' | 'imageUrl' | 'sourceAuthor'>>,
): Recipe {
  return {
    id,
    imageUrl: data.imageUrl ?? null,
    sourceUrl: null,
    sourcePlatform: null,
    sourceAuthor: data.sourceAuthor ?? null,
    notes: data.notes ?? '',
    rating: data.rating ?? 0,
    ...data,
  };
}

export const SEED_RECIPES: Recipe[] = [
  make('seed-salmon', {
    title: 'Miso Butter Salmon',
    description:
      'Sticky, salty-sweet glaze under the grill; rice and greens do the rest. A weeknight dinner that tastes like more effort than it is.',
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 24,
    tags: ['Dinner', 'Quick', 'Pescatarian'],
    isFavorite: true,
    cookedCount: 8,
    lastCookedAt: now - 2 * day,
    createdAt: now - 40 * day,
    notes: 'Double the glaze. Sear skin-side first for 2 min — the grill alone leaves it flabby.',
    ingredients: [
      { quantity: 1.5, unit: 'lb', name: 'salmon fillet', note: null, category: 'Seafood' },
      { quantity: 2, unit: 'tbsp', name: 'white miso', note: null, category: 'Pantry' },
      { quantity: 3, unit: 'tbsp', name: 'butter', note: 'softened', category: 'Dairy' },
      { quantity: 1, unit: null, name: 'lemon', note: 'zested', category: 'Produce' },
      { quantity: 2, unit: 'cups', name: 'jasmine rice', note: null, category: 'Pantry' },
      { quantity: 4, unit: 'cups', name: 'baby spinach', note: null, category: 'Produce' },
      { quantity: 1, unit: 'tbsp', name: 'toasted sesame', note: null, category: 'Pantry' },
    ],
    steps: [
      { text: 'Whisk the miso, butter and lemon zest into a smooth paste.' },
      { text: 'Rinse the rice until the water runs clear, then cook it covered for 18 minutes.' },
      { text: 'Score the salmon and spread the miso butter right over the top.' },
      { text: 'Grill on high for 12 minutes until the glaze blisters and the centre flakes apart.' },
      { text: 'Wilt the spinach in the pan juices. Plate, scatter sesame, and eat.' },
    ],
  }),
  make('seed-broccoli', {
    title: 'Charred Broccoli Rice Bowl',
    description: 'Blistered broccoli, garlicky rice and a sharp tahini drizzle. Vegetarian and fast.',
    servings: 2,
    prepMinutes: 8,
    cookMinutes: 17,
    tags: ['Dinner', 'Vegetarian', 'Quick'],
    isFavorite: false,
    cookedCount: 3,
    lastCookedAt: now - 7 * day,
    createdAt: now - 30 * day,
    ingredients: [
      { quantity: 1, unit: null, name: 'broccoli', note: 'cut into florets', category: 'Produce' },
      { quantity: 1, unit: 'cup', name: 'brown rice', note: null, category: 'Pantry' },
      { quantity: 2, unit: 'tbsp', name: 'tahini', note: null, category: 'Pantry' },
      { quantity: 1, unit: null, name: 'lemon', note: 'juiced', category: 'Produce' },
      { quantity: 2, unit: 'clove', name: 'garlic', note: 'minced', category: 'Produce' },
      { quantity: 2, unit: 'tbsp', name: 'olive oil', note: null, category: 'Pantry' },
    ],
    steps: [
      { text: 'Cook the brown rice until tender, then stir the garlic through it off the heat.' },
      { text: 'Toss the broccoli in olive oil and roast at 220°C for 15 minutes until charred at the edges.' },
      { text: 'Loosen the tahini with lemon juice and a splash of water until pourable.' },
      { text: 'Pile rice, top with broccoli, and drizzle the tahini over everything.' },
    ],
  }),
  make('seed-ragu', {
    title: 'Slow Sunday Ragù',
    description: 'Low and slow, the way it should be. Make a big batch and freeze half.',
    servings: 6,
    prepMinutes: 20,
    cookMinutes: 170,
    tags: ['Dinner'],
    isFavorite: false,
    cookedCount: 1,
    lastCookedAt: now - 25 * day,
    createdAt: now - 25 * day,
    ingredients: [
      { quantity: 1, unit: 'lb', name: 'beef mince', note: null, category: 'Meat' },
      { quantity: 1, unit: null, name: 'onion', note: 'diced', category: 'Produce' },
      { quantity: 2, unit: null, name: 'carrots', note: 'diced', category: 'Produce' },
      { quantity: 2, unit: 'cans', name: 'chopped tomatoes', note: null, category: 'Pantry' },
      { quantity: 1, unit: 'cup', name: 'red wine', note: null, category: 'Pantry' },
      { quantity: 1, unit: 'lb', name: 'pappardelle', note: null, category: 'Pantry' },
    ],
    steps: [
      { text: 'Brown the mince hard in batches so it colours rather than steams.' },
      { text: 'Soften the onion and carrot in the same pot until sweet, about 10 minutes.' },
      { text: 'Pour in the wine and let it reduce by half, scraping the base.' },
      { text: 'Add the tomatoes, drop to a bare simmer, and cook uncovered for 2.5 hours.' },
      { text: 'Boil the pappardelle and toss it through the sauce with a ladle of pasta water.' },
    ],
  }),
  make('seed-cake', {
    title: 'Lemon Olive Oil Cake',
    description: 'Moist, citrus-forward and barely sweet. Keeps for days and improves overnight.',
    servings: 8,
    prepMinutes: 15,
    cookMinutes: 40,
    tags: ['Desserts'],
    isFavorite: true,
    cookedCount: 2,
    lastCookedAt: now - 34 * day,
    createdAt: now - 34 * day,
    ingredients: [
      { quantity: 1, unit: 'cup', name: 'olive oil', note: null, category: 'Pantry' },
      { quantity: 1.25, unit: 'cups', name: 'sugar', note: null, category: 'Pantry' },
      { quantity: 3, unit: null, name: 'eggs', note: null, category: 'Dairy' },
      { quantity: 2, unit: null, name: 'lemons', note: 'zested and juiced', category: 'Produce' },
      { quantity: 1.75, unit: 'cups', name: 'flour', note: null, category: 'Pantry' },
      { quantity: 1, unit: 'tsp', name: 'baking powder', note: null, category: 'Pantry' },
    ],
    steps: [
      { text: 'Whisk the eggs and sugar until pale, then stream in the olive oil.' },
      { text: 'Beat in the lemon zest and juice.' },
      { text: 'Fold in the flour and baking powder just until no streaks remain.' },
      { text: 'Bake at 175°C for 40 minutes until a skewer comes out clean. Cool before slicing.' },
    ],
  }),
  make('seed-shakshuka', {
    title: 'Green Shakshuka',
    description: 'Eggs poached in a garlicky green sauce. Breakfast that eats like a hug.',
    servings: 2,
    prepMinutes: 7,
    cookMinutes: 15,
    tags: ['Breakfast', 'Vegetarian', 'Quick'],
    isFavorite: false,
    cookedCount: 4,
    lastCookedAt: now - 12 * day,
    createdAt: now - 60 * day,
    ingredients: [
      { quantity: 4, unit: null, name: 'eggs', note: null, category: 'Dairy' },
      { quantity: 4, unit: 'cups', name: 'spinach', note: null, category: 'Produce' },
      { quantity: 1, unit: null, name: 'leek', note: 'sliced', category: 'Produce' },
      { quantity: 2, unit: 'clove', name: 'garlic', note: null, category: 'Produce' },
      { quantity: 0.5, unit: 'cup', name: 'feta', note: 'crumbled', category: 'Dairy' },
      { quantity: 1, unit: 'tsp', name: 'cumin', note: null, category: 'Pantry' },
    ],
    steps: [
      { text: 'Soften the leek and garlic in olive oil until fragrant.' },
      { text: 'Add the spinach and cumin and cook down into a loose green sauce.' },
      { text: 'Make four wells, crack an egg into each, and cover the pan.' },
      { text: 'Cook until the whites set but the yolks stay runny. Scatter feta and serve.' },
    ],
  }),
  make('seed-chickpea', {
    title: 'Smoky Chickpea Stew',
    description: 'Paprika-deep, thick and forgiving. A pantry dinner that punches above its weight.',
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 30,
    tags: ['Dinner', 'Vegetarian'],
    isFavorite: false,
    cookedCount: 2,
    lastCookedAt: now - 20 * day,
    createdAt: now - 20 * day,
    ingredients: [
      { quantity: 2, unit: 'cans', name: 'chickpeas', note: 'drained', category: 'Pantry' },
      { quantity: 1, unit: 'can', name: 'chopped tomatoes', note: null, category: 'Pantry' },
      { quantity: 1, unit: null, name: 'onion', note: 'diced', category: 'Produce' },
      { quantity: 2, unit: 'tsp', name: 'smoked paprika', note: null, category: 'Pantry' },
      { quantity: 2, unit: 'cups', name: 'spinach', note: null, category: 'Produce' },
      { quantity: 1, unit: 'tbsp', name: 'olive oil', note: null, category: 'Pantry' },
    ],
    steps: [
      { text: 'Fry the onion in olive oil until soft, then bloom the paprika for 30 seconds.' },
      { text: 'Add the chickpeas and tomatoes and simmer for 20 minutes until thick.' },
      { text: 'Stir the spinach through until wilted. Season well and serve with bread.' },
    ],
  }),
];
