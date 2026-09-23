# DESIGN.md — SaaS Katalog Menu Digital

## 1. Ringkasan Produk

Bangun aplikasi SaaS multi-tenant yang berfungsi seperti Linktree khusus bisnis kuliner. Setiap merchant dapat mendaftar, membuat profil bisnis, memilih subdomain, menambahkan menu dan link penting, lalu membagikan satu halaman publik kepada pelanggan.

Contoh alamat merchant:

```text
kopitemu.menuku.id
bakso99.menuku.id
hotelmelati.menuku.id
```

Pengunjung hanya melihat katalog dan membuka link yang disediakan merchant. Aplikasi tidak menangani pemesanan atau pembayaran.

### Tujuan utama

- Memudahkan merchant membuat katalog menu tanpa membuat website sendiri.
- Mengumpulkan menu, WhatsApp, Instagram, lokasi, katalog, dan link lain dalam satu halaman.
- Memberikan analytics sederhana mengenai kunjungan dan interaksi pengunjung.
- Memberikan link dan QR code yang mudah dibagikan.

### Di luar cakupan

- Cart dan checkout.
- Pemesanan makanan.
- Pembayaran.
- Kasir dan inventory.
- CRM pelanggan.
- Delivery tracking.
- Loyalty point.

---

## 2. Target Pengguna

### Merchant

- Restoran.
- Kedai kopi.
- Warung makan.
- Bakery.
- Food truck.
- Tenant food court.
- Home business.
- Hotel atau penginapan.

### Pengunjung

Pengunjung membuka halaman merchant melalui:

- QR code di meja.
- Link Instagram atau TikTok.
- WhatsApp.
- Google Business.
- Subdomain merchant.

Pengunjung tidak perlu membuat akun.

---

## 3. Alur Pengguna

### Alur merchant

1. Merchant mendaftar dan login.
2. Merchant membuat profil bisnis.
3. Merchant memilih subdomain unik.
4. Merchant mengunggah logo dan banner.
5. Merchant membuat kategori menu.
6. Merchant menambahkan produk.
7. Merchant menambahkan link seperti WhatsApp, Instagram, dan Google Maps.
8. Merchant memilih tema halaman.
9. Merchant mempublikasikan halaman.
10. Merchant membagikan link atau QR code.
11. Merchant melihat analytics dari dashboard.

### Alur pengunjung

1. Pengunjung membuka link merchant.
2. Pengunjung melihat profil bisnis dan status operasional.
3. Pengunjung melihat link penting merchant.
4. Pengunjung mencari atau memfilter menu.
5. Pengunjung membuka detail produk.
6. Pengunjung dapat membuka WhatsApp, Instagram, lokasi, atau link lainnya.

---

## 4. Tech Stack

### Application

- Next.js App Router.
- TypeScript.
- React Server Components.
- Server Actions.
- Next.js Route Handlers.

### UI

- Tailwind CSS v4.
- Shadcn UI.
- Lucide React.
- React Hook Form.
- Zod.
- Recharts untuk dashboard analytics.

### Database dan autentikasi

- PostgreSQL melalui Supabase.
- Supabase Auth.
- Drizzle ORM.
- PostgreSQL Row Level Security.

### Image hosting

- ImgBB API v1.
- Semua API key disimpan di environment variable server.
- Database hanya menyimpan URL dan metadata gambar.

### Deployment

- Vercel untuk aplikasi Next.js.
- Supabase untuk PostgreSQL dan authentication.
- ImgBB untuk gambar.
- Cloudflare untuk wildcard DNS dan custom domain pada tahap berikutnya.

### Analytics

- First-party event tracking.
- PostgreSQL untuk raw events pada MVP.
- Tabel agregasi harian untuk dashboard.
- Sistem dapat dipindahkan ke ClickHouse atau analytics service ketika volume sudah besar.

---

## 5. Arsitektur Multi-Tenant

Gunakan shared database dan shared schema. Jangan membuat database atau schema baru untuk setiap merchant.

Semua tabel milik merchant wajib mempunyai kolom:

```text
tenant_id
```

Semua query dashboard harus dibatasi menggunakan `tenant_id` pengguna yang sedang login. Terapkan Row Level Security agar merchant tidak dapat mengakses data tenant lain meskipun request dimanipulasi.

### Resolusi subdomain

Contoh request:

```text
kopitemu.menuku.id
```

Next.js Middleware membaca hostname dan melakukan internal rewrite menjadi:

```text
/store/kopitemu
```

