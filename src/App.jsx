import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import './index.css';

const PRODUCT_CACHE_KEY = 'bbs-printify-products-v5';
const PRODUCT_CACHE_LIMIT = 4_000_000;

const CATEGORY_IMAGE_BY_NAME = {
  '4th of july': '/portfolio/category-4th-of-july.png',
  accessories: '/portfolio/category-bags.png',
  bags: '/portfolio/category-bags.png',
  crewnecks: '/portfolio/category-crewnecks.png',
  hoodies: '/portfolio/category-hoodies.png',
  journals: '/portfolio/category-journals.png',
  'phone cases': '/portfolio/category-phone-cases.png',
  tanks: '/portfolio/category-tank-tops.png',
  'tank tops': '/portfolio/category-tank-tops.png',
  tees: '/portfolio/category-tee-shirts.png',
  'tee shirts': '/portfolio/category-tee-shirts.png',
  't-shirts': '/portfolio/category-tee-shirts.png',
};

function normalizeCategoryName(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ');
}

function getCategoryImage(collection, products = []) {
  const normalizedCollection = normalizeCategoryName(collection);
  const mappedImage = CATEGORY_IMAGE_BY_NAME[normalizedCollection];
  if (mappedImage) return mappedImage;

  const categoryProduct = products.find((product) => {
    const customCategoryNames = product.customCategories?.map((category) => normalizeCategoryName(category.name)) || [];
    return customCategoryNames.includes(normalizedCollection) || normalizeCategoryName(product.collection) === normalizedCollection;
  });

  return categoryProduct?.image || '/portfolio/category-bags-2.png';
}

function getCachedProducts() {
  try {
    const cached = window.localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!cached) return [];
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed.products) ? parsed.products : [];
  } catch {
    return [];
  }
}

function compactProductForCache(product) {
  return {
    ...product,
    gallery: (product.gallery || []).slice(0, 8),
    colorImages: Object.fromEntries(
      Object.entries(product.colorImages || {}).map(([color, media]) => [
        color,
        {
          ...media,
          gallery: (media.gallery || []).slice(0, 3),
        },
      ])
    ),
    variants: [],
  };
}

function cacheProducts(products) {
  try {
    const payload = JSON.stringify({ products, cachedAt: Date.now() });

    if (payload.length <= PRODUCT_CACHE_LIMIT) {
      window.localStorage.setItem(PRODUCT_CACHE_KEY, payload);
      return true;
    }

    const compactPayload = JSON.stringify({
      products: products.map(compactProductForCache),
      cachedAt: Date.now(),
    });
    window.localStorage.setItem(PRODUCT_CACHE_KEY, compactPayload);
    return true;
  } catch {
    try {
      window.localStorage.removeItem(PRODUCT_CACHE_KEY);
    } catch {
      // Ignore browsers that block storage cleanup.
    }
    return false;
  }
}

function applyCustomCategories(products, catalogCategories) {
  const categoryById = new Map((catalogCategories.categories || []).map((category) => [category.id, category]));
  const categoryIdsByProduct = new Map();

  for (const assignment of catalogCategories.assignments || []) {
    const current = categoryIdsByProduct.get(assignment.product_id) || [];
    current.push(assignment.category_id);
    categoryIdsByProduct.set(assignment.product_id, current);
  }

  return products.map((product) => {
    const customCategories = (categoryIdsByProduct.get(product.id) || [])
      .map((categoryId) => categoryById.get(categoryId))
      .filter(Boolean);

    return {
      ...product,
      customCategories,
      collection: customCategories[0]?.name || product.collection,
    };
  });
}

function applyCustomCollections(products, catalogCollections) {
  const collectionById = new Map((catalogCollections.collections || []).map((collection) => [collection.id, collection]));
  const collectionIdsByProduct = new Map();

  for (const assignment of catalogCollections.assignments || []) {
    const current = collectionIdsByProduct.get(assignment.product_id) || [];
    current.push(assignment.collection_id);
    collectionIdsByProduct.set(assignment.product_id, current);
  }

  return products.map((product) => {
    const designCollections = (collectionIdsByProduct.get(product.id) || [])
      .map((collectionId) => collectionById.get(collectionId))
      .filter(Boolean);

    return {
      ...product,
      designCollections,
    };
  });
}

function getImagesForCollection(collectionId, catalogCollections, orientation) {
  return (catalogCollections.images || []).filter((image) =>
    image.collection_id === collectionId && image.orientation === orientation
  );
}

function getCollectionUrl(collection) {
  return `/collections/${collection.slug || normalizeCategoryName(collection.name).replace(/\s+/g, '-')}`;
}

function getProductsForDesignCollection(products, collectionName) {
  return products.filter((product) =>
    (product.designCollections || []).some((collection) => collection.name === collectionName)
  );
}

function getProductCategorySummary(products) {
  const names = new Set();

  for (const product of products) {
    for (const category of product.customCategories || []) {
      names.add(category.name);
    }
  }

  return [...names].slice(0, 5);
}

function getDailyIndex(length) {
  if (!length) return 0;
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  return dayNumber % length;
}

function getBrandIdentity(name = '') {
  const normalized = name.toLowerCase();

  if (normalized.includes('afterglow') || normalized.includes('disco')) {
    return {
      brandName: 'Afterglow',
      headline: 'The outfit starts where the night gets interesting.',
      dek: 'A little glossy, a little nostalgic, and fully built for camera-roll evidence.',
      brandStory: 'Afterglow designs for the hours after the plan changes. Every piece is made to photograph well in low light, look good leaving somewhere interesting, and feel like you dressed on purpose without trying too hard.',
      scene: 'It is 11pm and someone just said "actually, let\'s go somewhere else." You grab the jacket. You already look right.',
      quotes: [
        'The after-party called. She was already dressed.',
        'Disco lights, cherry lip gloss, and a hoodie that photographs better than you do.',
        'She showed up at 11 and the whole energy shifted.',
      ],
    };
  }

  if (normalized.includes('baby girl')) {
    return {
      brandName: 'Baby Girl',
      headline: 'Pretty does not mean quiet.',
      dek: 'Baby tees, cheeky graphics, and tiny accessories with a full main-character agenda.',
      brandStory: 'Baby Girl started with a single baby tee and a point to make. Every piece is tiny on purpose, loud on purpose, and designed for people who know that pink is a power move, not a personality trait.',
      scene: 'Iced latte in hand, tiny bag, lip gloss reapplied at every red light. Running five minutes late on purpose.',
      quotes: [
        'The baby tee is doing all the talking today.',
        'She wore pink to the meeting and closed the deal.',
        'Soft? Sure. But she meant every word.',
      ],
    };
  }

  if (normalized.includes('wild')) {
    return {
      brandName: 'Wild',
      headline: 'Walk in like you own the room.',
      dek: 'Tiger energy, vintage resort attitude, and graphics that know exactly what they are doing.',
      brandStory: 'Wild is animal print without the apology. It borrows from vintage resort wear, big-cat energy, and the kind of confidence you have when the outfit was the first decision you made that day.',
      scene: 'She walked into brunch 20 minutes late in a leopard tee and nobody said a word. They just moved the mimosas.',
      quotes: [
        'Leopard is a neutral if you believe hard enough.',
        'She matched the energy of the room by raising it.',
        'The fit was loud. The attitude was louder.',
      ],
    };
  }

  if (normalized.includes('ocean')) {
    return {
      brandName: 'Ocean Mood',
      headline: 'The kind of blue that changes your plans.',
      dek: 'Easy shapes, washed tones, and pieces made for slow mornings after loud nights.',
      brandStory: 'Ocean Mood designs for the version of you that canceled plans to stay near water. Washed tones, soft cuts, oversized layers, and the kind of blue that makes everything else feel like it is trying too hard.',
      scene: 'Sunday morning. Windows down, hair still damp, coffee getting cold in the cupholder. No plans. No rush.',
      quotes: [
        'She canceled brunch and drove to the water instead.',
        'The oversized hoodie is giving lazy Sunday in the car.',
        'Salt air and an outfit that said: I am not going anywhere.',
      ],
    };
  }

  if (normalized.includes('july') || normalized.includes('america')) {
    return {
      brandName: 'July',
      headline: 'Red, white, blue, and slightly unserious.',
      dek: 'Patriotic graphics with backyard-party energy.',
      brandStory: 'July is a seasonal line that only shows up when the weather earns it. Cookout graphics, denim-friendly fits, and pieces designed to look great in direct sunlight with a drink in hand.',
      scene: 'Backyard, sparklers, someone\'s playlist, and an outfit that was definitely planned but looks effortless.',
      quotes: [
        'She brought the flag tee and the fireworks.',
        'Hot dogs, denim cutoffs, and main-character energy.',
        'The Fourth of July is her runway and she knows it.',
      ],
    };
  }

  if (normalized.includes('lucky') || normalized.includes('manifest')) {
    return {
      brandName: 'Lucky Girl',
      headline: 'Dress like the plot is already working in your favor.',
      dek: 'Leopard, little signs from the universe, and pieces that turn getting dressed into a ritual.',
      brandStory: 'Lucky Girl is for the ones who treat getting dressed like manifesting. Leopard print, signs from the universe, and graphics that say you already know how this ends.',
      scene: 'She lit the candle, put on the hoodie, wrote it down, and went about her day like it was already done.',
      quotes: [
        'Manifesting in a crewneck and calling it a vision board.',
        'The universe sent a sign. She was already wearing it.',
        'Lucky is not luck. Lucky is the outfit plus the intention.',
      ],
    };
  }

  if (normalized.includes('delulu')) {
    return {
      brandName: 'Delulu',
      headline: 'Reality is optional, the outfit is not.',
      dek: 'For the girls who understand that confidence is mostly commitment.',
      brandStory: 'Delulu started as a joke and became a whole philosophy. Pieces for the ones who say it out loud, dress like it is already true, and understand that delusion is just confidence with better marketing.',
      scene: 'She told the group chat she was booked all summer. She was not. But now she believes it.',
      quotes: [
        'Delulu is the solulu and the outfit proves it.',
        'She manifested the invite by dressing like she already had one.',
        'The confidence is not delusional if the fit backs it up.',
      ],
    };
  }

  if (normalized.includes('anxiety') || normalized.includes('bad girl')) {
    return {
      brandName: 'Bad Girls Club',
      headline: 'Anxious but make it fashion.',
      dek: 'Graphic tees, phone cases, and statement pieces for the girls who feel everything and wear it anyway.',
      brandStory: 'Bad Girls Club started for the chronically anxious who still show up looking like they run the room. Every piece says what you are thinking but too polite to post.',
      scene: 'Overthinking the text. Under-thinking the outfit. Still walked in and owned it.',
      quotes: [
        'Anxiety is real but so is this outfit.',
        'She said what everyone was thinking. On a tee.',
        'Bad girl energy with a therapy appointment at 3.',
      ],
    };
  }

  if (normalized.includes('breakfast') || normalized.includes('pancake')) {
    return {
      brandName: 'Breakfast Club',
      headline: 'Weekend energy on a weekday.',
      dek: 'Pancakes, coffee, and pieces designed for the person who treats Saturday morning like a lifestyle.',
      brandStory: 'Breakfast Club is for the ones who brunch like it is an event. Cozy layers, warm tones, and graphics that smell like maple syrup and poor decisions from last night.',
      scene: 'It is 11am. She ordered a stack of pancakes and a mimosa and has no plans of leaving.',
      quotes: [
        'Pancakes fix everything and this crew proves it.',
        'She showed up to brunch in the crewneck and everyone asked where she got it.',
        'Breakfast is not a meal. It is a personality.',
      ],
    };
  }

  if (normalized.includes('jersey')) {
    return {
      brandName: 'Jerseys',
      headline: 'Game day but elevated.',
      dek: 'Custom jerseys that work at the bar, the tailgate, and the group photo.',
      brandStory: 'Jerseys by Brands By Status are built for the people who take game day personally. Not a costume, not a replica. A jersey that looks like you meant it.',
      scene: 'She showed up in the custom jersey and suddenly everyone wanted one.',
      quotes: [
        'It is not about the team. It is about the jersey.',
        'She wore #1 because she was not taking suggestions.',
        'Game day fits that go straight to the bar after.',
      ],
    };
  }

  if (normalized.includes('running') || normalized.includes('responsibilities')) {
    return {
      brandName: 'Running From Responsibilities',
      headline: 'Accountability who?',
      dek: 'Graphic hoodies, tees, and sweats for everyone who is avoiding something right now.',
      brandStory: 'Running From Responsibilities is for the people who said they would get to it later. Every piece captures that energy of being productive at everything except what you are supposed to be doing.',
      scene: 'She has 47 unread emails and just bought a crewneck instead of answering any of them.',
      quotes: [
        'Running late, running away, running from responsibilities.',
        'She ignored the to-do list and looked great doing it.',
        'Procrastination never looked this intentional.',
      ],
    };
  }

  if (normalized.includes('san diego') || normalized.includes('palm tree')) {
    return {
      brandName: 'San Diego',
      headline: 'West coast forever.',
      dek: 'Palm trees, sunsets, and the kind of laid-back that takes effort to look this easy.',
      brandStory: 'San Diego is a love letter to the West Coast attitude. Sun-faded colors, relaxed silhouettes, and graphics that remind you to slow down even when you will not.',
      scene: 'Windows down on the 5, sunset hitting different, wearing the tee she bought at the boardwalk.',
      quotes: [
        'She is on West Coast time and not apologizing.',
        'Palm trees and a good tee fix most problems.',
        'San Diego energy in every time zone.',
      ],
    };
  }

  if (normalized.includes('sunday') || normalized.includes('car girl')) {
    return {
      brandName: 'Sunday Kind Of Love',
      headline: 'Sunday is not a day. It is a state of mind.',
      dek: 'Slow morning pieces, car girl energy, and outfits for the drive with no destination.',
      brandStory: 'Sunday Kind Of Love is for the romantics who treat a Sunday drive like therapy. Soft layers, oversized comfort, and the kind of outfit you wear when the only plan is no plan.',
      scene: 'She got in the car with no destination, a cold brew, and the windows down. The outfit was already perfect.',
      quotes: [
        'Sunday best is a hoodie and a full tank of gas.',
        'Car girl energy with nowhere to be and everywhere to go.',
        'She drove for two hours and came back a different person.',
      ],
    };
  }

  if (normalized.includes('hoodie')) {
    return {
      brandName: 'The Hoodie Edit',
      headline: 'The comfort piece is doing the most.',
      dek: 'Oversized, washed, zipped, cropped, or fleece-heavy.',
      brandStory: 'Not a brand, but a conviction. The hoodie edit pulls the best comfort layers from every brand under the Brands By Status umbrella.',
      scene: 'Couch, blanket, hood up, still somehow looking like a campaign.',
      quotes: [
        'She wore the hoodie to everything and nobody complained.',
        'Comfort is the new flex and this hoodie knows it.',
        'Hood up, coffee in hand, main character of nothing and everything.',
      ],
    };
  }

  return {
    brandName: name || 'Status',
    headline: `${name || 'The collection'} is having a moment.`,
    dek: 'The pieces, moods, and small obsessions shaping the Brands By Status universe.',
    brandStory: `${name || 'This line'} is part of the Brands By Status world. Every piece is designed to carry a feeling, not just a label.`,
    scene: 'She got dressed today and the outfit had something to say.',
    quotes: [
      'Status is not a brand. It is how you carry the outfit.',
      'She wore it like she designed it herself.',
      'The fit speaks. You just have to let it.',
    ],
  };
}

