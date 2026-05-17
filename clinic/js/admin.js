// الحجوزات
let allBookingsData = []; 
async function fetchBookingsForAdmin() {
    const tableBody = document.getElementById('adminBookingsTable');
    const dashboardTable = document.getElementById('adminDashboardBookings'); 

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1 && parts[1].length > 0) return (parts[0][0] + parts[1][0]).toUpperCase();
        if (parts[0].length > 0) return parts[0][0].toUpperCase();
        return 'U';
    };

    try {
        const response = await fetch('../api/get_bookings.php');
        allBookingsData = await response.json();

        // 1. تحديث جدول الـ Dashboard
        if (dashboardTable) {
            dashboardTable.innerHTML = '';
            const pendingCount = allBookingsData.filter(b => b.status === 'Pending').length;
            if(document.getElementById('statPendingBookings')) document.getElementById('statPendingBookings').textContent = pendingCount;
            
            const confirmedCount = allBookingsData.filter(b => b.status === 'Confirmed').length;
            if(document.getElementById('statConfirmedAppts')) document.getElementById('statConfirmedAppts').textContent = confirmedCount;

            const recentBookings = allBookingsData.slice(0, 5); 
            recentBookings.forEach(booking => {
                const badgeClass = booking.status === 'Confirmed' ? 'status-confirmed' : (booking.status === 'Rejected' ? 'status-rejected' : 'status-pending');
                dashboardTable.innerHTML += `
                    <tr>
                        <td>
                            <div class="client-cell">
                                <div class="client-avatar" style="background: #eac5cb; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${getInitials(booking.name)}</div>
                                <div class="client-info"><h4>${booking.name}</h4><p>${booking.phone}</p></div>
                            </div>
                        </td>
                        <td><div class="client-info"><h4>${booking.service.split(' - ')[0] || booking.service}</h4><p>Treatment</p></div></td>
                        <td>
                            <div class="client-cell">
                                <div style="width: 25px; height: 25px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px;">${getInitials(booking.doctor)}</div>
                                <div class="client-info"><h4>${booking.doctor}</h4><p>Specialist</p></div>
                            </div>
                        </td>
                        <td style="font-size: 12px; color: #555;">${booking.date}</td>
                        <td style="font-size: 12px; color: #555;">${booking.time}</td>
                        <td><span class="status-badge ${badgeClass}">${booking.status || 'Pending'}</span></td>
                        <td style="color: #999; cursor: pointer; text-align: center;"><i class="fas fa-ellipsis-v"></i></td>
                    </tr>
                `;
            });
        }

        if (tableBody) {
            if(document.getElementById('statTotalReq')) document.getElementById('statTotalReq').textContent = allBookingsData.length;
            if(document.getElementById('statConfReq')) document.getElementById('statConfReq').textContent = allBookingsData.filter(b => b.status === 'Confirmed').length;
            if(document.getElementById('statPendReq')) document.getElementById('statPendReq').textContent = allBookingsData.filter(b => b.status === 'Pending').length;
            if(document.getElementById('statRejReq')) document.getElementById('statRejReq').textContent = allBookingsData.filter(b => b.status === 'Rejected').length;

            populateFilterDropdowns();
            renderAdminBookingsTable(allBookingsData); 
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}


function populateFilterDropdowns() {
    const serviceSelect = document.getElementById('filterService');
    const doctorSelect = document.getElementById('filterDoctor');

    if (serviceSelect && serviceSelect.options.length <= 1) {
        const uniqueServices = [...new Set(allBookingsData.map(b => b.service))];
        uniqueServices.forEach(s => serviceSelect.innerHTML += `<option value="${s}">${s.split(' - ')[0] || s}</option>`);
    }

    if (doctorSelect && doctorSelect.options.length <= 1) {
        const uniqueDoctors = [...new Set(allBookingsData.map(b => b.doctor))];
        uniqueDoctors.forEach(d => doctorSelect.innerHTML += `<option value="${d}">${d}</option>`);
    }
}


window.filterBookings = function() {
    const searchVal = document.getElementById('filterSearch')?.value.toLowerCase() || '';
    const serviceVal = document.getElementById('filterService')?.value || 'All';
    const doctorVal = document.getElementById('filterDoctor')?.value || 'All';
    const statusVal = document.getElementById('filterStatus')?.value || 'All';
    const dateVal = document.getElementById('filterDate')?.value || '';

    const filtered = allBookingsData.filter(b => {
        const matchSearch = (b.name && b.name.toLowerCase().includes(searchVal)) || (b.phone && b.phone.includes(searchVal));
        const matchService = serviceVal === 'All' || b.service === serviceVal;
        const matchDoctor = doctorVal === 'All' || b.doctor === doctorVal;
        const matchStatus = statusVal === 'All' || (b.status || 'Pending') === statusVal;
        const matchDate = dateVal === '' || b.date === dateVal;

        return matchSearch && matchService && matchDoctor && matchStatus && matchDate;
    });

    renderAdminBookingsTable(filtered);
};

// دالة رسم الجدول (فصلناها عشان نستخدمها وقت الفلترة بسهولة)
function renderAdminBookingsTable(data) {
    const tableBody = document.getElementById('adminBookingsTable');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: #999;">No requests found matching your filters.</td></tr>';
        return;
    }

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1 && parts[1].length > 0) return (parts[0][0] + parts[1][0]).toUpperCase();
        if (parts[0].length > 0) return parts[0][0].toUpperCase();
        return 'U';
    };

    data.forEach(booking => {
        const isConfirmed = booking.status === 'Confirmed';
        const isRejected = booking.status === 'Rejected';
        
        let dotClass = 'dot-pending';
        let textClass = 'text-pending';
        if (isConfirmed) { dotClass = 'dot-confirmed'; textClass = 'text-confirmed'; }
        else if (isRejected) { dotClass = 'dot-rejected'; textClass = 'text-rejected'; }

        const clientInitials = getInitials(booking.name);
        const docInitials = getInitials(booking.doctor);
        const serviceIcon = `<div style="width:35px; height:35px; border-radius:8px; background:#fdf2f4; color:var(--primary); display:flex; align-items:center; justify-content:center;"><i class="fas fa-spa"></i></div>`;

        const row = `
            <tr>
                <td>
                    <div class="client-cell">
                        <div class="client-avatar" style="background: #eac5cb; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px;">${clientInitials}</div>
                        <div class="client-info">
                            <h4>${booking.name}</h4>
                            <p>${booking.phone}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="client-cell">
                        ${serviceIcon}
                        <div class="client-info">
                            <h4>${booking.service.split(' - ')[0] || booking.service}</h4>
                            <p>Treatment</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="client-cell">
                        <div style="width: 35px; height: 35px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${docInitials}</div>
                        <div class="client-info">
                            <h4>${booking.doctor}</h4>
                            <p>Specialist</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-size: 12px; color: #555; display: flex; flex-direction: column; gap: 4px;">
                        <span><i class="far fa-calendar-alt" style="color:#999; margin-right:5px; width:12px;"></i> ${booking.date}</span>
                        <span><i class="far fa-clock" style="color:#999; margin-right:5px; width:12px;"></i> ${booking.time}</span>
                    </div>
                </td>
                <td>
                    <span class="status-text ${textClass}"><span class="status-dot ${dotClass}"></span>${booking.status || 'Pending'}</span>
                </td>
                <td>
                    <div class="action-btns-group">
                        <button onclick="approveBooking(${booking.id})" class="btn-icon-sm btn-check" title="Approve" ${isConfirmed ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}><i class="fas fa-check"></i></button>
                        <button onclick="rejectBooking(${booking.id})" class="btn-icon-sm btn-cross" title="Reject" ${isRejected ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}><i class="fas fa-times"></i></button>
                        <button class="btn-icon-sm btn-dots"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

window.approveBooking = async function(id) {
    if(confirm("Are you sure you want to approve this booking? ✅")) {
        await updateBookingStatus(id, 'Confirmed');
    }
};

window.rejectBooking = async function(id) {
    if(confirm("Are you sure you want to reject this booking? ❌")) {
        await updateBookingStatus(id, 'Rejected');
    }
};

async function updateBookingStatus(id, newStatus) {
    try {
        const response = await fetch('../api/update_booking_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, status: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const banner = document.getElementById('successBanner');
            if(banner) {
                banner.innerHTML = `<i class="fas fa-check-circle"></i> Booking has been marked as ${newStatus}!`;
                banner.style.display = 'block';
                setTimeout(() => banner.style.display = 'none', 3000);
            }
            fetchBookingsForAdmin(); 
        } else {
            alert("❌ Error updating database.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Server connection error.");
    }
}
// Store & Orders
async function displayAdminProducts() {
    const tableBody = document.getElementById('adminProductsTable');
    if (!tableBody) return;
    
    try {
        const response = await fetch('../api/get_products.php');
        const products = await response.json();
        
        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #999;">No products in inventory.</td></tr>';
        } else {
            products.forEach(prod => {
                const inStock = parseInt(prod.in_stock) === 1;
                const stockStatus = inStock 
                    ? '<span class="status-text text-confirmed"><span class="status-dot dot-confirmed"></span>In Stock</span>' 
                    : '<span class="status-text text-rejected"><span class="status-dot dot-rejected"></span>Sold Out</span>';
                
                const stockBtn = inStock 
                    ? `<button class="btn-outline-warning" onclick="toggleProductStock(${prod.id}, 0)">Mark Sold Out</button>`
                    : `<button class="btn-outline-success" onclick="toggleProductStock(${prod.id}, 1)">Mark In Stock</button>`;
                
                const deleteBtn = `<button class="btn-icon-sm btn-delete-sm" onclick="deleteAdminProduct(${prod.id})"><i class="fas fa-trash"></i></button>`;
                const imgPath = `../${prod.image_path}`;

                const row = `
                    <tr>
                        <td>
                            <div class="client-cell">
                                <img src="${imgPath}" alt="${prod.name}" style="width: 35px; height: 35px; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                <span style="font-weight: 600; color:#333; font-size:12px;">${prod.name}</span>
                            </div>
                        </td>
                        <td style="font-weight: 600; font-size:12px;">${prod.offer && parseFloat(prod.offer) > 0 ? prod.offer : prod.price} EGP</td>
                        <td>${stockStatus}</td>
                        <td><div class="action-btns-group">${stockBtn} ${deleteBtn}</div></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
        
        // استدعاء الأوردرات عشان تتملي في الجدول اللي على اليمين
        fetchOrdersForAdmin(); 
    } catch (error) {
        console.error("Error fetching products:", error);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Database error.</td></tr>';
    }
}