Pada development gunakan:

```text
localhost:3000/store/kopitemu
```

### Aturan slug

- Lowercase.
- Minimal 3 karakter.
- Maksimal 30 karakter.
- Hanya huruf, angka, dan tanda hubung.
- Tidak diawali atau diakhiri tanda hubung.
- Harus unik.

Reserved slug:

```text
www
app
admin
api
dashboard
login
register
support
help
pricing
settings
```

Jika tenant tidak ditemukan, dinonaktifkan, atau belum dipublikasikan, tampilkan halaman toko tidak tersedia.

---

## 6. Authentication dan Role

### Authentication

- Register dengan email dan password.
- Login.
- Logout.
- Reset password.
- Google OAuth dapat ditambahkan setelah MVP.

### Role MVP

#### Owner

- Mengubah profil bisnis.
- Mengatur subdomain.
- Mengelola kategori, menu, link, dan tema.
- Melihat analytics.
- Mempublikasikan atau menonaktifkan halaman.

MVP belum memerlukan role staff, manager, atau cashier.

---

## 7. Onboarding Merchant

### Langkah 1 — Profil bisnis

- Nama bisnis.
- Jenis bisnis.
- Deskripsi singkat.
- Nomor WhatsApp opsional.

### Langkah 2 — Pilih alamat

- Input subdomain.
- Validasi ketersediaan secara real-time.
- Preview alamat halaman.

### Langkah 3 — Identitas visual

- Logo.
- Banner opsional.
- Warna utama.

### Langkah 4 — Tambahkan menu pertama

- Nama menu.
- Kategori.
- Harga.
- Gambar opsional.

### Langkah 5 — Publikasikan

Tampilkan:

- Link halaman merchant.
- Tombol salin link.
- Tombol preview.
- Download QR code.

---

## 8. Merchant Dashboard

Menu sidebar:

```text
Dashboard
Menu
Kategori
Links
Analytics
Tampilan
QR Code
Pengaturan
```

### Dashboard

Tampilkan:

- Total kunjungan hari ini.
- Pengunjung unik.
- Total klik link.
- Total menu dilihat.
- Menu paling populer.
- Link paling sering diklik.
- Link halaman merchant.
- Tombol salin link.
- Tombol buka halaman.
- Tombol download QR code.
- Status halaman aktif atau nonaktif.

Dashboard tidak menampilkan pendapatan atau penjualan karena aplikasi tidak menangani transaksi.

### Kategori

Merchant dapat:

- Menambahkan kategori.
- Mengubah kategori.
- Menghapus kategori.
- Mengaktifkan atau menonaktifkan kategori.
- Mengubah urutan kategori dengan drag and drop.

Contoh kategori:

- Makanan utama.
- Minuman.
- Snack.
- Dessert.
- Paket hemat.

### Menu

Merchant dapat:

- Menambahkan produk.
- Mengubah produk.
- Menghapus produk.
- Duplicate produk.
- Mengaktifkan atau menonaktifkan produk.
- Menandai produk habis.
- Menandai produk rekomendasi.
- Mengubah urutan produk.
- Mengunggah gambar ke ImgBB.

Data produk:

- Nama.
- Slug.
- Kategori.
- Deskripsi.
- Harga.
- Harga promo opsional.
- Gambar.
- Status rekomendasi.
- Status tersedia.
- Status aktif.
- Urutan tampilan.

MVP tidak memerlukan variasi, add-on, atau stok kuantitas.

### Links

Merchant dapat menambahkan link seperti Linktree:

- WhatsApp.
- Instagram.
- TikTok.
- Google Maps.
- Website.
- Marketplace.
- Reservasi eksternal.
- Katalog PDF eksternal.
- Link custom.

Data link:

- Judul.
- URL.
- Icon.
- Tipe link.
- Status aktif.
- Urutan.
- Jumlah klik.

Merchant dapat mengubah urutan link dengan drag and drop.

### Tampilan

Merchant dapat memilih:

- Tema.
- Warna utama.
- Warna background.
- Bentuk tombol.
- Layout produk grid atau list.
- Font.
- Menampilkan atau menyembunyikan harga.
- Menampilkan atau menyembunyikan alamat.
- Menampilkan atau menyembunyikan jam operasional.

Preset tema:

1. Clean.
2. Dark Cafe.
3. Colorful Food.

### Pengaturan

- Nama bisnis.
- Logo dan banner.
- Deskripsi.
- Subdomain.
- Nomor WhatsApp.
- Instagram.
- Alamat.
- Google Maps URL.
- Jam operasional.
- Status halaman.

