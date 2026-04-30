# 📚 Panduan Fitur Guru - Mengelola Konten Kuis & Visual Novel

## ✅ Status Implementasi

Fitur untuk teacher/guru telah **SELESAI DIIMPLEMENTASIKAN**. Guru sekarang dapat mengelola konten kuis dan visual novel secara lengkap.

---

## 📋 Fitur-Fitur yang Tersedia

### 1. **Login Guru** 
- **URL**: `/login-guru` (Frontend) atau akses melalui tombol Login Guru di menu utama
- **Autentikasi**: JWT-based authentication
- **Format**: Email & Password
- **Token**: Disimpan di `localStorage` sebagai `adminToken`

### 2. **Panel Dashboard Guru**
**URL**: `/admin`

#### Tab 1: Data Murid & Hasil
- Lihat daftar semua siswa beserta statistik:
  - Total siswa
  - Jumlah siswa yang selesai
  - Siswa yang aktif bermain
  - Rata-rata poin
- Tabel detail: Nama, Absen, Status, Poin, Bintang
- Tombol "Segarkan" untuk update data real-time
- **Zona Bahaya**: "Bersihkan Sesi" (hapus semua data siswa)

#### Tab 2: Kelola Bank Soal (BARU!)
Fitur lengkap untuk CRUD (Create, Read, Update, Delete) soal:

##### 🔍 **Melihat Soal**
- Tampilan daftar semua soal per level
- Informasi: Pertanyaan, Tipe, Level, Preview cerita & opsi

##### ✏️ **Mengedit Soal**
1. Klik tombol "✏️ Edit" pada soal yang ingin diubah
2. Modal form muncul dengan field:
   - **Pertanyaan Utama**: Instruksi untuk siswa
   - **Penjelasan**: Pesan sukses setelah menjawab
   - **Story JSON**: Isi visual novel (cerita dialog)
   - **Options JSON**: Opsi jawaban dalam format JSON
   - **Correct Config**: Kunci jawaban dalam format JSON
3. Klik "Simpan Perubahan"

##### ➕ **Membuat Soal Baru**
1. Klik tombol "✨ Soal Baru" di header
2. Isi form dengan:
   - **Level** (required): Nomor level (1-10)
   - **Tipe Soal**: CLASSIFICATION, MATCHING, SEQUENCING, MULTIPLE_CHOICE
   - **Pertanyaan** (required): Instruksi untuk siswa
   - **Story JSON** (optional): Cerita visual novel
   - **Options JSON** (required): Opsi jawaban
   - **Correct Config** (required): Kunci jawaban
   - **Bloom Level**: REMEMBER, UNDERSTAND, APPLY, ANALYZE, EVALUATE, CREATE
   - **Topik**: Kategori atau mata pelajaran
   - **Penjelasan**: Pesan feedback
3. Sistem akan **validasi JSON** otomatis
4. Klik "Buat Soal Baru"

##### 🗑️ **Menghapus Soal**
1. Klik tombol "🗑️ Hapus" pada soal
2. Konfirmasi penghapusan
3. Soal akan dihapus permanen dari database

---

## 🔧 Endpoint API Backend

### Authentication
```
POST /api/auth/login
- Body: { email, password }
- Response: { token, user }
```

### Mendapat Soal
```
GET /api/admin/questions
- Header: Authorization: Bearer {token}
- Response: Array of Question objects
```

### Membuat Soal Baru
```
POST /api/admin/questions
- Header: Authorization: Bearer {token}
- Body: {
    level_number: number,
    type: string (CLASSIFICATION|MATCHING|SEQUENCING|MULTIPLE_CHOICE),
    question_text: string,
    story_json: string (JSON array),
    options_json: string (JSON),
    correct_config: string (JSON),
    bloom_level: string,
    topic: string,
    explanation: string
  }
- Response: { message, question }
```

### Mengubah Soal
```
PUT /api/admin/questions/:id
- Header: Authorization: Bearer {token}
- Body: {
    question_text: string,
    story_json: string,
    options_json: string,
    correct_config: string,
    explanation: string
  }
- Response: { message, question }
```

### Menghapus Soal
```
DELETE /api/admin/questions/:id
- Header: Authorization: Bearer {token}
- Response: { message, question }
```

### Mendapat Data Siswa
```
GET /api/admin/students
- Header: Authorization: Bearer {token}
- Response: { summary, students }
```

### Reset Sesi (Hapus Semua Siswa)
```
DELETE /api/admin/session
- Header: Authorization: Bearer {token}
- Response: { message }
```

---

## 📐 Format JSON untuk Story & Options

### Story JSON (Visual Novel - Cerita)
**Format**: Array of Objects dengan character & dialog

