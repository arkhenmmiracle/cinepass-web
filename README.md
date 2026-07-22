# CinePass Web

CinePass adalah prototipe website pemesanan tiket bioskop yang menyatukan pencarian film dan bioskop dari jaringan **Cinema XXI** serta **CGV** dalam satu antarmuka. Proyek dibangun dengan React, TypeScript, Next.js/Vinext, dan Node.js.

> Status proyek: prototipe UI interaktif. Film, harga, jadwal, ketersediaan kursi, akun, dan transaksi masih menggunakan data demonstrasi di sisi browser. Belum ada backend produksi, database pengguna, API XXI/CGV, payment gateway, atau video trailer asli.

## URL aplikasi

- Produksi/review: <https://cinepass-web.arkhenm14.chatgpt.site>
- Landing page: `/`
- Film: `/film`
- Bioskop: `/bioskop`
- Login: `/login`
- Registrasi: `/register`
- Profil: `/profile`

## Teknologi utama

- Node.js `>=22.13.0`
- React 19
- TypeScript
- Next.js 16 API melalui Vinext
- Vite
- Tailwind CSS 4 (diimpor dari stylesheet global)
- Cloudflare Worker untuk hasil build dan deployment
- ESLint dan Node Test Runner

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan terminal.

Pemeriksaan sebelum commit atau deployment:

```bash
npm run lint
npm test
npm run validate:artifact
```

Build produksi saja:

```bash
npm run build
```

## Struktur utama proyek

```text
app/
├── page.tsx                 Landing page
├── film/page.tsx            Alur yang dimulai dari pilihan film
├── bioskop/page.tsx         Alur yang dimulai dari pilihan bioskop
├── login/page.tsx           Route login
├── register/page.tsx        Route registrasi
├── profile/page.tsx         Profil member dan logout
├── auth-form.tsx            Form bersama untuk login dan registrasi
├── booking-ui.tsx           Popup autentikasi, kursi, checkout, review
├── globals.css              Seluruh style global dan responsif
└── layout.tsx               Root layout, font, metadata, favicon

public/images/               Hero dan poster film
tests/rendered-html.test.mjs  Smoke test hasil build
scripts/                     Instalasi, build, dan validasi artifact
worker/index.ts              Entry point Cloudflare Worker
db/                          Scaffold database; belum dipakai UI prototipe
```

Paket ZIP sengaja tidak menyertakan `node_modules`, hasil build, cache runtime,
metadata deployment ChatGPT Sites, riwayat Git internal, contoh bawaan, dan aset
starter yang tidak dipakai. Jalankan `npm install` atau `npm ci` setelah ekstraksi.

## Peta halaman dan fungsi

| Route | File | Fungsi |
|---|---|---|
| `/` | `app/page.tsx` | Landing page, hero slideshow, pencarian, daftar film, pilihan XXI/CGV, promo, tipe pengalaman nonton, dan CinePass Club. |
| `/film` | `app/film/page.tsx` | Memilih film terlebih dahulu, membaca sinopsis/trailer, lalu memilih jaringan, wilayah, teater, studio, dan jam tayang. |
| `/bioskop` | `app/bioskop/page.tsx` | Memilih XXI/CGV terlebih dahulu, lalu wilayah, teater, film yang tersedia, hari, dan jam tayang. |
| `/login` | `app/login/page.tsx` | Menampilkan `AuthForm` dalam mode login. |
| `/register` | `app/register/page.tsx` | Menampilkan `AuthForm` dalam mode registrasi. |
| `/profile` | `app/profile/page.tsx` | Menampilkan identitas member, statistik demo, booking tersimpan, informasi akun, dan logout. |

### 1. Landing page — `app/page.tsx`

Fungsi utama:

