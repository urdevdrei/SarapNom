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

// --- 1. PRODUCT MODAL DATA ---
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
                
                // Reset quantity to 1 when opening modal
                document.getElementById('productQty').value = '1';
                
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

// --- QUANTITY SELECTOR FUNCTIONALITY ---
const qtyPlus = document.getElementById('qtyPlus');
const qtyMinus = document.getElementById('qtyMinus');
const productQty = document.getElementById('productQty');

if (qtyPlus && qtyMinus && productQty) {
    // Increase quantity
    qtyPlus.addEventListener('click', () => {
        let currentQty = parseInt(productQty.value);
        if (currentQty < 10) {
            productQty.value = currentQty + 1;
        }
    });

    // Decrease quantity
    qtyMinus.addEventListener('click', () => {
        let currentQty = parseInt(productQty.value);
        if (currentQty > 1) {
            productQty.value = currentQty - 1;
        }
    });

    // Prevent manual input outside range
    productQty.addEventListener('input', () => {
        let value = parseInt(productQty.value);
        if (isNaN(value) || value < 1) productQty.value = 1;
        if (value > 10) productQty.value = 10;
    });
}

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

// Add to cart from modal (WITH QUANTITY)
const modalBuyBtn = document.querySelector('.modal-buy');
if (modalBuyBtn) {
    modalBuyBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="product-size"]:checked');
        const productName = document.getElementById('modalTitle')?.innerText;
        const quantity = parseInt(document.getElementById('productQty')?.value) || 1;

        if (selectedOption && productName) {
            const priceText = selectedOption.parentElement.querySelector('.option-cost').innerText;
            const price = parseInt(priceText.replace('₱', '').replace('.00', ''));
            const sizeLabel = selectedOption.value;
            const productImg = document.getElementById('modalImg')?.src;

            const item = {
                id: Date.now(),
                name: productName,
                size: sizeLabel,
                price: price,
                quantity: quantity,
                img: productImg,
                total: price * quantity
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
        total += item.total;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <small>${item.size} × ${item.quantity}</small>
                    <p>₱${item.total.toLocaleString()}</p>
                </div>
                <i class="fas fa-trash" onclick="removeItem(${item.id})" style="cursor:pointer; color:#ccc; font-size:18px;"></i>
            </div>
        `;
    });

    if (totalEl) totalEl.innerText = `₱${total.toLocaleString()}.00`;
    if (countEl) countEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// --- 3. TERMS & CONDITIONS ---
const acceptBtn = document.getElementById("acceptBtn");
const agreeCheck = document.getElementById("agreeAll");

if (agreeCheck && acceptBtn) {
    agreeCheck.addEventListener("change", () => {
        acceptBtn.disabled = !agreeCheck.checked;
    });

    acceptBtn.addEventListener("click", () => {
        const termsPopup = document.getElementById("termsPopup");
        if (termsPopup) {
            termsPopup.style.display = "none";
        }
    });
}

// --- 4. CHECKOUT FUNCTIONALITY ---
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');
const checkoutBtn = document.querySelector('.checkout-btn');

if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
    document.getElementById("custom-alert").style.display = "flex";
    return;
}


        
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) cartSidebar.classList.remove('active');
        
        const listContainer = document.getElementById('checkout-items-list');
        let total = 0;
        
        if (listContainer) {
            listContainer.innerHTML = cart.map(item => {
                total += item.total;
                return `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding:8px 0;">
                        <span>${item.name} (${item.size}) × ${item.quantity}</span>
                        <span>₱${item.total.toLocaleString()}</span>
                    </div>
                `;
            }).join('');
            
            const finalAmountEl = document.getElementById('checkout-final-amount');
            if (finalAmountEl) finalAmountEl.innerText = `₱${total.toLocaleString()}.00`;
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
    const method = document.querySelector('input[name="pay-method"]:checked')?.value;
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked')?.value;

    const address = document.getElementById('delivery-address');
    const receiptFile = document.getElementById('payment-receipt');

    // VALIDATION
   if (deliveryMethod === 'delivery') {
        if (!address || !address.value || address.value.length < 10) {
            const addressBox = document.getElementById('address-area');
            if (addressBox && !addressBox.querySelector('.address-warning')) {
                addressBox.innerHTML += `
                    <div class="address-warning" style="color:#e74c3c; font-size:14px; margin-top:10px; padding:8px; background:#ffe6e6; border-radius:4px;">
                        <i class="fas fa-location-dot"></i> Please enter a complete delivery address.
                    </div>
                `;
                setTimeout(() => {
                    const warning = addressBox.querySelector('.address-warning');
                    if (warning) warning.remove();
                }, 4000);
            }
            return;
        }
    }

    if (method === 'gcash') {
        if (!receiptFile || receiptFile.files.length === 0) {
            const uploadBox = document.querySelector('.receipt-upload');
            if (uploadBox && !uploadBox.querySelector('.upload-warning')) {
                uploadBox.innerHTML += `
                    <div class="upload-warning" style="color:#e74c3c; font-size:14px; margin-top:10px; padding:8px; background:#ffe6e6; border-radius:4px;">
                        <i class="fas fa-circle-exclamation"></i> Please upload your GCash proof of payment first.
                    </div>
                `;
                setTimeout(() => {
                    const warning = uploadBox.querySelector('.upload-warning');
                    if (warning) warning.remove();
                }, 4000);
            }
            return;
        }
    }

    // BUILD RECEIPT
    const receiptDetails = document.getElementById('receipt-details');
    let total = 0;

    let itemsHTML = cart.map(item => {
        total += item.total;
        return `
            <div style="margin-bottom:15px; padding:12px; background:#f8f9fa; border-radius:8px;">
                <strong>${item.name}</strong><br>
                <small>${item.size} × ${item.quantity}</small><br>
                <span style="font-size:16px; font-weight:600;">₱${item.total.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    const orderNumber = Math.floor(Math.random() * 900000 + 100000);

    let paymentInfo = "";
let deliveryInfo = "";

if (method === "gcash") {
    paymentInfo = "GCash";
} else {
    paymentInfo = "CASH";
}

if (deliveryMethod === "delivery") {
    deliveryInfo = "Delivery";
} else {
    deliveryInfo = "Pickup";
}

    receiptDetails.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <h2 style="color:#27ae60; margin-bottom:10px;">Order Confirmed! ✅</h2>
            <p style="font-size:18px; font-weight:600;">Order #${orderNumber}</p>
        </div>
        <hr style="border:1px solid #eee;">
        ${itemsHTML}
        <hr style="border:1px solid #eee;">
        <div style="margin-top:15px;">
            <p><strong>Payment Method:</strong> ${paymentInfo}</p>
<p><strong>Mode of Delivery:</strong> ${deliveryInfo}</p>
            <p style="font-size:20px; font-weight:700; color:#27ae60;">Total: ₱${total.toLocaleString()}.00</p>
        </div>
        <br>
        <p style="text-align:center; color:#7f8c8d; font-style:italic;">Thank you for ordering from SarapNom! 🍪✨</p>
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
const deliveryMethods = document.querySelectorAll('input[name="delivery-method"]');
const gcashArea = document.getElementById('gcash-area');
const addressArea = document.getElementById('address-area');

function updatePaymentUI() {
    const paymentMethod = document.querySelector('input[name="pay-method"]:checked')?.value;
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked')?.value;

    // Show GCash upload only if GCash selected
    if (gcashArea) {
        gcashArea.style.display = paymentMethod === "gcash" ? "block" : "none";
    }

    // Show address only if DELIVERY selected
    if (addressArea) {
        addressArea.style.display = deliveryMethod === "delivery" ? "block" : "none";
    }
}

// attach listener to all radio buttons
payMethods.forEach(method => {
    method.addEventListener("change", updatePaymentUI);
});

deliveryMethods.forEach(method => {
    method.addEventListener("change", updatePaymentUI);
});

// run once on load so default (GCash) is correct
updatePaymentUI();

const closeAlertBtn = document.getElementById("close-alert-btn");
const customAlert = document.getElementById("custom-alert");

if (closeAlertBtn && customAlert) {

    closeAlertBtn.addEventListener("click", () => {
        customAlert.style.display = "none";
    });

    customAlert.addEventListener("click", (e) => {
        if (e.target === customAlert) {
            customAlert.style.display = "none";
        }
    });
}

// --- FILTERING LOGIC ---
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Remove 'active' class from all buttons and add to the clicked one
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // 2. Get the category name from the button text
        const filterValue = button.textContent.toLowerCase().trim();

        // 3. Show/Hide products
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (filterValue === 'all' || filterValue === cardCategory) {
                card.style.display = 'flex';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
    });
});