---

## 9. Storefront Pengunjung

Storefront harus mobile-first dan dapat digunakan tanpa login.

### Struktur halaman

1. Banner.
2. Logo merchant.
3. Nama dan deskripsi bisnis.
4. Status buka atau tutup.
5. Alamat dan jam operasional.
6. Tombol/link utama merchant.
7. Menu rekomendasi.
8. Pencarian menu.
9. Navigasi kategori.
10. Daftar produk.
11. Footer merchant.

### Search

Placeholder:

```text
Cari menu...
```

Pencarian berdasarkan:

- Nama produk.
- Deskripsi.
- Nama kategori.

### Navigasi kategori

- Horizontal scroll pada mobile.
- Sticky ketika daftar menu di-scroll.
- Menampilkan kategori aktif.

### Product card

Tampilkan:

- Foto.
- Nama produk.
- Deskripsi singkat.
- Harga.
- Harga promo.
- Badge rekomendasi.
- Badge habis.

Produk habis tetap tampil, tetapi gambar dibuat lebih redup dan diberi label `Habis`.

### Product detail

Pada mobile gunakan bottom sheet. Pada desktop gunakan dialog atau halaman detail.

Tampilkan:

- Gambar besar.
- Nama produk.
- Deskripsi lengkap.
- Harga.
- Harga promo.
- Status tersedia.
- Tombol tanya melalui WhatsApp jika nomor tersedia.

Contoh pesan WhatsApp:

```text
Halo Kopi Temu, saya ingin bertanya tentang menu Kopi Susu Aren.
```

Tombol WhatsApp hanya membuka percakapan. Sistem tidak membuat pesanan.

---

## 10. Analytics Dashboard

Analytics mengukur interaksi pengunjung, bukan transaksi atau penjualan.

### Ringkasan

- Total page views.
- Unique visitors.
- Total product views.
- Total link clicks.
- WhatsApp clicks.
- Maps clicks.
- Perbandingan dengan periode sebelumnya.

### Grafik

- Kunjungan harian.
- Kunjungan mingguan.
- Jam paling ramai.
- Hari paling ramai.

### Performa menu

- Produk paling banyak dilihat.
- Kategori paling populer.
- Produk yang jarang dilihat.

### Performa link

- Klik WhatsApp.
- Klik Instagram.
- Klik Google Maps.
- Klik marketplace.
- Klik link custom.

### Sumber kunjungan

- Direct.
- Instagram.
- WhatsApp.
- TikTok.
- Facebook.
- Google.
- QR code.
- Referrer lain.

### Perangkat

- Mobile.
- Desktop.
- Tablet.
- Browser.

### Event yang dicatat

```ts
type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "category_click"
  | "link_click"
  | "whatsapp_click"
  | "instagram_click"
  | "maps_click"
  | "share_click";
```

Setiap event menyimpan:

```ts
type AnalyticsEventPayload = {
  tenantId: string;
  eventType: AnalyticsEvent;
  productId?: string;
  categoryId?: string;
  linkId?: string;
  sessionId: string;
  referrer?: string;
  deviceType?: string;
  browser?: string;
  createdAt: Date;
};
```

Gunakan anonymous session ID untuk unique visitor. Jangan menyimpan alamat IP mentah dalam jangka panjang.

Raw event dapat disimpan sementara. Buat agregasi harian agar dashboard tidak selalu menghitung seluruh event.

---

## 11. Integrasi ImgBB

Environment variable:

```env
IMGBB_API_KEY=
```

Endpoint:

```text
POST https://api.imgbb.com/1/upload
```

Jangan memanggil ImgBB langsung dari browser karena akan membocorkan API key.

### Alur upload

```text
Browser
→ Next.js Route Handler
→ ImgBB API
→ Simpan URL ke PostgreSQL
```

### Validasi file

- Format JPG, JPEG, PNG, atau WebP.
- Maksimal 5 MB pada aplikasi.
- Tolak file selain gambar.
- Gunakan rasio 1:1 atau 4:3 untuk produk.
- Compress gambar jika diperlukan.

### Data response yang digunakan

```ts
type ImgBBUploadResult = {
  id: string;
  url: string;
  displayUrl: string;
  thumbnailUrl?: string;
  deleteUrl?: string;
  width: number;
  height: number;
};
```

Simpan:

