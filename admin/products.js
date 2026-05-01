// products.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample products data
    let products = [
        {
            id: 1,
            name: 'Mango Graham Cake',
            category: 'Cakes',
            price: 185.00,
            stock: 24,
            status: 'active',
            featured: true,
            image: null,
            description: 'Creamy layers of graham crackers, ripe mangoes, and whipped cream',
            emoji: '🍰'
        },
        {
            id: 2,
            name: 'Dubai Cookies',
            category: 'Cookies',
            price: 35.00,
            stock: 8,
            status: 'active',
            featured: true,
            image: null,
            description: 'Crunchy butter cookies with sesame seeds',
            emoji: '🍪'
        },
        {
            id: 3,
            name: 'Ube Leche Flan',
            category: 'Pastries',
            price: 110.00,
            stock: 0,
            status: 'out-of-stock',
            featured: false,
            image: null,
            description: 'Rich purple yam flan with caramel syrup',
            emoji: '🍮'
        }
        // Add more products...
    ];

    const productsGrid = document.getElementById('productsGrid');
    const productSearch = document.getElementById('productSearch');
    const selectAllCheckbox = document.getElementById('selectAllProducts');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalProductTitle');

    // Render products
    function renderProducts(filteredProducts = products) {
        productsGrid.innerHTML = filteredProducts.map(product => {
            const stockClass = product.stock === 0 ? 'stock-out' : 
                             product.stock <= 5 ? 'stock-low' : 'stock-in-stock';
            const badgeClass = product.stock === 0 ? 'badge-out-of-stock' : 
                             product.stock <= 5 ? 'badge-low-stock' : '';
            
            return `
                <div class="card product-card" data-product-id="${product.id}">
                    <div class="product-image position-relative">
                        <div style="font-size: 4rem;">${product.emoji}</div>
                        ${badgeClass ? `<span class="product-badge ${badgeClass}">${product.stock === 0 ? 'Out of Stock' : 'Low Stock'}</span>` : ''}
                    </div>
                    <div class="card-body p-0">
                        <div class="product-info">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-2">${product.name}</h6>
                                <div class="form-check form-switch form-switch-sm d-inline-block ms-2">
                                    <input class="form-check-input" type="checkbox" id="status-${product.id}" ${product.status === 'active' ? 'checked' : ''}>
                                    <label class="form-check-label visually-hidden" for="status-${product.id}">Active</label>
                                </div>
                            </div>
                            <div class="product-price">₱${product.price.toLocaleString()}</div>
                            <div class="stock-status">
                                <i class="fas ${product.stock === 0 ? 'fa-times-circle' : product.stock <= 5 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                                <span class="${stockClass}">${product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'}</span>
                                <span class="ms-auto">${product.stock} pcs</span>
                            </div>
                            <div class="category-tags">
                                <span class="category-tag">${product.category}</span>
                                ${product.featured ? '<span class="category-tag bg-primary text-white">Featured</span>' : ''}
                            </div>
                            <div class="product-actions mt-3">
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Initial render
    renderProducts();

    // Search functionality
    productSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered);
    });

    // Select all functionality
    selectAllCheckbox.addEventListener('change', function() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const checkbox = card.querySelector('.form-check-input');
            if (checkbox) checkbox.checked = this.checked;
        });
    });

    // Toggle product status
    productsGrid.addEventListener('change', function(e) {
        if (e.target.classList.contains('form-check-input')) {
            const productId = e.target.id.replace('status-', '');
            const product = products.find(p => p.id == productId);
            if (product) {
                product.status = e.target.checked ? 'active' : 'inactive';
            }
        }
    });

    // Product form submission
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (this.checkValidity()) {
            const productId = parseInt(modalTitle.dataset.productId) || Date.now();
            const productData = {
                id: productId,
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value) || 0,
                status: document.getElementById('productStatus').checked ? 'active' : 'inactive',
                featured: document.getElementById('productFeatured').checked,
                description: document.getElementById('productDescription').value,
                emoji: getEmojiForCategory(document.getElementById('productCategory').value)
            };

            const existingIndex = products.findIndex(p => p.id === productId);
            if (existingIndex >= 0) {
                products[existingIndex] = productData;
            } else {
                products.push(productData);
            }

            renderProducts();
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            this.reset();
            modalTitle.textContent = 'Add New Product';
            modalTitle.dataset.productId = '';
        }
    });

    // Edit product
    productsGrid.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.btn-outline-primary');
        if (editBtn) {
            const productCard = editBtn.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                modalTitle.textContent = 'Edit Product';
                modalTitle.dataset.productId = productId;
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productStatus').checked = product.status === 'active';
                document.getElementById('productFeatured').checked = product.featured;
                document.getElementById('productDescription').value = product.description;
                
                new bootstrap.Modal(document.getElementById('productModal')).show();
            }
        }
    });

    function getEmojiForCategory(category) {
        const emojis = {
            'Cakes': '🍰',
            'Cookies': '🍪',
            'Pastries': '🥮',
            'Drinks': '🧋',
            'Others': '🍮'
        };
        return emojis[category] || '🍰';
    }
});