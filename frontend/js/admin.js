// ==========================================
// ملف جافاسكريبت الموحد لكل صفحات الأدمن
// ==========================================

// ==========================================
// 1. نظام إدارة الحجوزات (Bookings) - مربوط بالباك إند 🍃
// ==========================================
async function displayBookings() {
    const tableBody = document.getElementById('adminBookingsTable');
    if (!tableBody) return;

    try {
        // بنجيب الحجوزات الحقيقية من السيرفر
        const response = await fetch('http://localhost:3000/api/bookings');
        const bookings = await response.json();

        tableBody.innerHTML = ''; 

        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 30px; color: #999;">No requests yet.</td></tr>';
            return;
        }

        bookings.forEach(booking => {
            const isConfirmed = booking.status === 'Confirmed';
            const statusClass = isConfirmed ? 'status-confirmed' : 'status-pending';

            // لاحظي غيرنا booking.id لـ booking._id عشان دي طريقة MongoDB
            const row = `
                <tr>
                    <td style="font-weight: 500; color: #333;">${booking.name} <br> <small style="color:#aaa">${booking.phone}</small></td>
                    <td>${booking.service}</td>
                    <td>${booking.doctor}</td>
                    <td>${booking.date} at ${booking.time}</td>
                    <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
                    <td>
                        <button class="btn-action btn-confirm" 
                                ${isConfirmed ? 'disabled' : ''} 
                                onclick="confirmAppt('${booking._id}')">
                            ${isConfirmed ? 'Approved' : 'Confirm'}
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Failed to load data from server. Is Node.js running?</td></tr>';
    }
}

// خلينا الدالة تابعة للـ window عشان الـ HTML يشوفها
window.confirmAppt = async function(id) {
    console.log("🔘 Button Clicked! Trying to confirm ID:", id); 

    try {
        const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Confirmed' })
        });

        if (response.ok) {
            // إظهار رسالة النجاح الخضراء
            const banner = document.getElementById('successBanner');
            if (banner) {
                banner.style.display = 'flex';
                setTimeout(() => { banner.style.display = 'none'; }, 2000);
            }
            displayBookings(); // ريفريش للجدول عشان الكلمة تتغير
        } else {
            console.error("❌ Server rejected the request");
        }
    } catch (error) {
        console.error("🔥 Error confirming appointment:", error);
        alert("Failed to connect to the server.");
    }
};
// ==========================================
// 2. نظام إدارة المنتجات (Store Products) - LocalStorage
// ==========================================
function displayAdminProducts() {
    const tableBody = document.getElementById('adminProductsTable');
    if (!tableBody) return;
    
    const products = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];
    tableBody.innerHTML = '';

    products.reverse().forEach(prod => {
        const stockStatus = prod.inStock ? '<span style="color: #28a745; font-weight: bold;">In Stock</span>' : '<span style="color: #dc3545; font-weight: bold;">Sold Out</span>';
        const stockBtn = prod.inStock 
            ? `<button class="btn-action" style="background:#f39c12; color:white; margin-right: 5px;" onclick="toggleStock(${prod.id}, false)">Mark Sold Out</button>`
            : `<button class="btn-action" style="background:#28a745; color:white; margin-right: 5px;" onclick="toggleStock(${prod.id}, true)">Mark In Stock</button>`;
        const deleteBtn = `<button class="btn-action" style="background:#dc3545; color:white;" onclick="deleteProduct(${prod.id})">Delete</button>`;

        const row = `
            <tr>
                <td style="font-weight: 500;">${prod.name}</td>
                <td>$${prod.offer ? prod.offer : prod.price}</td>
                <td>${stockStatus}</td>
                <td>${stockBtn} ${deleteBtn}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function toggleStock(id, isStock) {
    let products = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index].inStock = isStock;
        localStorage.setItem('clinicStoreProducts', JSON.stringify(products));
        displayAdminProducts(); 
    }
}

function deleteProduct(id) {
    if(confirm("Are you sure you want to delete this product?")) {
        let products = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem('clinicStoreProducts', JSON.stringify(products));
        displayAdminProducts();
    }
}

// ==========================================
// 3. نظام إدارة الأطباء (Specialists) - LocalStorage
// ==========================================
function displayAdminSpecialists() {
    const tableBody = document.getElementById('adminSpecialistsTable');
    if (!tableBody) return;
    
    const specialists = JSON.parse(localStorage.getItem('clinicSpecialists')) || [];
    tableBody.innerHTML = '';

    specialists.reverse().forEach(doc => {
        const row = `
            <tr>
                <td style="font-weight: 500;">${doc.name}</td>
                <td>${doc.title}</td>
                <td><button class="btn-action" style="background:#dc3545; color:white;" onclick="deleteSpecialist(${doc.id})">Remove</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

window.deleteSpecialist = function(id) {
    if(confirm("Remove this doctor from the team?")) {
        let specialists = JSON.parse(localStorage.getItem('clinicSpecialists')) || [];
        specialists = specialists.filter(d => d.id !== id);
        localStorage.setItem('clinicSpecialists', JSON.stringify(specialists));
        displayAdminSpecialists();
    }
};

// ==========================================
// 5. نظام إدارة الرسائل (Messages) - LocalStorage
// ==========================================
function displayAdminMessages() {
    const container = document.getElementById('adminMessagesList');
    if (!container) return;

    const messages = JSON.parse(localStorage.getItem('clinicMessages')) || [];
    container.innerHTML = '';

    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No messages received yet.</p>';
        return;
    }

    messages.reverse().forEach(msg => {
        container.innerHTML += `
            <div class="full-message">
                <div class="msg-top">
                    <h4>${msg.name} (${msg.email}) - ${msg.phone}</h4>
                    <span>${msg.date}</span>
                </div>
                <p class="msg-body">${msg.message}</p>
                <a href="mailto:${msg.email}" class="btn-reply" style="text-decoration:none; display:inline-block;">
                    <i class="fas fa-reply"></i> Reply via Email
                </a>
            </div>
        `;
    });
}

// ==========================================
// 6. إحصائيات الداشبورد الرئيسية (Dashboard Stats) - مربوطة بالداتابيز 🍃
// ==========================================
async function updateDashboardStats() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return; 

    try {
        // بنجيب الحجوزات من السيرفر عشان الأرقام تبقى حقيقية
        const response = await fetch('http://localhost:3000/api/bookings');
        const bookings = await response.json();

        const messages = JSON.parse(localStorage.getItem('clinicMessages')) || [];
        const products = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];
        const specialists = JSON.parse(localStorage.getItem('clinicSpecialists')) || [];

        const pendingCount = bookings.filter(b => b.status === 'Pending').length;
        const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
        
        const elConfirmed = document.getElementById('statConfirmedAppts');
        const elPending = document.getElementById('statPendingBookings');
        const elMessages = document.getElementById('statUnreadMessages');
        const elProducts = document.getElementById('statTotalProducts');
        const elDoctors = document.getElementById('statTotalDoctors');

        if(elConfirmed) elConfirmed.textContent = confirmedCount;
        if(elPending) elPending.textContent = pendingCount;
        if(elMessages) elMessages.textContent = messages.length;
        if(elProducts) elProducts.textContent = products.length;
        if(elDoctors) elDoctors.textContent = specialists.length;

        // تحديث جدول الداشبورد
        const dashBookingsTable = document.getElementById('adminDashboardBookings');
        if (dashBookingsTable) {
            dashBookingsTable.innerHTML = '';
            bookings.slice(0, 4).forEach(b => {
                const badgeClass = b.status === 'Confirmed' ? 'status-confirmed' : 'status-pending';
                dashBookingsTable.innerHTML += `
                    <tr>
                        <td>${b.name}</td>
                        <td>${b.service}</td>
                        <td>${b.doctor}</td>
                        <td>${b.date}</td>
                        <td>${b.time}</td>
                        <td><span class="status-badge ${badgeClass}">${b.status}</span></td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.log("Error updating stats", error);
    }
}

// ==========================================
// 7. تفعيل أزرار الهيدر (Topbar Actions)
// ==========================================
function initTopbarActions() {
    const refreshBtn = document.querySelector('.fa-sync-alt');
    if (refreshBtn) {
        refreshBtn.style.cursor = 'pointer';
        refreshBtn.addEventListener('click', () => window.location.reload());
    }

    const bellBtn = document.querySelector('.fa-bell');
    if (bellBtn) {
        bellBtn.style.cursor = 'pointer';
        bellBtn.addEventListener('click', async () => {
            // بنقرأ الحجوزات من السيرفر للإشعار
            try {
                const res = await fetch('http://localhost:3000/api/bookings');
                const bookings = await res.json();
                const pending = bookings.filter(b => b.status === 'Pending').length;
                const messages = JSON.parse(localStorage.getItem('clinicMessages')) || [];
                alert(`🔔 Notifications:\n- You have ${pending} new booking requests.\n- You have ${messages.length} unread messages.`);
            } catch (e) {
                alert("🔔 Notifications system is offline.");
            }
        });
    }
    
    const searchBtn = document.querySelector('.fa-search');
    if (searchBtn) {
        searchBtn.style.cursor = 'pointer';
        searchBtn.addEventListener('click', () => prompt("🔍 Search in dashboard:"));
    }

    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        profileInfo.style.cursor = 'pointer';
        profileInfo.style.position = 'relative'; 
        
        const dropdown = document.createElement('div');
        dropdown.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
        dropdown.style.cssText = `
            position: absolute; top: 120%; right: 0; background: #fff; 
            border: 1px solid #eee; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 12px 20px; color: #d32f2f; font-weight: 600; font-size: 13px;
            display: none; min-width: 120px; z-index: 1000; transition: 0.3s;
        `;
        profileInfo.appendChild(dropdown);

        profileInfo.addEventListener('click', (e) => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if(confirm("Are you sure you want to log out?")) {
                localStorage.removeItem('isAdminLoggedIn');
                window.location.href = "../index.html"; 
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!profileInfo.contains(e.target)) dropdown.style.display = 'none';
        });
    }
}

