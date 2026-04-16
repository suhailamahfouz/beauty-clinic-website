document.addEventListener('DOMContentLoaded', () => {
    
    // 1. التأكد من تسجيل الدخول
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("Please login first to view your profile.");
        window.location.href = "login.html";
        return;
    }

    // 2. تعبئة البيانات في فورم التعديل
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profilePhone').value = currentUser.phone || '';

    // 3. تحديث البيانات محلياً
    const updateForm = document.getElementById('updateProfileForm');
    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('profileName').value;
            const newPhone = document.getElementById('profilePhone').value;
            
            currentUser.name = newName;
            currentUser.phone = newPhone;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            alert('Profile updated successfully! ✨');
            window.location.reload();
        });
    }

    // 4. جلب الحجوزات والطلبات من السيرفر
    fetchUserBookings(currentUser.phone);
    fetchUserOrders(currentUser.phone);
});

// دالة جلب الحجوزات (Appointments)
async function fetchUserBookings(userPhone) {
    const tableBody = document.getElementById('userBookingsBody');
    try {
        const response = await fetch('http://localhost:3000/api/bookings');
        const allBookings = await response.json();

        // تصفية الحجوزات برقم تليفون العميل
        const myBookings = allBookings.filter(booking => booking.phone === userPhone);

        tableBody.innerHTML = ''; 

        if (myBookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #888;">You have no appointments yet. <br><a href="booking.html" style="color: var(--primary-pink); text-decoration: underline;">Book now!</a></td></tr>';
            return;
        }

        myBookings.forEach(booking => {
            const statusClass = booking.status === 'Confirmed' ? 'status-confirmed' : 'status-pending';
            tableBody.innerHTML += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px 10px; font-weight: 500;">${booking.service}</td>
                    <td>${booking.doctor}</td>
                    <td>${booking.date} <br> <small style="color:#888;">${booking.time}</small></td>
                    <td><span class="status-badge ${statusClass}">${booking.status || 'Pending'}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Error loading bookings. Is the server running?</td></tr>';
    }
}

// دالة جلب الطلبات (Orders)
async function fetchUserOrders(userPhone) {
    const ordersBody = document.getElementById('userOrdersBody');
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        const allOrders = await response.json();

        // تصفية الطلبات برقم تليفون العميل
        const myOrders = allOrders.filter(order => order.phone === userPhone);

        ordersBody.innerHTML = '';

        if (myOrders.length === 0) {
            ordersBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #888;">You have no product orders yet. <br><a href="products.html" style="color: var(--primary-pink); text-decoration: underline;">Shop now!</a></td></tr>';
            return;
        }

        myOrders.forEach(order => {
            // لو مفيش آي دي (عشان لسه مش مربوطين بقاعدة بيانات حقيقية للطلبات)، نعمل آي دي عشوائي للرؤية
            const orderId = order._id ? order._id.substring(0, 8) : Math.floor(Math.random() * 1000000);
            const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
            const statusClass = order.status === 'Delivered' ? 'status-confirmed' : 'status-pending';

            ordersBody.innerHTML += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px 10px; font-weight: 500;">#${orderId}</td>
                    <td>${orderDate}</td>
                    <td style="color: var(--primary-pink); font-weight: bold;">$${order.totalAmount || '0.00'}</td>
                    <td><span class="status-badge ${statusClass}">${order.status || 'Processing'}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        ordersBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading orders. Is the server running?</td></tr>';
    }
}