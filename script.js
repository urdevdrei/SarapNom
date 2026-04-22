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
        title: "Banana Loaf with Choco Chips",
        img: "product images/bananaloaf.jpg",
        desc: "Baked fresh daily! Our moist banana bread is packed with rich chocolate chips for the ultimate comfort snack.",
        prices: ["Small Tub (2-3 pax): ₱200"]
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

// TERMS AND CONDITION 

document.getElementById("acceptBtn").addEventListener("click", function() {
    document.getElementById("termsPopup").style.display = "none";
    
});