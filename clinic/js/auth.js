document.addEventListener('DOMContentLoaded', () => {

    // Register
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

            
            if (password !== confirmPassword) {
                alert("❌ Passwords do not match! Please try again.");
                return; 
            }

            try {
                const response = await fetch('../api/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("🎉 Account created successfully! Please login.");
                    window.location.href = "login.html"; 
                } else {
                    alert(`❌ Error: ${data.error}`);
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
                alert("Cannot connect to the server. Is XAMPP running? 🏃‍♂️");
            }
        });
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // تجميع البيانات من الفورم
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('../api/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    
                    if(data.user.role === 'admin'){
                        localStorage.setItem('isAdminLoggedIn', 'true');
                    }

                    alert(`Welcome back, ${data.user.name}! ✨`);

                    if (data.user.role === 'admin') {
                        window.location.href = "admin/dashboard.html"; 
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    alert(`❌ ${data.error || "Incorrect Email or Password!"}`);
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
                alert("Cannot connect to the server. Is XAMPP running? 🏃‍♂️");
            }
        });
    }
});