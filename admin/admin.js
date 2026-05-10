// SAMPLE DATA STORAGE
let products = [
    { id: 1, name: 'Dubai Chewy Chocolate', price: 129, stock: 127, category: 'Cookies' },
    { id: 2, name: 'Chocolate Cake', price: 599, stock: 23, category: 'Cakes' },
    { id: 3, name: 'Fudgy Brownies', price: 499, stock: 89, category: 'Brownies' },
    { id: 4, name: 'Mini Choco Chip Cookies', price: 449, stock: 89, category: 'Cookies' },

];

let orders = [
    { id: 'ORD001', customer: 'Juan Dela Cruz', items: 3, total: 450, status: 'Completed', date: '2024-01-15' },
    { id: 'ORD002', customer: 'Andrei Santos', items: 2, total: 780, status: 'Pending', date: '2024-01-14' },
    { id: 'ORD003', customer: 'Pedro Reyes', items: 1, total: 320, status: 'Completed', date: '2024-01-13' }
];

let salesChart = null;

// DASHBOARD COUNTER TARGETS 
const dashboardCounters = {
    products: 24,
    orders: 127,
    revenue: 45230
};

// CORE DATA SYNC FUNCTIONS
function updateDashboardCounters() {
    // Update product count
    dashboardCounters.products = products.length;
    
    // Update orders count
    dashboardCounters.orders = orders.length;
    
    // Update revenue (sum of all order totals)
    dashboardCounters.revenue = orders.reduce((sum, order) => sum + order.total, 0);
}

function refreshAllSections() {
    // Update dashboard counters
    updateDashboardCounters();
    
    // Re-animate dashboard numbers
    if (document.querySelector('.page-content.active').id === 'dashboard') {
        animateNumbers();
    }
    
    // Update all tables if visible
    renderProducts();
    loadOrdersTable();
    
    console.log('✅ All sections synchronized!');
}

// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const pageTitle = document.getElementById('pageTitle');
const mainContent = document.getElementById('mainContent');

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            products: 'Products',
            orders: 'Orders'
        };
        pageTitle.textContent = titles[page];
        
        // Show page
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById(page).classList.add('active');
        
        // Load data
        loadPageData(page);
        
        // Close mobile menu
        sidebar.classList.remove('active');
    });
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Load page data
function loadPageData(page) {
    if (page === 'dashboard') {
        updateDashboardCounters(); // Ensure counters are up-to-date
        animateNumbers();
        loadOrdersTable();
        initSalesChart();
    } else if (page === 'products') {
        renderProducts();
    } else if (page === 'orders') {
        loadOrdersTable();
    }
}

// PRODUCTS CRUD - FULLY SYNCHRONIZED
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><div class="avatar">${getCategoryIcon(product.category)}</div></td>
            <td>
                <div>
                    <div class="fw-600">${product.name}</div>
                    <small class="text-muted">ID: ${product.id}</small>
                </div>
            </td>
            <td>
                <strong>₱${product.price.toLocaleString()}</strong>
            </td>
            <td>
                <span class="badge ${product.stock < 10 ? 'bg-danger' : 'bg-success'} fs-6 px-3 py-2">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="badge bg-primary fs-6 px-3 py-2">${product.category}</span>
            </td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Form handling - NOW UPDATES DASHBOARD
document.getElementById('productFormData').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    
    const product = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('productCategory').value
    };
    
    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        products[index] = product;
        showToast('Product updated successfully!', 'success');
        updateDashboardCounters();
        if (document.querySelector('.page-content.active').id === 'dashboard') {
            animateNumbers();
        }
    } else {
        // Add new product
        products.push(product);
        showToast('Product added successfully! Dashboard updated.', 'success');
        refreshAllSections(); // Full sync
    }
    
    renderProducts();
    cancelForm();
});

// Edit/Delete functions - FULLY SYNCHRONIZED
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Product';
        document.getElementById('productForm').style.display = 'block';
        document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Global variable to store product to delete
let productToDelete = null;

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Store product data
    productToDelete = product;
    
    // Update modal content
    document.getElementById('productNameDelete').textContent = product.name;
    document.getElementById('previewName').textContent = product.name;
    document.getElementById('previewPrice').textContent = product.price.toLocaleString();
    document.getElementById('previewStock').textContent = product.stock;
    document.querySelector('.delete-avatar').textContent = getCategoryIcon(product.category);
    document.getElementById('productPreview').style.display = 'block';
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Confirm delete button handler - NOW UPDATES DASHBOARD
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (productToDelete) {
        products = products.filter(p => p.id !== productToDelete.id);
        renderProducts();
        
        // Shake animation on products table
        const table = document.getElementById('productsTableBody');
        table.classList.add('shake');
        setTimeout(() => table.classList.remove('shake'), 500);
        
        // Full sync after deletion
        refreshAllSections();
        
        // Close modal and show success toast
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        showToast(`"${productToDelete.name}" deleted! Dashboard updated (${products.length} products total).`, 'success');
        
        productToDelete = null;
    }
});

