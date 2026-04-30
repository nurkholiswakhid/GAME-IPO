# 🎨 PANDUAN GURU - UI YANG LEBIH MUDAH DIGUNAKAN

**Versi**: 2.0 (Improved for Non-Technical Users)  
**Status**: ✅ Production Ready  
**Tanggal**: April 29, 2026

---

## 🎯 Apa yang Berubah?

Kami telah **menyederhanakan pengalaman pengguna** sehingga guru yang **tidak technical** dapat dengan mudah mengelola soal dan cerita. Tidak perlu lagi menulis JSON secara manual! 🎉

---

## 📊 Perbandingan Lama vs Baru

| Fitur | Versi Lama | Versi Baru |
|-------|-----------|-----------|
| Input JSON Manual | ❌ JSON textarea | ✅ Form Fields UI |
| Membuat Soal | 1 modal besar | ✅ Wizard 5-langkah |
| Pilihan Jawaban | JSON text | ✅ Tombol Add/Remove |
| Validasi | Sesudah submit | ✅ Per-step validation |
| Error Message | Teknis | ✅ Jelas Bahasa Indonesia |
| Visual Novel | JSON textarea | ✅ Character + Dialog fields |
| Preview | Tidak ada | ✅ Step 5 review |
| Difficulty | Sangat sulit | ✅ Sangat mudah |

---

## ✨ FITUR BARU UNTUK GURU

### 1. **Wizard 5-Langkah untuk Membuat Soal** 🪄

Membuat soal baru tidak lagi rumit. Proses dibagi menjadi 5 langkah sederhana:

```
Step 1: Pilih Level (1-5)
        ↓
Step 2: Tulis Pertanyaan
        ↓
Step 3: Tambah Pilihan Jawaban
        ↓
Step 4: (Opsional) Tambah Cerita
        ↓
Step 5: Review & Simpan
```

**Keuntungan:**
- Tidak overwhelm - fokus satu hal per langkah
- Progress bar visual - tahu posisi Anda
- Validasi per-step - error muncul di saat yang tepat
- Back button - bisa kembali dan edit

### 2. **Pilih Level Dengan Tombol Visual** 🎚️

Bukan input angka, tapi **tombol visual yang besar dan jelas**:

```
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │
└───┴───┴───┴───┴───┘
```

- Tekan tombol level yang ingin dibuat soal
- Tombol yang dipilih **membesar dan berubah warna hijau**
- Guru bisa perubahan pikiran dengan tekan tombol lain

### 3. **Form Builder untuk Pilihan Jawaban** 🎯

Tidak perlu JSON! Cukup:

```
✓ Pilihan 1: [Ibukota Indonesia]
  ☑ Pilih sebagai jawaban benar

  Pilihan 2: [Kota Terbesar]
  ☐ Pilih sebagai jawaban benar

  Pilihan 3: [Pulau Terbesar]
  ☐ Pilih sebagai jawaban benar

+ Tambah Pilihan Lagi
```

**Cara Kerja:**
1. Ketik pilihan jawaban di field
2. Centang checkbox untuk menandai jawaban yang benar
3. Tambah lebih banyak pilihan dengan tombol "+ Tambah"
4. Hapus pilihan yang tidak perlu

**Fitur Smart:**
- Minimal 2 pilihan (otomatis tidak bisa hapus semua)
- Minimal 1 jawaban harus benar (validasi mencegah error)
- Tambah pilihan unlimited

### 4. **Visual Novel Editor - Bukan JSON!** 📖

Dulu: Ketik JSON secara manual 😫  
Sekarang: Klik checkbox "Tambah Cerita" dan isi form 😊

```
📖 Tambah Cerita / Visual Novel?
   ☐ Klik untuk menambah

Setelah klik:

Nama Karakter: [Tutor           ]
Dialog 1:      [Halo, apa kabar?]
Dialog 2:      [Siap belajar?   ]
               + Tambah Dialog

Nama Karakter: [Siswa           ]
Dialog 1:      [Halo Pak!       ]
```

**Kemudahan:**
- Add multiple characters sesuai kebutuhan
- Add multiple dialogs per character
- Dialog akan otomatis menjadi cerita yang menarik
- Tidak perlu tahu JSON format

### 5. **Progress Bar Visual** 📊

Di paling atas wizard ada progress bar:

