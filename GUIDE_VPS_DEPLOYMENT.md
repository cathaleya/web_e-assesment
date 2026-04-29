# Panduan Teknis Deployment Platform HDAP di VPS (Ubuntu 22.04/24.04)

Dokumen ini menjelaskan langkah-langkah sistematis untuk mendeploy aplikasi **Hybrid-Diagnostic Assessment Platform (HDAP)** ke server VPS Bapak menggunakan domain yang sudah ada.

## 1. Konfigurasi DNS (Domain Name System)
Sebelum masuk ke server, Bapak perlu mengarahkan domain ke IP VPS:
1. Login ke akun tempat Bapak membeli domain (misal: Rumahweb, Niagahoster, atau Cloudflare).
2. Cari menu **DNS Management**.
3. Tambahkan **A Record**:
   - **Type:** `A`
   - **Name:** `@` (untuk domain utama) atau `app` (untuk subdomain seperti app.domain.com)
   - **Value:** `IP_ADDRESS_VPS_BAPAK`
   - **TTL:** `Auto/3600`
4. Tambahkan **CNAME Record** (Opsional):
   - **Name:** `www`
   - **Target:** `@`

---

## 2. Persiapan Awal di VPS
Masuk ke VPS melalui SSH (Gunakan Terminal atau PowerShell):
```bash
ssh root@IP_ADDRESS_VPS_BAPAK
```

### Update Sistem
```bash
sudo apt update && sudo apt upgrade -y
```

---

## 3. Instalasi Stack Teknologi

### A. Install Node.js (v20.x atau terbaru)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
# Verifikasi
node -v && npm -v
```

### B. Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### C. Install Nginx (Web Server)
```bash

sudo apt install nginx -y
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw enable
```

---

## 4. Konfigurasi Database (PostgreSQL)
Lakukan pengaturan database untuk project HDAP:
```bash
sudo -i -u postgres
psql
```
Di dalam console PostgreSQL (`postgres=#`):
```sql
CREATE DATABASE bima_hdap_db;
CREATE USER bima_user WITH PASSWORD 'Password_Kuat_Bapak_Di_Sini';
GRANT ALL PRIVILEGES ON DATABASE bima_hdap_db TO bima_user;
\q
exit
```

---

## 5. Deployment Aplikasi

### A. Clone Repository
```bash
cd /var/www
# Pastikan git sudah terinstall, jika belum: sudo apt install git
sudo git clone https://github.com/USERNAME/hdap-core-v1.git
cd web_e-assesment
```

### B. Konfigurasi Environment (.env)
Buat file `.env` di server (Jangan push file ini ke GitHub):
```bash
sudo nano .env
```
Isi dengan data server (sesuaikan dengan langkah 4):
```env
DATABASE_URL="postgresql://bima_user:Password_Kuat_Bapak_Di_Sini@localhost:5432/bima_hdap_db?schema=public"
GEMINI_API_KEY="AIzaSyA_KUNCI_API_BAPAK"
NEXTAUTH_SECRET="buat_string_acak_panjang_di_sini"
NEXTAUTH_URL="https://domain-bapak.com"
```
*Tekan `Ctrl+O`, `Enter`, lalu `Ctrl+X` untuk simpan.*

### C. Install & Build
```bash
sudo npm install
# Jalankan migrasi database prisma
npx prisma generate
npx prisma db push

# Build project Next.js
sudo npm run build
```

---

## 6. Manajemen Proses dengan PM2
Agar aplikasi tetap jalan meskipun terminal ditutup:
```bash
sudo npm install -g pm2
pm2 start npm --name "hdap-app" -- start
# Pastikan auto-restart saat server reboot
pm2 save
pm2 startup
```

---

## 7. Konfigurasi Nginx & SSL

### A. Setup Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/hdap
```
Isi dengan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name domain-bapak.com www.domain-bapak.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Aktifkan config:
```bash
sudo ln -s /etc/nginx/sites-available/hdap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### B. Install SSL (HTTPS) dengan Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d domain-bapak.com -d www.domain-bapak.com
# Pilih opsi 2 untuk "Redirect" agar semua akses otomatis ke HTTPS.
```

---

## 8. Verifikasi Akhir
Buka domain Bapak di browser. Seharusnya platform HDAP sudah tampil dengan gembok hijau (HTTPS) dan terkoneksi ke database serta AI Gemini.

> [!IMPORTANT]
> **Backup Berkala:** Selalu lakukan backup database PostgreSQL Bapak secara rutin menggunakan perintah `pg_dump`.

jika lakukan update jangan lupa selalu lakukan ini di vps


cd /var/www/web_e-assesment
git pull origin main
npm install
npm run build
pm2 restart hdap-app

---
*Dokumen ini merupakan bagian dari panduan implementasi teknologi Riset BIMA S3.*
