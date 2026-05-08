// ============================================
// COMPLETE SCRIPT.JS FOR SARAPNOM
// Combines home page + products page functionality
// ============================================

// --- 0. HOME PAGE FUNCTIONALITY ---

// Mobile Menu Toggle (works on all pages)
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Navbar background on scroll (home page)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
    } else if (navbar) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }
});

// Active nav link on scroll (home page)
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || link.textContent.trim() === 'Home') {
            link.classList.add('active');
        }
    });
});

// Deal of the Day Timer (home page only)
function updateTimer() {
    const timerElements = document.getElementById('hours') || 
                         document.getElementById('minutes') || 
                         document.getElementById('seconds');
    
    if (!timerElements) return; // Skip if not on home page
    
    const dealEndTime = new Date();
    dealEndTime.setHours(dealEndTime.getHours() + 24);
    
    const now = new Date().getTime();
    const distance = dealEndTime.getTime() - now;
    
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    if (distance < 0) {
        const dealBtn = document.querySelector('.deal-button');
        if (dealBtn) {
            dealBtn.innerHTML = 'Deal Expired! <i class="fas fa-clock"></i>';
            dealBtn.style.background = '#999';
            dealBtn.style.cursor = 'not-allowed';
        }
    }
}

// Initialize timer (runs on all pages but only affects home)
setInterval(updateTimer, 1000);
updateTimer();

// --- 1. YOUR EXISTING PRODUCTS PAGE FUNCTIONALITY ---

// PRODUCT MODAL DATA
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
        desc: "Baked fresh daily! Our moist banana bread is packed with rich chocolate chips, almonds, and Biscoff Cheesecake!",
        prices: ["Banana loaf with chocolate and almonds: ₱200", "Banana loaf with Biscoff Cheesecake & chocolate chips: ₱230"]
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

// MODAL ELEMENT SELECTORS
const modal = document.getElementById("productModal");
const closeModal = document.querySelector(".close-modal");

// PRODUCT CARD CLICK LOGIC
document.querySelectorAll('.product-card').forEach(card => {
    if (card) {
        card.style.cursor = "pointer";
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const data = productInfo[productId];

            if (data && modal) {
                document.getElementById("modalTitle").innerText = data.title;
                document.getElementById("modalImg").src = data.img;
                document.getElementById("modalDescription").innerText = data.desc;
                
                const priceList = document.getElementById("modalPriceList");
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
    }
});

// Close product modal
if (closeModal && modal) {
    closeModal.onclick = () => {
        modal.style.display = "none";
    };
}

// Close modal if clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// --- 2. CART FUNCTIONALITY ---
let cart = [];

// Cart toggle
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
if (cartBtn && cartSidebar) {
    cartBtn.onclick = () => cartSidebar.classList.add('active');
}

const closeCart = document.querySelector('.close-cart');
if (closeCart && cartSidebar) {
    closeCart.onclick = () => cartSidebar.classList.remove('active');
}

// Add to cart from modal
const modalBuyBtn = document.querySelector('.modal-buy');
if (modalBuyBtn) {
    modalBuyBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="product-size"]:checked');
        const productName = document.getElementById('modalTitle')?.innerText;

        if (selectedOption && productName) {
            const priceText = selectedOption.parentElement.querySelector('.option-cost').innerText;
            const price = parseInt(priceText.replace('₱', ''));
            const sizeLabel = selectedOption.value;
            const productImg = document.getElementById('modalImg')?.src;

            const item = {
                id: Date.now(),
                name: productName,
                size: sizeLabel,
                price: price,
                img: productImg
            };

            cart.push(item);
            updateCartUI();
            
            modal.style.display = "none";
            if (cartSidebar) cartSidebar.classList.add('active');
        }
    });
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const countEl = document.getElementById('cart-count');
    
    if (!container) return;
    
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

    if (totalEl) totalEl.innerText = `₱${total}.00`;
    if (countEl) countEl.innerText = cart.length;
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// --- 3. TERMS & CONDITIONS ---
const acceptBtn = document.getElementById("acceptBtn");
const agreeCheck = document.getElementById("agreeAll");

agreeCheck.addEventListener("change", () => {
    acceptBtn.disabled = !agreeCheck.checked;
});

acceptBtn.addEventListener("click", () => {
    document.getElementById("termsPopup").style.display = "none";
});


// --- 4. CHECKOUT FUNCTIONALITY ---
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');
const checkoutBtn = document.querySelector('.checkout-btn');

