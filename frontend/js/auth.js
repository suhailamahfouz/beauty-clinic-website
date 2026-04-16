// ==========================================
// نظام تسجيل الدخول وإنشاء الحساب (Authentication)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. نظام إنشاء حساب جديد (Register)
    // ==========================================
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // تجميع البيانات من الفورم
            const name = document.getElementById('registerName').value;
            const phone = document.getElementById('registerPhone').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            // التأكد إن الباسوردين زي بعض
            if (password !== confirmPassword) {
                alert("❌ Passwords do not match! Please try again.");
                return; // يوقف الكود وميبعتش حاجة للسيرفر
            }

            try {
                // إرسال البيانات للسيرفر (Node.js)
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("🎉 Account created successfully! Please login.");
                    window.location.href = "login.html"; // يحوله لصفحة اللوجين
                } else {
                    alert(`❌ Error: ${data.error}`);
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
                alert("Cannot connect to the server. Is Node.js running? 🏃‍♂️");
            }
        });
    }

    // ==========================================
    // 2. نظام تسجيل الدخول (Login)
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // تجميع البيانات من الفورم
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // إرسال البيانات للسيرفر للتأكد منها
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // حفظ بيانات اليوزر في المتصفح عشان نعرف إنه عمل لوجين
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    
                    // لو كان أدمن قديم متسجل بالطريقة القديمة، نحفظ دي برضه عشان الداشبورد تفتح معاه مؤقتاً
                    if(data.user.role === 'admin'){
                        localStorage.setItem('isAdminLoggedIn', 'true');
                    }

                    alert(`Welcome back, ${data.user.name}! ✨`);

                    // التوجيه الذكي (Routing) بناءً على نوع الحساب
                    if (data.user.role === 'admin') {
                        window.location.href = "admin/dashboard.html"; // الأدمن يروح للداشبورد
                    } else {
                        window.location.href = "index.html"; // العميل يرجع للموقع العادي
                    }
                } else {
                    alert(`❌ Incorrect Email or Password!`);
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
                alert("Cannot connect to the server. Is Node.js running? 🏃‍♂️");
            }
        });
    }
});