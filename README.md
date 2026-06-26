# Transjakarta MT Fleet Management App

Aplikasi mobile manajemen armada kendaraan yang dikembangkan sebagai bagian dari Tes Teknis Mobile Engineer — Management Trainee Transjakarta. Aplikasi ini mengonsumsi [MBTA V3 API](https://api-v3.mbta.com/docs/swagger/index.html) (transit API publik) untuk menampilkan data kendaraan secara real-time, lengkap dengan fitur filter dan detail.

## Tech Stack

- **React Native CLI** 0.79 (New Architecture)
- **TypeScript** (strict mode)
- **TanStack Query (React Query)** v5 — data fetching, caching, pagination
- **React Navigation** (Native Stack) — navigasi antar screen
- **Axios** — HTTP client
- **react-native-config** — environment variable (API key)

## Cara Menjalankan Aplikasi

### Prasyarat

Pastikan environment React Native CLI sudah terpasang. Ikuti panduan resmi: [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

Yang dibutuhkan:
- Node.js >= 18
- JDK 17 (untuk Android)
- Android Studio + Android SDK (minimal SDK 24)
- Xcode (untuk iOS, minimal target iOS 15) — khusus macOS
- CocoaPods (untuk iOS)

### 1. Clone repository

```bash
git clone https://github.com/<username>/transjakarta-mt-fleet-app.git
cd transjakarta-mt-fleet-app
```

### 2. Install dependency

```bash
npm install
```

Untuk iOS, install pods tambahan:

```bash
cd ios && pod install && cd ..
```

### 3. Setup API Key MBTA

Aplikasi ini menggunakan API key MBTA untuk menghindari rate limit yang ketat (tanpa key dibatasi 20 request/menit, dengan key menjadi 1.000 request/menit).

1. Daftar API key gratis di [api-v3.mbta.com/register](https://api-v3.mbta.com/register)
2. Buat file `.env` di root project dengan isi:

```
MBTA_API_KEY=isi_api_key_anda
```

> Aplikasi tetap bisa berjalan tanpa API key (MBTA API bisa diakses publik), namun akan lebih mudah terkena rate limit saat development aktif.

### 4. Jalankan aplikasi

**Android:**

```bash
npm run android
```

Pastikan emulator Android sudah berjalan (via Android Studio > Device Manager), atau device fisik tersambung dengan USB debugging aktif.

**iOS:**

```bash
npm run ios
```

### 5. (Opsional) Jalankan Metro bundler secara manual

```bash
npm start
```

## Arsitektur

### Struktur Folder

```
src/
├── api/            # Service layer: axios client, mapper, dan fungsi pemanggilan API per resource
├── components/     # Reusable UI components (Card, Loading, Error state, dll)
├── constants/       # Konstanta seperti base URL API
├── hooks/          # Custom hooks (React Query) per resource
├── navigation/     # Konfigurasi React Navigation
├── screens/        # Halaman/screen utama aplikasi
├── types/          # TypeScript interfaces & types
└── App.tsx         # Entry point aplikasi
```

### Pola Arsitektur: DTO vs Domain Model

MBTA API menggunakan format **JSON:API**, di mana setiap resource memiliki struktur bersarang (`data.attributes`, `data.relationships`) yang berbeda dari struktur flat yang ideal untuk dikonsumsi UI. Untuk menjembatani ini, aplikasi memisahkan dua jenis tipe data:

- **Raw/DTO types** (`VehicleResource`, `RouteResource`, `TripResource`) — mencerminkan struktur asli response API.
- **Domain types** (`Vehicle`, `Route`, `Trip`) — struktur flat yang dipakai komponen UI.

Konversi antara keduanya ditangani oleh fungsi mapper di `src/api/mappers.ts`. Pola ini memastikan perubahan struktur API tidak langsung berdampak ke seluruh komponen UI, cukup diselesaikan di satu lapisan mapper.

### Data Fetching & Caching — React Query

Seluruh komunikasi dengan API ditangani lewat custom hooks berbasis TanStack Query (`useVehicles`, `useRoutes`, `useTrips`, dll), memberikan:
- Caching otomatis berdasarkan `queryKey` (termasuk filter yang aktif)
- State `isLoading`, `isError`, `isFetchingNextPage` tanpa perlu dikelola manual
- Pagination berbasis cursor offset memakai `useInfiniteQuery` (10 data per fetch, sesuai requirement)

### Filter Rute & Trip

Filter menggunakan pendekatan dependent query — daftar Trip hanya di-fetch setelah pengguna memilih minimal satu Rute, untuk menghindari pengambilan seluruh data Trip yang jumlahnya sangat besar. State pilihan filter disimpan sementara di dalam modal (tidak langsung memengaruhi list utama) hingga pengguna menekan tombol "Terapkan".

### Error Handling

Axios interceptor terpusat di `src/api/apiClient.ts` mengonversi error teknis (response error JSON:API, network error, dll) menjadi pesan yang mudah dipahami pengguna. Setiap layer service menambahkan konteks tambahan sesuai operasi yang gagal. Pada halaman detail, kegagalan memuat data relasi (Rute/Trip) tidak menggagalkan seluruh halaman (graceful degradation) — hanya bagian terkait yang menampilkan pesan error dengan opsi coba lagi.

## Known Limitations

- Peta lokasi kendaraan pada halaman detail sudah diimplementasikan menggunakan WebView.