function buildCollectionEditorial(collection, products, horizontalImages, portraitImages) {
  const brand = getBrandIdentity(collection?.name);
  const productCount = products.length;

  return {
    ...brand,
    intro: brand.brandStory,
    mood: brand.brandVibe,
    growth: productCount
      ? `${productCount} piece${productCount === 1 ? '' : 's'} in the current drop.`
      : 'New pieces arriving soon.',
  };
}

function buildDailyMagazineIssue(collections, products, catalogCollections, categories) {
  const collectionIssues = (collections || []).map((collection) => {
    const issueProducts = getProductsForDesignCollection(products, collection.name);
    const horizontalImages = getImagesForCollection(collection.id, catalogCollections, 'horizontal');
    const portraitImages = getImagesForCollection(collection.id, catalogCollections, 'portrait_4x5');
    return {
      type: 'collection',
      collection,
      products: issueProducts,
      images: [...horizontalImages, ...portraitImages],
      editorial: buildCollectionEditorial(collection, issueProducts, horizontalImages, portraitImages),
    };
  });

  const hoodieProducts = products.filter((product) =>
    `${product.name} ${product.collection}`.toLowerCase().includes('hoodie')
  );
  const categoryIssues = hoodieProducts.length
    ? [{
        type: 'category',
        title: 'All Things Hoodie',
        products: hoodieProducts,
        images: hoodieProducts.map((product) => ({ url: product.image, alt: product.name })).filter((image) => image.url),
        editorial: {
          ...getBrandIdentity('hoodie'),
          intro: 'Today the magazine is giving the comfort layer its main-character edit: oversized hoodies, cropped zip-ups, soft fleece, and pieces that make staying in look intentional.',
          mood: 'Cozy. Styled. Not leaving the house but still looking good.',
          growth: `${hoodieProducts.length} hoodie-adjacent product${hoodieProducts.length === 1 ? '' : 's'} are currently in the edit, and the story shifts as new layers enter the catalog.`,
        },
      }]
    : [];

  const issues = [...collectionIssues, ...categoryIssues].filter((issue) => issue.products.length || issue.images.length);
  return issues[getDailyIndex(issues.length)] || null;
}

