# Automation Bot - Pengisian Otomatis Instrumen HDAP

Folder ini berisi skrip otomatisasi untuk mengisi data instrumen platform HDAP (Hybrid-Diagnostic Assessment Platform) untuk keperluan pengujian fungsionalitas dan pemuatan simulasi dataset.

Skrip ini secara cerdas mensimulasikan respons responden dengan struktur kovarians teoretis model **CB-SEM MADEL5C** (C1 -> C2 & C3 -> C4 -> C5). Hal ini memastikan bahwa data yang masuk ke database memiliki korelasi teoretis yang kuat dan valid secara statistik ketika dianalisis melalui mesin psikometri R/Python.

---

## Fitur Utama

- **Zero-Dependency (untuk Node.js)**: Skrip JavaScript dapat dijalankan langsung menggunakan Node.js bawaan tanpa memerlukan instalasi modul pihak ketiga.
- **Simulasi Kovarians Terstruktur**: Menggunakan transformasi *Box-Muller* untuk menghasilkan sebaran data berdistribusi normal dengan matriks kovarians antar dimensi yang realistis sesuai model hipotesis.
- **Pengisian Lengkap**: Setiap responden yang dibuat akan otomatis menyelesaikan pendaftaran identitas, tes awal PDI-DL, tes utama MADEL5C (SJT), dan survey kepuasan sistem (SUS) beserta masukan kualitatif.

---

## Persyaratan Sistem

Pilihlah salah satu dari runtime berikut yang telah terinstal di komputer Anda:
1. **Node.js** (Node.js 18 ke atas disarankan)
2. **Python 3** (memerlukan pustaka `requests`)

---

## Petunjuk Penggunaan

### Opsi A: Menggunakan Node.js (Paling Mudah, Tanpa Install Library tambahan)

Jalankan perintah berikut di terminal Anda:

```bash
# Format: node bot_http_populate.js [url_website] [jumlah_responden]
node bot_http_populate.js http://localhost:3000 100
```

- Parameter pertama (`http://localhost:3000`) adalah URL dasar aplikasi platform web Anda. Bapak bisa menggantinya dengan IP/Domain VPS jika ingin mendeploy langsung ke server produksi (misal: `https://domain-bapak.com`).
- Parameter kedua (`100`) adalah jumlah responden/peserta simulasi yang ingin dibuat.

---

### Opsi B: Menggunakan Python 3

1. **Instal pustaka yang dibutuhkan:**
   ```bash
   pip install requests
   ```
2. **Jalankan skrip:**
   ```bash
   # Format: python bot_http_populate.py [url_website] [jumlah_responden]
   python bot_http_populate.py http://localhost:3000 100
   ```

---

## Logika Simulasi Data

Jawaban yang dihasilkan oleh bot ini tidak bersifat acak murni (random noise), melainkan dibangun menggunakan formula berikut:
- **C1 (Context)** -> Baseline acak normal.
- **C2 (Communication)** -> Dipengaruhi C1 sebesar $0.65$.
- **C3 (Collaboration)** -> Dipengaruhi C1 sebesar $0.58$.
- **C4 (Creation)** -> Dipengaruhi C2 ($0.42$) & C3 ($0.48$).
- **C5 (Critical Thinking)** -> Dipengaruhi C4 ($0.72$) & C1 ($0.35$).

Setiap skor dimensi kemudian disebarkan ke masing-masing butir instrumen terkait dengan tambahan variansi kesalahan acak (*error variance*) minimal $\pm 0.5$. Hasilnya adalah dataset tiruan yang bersih, valid, dan sangat cocok untuk memvalidasi performa visualisasi diagram lintasan CB-SEM di Panel Admin.
