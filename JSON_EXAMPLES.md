# 📐 JSON FORMAT EXAMPLES - Referensi untuk Guru

Gunakan file ini sebagai **template/contoh** saat membuat atau mengubah soal.

---

## 🎯 CLASSIFICATION (Pengelompokan)

### Contoh 1: Kelompokkan Binatang

**Story JSON** (Dialog cerita):
```json
[
  { "character": "Tutor", "dialog": "Halo! Hari ini kita akan belajar mengklasifikasi binatang." },
  { "character": "Siswa", "dialog": "Siap, Pak!" },
  { "character": "Tutor", "dialog": "Silakan kelompokkan binatang berikut sesuai kategorinya." }
]
```

**Options JSON** (Binatang yang akan dikelompokkan):
```json
[
  { "id": "kucing", "label": "🐱 Kucing" },
  { "id": "anjing", "label": "🐕 Anjing" },
  { "id": "ayam", "label": "🐔 Ayam" },
  { "id": "ikan", "label": "🐠 Ikan" }
]
```

**Correct Config** (Klasifikasi yang benar):
```json
{
  "correct": {
    "kucing": "mamalia",
    "anjing": "mamalia",
    "ayam": "burung",
    "ikan": "ikan"
  }
}
```

---

### Contoh 2: Kelompokkan Buah & Sayur

**Story JSON**:
```json
[
  { "character": "Chef", "dialog": "Perhatikan daftar makanan berikut!" },
  { "character": "Siswa", "dialog": "Apa yang harus saya lakukan?" },
  { "character": "Chef", "dialog": "Kelompokkan ke kategori: Buah atau Sayuran" }
]
```

**Options JSON**:
```json
[
  { "id": "tomat", "label": "Tomat" },
  { "id": "pisang", "label": "Pisang" },
  { "id": "wortel", "label": "Wortel" },
  { "id": "apel", "label": "Apel" },
  { "id": "buncis", "label": "Buncis" }
]
```

**Correct Config**:
```json
{
  "correct": {
    "tomat": "buah",
    "pisang": "buah",
    "wortel": "sayuran",
    "apel": "buah",
    "buncis": "sayuran"
  }
}
```

---

## 🔗 MATCHING (Mencocokkan)

### Contoh 1: Pasangkan Ibukota dengan Negara

**Story JSON**:
```json
[
  { "character": "Guru Geografi", "dialog": "Hari ini kita belajar geografi!" },
  { "character": "Siswa", "dialog": "Bagaimana caranya?" },
  { "character": "Guru Geografi", "dialog": "Pasangkan setiap negara dengan ibukotanya!" }
]
```

**Options JSON** (Column A: Negara | Column B: Ibukota):
```json
{
  "left": [
    { "id": "1", "label": "Indonesia" },
    { "id": "2", "label": "Jepang" },
    { "id": "3", "label": "Thailand" }
  ],
  "right": [
    { "id": "a", "label": "Bangkok" },
    { "id": "b", "label": "Jakarta" },
    { "id": "c", "label": "Tokyo" }
  ]
}
```

**Correct Config**:
```json
{
  "correct": {
    "1": "b",
    "2": "c",
    "3": "a"
  }
}
```

---

### Contoh 2: Pasangkan Rumus dengan Nama

**Story JSON**:
```json
[
  { "character": "Guru Matematika", "dialog": "Mari mencocokkan rumus-rumus penting!" },
  { "character": "Siswa", "dialog": "Ok, saya siap!" }
]
```

**Options JSON**:
```json
{
  "left": [
    { "id": "luas_persegi", "label": "Luas Persegi" },
    { "id": "luas_segitiga", "label": "Luas Segitiga" },
    { "id": "keliling_lingkaran", "label": "Keliling Lingkaran" }
  ],
  "right": [
    { "id": "r_1", "label": "s × s" },
    { "id": "r_2", "label": "½ × a × t" },
    { "id": "r_3", "label": "2πr" }
  ]
}
```