// Form Controls
document.querySelector('[data-action="addProduct"]').addEventListener('click', () => {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus me-2"></i>Add Product';
    document.getElementById('productFormData').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('[data-action="cancelForm"]').forEach(btn => {
    btn.addEventListener('click', cancelForm);
});

function cancelForm() {
    document.getElementById('productForm').style.display = 'none';
    document.getElementById('productFormData').reset();
}

// Tables - NOW FULLY SYNCHRONIZED
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTable');
    if (!tbody) return;
    
    tbody.innerHTML = orders.slice(0, 5).map(order => `
        <tr>
            <td><strong>#${order.id}</strong></td>
            <td>
                <div>${order.customer}</div>
                <small class="text-muted">${order.items} items</small>
            </td>
            <td>${order.items}</td>
            <td><strong>₱${order.total.toLocaleString()}</strong></td>
            <td><small class="text-muted">${order.date}</small></td>
            <td>
                <span class="badge ${order.status === 'Completed' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : 'bg-danger'} fs-6 px-3 py-2">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// Utilities
function getCategoryIcon(category) {
    const icons = {
        'Cookies': '🍪',
        'Cakes': '🎂',
        'Brownies': '🍫'
    };
    return icons[category] || '🍰';
}

function animateNumbers() {
    document.querySelectorAll('.number[data-target]').forEach(el => {
        // Update data-target with real data first
        if (el.closest('.stat-card.primary')) {
            el.dataset.target = dashboardCounters.products;
        } else if (el.closest('.stat-card.success')) {
            el.dataset.target = dashboardCounters.orders;
        } else if (el.closest('.stat-card.danger')) {
            el.dataset.target = dashboardCounters.revenue;
        }
        
        const target = parseInt(el.dataset.target);
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                el.textContent = el.dataset.target.includes('₱') ? '₱' + target.toLocaleString() : target;
                clearInterval(timer);
            } else {
                const displayValue = el.dataset.target.includes('₱') ? 
                    '₱' + Math.floor(start).toLocaleString() : 
                    Math.floor(start);
                el.textContent = displayValue;
            }
        }, 16);
    });
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    if (salesChart) {
        salesChart.destroy();
    }
    
    // Update chart data based on real revenue
    const monthlyRevenue = [
        Math.floor(dashboardCounters.revenue * 0.2),
        Math.floor(dashboardCounters.revenue * 0.25),
        Math.floor(dashboardCounters.revenue * 0.15),
        Math.floor(dashboardCounters.revenue * 0.3),
        Math.floor(dashboardCounters.revenue * 0.25),
        dashboardCounters.revenue
    ];
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: monthlyRevenue,
                borderColor: '#FF6B9D',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FF6B9D',
                pointBorderColor: '#fff',
                pointBorderWidth: 3,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
}

// TOAST NOTIFICATION SYSTEM
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${type === 'success' ? 'toast-success' : 'toast-error'} fade show`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        const bsToast = new bootstrap.Toast(toast);
        bsToast.hide();
    }, 4000);
    
    // Clean up after animation
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial sync
    updateDashboardCounters();
    loadPageData('dashboard');
    
    // QUICK ACTIONS FUNCTIONALITY
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.textContent.trim().toLowerCase();
            
            if (action.includes('add product')) {
                document.querySelector('[data-page="products"]').click();
                setTimeout(() => {
                    document.querySelector('[data-action="addProduct"]').click();
                }, 300);
                showToast('Navigating to add product...', 'success');
            }
        });
    });
    
    // Initialize search
    initSearchClearButton();
});

// ENHANCED SEARCH FUNCTIONALITY
let searchTimeout;
let currentSearchTerm = '';

const searchInput = document.querySelector('.search-bar input');

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    currentSearchTerm = e.target.value.toLowerCase().trim();
    
    searchTimeout = setTimeout(() => {
        performSearch(currentSearchTerm);
    }, 300);
});

function initSearchClearButton() {
    const searchBar = document.querySelector('.search-bar');
    let clearBtn = searchBar.querySelector('.search-clear');
    
    if (!clearBtn) {
        clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.title = 'Clear search';
        searchBar.appendChild(clearBtn);
        
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchInput.value = '';
            currentSearchTerm = '';
            performSearch('');
            searchInput.focus();
        });
    }
}

function performSearch(term) {
    // Search functionality for products and orders
    if (term) {
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term)
        );
        renderProductsFiltered(filteredProducts);
        
        const filteredOrders = orders.filter(o => 
            o.customer.toLowerCase().includes(term) || 
            o.id.toLowerCase().includes(term)
        );
        loadOrdersTableFiltered(filteredOrders);
    } else {
        renderProducts();
        loadOrdersTable();
    }
}

function renderProductsFiltered(filteredProducts) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td><div class="avatar">${getCategoryIcon(product.category)}</div></td>
            <td>
                <div>
                    <div class="fw-600">${product.name}</div>
                    <small class="text-muted">ID: ${product.id}</small>
                </div>
            </td>
            <td><strong>₱${product.price.toLocaleString()}</strong></td>
            <td>
                <span class="badge ${product.stock < 10 ? 'bg-danger' : 'bg-success'} fs-6 px-3 py-2">
                    ${product.stock}
                </span>
            </td>
            <td><span class="badge bg-primary fs-6 px-3 py-2">${product.category}</span></td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" class="text-center text-muted py-5">No products found</td></tr>';
}

function loadOrdersTableFiltered(filteredOrders) {
    const tbody = document.getElementById('ordersTable');
    if (!tbody) return;
    
    tbody.innerHTML = filteredOrders.slice(0, 5).map(order => `
        <tr>
            <td><strong>#${order.id}</strong></td>
            <td>
                <div>${order.customer}</div>
                <small class="text-muted">${order.items} items</small>
            </td>
            <td>${order.items}</td>
            <td><strong>₱${order.total.toLocaleString()}</strong></td>
            <td><small class="text-muted">${order.date}</small></td>
            <td>
                <span class="badge ${order.status === 'Completed' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : 'bg-danger'} fs-6 px-3 py-2">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" class="text-center text-muted py-5">No orders found</td></tr>';
}

// Expose global functions for onclick handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;