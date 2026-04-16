// js/manage-users.js

async function fetchUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    try {
        const response = await fetch('http://localhost:3000/api/users');
        const users = await response.json();

        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No users registered yet.</td></tr>';
            return;
        }

        users.forEach(user => {
            // كلاسات الألوان حسب حالة اليوزر
            const roleBadge = user.role === 'admin' 
                ? '<span style="background-color:#28a745; color:white; padding:5px 10px; border-radius:15px; font-size:12px; font-weight:bold;">Admin 👑</span>' 
                : '<span style="background-color:#6c757d; color:white; padding:5px 10px; border-radius:15px; font-size:12px;">Client 👤</span>';
            
            // تصميم زرار الترقية أو سحب الصلاحية
            const actionBtn = user.role === 'admin' 
                ? `<button onclick="updateRole('${user._id}', 'client')" style="background:#dc3545; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Demote to Client</button>`
                : `<button onclick="updateRole('${user._id}', 'admin')" style="background:var(--primary-pink); color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Make Admin</button>`;

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
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Failed to connect to server.</td></tr>';
    }
}

// دالة تغيير الصلاحية
async function updateRole(userId, newRole) {
    const confirmMessage = newRole === 'admin' 
        ? "Are you sure you want to give this user Admin privileges? 👑" 
        : "Are you sure you want to remove Admin privileges from this user? 🚫";

    if(confirm(confirmMessage)) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                // عمل ريفريش للجدول بعد التعديل
                fetchUsers(); 
            } else {
                alert("❌ Failed to update role. Please try again.");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Error connecting to server.");
        }
    }
}

// تشغيل الجدول أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', fetchUsers);