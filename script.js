// --- 1. MOBILE MENU LOGIC ---
// We declare these once at the very top
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// --- 2. PRODUCT MODAL DATA ---
const productInfo = {
    "dubai": {
        title: "Dubai Chewy Chocolate",
        img: "product images/dubaicookie.JPG",
        desc: "A viral sensation! This best-selling cookie features a crunchy pistachio kunafa filling wrapped in premium milk chocolate.",
        prices: ["Solo: ₱129", "Box of 3: ₱349", "Box of 4: ₱429"]
    },
    "mango-graham": {
        title: "Mango Graham Cake",
        img: "product images/mangograham.jpg",
        desc: "A classic Filipino favorite. Perfectly layered sweet mangoes, chilled cream, and graham crackers.",
        prices: ["Family Tub (6-8 pax): ₱599"]
    },
    "mango-sticky": {
        title: "Mango Sticky Rice",
        img: "product images/mangosticky.jpg",
        desc: "Sweet, salty, and creamy! Authentic sticky rice paired with fresh mangoes and our signature coconut sauce.",
        prices: ["Tray (5-6 pax): ₱549"]
    },
    "banana": {
        title: "Banana Loaf Bread (Small Tub, 2-3 pax)",
        img: "product images/bananaloaf.jpg",
        desc: "Baked fresh daily! Our moist banana bread is packed with rich chocolate chips, almonds, and Biscoff Cheesecake!.",
        prices: ["Banana load with chocolate and almonds: ₱200", "Banana loaf with Biscoff Cheesecake & chocolate chips: ₱230"]
    },
    "brownies": {
        title: "Fudgy Brownies (Box, 8x8 size)",
        img: "product images/fudgybrownies.jpg",
        desc: "Experience the ultimate chocolate indulgence with our oven-fresh fudgy brownies, featuring a dense, melt-in-your-mouth center and a perfect crackly crust.",
        prices: ["Fudgy Brownies per Box: ₱499"]
    },
    "mini-cookies": {
        title: "Mini butter chocolate chip cookies",
        img: "product images/minicookies.jpg",
        desc: "Bite-sized and buttery, our mini cookies are baked fresh and loaded with premium chocolate chips for the perfect golden crunch.",
        prices: ["Box (50pcs): ₱449"]
    }
};

// --- 3. MODAL ELEMENT SELECTORS ---
const modal = document.getElementById("productModal");
const closeModal = document.querySelector(".close-modal");

// --- 4. CLICK LOGIC ---
document.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener('click', function() {
        const productId = this.getAttribute('data-product');
        const data = productInfo[productId];

        if (data) {
            document.getElementById("modalTitle").innerText = data.title;
            document.getElementById("modalImg").src = data.img;
            document.getElementById("modalDescription").innerText = data.desc;
            
            const priceList = document.getElementById("modalPriceList");
            // Clears old prices and adds new ones
    priceList.innerHTML = data.prices.map((p, index) => {
        const label = p.split(':')[0].trim();
        const cost = p.split(':')[1].trim();
        return `
            <label class="price-option">
                <input type="radio" name="product-size" value="${label}" ${index === 0 ? 'checked' : ''}>
                <div class="option-content">
                    <span class="option-label">${label}</span>
                    <span class="option-cost">${cost}</span>
            </div>
        </label>
    `;
    }).join('');
            
            modal.style.display = "block";
        }
    });
});

// Close button (X)
if (closeModal) {
    closeModal.onclick = () => {
        modal.style.display = "none";
    };
}

// Close if clicking outside the white box
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

let cart = [];

// Function to Open/Close Cart
document.getElementById('cart-btn').onclick = () => document.getElementById('cart-sidebar').classList.add('active');
document.querySelector('.close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('active');

// ADD TO CART FUNCTION
document.querySelector('.modal-buy').addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="product-size"]:checked');
    const productName = document.getElementById('modalTitle').innerText;
    const productImg = document.getElementById('modalImg').src;

    if (selectedOption) {
        // Extract price number: "₱349" -> 349
        const priceText = selectedOption.parentElement.querySelector('.option-cost').innerText;
        const price = parseInt(priceText.replace('₱', ''));
        const sizeLabel = selectedOption.value;

        const item = {
            id: Date.now(),
            name: productName,
            size: sizeLabel,
            price: price,
            img: productImg
        };

        cart.push(item);
        updateCartUI();
        
        // Visual feedback
        document.getElementById('productModal').style.display = "none";
        document.getElementById('cart-sidebar').classList.add('active');
    }
});

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const countEl = document.getElementById('cart-count');
    
    container.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <small>${item.size}</small>
                    <p>₱${item.price}</p>
                </div>
                <i class="fas fa-trash" onclick="removeItem(${item.id})" style="cursor:pointer; color:#ccc;"></i>
            </div>
        `;
    });

    totalEl.innerText = `₱${total}.00`;
    countEl.innerText = cart.length;
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

const acceptBtn = document.getElementById("acceptBtn");
const checks = document.querySelectorAll(".terms-check");

function validateChecks() {
    let allChecked = true;

    checks.forEach(cb => {
        if (!cb.checked) {
            allChecked = false;
        }
    });

    acceptBtn.disabled = !allChecked;
}

checks.forEach(cb => {
    cb.addEventListener("change", validateChecks);
});

acceptBtn.addEventListener("click", function () {
    document.getElementById("termsPopup").style.display = "none";
});

// --- CHECKOUT LOGIC ---
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');

// Function to open checkout
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your bag is empty!");
        return;
    }
    
    // Close the cart sidebar
    document.getElementById('cart-sidebar').classList.remove('active');
    
    // Populate the checkout list
    const listContainer = document.getElementById('checkout-items-list');
    let total = 0;
    
    listContainer.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span>${item.name} (${item.size})</span>
                <span>₱${item.price}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('checkout-final-amount').innerText = `₱${total}.00`;
    
    // Show the modal
    checkoutModal.style.display = "block";
});

// Close checkout modal
closeCheckout.onclick = () => checkoutModal.style.display = "none";

window.onclick = (event) => {
    if (event.target == checkoutModal) checkoutModal.style.display = "none";
};

// 1. Open Checkout Modal from Cart
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('checkout-modal').style.display = 'block';
    };
}

// 2. Close Checkout Modal
document.querySelector('.close-checkout').onclick = () => {
    document.getElementById('checkout-modal').style.display = 'none';
};

// 3. Toggle Payment Method Logic
document.querySelectorAll('input[name="pay-method"]').forEach(input => {
    input.onchange = () => {
        const method = input.value;
        document.getElementById('gcash-area').style.display = (method === 'gcash') ? 'block' : 'none';
        document.getElementById('address-area').style.display = (method === 'cod') ? 'block' : 'none';
    };
});

// 4. Final Order Validation
document.querySelector('.confirm-payment-btn').onclick = () => {
    const method = document.querySelector('input[name="pay-method"]:checked').value;
    if (method === 'cod') {
        const addr = document.getElementById('delivery-address').value;
        if (addr.length < 10) {
            alert("Please provide a delivery address for COD.");
            return;
        }
    }
    alert("Order Received! Thank you for ordering from SarapNom.");
    location.reload();
};