if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your bag is empty!");
            return;
        }
        
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) cartSidebar.classList.remove('active');
        
        const listContainer = document.getElementById('checkout-items-list');
        let total = 0;
        
        if (listContainer) {
            listContainer.innerHTML = cart.map(item => {
                total += item.price;
                return `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>${item.name} (${item.size})</span>
                        <span>₱${item.price}</span>
                    </div>
                `;
            }).join('');
            
            const finalAmountEl = document.getElementById('checkout-final-amount');
            if (finalAmountEl) finalAmountEl.innerText = `₱${total}.00`;
        }
        
        checkoutModal.style.display = "block";
    });
}

if (closeCheckout && checkoutModal) {
    closeCheckout.onclick = () => checkoutModal.style.display = "none";
}

window.addEventListener('click', (event) => {
    if (event.target === checkoutModal) checkoutModal.style.display = "none";
});

// Payment method toggle
document.querySelector('.confirm-payment-btn').onclick = () => {

    const method = document.querySelector('input[name="pay-method"]:checked').value;

    const address = document.getElementById('delivery-address');
    const receiptFile = document.getElementById('payment-receipt');

    // VALIDATION
   if (method === 'cod') {
    if (!address.value || address.value.length < 10) {

        const addressBox = document.getElementById('address-area');

        addressBox.innerHTML += `
            <div class="address-warning">
                <i class="fas fa-location-dot"></i>
                Please enter a complete delivery address.
            </div>
        `;

        setTimeout(() => {
            const warning = document.querySelector('.address-warning');
            if (warning) {
                warning.remove();
            }
        }, 3000);

        return;
    }
}

    if (method === 'gcash') {
    if (receiptFile.files.length === 0) {

        const uploadBox = document.querySelector('.receipt-upload');

        uploadBox.innerHTML += `
            <div class="upload-warning">
                <i class="fas fa-circle-exclamation"></i>
                Please upload your GCash proof of payment first.
            </div>
        `;

        setTimeout(() => {
            const warning = document.querySelector('.upload-warning');
            if (warning) {
                warning.remove();
            }
        }, 3000);

        return;
    }
}

    // BUILD RECEIPT
    const receiptDetails = document.getElementById('receipt-details');

    let total = 0;

    let itemsHTML = cart.map(item => {
        total += item.price;

        return `
            <div style="margin-bottom:10px;">
                <strong>${item.name}</strong><br>
                ${item.size}<br>
                ₱${item.price}
            </div>
        `;
    }).join('');

    const orderNumber = Math.floor(Math.random() * 900000 + 100000);

    let deliveryInfo = "";

    if (method === "cod") {
        deliveryInfo = "Delivery (COD)";
    } else if (method === "gcash") {
        deliveryInfo = "GCash Paid (Online)";
    } else {
        deliveryInfo = "Pickup at Store";
    }

    receiptDetails.innerHTML = `
        <p><strong>Order #:</strong> ${orderNumber}</p>
        <hr>

        ${itemsHTML}

        <hr>

        <p><strong>Payment Method:</strong> ${method.toUpperCase()}</p>
        <p><strong>Order Type:</strong> ${deliveryInfo}</p>
        <p><strong>Total:</strong> ₱${total}.00</p>

        <br>
        <p>Thank you for ordering from SarapNom!</p>
    `;

    // CLOSE CHECKOUT
    document.getElementById('checkout-modal').style.display = "none";

    // SHOW RECEIPT
    document.getElementById('receipt-modal').style.display = "flex";

    // CLEAR CART
    cart = [];
    updateCartUI();
};

const closeReceiptBtn = document.getElementById('closeReceiptBtn');

if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => {
        document.getElementById('receipt-modal').style.display = "none";
        window.location.href = "index.html";
    });
}

const payMethods = document.querySelectorAll('input[name="pay-method"]');
const gcashArea = document.getElementById('gcash-area');
const addressArea = document.getElementById('address-area');

function updatePaymentUI() {
    const selected = document.querySelector('input[name="pay-method"]:checked').value;

    if (selected === "gcash") {
        gcashArea.style.display = "block";
        addressArea.style.display = "none";
    }

    if (selected === "cod") {
        gcashArea.style.display = "none";
        addressArea.style.display = "block";
    }

    if (selected === "pickup") {
        gcashArea.style.display = "none";
        addressArea.style.display = "none";
    }
}

// attach listener to all radio buttons
payMethods.forEach(method => {
    method.addEventListener("change", updatePaymentUI);
});

// run once on load so default (GCash) is correct
updatePaymentUI();