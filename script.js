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