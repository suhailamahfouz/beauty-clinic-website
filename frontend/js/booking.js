// ==========================================
// نظام الحجز (Booking System)
// ==========================================

// الداتا الأساسية عشان لو المتصفح فاضي يجيب منها الخدمات
const defaultServicesList = [
    { title: "Laser Hair Removal" },
    { title: "Botox" },
    { title: "Fillers" },
    { title: "Facial Treatment" }
];

// دالة بتجيب الخدمات من المتصفح وتحطها في القائمة المنسدلة
function populateServicesDropdown() {
    const serviceSelect = document.getElementById('bookingService');
    if (!serviceSelect) return; 

    const currentServices = JSON.parse(localStorage.getItem('clinicData')) || defaultServicesList;

    currentServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.title;
        option.textContent = service.title;
        serviceSelect.appendChild(option);
    });
}

// دالة إرسال الحجز للداش بورد
function handleBookingSubmit() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const newBooking = {
            id: Date.now(), 
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            service: document.getElementById('bookingService').value,
            doctor: document.getElementById('bookingDoctor').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            status: "Pending" // الحالة المبدئية اللي الأدمن هيشوفها
        };

        let allBookings = JSON.parse(localStorage.getItem('clinicBookings')) || [];
        allBookings.push(newBooking);
        localStorage.setItem('clinicBookings', JSON.stringify(allBookings));

        alert('Your appointment request has been sent successfully! We will contact you soon.');
        bookingForm.reset();
    });
}

// تشغيل النظام أول ما صفحة الحجز تفتح
document.addEventListener('DOMContentLoaded', () => {
    populateServicesDropdown();
    handleBookingSubmit();
});