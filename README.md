# beauty-clinic-website

# 🌸 The Beauty Clinic - Full-Stack Management System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

A comprehensive, responsive, and dynamic full-stack web application designed for a premium beauty clinic. This system seamlessly integrates a client-facing frontend with a powerful, asynchronous Admin Dashboard for managing bookings, services, specialists, and an integrated e-commerce store.

## ✨ Key Features

### 👩‍💻 Client-Side (Frontend)
* **Modern UI/UX:** Responsive design with a premium aesthetic, utilizing custom CSS variables and CSS Grid/Flexbox.
* **Dynamic Content:** Browse real-time clinic services, specialist profiles, and store products fetched directly from the database.
* **Online Booking System:** Easy-to-use appointment booking form.
* **E-commerce Integration:** Browse clinic products and submit orders.

### 🛡️ Admin Dashboard (Backend & Management)
* **Asynchronous Operations (AJAX):** Powered by the JavaScript `Fetch API` for smooth, page-reload-free data manipulation.
* **Advanced Data Filtering:** Client-side dynamic filtering for bookings (by Doctor, Service, Status, Date, and Search queries).
* **Booking Management:** Approve or reject appointments instantly with database sync.
* **Inventory & Store Management:** Add, delete, and update product stock status. Includes secure image uploading and file handling.
* **Specialist & Service Management:** Dynamically add or remove clinic doctors and services.
* **Inbox System:** Read and manage client messages securely.

## 🏗️ Project Architecture & Separation of Concerns

The project follows a strict **Separation of Concerns** architecture to ensure scalability and maintainability:

```text
📦 The Beauty Clinic
 ┣ 📂 admin               # Admin Panel HTML views (Isolated from client views)
 ┣ 📂 api                 # Backend PHP RESTful APIs (Database interactions)
 ┣ 📂 css                 # Stylesheets (UI, Admin, Responsive)
 ┣ 📂 js                  # Client & Admin JavaScript files
 ┣ 📂 images              # Uploaded assets (Products, Specialists, UI Graphics)
 ┣ 📜 index.html          # Client Landing Page
 ┣ 📜 services.html       # Client Services Page
 ┗ 📜 ...                 # Other client-facing pages
