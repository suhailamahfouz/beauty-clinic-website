
async function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return; 

    try {
        const response = await fetch('../api/get_products.php');
        const clinicProducts = await response.json();


        container.innerHTML = ''; 

        if (clinicProducts.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1;">No products available at the moment.</p>';
            return;
        }

        clinicProducts.forEach(product => {
            let priceHTML = '';
            let saleBadge = '';
            let finalPrice = product.price;

            if (product.offer && parseFloat(product.offer) > 0) {
                priceHTML = `<span class="old-price">${product.price} EGP</span> <span class="new-price">${product.offer} EGP</span>`;
                saleBadge = `<div class="sale-badge">SALE</div>`;
                finalPrice = product.offer;
            } else {
                priceHTML = `<span class="new-price">${product.price} EGP</span>`;
            }

            let overlayHTML = '';
            let buttonHTML = '';
            let inStock = parseInt(product.in_stock) === 1;
            
            const imgPath = `${product.image_path}`;
            
            if (inStock) {
                buttonHTML = `<button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${finalPrice}, '${imgPath}')">ADD TO CART</button>`;
            } else {
                overlayHTML = `<div class="sold-out-overlay"><div class="sold-out-text">SOLD OUT</div></div>`;
                buttonHTML = `<button class="btn-add-cart" disabled>OUT OF STOCK</button>`;
            }

            const productHTML = `
                <div class="product-card">
                    ${saleBadge}
                    <div class="product-img-container">
                        ${overlayHTML}
                        <img src="${imgPath}" alt="${product.name}" onerror="this.src='images/logo.png'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-rating">⭐⭐⭐⭐⭐</div>
                        <p class="product-desc">${product.description}</p>
                        <div class="price-container">${priceHTML}</div>
                        ${buttonHTML}
                    </div>
                </div>`;
            container.innerHTML += productHTML;
        });
    } catch(error) {
        console.error("Error fetching products:", error);
        container.innerHTML = '<p style="text-align:center; color:red; width:100%; grid-column: 1 / -1;">Failed to load products.</p>';
    }
}

//  دالة الإضافة للسلة
window.addToCart = function(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    cart.push({ id: id, name: name, price: price, img: img });
    localStorage.setItem('clinicCart', JSON.stringify(cart));
    updateCartBadge();
    alert(`✔️ ${name} added to your cart!`);
};

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