- `heroSlides`: data banner film unggulan.
- Slideshow bergerak otomatis setiap 5 detik dan melakukan loop.
- Slideshow berhenti sementara saat kursor berada di hero.
- Titik indikator dapat digunakan untuk memilih slide.
- Ukuran judul hero menyesuaikan panjang judul melalui kelas `hero-title-short`, `hero-title-medium`, dan `hero-title-long`.
- `movies`: data kartu film yang membuka `/film?film=<slug>`.
- Menu ikon **Film** membuka `/film`.
- Menu ikon **Bioskop** membuka `/bioskop`.
- Tombol pada kartu XXI membuka `/bioskop?cinema=XXI`.
- Tombol pada kartu CGV membuka `/bioskop?cinema=CGV`.
- Tombol **Masuk** membuka `/login?redirect=%2F`.
- Tombol **Daftar** membuka `/register?redirect=%2F`.
- Jika sesi ditemukan, tombol Masuk/Daftar berubah menjadi link profil.
- `runSearch()` memfilter film dan menggulir halaman ke bagian film.

### 2. Halaman Film — `app/film/page.tsx`

Alur pengguna:

1. Film dipilih dari landing page atau daftar film horizontal.
2. Sinopsis, poster, metadata, dan tombol trailer langsung terlihat tanpa harus memilih lokasi.
3. Bagian **Tayang di mana?** digunakan untuk memilih XXI/CGV, wilayah, dan teater.
4. Setelah teater dipilih, nomor studio dan jam 10.00–22.00 ditampilkan.
5. Memilih jam menyimpan booking sementara.
6. Pengguna yang belum login melihat popup autentikasi.
7. Setelah login, pilihan film, bioskop, wilayah, teater, studio, dan jam dipulihkan.
8. Komponen pemilihan kursi muncul.

Fungsi penting:

- `chooseFilm(slug)`: mengganti film dan mereset pilihan lokasi lama.
- `chooseShowtime(time)`: menyimpan jam dan data booking ke `localStorage`, lalu membuka popup login jika dibutuhkan.
- `startBooking()`: memvalidasi lokasi, jam, dan status login sebelum melanjutkan.
- `cinemaData`: daftar wilayah dan teater demo untuk XXI/CGV.
- `showtimes`: jadwal demo dari 10.00 sampai 22.00.

### 3. Halaman Bioskop — `app/bioskop/page.tsx`

Alur pengguna:

1. Pilih jaringan XXI atau CGV.
2. Pilih wilayah.
3. Pilih teater.
4. Lihat film yang tayang di teater tersebut.
5. Pilih film, hari, dan jam.
6. Jika belum login, tampilkan popup login/registrasi.
7. Setelah login, tampilkan pemilih kursi.
8. Lanjutkan ke ringkasan pembayaran dan review pesanan.

Parameter URL:

- `/bioskop?cinema=XXI` langsung mengaktifkan XXI.
- `/bioskop?cinema=CGV` langsung mengaktifkan CGV.
- Parameter URL memiliki prioritas atas pilihan booking lama agar klik dari landing page selalu benar.

Data utama:

- `locations`: pemetaan jaringan → wilayah → teater.
- `films`: film yang tersedia pada teater demo.
- `days`: pilihan tanggal demo.
- `times`: jam tayang 10.00–22.00.
- `chooseTime(value)`: menyimpan ringkasan booking dan memeriksa sesi login.

### 4. Autentikasi — `app/auth-form.tsx`

`AuthForm` dipakai oleh dua route:

- `app/login/page.tsx` memberikan `mode="login"`.
- `app/register/page.tsx` memberikan `mode="register"`.

Perilaku:

- Memvalidasi email dan password minimal 6 karakter.
- Registrasi juga memvalidasi nama dan konfirmasi password.
- Menyimpan user demo ke `localStorage` dengan key `cinepassUser`.
- Membaca query `redirect` untuk menentukan halaman tujuan setelah login.
- Login/registrasi dari landing page kembali ke `/`.
- Login yang dipicu booking kembali ke `/film` atau `/bioskop` sesuai asal.
- Link perpindahan Login ↔ Registrasi mempertahankan nilai `redirect`.

