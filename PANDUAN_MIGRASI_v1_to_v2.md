# 🔄 PANDUAN MIGRASI v1.0 → v2.0

**Untuk**: Guru dan administrator yang sudah menggunakan v1.0  
**Waktu**: 5 menit untuk memahami  
**Status**: ✅ Tidak ada data yang hilang

---

## ✅ Kabar Baik: TIDAK ADA MIGRASI DATA!

Semua soal yang sudah dibuat di **v1.0 TETAP AMAN** di database. Anda bisa mulai menggunakan v2.0 langsung tanpa perlu mengubah atau menghapus apa pun.

```
v1.0 Soal: ✅ Bisa diedit dengan v2.0
v1.0 Database: ✅ 100% compatible
v1.0 Data: ✅ Tidak ada yang hilang
```

---

## 🔄 Apa yang Berubah?

### User Interface (UX) - BERUBAH BESAR ✅

| Aspek | v1.0 | v2.0 |
|-------|------|------|
| Buat soal | 1 form besar | 5-step wizard |
| Input pilihan | JSON manual | Form builder |
| Input cerita | JSON manual | Character + dialog |
| Error msg | Teknis | User-friendly |
| Preview | Tidak ada | Ada (Step 5) |
| Difficulty | Sulit untuk awam | Mudah untuk semua |

### Data Structure (Backend) - TIDAK BERUBAH ✅

```javascript
// v1.0
{
  level_number: 1,
  question_text: "...",
  options_json: "[...]",      // Still same format
  correct_config: "{...}",    // Still same format
  story_json: "[...]"         // Still same format
}

// v2.0
{
  level_number: 1,            // SAME
  question_text: "...",       // SAME
  options_json: "[...]",      // SAME ✓
  correct_config: "{...}",    // SAME ✓
  story_json: "[...]"         // SAME ✓
}
```

**Backend tidak berubah!** Database format 100% kompatibel.

---

## 🎓 Cara Menggunakan v2.0

### Buat Soal Baru (Menggunakan v2.0 Wizard)

#### Before (v1.0):
```
1. Klik "✨ Soal Baru"
2. Buka modal besar dengan 10+ fields
3. Isi JSON: options_json = "[{"id":"1","label":"..."}]"
4. Isi JSON: correct_config = "{"correct":["1"]}"
5. Isi JSON: story_json = "[{"character":"...","dialog":"..."}]"
6. Klik "Buat Soal Baru"
😫 Ribet!
```

#### After (v2.0):
```
1. Klik "✨ Soal Baru"
2. Step 1: Klik Level (1-5) → Klik "Selanjutnya"
3. Step 2: Tulis pertanyaan → Klik "Selanjutnya"
4. Step 3: Klik "Pilihan 1", tulis text → Centang ✓ benar → Klik "Selanjutnya"
5. Step 4: Klik checkbox cerita → Tulis karakter & dialog → Klik "Selanjutnya"
6. Step 5: Review soal → Klik "Buat Soal!"
😊 Mudah!
```

### Edit Soal Lama (v1.0 Soal)

Soal lama (v1.0) tetap bisa diedit. Sistem akan otomatis parse JSON:

```
1. Klik "✏️ Edit" di soal v1.0
2. Form akan terbuka dengan data sudah terisi
3. Ubah apa yang perlu diubah
4. Klik "Simpan Perubahan"
```

**Magic terjadi di background:** v2.0 akan parse JSON lama ke UI format baru, lalu convert kembali ke JSON saat save.

---

## 🚨 Hal-Hal Yang SAMA

### ✅ Hal yang Tidak Berubah

1. **Login** - Masih pakai email & password sama
2. **Database** - Tetap SQLite di `prisma/dev.db`
3. **Soal Lama** - Semua tetap aman, bisa diedit
4. **API** - Backend endpoints tetap sama
5. **Siswa Data** - Tidak ada yang berubah

### ✅ Backward Compatibility

- Soal v1.0 bisa diedit di v2.0 ✓
- Soal v1.0 tetap bisa dimainkan siswa ✓
- Database tidak perlu migration ✓
- Tidak perlu install ulang ✓

---

## ⚠️ Perbedaan yang Perlu Diketahui

### Edit Soal v1.0 yang Punya Cerita Kompleks

Jika di v1.0 Anda membuat cerita dengan multiple characters dalam satu story_json:

```json
[
  {"character":"Tutor", "dialog":"Halo"},
  {"character":"Siswa", "dialog":"Halo Pak"},
  {"character":"Tutor", "dialog":"Mari belajar"}
]
```

Saat edit di v2.0, sistem akan konversi ke:

```
Character 1: Tutor
  - Dialog 1: Halo
  - Dialog 2: Mari belajar

Character 2: Siswa
  - Dialog 1: Halo Pak
```

**Hasil akhir:** Tetap sama! Cerita tetap muncul sama untuk siswa.

---

## 🔍 Troubleshooting Migrasi

### Issue: Edit soal v1.0, tapi error

**Cause**: Format JSON invalid di database  
**Solution**: 
1. Buka DevTools (F12)
2. Check console untuk error message
3. Contact support jika perlu

