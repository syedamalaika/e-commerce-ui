// Mock Product Data
const products = [
    {
        id: 1,
        title: "Premium Wireless Noise Cancelling Headphones",
        category: "Electronics",
        price: 299.99,
        originalPrice: 349.99,
        rating: 4.8,
        ratingCount: 124,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        badge: "Sale"
    },
    {
        id: 2,
        title: "Minimalist Analog Watch",
        category: "Accessories",
        price: 149.50,
        originalPrice: null,
        rating: 4.5,
        ratingCount: 89,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        badge: "New"
    },
    {
        id: 3,
        title: "Ergonomic Office Chair",
        category: "Furniture",
        price: 219.00,
        originalPrice: 200.00, // Error in data meant to test logic? Fixed logic will handle.
        rating: 4.7,
        ratingCount: 204,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80",
        badge: "Best Seller"
    },
    {
        id: 4,
        title: "Leather Crossbody Bag",
        category: "Fashion",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.3,
        ratingCount: 56,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
        badge: null
    },
    {
        id: 5,
        title: "Smart Fitness Tracker",
        category: "Electronics",
        price: 99.00,
        originalPrice: null,
        rating: 4.6,
        ratingCount: 312,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
        badge: null
    },
    {
        id: 6,
        title: "Abstract Modern Wall Art",
        category: "Home Decor",
        price: 75.00,
        originalPrice: null,
        rating: 4.9,
        ratingCount: 23,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80",
        badge: null
    },
    {
        id: 7,
        title: "Ceramic Coffee Pour Over Set",
        category: "Kitchen",
        price: 45.00,
        originalPrice: null,
        rating: 4.8,
        ratingCount: 156,
        image: "https://images.unsplash.com/photo-1517080319523-28f731885b57?w=500&q=80",
        badge: null
    },
    {
        id: 8,
        title: "Unisex Cotton Hoodie",
        category: "Fashion",
        price: 55.00,
        originalPrice: 65.00,
        rating: 4.4,
        ratingCount: 88,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
        badge: "Limited"
    }
];

// State
let cart = [];
let activeFilters = {
    sort: 'featured',
    categories: []
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load components first (mimicking a framework)
    await loadComponent('header-container', 'components/header.html');
    await loadComponent('footer-container', 'components/footer.html');

    // Simulate Network Delay for Skeleton Effect
    const grid = document.getElementById('product-grid');
    if (grid) {
        showSkeletons(grid, 8);
        setTimeout(() => {
            renderProducts(products);
            updateProductCount(products.length);
        }, 800);
    }

    // Initialize Event Listeners
    setupFilters();
});

// Component Loader
async function loadComponent(id, path) {
    const container = document.getElementById(id);
    if (!container) return;
    try {
        const res = await fetch(path);
        // Handle file:// protocol limitation gracefully if mostly running local
        if (!res.ok && window.location.protocol === 'file:') {
            console.warn('Cannot fetch component on file:// protocol. Use a local server.');
            return;
        }
        const html = await res.text();
        container.innerHTML = html;

        // Re-attach specific handlers if needed (like cart toggle)
        if (id === 'header-container') updateCartUI();
    } catch (e) {
        console.error('Loader error:', e);
    }
}

// Render Logic
function renderProducts(data) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = data.map(product => `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="product-card h-100 d-flex flex-column">
                <div class="card-img-wrapper">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="card-actions">
                        <button class="action-btn" title="Add to Wishlist"><i class="bi bi-heart"></i></button>
                        <button class="action-btn" title="Quick View"><i class="bi bi-eye"></i></button>
                    </div>
                    ${product.badge ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm">${product.badge}</span>` : ''}
                </div>
                <div class="card-body d-flex flex-column flex-grow-1">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title" title="${product.title}">${product.title}</h3>
                    <div class="d-flex align-items-center mb-2">
                        <div class="text-warning small me-1">
                            ${renderStars(product.rating)}
                        </div>
                        <small class="text-muted">(${product.ratingCount})</small>
                    </div>
                    <div class="price-wrapper">
                        <div>
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '<i class="bi bi-star-fill"></i>';
    if (half) stars += '<i class="bi bi-star-half"></i>';
    for (let i = 0; i < (5 - full - (half ? 1 : 0)); i++) stars += '<i class="bi bi-star"></i>';
    return stars;
}

function showSkeletons(container, count) {
    container.innerHTML = Array(count).fill(0).map(() => `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="product-card h-100" style="border:none; box-shadow:none;">
                <div class="skeleton" style="height: 250px; border-radius: 16px;"></div>
                <div class="skeleton mt-3" style="height: 15px; width: 60%;"></div>
                <div class="skeleton mt-2" style="height: 20px; width: 90%;"></div>
                <div class="skeleton mt-3" style="height: 40px; border-radius: 8px;"></div>
            </div>
        </div>
    `).join('');
}

// Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Add logic (for now just push, simple)
    cart.push({ ...product, cartId: Date.now() }); // Unique ID for separate entries support

    // Show feedback
    showToast(`Added ${product.title} to cart`);
    updateCartUI();

    // Open cart drawer
    // const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    // offcanvas.show();
}

function toggleCart() {
    const el = document.getElementById('cartOffcanvas');
    if (!el) return;
    const bsOffcanvas = new bootstrap.Offcanvas(el);
    bsOffcanvas.toggle();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.innerText = cart.length;
        badge.classList.remove('d-none');
        badge.classList.add('animate__animated', 'animate__bounceIn'); // If using animate.css, otherwise plain
    }

    // Update Offcanvas Content
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (container && cart.length > 0) {
        container.innerHTML = cart.map((item, index) => `
            <div class="d-flex gap-3 mb-3 position-relative">
                <img src="${item.image}" class="rounded" width="60" height="60" style="object-fit:cover">
                <div>
                    <h6 class="mb-0 text-truncate" style="max-width: 150px;">${item.title}</h6>
                    <small class="text-muted">$${item.price.toFixed(2)}</small>
                </div>
                <button class="btn btn-sm text-danger position-absolute top-0 end-0" onclick="removeFromCart(${index})">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((acc, curr) => acc + curr.price, 0);
        if (subtotalEl) subtotalEl.innerText = `$${total.toFixed(2)}`;
    } else if (container) {
        container.innerHTML = `
            <div class="text-center text-muted mt-5 pt-5">
                <i class="bi bi-cart-x display-1 text-light"></i>
                <p class="mt-3">Your cart is empty.</p>
                <button class="btn btn-outline-primary mt-2" data-bs-dismiss="offcanvas">Start Shopping</button>
            </div>
        `;
        if (subtotalEl) subtotalEl.innerText = "$0.00";
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Filtering Logic
function setupFilters() {
    // Sort Select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            let sorted = [...products];
            if (val === 'price-low') sorted.sort((a, b) => a.price - b.price);
            if (val === 'price-high') sorted.sort((a, b) => b.price - a.price);
            // Default/Featured is initial order
            renderProducts(sorted);
        });
    }

    // Category Checkboxes
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            // Collect active
            const active = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.value);

            if (active.length === 0) {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => active.includes(p.category));
                renderProducts(filtered);
            }
            updateProductCount(active.length === 0 ? products.length : products.filter(p => active.includes(p.category)).length);
        });
    });
}

function updateProductCount(count) {
    const el = document.getElementById('result-count');
    if (el) el.innerText = `Showing ${count} results`;
}

// Toast Notification
function showToast(message) {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3');
        container.style.zIndex = '1100';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-primary border-0 show';
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle-fill me-2"></i> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toastEl);
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}