**Correct Config**:
```json
{
  "correct": {
    "luas_persegi": "r_1",
    "luas_segitiga": "r_2",
    "keliling_lingkaran": "r_3"
  }
}
```

---

## 📊 SEQUENCING (Mengurutkan)

### Contoh 1: Urutan Langkah Fotosintesis

**Story JSON**:
```json
[
  { "character": "Guru IPA", "dialog": "Hari ini kita belajar fotosintesis!" },
  { "character": "Siswa", "dialog": "Bagaimana proses fotosintesis?" },
  { "character": "Guru IPA", "dialog": "Urutkanlah langkah-langkah fotosintesis dengan benar!" }
]
```

**Options JSON** (Langkah-langkah dalam urutan acak):
```json
[
  { "id": "1", "label": "Cahaya matahari diserap oleh klorofil" },
  { "id": "2", "label": "Air diserap oleh akar dari tanah" },
  { "id": "3", "label": "Proses reaksi gelap menghasilkan glukosa" },
  { "id": "4", "label": "Oksigen dilepaskan melalui stomata" }
]
```

**Correct Config** (Urutan yang benar):
```json
{
  "correct": ["2", "1", "3", "4"]
}
```

---

### Contoh 2: Urutan Cara Membuat Kue

**Story JSON**:
```json
[
  { "character": "Chef", "dialog": "Mari kita buat kue bersama-sama!" },
  { "character": "Siswa", "dialog": "Baik Chef!" },
  { "character": "Chef", "dialog": "Urutkanlah langkah-langkah dengan benar!" }
]
```

**Options JSON**:
```json
[
  { "id": "a", "label": "Siapkan bahan-bahan" },
  { "id": "b", "label": "Campurkan bahan kering dan basah" },
  { "id": "c", "label": "Tuang ke dalam loyang" },
  { "id": "d", "label": "Panggang di oven 180°C selama 30 menit" },
  { "id": "e", "label": "Keluarkan dan dinginkan" }
]
```

**Correct Config**:
```json
{
  "correct": ["a", "b", "c", "d", "e"]
}
```

---

## ✅ MULTIPLE_CHOICE (Pilihan Ganda)

### Contoh 1: Soal Biologi

**Story JSON**:
```json
[
  { "character": "Guru Biologi", "dialog": "Pertanyaan untuk Anda!" },
  { "character": "Siswa", "dialog": "Siap Pak!" },
  { "character": "Guru Biologi", "dialog": "Pilih jawaban yang paling tepat." }
]
```

**Options JSON**:
```json
[
  { "id": "A", "label": "Mitokondria adalah pusat energi sel" },
  { "id": "B", "label": "Kloroplas berfungsi untuk fotosintesis" },
  { "id": "C", "label": "Lisosom adalah pusat pengendali sel" },
  { "id": "D", "label": "Vakuola berfungsi untuk sintesis protein" }
]
```

**Correct Config**:
```json
{
  "correct": ["B"]
}
```

---

### Contoh 2: Soal Sejarah

**Story JSON**:
```json
[
  { "character": "Guru Sejarah", "dialog": "Pertanyaan sejarah:" },
  { "character": "Guru Sejarah", "dialog": "Kapan Indonesia merdeka?" }
]
```

**Options JSON**:
```json
[
  { "id": "1945", "label": "17 Agustus 1945" },
  { "id": "1942", "label": "7 Desember 1942" },
  { "id": "1943", "label": "20 Mei 1943" },
  { "id": "1946", "label": "2 September 1946" }
]
```

**Correct Config**:
```json
{
  "correct": ["1945"]
}
```

---

## 📝 Tips Format JSON

### ✅ Yang BENAR:

```json
[
  { "character": "Tutor", "dialog": "Halo!" }
]
```

### ❌ Yang SALAH:

