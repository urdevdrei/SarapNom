// SAMPLE DATA STORAGE
let products = [
    { id: 1, name: 'Dubai Chewy Cookie', price: 45, stock: 127, category: 'Cookies' },
    { id: 2, name: 'Chocolate Cake', price: 780, stock: 23, category: 'Cakes' },
    { id: 3, name: 'Brownie Box', price: 320, stock: 89, category: 'Brownies' },
    { id: 4, name: 'Matcha Cookie', price: 55, stock: 45, category: 'Cookies' }
];

let orders = [
    { id: 'ORD001', customer: 'Juan Dela Cruz', items: 3, total: 450, status: 'Completed', date: '2024-01-15' },
    { id: 'ORD002', customer: 'Maria Santos', items: 2, total: 780, status: 'Pending', date: '2024-01-14' },
    { id: 'ORD003', customer: 'Pedro Reyes', items: 1, total: 320, status: 'Completed', date: '2024-01-13' }
];

let customers = [
    { name: 'Juan Dela Cruz', email: 'juan@email.com', orders: 12, total: 2450, lastOrder: '2024-01-15' },
    { name: 'Maria Santos', email: 'maria@email.com', orders: 8, total: 1560, lastOrder: '2024-01-14' },
    { name: 'Pedro Reyes', email: 'pedro@email.com', orders: 5, total: 980, lastOrder: '2024-01-13' }
];

let salesChart = null;

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
            orders: 'Orders',
            customers: 'Customers'
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
        animateNumbers();
        loadOrdersTable();
        loadCustomersTable();
        initSalesChart();
    } else if (page === 'products') {
        renderProducts();
    } else if (page === 'orders') {
        loadOrdersTable();
    } else if (page === 'customers') {
        loadCustomersTable();
    }
}

// PRODUCTS CRUD
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

// Form handling
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
        const index = products.findIndex(p => p.id === parseInt(id));
        products[index] = product;
        showToast('Product updated successfully!', 'success');
    } else {
        products.push(product);
        showToast('Product added successfully!', 'success');
    }
    
    renderProducts();
    cancelForm();
});

// Edit/Delete functions
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

// Confirm delete button handler
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (productToDelete) {
        products = products.filter(p => p.id !== productToDelete.id);
        renderProducts();
        
        // Shake animation on products table
        const table = document.getElementById('productsTableBody');
        table.classList.add('shake');
        setTimeout(() => table.classList.remove('shake'), 500);
        
        // Close modal and show success toast
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        showToast(`"${productToDelete.name}" deleted successfully!`, 'success');
        
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

// Tables
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTable');
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
                <span class="badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'} fs-6 px-3 py-2">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('');
}

function loadCustomersTable() {
    const tbody = document.getElementById('customersTable');
    tbody.innerHTML = customers.slice(0, 8).map(customer => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div class="avatar" style="background: linear-gradient(135deg, #FF6B9D, #4facfe); width: 45px; height: 45px; font-size: 1.2rem;">${customer.name.charAt(0)}</div>
                    <div>
                        <div class="fw-600">${customer.name}</div>
                    </div>
                </div>
            </td>
            <td>${customer.email}</td>
            <td>
                <span class="badge bg-primary fs-6 px-3 py-2">${customer.orders}</span>
            </td>
            <td><strong>₱${customer.total.toLocaleString()}</strong></td>
            <td><small class="text-muted">${customer.lastOrder}</small></td>
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
    if (salesChart) {
        salesChart.destroy();
    }
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
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
    loadPageData('dashboard');
});

// QUICK ACTIONS FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Quick Actions Buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.textContent.trim().toLowerCase();
            
            if (action.includes('add product')) {
                // Navigate to products page and open add form
                document.querySelector('[data-page="products"]').click();
                setTimeout(() => {
                    document.querySelector('[data-action="addProduct"]').click();
                }, 300);
                showToast('Navigating to add product...', 'success');
            } else if (action.includes('new order')) {
                showToast('New order feature coming soon!', 'warning');
            } else if (action.includes('manage users')) {
                showToast('User management feature coming soon!', 'warning');
            }
        });
    });
});