async function fetchOrdersForAdmin() {
    const tableBody = document.getElementById('adminOrdersTable'); // هنا بنستهدف الجدول التاني الجديد
    if (!tableBody) return;

    // دالة لحساب أول حرفين من اسم العميل لكرت الأوردرات
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1 && parts[1].length > 0) return (parts[0][0] + parts[1][0]).toUpperCase();
        if (parts[0].length > 0) return parts[0][0].toUpperCase();
        return 'U';
    };

    try {
        const response = await fetch('../api/get_orders.php');
        const orders = await response.json();
        
        tableBody.innerHTML = '';

        if(orders.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color:#999;">No orders found.</td></tr>';
            return;
        }

        orders.forEach(order => {
            let itemsList = '';
            if(order.items && Array.isArray(order.items)){
                order.items.forEach(item => {
                    itemsList += `<div style="font-size:12px; color:#333; font-weight:500;">${item.name}</div><div style="font-size:10px; color:#777;">(Qty: ${item.qty || 1})</div>`;
                });
            }

            const initials = getInitials(order.customerName);
            // لو مفيش تاريخ في الداتابيز، بيعرض تاريخ افتراضي عشان الشكل يكمل زي الصورة
            const dateStr = order.created_at ? order.created_at.split(' ')[0] : "May 19, 2026"; 
            const timeStr = order.created_at ? order.created_at.split(' ')[1] : "01:55 PM";

            tableBody.innerHTML += `
                <tr>
                    <td>
                        <div class="client-cell">
                            <div class="client-avatar" style="background: #fdf2f4; color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px;">${initials}</div>
                            <div class="client-info">
                                <h4>${order.customerName}</h4>
                                <p style="font-size:10px; color:#999;">${order.phone}</p>
                                <p style="font-size:10px; color:#999;">${order.address}</p>
                            </div>
                        </div>
                    </td>
                    <td>${itemsList}</td>
                    <td style="font-weight: 600; font-size:12px;">${order.totalAmount} EGP</td>
                    <td><span class="badge-processing">${order.status || 'Processing'}</span></td>
                    <td>
                        <div style="font-size: 10px; color: #555; display: flex; flex-direction: column; gap: 2px;">
                            <span><i class="far fa-calendar-alt" style="color:#aaa;"></i> ${dateStr}</span>
                            <span style="color:#999;">${timeStr}</span>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch(err) {
        console.log("Error fetching orders", err);
    }
}

// أزرار التحكم في المخزن والحذف (زي ما هي بالظبط)
window.toggleProductStock = async function(id, newStockStatus) {
    try {
        const response = await fetch('../api/update_booking_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, in_stock: newStockStatus })
        });
        const result = await response.json();
        
        if(result.success) {
            displayAdminProducts(); 
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error updating stock:", error);
        alert("Error connecting to server.");
    }
};

window.deleteAdminProduct = async function(id) {
    if(confirm("Are you sure you want to completely delete this product?")) {
        try {
            const response = await fetch('../api/delete_product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            
            if(result.success) {
                displayAdminProducts(); 
                updateOtherDashboardStats(); 
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error connecting to server.");
        }
    }
};
// Specialists
async function displayAdminSpecialists() {
    const tableBody = document.getElementById('adminSpecialistsTable');
    if (!tableBody) return;
    
    try {
        const response = await fetch('../api/get_specialists.php');
        const specialists = await response.json();
        
        tableBody.innerHTML = '';

        if (specialists.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color:#999;">No doctors added yet.</td></tr>';
            return;
        }

        specialists.forEach(doc => {
            const imgPath = `../${doc.image_path}`;

            const row = `
                <tr>
                    <td><img src="${imgPath}" alt="${doc.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"></td>
                    <td style="font-weight: 500;">${doc.name}</td>
                    <td>${doc.title}</td>
                    <td>
                        <button class="btn-action" style="background:#dc3545; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;" onclick="deleteSpecialist(${doc.id})">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading specialists:", error);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Failed to load data. Is XAMPP running?</td></tr>';
    }
}

window.deleteSpecialist = async function(id) {
    if(confirm("Are you sure you want to completely remove this doctor from the team?")) {
        try {
            const response = await fetch('../api/delete_specialist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            
            if(result.success) {
                displayAdminSpecialists(); 
                updateOtherDashboardStats(); 
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Error connecting to server.");
        }
    }
};

//Messages
async function displayAdminMessages() {
    const container = document.getElementById('adminMessagesList');
    if (!container) return;

    try {
        const response = await fetch('../api/get_messages.php');
        const messages = await response.json();
        
        container.innerHTML = '';

        if (messages.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No messages received yet.</p>';
            return;
        }

        messages.forEach(msg => {
            const dateObj = new Date(msg.created_at);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            //  حساب الحروف الأولى من الاسم 
            const nameParts = msg.name.trim().split(' ');
            let initials = "U"; 
            if (nameParts.length > 1 && nameParts[1].length > 0) {
                initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
            } else if (nameParts[0].length > 0) {
                initials = nameParts[0][0].toUpperCase();
            }

            // كرت الرسالة   
            container.innerHTML += `
                <div class="message-card" style="background: #fff; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.04); margin-bottom: 20px; border: 1px solid #f9e1e5; transition: all 0.3s ease; overflow: hidden;">
                    
                    <div class="card-header" style="background: linear-gradient(135deg, #fdf2f4 0%, #fce4e4 100%); padding: 15px 20px; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #f9e1e5;">
                        <div class="icon-placeholder" style="width: 50px; height: 50px; background-color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 18px; box-shadow: 0 4px 10px rgba(184, 92, 107, 0.2);">
                            ${initials}
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; color: #333; font-size: 16px;">${msg.name}</h4>
                            <span style="font-size: 11px; color: #777;"><i class="far fa-clock"></i> ${formattedDate}</span>
                        </div>
                        <a href="mailto:${msg.email}" title="Reply" style="background: var(--primary); color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: 0.3s;">
                            <i class="fas fa-reply"></i>
                        </a>
                    </div>

                    <div class="card-body" style="padding: 20px;">
                        <p style="color: #555; font-size: 13px; margin: 0 0 8px 0;"><i class="fas fa-envelope" style="color: var(--secondary); width: 20px;"></i> ${msg.email}</p>
                        <p style="color: #555; font-size: 13px; margin: 0 0 15px 0;"><i class="fas fa-phone" style="color: var(--secondary); width: 20px;"></i> ${msg.phone}</p>
                        
                        <div style="background: #fdfdfd; padding: 15px; border-left: 3px solid var(--secondary); border-radius: 4px; font-size: 13px; color: #444; line-height: 1.6; font-style: italic;">
                            "${msg.message}"
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        container.innerHTML = '<p style="text-align:center; color:red; padding:20px;">Failed to load messages from database.</p>';
    }
}


async function updateOtherDashboardStats() {
    const specialists = JSON.parse(localStorage.getItem('clinicSpecialists')) || [];

    const elMessages = document.getElementById('statUnreadMessages');
    const elProducts = document.getElementById('statTotalProducts');
    const elDoctors = document.getElementById('statTotalDoctors');

    if(elDoctors) elDoctors.textContent = specialists.length; 

    if (elProducts) {
        try {
            const res = await fetch('../api/get_products.php');
            const prods = await res.json();
            elProducts.textContent = prods.length;
        } catch(e) { elProducts.textContent = "0"; }
    }

    if (elMessages) {
        try {
            const response = await fetch('../api/get_messages.php');
            const messages = await response.json();
            elMessages.textContent = messages.length;
        } catch (error) {
            elMessages.textContent = "Error";
        }
    }
}


//  أزرار الهيدر 
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
            try {
                const res = await fetch('../api/get_bookings.php');
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

// Services
async function displayAdminServices() {
    const tableBody = document.getElementById('adminServicesTable');
    if (!tableBody) return;

    try {
        const response = await fetch('../api/get_services.php');
        const services = await response.json();
        
        tableBody.innerHTML = '';

        if (services.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 40px; color:#999;">No services added yet.</td></tr>';
            return;
        }

        services.forEach(service => {
            let offerPrice = parseFloat(service.offer);
            let regularPrice = parseFloat(service.price);
            
            
            let offerDisplay = (offerPrice && offerPrice > 0) 
                ? `<span style="color:var(--primary); font-weight:bold;">${offerPrice} EGP</span>` 
                : `<span style="color:#aaa;">-</span>`;
            
            const imgPath = `../${service.image_path}`;

            tableBody.innerHTML += `
                <tr>
                    <td><img src="${imgPath}" alt="${service.title}" style="width: 55px; height: 45px; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"></td>
                    <td style="font-weight: 600; color: #333;">${service.title}</td>
                    <td style="color: #555; font-size: 13px;">${service.duration}</td>
                    <td style="font-weight: 500;">${regularPrice} EGP</td>
                    <td>${offerDisplay}</td>
                    <td><span class="status-text text-confirmed"><span class="status-dot dot-confirmed"></span>Active</span></td>
                    <td>
                        <div class="action-btns-group">
                            <button class="btn-icon-sm btn-edit-sm" title="Edit Service"><i class="fas fa-pen"></i></button>
                            <button class="btn-icon-sm btn-delete-sm" title="Delete Service" onclick="deleteAdminService(${service.id})"><i class="fas fa-trash"></i></button>
                            <button class="btn-icon-sm btn-dots"><i class="fas fa-ellipsis-v"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading services:", error);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Failed to load services.</td></tr>';
    }
}


window.deleteAdminService = async function(id) {
    if(confirm("Are you sure you want to completely delete this service?")) {
        try {
            const response = await fetch('../api/delete_service.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            
            if(result.success) {
                displayAdminServices(); 
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Error connecting to server.");
        }
    }
};

//Clinic Schedule
async function loadClinicSchedule() {
    const isDashboard = document.getElementById('statPendingBookings');
    if (!isDashboard) return; 

    const panels = document.querySelectorAll('.panel');
    const timelinePanel = panels[1]; 
    if (!timelinePanel) return;

    try {
        const response = await fetch('../api/get_bookings.php');
        const bookings = await response.json();

        const confirmed = bookings.filter(b => b.status === 'Confirmed');

        const headerHTML = `
            <div class="timeline-header">
                <h4>Confirmed Schedule</h4>
                <p>Today's approved clinic appointments</p>
            </div>
        `;

        if (confirmed.length > 0) {
            let cardsHTML = '';
            confirmed.forEach(app => {
                cardsHTML += `
                    <div class="appointment-card" style="border-left: 4px solid #d34c60; background:#fff; padding:20px; border-radius:10px; margin-bottom:15px; display:flex; gap:20px; box-shadow:0 5px 15px rgba(0,0,0,0.05);">
                        <div class="time-box" style="text-align:center; border-right:1px solid #eee; padding-right:20px;">
                            <h3 style="color:#d34c60; margin:0;">${app.time}</h3>
                        </div>
                        <div class="app-details">
                            <h4 style="margin:0 0 5px 0;">${app.name}</h4>
                            <p style="margin:0; font-size:14px; color:#666;">${app.service}</p>
                            <span style="font-size:12px; color:#d34c60; font-weight:600;"><i class="fas fa-user-md"></i> ${app.doctor}</span>
                        </div>
                    </div>
                `;
            });
            timelinePanel.innerHTML = headerHTML + cardsHTML;
        } else {
            timelinePanel.innerHTML = headerHTML + '<p style="text-align:center; padding:40px; color:#888;">No confirmed appointments for today.</p>';
        }
    } catch (error) {
        console.error("Error loading schedule:", error);
    }
}

//Users Management
async function fetchUsersForAdmin() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    try {
        const response = await fetch('../api/get_users.php');
        const users = await response.json();

        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No users registered yet.</td></tr>';
            return;
        }

        users.forEach(user => {
            const roleBadge = user.role === 'admin' 
                ? '<span style="background:#28a745; color:white; padding:5px 10px; border-radius:15px; font-size:12px; font-weight:bold;">Admin 👑</span>' 
                : '<span style="background:#6c757d; color:white; padding:5px 10px; border-radius:15px; font-size:12px;">Client 👤</span>';
            
            const actionBtn = user.role === 'admin' 
                ? `<button onclick="updateUserRole('${user.id}', 'client')" style="background:#dc3545; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Demote</button>`
                : `<button onclick="updateUserRole('${user.id}', 'admin')" style="background:#d34c60; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Make Admin</button>`;

            tableBody.innerHTML += `
                <tr>
                    <td style="font-weight: 500;">${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${roleBadge}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Connection Error.</td></tr>';
    }
}

window.updateUserRole = async function(userId, newRole) {
    if(confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
        try {
            const response = await fetch('../api/update_role.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole })
            });
            const result = await response.json();
            if (result.success) {
                fetchUsersForAdmin(); 
            } else {
                alert("❌ Error: " + result.message);
            }
        } catch (error) {
            alert("Server connection error.");
        }
    }
};


// Admin Guard
function checkAdminAuth() {
    const isAdmin = localStorage.getItem('isAdminLoggedIn');
    const currentPath = window.location.pathname;
    
    if (!isAdmin && currentPath.includes('/admin/')) {
        // window.location.href = '../login.html'; 
    }
}

// Updated
document.addEventListener('DOMContentLoaded', () => {
    
    checkAdminAuth();
    fetchBookingsForAdmin(); 
    displayAdminProducts();
    displayAdminSpecialists();
    displayAdminMessages();
    displayAdminServices();
    updateOtherDashboardStats(); 
    initTopbarActions();
    fetchUsersForAdmin(); 
    loadClinicSchedule(); 

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('name', document.getElementById('prodName').value);
            formData.append('price', document.getElementById('prodPrice').value);
            formData.append('offer', document.getElementById('prodOffer').value);
            formData.append('desc', document.getElementById('prodDesc').value);
            
            const imageFile = document.getElementById('prodImg').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const submitBtn = addProductForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Adding...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('../api/add_product.php', {
                    method: 'POST',
                    body: formData 
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Product Added Successfully! 🛍️✨');
                    addProductForm.reset();
                    displayAdminProducts(); 
                    updateOtherDashboardStats(); 
                } else {
                    alert(`❌ Error: ${result.error || result.message}`);
                }
            } catch (error) {
                console.error("Error adding product:", error);
                alert('Server error! Is XAMPP running? 🏃‍♂️');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }


    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            
            const formData = new FormData();
            formData.append('title', document.getElementById('serviceTitle').value);
            formData.append('duration', document.getElementById('serviceDuration').value);
            formData.append('price', document.getElementById('servicePrice').value);
            formData.append('offer', document.getElementById('serviceOffer').value);
            formData.append('desc', document.getElementById('serviceDesc').value);
            formData.append('image', document.getElementById('serviceImg').files[0]);

            try {
                const response = await fetch('../api/add_service.php', {
                    method: 'POST',
                    body: formData 
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(result.message);
                    addServiceForm.reset(); 
                } else {
                    alert(`❌ Error: ${result.error}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert('Server error! Is XAMPP running? 🏃‍♂️');
            }
        });
    }

    const addSpecialistForm = document.getElementById('addSpecialistForm');
    if (addSpecialistForm) {
        addSpecialistForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            
            const formData = new FormData();
            formData.append('name', document.getElementById('docName').value);
            formData.append('title', document.getElementById('docTitle').value);
            formData.append('desc', document.getElementById('docDesc').value);
            
            const imageFile = document.getElementById('docImg').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const submitBtn = addSpecialistForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Adding...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('../api/add_specialist.php', {
                    method: 'POST',
                    body: formData 
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Doctor Added Successfully! 👨‍⚕️✨');
                    addSpecialistForm.reset(); 
                    displayAdminSpecialists(); 
                    updateOtherDashboardStats(); 
                } else {
                    alert(`❌ Error: ${result.error || result.message}`);
                }
            } catch (error) {
                console.error("Error adding doctor:", error);
                alert('Server error! Is XAMPP running? 🏃‍♂️');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});