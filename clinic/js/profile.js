document.addEventListener('DOMContentLoaded', () => {
    
    // 1. التأكد من تسجيل الدخول
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // لو اليوزر مش مسجل دخول، هنرجعه لصفحة اللوجين
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('profilePhone');

    if(nameInput) nameInput.value = currentUser.name;
    if(emailInput) emailInput.value = currentUser.email;
    if(phoneInput) phoneInput.value = currentUser.phone || '';


    const updateForm = document.getElementById('updateProfileForm');
    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser.name = document.getElementById('profileName').value;
            currentUser.phone = document.getElementById('profilePhone').value;
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('✨ Profile updated successfully!');
            window.location.reload();
        });
    }

    fetchUserBookings(currentUser.email, currentUser.phone, currentUser.name);
    fetchUserOrders(currentUser.email, currentUser.phone, currentUser.name);
});



//بتجيب الحجوزات
async function fetchUserBookings(userEmail, userPhone, userName) {
    const tableBody = document.getElementById('userBookingsBody');
    if (!tableBody) return;

    try {
        // هنكلم الملف المخصص للعميل عشان يجيب حجوزاته هو بس بالإيميل
        const response = await fetch('../api/get_my_bookings.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });
        
        const result = await response.json();

        tableBody.innerHTML = ''; 

        // لو العميل عنده حجوزات
        if (result.success && result.bookings.length > 0) {
            result.bookings.forEach(booking => {
                let statusClass = 'status-pending';
                if (booking.status === 'Confirmed') statusClass = 'status-confirmed';
                else if (booking.status === 'Rejected') statusClass = 'status-rejected';

                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${booking.service}</strong></td>
                        <td><i class="fas fa-user-md" style="color:var(--primary-pink); margin-right:5px;"></i> ${booking.doctor}</td>
                        <td><i class="far fa-calendar-alt" style="color:#888; margin-right:5px;"></i> ${booking.date} <br> <small style="color:#888;">🕒 ${booking.time}</small></td>
                        <td><span class="status-badge ${statusClass}">${booking.status || 'Pending'}</span></td>
                    </tr>
                `;
            });
        } else {
            // لو مفيش حجوزات
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #888;"><i class="far fa-calendar-times" style="font-size: 40px; color: #ddd; margin-bottom: 15px;"></i><br>You have no appointments yet. <br><br> <a href="booking.html" class="btn-card-solid" style="padding: 10px 20px; font-size: 14px; text-decoration: none;">Book Now!</a></td></tr>';
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;"><i class="fas fa-exclamation-triangle"></i> Error connecting to database.</td></tr>';
    }
}