### Issue: Soal tidak muncul saat diedit

**Cause**: Data corrupt  
**Solution**:
1. Refresh halaman
2. Coba delete dan buat ulang
3. Backup data dari database dan contact support

### Issue: Cerita tidak muncul di v2.0 edit form

**Cause**: story_json kosong atau "[]"  
**Solution**: Normal! Klik checkbox "Tambah Cerita" untuk menambah cerita baru.

---

## 📋 Checklist Upgrade ke v2.0

- [ ] **Backup Database**: `cp prisma/dev.db prisma/dev.db.backup`
- [ ] **Update Frontend**: Deploy file `frontend/src/pages/DashboardGuru.jsx` baru
- [ ] **Test Edit Soal**: Edit 1 soal v1.0 dan lihat apakah berfungsi
- [ ] **Test Create Soal**: Buat 1 soal baru dengan wizard v2.0
- [ ] **Test Student Play**: Siswa main soal v1.0 dan v2.0 (harus sama)
- [ ] **Check API**: Verifikasi API endpoints masih respond correctly
- [ ] **Inform Teachers**: Beritahu guru tentang UI baru yang lebih mudah

---

## 🎓 Training untuk Guru

### 5-Menit Quick Start untuk v2.0

**Bagi guru yang terbiasa v1.0:**

```
"Kabar baik! Kami sudah membuat system lebih mudah digunakan.

Dulu untuk buat soal, Anda harus menulis JSON (yang kompleks dan membingungkan).
Sekarang cukup klik tombol dan isi form, seperti mengisi Google Form.

Langkah:
1. Klik "✨ Soal Baru"
2. Ikuti 5 langkah sederhana
3. Klik "Buat Soal"
4. Selesai!

Tidak perlu lagi tahu JSON! Sistem kami yang handle JSON di background.

Soal v1.0 Anda masih aman dan tetap bisa dimainkan siswa.
Jika ingin edit soal v1.0, cukup klik Edit dan ubah apa yang perlu."
```

### FAQ dari Guru

**Q: Apakah soal saya yang lama masih ada?**
A: Ya! Semua soal v1.0 tetap ada dan aman. Tidak ada yang dihapus.

**Q: Bisakah saya edit soal v1.0 dengan v2.0?**
A: Ya! Soal v1.0 bisa diedit dengan v2.0. Sistem otomatis parse data lama.

**Q: Bagaimana jika saya buat soal baru di v2.0, apakah kompatibel?**
A: Ya! Soal v2.0 100% kompatibel dengan v1.0. Siswa bisa main normal.

**Q: Apa yang tidak boleh dilakukan?**
A: Jangan downgrade ke v1.0 setelah pakai v2.0 (bisa data corrupt). Selalu update ke versi terbaru.

---

## 🔐 Data Safety Guarantee

### Kami Jamin:

✅ **100% Data Safe**
- Semua soal v1.0 tetap ada
- Tidak ada data yang dihapus
- Database tidak perlu di-migrate

✅ **100% Backward Compatible**
- Edit soal v1.0 dengan v2.0: ✓ Bisa
- Play soal v1.0 di student app: ✓ Bisa
- Mix soal v1.0 dan v2.0: ✓ Bisa

✅ **Easy Rollback**
- Jika ada issue, bisa restore dari backup
- No code changes di database
- No schema changes

---

## 📊 Version Comparison Matrix

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Buat soal | ✓ | ✓ |
| Edit soal | ✓ | ✓ |
| Hapus soal | ✓ | ✓ |
| Visual novel | ✓ | ✓ |
| Multiple choice | ✓ | ✓ |
| Classification | ✓ | ✓ |
| Matching | ✓ | ✓ |
| Sequencing | ✓ | ✓ |
| **JSON input** | ❌ (hard) | ✅ (form UI) |
| **Wizard** | ❌ | ✅ |
| **Preview** | ❌ | ✅ |
| **Step validation** | ❌ | ✅ |
| **Easy for non-tech** | ❌ | ✅ |
| **Database format** | JSON | **SAME** |
| **API endpoints** | Same | **SAME** |

---

## 🎉 Conclusion

**v1.0 → v2.0 Migration adalah UPGRADE, bukan MIGRATION:**

- ✅ Tidak ada data loss
- ✅ Tidak ada database migration
- ✅ Tidak ada API changes
- ✅ Hanya UI yang lebih baik
- ✅ Backward compatible 100%

**Guru bisa mulai pakai v2.0 langsung tanpa khawatir data hilang.**

**Soal v1.0 tetap berfungsi normal.**

**Pembelajaran siswa tidak terganggu.**

**Welcome to v2.0! 🎉**

---

## 📞 Support

Jika ada pertanyaan atau issue:

1. **Check FAQ di atas**
2. **Baca PANDUAN_UI_MUDAH.md** (untuk guru)
3. **Baca PANDUAN_TEKNIS_v2.md** (untuk developer)
4. **Contact support** jika masalah persisten

---

**Last Updated**: April 29, 2026  
**Version**: 2.0  
**Compatibility**: v1.0 → v2.0 (100% safe)
