// ==========================================
// نظام سلة المشتريات والدفع (Checkout & MongoDB)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderShoppingBag();

    // 1. التعبئة التلقائية لبيانات العميل في الفورمة
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const nameInput = document.getElementById('custName');
        const phoneInput = document.getElementById('custPhone');
        if (nameInput) nameInput.value = currentUser.name;
        if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;
    }

    // 2. إظهار فورمة الدفع
    const btnShowForm = document.getElementById('btnShowForm');
    const formWrapper = document.getElementById('checkoutFormWrapper');
    if(btnShowForm) {
        btnShowForm.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
            if(cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            btnShowForm.style.display = 'none';
            formWrapper.style.display = 'block';
        });
    }

    // 3. تأكيد الطلب وإرساله لـ MongoDB
    const finalOrderForm = document.getElementById('finalOrderForm');
    if(finalOrderForm) {
        finalOrderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
            let total = cart.reduce((sum, item) => sum + Number(item.price), 0);

            const orderData = {
                customerName: document.getElementById('custName').value,
                phone: document.getElementById('custPhone').value,
                address: document.getElementById('custAddress').value,
                items: cart,
                totalAmount: total
            };

            try {
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    localStorage.removeItem('clinicCart'); 
                    alert("Order Confirmed & Saved in MongoDB! 🎉");
                    window.location.href = "products.html";
                }
            } catch (error) {
                alert("Cannot connect to server. Check your Terminal!");
            }
        });
    }
});

// دالة عرض المنتجات في السلة (نفس لوجيك الـ Render بتاعك النضيف)
function renderShoppingBag() {
    const listDiv = document.getElementById('cartItemsList');
    const subtotalDisplay = document.getElementById('subtotalDisplay');
    if(!listDiv) return;

    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    let storeProducts = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];
    let groupedCart = {};
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += Number(item.price);
        if(groupedCart[item.id]) { groupedCart[item.id].qty += 1; } 
        else { groupedCart[item.id] = { ...item, qty: 1 }; }
    });

    const uniqueItems = Object.values(groupedCart);
    if(uniqueItems.length === 0) {
        listDiv.innerHTML = "<p>Your shopping cart is empty.</p>";
        subtotalDisplay.textContent = "$0.00";
        return;
    }

    listDiv.innerHTML = '';
    uniqueItems.forEach((item) => {
        const originalProduct = storeProducts.find(p => p.id === item.id);
        const imgSrc = originalProduct && originalProduct.img ? originalProduct.img : 'images/default-product.png';
        listDiv.innerHTML += `
            <div class="cart-item-row">
                <div class="item-info">
                    <img src="${imgSrc}" class="item-img">
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <button class="btn-remove" onclick="removeAllOfItem(${item.id})">Remove</button>
                    </div>
                </div>
                <div class="item-price text-center">$${item.price}</div>
                <div class="text-center">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="decreaseQty(${item.id})">&minus;</button>
                        <span class="qty-num">${item.qty}</span>
                        <button class="qty-btn" onclick="increaseQty(${item.id}, '${item.name}', ${item.price})">&plus;</button>
                    </div>
                </div>
                <div class="item-total text-right">$${item.price * item.qty}</div>
            </div>`;
    });
    subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
}

// الدوال المساعدة (زي ما هي عندك)
function increaseQty(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('clinicCart', JSON.stringify(cart));
    renderShoppingBag();
}
function decreaseQty(id) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    const idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) { cart.splice(idx, 1); localStorage.setItem('clinicCart', JSON.stringify(cart)); renderShoppingBag(); }
}
function removeAllOfItem(id) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('clinicCart', JSON.stringify(cart));
    renderShoppingBag();
}