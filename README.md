# ChatFTMM Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Ini adalah antarmuka pengguna (UI) untuk aplikasi **Chatbot FTMM**. Proyek ini dibangun menggunakan React, Vite, dan Tailwind CSS, serta menampilkan model 3D interaktif sebagai avatar visual untuk chatbot.

## 🎨 Tampilan Aplikasi

*(Anda bisa menambahkan screenshot aplikasi Anda di sini nanti)*
`![Tampilan Aplikasi](link-ke-gambar-screenshot.png)`

---

## 🚀 Fitur

-   **Antarmuka Chat Responsif**: Tampilan yang dapat beradaptasi untuk perangkat desktop maupun mobile.
-   **Tampilan 3D Interaktif**: Menampilkan avatar 3D yang dibuat dengan Blender, dirender menggunakan React Three Fiber.
-   **Manajemen State**: Mengelola riwayat percakapan dan state aplikasi secara efisien.
-   **Komunikasi Real-time**: Terhubung dengan [ChatFTMM Backend API](https://github.com/arknsa/chatftmm-be) untuk mendapatkan respons dari AI.
-   **Desain Modern**: Dibuat dengan Vite untuk proses development yang cepat dan Tailwind CSS untuk styling.

---

## 🛠️ Teknologi yang Digunakan

-   **Framework**: React 18
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Rendering 3D**: React Three Fiber, Drei
-   **Ikon**: Lucide React

---

## ⚙️ Instalasi dan Pengaturan Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

### 1. Prasyarat

-   Node.js (versi 18 atau lebih baru)
-   npm atau yarn
-   Git

### 2. Kloning Repositori

```
git clone https://github.com/arknsa/chatftmm-fe.git
cd chatftmm-fe
```

### 3. Instal Dependensi
```
npm install
```

### 4. Menjalankan Server Backend
Aplikasi frontend ini memerlukan backend untuk dapat berfungsi. Pastikan Anda sudah menjalankan ChatFTMM Backend API di http://127.0.0.1:8000.

### 5. Jalankan Server Development Frontend
```
npm run dev
```
Aplikasi sekarang akan berjalan dan dapat diakses di http://localhost:5173 (atau port lain yang tersedia).