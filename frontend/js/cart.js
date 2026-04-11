const defaultProducts = [
    { id: 1, name: "Vitamin C Serum", price: 45, offer: 35, inStock: true, img: "images/serum.png", desc: "Brightens and evens skin tone. Gives a natural glow." },
    { id: 2, name: "SPF 50 Sunscreen", price: 25, offer: "", inStock: false, img: "images/sunscreen.png", desc: "Broad-spectrum protection without white cast." },
    { id: 3, name: "Hydrating Moisturizer", price: 40, offer: "", inStock: true, img: "images/moisturizer.png", desc: "Deep hydration for all skin types." }
];

// السطر ده هيجبر المتصفح إنه يمسح القديم ويقرأ الصور الجديدة
if (!localStorage.getItem('clinicStoreProducts')) {
    localStorage.setItem('clinicStoreProducts', JSON.stringify(defaultProducts));
}
let clinicProducts = JSON.parse(localStorage.getItem('clinicStoreProducts'));

if (!clinicProducts || clinicProducts.length === 0) {
    clinicProducts = defaultProducts;
    localStorage.setItem('clinicStoreProducts', JSON.stringify(clinicProducts));
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return; 
    container.innerHTML = ''; 

    clinicProducts.forEach(product => {
        let priceHTML = '';
        let saleBadge = '';
        let finalPrice = product.price;

        if (product.offer && product.offer !== "") {
            priceHTML = `<span class="old-price">$${product.price}</span> <span class="new-price">$${product.offer}</span>`;
            saleBadge = `<div class="sale-badge">SALE</div>`;
            finalPrice = product.offer;
        } else {
            priceHTML = `<span class="new-price">$${product.price}</span>`;
        }

        let overlayHTML = '';
        let buttonHTML = '';
        
        if (product.inStock) {
            buttonHTML = `<button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${finalPrice})">ADD TO CART</button>`;
        } else {
            overlayHTML = `<div class="sold-out-overlay"><div class="sold-out-text">SOLD OUT</div></div>`;
            buttonHTML = `<button class="btn-add-cart" disabled>OUT OF STOCK</button>`;
        }

        const productHTML = `
            <div class="product-card">
                ${saleBadge}
                <div class="product-img-container">
                    ${overlayHTML}
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x250?text=No+Image'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">⭐⭐⭐⭐⭐</div>
                    <p class="product-desc">${product.desc}</p>
                    <div class="price-container">${priceHTML}</div>
                    ${buttonHTML}
                </div>
            </div>`;
        container.innerHTML += productHTML;
    });
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    cart.push({ id: id, name: name, price: price });
    localStorage.setItem('clinicCart', JSON.stringify(cart));
    updateCartBadge();
    alert(`✔️ ${name} added to your cart!`);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
        badge.textContent = cart.length; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
});