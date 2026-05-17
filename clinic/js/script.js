// خدمات 
async function renderServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return; 
    
    try {
        const response = await fetch('../api/get_services.php');
        const clinicServices = await response.json();
        
        container.innerHTML = ''; 

        if(clinicServices.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">No services available right now.</p>';
            return;
        }

        clinicServices.forEach((service) => {
            let offerPrice = parseFloat(service.offer);
            let regularPrice = parseFloat(service.price);
            
            let priceHTML = (offerPrice && offerPrice > 0) ? 
                `<p style="color: var(--primary-pink); margin-bottom: 25px; font-weight: bold; font-size: 18px;">
                    <span style="text-decoration: line-through; color: #999; font-size: 14px; margin-right: 8px;">${regularPrice} EGP</span>
                    ${offerPrice} EGP
                </p>` 
                : 
                `<p style="color: var(--primary-pink); margin-bottom: 25px; font-weight: bold; font-size: 18px;">
                    ${regularPrice} EGP
                </p>`;
            //JavaScript بتبني الكروت Dynamic.
            container.innerHTML += `
                <div class="service-card reveal">
                    <img src="${service.image_path}" alt="${service.title}" class="service-img" onerror="this.src='images/logo.png'">
                    <div class="service-info">
                        <h3>${service.title}</h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Duration: ${service.duration}</p>
                        ${priceHTML}
                        <div class="card-buttons">
                            <button onclick="openDynamicServiceModal('${service.title}', '${service.duration}', '${service.price}', '${service.offer}', '${service.description}')" class="btn-card-solid">VIEW DETAILS</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        setTimeout(() => {
            initScrollReveal();
        }, 200);

    } catch (error) {
        console.error("Error loading services:", error);
    }
}

//  دكاترة 
async function renderSpecialists() {
    const container = document.getElementById('specialistsContainer');
    if (!container) return;

    try {
        const response = await fetch('../api/get_specialists.php');
        const clinicSpecialists = await response.json();
        
        container.innerHTML = '';
        
        if(clinicSpecialists.length === 0) {
            container.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1 / -1;">No specialists available right now.</p>';
            return;
        }

        clinicSpecialists.forEach(doc => {
            const imgPath = `${doc.image_path}`;

            container.innerHTML += `
                <div class="specialist-card reveal">
                    <img src="${imgPath}" alt="${doc.name}" class="specialist-img" onerror="this.src='images/logo.png'">
                    <div class="specialist-info">
                        <h3 class="specialist-name">${doc.name}</h3>
                        <div class="specialist-title">${doc.title}</div>
                        <p class="specialist-desc">${doc.description}</p>
                        <a href="doctor.html?id=${doc.id}" class="btn-view-profile">VIEW PROFILE</a>
                    </div>
                </div>
            `;
        });
        
        setTimeout(() => {
            initScrollReveal();
        }, 150);
        
    } catch (error) {
        console.error("Error loading specialists:", error);
    }
}

// عرض بروفايل الدكتور 
async function renderDoctorProfile() {
    const profileContent = document.getElementById('doctorProfileContent');
    if (!profileContent) return;

    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');

    if (!doctorId) {
        profileContent.innerHTML = `<h2 style="text-align:center; padding: 50px;">Doctor not found!</h2>`;
        return;
    }

    try {
        const response = await fetch(`../api/get_specialists.php`);
        const specialists = await response.json();
        const doctor = specialists.find(doc => doc.id == doctorId);

        if (doctor) {
            profileContent.innerHTML = `
                <div class="profile-card">
                    <div class="profile-image-col">
                        <img src="${doctor.image_path}" alt="${doctor.name}" onerror="this.src='images/logo.png'">
                    </div>
                    <div class="profile-info-col">
                        <h1 class="profile-name">${doctor.name}</h1>
                        <div class="profile-title">${doctor.title}</div>
                        <p class="profile-desc">
                            ${doctor.description} <br><br>
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
    } catch (error) {
         console.error("Error loading doctor profile:", error);
    }
}


function openDynamicServiceModal(title, duration, price, offer, desc) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDuration').textContent = `Duration: ${duration}`;
    document.getElementById('modalDesc').textContent = desc || "Experience our premium aesthetic treatment tailored to your specific needs.";

    const priceContainer = document.getElementById('modalPriceContainer');
    let offerPrice = parseFloat(offer);
    let regularPrice = parseFloat(price);

    if (offerPrice && offerPrice > 0) {
        priceContainer.innerHTML = `<span style="text-decoration: line-through; color: #999; margin-right: 10px;">${regularPrice} EGP</span><span style="color: #d81b60; font-weight: bold; font-size: 20px;">${offerPrice} EGP</span>`;
    } else {
        priceContainer.innerHTML = `<span style="color: #333; font-weight: bold; font-size: 20px;">${regularPrice} EGP</span>`;
    }

    const modal = document.getElementById('serviceModal');
    if(modal) modal.classList.add('active');
}