// ==========================================
// 4. التشغيل الموحد عند فتح أي صفحة أدمن
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    displayBookings();
    displayAdminProducts();
    displayAdminSpecialists();
    displayAdminMessages();
    updateDashboardStats();
    initTopbarActions();

    // -- أ) لوجيك فورم إضافة المنتجات --
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('prodName').value;
            const price = document.getElementById('prodPrice').value;
            const offer = document.getElementById('prodOffer').value;
            const desc = document.getElementById('prodDesc').value;
            const file = document.getElementById('prodImg').files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const newProduct = {
                        id: Date.now(), name: name, price: price, offer: offer,
                        inStock: true, img: event.target.result, desc: desc
                    };
                    let products = JSON.parse(localStorage.getItem('clinicStoreProducts')) || [];
                    products.push(newProduct);
                    localStorage.setItem('clinicStoreProducts', JSON.stringify(products));
                    alert('Product Added Successfully! 🛍️');
                    addProductForm.reset();
                    displayAdminProducts();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // -- ب) لوجيك فورم إضافة الخدمات --
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const title = document.getElementById('serviceTitle').value;
            const duration = document.getElementById('serviceDuration').value;
            const price = document.getElementById('servicePrice').value;
            const offer = document.getElementById('serviceOffer').value; 
            const desc = document.getElementById('serviceDesc').value;
            const file = document.getElementById('serviceImg').files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newService = {
                        title: title, duration: duration, price: price, offer: offer, 
                        img: e.target.result, desc: desc
                    };
                    let storedServices = JSON.parse(localStorage.getItem('clinicData')) || [];
                    storedServices.push(newService);
                    localStorage.setItem('clinicData', JSON.stringify(storedServices));
                    alert('Service Uploaded Successfully! 🎉');
                    addServiceForm.reset(); 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // -- ج) لوجيك فورم إضافة الأطباء --
    const addSpecialistForm = document.getElementById('addSpecialistForm');
    if (addSpecialistForm) {
        addSpecialistForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const name = document.getElementById('docName').value;
            const title = document.getElementById('docTitle').value;
            const desc = document.getElementById('docDesc').value;
            const file = document.getElementById('docImg').files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newDoc = {
                        id: Date.now(), name: name, title: title, desc: desc, img: e.target.result
                    };
                    let specialists = JSON.parse(localStorage.getItem('clinicSpecialists')) || [];
                    specialists.push(newDoc);
                    localStorage.setItem('clinicSpecialists', JSON.stringify(specialists));
                    alert('Doctor Added Successfully! 👨‍⚕️');
                    addSpecialistForm.reset(); 
                    displayAdminSpecialists();
                };
                reader.readAsDataURL(file);
            }
        });
    }
});