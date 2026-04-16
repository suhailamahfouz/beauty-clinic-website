// ==========================================
// نظام الحجز (Booking System) - النسخة الذكية 🧠
// ==========================================

const defaultServicesList = [
    { title: "Laser Hair Removal" },
    { title: "Botox" },
    { title: "Fillers" },
    { title: "Facial Treatment" }
];

// 1. تعبئة قائمة الخدمات
function populateServicesDropdown() {
    const serviceSelect = document.getElementById('bookingService');
    if (!serviceSelect) return; 

    const currentServices = JSON.parse(localStorage.getItem('clinicData')) || defaultServicesList;
    serviceSelect.innerHTML = '<option value="" disabled selected>Choose a service</option>';

    currentServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.title;
        option.textContent = service.title;
        serviceSelect.appendChild(option);
    });
}

// 2. تعبئة بيانات العميل تلقائياً
function autoFillUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const nameInput = document.getElementById('clientName');
        const phoneInput = document.getElementById('clientPhone');
        if (nameInput) nameInput.value = currentUser.name;
        if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;
    }
}

// 3. إرسال الحجز لـ MongoDB
function handleBookingSubmit() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const bookingData = {
                name: document.getElementById('clientName').value,
                phone: document.getElementById('clientPhone').value,
                service: document.getElementById('bookingService').value,
                doctor: document.getElementById('bookingDoctor').value,
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });

                if (response.ok) {
                    alert('Success! Your appointment is saved in MongoDB! 🍃✨');
                    bookingForm.reset();
                    autoFillUserData(); 
                }
            } catch (error) {
                alert('Server is offline! Run "node server.js" 🏃‍♂️');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateServicesDropdown();
    autoFillUserData();
    handleBookingSubmit();
});