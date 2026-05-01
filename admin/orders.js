// orders.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample orders data
    const orders = [
        {
            id: 'ORD-00123',
            customer: 'Juan Dela Cruz',
            phone: '0932-123-4567',
            items: 3,
            amount: 335.00,
            payment: 'paid',
            status: 'delivered',
            date: '2024-01-15 14:30',
            itemsList: [
                { name: 'Mango Graham (Regular)', qty: 2, price: 125 },
                { name: 'Dubai Cookies (Box)', qty: 1, price: 35 }
            ]
        },
        {
            id: 'ORD-00124',
            customer: 'Maria Santos',
            phone: '0917-456-7890',
            items: 2,
            amount: 285.00,
            payment: 'pending',
            status: 'pending',
            date: '2024-01-15 16:45',
            itemsList: [
                { name: 'Mango Graham (Large)', qty: 1, price: 185 },
                { name: 'Ube Leche Flan', qty: 1, price: 100 }
            ]
        }
        // Add more sample orders...
    ];

    const tableBody = document.getElementById('ordersTable');
    const searchInput = document.getElementById('ordersSearch');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const selectAllCheckbox = document.getElementById('selectAll');

    // Populate table
    function renderOrders(ordersToShow = orders) {
        tableBody.innerHTML = ordersToShow.map(order => `
            <tr class="order-item" data-order-id="${order.id}">
                <td><input type="checkbox" class="order-checkbox"></td>
                <td>
                    <div class="fw-600">#${order.id}</div>
                </td>
                <td>
                    <div class="fw-600">${order.customer}</div>
                    <small class="text-muted">${order.phone}</small>
                </td>
                <td>
                    <div class="fw-600">${order.items} items</div>
                </td>
                <td>
                    <div class="fw-600 text-primary">₱${order.amount.toLocaleString()}</div>
                </td>
                <td>
                    <span class="payment-status ${order.payment === 'paid' ? 'payment-paid' : 'payment-pending'}">
                        ${order.payment === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                </td>
                <td>
                    <span class="order-status status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div>${new Date(order.date).toLocaleDateString()}</div>
                    <small class="text-muted">${new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                </td>
                <td>
                    <div class="order-actions">
                        <button class="btn btn-sm btn-outline-primary" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Initial render
    renderOrders();

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredOrders = orders.filter(order =>
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm)
        );
        renderOrders(filteredOrders);
    });

    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            let filteredOrders = orders;
            
            if (filter !== 'all') {
                filteredOrders = orders.filter(order => order.status === filter);
            }
            
            renderOrders(filteredOrders);
        });
    });

    // Select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        document.querySelectorAll('.order-checkbox').forEach(cb => {
            cb.checked = this.checked;
        });
    });

    // Order row click - open modal
    tableBody.addEventListener('click', function(e) {
        if (e.target.closest('.order-item')) {
            const orderId = e.target.closest('.order-item').dataset.orderId;
            const order = orders.find(o => o.id === orderId);
            // Update modal with order details
            document.querySelector('.modal-title').textContent = `Order #${order.id}`;
            // Add more modal updates here...
        }
    });

    // Bulk actions
    document.getElementById('exportBtn').addEventListener('click', function() {
        alert('Exporting orders... (CSV/Excel functionality)');
    });
});