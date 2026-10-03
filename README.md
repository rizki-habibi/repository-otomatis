# Repository Otomatis

Repository Factory untuk membuat **repository GitHub baru sekaligus isi awal project dan halaman-halamannya**.

## Contoh yang kamu inginkan

Kalau instruksinya:

```text
Buat repo agend-data.
Template web.
Halaman: Beranda, Tentang, Data, Kontak.
```

Factory akan membuat:

- repository `agend-data`
- `index.html` sebagai Beranda
- `pages/tentang.html`
- `pages/data.html`
- `pages/kontak.html`
- `assets/style.css`
- `README.md`

## CLI

```bash
npm run create -- agend-data "Aplikasi Agend Data" --template web --pages Beranda,Tentang,Data,Kontak
```

Template yang tersedia: `web`, `node`, `api`.

## API

Jalankan:

```bash
npm start
```

Lalu kirim `POST /api/repositories` dengan JSON:

```json
{
  "name": "agend-data",
  "description": "Aplikasi Agend Data",
  "template": "web",
  "visibility": "public",
  "pages": ["Beranda", "Tentang", "Data", "Kontak"]
}
```

## Integrasi dengan ChatGPT

Factory ini sudah memiliki mesin CLI dan API. Namun membuat kode di GitHub **tidak otomatis menciptakan tool baru di ChatGPT**. Agar saya dapat memanggilnya langsung dari percakapan untuk membuat repository baru, factory API perlu dideploy dan dihubungkan melalui konektor/tool yang dapat melakukan HTTP request.

Jangan pernah memasukkan `GITHUB_TOKEN` ke source code atau commit.