```
████████░░ Langkah 4 dari 5
```

Guru tahu sudah sejauh mana perjalanannya membuat soal.

### 6. **Step-by-Step Validation** ✅

Validasi terjadi **saat pindah ke langkah berikutnya**, bukan saat submit.

Contoh:
- Step 1: Jika tidak pilih level → tidak bisa lanjut
- Step 2: Jika pertanyaan kosong → tidak bisa lanjut
- Step 3: Jika ada pilihan kosong → error yang jelas

**Error Message** selalu dalam **Bahasa Indonesia yang mudah dipahami**:
- ❌ "Semua pilihan harus diisi!"
- ❌ "Minimal 1 jawaban harus dipilih sebagai kunci!"
- ✅ "Pertanyaan tidak boleh kosong!"

### 7. **Review Step Sebelum Simpan** 👀

**Langkah terakhir (Step 5)** adalah review:

Guru bisa lihat preview soal dengan format yang indah:

```
LEVEL: 2

PERTANYAAN: 
Manakah ibukota Indonesia?

PILIHAN JAWABAN:
1. Jakarta ✓ BENAR
2. Surabaya
3. Bandung

📖 CERITA / VISUAL NOVEL:
Tutor: "Halo semua!"
Tutor: "Mari kita pelajari ibu kota"
Siswa: "Iya Pak!"
```

**Jika ada yang salah:** Tekan tombol "← Sebelumnya" untuk kembali edit.

### 8. **Tips & Hints Di Setiap Langkah** 💡

Setiap step punya keterangan membantu:

**Step 1:**
> 💡 Tips: Tingkat kesulitan menentukan urutan soal. Mulai dari level 1 untuk soal mudah.

**Step 2:**
> 💡 Tips: Pertanyaan harus jelas dan mudah dipahami. Usahakan singkat tapi informatif.

**Step 3:**
> Minimal 2 pilihan, maksimal tidak terbatas

**Step 4:**
> 💡 Cerita membuat pembelajaran lebih menarik. Gunakan dialog singkat dan menarik!

---

## 🎨 Edit Soal - Juga Lebih Mudah!

Saat guru tekan tombol **"✏️ Edit"**, mereka dapat form yang **sama user-friendly**:

- Tidak perlu lihat JSON manual
- Pilihan sudah teruraikan dengan checkbox
- Bisa tambah/hapus pilihan
- Bisa edit/tambah karakter & dialog

**Bedanya dari Create:**
- Bukan wizard (langsung semua field)
- Lebih cepat untuk edit kecil
- Tetap mudah dipahami

---

## 🗑️ Hapus Soal - Tetap Aman!

Tombol hapus ada, tapi dengan **2 pertanyaan konfirmasi:**

1. Pertama: Dialog browser standard
   ```
   Yakin hapus soal: "Berapa 2+2?"
   ⚠️ Langkah ini tidak dapat dibatalkan!
   ```

2. Kedua: Alert sukses
   ```
   ✅ Soal berhasil dihapus!
   ```

**Keamanan:** Tidak mungkin hapus soal secara tidak sengaja.

---

## 📱 Responsive Design - Di Mana Saja!

Form bekerja sempurna di:

| Device | Status |
|--------|--------|
| 📱 Smartphone | ✅ Optimized |
| 📱 Tablet | ✅ Optimized |
| 💻 Laptop | ✅ Full featured |
| 🖥️ Desktop | ✅ Spacious |

**Guru bisa:**
- Membuat soal di mana saja (bahkan dari rumah di laptop)
- Edit soal dari tablet di kelas
- Check soal dari smartphone

---

## 🎓 Contoh Workflow Guru

### Scenario: Guru Membuat Soal Baru

#### Step 1 - Pilih Level
```
"Saya ingin membuat soal untuk siswa yang baru mulai"
→ Tekan tombol Level 1
```

#### Step 2 - Tulis Pertanyaan
```
"Pertanyaannya tentang apa?"
→ Tulis: "Berapa jumlah hari dalam satu minggu?"
```

#### Step 3 - Buat Pilihan
```
"Opsi jawaban apa saja yang disiapkan?"
→ Isi:
   1. 7 (benar ✓)
   2. 5
   3. 10
```