//  نظام الحجوزات والتواصل
// تحديث الدكاترة في القائمة الحجز 
async function populateDoctorsDropdown() {
    const doctorSelect = document.getElementById('bookingDoctor');
    if (!doctorSelect) return;

    try {
        const response = await fetch('../api/get_specialists.php');
        const currentSpecialists = await response.json();

        doctorSelect.innerHTML = '<option value="" disabled selected>-- Choose a doctor --</option>';

        currentSpecialists.forEach(doc => {
            const option = document.createElement('option');
            option.value = `${doc.name} (${doc.title})`; 
            option.textContent = `${doc.name} (${doc.title})`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading doctors for dropdown:", error);
    }
}

//  تحديث الخدمات في القائمة الحجز 
async function populateServicesDropdown() {
    const serviceSelect = document.getElementById('bookingService');
    if (!serviceSelect) return;

    try {
        const response = await fetch('../api/get_services.php');
        const currentServices = await response.json();

        serviceSelect.innerHTML = '<option value="" disabled selected>-- Choose a service --</option>';

        currentServices.forEach(srv => {
            const option = document.createElement('option');
            option.value = srv.title; 
            option.textContent = srv.title;
            serviceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading services for dropdown:", error);
    }
}

//   إرسال الحجز للداتابيز  
function handleBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if(bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Booking...';
            submitBtn.disabled = true;

            // دالة مساعدة بتدور على الـ ID بالاسمين سواء كان في كلمة booking او لا
            const getVal = (id1, id2) => {
                const el = document.getElementById(id1) || document.getElementById(id2);
                return el ? el.value : '';
            };

            const bookingData = {
                name: getVal('bookingName', 'name'),
                phone: getVal('bookingPhone', 'phone'),
                email: getVal('bookingEmail', 'email').trim().toLowerCase(),
                service: getVal('bookingService', 'service'),
                doctor: getVal('bookingDoctor', 'doctor'),
                date: getVal('bookingDate', 'date'),
                time: getVal('bookingTime', 'time')
            };

            // للطباعة في الـ Console للتأكد
            console.log("Data going to DB:", bookingData);

            try {
                const response = await fetch('../api/add_booking.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();

                if(result.success) {
                    alert('✨ Success! Your appointment has been requested.');
                    bookingForm.reset();
                } else {
                    alert('❌ Error: ' + result.message);
                }
            } catch (error) {
                alert('Server connection error. Is XAMPP running?');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// المسدجات 
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.btn-send');
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const messageData = {
                name: document.getElementById('contactName').value,
                phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            };

            try {
                const response = await fetch('../api/send_message.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(messageData)
                });
                const result = await response.json();
                if(result.success) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                }
            } catch (error) {
                alert('Error connecting to server.');
            } finally {
                submitBtn.innerText = 'SEND MESSAGE';
                submitBtn.disabled = false;
            }
        });
    }
}

//  الرتوش النهائية (Sliders, Reveal, Auth)


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

function initScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.service-card, .specialist-card, .product-card, .reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        elementsToReveal.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active'); 
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 
}

function initUserAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navProfile = document.getElementById('navProfile'); 
    const navUserName = document.getElementById('navUserName');
    const clientDropdown = document.getElementById('clientDropdown');
    const clientLogoutBtn = document.getElementById('clientLogoutBtn');

    if (currentUser) {
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (navProfile) navProfile.style.display = 'block';
        if (navUserName) navUserName.textContent = currentUser.name.split(' ')[0]; 
    }

    if (navProfile && clientDropdown) {
        navProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            clientDropdown.style.display = clientDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    document.addEventListener('click', () => { if (clientDropdown) clientDropdown.style.display = 'none'; });

    if (clientLogoutBtn) {
        clientLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.reload(); 
        });
    }
}