```json
[
  { character: "Tutor", dialog: "Halo!" }  // ← Tidak punya quotes!
]
```

```json
[
  { "character": "Tutor", "dialog": "Halo!" }
  { "character": "Siswa", "dialog": "Hai!" }  // ← Tidak punya comma!
]
```

---

## 🧪 Cara Test JSON Format

1. Buka https://jsonlint.com
2. Copy-paste JSON Anda
3. Klik "Validate JSON"
4. Jika muncul "Valid JSON" → OK!
5. Jika error → Perbaiki dan coba lagi

---

## 💡 Template Kosong (Siap Pakai)

### Template untuk CLASSIFICATION:

```json
Story JSON:
[
  { "character": "Tutor", "dialog": "..." }
]

Options JSON:
[
  { "id": "item1", "label": "..." },
  { "id": "item2", "label": "..." }
]

Correct Config:
{
  "correct": {
    "item1": "category1",
    "item2": "category2"
  }
}
```

### Template untuk MATCHING:

```json
Options JSON:
{
  "left": [
    { "id": "L1", "label": "..." },
    { "id": "L2", "label": "..." }
  ],
  "right": [
    { "id": "R1", "label": "..." },
    { "id": "R2", "label": "..." }
  ]
}

Correct Config:
{
  "correct": {
    "L1": "R1",
    "L2": "R2"
  }
}
```

### Template untuk SEQUENCING:

```json
Options JSON:
[
  { "id": "1", "label": "..." },
  { "id": "2", "label": "..." },
  { "id": "3", "label": "..." }
]

Correct Config:
{
  "correct": ["1", "2", "3"]
}
```

### Template untuk MULTIPLE_CHOICE:

```json
Options JSON:
[
  { "id": "A", "label": "..." },
  { "id": "B", "label": "..." },
  { "id": "C", "label": "..." },
  { "id": "D", "label": "..." }
]

Correct Config:
{
  "correct": ["B"]
}
```

---

## 🎨 Emoji & Simbol Berguna

```
Untuk Binatang:      🐱 🐕 🐠 🐔 🦁 🐘 🐢 🦋
Untuk Buah:          🍎 🍌 🍊 🍋 🍉 🍓 🥝 🍑
Untuk Sayur:         🥕 🥬 🥦 🌽 🍅 🧅 🥒
Untuk Angka/Huruf:   1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ A🅰️ B🅱️
Untuk Status:        ✅ ❌ ⚠️ ℹ️ 🔔 💡 ⭐
Untuk Arah:          ⬅️ ➡️ ⬆️ ⬇️ ↩️ ↪️ 🔄 🔀
```

---

## 📱 Testing di Frontend

Saat membuat soal:
1. Isi semua field
2. Paste JSON di setiap field JSON
3. Klik "Buat Soal Baru"
4. Jika error → Edit JSON berdasarkan pesan error
5. Coba lagi

Saat mengedit soal:
1. Buka soal
2. Edit field yang ingin diubah
3. Pastikan JSON valid
4. Klik "Simpan Perubahan"
5. Refresh untuk lihat perubahan

---

## 🆘 Common Errors

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `Unexpected token` | JSON format salah | Cek dengan JSONLint |
| `Missing quotes` | Nama field tanpa quotes | Tambah `"` sebelum & sesudah |
| `Expected comma` | Lupa koma antar item | Tambah `,` antara `}` dan `{` |
| `Not valid JSON` | Format tidak sesuai | Copy dari contoh di atas |

---

## 📚 Referensi Lebih Lanjut

- JSON Validator: https://jsonlint.com
- JSON Tutorial: https://www.json.org
- JSON Formatter: https://jsonformatter.org

---

**Catatan**: Copy contoh di atas dan modifikasi sesuai kebutuhan Anda!

**Tips**: Selalu test JSON Anda dengan JSONLint sebelum save.

**Good Luck!** 🚀
