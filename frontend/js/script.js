document.addEventListener('DOMContentLoaded', () => {
    // تعريف العناصر
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.close-btn');
    const viewBtns = document.querySelectorAll('.btn-view-details');

    // عناصر النصوص جوه الـ Modal اللي هنغيرها
    const modalTitle = document.getElementById('modalTitle');
    const modalDuration = document.getElementById('modalDuration');
    const modalDesc = document.getElementById('modalDesc');

    // 1. فتح الـ Modal لما ندوس على VIEW DETAILS
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // عشان يمنع الصفحة من إنها تعمل ريفريش

            // سحب البيانات من الزرار
            const title = btn.getAttribute('data-title');
            const duration = btn.getAttribute('data-duration');
            const desc = btn.getAttribute('data-desc');

            // وضع البيانات في الـ Modal
            modalTitle.textContent = title;
            modalDuration.textContent = 'Duration: ' + duration;
            modalDesc.textContent = desc;

            // إظهار النافذة
            modal.classList.add('active');
        });
    });

    // 2. قفل الـ Modal لما ندوس على علامة (X)
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 3. قفل الـ Modal لو العميل داس في أي مكان فاضي بره النافذة
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});