#### Step 4 - Tambah Cerita (Opsional)
```
"Apakah ingin ditambah dialog?"
→ Klik ☐ untuk menerima
→ Tulis:
   Karakter: "Tutor"
   Dialog: "Halo! Mari belajar bersama"
```

#### Step 5 - Review
```
"Cek lagi sebelum simpan"
→ Lihat preview soal
→ Klik "Buat Soal!" jika sudah benar
```

**Hasil:** Soal berhasil dibuat tanpa perlu menulis JSON! 🎉

---

## 🔍 Troubleshooting & FAQ

### Q: Saya tidak ingin menambah cerita, bisakah?
A: Ya! Step 4 ada checkbox. Jika tidak dicentang, cerita tidak ditambahkan. Soal tetap valid.

### Q: Bagaimana jika saya mau edit soal yang sudah dibuat?
A: Tekan tombol "✏️ Edit" di samping soal. Form edit akan terbuka dengan data sudah terisi. Ubah apa yang ingin diubah dan klik "Simpan Perubahan".

### Q: Berapa maksimal pilihan jawaban?
A: Tidak terbatas! Tambah sebanyak yang perlu dengan tombol "+ Tambah Pilihan".

### Q: Apa yang terjadi jika saya hapus soal?
A: Soal akan dihapus permanen dari database. Tidak bisa di-undo. Tapi sistem meminta konfirmasi 2x agar tidak sengaja hapus.

### Q: Bagaimana dengan karakter dalam visual novel?
A: Bisa tambah multiple characters. Setiap character bisa punya banyak dialogs. Sistem akan otomatis convert ke format cerita yang benar.

### Q: Error apa saja yang mungkin muncul?
A: 
- ❌ "Mohon pilih Level soal terlebih dahulu!"
- ❌ "Pertanyaan tidak boleh kosong!"
- ❌ "Semua pilihan harus diisi!"
- ❌ "Minimal 1 jawaban harus dipilih!"

Semua error message jelas dan dalam Bahasa Indonesia. Guru akan tahu persis apa yang harus diperbaiki.

---

## 🚀 Tips Menggunakan Dengan Efektif

### Tip 1: Mulai Dari Level 1
Buat soal mudah di level 1 dulu, lalu naik ke level 2, 3, dst. Siswa akan merasa lebih percaya diri.

### Tip 2: Pertanyaan Yang Jelas
Jangan gunakan pertanyaan yang ambigu atau membingungkan. Siswa harus paham apa yang diminta.

### Tip 3: Opsi Jawaban Yang Logis
Opsi jawaban harus masuk akal dan memikat siswa yang tidak tahu. Hindari opsi yang terlalu aneh.

### Tip 4: Manfaatkan Cerita
Cerita membuat pembelajaran lebih engaging. Gunakan character yang relatable untuk siswa (Tutor, Teman, dll).

### Tip 5: Pesan Sukses Yang Memotivasi
Gunakan field "Pesan Sukses" untuk memberikan feedback positif. Contoh: "Benar! Kamu hebat!" atau "Sempurna! Lanjut ke soal berikutnya".

---

## 📋 Checklist Sebelum Klik "Buat Soal"

Sebelum submit di Step 5, pastikan:

- [ ] Level sudah dipilih (1-5)
- [ ] Pertanyaan sudah ditulis jelas
- [ ] Minimal 2 pilihan jawaban tersedia
- [ ] Minimal 1 pilihan ditandai sebagai jawaban benar
- [ ] Semua pilihan jawaban sudah diisi teksnya
- [ ] Kalau ada cerita, semua dialogs sudah diisi
- [ ] Preview step 5 sudah dilihat dan benar

Jika semua ✓, klik "💾 Buat Soal!" dengan percaya diri!

---

## 🎉 Kesimpulan

Versi 2.0 dirancang khusus untuk guru **non-technical**. Tidak perlu mengerti JSON, tidak perlu kode, tidak perlu technical knowledge.

**Cukup:**
1. Klik tombol
2. Isi form
3. Tekan "Buat Soal"
4. Selesai! ✅

**Sistem kami yang handle** semua kompleksitas JSON di background. Guru hanya fokus pada konten pembelajaran yang berkualitas.

---

**Status**: ✅ Ready to Use!  
**Last Updated**: April 29, 2026  
**Version**: 2.0 (User-Friendly Edition)
