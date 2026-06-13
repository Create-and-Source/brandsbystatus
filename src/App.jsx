import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
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
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryNameDraft, setCategoryNameDraft] = useState('');
  const [adminQuery, setAdminQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');
  const [adminStatus, setAdminStatus] = useState('');
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminDetailProduct, setAdminDetailProduct] = useState(null);

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

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

  const hiddenProductIdSet = useMemo(() => new Set(hiddenProductIds), [hiddenProductIds]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const hasCategories = Boolean(categoryNamesByProduct.get(product.id)?.length);
      const matchesCategoryStatus =
        adminCategoryFilter === 'all' ||
        (adminCategoryFilter === 'categorized' && hasCategories) ||
        (adminCategoryFilter === 'uncategorized' && !hasCategories);
      const matchesQuery = `${product.name} ${product.collection}`.toLowerCase().includes(adminQuery.toLowerCase());

      return matchesCategoryStatus && matchesQuery;
    });
  }, [products, adminQuery, adminCategoryFilter, categoryNamesByProduct]);

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
    { value: 'all', label: 'All', count: adminCategoryCounts.all },
    { value: 'categorized', label: 'Categorized', count: adminCategoryCounts.categorized },
    { value: 'uncategorized', label: 'Not Categorized', count: adminCategoryCounts.uncategorized },
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

  const loadAdminData = useCallback(async (preferredCategoryId = '') => {
    setLoadingAdmin(true);
    setAdminStatus('Loading products and categories...');

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/printify-products'),
        fetch('/api/product-categories'),
      ]);
      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productsResponse.ok) throw new Error(productsData.error || 'Unable to load products');
      if (!categoriesResponse.ok) throw new Error(categoriesData.error || 'Unable to load categories');

      const nextCategories = categoriesData.categories || [];
      const selectedCategoryStillExists = nextCategories.some((category) => category.id === preferredCategoryId);
      const nextSelectedId = selectedCategoryStillExists ? preferredCategoryId : nextCategories[0]?.id || '';
      const nextSelectedCategory = nextCategories.find((category) => category.id === nextSelectedId);

      setProducts(productsData.products || []);
      setCategories(nextCategories);
      setAssignments(categoriesData.assignments || []);
      setHiddenProductIds(categoriesData.hiddenProductIds || []);
      setSelectedCategoryId(nextSelectedId);
      setCategoryNameDraft(nextSelectedCategory?.name || '');
      setAdminStatus(
        categoriesData.setupRequired
          ? categoriesData.message || 'Supabase setup is required before categories can be saved.'
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
  const [productsLoading, setProductsLoading] = useState(!cachedProducts.length);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

    loadPrintifyProducts();
    loadCatalogCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const categorizedProducts = useMemo(
    () => {
      const hiddenIds = new Set(catalogCategories.hiddenProductIds || []);
      return applyCustomCategories(
        storeProducts.filter((product) => !hiddenIds.has(product.id)),
        catalogCategories
      );
    },
    [storeProducts, catalogCategories]
  );

  const filteredProducts = useMemo(() => {
    return categorizedProducts.filter((product) => {
      const customCategoryNames = product.customCategories?.map((category) => category.name) || [];
      const matchesCollection =
        activeCollection === 'All' ||
        customCategoryNames.includes(activeCollection) ||
        product.collection === activeCollection;
      const matchesQuery = `${product.name} ${product.collection} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCollection && matchesQuery;
    });
  }, [activeCollection, query, categorizedProducts]);

  const visibleCollections = useMemo(() => {
    if (catalogCategories.categories.length) {
      return ['All', ...catalogCategories.categories.map((category) => category.name)];
    }

    return ['All', ...new Set(storeProducts.map((product) => product.collection))];
  }, [catalogCategories.categories, storeProducts]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const featuredCollections = visibleCollections.filter((collection) => collection !== 'All').slice(0, 8);

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

  return (
    <>
      <div className="announcement-bar">
        Made-to-order apparel and accessories from Brands By Status
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Brands By Status home">
          <img src="/portfolio/bbs-logo-new.png" alt="Brands By Status" />
          <span>Brands By Status</span>
        </a>
        <nav>
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#story">Story</a>
        </nav>
        <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
          <ShoppingBag size={19} />
          <span>{cartCount}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero hero-minimal">
          <img className="hero-bg-img" src="/portfolio/hero-header.png" alt="" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Wear the status.</h1>
          </div>
        </section>

        <section className="ticker" aria-label="Store highlights">
          <div>
            <span>Made to order</span>
            <span>Original designs</span>
            <span>Fresh drops</span>
            <span>Everyday status pieces</span>
            <span>Made to order</span>
            <span>Original designs</span>
            <span>Fresh drops</span>
            <span>Everyday status pieces</span>
          </div>
        </section>

        <section className="brand-intro">
          <p className="eyebrow">The drop</p>
          <h2>Everyday pieces with main-character energy.</h2>
          <p>
            Built like a real store, stocked with original Brands By Status designs, and organized
            by the way you actually shop: tees, hoodies, tanks, bags, phone cases, journals, and seasonal drops.
          </p>
        </section>

        <section className="feature-band" id="collections">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2>Find your next status piece.</h2>
            <p>
              Browse the core collections, then use the product grid to filter by drop, item type,
              or the exact design you came for.
            </p>
          </div>
          <div className="collection-card-grid">
            {featuredCollections.map((collection) => (
              <button
                className="collection-card"
                key={collection}
                onClick={() => {
                  setActiveCollection(collection);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={getCategoryImage(collection, categorizedProducts)} alt="" />
                <span>{collection}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="lifestyle-spread">
          <div className="spread-img">
            <img src="/portfolio/lifestyle-02.png" alt="Brands By Status lifestyle apparel" />
          </div>
          <div className="spread-text">
            <p className="eyebrow">New arrivals</p>
            <h2>Fresh designs, made for the scroll and the street.</h2>
            <p>
              Graphic tees, tanks, accessories, and seasonal pieces designed to look good in your closet,
              your cart, and your camera roll.
            </p>
            <a className="spread-link" href="#shop">Shop the collection <ArrowRight size={15} /></a>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-head">
            <div>
              <p className="eyebrow">Shop</p>
              <h2>Featured Products</h2>
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

          <div className="collection-tabs" aria-label="Collections">
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
        </section>

        <section className="lifestyle-banner">
          <img src="/portfolio/lifestyle-03.png" alt="Brands By Status collection" />
          <div>
            <p className="eyebrow">Made to order</p>
            <h2>Shop the pieces that feel like you.</h2>
            <a className="primary-btn" href="#shop">View Products <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="photo-grid" aria-label="Brands By Status lifestyle gallery">
          {[
            ['/portfolio/lifestyle-04.png', 'Fresh Brands By Status outfit'],
            ['/portfolio/category-hoodies.png', 'Brands By Status hoodies'],
            ['/portfolio/category-tee-shirts.png', 'Brands By Status tees'],
            ['/portfolio/lifestyle-05.png', 'Brands By Status accessories'],
            ['/portfolio/category-tank-tops.png', 'Brands By Status tank tops'],
            ['/portfolio/category-bags.png', 'Brands By Status bags'],
          ].map(([src, alt], index) => (
            <div className={index === 0 || index === 3 ? 'photo-grid-item tall' : 'photo-grid-item'} key={src}>
              <img src={src} alt={alt} />
            </div>
          ))}
        </section>

        <section className="order-panel">
          <div>
            <p className="eyebrow">Made to order</p>
            <h2>Your piece is produced after checkout.</h2>
            <p>
              Brands By Status keeps inventory lean by making products on demand. After your order is
              placed, production starts and shipping updates follow once your piece is on the move.
            </p>
          </div>
          <div className="steps">
            <div>
              <Sparkles size={20} />
              <span>Original pieces are designed for the Brands By Status catalog.</span>
            </div>
            <div>
              <Check size={20} />
              <span>Checkout confirms your selected size, color, and quantity.</span>
            </div>
            <div>
              <Truck size={20} />
              <span>Production and shipping updates are sent as your order moves forward.</span>
            </div>
          </div>
        </section>

        <section className="story-section" id="story">
          <div>
            <p className="eyebrow">Brands By Status</p>
            <h2>Status is personal.</h2>
          </div>
          <p>
            Brands By Status is built around clothes and goods that carry confidence without asking
            for permission. The pieces are made for people who like their everyday staples with a
            little more presence.
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
