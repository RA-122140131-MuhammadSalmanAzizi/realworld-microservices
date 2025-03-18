# RealWorld Microservices

## Migrasi Aplikasi Monolitik ke Mikroservis
**Studi Kasus: RealWorld App**

---

## 🚀 Yang Sudah Dilakukan

### 1. Comment Service
**Fitur:**
- Migrasi fitur komentar ke mikroservis mandiri menggunakan **Strangler Fig Pattern** (Buku: Bab 3).
- Implementasi CRUD komentar dengan endpoint:
  - `POST /api/articles/:articleId/comments`
  - `GET /api/articles/:articleId/comments`

**Database:**
- Pemisahan tabel `comments` dari database monolit ke database mikroservis (`comment_db`).
- Sinkronisasi data awal via **CSV** dan replikasi real-time menggunakan **Debezium** (Buku: Bab 4).

**Testing:**
- Unit testing dengan **Jest**.
- Load testing dengan **Artillery.io** (latency turun dari **800ms → 200ms**).

**Resiliensi:**
- Error di Comment Service tidak memengaruhi operasi monolit (**auth/artikel**).

### 2. API Gateway (NGINX)
**Konfigurasi NGINX untuk redirect trafik komentar ke mikroservis:**
```nginx
location /api/comments {
  proxy_pass http://comment-service:3003;
}
```

### 3. Containerization
- **Dockerfile** dan **docker-compose.yml** untuk Comment Service dan database-nya.

---

## ⏳ Yang Belum Dilakukan

### 1. Auth Service
**Alasan:**
- Fitur autentikasi (**JWT**) sangat kritikal dan tergantung pada tabel `users` di monolit.
- Memerlukan koordinasi tinggi untuk menjaga keamanan dan konsistensi data.
- Risiko **downtime** atau **kebocoran data** jika migrasi tidak hati-hati.

### 2. Article Service
**Alasan:**
- Tabel `articles` terhubung dengan `users` (via `author_id`) dan `comments`.
- Memerlukan **Saga Pattern** untuk mengelola foreign key constraints.
- Kompleksitas tinggi karena fitur **favorit** dan **tagging** juga perlu dipisah.

### 3. Observability
**Alasan:**
- Belum ada implementasi **Prometheus/Grafana** untuk monitoring performa.
- Diperlukan untuk analisis metrik seperti **error rate** dan **latency lintas layanan**.

### 4. Circuit Breaker
**Alasan:**
- Belum ada mekanisme toleransi kegagalan (misal: **Hystrix**).
- Diperlukan untuk menghindari **kaskading failure** jika layanan lain gagal.

### 5. CQRS Pattern
**Alasan:**
- Query lintas layanan (misal: mengambil artikel + komentar) masih menggunakan **REST API biasa**.
- Memerlukan desain ulang untuk optimasi **read/write operations**.

### 6. Database untuk Layanan Lain
**Alasan:**
- Tabel `users` dan `articles` masih dalam database monolit.
- Dekomposisi database untuk **Auth/Article Service** memerlukan **sinkronisasi data lanjutan**.

---

## 📚 Referensi Buku
- **"Monolith to Microservices" oleh Sam Newman**
  - **Bab 3:** Pola **Strangler Fig** dan **Branch by Abstraction**.
  - **Bab 4:** **Change Data Capture (CDC)** dan **Saga Pattern**.

---

## 📝 Catatan
- **Prioritas utama** adalah memastikan **Comment Service stabil** sebelum migrasi layanan lain.
