// ==========================================
// 1. الداتابيز المبدئية (الخدمات والدكاترة)
// ==========================================
const defaultServices = [
    { title: "Laser Hair Removal", duration: "30 min", price: "120", offer: "90", img: "images/laser-hair-removal.jpg", desc: "Get rid of unwanted hair permanently with our advanced laser technology." },
    { title: "Botox", duration: "30 min", price: "150", offer: "", img: "images/botox.jpg", desc: "Smooth out fine lines and wrinkles with our premium Botox treatments." },
    { title: "Fillers", duration: "30 min", price: "200", offer: "", img: "images/fillers.png", desc: "Enhance your facial contours and restore lost volume." },
    { title: "Facial Treatment", duration: "60 min", price: "80", offer: "60", img: "images/facial.png", desc: "Rejuvenate your skin with our deep-cleansing facial treatments." }
];

const defaultSpecialists = [
    { id: 1, name: "Dr. Sarah Hassan", title: "Dermatologist", desc: "Expert in skincare and anti-aging treatments", img: "images/Sarah-Hassan.png" },
    { id: 2, name: "Dr. Yasmine Adel", title: "Aesthetic Specialist", desc: "Specializes in fillers, botox, and facial rejuvenation", img: "images/Yasmine-Adel.png" },
    { id: 3, name: "Dr. Layla Mansour", title: "Cosmetic Doctor", desc: "Skilled in non-surgical aesthetic procedures", img: "images/Layla-Mansour.png" },
    { id: 4, name: "Dr. Nadia Kamal", title: "Laser Specialist", desc: "Expert in laser hair removal and skin resurfacing", img: "images/Nadia-Kamal.jpg" },
    
];

// ==========================================
// 2. تهيئة الـ LocalStorage
// ==========================================
if (!localStorage.getItem('clinicData')) {
    localStorage.setItem('clinicData', JSON.stringify(defaultServices));
}

// السطر ده بيمسح داتابيز الدكاترة القديمة اللي كانت بايظة ويدخل الجديدة النظيفة
localStorage.setItem('clinicSpecialists', JSON.stringify(defaultSpecialists));


// ==========================================
// 3. دوال الرسم (الخدمات - الدكاترة - البروفايل)
// ==========================================

function renderServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return; 
    
    let clinicServices = JSON.parse(localStorage.getItem('clinicData')) || defaultServices;
    container.innerHTML = ''; 

    // ضفنا كلمة index هنا عشان نعرف إحنا دوسنا على أي خدمة
    clinicServices.forEach((service, index) => {
        let priceHTML = service.offer ? 
            `<div style="margin-bottom: 10px;">
                <span style="text-decoration: line-through; color: #999; font-size: 14px;">$${service.price}</span>
                <span style="color: #d81b60; font-weight: bold; font-size: 18px; margin-left: 8px;">$${service.offer}</span>
                <span style="background: #d81b60; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 8px; vertical-align: top;">SALE</span>
            </div>` 
            : 
            `<div style="margin-bottom: 10px;">
                <span style="color: #333; font-weight: bold; font-size: 18px;">$${service.price}</span>
            </div>`;

        container.innerHTML += `
            <div class="service-card">
                <img src="${service.img}" alt="${service.title}" class="service-img">
                <div class="service-info">
                    <h3>${service.title}</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Duration: ${service.duration}</p>
                    ${priceHTML}
                    <div class="card-buttons">
                        <button onclick="openServiceModal(${index})" class="btn-card-solid">VIEW DETAILS</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderSpecialists() {
    const container = document.getElementById('specialistsContainer');
    if (!container) return;

    let clinicSpecialists = JSON.parse(localStorage.getItem('clinicSpecialists'));
    container.innerHTML = '';
    
    clinicSpecialists.forEach(doc => {
        container.innerHTML += `
            <div class="specialist-card">
                <img src="${doc.img}" alt="${doc.name}" class="specialist-img" onerror="this.src='https://via.placeholder.com/300x350?text=Doctor+Image'">
                <div class="specialist-info">
                    <h3 class="specialist-name">${doc.name}</h3>
                    <div class="specialist-title">${doc.title}</div>
                    <p class="specialist-desc">${doc.desc}</p>
                    <a href="doctor.html?id=${doc.id}" class="btn-view-profile">VIEW PROFILE</a>
                </div>
            </div>
        `;
    });
}

function renderDoctorProfile() {
    const profileContent = document.getElementById('doctorProfileContent');
    if (!profileContent) return;

    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    let specialists = JSON.parse(localStorage.getItem('clinicSpecialists'));
    const doctor = specialists.find(doc => doc.id == doctorId);

    if (doctor) {
        profileContent.innerHTML = `
            <div class="profile-card">
                <div class="profile-image-col">
                    <img src="${doctor.img}" alt="${doctor.name}" onerror="this.src='https://via.placeholder.com/500x600?text=Doctor+Image'">
                </div>
                <div class="profile-info-col">
                    <h1 class="profile-name">${doctor.name}</h1>
                    <div class="profile-title">${doctor.title}</div>
                    <p class="profile-desc">
                        ${doctor.desc} <br><br>
                        With a deep passion for aesthetic medicine, ${doctor.name} ensures that every treatment is tailored to the unique needs of the patient, prioritizing safety, comfort, and natural-looking results.
                    </p>
                    <div class="profile-stats">
                        <div class="stat-item"><h4>10+</h4><p>Years Experience</p></div>
                        <div class="stat-item"><h4>⭐⭐⭐⭐⭐</h4><p>5.0 Patient Rating</p></div>
                    </div>
                    <a href="booking.html" class="btn-book-profile">BOOK APPOINTMENT</a>
                </div>
            </div>
        `;
    } else {
        profileContent.innerHTML = `<h2 style="text-align:center; padding: 50px;">Doctor not found!</h2>`;
    }
}

// ==========================================
// 4. نظام الحجز (Booking Logic)
// ==========================================
function handleBooking() {
    const bookingForm = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('bookingService');
    
    if (serviceSelect) {
        const currentServices = JSON.parse(localStorage.getItem('clinicData'));
        if(currentServices) {
            currentServices.forEach(service => {
                const option = document.createElement('option');
                option.value = service.title;
                option.textContent = service.title;
                serviceSelect.appendChild(option);
            });
        }
    }

    if (bookingForm) {
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
                status: "Pending" 
            };
            let allBookings = JSON.parse(localStorage.getItem('clinicBookings')) || [];
            allBookings.push(newBooking);
            localStorage.setItem('clinicBookings', JSON.stringify(allBookings));
            alert('Your appointment request has been sent successfully!');
            bookingForm.reset();
        });
    }
}
// ==========================================
// لوجيك صفحة تواصل معنا (Contact Us)
// ==========================================
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newMessage = {
                id: Date.now(),
                name: document.getElementById('contactName').value,
                phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value,
                date: new Date().toLocaleDateString(),
                status: "Unread"
            };

            let allMessages = JSON.parse(localStorage.getItem('clinicMessages')) || [];
            allMessages.push(newMessage);
            localStorage.setItem('clinicMessages', JSON.stringify(allMessages));

            alert('Thank you! Your message has been sent successfully. We will contact you soon.');
            contactForm.reset();
        });
    }
}
// ==========================================
// لوجيك صفحة Gallery (Before & After Slider)
// ==========================================
function initGallerySliders() {
    const sliders = document.querySelectorAll('.ba-slider');
    
    sliders.forEach(slider => {
        const input = slider.querySelector('.slider-input');
        const imgBefore = slider.querySelector('.img-before');
        const sliderLine = slider.querySelector('.slider-line');
        const sliderButton = slider.querySelector('.slider-button');

        if(input) {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                imgBefore.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
                sliderLine.style.left = `${value}%`;
                sliderButton.style.left = `${value}%`;
            });
        }
    });
}
// ==========================================
// حركات السكرول (Reveal Elements on Scroll)
// ==========================================
function initScrollReveal() {
    // بنختار كل الكروت اللي عايزينها تتحرك وهي بتظهر
    const elementsToReveal = document.querySelectorAll('.service-card, .specialist-card, .product-card, .info-item, .profile-card, .ba-slider');

    // بنديهم كلهم كلاس reveal المبدئي اللي بيخفيهم
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
    });

    // دالة المراقبة: بتشوف إيه اللي وصل للشاشة وتظهره
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // المسافة اللي قبل ما يظهر الكارت

        elementsToReveal.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active'); // ظهر الكارت!
            }
        });
    };

    // نشغلها لما اليوزر يعمل سكرول
    window.addEventListener('scroll', revealOnScroll);
    
    // ونشغلها مرة أول ما الصفحة تفتح عشان نظهر الحاجات اللي في أول الشاشة
    setTimeout(revealOnScroll, 100); 
}
// ==========================================
// لوجيك النافذة المنبثقة (Service Modal)
// ==========================================

// دالة فتح المودال وتعبئة البيانات
function openServiceModal(index) {
    const services = JSON.parse(localStorage.getItem('clinicData')) || [];
    const service = services[index];
    if (!service) return;

    // بنعبي الداتا جوه الـ HTML بتاع المودال
    document.getElementById('modalTitle').textContent = service.title;
    document.getElementById('modalDuration').textContent = `Duration: ${service.duration}`;
    document.getElementById('modalDesc').textContent = service.desc || "Experience our premium aesthetic treatment tailored to your specific needs, prioritizing safety and natural-looking results.";

    const priceContainer = document.getElementById('modalPriceContainer');
    if (service.offer && service.offer !== "") {
        priceContainer.innerHTML = `<span style="text-decoration: line-through; color: #999; margin-right: 10px;">$${service.price}</span><span style="color: #d81b60; font-weight: bold; font-size: 20px;">$${service.offer}</span>`;
    } else {
        priceContainer.innerHTML = `<span style="color: #333; font-weight: bold; font-size: 20px;">$${service.price}</span>`;
    }

    // إظهار المودال
    const modal = document.getElementById('serviceModal');
    if(modal) modal.classList.add('active');
}

// دالة إغلاق المودال
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.close-btn');

    if (modal && closeBtn) {
        // القفل من علامة (X)
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // القفل لو العميل داس في أي مكان فاضي بره المودال
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});
// ==========================================
// 5. التشغيل المجمع (DOMContentLoaded واحد فقط!)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderSpecialists();
    renderDoctorProfile();
    initGallerySliders();
    handleContactForm();
    initScrollReveal();
});