> Ini bukan autentikasi aman. Password tidak disimpan, tetapi sesi tetap hanya simulasi browser. Implementasi produksi wajib memakai backend, password hashing, secure cookie/session, CSRF protection, rate limiting, dan verifikasi email.

### 5. Komponen booking bersama — `app/booking-ui.tsx`

File ini memastikan alur Film dan Bioskop menggunakan pengalaman booking yang sama.

#### `AuthGate`

- Popup yang muncul ketika pengguna memilih jam tetapi belum login.
- Menampilkan film, bioskop, wilayah, teater, studio, hari, dan jam.
- Menyediakan link Login dan Registrasi dengan redirect yang benar.

#### `SeatBooking`

- Membuat peta kursi baris A–H, masing-masing 10 kursi.
- Kursi tersedia: gelap.
- Kursi pilihan pengguna: hijau.
- Kursi sudah dipesan: merah.
- Kursi tidak tersedia: abu-abu.
- Klik kursi hijau sekali lagi membatalkan pilihan.
- Kursi merah/abu-abu tidak dapat dipilih.
- Harga demo: Rp50.000 per kursi.
- Menghitung jumlah kursi dan total otomatis.
- Tombol **Lanjutkan ke Pembayaran** membuka review pemesanan.
- Review menampilkan film, lokasi, jadwal, studio, kursi, jumlah tiket, dan total.
- Tombol metode pembayaran masih berupa UI prototipe.

Type data bersama:

```ts
type BookingSummary = {
  film: string;
  filmSlug: string;
  cinema: string;
  region: string;
  theatre: string;
  studio: number;
  day?: string;
  time: string;
  image?: string;
};
```

### 6. Profil — `app/profile/page.tsx`

Fitur:

- Membaca data user dari `cinepassUser`.
- Menampilkan nama, email, status member, statistik, dan poin demo.
- Membaca `cinepassPendingBooking` untuk menampilkan booking terakhir.
- Link **Lanjutkan booking** mengembalikan user ke alur terkait.
- `logout()` menghapus `cinepassUser` dan kembali ke landing page.
- Booking sementara sengaja tidak dihapus saat logout agar pilihan pengguna dapat dipulihkan setelah login kembali.

### 7. Styling — `app/globals.css`

Seluruh styling saat ini berada dalam satu file global. Bagian utamanya diberi komentar:

- Landing page dan section umum.
- Looping hero slideshow.
- Safe content zone untuk judul hero.
- Film selection and booking flow.
- Authentication gate and pages.
- Cinema-first booking page.
- Shared seat selection and order review.
- Member profile.
- Media query tablet dan mobile.

Untuk pengembangan besar, disarankan memecah file ini menjadi CSS Module per halaman/komponen atau membangun design token dan component layer.

## Penyimpanan browser

Prototipe menggunakan `localStorage`:

| Key | Isi | Ditulis oleh | Dibaca oleh |
|---|---|---|---|
| `cinepassUser` | `{ name, email }` | `app/auth-form.tsx` | Landing, Film, Bioskop, Profil |
| `cinepassPendingBooking` | Film, jaringan, wilayah, teater, studio, hari, jam | Halaman Film/Bioskop | Film, Bioskop, Profil |

Catatan:

- Data hanya tersedia pada browser dan perangkat yang sama.
- Menghapus data browser akan menghapus sesi serta booking sementara.
- Jangan menyimpan password, token sensitif, atau data pembayaran di `localStorage`.

## Aset gambar

Semua aset produksi berada di `public/images/`:

- `hero-starbound.png`
- `poster-dewa-laut.png`
- `poster-neon-heart.png`
- `poster-bintang-jatuh.png`
- `poster-rumah.png`
- `poster-komando.png`
- `poster-osaka.png`

Gunakan path `/images/<nama-file>` dari komponen React. Pastikan aset baru sudah dioptimalkan sebelum dimasukkan.

## Pengujian