- Direct image URL.
- Thumbnail URL jika tersedia.
- ImgBB image ID.
- Delete URL jika memang diperlukan dan simpan dengan aman.

Jangan menyimpan file Base64 di database.

Jika upload gagal:

- Jangan menyimpan perubahan produk.
- Pertahankan input form.
- Tampilkan error yang jelas.
- Sediakan tombol coba lagi.

---

## 12. Database Schema

Gunakan UUID untuk primary key dan integer untuk harga dalam rupiah.

### profiles

```text
id
email
name
created_at
updated_at
```

### tenants

```text
id
owner_id
name
slug
description
business_type
logo_url
banner_url
whatsapp
instagram
address
maps_url
opening_hours
theme_id
primary_color
layout_type
is_published
is_active
created_at
updated_at
```

### categories

```text
id
tenant_id
name
slug
description
sort_order
is_active
created_at
updated_at
```

### products

```text
id
tenant_id
category_id
name
slug
description
price
discount_price
image_url
image_thumbnail_url
imgbb_image_id
is_featured
is_available
is_active
sort_order
created_at
updated_at
```

### custom_links

```text
id
tenant_id
title
url
icon
link_type
sort_order
is_active
created_at
updated_at
```

### themes

```text
id
name
code
config_json
created_at
```

### analytics_events

```text
id
tenant_id
event_type
product_id
category_id
link_id
session_id
referrer
device_type
browser
created_at
```

### analytics_daily

```text
id
tenant_id
event_date
page_views
unique_visitors
product_views
category_clicks
link_clicks
whatsapp_clicks
maps_clicks
created_at
updated_at
```

### Index penting

```text
tenants.slug unique
categories(tenant_id, slug) unique
categories(tenant_id, sort_order)
products(tenant_id, category_id)
products(tenant_id, is_active)
products(tenant_id, is_featured)
products(tenant_id, sort_order)
custom_links(tenant_id, sort_order)
analytics_events(tenant_id, created_at)
analytics_events(tenant_id, event_type, created_at)
analytics_events(tenant_id, product_id, created_at)
analytics_daily(tenant_id, event_date) unique
```

---

## 13. Struktur Folder

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── menu/
│   │       ├── categories/
│   │       ├── links/
│   │       ├── analytics/
│   │       ├── appearance/
│   │       ├── qr-code/
│   │       └── settings/
│   ├── store/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── product/
│   │           └── [productSlug]/
│   └── api/
│       ├── analytics/
│       └── images/
│           └── upload/
├── components/
│   ├── dashboard/
│   ├── storefront/
│   ├── analytics/
│   ├── products/
│   └── ui/
├── features/
│   ├── auth/
│   ├── tenant/
│   ├── category/
│   ├── product/
│   ├── custom-link/
│   ├── analytics/
│   └── image-upload/
├── db/
│   ├── schema/
│   ├── migrations/
│   └── queries/
├── lib/
│   ├── auth/
│   ├── imgbb/
│   ├── analytics/
│   └── validation/
└── middleware.ts
```

---

## 14. Design System

Gunakan desain modern untuk bisnis kuliner. Jangan menggunakan tampilan admin template generik.

### Warna

- Background: `#F7F6F2`.
- Surface: `#FFFFFF`.
- Text utama: `#181713`.
- Text sekunder: `#716D65`.
- Primary: `#FF6534`.
- Primary hover: `#EA4F20`.
- Dark: `#24211D`.
- Success: `#17825A`.
- Warning: `#DA8A16`.
- Error: `#D64545`.
- Border: `#E6E2DB`.

### Typography

- Heading: Plus Jakarta Sans.
- Body: Inter.
- Body text minimal 16px.

### Shape

- Card radius: 16px.
- Button radius: 10px.
- Input radius: 10px.
- Product image radius: 12px.
- Product image ratio: 4:3.
- Border tipis.
- Shadow lembut.
- Gunakan whitespace yang cukup.

### Dashboard

- Sidebar gelap.
- Content area terang.
- Orange hanya untuk CTA dan highlight.
- Desktop menggunakan tabel atau list.
- Mobile menggunakan card.
- Analytics harus mudah dibaca tanpa terlalu banyak grafik.

### Storefront

- Mobile-first.
- Tidak menggunakan sidebar.
- Foto produk menjadi fokus utama.
- Sticky search dan category navigation.
- Grid dua kolom pada mobile.
- Grid tiga atau empat kolom pada desktop.
- Detail produk menggunakan bottom sheet pada mobile.
- Jangan menggunakan hero marketing yang terlalu besar.