// حجوزات العملاء 
async function loadMyBookings() {
    const container = document.getElementById('myBookingsList');
    if (!container) return; // ا

    // هنجيب بيانات العميل اللي عامل Login
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) {
        container.innerHTML = '<p style="text-align:center; color: red;">Please log in to view your bookings.</p>';
        return;
    }

    try {
        const response = await fetch('../api/get_my_bookings.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
        });
        
        const result = await response.json();

        if (result.success && result.bookings.length > 0) {
            container.innerHTML = ''; 
            result.bookings.forEach(b => {
                
                let statusColor = b.status === 'Confirmed' ? '#28a745' : (b.status === 'Rejected' ? '#dc3545' : '#ffc107');
                
                container.innerHTML += `
                    <div style="border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                        <h3 style="color: var(--primary-pink); margin-bottom: 10px;">${b.service}</h3>
                        <p style="margin-bottom: 5px;"><strong>Doctor:</strong> ${b.doctor}</p>
                        <p style="margin-bottom: 5px;"><strong>Date & Time:</strong> ${b.date} at ${b.time}</p>
                        <p style="margin-bottom: 0; font-size: 16px;">
                            <strong>Status:</strong> 
                            <span style="color: ${statusColor}; font-weight: bold; background: #f9f9f9; padding: 4px 10px; border-radius: 20px;">${b.status}</span>
                        </p>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p style="text-align:center;">You have no bookings yet. <a href="booking.html" style="color: var(--primary-pink); font-weight: bold;">Book now!</a></p>';
        }
    } catch (error) {
        console.error("Error loading my bookings:", error);
        container.innerHTML = '<p style="text-align:center; color: red;">Error connecting to server.</p>';
    }
}
// الاوردرات
async function loadMyOrders() {
    const container = document.getElementById('userOrdersBody');
    if (!container) return; 

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    try {
        const response = await fetch('../api/get_orders.php');
        const allOrders = await response.json();

        const myOrders = allOrders.filter(order => order.phone === currentUser.phone);

        if (myOrders.length > 0) {
            container.innerHTML = ''; 
            myOrders.forEach(order => {
                let statusClass = order.status === 'Delivered' ? 'status-confirmed' : (order.status === 'Cancelled' ? 'status-rejected' : 'status-pending');
                const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString() : 'New';
                
                container.innerHTML += `
                    <tr>
                        <td><strong>#${order.id || Math.floor(Math.random() * 1000)}</strong></td>
                        <td><i class="far fa-calendar-alt" style="color:#888; margin-right:5px;"></i> ${orderDate}</td>
                        <td style="color: var(--primary-pink); font-weight: bold;">$${order.totalAmount}</td>
                        <td><span class="status-badge ${statusClass}">${order.status || 'Processing'}</span></td>
                    </tr>
                `;
            });
        } else {
            container.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #888;"><i class="fas fa-shopping-bag" style="font-size: 35px; color: #ddd; margin-bottom: 15px;"></i><br>You have no product orders yet. <br><br><a href="products.html" class="btn-card-solid" style="padding: 10px 20px; font-size: 14px; text-decoration: none;">Shop Now!</a></td></tr>';
        }
    } catch (error) {
        console.error("Error loading orders:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderServices();// السيرفيس 
    renderSpecialists(); // الدكاترة
    renderDoctorProfile(); // بروفايل الدكتور
    initGallerySliders(); // سلايدر الصور
    handleContactForm();// فورم التواصل
    handleBookingForm(); //  فورم الحجز
    populateDoctorsDropdown(); //  ملء قائمة الدكاترة
    populateServicesDropdown(); //  ملء قائمة الخدمات الجديدة!
    initScrollReveal(); // تأثيرات الظهور
    initUserAuth(); // نظام تسجيل الدخول والخروج
    loadMyOrders(); // اوردرات البروفايل 
    loadMyBookings(); // حجوزات البروفايل
    
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.close-btn');
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    }
});