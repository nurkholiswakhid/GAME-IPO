# 🎯 RINGKASAN FITUR GURU - QUICK START GUIDE

## ✅ FITUR SUDAH SIAP DIGUNAKAN

Guru sekarang dapat **mengelola semua konten kuis dan visual novel** dengan mudah!

---

## 🚀 Cara Akses

### 1. Login Guru
```
URL: http://localhost:5173/login-guru (atau domain Anda)
Email: guru@smkn1lamongan.sch.id
Password: (sesuai password di database)
```

### 2. Panel Guru
Setelah login, Anda akan masuk ke **Panel Guru** dengan 2 tab:

---

## 📊 TAB 1: Data Murid & Hasil

**Fitur**:
- ✅ Lihat statistik siswa (Total, Selesai, Aktif, Rata-rata Poin)
- ✅ Daftar lengkap semua siswa beserta skor mereka
- ✅ Status bermain setiap siswa (Aktif/Selesai)
- ✅ **Bersihkan Sesi** - Hapus semua data siswa saat pergantian kelas

---

## 📝 TAB 2: Kelola Bank Soal (NEW!)

### Melihat Soal
- Daftar semua soal organized per level
- Preview singkat cerita & opsi jawaban

### ➕ MEMBUAT SOAL BARU
1. Klik **"✨ Soal Baru"** (tombol hijau di atas)
2. Isi formulir dengan:
   - **Level**: 1, 2, 3, ... (pilih level soal)
   - **Tipe Soal**: Pilih dari 4 tipe
   - **Pertanyaan**: Tulis instruksi/pertanyaan
   - **Cerita (Story JSON)**: (opsional) Dialog visual novel
   - **Opsi (Options JSON)**: Format JSON dengan pilihan
   - **Kunci (Correct Config)**: Format JSON jawaban benar
   - **Penjelasan**: Pesan saat jawaban benar
   - **Bloom Level**: Tingkat kesulitan
   - **Topik**: Mata pelajaran
3. Klik **"Buat Soal Baru"** ✅

### ✏️ MENGEDIT SOAL
1. Klik **"✏️ Edit"** pada soal yang ingin diubah
2. Ubah konten:
   - Pertanyaan
   - Cerita (visual novel)
   - Opsi jawaban
   - Kunci jawaban
   - Penjelasan
3. Klik **"Simpan Perubahan"** ✅

### 🗑️ MENGHAPUS SOAL
1. Klik **"🗑️ Hapus"** pada soal
2. Konfirmasi di dialog
3. Soal terhapus permanen ✅

---

## 📐 Contoh Format JSON

### Story JSON (Dialog Cerita)
```json
[
  { "character": "Tutor", "dialog": "Halo! Mari belajar!" },
  { "character": "Siswa", "dialog": "Baik Pak!" },
  { "character": "Tutor", "dialog": "Perhatikan pertanyaan ini..." }
]
```

### Options JSON (Pilihan Jawaban)
```json
[
  { "id": "1", "label": "Pilihan A" },
  { "id": "2", "label": "Pilihan B" },
  { "id": "3", "label": "Pilihan C" }
]
```

### Correct Config (Jawaban Benar)
```json
{ "correct": ["1"] }
```

---

## ⚠️ Validasi

Sistem **otomatis** mengecek format JSON:
- ❌ **Error**: Format JSON salah → Ganti JSON-nya
- ✅ **Sukses**: Format benar → Soal tersimpan

**Tips**: Gunakan JSON validator online jika ada kesalahan.

---

## 🎯 4 Tipe Soal yang Tersedia

| Tipe | Deskripsi | Contoh |
|------|-----------|--------|
| **CLASSIFICATION** | Pengelompokan item ke kategori | Kelompokkan binatang: mamalia vs burung |
| **MATCHING** | Mencocokkan item A dengan B | Pasangkan ibukota dengan negara |
| **SEQUENCING** | Mengurutkan step/tahap | Urutan langkah membuat adonan |
| **MULTIPLE_CHOICE** | Pilihan ganda | Pilih satu jawaban benar |

---

## 6 Level Bloom

- **REMEMBER**: Mengingat fakta dasar
- **UNDERSTAND**: Memahami konsep
- **APPLY**: Menerapkan pengetahuan
- **ANALYZE**: Menganalisis masalah
- **EVALUATE**: Mengevaluasi solusi
- **CREATE**: Menciptakan hal baru

---

## 🔒 Keamanan & Autentikasi

- ✅ Setiap akses memerlukan **JWT Token**
- ✅ Token berlaku **12 jam**
- ✅ Logout = Token dihapus
- ✅ Semua perubahan tercatat

---

## ⚡ Tombol Cepat

| Tombol | Fungsi |
|--------|--------|
| **✏️ Edit** | Edit soal yang ada |
| **🗑️ Hapus** | Hapus soal (dengan konfirmasi) |
| **✨ Soal Baru** | Buat soal baru |
| **🔄 Segarkan** | Refresh data |
| **Keluar Sesi** | Logout dari panel |

---

## 💡 Tips & Trik

1. **Selalu Test JSON**: Paste JSON ke https://jsonlint.com untuk validasi
2. **Backup Soal**: Screenshot atau copy soal penting sebelum edit
3. **Urutan Level**: Buat soal urut dari level 1 ke atas
4. **Dialog Menarik**: Buat cerita visual novel yang engaging untuk siswa
5. **Penjelasan Detail**: Isi penjelasan yang benar agar siswa belajar

---

## 🆘 Troubleshooting

### Soal tidak tampil?
→ Klik tombol "🔄 Segarkan"

### JSON error saat save?
→ Copy JSON ke https://jsonlint.com, perbaiki error

### Tidak bisa login?
→ Cek email/password, atau hubungi admin

### Modal tidak muncul?
→ Refresh halaman atau clear browser cache

---

## 📱 Kompatibilitas

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablet)
- ⚠️ Mobile (sebagian fitur terbatas, lebih baik desktop)

---

## 🎓 Untuk Pemula

1. **Mulai**: Klik "✨ Soal Baru"
2. **Isi**: Level = 1, Pertanyaan = tulis pertanyaan
3. **Copy-Paste**: Options & Correct Config dari contoh di atas
4. **Buat**: Klik "Buat Soal Baru"
5. **Done**: Soal sudah bisa dipakai siswa!

---

**Versi**: 1.0  
**Last Updated**: April 2026  
**Status**: ✅ SIAP PRODUKSI