---

## 15. Pages

### Public

```text
/store/[slug]
/store/[slug]/product/[productSlug]
```

### Authentication

```text
/login
/register
/forgot-password
```

### Merchant dashboard

```text
/dashboard
/dashboard/menu
/dashboard/categories
/dashboard/links
/dashboard/analytics
/dashboard/appearance
/dashboard/qr-code
/dashboard/settings
```

Tidak perlu membuat halaman orders, customers, CRM, payments, cart, checkout, atau inventory.

---

## 16. Security dan Privacy

- Validasi semua input dengan Zod.
- Semua query merchant harus mempunyai filter `tenant_id`.
- Terapkan Row Level Security.
- Jangan expose ImgBB API key ke browser.
- Batasi ukuran dan tipe gambar.
- Sanitasi nama file dan URL.
- Terapkan rate limiting pada endpoint analytics dan upload.
- Validasi URL custom link.
- Gunakan `rel="noopener noreferrer"` untuk external link.
- Jangan menyimpan alamat IP mentah untuk analytics jangka panjang.
- Gunakan anonymous session ID.
- Jangan menggunakan data analytics untuk mengidentifikasi seseorang.
- Sediakan mekanisme penghapusan akun dan data tenant.

---

## 17. MVP Scope

Implementasikan:

- Register dan login merchant.
- Onboarding profil bisnis.
- Memilih subdomain.
- CRUD kategori.
- CRUD menu.
- Upload gambar ke ImgBB.
- Toggle menu aktif dan tersedia.
- Custom link seperti Linktree.
- Pengaturan tampilan sederhana.
- Storefront publik.
- Search dan filter kategori.
- Product detail.
- Tombol WhatsApp dan link sosial.
- QR code halaman.
- Analytics page views.
- Analytics product views.
- Analytics link clicks.
- Analytics sumber pengunjung dan perangkat.
- Responsive mobile dan desktop.

Jangan implementasikan:

- Cart.
- Checkout.
- Pemesanan.
- Pembayaran.
- CRM.
- Inventory.
- Delivery.
- Loyalty point.
- Multi-cabang.
- Subscription billing.
- Custom domain.
- AI recommendation.
- Aplikasi mobile native.

---

## 18. Prioritas Implementasi

### Sprint 1 — Foundation

- Setup Next.js, Supabase, dan Drizzle.
- Authentication.
- Database schema.
- Tenant onboarding.
- Resolusi slug.
- Dashboard layout.

### Sprint 2 — Content management

- CRUD kategori.
- CRUD produk.
- Integrasi ImgBB.
- Image validation.
- Custom links.

### Sprint 3 — Public storefront

- Storefront merchant.
- Search.
- Category filter.
- Product detail.
- External links.
- QR code.

### Sprint 4 — Analytics dan tema

- Event tracking.
- Daily aggregation.
- Dashboard analytics.
- Theme settings.
- Responsive testing.
- Security review.
- Deployment.

---

## 19. Definition of Done

MVP dianggap selesai ketika:

- Merchant dapat mendaftar dan login.
- Merchant dapat membuat profil bisnis.
- Merchant dapat memilih slug unik.
- Subdomain dapat diarahkan ke tenant yang benar.
- Merchant dapat membuat kategori.
- Merchant dapat menambahkan dan mengubah produk.
- Gambar berhasil diunggah ke ImgBB.
- URL gambar tersimpan di database.
- Merchant dapat menambahkan dan mengurutkan link.
- Pengunjung dapat membuka halaman tanpa login.
- Search dan filter kategori berfungsi.
- Produk habis memiliki indikator jelas.
- Tombol WhatsApp dan external link berfungsi.
- Analytics mencatat page view, product view, dan link click.
- Merchant dapat melihat analytics miliknya sendiri.
- Merchant tidak dapat melihat data tenant lain.
- ImgBB API key tidak terlihat di browser.
- Tampilan berfungsi di mobile dan desktop.
- Loading, empty, error, dan success state tersedia.
- Tidak ada cart, order, payment, atau CRM.

---

## 20. Product Positioning

> Platform mini-site dan katalog menu digital untuk bisnis kuliner. Merchant dapat membuat halaman seperti Linktree menggunakan subdomain sendiri, menampilkan menu dan seluruh link bisnis, serta memantau interaksi pengunjung melalui dashboard analytics.

Fokus produk bukan transaksi, tetapi membuat menu bisnis mudah ditemukan, mudah dibagikan, dan dapat diukur.