`tests/rendered-html.test.mjs` adalah smoke test yang:

- Memuat worker hasil build.
- Memastikan route root merespons HTTP 200.
- Memastikan metadata development preview tersedia.

Pengembangan berikutnya sebaiknya menambah:

- Unit test validasi booking.
- Component test untuk toggle kursi.
- Test redirect login/registrasi.
- Test restore booking dari penyimpanan.
- End-to-end test untuk alur Film dan Bioskop.
- Accessibility test keyboard, focus trap modal, dan screen reader.

## Batasan prototipe saat ini

- Data film, bioskop, wilayah, teater, studio, jadwal, harga, dan kursi masih hard-coded.
- Autentikasi hanya simulasi `localStorage`.
- Login Google masih tombol visual.
- Trailer masih modal placeholder.
- Kursi terisi/tidak tersedia bersifat statis.
- Review pembayaran belum menghubungi payment gateway.
- Belum ada halaman metode pembayaran, status transaksi, tiket QR, riwayat transaksi asli, refund, atau notifikasi.
- Pencarian dan filter belum menggunakan API/backend.
- Scaffold database di `db/` belum dihubungkan ke UI.
- Belum ada panel admin XXI, admin CGV, atau super admin pada implementasi web ini.

## Rekomendasi pengembangan produksi

Urutan implementasi yang disarankan:

1. Pindahkan data film/bioskop ke database dan API.
2. Buat autentikasi server-side dan role `customer`, `admin_xxi`, `admin_cgv`, `super_admin`.
3. Buat model jadwal yang menghubungkan film, teater, studio, tanggal, dan jam.
4. Buat inventory kursi real-time dengan mekanisme hold dan expiry.
5. Tambahkan transaksi atomik untuk mencegah kursi dipesan dua pengguna.
6. Integrasikan payment gateway dan webhook.
7. Buat tiket QR serta riwayat transaksi.
8. Buat panel admin terpisah sesuai jaringan.
9. Tambahkan observability, audit log, rate limiting, dan automated tests.

Model data minimum yang perlu disiapkan:

- `users`
- `cinema_brands`
- `regions`
- `theatres`
- `studios`
- `seats`
- `movies`
- `showtimes`
- `seat_holds`
- `bookings`
- `booking_items`
- `payments`
- `promotions`

## Panduan perubahan cepat

| Kebutuhan perubahan | File utama |
|---|---|
| Mengubah landing/hero/kartu film | `app/page.tsx` |
| Mengubah data dan alur film | `app/film/page.tsx` |
| Mengubah data dan alur bioskop | `app/bioskop/page.tsx` |
| Mengubah kursi, harga, review | `app/booking-ui.tsx` |
| Mengubah login/registrasi | `app/auth-form.tsx` |
| Mengubah profil/logout | `app/profile/page.tsx` |
| Mengubah desain/responsif | `app/globals.css` |
| Mengubah metadata/font/favicon | `app/layout.tsx` |
| Menambah/mengganti gambar | `public/images/` |
| Mengubah build/deployment | `scripts/`, `vite.config.ts`, `worker/index.ts` |

## Checklist sebelum menyerahkan perubahan

- Pastikan route yang diubah dapat dibuka.
- Uji desktop dan mobile.
- Uji alur dalam keadaan logout dan login.
- Uji redirect dari landing, Film, dan Bioskop.
- Pastikan booking tidak hilang setelah autentikasi.
- Uji kursi: tersedia, dipilih, terisi, dan tidak tersedia.
- Jalankan `npm run lint`.
- Jalankan `npm test`.
- Jalankan `npm run validate:artifact`.
- Perbarui README jika menambah route, penyimpanan, atau alur baru.

## Lisensi dan konten

Seluruh judul film, jadwal, harga, serta visual pada prototipe ini bersifat fiktif dan digunakan untuk kebutuhan desain/portofolio. Penggunaan merek XXI dan CGV pada prototipe tidak menyatakan afiliasi resmi.
