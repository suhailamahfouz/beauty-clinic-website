// ==========================================
// نظام دخول لوحة التحكم (Admin Auth)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;

            // بيانات الأدمن الثابتة (في الواقع بتكون متسجلة في سيرفر آمن)
            const adminEmail = "admin@thebeautyclinic.com";
            const adminPass = "admin123";

            if (email === adminEmail && password === adminPass) {
                // حفظ حالة الدخول عشان لو عمل ريفريش ميرجعوش للوجين
                localStorage.setItem('isAdminLoggedIn', 'true');
                
                alert("Welcome back, Admin! 👑");
                // توجيهه لفولدر الأدمن
                window.location.href = "admin/dashboard.html"; 
            } else {
                alert("❌ Incorrect Email or Password. Access Denied!");
            }
        });
    }
});