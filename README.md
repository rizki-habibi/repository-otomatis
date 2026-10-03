# Repository Otomatis

GitHub Repository Factory untuk membuat repository baru secara otomatis.

## Tujuan

Repository ini menjadi fondasi **pembuatan repository otomatis**. Setelah token GitHub tersedia, perintah ini dapat membuat repository baru tanpa harus membuatnya satu per satu melalui halaman GitHub.

## Cara pakai

### 1. Siapkan token

Buat GitHub Personal Access Token dengan izin yang diperlukan untuk membuat repository, lalu simpan sebagai environment variable:

```bash
GITHUB_TOKEN=...
GITHUB_OWNER=rizki-habibi
```

Jangan commit token ke repository.

### 2. Jalankan

```bash
npm run create -- nama-repository "Deskripsi repository"
```

Contoh:

```bash
npm run create -- proyek-baru "Repository proyek baru"
```

Hasilnya akan menampilkan URL repository yang baru dibuat.

## Arsitektur

```
Input nama repo
      |
      v
Repository Factory
      |
      v
GitHub REST API
      |
      v
Repository baru
      |
      v
URL + informasi repository
```

## Pengembangan berikutnya

Fondasi ini sengaja dibuat sederhana agar dapat dikembangkan menjadi:

- template repository otomatis
- pembuatan struktur folder awal
- pembuatan README otomatis
- pembuatan GitHub Actions
- konfigurasi deployment
- pembuatan branch
- commit file awal
- validasi nama repository
- mode private/public
- preset Laravel, React, Node.js, Python, Flutter, dan lainnya
- API/webhook untuk menerima instruksi pembuatan repository

## Keamanan

Gunakan token dengan hak akses seminimal mungkin. Jangan memasukkan token ke source code, README, log, atau commit.

## Catatan untuk integrasi ChatGPT

Repository ini menyediakan mesin pembuatan repository melalui GitHub API. Namun konektor GitHub di ChatGPT tetap mengikuti kemampuan tool yang tersedia; repository ini tidak otomatis menambahkan tool baru ke ChatGPT. Untuk otomasi penuh dari percakapan, diperlukan koneksi/tool yang dapat memanggil factory ini secara aman.
