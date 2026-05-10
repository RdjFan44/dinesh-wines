import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Store from '@/lib/models/Store';

export async function GET() {
  // Only allow seeding in development — never in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed route disabled in production.' }, { status: 403 });
  }
  try {
    await dbConnect();

    // Clear existing data
    await Product.deleteMany({});
    await Store.deleteMany({});

    // Seed Stores
    const stores = await Store.insertMany([
      {
        name: 'Dinesh Wines — Main Store',
        address: {
          street: '[REPLACE_ME — Street Address]',
          city: '[REPLACE_ME — City]',
          state: '[REPLACE_ME — State]',
          pincode: '[REPLACE_ME — Pincode]',
        },
        phone: '[REPLACE_ME — +91XXXXXXXXXX]',
        whatsapp: '[REPLACE_ME — 91XXXXXXXXXX]',
        location: { lat: 19.076090, lng: 72.877426 },
        googleMapsUrl: 'https://maps.google.com/?q=[REPLACE_ME]',
        googleMapsEmbed: '',
        license_info: '[REPLACE_ME — License Number]',
        hours: {
          weekdays: '10:00 AM – 10:00 PM',
          weekends: '10:00 AM – 11:00 PM',
        },
      },
    ]);

    const storeId = stores[0]._id;

    // Seed Products
    const products = [
      // ─── WHISKY ───────────────────────────────────────────────
      {
        name: 'Glenfiddich 12 Year Old',
        category: 'Whisky',
        subcategory: 'Single Malt',
        brand: 'Glenfiddich',
        price_range: { min: 3800, max: 4500 },
        description: "The world's most awarded single malt Scotch whisky. Smooth and delicate with a hint of fresh pear, creamy vanilla, and a subtle oak finish. Matured in our unique combination of American and European oak casks.",
        image: 'https://images.unsplash.com/photo-1527281400683-1aefee3d66f6?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'Scotland',
        featured: true,
        tags: ['scotch', 'single malt', 'premium', 'bestseller'],
        store_id: storeId,
      },
      {
        name: 'Macallan 18 Year Old Sherry Oak',
        category: 'Whisky',
        subcategory: 'Single Malt',
        brand: 'Macallan',
        price_range: { min: 22000, max: 26000 },
        description: 'Matured exclusively in hand-picked sherry oak casks from Jerez, Spain. A rich and complex single malt with notes of dried fruits, orange peel, ginger, and cloves.',
        image: 'https://images.unsplash.com/photo-1608887697711-5b2b7a53e3c3?w=600&h=800&fit=crop',
        alcoholContent: '43%',
        volume: '750ml',
        origin: 'Scotland',
        featured: true,
        tags: ['scotch', 'single malt', 'luxury', 'sherry oak'],
        store_id: storeId,
      },
      {
        name: "Jack Daniel's Old No. 7",
        category: 'Whisky',
        subcategory: 'American Whiskey',
        brand: "Jack Daniel's",
        price_range: { min: 2500, max: 3000 },
        description: 'Crafted in Lynchburg, Tennessee and charcoal mellowed drop by drop for a remarkably smooth character. Notes of caramel, vanilla, and toasted oak with a clean, balanced finish.',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'USA',
        featured: true,
        tags: ['american', 'tennessee', 'popular'],
        store_id: storeId,
      },
      {
        name: 'Johnnie Walker Black Label 12 Year',
        category: 'Whisky',
        subcategory: 'Blended Scotch',
        brand: 'Johnnie Walker',
        price_range: { min: 2800, max: 3500 },
        description: 'A sophisticated blend of malt and grain whiskies, all aged for a minimum of 12 years. Expertly crafted for a depth of flavour with smoky, rich, and complex notes.',
        image: 'https://images.unsplash.com/photo-1671726203638-83742a2721a1?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'Scotland',
        featured: false,
        tags: ['scotch', 'blended', 'iconic'],
        store_id: storeId,
      },
      {
        name: 'Paul John Brilliance',
        category: 'Whisky',
        subcategory: 'Indian Single Malt',
        brand: 'Paul John',
        price_range: { min: 3200, max: 3800 },
        description: "India's award-winning single malt made from Indian six-row barley. Distilled in Goa with tropical climate maturation. Bright, fruity, and creamy with notes of vanilla and honey.",
        image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&h=800&fit=crop',
        alcoholContent: '46%',
        volume: '750ml',
        origin: 'India',
        featured: true,
        tags: ['indian single malt', 'goa', 'award winning'],
        store_id: storeId,
      },

      // ─── WINE ─────────────────────────────────────────────────
      {
        name: "Jacob's Creek Classic Shiraz",
        category: 'Wine',
        subcategory: 'Red Wine',
        brand: "Jacob's Creek",
        price_range: { min: 900, max: 1200 },
        description: 'A classic Australian Shiraz with an approachable style. Rich berry fruit flavours with hints of mocha and vanilla, balanced with soft tannins and a smooth finish.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=800&fit=crop',
        alcoholContent: '13.5%',
        volume: '750ml',
        origin: 'Australia',
        featured: false,
        tags: ['red wine', 'shiraz', 'australia'],
        store_id: storeId,
      },
      {
        name: 'Santa Carolina Sauvignon Blanc',
        category: 'Wine',
        subcategory: 'White Wine',
        brand: 'Santa Carolina',
        price_range: { min: 800, max: 1100 },
        description: 'Fresh and vibrant Chilean white wine with bright citrus aromas, crisp green apple, and herbal notes. Perfect as an aperitif or with seafood.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
        alcoholContent: '12.5%',
        volume: '750ml',
        origin: 'Chile',
        featured: false,
        tags: ['white wine', 'sauvignon blanc', 'chile'],
        store_id: storeId,
      },
      {
        name: 'Sula Brut NV',
        category: 'Wine',
        subcategory: 'Sparkling Wine',
        brand: 'Sula Vineyards',
        price_range: { min: 700, max: 950 },
        description: "India's leading sparkling wine crafted from Chenin Blanc grapes in Nashik. Fine bubbles with flavours of green apple, citrus, and toasted bread. A festive favorite.",
        image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&h=800&fit=crop',
        alcoholContent: '12%',
        volume: '750ml',
        origin: 'India',
        featured: true,
        tags: ['sparkling wine', 'indian wine', 'nashik', 'celebration'],
        store_id: storeId,
      },

      // ─── CHAMPAGNE ────────────────────────────────────────────
      {
        name: 'Moët & Chandon Impérial Brut',
        category: 'Champagne',
        subcategory: 'Non-Vintage',
        brand: 'Moët & Chandon',
        price_range: { min: 5500, max: 6500 },
        description: 'The iconic non-vintage champagne from the storied Moët & Chandon house. Bright fruitiness of white peach and citrus, seductive palate with notes of brioche and mineral finesse.',
        image: 'https://images.unsplash.com/photo-1562601579-599dec564fbb?w=600&h=800&fit=crop',
        alcoholContent: '12%',
        volume: '750ml',
        origin: 'France',
        featured: true,
        tags: ['champagne', 'luxury', 'celebration', 'france'],
        store_id: storeId,
      },

      // ─── BEER ─────────────────────────────────────────────────
      {
        name: 'Kingfisher Premium Lager',
        category: 'Beer',
        subcategory: 'Lager',
        brand: 'Kingfisher',
        price_range: { min: 120, max: 160 },
        description: "India's most popular beer. A perfectly balanced lager with a crisp, refreshing taste. Brewed with the finest hops and malted barley for a smooth, easy-drinking experience.",
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=800&fit=crop',
        alcoholContent: '4.8%',
        volume: '650ml',
        origin: 'India',
        featured: false,
        tags: ['lager', 'indian beer', 'popular'],
        store_id: storeId,
      },
      {
        name: 'Heineken Lager',
        category: 'Beer',
        subcategory: 'Lager',
        brand: 'Heineken',
        price_range: { min: 150, max: 200 },
        description: 'The world-famous Dutch lager with a distinctively fresh, hoppy taste. Brewed with only the finest natural ingredients using the A-yeast recipe passed down for over 150 years.',
        image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&h=800&fit=crop',
        alcoholContent: '5%',
        volume: '650ml',
        origin: 'Netherlands',
        featured: false,
        tags: ['lager', 'international', 'dutch'],
        store_id: storeId,
      },

      // ─── RUM ──────────────────────────────────────────────────
      {
        name: 'Old Monk XXX Rum',
        category: 'Rum',
        subcategory: 'Dark Rum',
        brand: 'Old Monk',
        price_range: { min: 300, max: 450 },
        description: "India's iconic dark rum, a legend for over six decades. Slow-blended and matured for 7 years, Old Monk is smooth with deep notes of vanilla, caramel, and tropical spice.",
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=600&h=800&fit=crop',
        alcoholContent: '42.8%',
        volume: '750ml',
        origin: 'India',
        featured: true,
        tags: ['dark rum', 'indian rum', 'classic', 'iconic'],
        store_id: storeId,
      },
      {
        name: 'Bacardi Superior White Rum',
        category: 'Rum',
        subcategory: 'White Rum',
        brand: 'Bacardi',
        price_range: { min: 800, max: 1100 },
        description: 'The original cocktail rum. Filtered through charcoal for remarkable smoothness, with subtle flavours of vanilla and almond. The perfect base for mojitos and daiquiris.',
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'Puerto Rico',
        featured: false,
        tags: ['white rum', 'cocktail', 'bacardi'],
        store_id: storeId,
      },

      // ─── GIN ──────────────────────────────────────────────────
      {
        name: 'Bombay Sapphire London Dry Gin',
        category: 'Gin',
        subcategory: 'London Dry',
        brand: 'Bombay Sapphire',
        price_range: { min: 2200, max: 2800 },
        description: 'Inspired by exotic botanicals from around the world, Bombay Sapphire is infused with 10 precious botanicals for a smooth and complex gin with bright juniper and citrus notes.',
        image: 'https://images.unsplash.com/photo-1571539166481-a1d57a88c17f?w=600&h=800&fit=crop',
        alcoholContent: '47%',
        volume: '750ml',
        origin: 'England',
        featured: false,
        tags: ['gin', 'london dry', 'premium'],
        store_id: storeId,
      },
      {
        name: "Gordon's London Dry Gin",
        category: 'Gin',
        subcategory: 'London Dry',
        brand: "Gordon's",
        price_range: { min: 1400, max: 1800 },
        description: "The world's best-selling London Dry gin. Crafted using a secret recipe unchanged since 1769, Gordon's has crisp juniper character with a clean, refreshing citrus finish.",
        image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=600&h=800&fit=crop',
        alcoholContent: '37.5%',
        volume: '750ml',
        origin: 'England',
        featured: false,
        tags: ['gin', 'london dry', 'classic'],
        store_id: storeId,
      },

      // ─── VODKA ────────────────────────────────────────────────
      {
        name: 'Grey Goose Vodka',
        category: 'Vodka',
        subcategory: 'Premium Vodka',
        brand: 'Grey Goose',
        price_range: { min: 3500, max: 4200 },
        description: "Created from the finest ingredients France has to offer — single-origin Picardie winter wheat and natural spring water from Gensac-la-Pallue. Smooth, clean, and exceptionally silky.",
        image: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'France',
        featured: false,
        tags: ['vodka', 'premium', 'french', 'luxury'],
        store_id: storeId,
      },
      {
        name: 'Absolut Original Vodka',
        category: 'Vodka',
        subcategory: 'Unflavoured',
        brand: 'Absolut',
        price_range: { min: 1600, max: 2100 },
        description: 'Made exclusively from natural ingredients — winter wheat from Åhus, Sweden and water from a deep well. Absolut has a rich, full-bodied, complex, yet smooth and mellow taste.',
        image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'Sweden',
        featured: false,
        tags: ['vodka', 'swedish', 'popular'],
        store_id: storeId,
      },

      // ─── TEQUILA ──────────────────────────────────────────────
      {
        name: 'Don Julio Blanco Tequila',
        category: 'Tequila',
        subcategory: 'Blanco',
        brand: 'Don Julio',
        price_range: { min: 5000, max: 6000 },
        description: 'The original ultra-premium tequila. Made from fully matured highland blue agave harvested at 7-10 years for optimal sweetness. Crisp agave flavour with light pepper and fresh citrus finish.',
        image: 'https://images.unsplash.com/photo-1601887389937-0b02eedcfbe2?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'Mexico',
        featured: true,
        tags: ['tequila', 'blanco', 'premium', 'mexico'],
        store_id: storeId,
      },
      {
        name: 'Patron Silver Tequila',
        category: 'Tequila',
        subcategory: 'Silver',
        brand: 'Patron',
        price_range: { min: 5500, max: 6500 },
        description: 'Made from the finest Blue Weber agave and crafted in small batches. An ultra-premium tequila with a smooth, sweet, and light taste with a distinct agave aroma.',
        image: 'https://images.unsplash.com/photo-1566982543940-31c7f68b2513?w=600&h=800&fit=crop',
        alcoholContent: '40%',
        volume: '750ml',
        origin: 'Mexico',
        featured: false,
        tags: ['tequila', 'silver', 'ultra-premium'],
        store_id: storeId,
      },
    ];

    await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: `Seeded ${products.length} products and ${stores.length} store(s) successfully.`,
      storeId: storeId.toString(),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