```json
[
  { "character": "Tutor", "dialog": "Halo! Mari kita pelajari tentang..." },
  { "character": "Siswa", "dialog": "Baik, saya siap!" },
  { "character": "Tutor", "dialog": "Pertanyaan pertama..." }
]
```

**Field**:
- `character`: Nama karakter yang berbicara
- `dialog`: Teks yang diucapkan karakter

### Options JSON
**Format**: Array of Objects dengan id dan label

```json
[
  { "id": "1", "label": "Pilihan A - Pembahasan" },
  { "id": "2", "label": "Pilihan B - Pembahasan" },
  { "id": "3", "label": "Pilihan C - Pembahasan" }
]
```

### Correct Config (Kunci Jawaban)
**Format**: Object yang mendefinisikan jawaban benar

```json
{ "correct": ["1"] }
```

atau untuk matching/classification:

```json
{
  "correct": {
    "item1": "category1",
    "item2": "category2"
  }
}
```

---

## ⚠️ Validasi & Keamanan

### JSON Validation
- Sistem **otomatis** validasi format JSON
- Jika JSON tidak valid, akan muncul error: `❌ story_json tidak valid! Periksa format JSON.`
- Pastikan **tidak ada line break berlebihan** di tengah JSON string

### Required Fields
- ✓ **Level** (wajib)
- ✓ **Pertanyaan** (wajib)
- ✓ **Options JSON** (wajib)
- ✓ **Correct Config** (wajib)
- ✗ **Story JSON** (opsional)

### Authentication
- Semua endpoint memerlukan JWT token
- Token berlaku 12 jam
- Login ulang jika session habis

---

## 🎨 UI Component Changes

### Dashboard Header
- Deskripsi diperbarui menjadi "Kelola Konten & Pantau Siswa"

### Tab Soal
**Tombol Baru**:
- 🔄 **Segarkan**: Refresh daftar soal
- ✨ **Soal Baru**: Buka form pembuatan soal baru

**Action per Soal**:
- ✏️ **Edit**: Ubah soal yang ada
- 🗑️ **Hapus**: Hapus soal (dengan konfirmasi)

### Modal untuk Create (BARU)
- Form lengkap dengan 10+ field
- Preview contoh JSON
- Validasi real-time

---

## 📝 Contoh Penggunaan

### Membuat Soal Baru dengan Visual Novel

**Step 1**: Klik "✨ Soal Baru"

**Step 2**: Isi form:
- Level: `1`
- Tipe: `CLASSIFICATION`
- Pertanyaan: `Kelompokkan binatang berikut ke kategori yang tepat!`
- Story JSON:
```json
[
  { "character": "Tutor", "dialog": "Perhatikan gambar-gambar berikut!" },
  { "character": "Siswa", "dialog": "Baik, Pak!" },
  { "character": "Tutor", "dialog": "Tiga kelompok kategori untuk Anda" }
]
```
- Options JSON:
```json
[
  { "id": "kucing", "label": "Kucing" },
  { "id": "anjing", "label": "Anjing" },
  { "id": "burung", "label": "Burung" }
]
```
- Correct Config:
```json
{
  "correct": {
    "kucing": "mamalia",
    "anjing": "mamalia",
    "burung": "burung"
  }
}
```

**Step 3**: Klik "Buat Soal Baru"

✅ Soal berhasil dibuat!

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Soal tidak tampil di daftar | Klik tombol "🔄 Segarkan" |
| Gagal menyimpan soal | Cek format JSON, pastikan tidak ada syntax error |
| Token tidak valid | Logout dan login kembali |
| Tidak bisa hapus soal | Pastikan sudah confirm dialog konfirmasi |
| Modal tidak muncul | Refresh halaman atau clear browser cache |

---

## 📊 Database Schema

```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  level_number INTEGER NOT NULL,
  type VARCHAR DEFAULT 'CLASSIFICATION',
  question_text TEXT NOT NULL,
  image_url VARCHAR,
  options_json TEXT,
  correct_config TEXT,
  bloom_level VARCHAR,
  topic VARCHAR,
  explanation TEXT,
  story_json TEXT
);
```

---

## 🚀 Fitur Masa Depan (Optional)

- [ ] Import soal dari CSV/Excel
- [ ] Export soal ke berbagai format
- [ ] Duplicate soal
- [ ] Search & filter soal
- [ ] Preview visual novel saat edit
- [ ] Statistik penggunaan soal
- [ ] Template soal siap pakai
- [ ] Kolaborasi edit antar guru

---

## 📞 Kontak Support

Jika ada pertanyaan atau masalah:
1. Periksa format JSON dengan JSON validator online
2. Pastikan token masih valid
3. Clear browser cache dan refresh halaman
4. Hubungi administrator sistem

---

**Dibuat**: April 2026
**Versi**: 1.0
**Status**: Aktif
