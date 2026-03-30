const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Helper to create story dialog arrays
// speaker: 'ARDI'(protagonist) | 'BUDI'(mentor) | 'NPC'(other) | 'NARASI'(narrator)
// mood: 'normal' | 'panic' | 'happy' | 'thinking' | 'sad' | 'confident'
// npcName: Custom NPC name (e.g., 'REZA', 'SARI' for distinct characters)
const S = (speaker, text, mood = 'normal', npcName = null) => ({ speaker, text, mood, ...(npcName && { npcName }) });

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'guru@smkn1lamongan.sch.id' },
    update: {},
    create: { name: 'Guru Admin', email: 'guru@smkn1lamongan.sch.id', password_hash: hash },
  });

  await prisma.levelResult.deleteMany({});
  await prisma.question.deleteMany({});

  const questions = [
    // ─────────────────────────────────────────────────────
    //  CHAPTER 1 — Lab Komputer - Masuk & Keluar Data
    // ─────────────────────────────────────────────────────
    {
      level_number: 1,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 1: Perangkat Masuk vs Keluar',
        intro: [
          S('NARASI', 'Pagi hari, Senin, 07.30 WIB. SMK Negeri 1 Lamongan.'),
          S('NARASI', 'Reza — siswa magang dari SMK — dimulai hari pertamanya di lab komputer.'),
          S('BUDI', 'Selamat datang, Reza! Saya Pak Budi, guru IT. Aku mau minta bantuanmu!', 'thinking'),
          S('REZA', 'Apa yang bisa saya bantu, Pak?', 'normal'),
          S('BUDI', 'Komputer baru tiba. Ada printer, keyboard, scanner, sama monitor. Mana yang kita gunakan untuk MASUKKAN data, mana untuk KELUARKAN hasil?', 'thinking'),
          S('REZA', 'Hmm... begini Pak, bayangkan komputer seperti kepala kita. Mata dan telinga kita adalah perangkat yang MENERIMA informasi...', 'confident'),
          S('BUDI', 'Ooh, analogi yang bagus! Lanjutkan!', 'happy'),
        ],
        outro: [
          S('REZA', '...dan mulut serta tangan kita untuk MENGELUARKAN hasil. Begitu juga komputer, Pak!', 'happy'),
          S('BUDI', 'Sempurna! Keyboard dan scanner itu seperti mata dan telinga. Printer dan monitor seperti mulut dan tangan!', 'happy'),
          S('REZA', 'Jadi setiap perangkat punya peran yang jelas, ya Pak!', 'confident'),
          S('BUDI', 'Betul. Oh ya, tadi ada klien yang butuh bantuan teknis. Mau kita kunjungi?', 'thinking'),
          S('REZA', 'Siapa, Pak? Apa permasalahannya?', 'normal'),
        ]
      }),
      question_text: '🖥️ Reza harus mengelompokkan perangkat lab! Keyboard, scanner, monitor, dan printer baru tiba. Mana yang MENERIMA data dari kita (input) dan mana yang MENAMPILKAN hasil (output)?',
      options_json: JSON.stringify(['Keyboard', 'Scanner', 'Monitor', 'Printer']),
      correct_config: JSON.stringify({
        'MENERIMA dari Kita (Input)': ['Keyboard', 'Scanner'],
        'MENAMPILKAN Hasil (Output)': ['Monitor', 'Printer'],
      }),
      bloom_level: 'C2 - Memahami',
      topic: 'Perangkat Masuk dan Keluar',
      explanation: 'Keyboard & Scanner = Perangkat MASUK (kita memberikan perintah). Monitor & Printer = Perangkat KELUAR (komputer menampilkan hasil). Setiap perangkat punya peran khusus!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 2 — Bank - Komputer Macet
    // ─────────────────────────────────────────────────────
    {
      level_number: 2,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'server_room',
        chapter: 'Chapter 2: Komputer Macet Saat Bekerja',
        intro: [
          S('NARASI', 'Siang hari. Kantor Bank Lamongan. Semua orang kelihatan panik.'),
          S('NPC', 'Tolong, Mas! ATM kami macet saat pelanggan mau ambil uang!', 'panic', 'MANAGER'),
          S('REZA', 'Bagaimana bisa macet, Pak?', 'thinking'),
          S('NPC', 'Sistemnya tiba-tiba berhenti dan error "Sistem tidak merespons".', 'panic', 'MANAGER'),
          S('REZA', 'Sepertinya komputer tidak bisa "mendengarkan" perintah dengan benar...', 'thinking'),
          S('BUDI', 'Reza, bayangkan komputer seperti teller bank yang melayani pelanggan. Dia harus MENDENGARKAN pesanan, MEMAHAMI, MELAKUKAN, lalu MEMBERIKAN hasil!', 'thinking'),
          S('REZA', 'Ohhh! Jadi ada tahapan-tahapan yang harus urut!', 'confident'),
        ],
        outro: [
          S('REZA', 'Setelah saya reset urutan sistemnya, ATM bisa normal kembali!', 'happy'),
          S('NPC', 'Alhamdulillah! Pelanggan bisa ambil uang lagi! Terima kasih banyak!', 'happy', 'MANAGER'),
          S('BUDI', 'Kerja bagus, Reza. Urutan dalam bekerja itu penting, baik buat manusia maupun komputer!', 'happy'),
        ]
      }),
      question_text: '🏦 ATM di bank macet! Reza perlu memperbaiki urutan cara komputer bekerja. Bayangkan ATM seperti teller bank yang melayani nasabah. Urutan kerja yang BENAR adalah?',
      options_json: JSON.stringify([
        'Memberikan uang kepada pelanggan',
        'Teller mendengarkan pesanan pelanggan',
        'Teller memahami pesanan dan mengecek rekening',
        'Teller mengambil uang dari brankas dan menghitung',
      ]),
      correct_config: JSON.stringify([
        'Teller mendengarkan pesanan pelanggan',
        'Teller memahami pesanan dan mengecek rekening',
        'Teller mengambil uang dari brankas dan menghitung',
        'Memberikan uang kepada pelanggan',
      ]),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Urutan Kerja Komputer',
      explanation: 'Dengarkan ➜ Pahami ➜ Lakukan ➜ Berikan hasil. Komputer bekerja dengan tahapan yang sama. Jika urutannya salah, komputer akan error atau macet!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 3 — Studio Desain - PC Lambat
    // ─────────────────────────────────────────────────────
    {
      level_number: 3,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'studio_it',
        chapter: 'Chapter 3: Komputer Lambat untuk Edit Video',
        intro: [
          S('NARASI', 'Sore hari. Studio desain grafis di Lamongan.'),
          S('NPC', 'Reza! Tolong! PC saya sangat lambat waktu edit video 4K!', 'panic', 'SARI'),
          S('REZA', 'Mbak Sari, spesifikasi PCnya apa?', 'thinking'),
          S('NPC', 'Prosesor terbaik, tapi cuma punya 8GB RAM. Tapi kok tetap lambat?', 'panic', 'SARI'),
          S('REZA', 'Hmm... prosesor bagus tapi lambat... Pasti merasa kesulitan! Seperti apa ya?', 'thinking'),
          S('BUDI', 'Reza, bayangkan prosesor seperti chef yang terampil. Dia bisa memasak cepat, tapi tunggu dulu... meja kerjanya kecil dan sempit!', 'thinking'),
          S('REZA', 'Ohhh! Jadi RAM itu seperti meja kerja chef?', 'confident'),
        ],
        outro: [
          S('REZA', 'Chef bagus tidak berguna kalau meja kerjanya kecil! Begitu juga PC, Mbak.', 'happy'),
          S('NPC', 'Jadi harus upgrade RAM? Berapa banyak?', 'thinking', 'SARI'),
          S('REZA', 'Minimal 32GB buat edit video 4K dengan nyaman!', 'confident'),
          S('BUDI', 'Bagus, Reza. Analogi chef itu sempurna!', 'happy'),
        ]
      }),
      question_text: '🎬 Mbak Sari edit video 4K tapi PC sangat lambat. Prosesornya bagus, tapi hanya 8GB RAM. Komponen MANA yang sebenarnya jadi kemacetan?',
      options_json: JSON.stringify([
        'Prosesor — tidak cukup kuat',
        'RAM (Memori) — tidak cukup besar untuk file 4K yang berat',
        'Harddisk — rusak bad sector',
        'Layar monitor — resolusi rendah'
      ]),
      correct_config: JSON.stringify('RAM (Memori) — tidak cukup besar untuk file 4K yang berat'),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Peran RAM dalam Performa',
      explanation: 'RAM adalah "ruang kerja" komputer. Semakin besar file yang dibuka, semakin banyak RAM yang dibutuhkan. Prosesor cepat tapi RAM kecil = tetap lambat! Seperti chef di dapur sempit.'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 4 — Rumah - Data Hilang Saat Listrik Mati
    // ─────────────────────────────────────────────────────
    {
      level_number: 4,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'rumah_user',
        chapter: 'Chapter 4: Mengapa Data Hilang?',
        intro: [
          S('NARASI', 'Malam hari. Rumah keluarga Pak Darmo.'),
          S('NPC', 'Mas Reza, anak saya bilang data di layar komputer itu AMAN, walaupun padam listrik!', 'thinking', 'PAK DARMO'),
          S('REZA', 'Siapa yang bilang gitu?', 'thinking'),
          S('NPC', 'Anaknya sendiri. Kata dia RAM itu menyimpan SELAMANYA. Terus dia matikan listriknya...', 'sad', 'PAK DARMO'),
          S('ARDI', 'Astaga... laporan 50 halaman hilang semua?', 'panic'),
          S('NPC', 'Iya! Anaknya pikir RAM sama seperti Flashdisk! Hilang semua!', 'sad', 'PAK DARMO'),
          S('BUDI', 'Reza, ini penting! Ada dua jenis penyimpanan data. Jelaskan perbedaannya!', 'thinking'),
        ],
        outro: [
          S('REZA', 'Pernyataan itu SALAH, Pak! RAM itu HILANG saat listrik mati. Seperti papan tulis yang dihapus!', 'confident'),
          S('NPC', 'Lalu mana yang AMAN, Mas?', 'normal', 'PAK DARMO'),
          S('REZA', 'SSD atau Harddisk itu yang AMAN! Seperti buku tulis. Meskipun listrik mati, data masih ada!', 'confident'),
          S('BUDI', 'Tepat! Ingat: tekan CTRL+S untuk SIMPAN ke SSD atau Harddisk. Baru data kamu aman!', 'happy'),
        ]
      }),
      question_text: '💾 Anak Pak Darmo yakin: "Data di RAM itu aman, tidak akan hilang meski listrik padam!" Apakah pernyataan itu BENAR atau SALAH?',
      options_json: JSON.stringify(['BENAR', 'SALAH']),
      correct_config: JSON.stringify('SALAH'),
      bloom_level: 'C5 - Mengevaluasi',
      topic: 'Jenis Penyimpanan Data',
      explanation: 'SALAH! RAM = hilang saat listrik mati (seperti papan tulis). SSD/Harddisk = aman selamanya (seperti buku tulis). Selalu SIMPAN (CTRL+S) data penting ke SSD/Harddisk!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 5 — Lab Komputer - Siapa Hitung, Siapa Atur?
    // ─────────────────────────────────────────────────────
    {
      level_number: 5,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 5: Bagian-Bagian Processor',
        intro: [
          S('NARASI', 'Lab Komputer. Reza diminta Pak Budi untuk menjelaskan bagian-bagian processor.'),
          S('NPC', 'Reza! Ada tamu dari Majalah Teknologi SMK. Jelaskan untuk mereka: apa itu ALU, Control Unit, Register, dan Bus?', 'thinking', 'PAK BUDI'),
          S('JURNALIS', 'Iya, tapi jelaskan pakai analogi yang gampang dimengerti, jangan yang teknis!', 'normal', 'JURNALIS'),
          S('REZA', 'Baik! Saya jelasin pake cerita. Bayangkan kalo processor itu tim resepsionis tamu di hotel!', 'confident'),
          S('NPC', 'Hotel? Menarik! Lanjut terus!', 'happy', 'JURNALIS'),
        ],
        outro: [
          S('REZA', 'Jadi: ALU itu yang HITUNG (kalkulator), CU itu yang ATUR (manajer), Register itu MEMO (catatan), Bus itu JALAN (transportasi)!', 'confident'),
          S('NPC', 'Wah! Analoginya membantu banget! Terima kasih Reza!', 'happy', 'JURNALIS'),
          S('NPC', 'Reza, jawaban bagus! Sekarang turun ke Lab Storage. Lihat-lihat perangkat penyimpanan yang ada!', 'happy', 'PAK BUDI'),
        ]
      }),
      question_text: '🔧 Reza harus menjelaskan peran masing-masing bagian processor. Jodohkan nama dengan PERAN utamanya!',
      options_json: JSON.stringify({
        left: ['ALU', 'Control Unit (CU)', 'Register', 'System Bus'],
        right: [
          'Jalur transportasi data antar komponen (seperti jalan raya)',
          'Melakukan semua perhitungan dan operasi logika',
          'Mengatur & mengendalikan semua proses di processor',
          'Penyimpanan data sementara paling cepat'
        ]
      }),
      correct_config: JSON.stringify({
        'ALU': 'Melakukan semua perhitungan dan operasi logika',
        'Control Unit (CU)': 'Mengatur & mengendalikan semua proses di processor',
        'Register': 'Penyimpanan data sementara paling cepat',
        'System Bus': 'Jalur transportasi data antar komponen (seperti jalan raya)',
      }),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Bagian-Bagian Processor',
      explanation: 'ALU = si HITUNG (kalkulus), CU = si ATUR (manajer), Register = catatan cepat (memo), Bus = jalan transportasi data. Keempat bekerja sama dalam setiap operasi komputer!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 6 — Lab Komputer - Mana Sementara, Mana Abadi?
    // ─────────────────────────────────────────────────────
    {
      level_number: 6,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 6: Volatile vs Non-Volatile',
        intro: [
          S('NARASI', 'Siang hari di Lab Komputer. Pak Budi menunjukkan berbagai komponen storage kepada Reza.'),
          S('NPC', 'Reza! Ada kiriman perangkat storage baru. RAM, Cache, SSD, sama HDD campur aduk!', 'thinking', 'PAK BUDI'),
          S('REZA', 'Lalu saya diminta apa, Pak?', 'thinking'),
          S('NPC', 'Kelompokkan menjadi DUA kategori: yang DATA HILANG saat listrik mati vs yang DATA AMAN selamanya!', 'normal', 'PAK BUDI'),
          S('REZA', 'Ini kan dari Chapter 4 dulu! Volatile sama Non-Volatile!', 'happy'),
          S('NPC', 'Tepat! Tunjukkan pemahaman kamu dengan mengelompokkan ini dengan benar!', 'confident', 'PAK BUDI'),
        ],
        outro: [
          S('REZA', 'Selesai! RAM dan Cache = Volatile (hilang saat mati). SSD dan HDD = Non-Volatile (selamanya aman)!', 'confident'),
          S('NPC', 'Bagus! Kamu sudah paham perbedaannya. Sekarang kita belajar soal kecepatan, oke?', 'happy', 'PAK BUDI'),
          S('REZA', 'Siap, Pak!', 'happy'),
        ]
      }),
      question_text: '💾 Kelompokkan perangkat storage berikut! Mana yang DATA-nya HILANG saat listrik mati (Volatile)? Mana yang AMAN selamanya (Non-Volatile)?',
      options_json: JSON.stringify(['RAM DDR5 32GB', 'L3 CPU Cache', 'SSD NVMe 2TB', 'Hard Disk Drive 4TB']),
      correct_config: JSON.stringify({
        'Volatile — Hilang saat mati listrik': ['RAM DDR5 32GB', 'L3 CPU Cache'],
        'Non-Volatile — Aman selamanya': ['SSD NVMe 2TB', 'Hard Disk Drive 4TB'],
      }),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Jenis Penyimpanan Data',
      explanation: 'Volatile = RAM, Cache: data hilang saat listrik mati (seperti papan tulis). Non-Volatile = SSD, HDD: data aman selamanya (seperti buku tulis). SELALU SIMPAN data penting sebelum mematikan komputer!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 7 — Lab Komputer - Dari Tombol sampai Print!
    // ─────────────────────────────────────────────────────
    {
      level_number: 7,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 7: Alur Kerja Nyata',
        intro: [
          S('NARASI', 'Siang hari di Lab Komputer. Reza sedang bermain-main dengan printer.'),
          S('REZA', 'Pak! Saya penasaran. Ketika saya tekan Ctrl+P di Word, kenapa gambar langsung muncul di kertas?', 'thinking'),
          S('NPC', 'Bagus pertanyaan, Reza! Itu adalah siklus IPO nyata! Input, Process, Output!', 'happy', 'PAK BUDI'),
          S('REZA', 'Lalu bagaimana urutan prosesnya, Pak?', 'thinking'),
          S('NPC', 'Nah, ini kamu yang susun urutannya! Dari tombol Ctrl+P sampai kertas keluar!', 'confident', 'PAK BUDI'),
          S('REZA', 'Wah, saya harus proses berapa tahapan?', 'thinking'),
        ],
        outro: [
          S('REZA', 'Jadi: Tombol Ctrl+P ➜ CPU olah ➜ Driver ubah format ➜ Printer cetak! Wah keren!', 'happy'),
          S('NPC', 'Tepat! Itulah siklus I-P-O: Input diterima, CPU process, hasil output di printer!', 'happy', 'PAK BUDI'),
          S('REZA', 'Setiap hari saya menggunakan siklus ini tanpa disadari, Pak!', 'happy'),
          S('NPC', 'Itulah kecanggihan Von Neumann! Semua operasi mengikuti pola IPO yang sama!', 'happy', 'PAK BUDI'),
        ]
      }),
      question_text: '⌨️ Reza penasaran: "Pak, ketika tekan Ctrl+P di Word, apa urutannya sampai kertas keluar?" Susun tahapan siklus IPO yang benar!',
      options_json: JSON.stringify([
        'Driver printer mengubah format data, lalu kirim ke port printer',
        'Tekan tombol Ctrl+P — keyboard utus input ke CPU',
        'Printer fisik mencetak dokumen pada kertas putih',
        'CPU memproses perintah, ambil data dokumen dari RAM',
      ]),
      correct_config: JSON.stringify([
        'Tekan tombol Ctrl+P — keyboard utus input ke CPU',
        'CPU memproses perintah, ambil data dokumen dari RAM',
        'Driver printer mengubah format data, lalu kirim ke port printer',
        'Printer fisik mencetak dokumen pada kertas putih',
      ]),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Siklus Input-Process-Output',
      explanation: 'Siklus Nyata: Input (Ctrl+P) → Process (CPU+RAM siapkan) → Process lanjutan (driver konversi) → Output (printer cetak). Pola ini terjadi di setiap operasi komputer!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 8 — Lab Komputer - Game yang Hang!
    // ─────────────────────────────────────────────────────
    {
      level_number: 8,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 8: Komputer Kehabisan Arah',
        intro: [
          S('NARASI', 'Sore hari. Reza sedang main game grafis tinggi di Lab Komputer ketika terjadi disaster!'),
          S('REZA', 'Pak... komputer saya hang total! Game freeze! Tidak bisa gerak apapun!', 'panic'),
          S('NPC', 'Coba cerita terjadi apa, Reza?', 'thinking', 'PAK BUDI'),
          S('REZA', 'Tadi lancar-lancar aja, terus tiba-tiba gambar berhenti. CPU masih panas, tapi tidak ada respons!', 'panic'),
          S('NPC', 'Hmm... terhenti berarti CPU tidak tahu instruksi mana yang harus dijalankan selanjutnya...', 'thinking', 'PAK BUDI'),
          S('NPC', 'Ada register khusus di CPU yang menyimpan "nomor urut" instruksi berikutnya. Kalau register itu rusak, CPU bingung!', 'thinking', 'PAK BUDI'),
          S('REZA', 'Register apa, Pak? Yang seperti yang kita pelajari tadi?', 'thinking'),
        ],
        outro: [
          S('NPC', 'Benar! Register yang disebut Program Counter (PC). Itu seperti "penanda halaman" dalam buku instruksi!', 'happy', 'PAK BUDI'),
          S('REZA', 'Jadi kalau PC-nya error, CPU tidak tahu halaman mana yang dibaca?', 'thinking'),
          S('NPC', 'Tepat! Inilah yang terjadi pada gamemu. Mari kita restart komputer, reset PC-nya!', 'happy', 'PAK BUDI'),
          S('NARASI', 'Komputer di-restart. Lancar kembali.'),
          S('REZA', 'Alhamdulillah! Jadi Program Counter itu sangat penting ya?', 'happy'),
        ]
      }),
      question_text: '🎮 Game Reza hang tiba-tiba! CPU tidak tahu instruksi mana yang harus eksekusi selanjutnya. Register MANA yang berperan menyimpan alamat instruksi berikutnya?',
      options_json: JSON.stringify([
        'Accumulator — tempat hasil kalkulasi ALU',
        'Program Counter (PC) — penanda instruksi berikutnya',
        'Memory Address Register (MAR) — penanda alamat memori',
        'Instruction Register (IR) — menyimpan instruksi sekarang'
      ]),
      correct_config: JSON.stringify('Program Counter (PC) — penanda instruksi berikutnya'),
      bloom_level: 'C2 - Memahami',
      topic: 'Register Khusus CPU',
      explanation: 'Program Counter (PC) adalah "penanda halaman" instruksi CPU. Setiap selesai instruksi, PC otomatis tambah 1 (index berikutnya). Jika PC rusak/corrupt, CPU bingung & hang!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 9 — Lab Komputer - Program & Data Satu Rumah
    // ─────────────────────────────────────────────────────
    {
      level_number: 9,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 9: Teori Penting Von Neumann',
        intro: [
          S('NARASI', 'Siang hari. Reza bertanya kepada Pak Budi tentang konsep yang agak abstrak.'),
          S('REZA', 'Pak, saya penasaran. Kenapa di komputer, PROGRAM dan DATA bisa hidup dalam memory yang SAMA?', 'thinking'),
          S('NPC', 'Pertanyaan yang sangat bagus! Itu ide revolusioner dari Von Neumann!', 'happy', 'PAK BUDI'),
          S('NPC', 'Coba bayangkan: dulu waktu komputer ENIAC, program dan data harus disimpan terpisah. Berbeda lokasi!', 'thinking', 'PAK BUDI'),
          S('REZA', 'Lalu apa masalahnya, Pak?', 'thinking'),
          S('NPC', 'Kalau mau ubah program, harus ubah hardware fisik! Ganti kabel, ganti saklar! Rumit sekali!', 'sad', 'PAK BUDI'),
          S('NPC', 'Von Neumann punya ide: kenapa tidak program & data disimpan sama-sama di memory?', 'thinking', 'PAK BUDI'),
        ],
        outro: [
          S('REZA', 'Jadi BENAR kalau program dan data dalam satu memory yang sama?', 'thinking'),
          S('NPC', 'SANGAT BENAR! Itu yang disebut "Stored-Program Concept" — konsep paling fundamental Von Neumann!', 'happy', 'PAK BUDI'),
          S('NPC', 'Dengan idea ini, mau ubah program? Cukup ubah data di memory. Tidak perlu ganti hardware!', 'happy', 'PAK BUDI'),
          S('REZA', 'Wah! Itulah mengapa software bisa di-update dan diganti-ganti tanpa buka-buka casing komputer!', 'happy'),
          S('NPC', 'Tepat sekali! Itulah kecanggihan desain Von Neumann. Simple tapi powerful!', 'happy', 'PAK BUDI'),
        ]
      }),
      question_text: '💡 Pak Budi menjelaskan teori Von Neumann: "Program dan data disimpan DALAM memory yang SAMA, bukan terpisah. Ini memungkinkan software diubah tanpa ganti hardware." Pernyataan itu BENAR atau SALAH?',
      options_json: JSON.stringify(['BENAR', 'SALAH']),
      correct_config: JSON.stringify('BENAR'),
      bloom_level: 'C5 - Mengevaluasi',
      topic: 'Stored-Program Concept',
      explanation: 'BENAR! "Stored-Program Concept" adalah DNA Von Neumann — program & data sama-sama di memory. Ini revolusi karena software bisa diubah cukup dengan update data memory, tanpa ubah hardware fisik!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 10 ⚔️ UJIAN FINAL — Troubleshooting 4 PC
    // ─────────────────────────────────────────────────────
    {
      level_number: 10,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'final_boss',
        chapter: 'Chapter 10: Ujian Troubleshooting — FINAL BOSS! ⚔️',
        intro: [
          S('NARASI', 'Jumat sore. Ujian akhir semester. Pak Budi memberikan soal praktik troubleshooting akhir.'),
          S('NPC', 'Reza! Selama berminggu-minggu kamu sudah belajar banyak!', 'happy', 'PAK BUDI'),
          S('NPC', 'Lab Komputer, Storage, Processor, Memory, Siklus IPO, Register, Stored-Program Concept...', 'thinking', 'PAK BUDI'),
          S('REZA', 'Terima kasih, Pak! Saya menikmati setiap pelajaran!', 'happy'),
          S('NPC', 'Nah! Sekarang ada soal FINAL! Ada EMPAT laporan kerusakan PC dari empat klien berbeda!', 'confident', 'PAK BUDI'),
          S('NPC', 'Kamu harus jodohkan GEJALA kerusakan dengan KOMPONEN Von Neumann yang paling bermasalah!', 'confident', 'PAK BUDI'),
          S('REZA', 'Empat soal sekaligus? Wah! Permainan match yang menentukan!', 'confident'),
        ],
        outro: [
          S('NPC', '✨ SEMPURNA! SEMUA BENAR, REZA! KAU LULUS DENGAN NILAI TINGGI!', 'happy', 'PAK BUDI'),
          S('REZA', 'ALHAMDULILLAH! TERIMA KASIH, PAK BUDI!', 'happy'),
          S('NPC', 'Kamu sudah membuktikan memahami arsitektur Von Neumann dengan REAL! Tidak hanya teori!', 'happy', 'PAK BUDI'),
          S('REZA', 'Jadi Reza sudah "Von Neumann Expert" sekarang?', 'thinking'),
          S('NPC', 'Lebih dari itu! Kamu siap untuk Kelas 11 dan belajar jauh lebih dalam lagi!', 'confident', 'PAK BUDI'),
          S('NARASI', '🎉 SELAMAT! REZA BERHASIL MENYELESAIKAN SELURUH MISI DENGAN GEMILANG!'),
          S('NARASI', '🏆 DARI LAB KOMPUTER → UJIAN FINAL — REZA ADALAH EXPERT VON NEUMANN!'),
        ]
      }),
      question_text: '⚔️ UJIAN FINAL TROUBLESHOOTING! Jodohkan GEJALA PC yang bermasalah dengan KOMPONEN yang paling mungkin error!',
      options_json: JSON.stringify({
        left: [
          'PC menyala & BIOS tampil, tapi Windows gagal loading + bunyi "tik-tik-tik"',
          'Komputer restart sendiri setiap membuka banyak aplikasi besar',
          'Layar freeze, CPU 100% padahal hanya buka Notepad saja',
          'File baru disimpan menghilang total setelah restart'
        ],
        right: [
          'Hard Disk / HDD — bad sector atau kerusakan piringan',
          'RAM — kapasitas tidak cukup untuk aplikasi besar',
          'CPU / Processor — overheating atau thermal throttling',
          'SSD / File System — error saat penulisan ke storage'
        ]
      }),
      correct_config: JSON.stringify({
        'PC menyala & BIOS tampil, tapi Windows gagal loading + bunyi "tik-tik-tik"': 'Hard Disk / HDD — bad sector atau kerusakan piringan',
        'Komputer restart sendiri setiap membuka banyak aplikasi besar': 'RAM — kapasitas tidak cukup untuk aplikasi besar',
        'Layar freeze, CPU 100% padahal hanya buka Notepad saja': 'CPU / Processor — overheating atau thermal throttling',
        'File baru disimpan menghilang total setelah restart': 'SSD / File System — error saat penulisan ke storage',
      }),
      bloom_level: 'C6 - Mengkreasi',
      topic: 'Troubleshooting Arsitektur',
      explanation: 'Bunyi "tik-tik" = HDD bad sector. Restart saat banyak aplikasi = RAM penuh. CPU 100% untuk Notepad = throttling/overheating. File hilang setelah restart = Non-Volatile storage error. Kamu sudah paham Von Neumann dengan sempurna!'
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log('✅ Seeded 10 simplified chapters with high-school appropriate language!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
