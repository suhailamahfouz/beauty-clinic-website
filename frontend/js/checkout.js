// ==========================================
// نظام سلة المشتريات المتقدم (تجميع المنتجات والكميات)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderShoppingBag();

    // إظهار فورمة الدفع
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

    // تأكيد الطلب
    const finalOrderForm = document.getElementById('finalOrderForm');
    if(finalOrderForm) {
        finalOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
            let total = cart.reduce((sum, item) => sum + Number(item.price), 0);

            const order = {
                id: Date.now(),
                customer: document.getElementById('custName').value,
                phone: document.getElementById('custPhone').value,
                address: document.getElementById('custAddress').value,
                items: cart, // بيبعت كل المنتجات للأدمن
                total: total,
                status: "Pending", 
                date: new Date().toLocaleString()
            };

            let orders = JSON.parse(localStorage.getItem('clinicOrders')) || [];
            orders.push(order);
            localStorage.setItem('clinicOrders', JSON.stringify(orders));
            
            localStorage.removeItem('clinicCart'); 
            alert("Order Confirmed! 🎉 Enjoy your seamless experience.");
            window.location.href = "products.html";
        });
    }
});

function renderShoppingBag() {
    const listDiv = document.getElementById('cartItemsList');
    const subtotalDisplay = document.getElementById('subtotalDisplay');
    if(!listDiv) return;

    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    let storeProducts = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];

    // تجميع المنتجات المتشابهة عشان نعرض الكمية
    let groupedCart = {};
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += Number(item.price);
        if(groupedCart[item.id]) {
            groupedCart[item.id].qty += 1;
        } else {
            groupedCart[item.id] = { ...item, qty: 1 };
        }
    });

    const uniqueItems = Object.values(groupedCart);

    if(uniqueItems.length === 0) {
        listDiv.innerHTML = "<p style='color:#666; margin-top:20px; padding-bottom:20px; border-bottom: 1px solid #eaeaea;'>Your shopping cart is empty.</p>";
        subtotalDisplay.textContent = "$0.00";
        return;
    }

    listDiv.innerHTML = '';

    uniqueItems.forEach((item) => {
        // جلب صورة المنتج من الداتابيز
        const originalProduct = storeProducts.find(p => p.id === item.id);
        const imgSrc = originalProduct && originalProduct.img ? originalProduct.img : 'https://via.placeholder.com/90x110?text=No+Image';
        const itemTotalPrice = item.price * item.qty;

        const rowHTML = `
            <div class="cart-item-row">
                <div class="item-info">
                    <img src="${imgSrc}" class="item-img" alt="${item.name}">
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-meta">Size: Standard</div>
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
                
                <div class="item-total text-right">$${itemTotalPrice}</div>
            </div>
        `;
        listDiv.innerHTML += rowHTML;
    });

    subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    
    // تحديث البادج بتاع السلة في كل حتة
    const badge = document.getElementById('cartBadge');
    if(badge) badge.textContent = cart.length;
}

// زيادة الكمية (+)
function increaseQty(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    cart.push({ id: id, name: name, price: price });
    localStorage.setItem('clinicCart', JSON.stringify(cart));
    renderShoppingBag();
}

// تقليل الكمية (-)
function decreaseQty(id) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    const index = cart.findIndex(item => item.id === id); // بنجيب أول واحد بيطابق الـ id
    if (index !== -1) {
        cart.splice(index, 1); // بنمسح واحد بس
        localStorage.setItem('clinicCart', JSON.stringify(cart));
        renderShoppingBag();
    }
}

// مسح المنتج بالكامل (Remove)
function removeAllOfItem(id) {
    let cart = JSON.parse(localStorage.getItem('clinicCart')) || [];
    cart = cart.filter(item => item.id !== id); // بنمسح كل المنتجات اللي ليها نفس الـ id
    localStorage.setItem('clinicCart', JSON.stringify(cart));
    renderShoppingBag();
}