function buildFullMagazine(collections, products, catalogCollections) {
  const spreads = (collections || []).map((collection) => {
    const issueProducts = getProductsForDesignCollection(products, collection.name);
    const horizontalImages = getImagesForCollection(collection.id, catalogCollections, 'horizontal');
    const portraitImages = getImagesForCollection(collection.id, catalogCollections, 'portrait_4x5');
    return {
      collection,
      products: issueProducts,
      images: [...horizontalImages, ...portraitImages],
      editorial: buildCollectionEditorial(collection, issueProducts, horizontalImages, portraitImages),
    };
  }).filter((spread) => spread.products.length || spread.images.length);

  // Today's cover story rotates daily
  const coverIndex = getDailyIndex(spreads.length);
  const cover = spreads[coverIndex] || null;
  const remaining = spreads.filter((_, i) => i !== coverIndex);

  return { cover, spreads: remaining, allSpreads: spreads };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function CartDrawer({ cart, isOpen, onClose, onUpdateQty, onRemove, onSubmitOrder, orderStatus, orderLoading }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`cart-shell${isOpen ? ' cart-shell-open' : ''}`} aria-hidden={!isOpen}>
      <button className="cart-backdrop" onClick={onClose} aria-label="Close cart" />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-head">
          <div>
            <p className="eyebrow">Your Bag</p>
            <h2>{cart.length ? `${cart.length} item${cart.length === 1 ? '' : 's'}` : 'Cart is empty'}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={34} />
              <p>Add products to build your first Brands By Status order.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.cartId}>
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.color} / {item.size}</p>
                  <span>{formatCurrency(item.price)}</span>
                  <div className="qty-row">
                    <button onClick={() => onUpdateQty(item.cartId, item.quantity - 1)} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <strong>{item.quantity}</strong>
                    <button onClick={() => onUpdateQty(item.cartId, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                    <button className="remove-btn" onClick={() => onRemove(item.cartId)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-foot">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <p>Secure checkout collects payment and shipping, then starts your made-to-order production.</p>
          <form className="checkout-form" onSubmit={onSubmitOrder}>
            {orderStatus ? <p className="order-status">{orderStatus}</p> : null}
            <button className={`checkout-btn${cart.length ? '' : ' checkout-disabled'}`} disabled={!cart.length || orderLoading}>
              {orderLoading ? 'Opening Stripe...' : 'Checkout with Stripe'} <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}

function getProductOptions(product) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  return {
    colorOptions: product.colorOptions?.length
      ? product.colorOptions
      : colors.map((title) => ({ title, swatches: [] })),
    sizeOptions: product.sizeOptions?.length
      ? product.sizeOptions
      : sizes.map((title) => ({ title })),
  };
}

function getProductMedia(product, color) {
  const selectedMedia = product.colorImages?.[color] || {};
  const primaryImage = selectedMedia.image || product.image;
  const secondaryImage = selectedMedia.secondaryImage || product.secondaryImage || primaryImage;
  const colorGalleryImages = Object.values(product.colorImages || {}).flatMap((media) => media.gallery || []);
  const galleryImages = [
    ...new Set([...(product.gallery || []), ...colorGalleryImages, product.image, product.secondaryImage, primaryImage, secondaryImage].filter(Boolean)),
  ];

  return { primaryImage, secondaryImage, galleryImages };
}

function findPrintifyVariant(product, color, size) {
  const { colorOptions, sizeOptions } = getProductOptions(product);
  const colorId = colorOptions.find((option) => option.title === color)?.id;
  const sizeId = sizeOptions.find((option) => option.title === size)?.id;

  return (product.variants || []).find((variant) => {
    if (!variant.isEnabled) return false;

    const optionIds = Array.isArray(variant.options) ? variant.options.map(Number) : [];
    const matchesColor = !colorId || optionIds.includes(Number(colorId));
    const matchesSize = !sizeId || optionIds.includes(Number(sizeId));
    return matchesColor && matchesSize;
  });
}

function ProductTile({ product, onSelect }) {
  const [activeColor, setActiveColor] = useState('');
  const colorEntries = Object.entries(product.colorImages || {});
  const activeMedia = product.colorImages?.[activeColor];
  const displayImage = activeMedia?.image || product.image;

  return (
    <article className="product-tile">
      <button className="product-tile-button" onClick={() => onSelect(product)}>
        <div className="tile-media">
          <img src={displayImage} alt={product.name} />
          <span>Quick View</span>
        </div>
      </button>
      {colorEntries.length > 1 && (
        <div className="tile-variants">
          {colorEntries.slice(0, 5).map(([colorName, media]) => (
            <button
              className={`tile-variant-thumb${colorName === activeColor ? ' active' : ''}`}
              key={colorName}
              onClick={() => setActiveColor(colorName === activeColor ? '' : colorName)}
              aria-label={colorName}
            >
              <img src={media.image} alt={colorName} />
            </button>
          ))}
          {colorEntries.length > 5 && (
            <span className="tile-variant-more">+{colorEntries.length - 5}</span>
          )}
        </div>
      )}
      <button className="tile-copy-button" onClick={() => onSelect(product)}>
        <div className="tile-copy">
          <h3>{product.name}</h3>
          <div className="tile-price-row">
            <strong>{formatCurrency(product.price)}</strong>
          </div>
        </div>
      </button>
    </article>
  );
}

function ProductDetail({ product, isOpen, onClose, onAdd }) {
  const { colorOptions, sizeOptions } = getProductOptions(product || { colors: [], sizes: [] });
  const [color, setColor] = useState(colorOptions[0]?.title || '');
  const [size, setSize] = useState(sizeOptions[0]?.title || '');
  const [selectedThumbImage, setSelectedThumbImage] = useState('');

  if (!product) return null;

  const { primaryImage, galleryImages } = getProductMedia(product, color);
  const selectedColor = colorOptions.find((option) => option.title === color);
  const mainImage = selectedThumbImage || galleryImages[0] || primaryImage;

  return (
    <div className={`detail-shell${isOpen ? ' detail-shell-open' : ''}`} aria-hidden={!isOpen}>
      <button className="detail-backdrop" onClick={onClose} aria-label="Close product details" />
      <section className="detail-panel" aria-label={`${product.name} details`}>
        <button className="detail-close icon-btn" onClick={onClose} aria-label="Close product details">
          <X size={20} />
        </button>

        <div className="detail-gallery">
          <div className="detail-thumbs">
            {galleryImages.map((src, index) => (
              <button
                className={src === mainImage ? 'detail-thumb active' : 'detail-thumb'}
                key={src}
                onClick={() => setSelectedThumbImage(src)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
          <img className="detail-main-img" src={mainImage} alt={product.name} />
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{product.collection}</p>
          <h2>{product.name}</h2>
          <strong className="detail-price">{formatCurrency(product.price)}</strong>
          <p>{product.description}</p>

          <div className="option-group">
            <label htmlFor={`size-${product.id}`}>Size</label>
            <select
              id={`size-${product.id}`}
              className="detail-select"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            >
              {sizeOptions.map((option) => (
                <option key={option.title} value={option.title}>{option.title}</option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label htmlFor={`color-${product.id}`}>Color</label>
            <div className="detail-color-select">
              {selectedColor?.swatches?.length ? (
                <span
                  className="swatch"
                  style={{ background: selectedColor.swatches[0] }}
                  aria-hidden="true"
                />
              ) : null}
              <select
                id={`color-${product.id}`}
                className="detail-select"
                value={color}
                onChange={(event) => {
                  const nextColor = event.target.value;
                  setColor(nextColor);
                  setSelectedThumbImage(product.colorImages?.[nextColor]?.image || product.image);
                }}
              >
                {colorOptions.map((option) => (
                  <option key={option.title} value={option.title}>{option.title}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              onAdd(product, color, size, mainImage);
              onClose();
            }}
          >
            Add to Bag <Plus size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function RotatingCollectionImage({ images, className, alt }) {
  const [index, setIndex] = useState(0);
  const visibleImages = images.filter((image) => image.url);

  useEffect(() => {
    setIndex(0);
    if (visibleImages.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % visibleImages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [visibleImages.length]);

  const image = visibleImages[index % Math.max(visibleImages.length, 1)];
  if (!image) return null;

  return <img className={className} src={image.url} alt={image.alt || alt || ''} />;
}

function StoreCollectionFeature({ collection, horizontalImages, portraitImages, onSelect }) {
  return (
    <article className="design-collection-card">
      <button type="button" className="design-collection-media" onClick={onSelect}>
        <RotatingCollectionImage
          images={horizontalImages}
          className="design-collection-horizontal"
          alt={`${collection.name} collection`}
        />
        <div className="design-collection-portraits">
          <RotatingCollectionImage
            images={portraitImages}
            className="design-collection-portrait"
            alt={`${collection.name} portrait`}
          />
          <RotatingCollectionImage
            images={[...portraitImages].reverse()}
            className="design-collection-portrait"
            alt={`${collection.name} portrait`}
          />
        </div>
      </button>
      <div className="design-collection-copy">
        <p className="eyebrow">Collection</p>
        <h3>{collection.name}</h3>
        {collection.description ? <p>{collection.description}</p> : null}
        <a href={getCollectionUrl(collection)}>
          Read the editorial <ArrowRight size={15} />
        </a>
        <button type="button" onClick={onSelect}>
          Shop the edit <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

function MagazineFlow({ magazine, onSelectProduct }) {
  if (!magazine?.cover) return null;

  const { cover, spreads, allSpreads: every } = magazine;
  const allSpreads = [cover, ...spreads];
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
  const dayIndex = getDailyIndex(allSpreads.length);

  // Today's featured brand (cover story)
  const featured = cover;
  const featuredBrand = featured.editorial;
  const featuredImage = featured.images[0]?.url || featured.products[0]?.image;
  const featuredProducts = featured.products.slice(0, 4);

  // Headlines = other brands with recent products (rotate daily, show 4)
  const headlines = spreads.slice(0, 4);

  // The Status List = trending products across all brands (rotate selection daily)
  const allProducts = allSpreads.flatMap((s) => s.products);
  const statusStart = getDailyIndex(Math.max(1, allProducts.length - 6));
  const statusList = allProducts.slice(statusStart, statusStart + 6);
  if (statusList.length < 6) statusList.push(...allProducts.slice(0, 6 - statusList.length));

  // Coming soon = brands with images but fewer products
  const comingSoon = allSpreads
    .filter((s) => s.images.length > 0 && s.products.length < 3)
    .slice(0, 3);

  return (
    <>
      {/* ── MASTHEAD ── */}
      <section className="drop-masthead">
        <div className="drop-masthead-inner">
          <div className="drop-rule" />
          <div className="drop-masthead-row">
            <p className="drop-edition">Vol. 1</p>
            <p className="drop-date">{today}</p>
            <p className="drop-edition">Daily Edition</p>
          </div>
          <h1 className="drop-title">Brands By Status</h1>
          <p className="drop-tagline">Small brands. Big status.</p>
          <div className="drop-rule" />
          <div className="drop-nav-row">
            <a href="#headlines">Headlines</a>
            <span className="drop-nav-dot" />
            <a href="#brand-feature">Brand Feature</a>
            <span className="drop-nav-dot" />
            <a href="#status-list">The Status List</a>
            <span className="drop-nav-dot" />
            <a href="#shop">Shop All</a>
          </div>
          <div className="drop-rule-thin" />
        </div>
      </section>

      {/* ── TODAY'S HEADLINES ── */}
      <section className="drop-section" id="headlines">
        <div className="drop-section-inner">
          <h2 className="drop-section-label">Today's Headlines</h2>
          <p className="drop-section-sub">Fresh drops from the brands we are watching.</p>

          <div className="drop-headlines-grid">
            {/* Lead story */}
            <article className="drop-lead">
              {featuredImage ? (
                <div className="drop-lead-image">
                  <img src={featuredImage} alt={featuredBrand.brandName} />
                  <span className="drop-label-badge">Today's Drop</span>
                </div>
              ) : null}
              <div className="drop-lead-text">
                <p className="drop-brand-tag">{featuredBrand.brandName}</p>
                <h3 className="drop-lead-headline">{featuredBrand.headline}</h3>
                <p className="drop-lead-dek">{featuredBrand.dek}</p>
                {featuredProducts.length > 0 ? (
                  <div className="drop-lead-products">
                    {featuredProducts.map((product) => (
                      <button
                        className="drop-product-chip"
                        key={product.id}
                        onClick={() => onSelectProduct(product)}
                      >
                        <img src={product.image} alt={product.name} />
                        <div>
                          <span className="drop-chip-name">{product.name}</span>
                          <span className="drop-chip-price">${product.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
                <a className="drop-read-link" href={featured.collection ? getCollectionUrl(featured.collection) : '#shop'}>
                  Read full feature <ArrowRight size={13} />
                </a>
              </div>
            </article>

            {/* Sidebar headlines */}
            <div className="drop-sidebar-headlines">
              {headlines.map((spread) => {
                const brand = spread.editorial;
                const img = spread.images[0]?.url || spread.products[0]?.image;
                const url = spread.collection ? getCollectionUrl(spread.collection) : '#shop';
                return (
                  <a className="drop-headline-card" key={spread.collection?.id} href={url}>
                    {img ? <img src={img} alt="" className="drop-headline-thumb" /> : null}
                    <div>
                      <p className="drop-brand-tag">{brand.brandName}</p>
                      <p className="drop-headline-title">{brand.headline}</p>
                      <span className="drop-headline-count">
                        {spread.products.length ? `${spread.products.length} piece${spread.products.length !== 1 ? 's' : ''}` : 'View collection'}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="drop-pull-quote">
        <blockquote>
          {featuredBrand.quotes?.[dayIndex % (featuredBrand.quotes?.length || 1)] || featuredBrand.scene}
        </blockquote>
      </section>

      {/* ── BRAND FEATURE ── */}
      <section className="drop-section drop-feature-section" id="brand-feature">
        <div className="drop-section-inner">
          <h2 className="drop-section-label">Brand Feature</h2>
          <p className="drop-section-sub">One brand. The full story.</p>

          <div className="drop-feature-layout">
            <div className="drop-feature-story">
              <p className="drop-brand-tag">{featuredBrand.brandName}</p>
              <h3 className="drop-feature-headline">{featuredBrand.headline}</h3>
              <p className="drop-feature-body">{featuredBrand.brandStory}</p>
              <blockquote className="drop-feature-scene">{featuredBrand.scene}</blockquote>
              <a className="drop-read-link" href={featured.collection ? getCollectionUrl(featured.collection) : '#shop'}>
                Shop {featuredBrand.brandName} <ArrowRight size={13} />
              </a>
            </div>
            <div className="drop-feature-gallery">
              {featured.images.slice(0, 3).map((img, idx) => (
                <div className={`drop-feature-img ${idx === 0 ? 'drop-feature-img-main' : ''}`} key={img.url || idx}>
                  <img src={img.url} alt="" />
                </div>
              ))}
              {featured.images.length < 2 && featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 2).map((product) => (
                  <button className="drop-feature-product" key={product.id} onClick={() => onSelectProduct(product)}>
                    <img src={product.image} alt={product.name} />
                    <span>${product.price}</span>
                  </button>
                ))
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE STATUS LIST ── */}
      <section className="drop-section" id="status-list">
        <div className="drop-section-inner">
          <h2 className="drop-section-label">The Status List</h2>
          <p className="drop-section-sub">Trending pieces across all brands right now.</p>

          <div className="drop-status-grid">
            {statusList.map((product, idx) => (
              <button className="drop-status-card" key={product.id + '-' + idx} onClick={() => onSelectProduct(product)}>
                <span className="drop-status-rank">{String(idx + 1).padStart(2, '0')}</span>
                <img src={product.image} alt={product.name} />
                <div className="drop-status-info">
                  <span className="drop-status-name">{product.name}</span>
                  <span className="drop-status-price">${product.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMING SOON / BRANDS TO WATCH ── */}
      {comingSoon.length > 0 ? (
        <section className="drop-section">
          <div className="drop-section-inner">
            <h2 className="drop-section-label">Coming Soon</h2>
            <p className="drop-section-sub">Brands loading new drops. Stay tuned.</p>

            <div className="drop-coming-grid">
              {comingSoon.map((spread) => {
                const brand = spread.editorial;
                const img = spread.images[0]?.url;
                return (
                  <div className="drop-coming-card" key={spread.collection?.id}>
                    {img ? <img src={img} alt="" /> : null}
                    <div className="drop-coming-text">
                      <p className="drop-brand-tag">{brand.brandName}</p>
                      <p className="drop-coming-tease">{brand.dek}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── APPLY FOR A FEATURE ── */}
      <section className="drop-section drop-apply-section">
        <div className="drop-section-inner drop-apply-inner">
          <h2 className="drop-section-label">Apply For A Feature</h2>
          <p className="drop-apply-pitch">
            You have a brand, a product, a drop, a line, a vision. We give it the spotlight.
            Brands By Status features small brands with big energy.
          </p>
          <a className="drop-apply-btn" href="mailto:hello@brandsbystatus.com?subject=Feature my brand">
            Get Featured <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </>
  );
}

function CollectionEditorialPage({
  collection,
  products,
  horizontalImages,
  portraitImages,
  onSelectProduct,
  cartCount,
  onOpenCart,
  allCollections = [],
  allCategories = [],
}) {
  const editorial = buildCollectionEditorial(collection, products, horizontalImages, portraitImages);
  const leadImages = horizontalImages.length ? horizontalImages : portraitImages;
  const leadImage = leadImages[0]?.url || products[0]?.image;
  const allImages = [...horizontalImages, ...portraitImages];
  const secondImage = allImages[1]?.url;
  const thirdImage = allImages[2]?.url;
  const remainingImages = allImages.slice(3);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editFilter, setEditFilter] = useState('All');

  const productCategories = useMemo(() => {
    const cats = new Set();
    products.forEach((product) => {
      if (product.collection) cats.add(product.collection);
      (product.customCategories || []).forEach((c) => cats.add(c.name));
    });
    return ['All', ...cats];
  }, [products]);

  const filteredEditProducts = useMemo(() => {
    if (editFilter === 'All') return products;
    return products.filter((product) => {
      const customNames = (product.customCategories || []).map((c) => c.name);
      return product.collection === editFilter || customNames.includes(editFilter);
    });
  }, [products, editFilter]);

  return (
    <>
      <div className="announcement-bar">
        Brands By Status editorial
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Brands By Status home">
          <img src="/portfolio/bbs-logo-new.png" alt="Brands By Status" />
          <span>Brands By Status</span>
        </a>
        <nav className="ed-nav">
          <a href="/">Home</a>
          <div className="ed-nav-dropdown">
            <button
              type="button"
              className="ed-nav-trigger"
              onClick={() => setOpenDropdown(openDropdown === 'collections' ? null : 'collections')}
            >
              Collections <ChevronDown size={14} />
            </button>
            {openDropdown === 'collections' ? (
              <>
                <div className="ed-nav-backdrop" onClick={() => setOpenDropdown(null)} />
                <div className="ed-nav-menu">
                  {allCollections.map((c) => (
                    <a key={c.id} href={getCollectionUrl(c)}>{c.name}</a>
                  ))}
                  {!allCollections.length ? <span className="ed-nav-empty">None yet</span> : null}
                </div>
              </>
            ) : null}
          </div>
          <div className="ed-nav-dropdown">
            <button
              type="button"
              className="ed-nav-trigger"
              onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}
            >
              Category <ChevronDown size={14} />
            </button>
            {openDropdown === 'categories' ? (
              <>
                <div className="ed-nav-backdrop" onClick={() => setOpenDropdown(null)} />
                <div className="ed-nav-menu">
                  {allCategories.map((cat) => (
                    <a key={cat} href={`/?category=${encodeURIComponent(cat)}#shop`}>{cat}</a>
                  ))}
                  {!allCategories.length ? <span className="ed-nav-empty">None yet</span> : null}
                </div>
              </>
            ) : null}
          </div>
          <a href="/?category=All#shop">Shop All</a>
        </nav>
        <button className="bag-btn" onClick={onOpenCart} aria-label="Open cart">
          <ShoppingBag size={19} />
          <span>{cartCount}</span>
        </button>
      </header>

      <main className="ed-page">
        {/* ── NEWSPAPER MASTHEAD ── */}
        <section className="ed-masthead">
          <div className="ed-masthead-rule" />
          <p className="ed-dateline">Brands By Status &mdash; Editorial Desk</p>
          <h1 className="ed-title">{collection.name}</h1>
          <p className="ed-dek">{editorial.dek}</p>
          <div className="ed-masthead-rule" />
        </section>

        {/* ── LEAD IMAGE (newspaper-sized, captioned) ── */}
        {leadImage ? (
          <figure className="ed-figure ed-figure-lead">
            <img src={leadImage} alt={collection.name} />
            <figcaption>{editorial.kicker || 'From the current collection'}</figcaption>
          </figure>
        ) : null}

        {/* ── OPENING BODY TEXT ── */}
        <section className="ed-body">
          <h2 className="ed-headline">{editorial.headline}</h2>
          <p className="ed-byline">By the Brands By Status editorial team</p>
          <div className="ed-columns">
            <p>{editorial.intro}</p>
            <p>{editorial.scene || editorial.mood}</p>
          </div>
        </section>

        {/* ── INLINE PHOTO (float-style, like a newspaper insert) ── */}
        {secondImage ? (
          <section className="ed-body">
            <figure className="ed-figure ed-figure-inline">
              <img src={secondImage} alt="" />
              <figcaption>{editorial.brandName} &mdash; photographed for Brands By Status</figcaption>
            </figure>
            <blockquote className="ed-pullquote">
              &ldquo;{editorial.quotes?.[0] || editorial.mood}&rdquo;
            </blockquote>
          </section>
        ) : null}

        {/* ── THE EDIT (products as editorial picks) ── */}
        {products.length ? (
          <section className="ed-the-edit" id="the-edit">
            <div className="ed-section-label">
              <span>The Edit</span>
              <span className="ed-divider" />
              <span>{filteredEditProducts.length} piece{filteredEditProducts.length === 1 ? '' : 's'}</span>
            </div>
            {productCategories.length > 2 ? (
              <div className="ed-filter-pills">
                {productCategories.map((cat) => (
                  <button
                    key={cat}
                    className={cat === editFilter ? 'ed-pill ed-pill-active' : 'ed-pill'}
                    onClick={() => setEditFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="ed-picks">
              {filteredEditProducts.map((product, i) => (
                <div className={`ed-pick ${i === 0 ? 'ed-pick-feature' : ''}`} key={product.id}>
                  <button className="ed-pick-img-btn" onClick={() => onSelectProduct(product)}>
                    <img src={product.image} alt={product.name} />
                    {i === 0 ? <span className="ed-pick-badge">Editor's pick</span> : null}
                  </button>
                  <div className="ed-pick-info">
                    <p className="ed-pick-number">{String(i + 1).padStart(2, '0')}</p>
                    <h3>{product.name}</h3>
                    <p className="ed-pick-price">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : allImages.length ? (
          <section className="ed-the-edit" id="the-edit">
            <div className="ed-section-label">
              <span>The Edit</span>
              <span className="ed-divider" />
              <span>Products loading</span>
            </div>
            <div className="floating-gallery-empty">
              {allImages.slice(0, 6).map((image, i) => (
                <div
                  className="floating-gallery-item"
                  key={image.id || image.url}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <img src={image.url} alt={image.alt || ''} />
                </div>
              ))}
              <p className="floating-gallery-label">Products loading soon</p>
            </div>
          </section>
        ) : null}

        {/* ── MID-ARTICLE PHOTO ── */}
        {thirdImage ? (
          <figure className="ed-figure ed-figure-mid">
            <img src={thirdImage} alt="" />
            <figcaption>Continued &mdash; {collection.name}</figcaption>
          </figure>
        ) : null}

        {/* ── CLOSING TEXT ── */}
        <section className="ed-body ed-closing">
          <p>{editorial.growth}</p>
          {editorial.quotes?.[1] ? (
            <blockquote className="ed-pullquote">
              &ldquo;{editorial.quotes[1]}&rdquo;
            </blockquote>
          ) : null}
        </section>

        {/* ── REMAINING GALLERY (contact sheet style) ── */}
        {remainingImages.length ? (
          <section className="ed-gallery" id="gallery">
            <p className="ed-gallery-header">Additional images</p>
            {remainingImages.map((image, index) => (
              <figure className={image.orientation === 'horizontal' ? 'ed-gallery-wide' : ''} key={image.id || image.url}>
                <img src={image.url} alt={image.alt || ''} />
                <figcaption>Fig. {index + 4}</figcaption>
              </figure>
            ))}
          </section>
        ) : null}
      </main>
    </>
  );
}

function AdminProductDetail({ product, onClose }) {
  if (!product) return null;

  const { colorOptions, sizeOptions } = getProductOptions(product);
  const colors = colorOptions.map((o) => o.title);
  const sizes = sizeOptions.map((o) => o.title);
  const gallery = product.gallery || [];
  const source = product.source === 'shopify' ? 'Shopify' : 'Printify';
  const sourceId = product.shopifyProductId || product.printifyProductId || product.id;
  const variants = product.variants || [];
  const enabledVariants = variants.filter((v) => v.isEnabled !== false);
  const prices = enabledVariants.map((v) => v.price).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : product.price;
  const maxPrice = prices.length ? Math.max(...prices) : product.price;

  return (
    <div className="admin-detail-overlay" onClick={onClose}>
      <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-detail-close" onClick={onClose}><X size={20} /></button>

        <div className="admin-detail-top">
          <div className="admin-detail-gallery">
            {gallery.slice(0, 8).map((src, i) => (
              <img key={i} src={src} alt="" className="admin-detail-thumb" />
            ))}
            {!gallery.length && product.image ? (
              <img src={product.image} alt="" className="admin-detail-thumb" />
            ) : null}
          </div>
          <div className="admin-detail-info">
            <span className={`admin-source-badge ${source.toLowerCase()}`}>{source}</span>
            <h2>{product.name}</h2>
            <p className="admin-detail-collection">{product.collection}</p>
            <p className="admin-detail-price">
              {minPrice === maxPrice
                ? formatCurrency(minPrice)
                : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`}
            </p>
            <p className="admin-detail-id">
              <strong>Source ID:</strong> {sourceId}
            </p>
            <p className="admin-detail-id">
              <strong>Internal ID:</strong> {product.id}
            </p>
            {product.printProviderId ? (
              <p className="admin-detail-id">
                <strong>Print Provider:</strong> {product.printProviderId}
              </p>
            ) : null}
          </div>
        </div>

        <div className="admin-detail-section">
          <h3>Description</h3>
          <p className="admin-detail-desc">{product.description || 'No description'}</p>
        </div>

        <div className="admin-detail-row">
          <div className="admin-detail-section">
            <h3>Colors ({colors.length})</h3>
            <div className="admin-detail-tags">
              {colors.map((c) => {
                const opt = colorOptions.find((o) => o.title === c);
                return (
                  <span key={c} className="admin-detail-tag">
                    {opt?.swatches?.[0] ? (
                      <span className="admin-swatch" style={{ background: opt.swatches[0] }} />
                    ) : null}
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="admin-detail-section">
            <h3>Sizes ({sizes.length})</h3>
            <div className="admin-detail-tags">
              {sizes.map((s) => (
                <span key={s} className="admin-detail-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-detail-section">
          <h3>Variants ({enabledVariants.length} enabled / {variants.length} total)</h3>
          <div className="admin-detail-variants">
            <div className="admin-variant-header">
              <span>SKU</span>
              <span>Options</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {variants.slice(0, 50).map((v) => (
              <div className="admin-variant-row" key={v.id}>
                <span className="admin-variant-sku">{v.sku || '—'}</span>
                <span>
                  {typeof v.options === 'object' && !Array.isArray(v.options)
                    ? Object.values(v.options).filter(Boolean).join(' / ')
                    : '—'}
                </span>
                <span>{formatCurrency(v.price)}</span>
                <span className={v.isEnabled !== false ? 'admin-variant-enabled' : 'admin-variant-disabled'}>
                  {v.isEnabled !== false ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
            {variants.length > 50 ? (
              <p className="admin-detail-more">+{variants.length - 50} more variants</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminApp() {
  const [adminPassword, setAdminPassword] = useState(() => window.sessionStorage.getItem('bbs-admin-password') || '');
  const [draftPassword, setDraftPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(Boolean(adminPassword));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [hiddenProductIds, setHiddenProductIds] = useState([]);
  const [collections, setCollections] = useState([]);
  const [collectionAssignments, setCollectionAssignments] = useState([]);
  const [collectionImages, setCollectionImages] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [categoryNameDraft, setCategoryNameDraft] = useState('');
  const [collectionNameDraft, setCollectionNameDraft] = useState('');
  const [collectionDescriptionDraft, setCollectionDescriptionDraft] = useState('');
  const [adminQuery, setAdminQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');
  const [adminCollectionFilter, setAdminCollectionFilter] = useState('in-collection');
  const [adminStatus, setAdminStatus] = useState('');
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminDetailProduct, setAdminDetailProduct] = useState(null);
  const [draggingUploadOrientation, setDraggingUploadOrientation] = useState('');

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const selectedCollection = collections.find((collection) => collection.id === selectedCollectionId);

  const assignedProductIds = useMemo(() => {
    return new Set(
      assignments
        .filter((assignment) => assignment.category_id === selectedCategoryId)
        .map((assignment) => assignment.product_id)
    );
  }, [assignments, selectedCategoryId]);

  const categoryNamesByProduct = useMemo(() => {
    const categoryById = new Map(categories.map((category) => [category.id, category.name]));
    const namesByProduct = new Map();

    for (const assignment of assignments) {
      const categoryName = categoryById.get(assignment.category_id);
      if (!categoryName) continue;

      const currentNames = namesByProduct.get(assignment.product_id) || [];
      currentNames.push(categoryName);
      namesByProduct.set(assignment.product_id, currentNames);
    }

    return namesByProduct;
  }, [assignments, categories]);

  const assignedCollectionProductIds = useMemo(() => {
    return new Set(
      collectionAssignments
        .filter((assignment) => assignment.collection_id === selectedCollectionId)
        .map((assignment) => assignment.product_id)
    );
  }, [collectionAssignments, selectedCollectionId]);

  const collectionNamesByProduct = useMemo(() => {
    const collectionById = new Map(collections.map((collection) => [collection.id, collection.name]));
    const namesByProduct = new Map();

    for (const assignment of collectionAssignments) {
      const collectionName = collectionById.get(assignment.collection_id);
      if (!collectionName) continue;

      const currentNames = namesByProduct.get(assignment.product_id) || [];
      currentNames.push(collectionName);
      namesByProduct.set(assignment.product_id, currentNames);
    }

    return namesByProduct;
  }, [collectionAssignments, collections]);

  const selectedCollectionImages = useMemo(() => {
    return collectionImages.filter((image) => image.collection_id === selectedCollectionId);
  }, [collectionImages, selectedCollectionId]);

  const hiddenProductIdSet = useMemo(() => new Set(hiddenProductIds), [hiddenProductIds]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const hasCategories = Boolean(categoryNamesByProduct.get(product.id)?.length);
      const matchesCategoryStatus =
        adminCategoryFilter === 'all' ||
        (adminCategoryFilter === 'in-category' && assignedProductIds.has(product.id)) ||
        (adminCategoryFilter === 'categorized' && hasCategories) ||
        (adminCategoryFilter === 'uncategorized' && !hasCategories);
      const matchesQuery = `${product.name} ${product.collection}`.toLowerCase().includes(adminQuery.toLowerCase());

      return matchesCategoryStatus && matchesQuery;
    });
  }, [products, adminQuery, adminCategoryFilter, categoryNamesByProduct, assignedProductIds]);

  const adminCategoryCounts = useMemo(() => {
    return products.reduce(
      (counts, product) => {
        const hasCategories = Boolean(categoryNamesByProduct.get(product.id)?.length);
        counts.all += 1;
        if (hasCategories) {
          counts.categorized += 1;
        } else {
          counts.uncategorized += 1;
        }
        return counts;
      },
      { all: 0, categorized: 0, uncategorized: 0 }
    );
  }, [products, categoryNamesByProduct]);

  const categoryFilterOptions = [
    { value: 'in-category', label: 'In Category', count: assignedProductIds.size },
    { value: 'all', label: 'All', count: adminCategoryCounts.all },
    { value: 'categorized', label: 'Categorized', count: adminCategoryCounts.categorized },
    { value: 'uncategorized', label: 'Not Categorized', count: adminCategoryCounts.uncategorized },
  ];

  const visibleCollectionProducts = useMemo(() => {
    return products.filter((product) => {
      const hasCollections = Boolean(collectionNamesByProduct.get(product.id)?.length);
      const matchesCollectionStatus =
        adminCollectionFilter === 'all' ||
        (adminCollectionFilter === 'in-collection' && assignedCollectionProductIds.has(product.id)) ||
        (adminCollectionFilter === 'collected' && hasCollections) ||
        (adminCollectionFilter === 'not-collected' && !hasCollections);
      const matchesQuery = `${product.name} ${product.collection}`.toLowerCase().includes(adminQuery.toLowerCase());

      return matchesCollectionStatus && matchesQuery;
    });
  }, [products, adminQuery, adminCollectionFilter, collectionNamesByProduct, assignedCollectionProductIds]);

  const adminCollectionCounts = useMemo(() => {
    return products.reduce(
      (counts, product) => {
        const hasCollections = Boolean(collectionNamesByProduct.get(product.id)?.length);
        counts.all += 1;
        if (hasCollections) {
          counts.collected += 1;
        } else {
          counts.notCollected += 1;
        }
        return counts;
      },
      { all: 0, collected: 0, notCollected: 0 }
    );
  }, [products, collectionNamesByProduct]);

  const collectionFilterOptions = [
    { value: 'in-collection', label: 'In Collection', count: assignedCollectionProductIds.size },
    { value: 'all', label: 'All', count: adminCollectionCounts.all },
    { value: 'collected', label: 'Collected', count: adminCollectionCounts.collected },
    { value: 'not-collected', label: 'Not Collected', count: adminCollectionCounts.notCollected },
  ];

  async function adminFetch(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
        ...(options.headers || {}),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function login(event) {
    event.preventDefault();
    setAdminStatus('');

    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': draftPassword,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      window.sessionStorage.setItem('bbs-admin-password', draftPassword);
      setAdminPassword(draftPassword);
      setAuthenticated(true);
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  const loadAdminData = useCallback(async (preferredCategoryId = '', preferredCollectionId = '') => {
    setLoadingAdmin(true);
    setAdminStatus('Loading products and categories...');

    try {
      const [productsResponse, categoriesResponse, collectionsResponse] = await Promise.all([
        fetch('/api/printify-products'),
        fetch('/api/product-categories'),
        fetch('/api/product-collections'),
      ]);
      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const collectionsData = await collectionsResponse.json();

      if (!productsResponse.ok) throw new Error(productsData.error || 'Unable to load products');
      if (!categoriesResponse.ok) throw new Error(categoriesData.error || 'Unable to load categories');
      if (!collectionsResponse.ok) throw new Error(collectionsData.error || 'Unable to load collections');

      const nextCategories = categoriesData.categories || [];
      const selectedCategoryStillExists = nextCategories.some((category) => category.id === preferredCategoryId);
      const nextSelectedId = selectedCategoryStillExists ? preferredCategoryId : nextCategories[0]?.id || '';
      const nextSelectedCategory = nextCategories.find((category) => category.id === nextSelectedId);
      const nextCollections = collectionsData.collections || [];
      const selectedCollectionStillExists = nextCollections.some((collection) => collection.id === preferredCollectionId);
      const nextSelectedCollectionId = selectedCollectionStillExists ? preferredCollectionId : nextCollections[0]?.id || '';
      const nextSelectedCollection = nextCollections.find((collection) => collection.id === nextSelectedCollectionId);

      setProducts(productsData.products || []);
      setCategories(nextCategories);
      setAssignments(categoriesData.assignments || []);
      setHiddenProductIds(categoriesData.hiddenProductIds || []);
      setCollections(nextCollections);
      setCollectionAssignments(collectionsData.assignments || []);
      setCollectionImages(collectionsData.images || []);
      setSelectedCategoryId(nextSelectedId);
      setSelectedCollectionId(nextSelectedCollectionId);
      setCategoryNameDraft(nextSelectedCategory?.name || '');
      setCollectionNameDraft(nextSelectedCollection?.name || '');
      setCollectionDescriptionDraft(nextSelectedCollection?.description || '');
      setAdminStatus(
        categoriesData.setupRequired || collectionsData.setupRequired
          ? categoriesData.message || collectionsData.message || 'Supabase setup is required before categories and collections can be saved.'
          : `${productsData.products?.length || 0} products loaded`
      );
    } catch (error) {
      setAdminStatus(error.message);
    } finally {
      setLoadingAdmin(false);
    }
  }, []);

  async function syncPrintifyPhotos() {
    setLoadingAdmin(true);
    setAdminStatus('Syncing fresh Printify photos...');

    try {
      try {
        window.localStorage.removeItem(PRODUCT_CACHE_KEY);
      } catch {
        // Continue syncing even if the browser refuses storage access.
      }
      const response = await fetch(`/api/printify-products?refresh=1&t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Unable to sync Printify photos');

      const freshProducts = data.products || [];
      setProducts(freshProducts);
      const cached = cacheProducts(freshProducts);
      setAdminStatus(
        cached
          ? `${freshProducts.length} products synced from Printify`
          : `${freshProducts.length} products synced. Browser cache was full, so fresh photos will load from the server.`
      );
    } catch (error) {
      setAdminStatus(error.message);
    } finally {
      setLoadingAdmin(false);
    }
  }

  useEffect(() => {
    if (authenticated) {
      const timer = window.setTimeout(() => {
        loadAdminData();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [authenticated, loadAdminData]);

  async function createCategory(event) {
    event.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const data = await adminFetch('/api/product-categories', {
        method: 'POST',
        body: JSON.stringify({ action: 'createCategory', name: newCategoryName }),
      });
      setNewCategoryName('');
      if (data.existing) {
        setAdminStatus(`Selected existing ${data.category.name}`);
      }
      await loadAdminData(data.category?.id);
    } catch (error) {
      setAdminStatus(error.message);
      await loadAdminData(selectedCategoryId);
    }
  }

  async function updateCategory(event) {
    event.preventDefault();
    const nextName = categoryNameDraft.trim();

    if (!selectedCategoryId || !nextName || nextName === selectedCategory?.name) return;

    try {
      await adminFetch('/api/product-categories', {
        method: 'POST',
        body: JSON.stringify({ action: 'updateCategory', categoryId: selectedCategoryId, name: nextName }),
      });
      setAdminStatus(`Updated ${nextName}`);
      await loadAdminData(selectedCategoryId);
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  async function deleteCategory() {
    if (!selectedCategoryId) return;

    try {
      await adminFetch('/api/product-categories', {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteCategory', categoryId: selectedCategoryId }),
      });
      setSelectedCategoryId('');
      await loadAdminData('');
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  async function toggleAssignment(productId, checked) {
    if (!selectedCategoryId) return;

    const optimistic = checked
      ? [...assignments, { product_id: productId, category_id: selectedCategoryId }]
      : assignments.filter(
          (assignment) => !(assignment.product_id === productId && assignment.category_id === selectedCategoryId)
        );
    setAssignments(optimistic);

    try {
      await adminFetch('/api/product-categories', {
        method: 'POST',
        body: JSON.stringify({
          action: checked ? 'assignProduct' : 'unassignProduct',
          categoryId: selectedCategoryId,
          productId,
        }),
      });
    } catch (error) {
      setAdminStatus(error.message);
      await loadAdminData();
    }
  }

  async function toggleProductHidden(productId, hidden) {
    const optimistic = hidden
      ? [...new Set([...hiddenProductIds, productId])]
      : hiddenProductIds.filter((hiddenProductId) => hiddenProductId !== productId);
    setHiddenProductIds(optimistic);

    try {
      await adminFetch('/api/product-categories', {
        method: 'POST',
        body: JSON.stringify({
          action: hidden ? 'hideProduct' : 'showProduct',
          productId,
        }),
      });
    } catch (error) {
      setAdminStatus(error.message);
      await loadAdminData(selectedCategoryId);
    }
  }

  async function createCollection(event) {
    event.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const data = await adminFetch('/api/product-collections', {
        method: 'POST',
        body: JSON.stringify({ action: 'createCollection', name: newCollectionName }),
      });
      setNewCollectionName('');
      if (data.existing) {
        setAdminStatus(`Selected existing ${data.collection.name}`);
      }
      const nextCollectionId = data.collection?.id || selectedCollectionId;
      await loadAdminData(selectedCategoryId, nextCollectionId);
    } catch (error) {
      setAdminStatus(error.message);
      await loadAdminData(selectedCategoryId, selectedCollectionId);
    }
  }

  async function updateCollection(event) {
    event.preventDefault();
    const nextName = collectionNameDraft.trim();

    if (!selectedCollectionId || !nextName) return;

    try {
      await adminFetch('/api/product-collections', {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateCollection',
          collectionId: selectedCollectionId,
          name: nextName,
          description: collectionDescriptionDraft,
        }),
      });
      setAdminStatus(`Updated ${nextName}`);
      await loadAdminData(selectedCategoryId, selectedCollectionId);
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  async function deleteCollection() {
    if (!selectedCollectionId) return;

    try {
      await adminFetch('/api/product-collections', {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteCollection', collectionId: selectedCollectionId }),
      });
      setSelectedCollectionId('');
      await loadAdminData(selectedCategoryId, '');
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  async function toggleCollectionAssignment(productId, checked) {
    if (!selectedCollectionId) return;

    const optimistic = checked
      ? [...collectionAssignments, { product_id: productId, collection_id: selectedCollectionId }]
      : collectionAssignments.filter(
          (assignment) => !(assignment.product_id === productId && assignment.collection_id === selectedCollectionId)
        );
    setCollectionAssignments(optimistic);

    try {
      await adminFetch('/api/product-collections', {
        method: 'POST',
        body: JSON.stringify({
          action: checked ? 'assignProduct' : 'unassignProduct',
          collectionId: selectedCollectionId,
          productId,
        }),
      });
    } catch (error) {
      setAdminStatus(error.message);
      await loadAdminData(selectedCategoryId, selectedCollectionId);
    }
  }

  async function uploadCollectionFiles(files, orientation) {
    const imageFiles = Array.from(files || []).filter((file) => file.type.startsWith('image/'));

    if (!imageFiles.length || !selectedCollectionId) return;

    setLoadingAdmin(true);
    setAdminStatus(
      `Uploading ${imageFiles.length} ${orientation === 'horizontal' ? 'horizontal' : '4:5'} image${imageFiles.length === 1 ? '' : 's'}...`
    );

    try {
      for (const file of imageFiles) {
        const dataUrl = await readFileAsDataUrl(file);
        await adminFetch('/api/product-collections', {
          method: 'POST',
          body: JSON.stringify({
            action: 'addImage',
            collectionId: selectedCollectionId,
            orientation,
            fileName: file.name,
            dataUrl,
            alt: `${selectedCollection?.name || 'Collection'} image`,
          }),
        });
      }
      setAdminStatus(`Uploaded ${imageFiles.length} collection image${imageFiles.length === 1 ? '' : 's'}`);
      await loadAdminData(selectedCategoryId, selectedCollectionId);
    } catch (error) {
      setAdminStatus(error.message);
    } finally {
      setLoadingAdmin(false);
      setDraggingUploadOrientation('');
    }
  }

  async function uploadCollectionImage(event, orientation) {
    const files = event.target.files;
    event.target.value = '';
    await uploadCollectionFiles(files, orientation);
  }

  async function dropCollectionImages(event, orientation) {
    event.preventDefault();
    event.stopPropagation();
    setDraggingUploadOrientation('');
    await uploadCollectionFiles(event.dataTransfer.files, orientation);
  }

  async function deleteCollectionImage(imageId) {
    try {
      await adminFetch('/api/product-collections', {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteImage', imageId }),
      });
      setCollectionImages((current) => current.filter((image) => image.id !== imageId));
      setAdminStatus('Collection image removed');
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <p className="eyebrow">Brands By Status Admin</p>
          <h1>Sign in</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={draftPassword}
            onChange={(event) => setDraftPassword(event.target.value)}
          />
          <button className="add-btn" type="submit">Enter Admin</button>
          {adminStatus ? <p className="admin-status">{adminStatus}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <p className="eyebrow">Brands By Status</p>
          <h1>Product Categories</h1>
        </div>
        <a className="secondary-admin-link" href="/">View Store</a>
      </header>

      <section className="admin-layout">
        <aside className="admin-sidebar">
          <form className="admin-create" onSubmit={createCategory}>
            <label>New Category</label>
            <input
              type="text"
              placeholder="e.g. Hoodies"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>

          <div className="admin-category-list">
            {categories.map((category) => (
              <button
                className={category.id === selectedCategoryId ? 'admin-category active' : 'admin-category'}
                key={category.id}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setCategoryNameDraft(category.name);
                  setAdminCategoryFilter('in-category');
                }}
              >
                <span>{category.name}</span>
                <strong>
                  {assignments.filter((assignment) => assignment.category_id === category.id).length}
                </strong>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-products">
          <div className="admin-products-head">
            <div>
              <h2>{selectedCategory?.name || 'Choose a category'}</h2>
              <p>{adminStatus}</p>
            </div>
            <div className="admin-actions">
              <input
                type="search"
                placeholder="Search products"
                value={adminQuery}
                onChange={(event) => setAdminQuery(event.target.value)}
              />
              <button onClick={() => loadAdminData(selectedCategoryId)} disabled={loadingAdmin}>Refresh</button>
              <button onClick={syncPrintifyPhotos} disabled={loadingAdmin}>Sync Printify Photos</button>
              <button onClick={deleteCategory} disabled={!selectedCategoryId}>Delete Category</button>
            </div>
            <div className="admin-filter-tabs" aria-label="Category status filter">
              {categoryFilterOptions.map((option) => (
                <button
                  className={adminCategoryFilter === option.value ? 'active' : ''}
                  key={option.value}
                  type="button"
                  onClick={() => setAdminCategoryFilter(option.value)}
                >
                  {option.label} <span>{option.count}</span>
                </button>
              ))}
            </div>
            <form className="admin-edit-category" onSubmit={updateCategory}>
              <label htmlFor="category-name">Edit category name</label>
              <div>
                <input
                  id="category-name"
                  type="text"
                  placeholder="Select a category"
                  value={categoryNameDraft}
                  disabled={!selectedCategoryId}
                  onChange={(event) => setCategoryNameDraft(event.target.value)}
                />
                <button
                  type="submit"
                  disabled={!selectedCategoryId || !categoryNameDraft.trim() || categoryNameDraft.trim() === selectedCategory?.name}
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>

          <div className="admin-product-list">
            {visibleProducts.map((product) => {
              const productCategoryNames = categoryNamesByProduct.get(product.id) || [];
              const productIsHidden = hiddenProductIdSet.has(product.id);

              return (
                <div className={`admin-product-row${productIsHidden ? ' admin-product-row-hidden' : ''}`} key={product.id}>
                  <input
                    type="checkbox"
                    checked={assignedProductIds.has(product.id)}
                    disabled={!selectedCategoryId}
                    onChange={(event) => toggleAssignment(product.id, event.target.checked)}
                  />
                  <img src={product.image} alt="" onClick={() => setAdminDetailProduct(product)} style={{ cursor: 'pointer' }} />
                  <span className="admin-product-info" onClick={() => setAdminDetailProduct(product)} style={{ cursor: 'pointer' }}>
                    <span>{product.name}</span>
                    <span className="admin-product-categories">
                      {productIsHidden ? <small className="hidden">Hidden</small> : null}
                      {product.source === 'shopify' ? <small className="shopify-tag">Shopify</small> : null}
                      {productCategoryNames.length ? (
                        productCategoryNames.map((categoryName) => (
                          <small key={categoryName}>{categoryName}</small>
                        ))
                      ) : (
                        <small className="empty">Uncategorized</small>
                      )}
                    </span>
                  </span>
                  <strong>{formatCurrency(product.price)}</strong>
                  <button
                    className="admin-hide-toggle"
                    type="button"
                    onClick={() => toggleProductHidden(product.id, !productIsHidden)}
                  >
                    {productIsHidden ? 'Show' : 'Hide'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      <section className="admin-collections-panel">
        <div className="admin-collections-head">
          <div>
            <p className="eyebrow">Design Collections</p>
            <h2>{selectedCollection?.name || 'Create a collection'}</h2>
            <p>
              Categories are garment types. Collections are the shared design story, drop,
              or visual world those products belong to.
            </p>
          </div>
          <button onClick={deleteCollection} disabled={!selectedCollectionId}>Delete Collection</button>
        </div>

        <div className="admin-collections-grid">
          <aside className="admin-sidebar">
            <form className="admin-create" onSubmit={createCollection}>
              <label>New Collection</label>
              <input
                type="text"
                placeholder="e.g. Afterglow Disco Cherries"
                value={newCollectionName}
                onChange={(event) => setNewCollectionName(event.target.value)}
              />
              <button type="submit">Add</button>
            </form>

            <div className="admin-category-list">
              {collections.map((collection) => (
                <button
                  className={collection.id === selectedCollectionId ? 'admin-category active' : 'admin-category'}
                  key={collection.id}
                  onClick={() => {
                    setSelectedCollectionId(collection.id);
                    setCollectionNameDraft(collection.name);
                    setCollectionDescriptionDraft(collection.description || '');
                    setAdminCollectionFilter('in-collection');
                  }}
                >
                  <span>{collection.name}</span>
                  <strong>
                    {collectionAssignments.filter((assignment) => assignment.collection_id === collection.id).length}
                  </strong>
                </button>
              ))}
            </div>
          </aside>

          <section className="admin-collection-workspace">
            <form className="admin-edit-collection" onSubmit={updateCollection}>
              <label htmlFor="collection-name">Collection name</label>
              <input
                id="collection-name"
                type="text"
                placeholder="Select a collection"
                value={collectionNameDraft}
                disabled={!selectedCollectionId}
                onChange={(event) => setCollectionNameDraft(event.target.value)}
              />
              <label htmlFor="collection-description">Collection note</label>
              <textarea
                id="collection-description"
                placeholder="Optional short styling note for the storefront"
                value={collectionDescriptionDraft}
                disabled={!selectedCollectionId}
                onChange={(event) => setCollectionDescriptionDraft(event.target.value)}
              />
              <button type="submit" disabled={!selectedCollectionId || !collectionNameDraft.trim()}>
                Save Collection
              </button>
            </form>

            <div className="admin-image-upload-grid">
              {[
                ['horizontal', 'Horizontal Images', 'Best for wide collection headers and editorial banners.'],
                ['portrait_4x5', '4:5 Images', 'Best for product-story tiles, lookbook cards, and mobile.'],
              ].map(([orientation, title, description]) => {
                const imagesForOrientation = selectedCollectionImages.filter((image) => image.orientation === orientation);

                return (
                  <div
                    className={`admin-image-upload-card${draggingUploadOrientation === orientation ? ' drag-active' : ''}${!selectedCollectionId || loadingAdmin ? ' disabled' : ''}`}
                    key={orientation}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      if (selectedCollectionId && !loadingAdmin) setDraggingUploadOrientation(orientation);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (selectedCollectionId && !loadingAdmin) event.dataTransfer.dropEffect = 'copy';
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setDraggingUploadOrientation('');
                      }
                    }}
                    onDrop={(event) => dropCollectionImages(event, orientation)}
                  >
                    <div>
                      <ImageIcon size={19} />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                    <div className="admin-drop-zone">
                      <Upload size={18} />
                      <span>Drag photos here</span>
                      <small>Drop JPG, PNG, or WebP files into this {orientation === 'horizontal' ? 'horizontal' : '4:5'} pool.</small>
                    </div>
                    <label className={`admin-upload-button${!selectedCollectionId || loadingAdmin ? ' disabled' : ''}`}>
                      <Upload size={15} />
                      Upload
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        disabled={!selectedCollectionId || loadingAdmin}
                        onChange={(event) => uploadCollectionImage(event, orientation)}
                      />
                    </label>
                    <div className={`admin-upload-preview ${orientation === 'portrait_4x5' ? 'portrait' : 'horizontal'}`}>
                      {imagesForOrientation.length ? (
                        imagesForOrientation.map((image) => (
                          <figure key={image.id}>
                            <img src={image.url} alt="" />
                            <button type="button" onClick={() => deleteCollectionImage(image.id)} aria-label="Delete image">
                              <Trash2 size={14} />
                            </button>
                          </figure>
                        ))
                      ) : (
                        <span>No images yet</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="admin-products admin-collection-products">
              <div className="admin-products-head">
                <div>
                  <h2>Products in Collection</h2>
                  <p>{selectedCollection ? `Add products that share the ${selectedCollection.name} design story.` : 'Choose or create a collection first.'}</p>
                </div>
                <div className="admin-actions compact">
                  <input
                    type="search"
                    placeholder="Search products"
                    value={adminQuery}
                    onChange={(event) => setAdminQuery(event.target.value)}
                  />
                  <button onClick={() => loadAdminData(selectedCategoryId, selectedCollectionId)} disabled={loadingAdmin}>Refresh</button>
                </div>
                <div className="admin-filter-tabs" aria-label="Collection status filter">
                  {collectionFilterOptions.map((option) => (
                    <button
                      className={adminCollectionFilter === option.value ? 'active' : ''}
                      key={option.value}
                      type="button"
                      onClick={() => setAdminCollectionFilter(option.value)}
                    >
                      {option.label} <span>{option.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-product-list collection-product-list">
                {visibleCollectionProducts.map((product) => {
                  const productCollectionNames = collectionNamesByProduct.get(product.id) || [];
                  const productIsHidden = hiddenProductIdSet.has(product.id);

                  return (
                    <div className={`admin-product-row${productIsHidden ? ' admin-product-row-hidden' : ''}`} key={product.id}>
                      <input
                        type="checkbox"
                        checked={assignedCollectionProductIds.has(product.id)}
                        disabled={!selectedCollectionId}
                        onChange={(event) => toggleCollectionAssignment(product.id, event.target.checked)}
                      />
                      <img src={product.image} alt="" onClick={() => setAdminDetailProduct(product)} style={{ cursor: 'pointer' }} />
                      <span className="admin-product-info" onClick={() => setAdminDetailProduct(product)} style={{ cursor: 'pointer' }}>
                        <span>{product.name}</span>
                        <span className="admin-product-categories">
                          {productCollectionNames.length ? (
                            productCollectionNames.map((collectionName) => (
                              <small key={collectionName}>{collectionName}</small>
                            ))
                          ) : (
                            <small className="empty">No collection</small>
                          )}
                        </span>
                      </span>
                      <strong>{formatCurrency(product.price)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </section>

      {adminDetailProduct ? (
        <AdminProductDetail product={adminDetailProduct} onClose={() => setAdminDetailProduct(null)} />
      ) : null}
    </main>
  );
}

function CheckoutSuccess() {
  const [status, setStatus] = useState('Confirming payment and starting your order...');

  useEffect(() => {
    let cancelled = false;
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    async function fulfillOrder() {
      if (!sessionId) {
        setStatus('Missing Stripe checkout session.');
        return;
      }

      try {
        const response = await fetch('/api/stripe-fulfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || data.message || 'Unable to start production for this order');
        if (!cancelled) {
          setStatus(data.alreadyFulfilled ? 'Your order was already submitted.' : 'Your paid order is in production.');
        }
      } catch (error) {
        if (!cancelled) setStatus(error.message);
      }
    }

    fulfillOrder();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="checkout-success-page">
      <div>
        <p className="eyebrow">Brands By Status</p>
        <h1>Checkout Complete</h1>
        <p>{status}</p>
        <a className="primary-btn" href="/">Return to Store</a>
      </div>
    </main>
  );
}

export default function App() {
  const cachedProducts = useMemo(() => getCachedProducts(), []);
  const [activeCollection, setActiveCollection] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [storeProducts, setStoreProducts] = useState(cachedProducts);
  const [catalogCategories, setCatalogCategories] = useState({ categories: [], assignments: [] });
  const [catalogCollections, setCatalogCollections] = useState({ collections: [], assignments: [], images: [] });
  const [productsLoading, setProductsLoading] = useState(!cachedProducts.length);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeDesignCollection, setActiveDesignCollection] = useState('All');

  useEffect(() => {
    let cancelled = false;

    async function loadPrintifyProducts() {
      try {
        const response = await fetch(`/api/printify-products?t=${Date.now()}`);
        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        if (!cancelled && Array.isArray(data.products) && data.products.length) {
          setStoreProducts(data.products);
          cacheProducts(data.products);
        }
      } catch {
        // Keep showing cached products or the empty state if the live catalog is unavailable.
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    async function loadCatalogCategories() {
      try {
        const response = await fetch('/api/product-categories');
        const data = await response.json();

        if (!cancelled && response.ok) {
          setCatalogCategories(data);
        }
      } catch {
        // The shop can still render Printify categories if Supabase is not configured yet.
      }
    }

    async function loadCatalogCollections() {
      try {
        const response = await fetch('/api/product-collections');
        const data = await response.json();

        if (!cancelled && response.ok) {
          setCatalogCollections(data);
        }
      } catch {
        // The shop can still render products if custom collections are not configured yet.
      }
    }

    loadPrintifyProducts();
    loadCatalogCategories();
    loadCatalogCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  const categorizedProducts = useMemo(
    () => {
      const hiddenIds = new Set(catalogCategories.hiddenProductIds || []);
      return applyCustomCollections(
        applyCustomCategories(
        storeProducts.filter((product) => !hiddenIds.has(product.id)),
        catalogCategories
        ),
        catalogCollections
      );
    },
    [storeProducts, catalogCategories, catalogCollections]
  );

  const filteredProducts = useMemo(() => {
    return categorizedProducts.filter((product) => {
      const customCategoryNames = product.customCategories?.map((category) => category.name) || [];
      const designCollectionNames = product.designCollections?.map((collection) => collection.name) || [];
      const matchesCollection =
        activeCollection === 'All' ||
        customCategoryNames.includes(activeCollection) ||
        product.collection === activeCollection;
      const matchesDesignCollection =
        activeDesignCollection === 'All' ||
        designCollectionNames.includes(activeDesignCollection);
      const matchesQuery = `${product.name} ${product.collection} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCollection && matchesDesignCollection && matchesQuery;
    });
  }, [activeCollection, activeDesignCollection, query, categorizedProducts]);

  const visibleCollections = useMemo(() => {
    if (catalogCategories.categories.length) {
      return ['All', ...catalogCategories.categories.map((category) => category.name)];
    }

    return ['All', ...new Set(storeProducts.map((product) => product.collection))];
  }, [catalogCategories.categories, storeProducts]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const featuredCollections = visibleCollections.filter((collection) => collection !== 'All').slice(0, 8);
  const dailyMagazineIssue = useMemo(
    () => buildDailyMagazineIssue(
      catalogCollections.collections,
      categorizedProducts,
      catalogCollections,
      catalogCategories.categories
    ),
    [catalogCollections, catalogCategories.categories, categorizedProducts]
  );
  const fullMagazine = useMemo(
    () => buildFullMagazine(
      catalogCollections.collections,
      categorizedProducts,
      catalogCollections
    ),
    [catalogCollections, categorizedProducts]
  );

  const storefrontCollections = useMemo(() => {
    return (catalogCollections.collections || [])
      .map((collection) => ({
        ...collection,
        horizontalImages: getImagesForCollection(collection.id, catalogCollections, 'horizontal'),
        portraitImages: getImagesForCollection(collection.id, catalogCollections, 'portrait_4x5'),
      }))
      .filter((collection) => collection.horizontalImages.length || collection.portraitImages.length)
      .slice(0, 6);
  }, [catalogCollections]);

  const visibleDesignCollections = useMemo(() => {
    return ['All', ...(catalogCollections.collections || []).map((collection) => collection.name)];
  }, [catalogCollections.collections]);

  const collectionPathSlug = window.location.pathname.match(/^\/collections\/([^/?#]+)/)?.[1] || '';
  const pageCollection = useMemo(() => {
    if (!collectionPathSlug) return null;
    const decodedSlug = decodeURIComponent(collectionPathSlug);
    return (catalogCollections.collections || []).find((collection) => {
      const slug = collection.slug || getCollectionUrl(collection).split('/').pop();
      return slug === decodedSlug;
    }) || null;
  }, [catalogCollections.collections, collectionPathSlug]);
  const pageCollectionProducts = useMemo(
    () => (pageCollection ? getProductsForDesignCollection(categorizedProducts, pageCollection.name) : []),
    [categorizedProducts, pageCollection]
  );
  const pageHorizontalImages = pageCollection
    ? getImagesForCollection(pageCollection.id, catalogCollections, 'horizontal')
    : [];
  const pagePortraitImages = pageCollection
    ? getImagesForCollection(pageCollection.id, catalogCollections, 'portrait_4x5')
    : [];

  function addToCart(product, color, size, image) {
    const variant = findPrintifyVariant(product, color, size);
    const variantId = variant?.id || product.defaultVariantId;
    const cartId = `${product.id}-${variantId}-${color}-${size}`;
    setCart((current) => {
      const existing = current.find((item) => item.cartId === cartId);
      if (existing) {
        return current.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, image: image || product.image, cartId, color, size, variantId, quantity: 1 }];
    });
    setOrderStatus('');
    setCartOpen(true);
  }

  function updateQty(cartId, quantity) {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.cartId !== cartId));
      return;
    }
    setCart((current) => current.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  }

  async function startStripeCheckout(event) {
    event.preventDefault();
    setOrderStatus('');

    const missingVariant = cart.find((item) => !item.variantId);
    if (missingVariant) {
      setOrderStatus(`Missing Printify variant for ${missingVariant.name}. Try choosing another size or color.`);
      return;
    }

    setOrderLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.printifyProductId || item.id,
            variant_id: item.variantId,
            quantity: item.quantity,
            name: item.name,
            color: item.color,
            size: item.size,
            image: item.image,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || data.message || 'Unable to start checkout');
      if (!data.url) throw new Error('Stripe did not return a checkout URL');

      window.location.href = data.url;
    } catch (error) {
      setOrderStatus(error.message);
    } finally {
      setOrderLoading(false);
    }
  }

  if (window.location.pathname === '/admin') {
    return <AdminApp />;
  }

  if (window.location.pathname === '/checkout-success') {
    return <CheckoutSuccess />;
  }

  if (collectionPathSlug) {
    if (!pageCollection) {
      return (
        <>
          <div className="announcement-bar">Brands By Status editorial</div>
          <header className="site-header">
            <a className="brand" href="/" aria-label="Brands By Status home">
              <img src="/portfolio/bbs-logo-new.png" alt="Brands By Status" />
              <span>Brands By Status</span>
            </a>
            <nav>
              <a href="/">Home</a>
              <a href="/#design-collections">Collections</a>
              <a href="/#shop">Shop</a>
            </nav>
            <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingBag size={19} />
              <span>{cartCount}</span>
            </button>
          </header>
          <main className="editorial-page">
            <section className="editorial-missing">
              <p className="eyebrow">Collection page</p>
              <h1>This editorial is getting dressed.</h1>
              <p>Once the collection is published with images or products, this page becomes its living magazine story.</p>
              <a className="primary-btn" href="/#design-collections">View Collections <ArrowRight size={16} /></a>
            </section>
          </main>
        </>
      );
    }

    return (
      <>
        <CollectionEditorialPage
          collection={pageCollection}
          products={pageCollectionProducts}
          horizontalImages={pageHorizontalImages}
          portraitImages={pagePortraitImages}
          onSelectProduct={setSelectedProduct}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          allCollections={catalogCollections.collections || []}
          allCategories={visibleCollections.filter((c) => c !== 'All')}
        />
        <CartDrawer
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={(cartId) => setCart((current) => current.filter((item) => item.cartId !== cartId))}
          onSubmitOrder={startStripeCheckout}
          orderStatus={orderStatus}
          orderLoading={orderLoading}
        />
        <ProductDetail
          key={selectedProduct?.id || 'closed'}
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      </>
    );
  }

  return (
    <>
      <div className="announcement-bar">
        The daily drop paper for small brands
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Brands By Status home">
          <img src="/portfolio/bbs-logo-new.png" alt="Brands By Status" />
          <span>Brands By Status</span>
        </a>
        <nav>
          <a href="#top">Today</a>
          <a href="#headlines">Headlines</a>
          <a href="#status-list">Trending</a>
          <a href="#shop">Shop</a>
        </nav>
        <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
          <ShoppingBag size={19} />
          <span>{cartCount}</span>
        </button>
      </header>

      <main id="top">
        {/* ── THE DROP PAPER ── */}
        <MagazineFlow magazine={fullMagazine} onSelectProduct={setSelectedProduct} />

        {/* ── SHOP ALL (searchable grid) ── */}
        <section className="drop-shop-index" id="shop">
          <div className="drop-section-inner">
            <div className="drop-shop-header">
              <div>
                <h2 className="drop-section-label">Shop All</h2>
                <p className="drop-section-sub">Every piece from every brand, all in one place.</p>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  type="search"
                  placeholder="Search products"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="collection-tabs" aria-label="Filter by category">
              {visibleCollections.map((collection) => (
                <button
                  className={collection === activeCollection ? 'tab tab-active' : 'tab'}
                  key={collection}
                  onClick={() => setActiveCollection(collection)}
                >
                  {collection}
                </button>
              ))}
            </div>

            {visibleDesignCollections.length > 1 ? (
              <div className="collection-tabs design-tabs" aria-label="Filter by brand">
                {visibleDesignCollections.map((collection) => (
                  <button
                    className={collection === activeDesignCollection ? 'tab tab-active' : 'tab'}
                    key={collection}
                    onClick={() => setActiveDesignCollection(collection)}
                  >
                    {collection}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="product-grid">
              {productsLoading ? (
                <div className="product-state">
                  <ShoppingBag size={30} />
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <ProductTile product={product} key={product.id} onSelect={setSelectedProduct} />
                ))
              ) : (
                <div className="product-state">
                  <Search size={30} />
                  <p>No products match this search.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── COLOPHON ── */}
        <section className="drop-colophon">
          <p className="drop-brand-tag">Brands By Status</p>
          <h2>Small brands. Big status.</h2>
          <p>
            We spotlight small brands, independent creators, and emerging labels.
            Every drop is curated, every feature is earned, and every piece carries
            more presence than a logo ever could.
          </p>
        </section>
      </main>

      <footer>
        <span>Brands By Status</span>
        <a href="mailto:hello@brandsbystatus.com">hello@brandsbystatus.com</a>
      </footer>

      <CartDrawer
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={(cartId) => setCart((current) => current.filter((item) => item.cartId !== cartId))}
        onSubmitOrder={startStripeCheckout}
        orderStatus={orderStatus}
        orderLoading={orderLoading}
      />

      <ProductDetail
        key={selectedProduct?.id || 'closed'}
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />
    </>
  );
}
