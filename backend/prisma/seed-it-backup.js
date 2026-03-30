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
    //  CHAPTER 1 — Lab Komputer SMKN 1 Lamongan
    // ─────────────────────────────────────────────────────
    {
      level_number: 1,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Chapter 1: Hari Pertama KP',
        intro: [
          S('NARASI', 'Pagi hari, Senin, 07.30 WIB. SMK Negeri 1 Lamongan.'),
          S('NARASI', 'Ardi — mahasiswa S1 PTI UNESA — resmi memulai Kerja Praktiknya hari ini di lab komputer sekolah ini.'),
          S('BUDI', 'Selamat datang, Ardi! Saya Pak Budi, Kepala Lab IT. Kamu beruntung masuk di saat yang... kurang tepat.', 'thinking'),
          S('ARDI', 'Maksudnya, Pak?', 'normal'),
          S('BUDI', 'Printer dan scanner lab baru saja datang dari gudang. Tapi staf saya tidak ada yang bisa memilah mana yang input, mana yang output untuk inventaris!', 'panic'),
          S('ARDI', 'Oh, itu mudah, Pak! Biar saya bantu klasifikasikan perangkatnya.', 'confident'),
          S('BUDI', 'Bagus! Buktikan ilmumu, Ardi. Ini kesempatan pertamamu!', 'happy'),
        ],
        outro: [
          S('BUDI', 'Luar biasa! Tepat sekali, Ardi. Kamu benar-benar mahasiswa PTI!', 'happy'),
          S('ARDI', 'Terima kasih, Pak. Siklus I-P-O adalah dasar yang harus dikuasai setiap teknisi.', 'confident'),
          S('BUDI', 'Ngomong-ngomong, tadi ada telepon dari Bank Lamongan. Server mereka crash! Kamu mau bantu?', 'thinking'),
          S('ARDI', 'Siap, Pak Budi! Kapan kita berangkat?', 'confident'),
        ]
      }),
      question_text: 'Bantu Ardi mengklasifikasikan perangkat inventaris lab! Printer inkjet, keyboard, scanner barcode, dan monitor LED baru datang. Manakah yang termasuk perangkat Input dan Output?',
      options_json: JSON.stringify(['Keyboard', 'Scanner Barcode', 'Monitor LED', 'Printer Inkjet']),
      correct_config: JSON.stringify({
        'Perangkat INPUT (Masuk ke CPU)': ['Keyboard', 'Scanner Barcode'],
        'Perangkat OUTPUT (Keluar dari CPU)': ['Monitor LED', 'Printer Inkjet'],
      }),
      bloom_level: 'C2 - Memahami',
      topic: 'Unit Input & Output',
      explanation: 'Keyboard & Scanner memasukkan data mentah ke CPU (Input). Monitor & Printer menampilkan hasil pemrosesan (Output). Inilah fondasi siklus I-P-O!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 2 — Server Room Bank Lamongan
    // ─────────────────────────────────────────────────────
    {
      level_number: 2,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'server_room',
        chapter: 'Chapter 2: Krisis di Ruang Server',
        intro: [
          S('NARASI', 'Siang hari. Ruang Server Bank Lamongan. Lampu merah berkedip di mana-mana.'),
          S('NPC', 'Tolong, Mas! Server kami crash tepat saat transaksi transfer nasabah berlangsung!', 'panic', 'REZA'),
          S('ARDI', 'Tenang, Pak Reza. Ceritakan kejadiannya secara urut.', 'thinking'),
          S('NPC', 'Tiba-tiba layar semua client beku. Lalu error "Instruction execution fault". Saya tidak mengerti!', 'panic', 'REZA'),
          S('ARDI', 'Kemungkinan ada instruksi yang tidak dieksekusi dengan benar di CPU server...',  'thinking'),
          S('BUDI', 'Ardi, ingat yang diajarkan Bu Dosen? Siklus instruksi CPU harus berurutan! Coba analisis dari sana.', 'normal'),
          S('ARDI', 'Betul, Pak Budi! CPU server pasti melewatkan salah satu tahap. Biar saya susun urutannya!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Nah! Setelah saya reset urutan boot sequence, server sudah normal kembali.', 'happy'),
          S('NPC', 'Alhamdulillah... Data transaksi nasabah aman semua! Terima kasih banyak, Mas Ardi!', 'happy', 'REZA'),
          S('BUDI', 'Kerja bagus, Ardi. Pemahaman tentang Instruction Cycle itu sangat penting untuk debugging.', 'happy'),
          S('ARDI', 'Pak Budi, saya dapat pesan dari teman. Katanya ada kantor IT di kota yang butuh bantuan?', 'normal'),
          S('BUDI', 'Benar. Perusahaan desainer grafis, katanya komputer desainernya lemot parah. Ayo kita ke sana!', 'thinking'),
        ]
      }),
      question_text: 'Server crash saat Instruction Cycle CPU! Ardi harus memperbaiki urutan eksekusi yang berantakan. Susun tahapan Instruction Cycle CPU dengan urutan yang BENAR!',
      options_json: JSON.stringify([
        'Execute — CPU menjalankan operasi instruksi',
        'Store — Hasil disimpan kembali ke memori/register',
        'Decode — Control Unit menerjemahkan kode biner',
        'Fetch — Control Unit mengambil instruksi dari RAM via bus',
      ]),
      correct_config: JSON.stringify([
        'Fetch — Control Unit mengambil instruksi dari RAM via bus',
        'Decode — Control Unit menerjemahkan kode biner',
        'Execute — CPU menjalankan operasi instruksi',
        'Store — Hasil disimpan kembali ke memori/register',
      ]),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Instruction Cycle CPU',
      explanation: 'Urutan WAJIB CPU: Fetch (ambil dari RAM) ➔ Decode (terjemahkan) ➔ Execute (lakukan) ➔ Store (simpan). Server crash sering terjadi karena cache korup yang mengacaukan urutan ini!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 3 — Studio Desain Grafis Lamongan
    // ─────────────────────────────────────────────────────
    {
      level_number: 3,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'studio_it',
        chapter: 'Chapter 3: Misteri PC yang Lemot',
        intro: [
          S('NARASI', 'Sore hari. Studio desain grafis "PixelKreatif" di pusat kota Lamongan.'),
          S('NPC', 'Ardi! Syukurlah kamu datang. Adobe Premiere saya nge-lag parah waktu render video!', 'panic', 'SARI'),
          S('ARDI', 'Mbak Sari, spesifikasi PCnya apa?', 'thinking'),
          S('NPC', 'Intel Core i9 generasi terbaru, Mbak! Harddisk SSD 1 TB. Tapi tetap lemot!', 'panic', 'SARI'),
          S('ARDI', 'Hmm... prosesornya terbaik, tapi masih lemot. Pasti bukan masalah CPU-nya...', 'thinking'),
          S('BUDI', 'Ardi, ingat Von Neumann Bottleneck? Coba pikirkan komponen mana yang jadi hambatannya!', 'thinking'),
          S('ARDI', 'Oh! Tentu saja. Video 4K itu sangat besar ukuran datanya... Analisis dulu, baru kesimpulan!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Ketemu! RAM Mbak Sari cuma 8GB dan Bus speed-nya sudah kewalahan transfer data video 4K.', 'confident'),
          S('NPC', 'Jadi itu yang namanya Von Neumann Bottleneck? Harus upgrade RAM ya?', 'thinking', 'SARI'),
          S('ARDI', 'Betul! Upgrade ke 32GB RAM dan RAM lebih cepat. CPU ikut lebih leluasa bernapas.', 'happy'),
          S('BUDI', 'Selamat, Ardi. Kasus ketiga selesai. Tapi ada yang lebih sederhana menunggu... di rumah warga.', 'thinking'),
          S('ARDI', 'Rumah warga? Apa yang terjadi, Pak Budi?', 'normal'),
          S('BUDI', 'Seseorang mencabut kabel PC-nya secara paksa. Data penting hilang. Bisa kamu jelaskan kenapa?', 'thinking'),
        ]
      }),
      question_text: 'PC Mbak Sari ber-CPU i9 tapi sangat lemot untuk render 4K. Ardi harus mendiagnosis bottleneck-nya. Komponen Von Neumann mana yang menjadi hambatan utama transfer data video resolusi tinggi?',
      options_json: JSON.stringify([
        'Arithmetic Logic Unit (ALU) — kelelahan menghitung pixel',
        'Control Unit (CU) — tidak bisa koordinasi proses render',
        'RAM & System Bus — tidak cukup cepat transfer data 4K ke CPU',
        'Register CPU — ukurannya terlalu kecil muat data video'
      ]),
      correct_config: JSON.stringify('RAM & System Bus — tidak cukup cepat transfer data 4K ke CPU'),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Von Neumann Bottleneck',
      explanation: 'File 4K membutuhkan bandwidth besar. CPU i9 kencang, tapi RAM 8GB dan Bus lambat membuat CPU harus menunggu data. Inilah "Von Neumann Bottleneck" — titik lemah arsitektur!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 4 — Rumah Keluarga Pak Darmo
    // ─────────────────────────────────────────────────────
    {
      level_number: 4,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'rumah_user',
        chapter: 'Chapter 4: Miskonsepsi di Rumah',
        intro: [
          S('NARASI', 'Malam hari. Sebuah rumah di perumahan Lamongan Baru.'),
          S('NPC', 'Mas Ardi, anak saya bilang data skripsinya aman karena sudah ada di RAM. Bener nggak?', 'thinking', 'PAK DARMO', '🏠'),
          S('ARDI', 'Oh? Kata siapa itu aman, Pak?', 'thinking'),
          S('NPC', 'Kata anaknya sendiri. Dia yakin RAM itu menyimpan permanen. Trus dia cabut kabel listriknya...', 'sad', 'PAK DARMO', '🏠'),
          S('ARDI', 'Astaga... dan skripsinya hilang?', 'panic'),
          S('NPC', 'Hilang semua! 40 halaman! Dia pikir RAM sama dengan Flashdisk!', 'sad', 'PAK DARMO', '🏠'),
          S('BUDI', 'Ardi, ini kesempatan bagus! Luruskan miskonsepsi ini ya. Bedakan Volatile vs Non-Volatile!', 'thinking'),
        ],
        outro: [
          S('ARDI', 'Pernyataan itu SALAH, Pak. RAM bersifat Volatile — semua data hilang saat listrik mati.', 'confident'),
          S('NPC', 'Duh... anakku... harusnya dia simpan dulu ke SSD ya, Mas?', 'sad', 'PAK DARMO', '🏠'),
          S('ARDI', 'Tepat! SSD/HDD bersifat Non-Volatile. Data tetap ada walau listrik mati. Data di RAM = sementara!', 'confident'),
          S('BUDI', 'Ardi, tadi ada email masuk. Data Center Nasional Surabaya minta bantuan teknis kita besok.', 'thinking'),
          S('ARDI', 'Data Center?! Serius, Pak? Itu fasilitas kelas enterprise! Siap!', 'happy'),
        ]
      }),
      question_text: 'Anak Pak Darmo yakin: "Data skripsi aman di RAM komputer, tidak akan hilang meski kabel dicabut." Ardi harus meluruskan. Apakah pernyataan tersebut BENAR atau SALAH?',
      options_json: JSON.stringify(['BENAR', 'SALAH']),
      correct_config: JSON.stringify('SALAH'),
      bloom_level: 'C5 - Mengevaluasi',
      topic: 'Volatile vs Non-Volatile Memory',
      explanation: 'SALAH! RAM = Volatile Memory. Semua data HILANG saat listrik mati. Data aman hanya setelah disimpan ke media Non-Volatile seperti SSD atau HDD (tekan Ctrl+S!)'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 5 — Data Center Surabaya
    // ─────────────────────────────────────────────────────
    {
      level_number: 5,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'data_center',
        chapter: 'Chapter 5: Ujian di Data Center',
        intro: [
          S('NARASI', 'Selasa pagi. Data Center Tier-3, Surabaya. Ratusan server berjajar di ruang berpendingin.'),
          S('NPC', 'Selamat datang, Mas Ardi, Pak Budi! Saya Wira, Engineer senior di sini.', 'normal', 'WIRA', '🏭'),
          S('ARDI', 'Keren banget fasilitasnya, Pak Wira. Ada yang bisa kami bantu?', 'happy'),
          S('NPC', 'Kami baru merekrut 5 engineer junior. Mereka harus lulus tes dasar arsitektur Von Neumann sebelum boleh menyentuh server!', 'normal', 'WIRA', '🏭'),
          S('BUDI', 'Ardi, kamu yang buat soalnya ya! Jodohkan komponen Von Neumann dengan fungsinya. Ini ujian sebenarnya!', 'confident'),
          S('ARDI', 'Baik! Siapapun yang mau jadi engineer, harus tahu ini luar dalam!', 'confident'),
        ],
        outro: [
          S('NPC', 'Sempurna! Semua engineer junior lulus dengan panduan Ardi!', 'happy', 'WIRA', '🏭'),
          S('ARDI', 'Kuncinya sederhana: ALU itu akuntan, CU itu manajer, Register itu memo, Bus itu jalan raya!', 'happy'),
          S('BUDI', 'Analogi yang bagus, Ardi. Kamu makin mahir menjelaskan!', 'happy'),
          S('NPC', 'Oh ya, tadi Lab Storage kami minta bantuan. Katanya ada kekacauan klasifikasi media penyimpanan!', 'thinking', 'WIRA', '🏭'),
          S('ARDI', 'Soal penyimpanan? Biar saya selesaikan!', 'confident'),
        ]
      }),
      question_text: 'Wira minta Ardi membuat soal tes untuk engineer junior! Jodohkan setiap komponen arsitektur Von Neumann dengan deskripsi fungsi utamanya yang tepat!',
      options_json: JSON.stringify({
        left: ['ALU (Arithmetic Logic Unit)', 'Control Unit (CU)', 'Register CPU', 'System Bus'],
        right: [
          'Jalur transmisi sinyal data, alamat, dan kontrol antar komponen',
          'Eksekusi semua kalkulasi matematika dan operasi logika',
          'Penyimpanan data ultra-cepat di dalam inti prosesor',
          'Mengkoordinasikan dan mengendalikan seluruh operasi CPU'
        ]
      }),
      correct_config: JSON.stringify({
        'ALU (Arithmetic Logic Unit)': 'Eksekusi semua kalkulasi matematika dan operasi logika',
        'Control Unit (CU)': 'Mengkoordinasikan dan mengendalikan seluruh operasi CPU',
        'Register CPU': 'Penyimpanan data ultra-cepat di dalam inti prosesor',
        'System Bus': 'Jalur transmisi sinyal data, alamat, dan kontrol antar komponen',
      }),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Komponen Prosesor Von Neumann',
      explanation: 'ALU = akuntan (hitung), CU = manajer (koordinasi), Register = memo instan (simpan sementara), Bus = jalan raya (transfer). Keempat ini adalah jantung arsitektur Von Neumann!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 6 — Lab Storage Data Center
    // ─────────────────────────────────────────────────────
    {
      level_number: 6,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'lab_storage',
        chapter: 'Chapter 6: Kekacauan Gudang Penyimpanan',
        intro: [
          S('NARASI', 'Ruang penyimpanan Data Center. Seorang staf terlihat bingung di depan kardus-kardus perangkat.'),
          S('NPC', 'Mas Ardi! Syukurlah! Saya Dito, staf gudang. Kiriman perangkat storage baru campur aduk semuanya!', 'panic', 'DITO', '🗄️'),
          S('ARDI', 'Campur aduk bagaimana, Mas Dito?', 'thinking'),
          S('NPC', 'Label Volatile dan Non-Volatile-nya terlepas semua! RAM, Cache, SSD, HDD semuanya campur di kerdus yang sama!', 'panic', 'DITO', '🗄️'),
          S('ARDI', 'Tenang. Ini bisa diselesaikan. Saya hafal karakteristiknya!', 'confident'),
          S('BUDI', 'Bagus, Ardi! Ingat pelajaran Chapter 4? Waktu di rumah Pak Darmo? Terapkan ilmu itu sekarang!', 'happy'),
        ],
        outro: [
          S('ARDI', 'Selesai! RAM dan Cache = Volatile, SSD dan HDD = Non-Volatile. Beres!', 'happy'),
          S('NPC', 'Wah cepat sekali! Terima kasih banyak, Mas! Label baru sudah saya pasang!', 'happy', 'DITO', '🗄️'),
          S('BUDI', 'Ardi, Pak Wira bilang besok ada sesi mengajar di kelas SMK mitra mereka. Kamu diminta jadi narasumber!', 'thinking'),
          S('ARDI', 'Saya?! Mengajar di SMK? Wah, deg-degan juga...', 'thinking'),
          S('BUDI', 'Tenang saja. Materi pertamamu: jelaskan alur kerja nyata komputer saat menekan tombol cetak!', 'happy'),
        ]
      }),
      question_text: 'Dito bingung mengklasifikasikan kiriman storage! Bantu Ardi memilah: RAM DDR5, L3 CPU Cache, SSD NVMe, dan HDD — mana yang Volatile (sementara) vs Non-Volatile (permanen)?',
      options_json: JSON.stringify(['RAM DDR5 32GB', 'L3 CPU Cache', 'SSD NVMe 2TB', 'Hard Disk Drive 8TB']),
      correct_config: JSON.stringify({
        'Volatile — Data hilang saat listrik mati': ['RAM DDR5 32GB', 'L3 CPU Cache'],
        'Non-Volatile — Data tetap meski mati listrik': ['SSD NVMe 2TB', 'Hard Disk Drive 8TB'],
      }),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Hirarki Memori',
      explanation: 'RAM & Cache: cepat tapi sementara (Volatile). SSD & HDD: lambat relatif tapi permanen (Non-Volatile). Hirarki memori Von Neumann dirancang memanfaatkan keunggulan keduanya!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 7 — Kelas X DKV SMKN 1 Lamongan
    // ─────────────────────────────────────────────────────
    {
      level_number: 7,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'kelas_smk',
        chapter: 'Chapter 7: Ardi Mengajar!',
        intro: [
          S('NARASI', 'Rabu pagi. Kelas X DKV, SMK Negeri 1 Lamongan. 30 siswa menunggu narasumber tamu.'),
          S('NPC', 'Selamat datang, Mas Ardi! Murid-murid sudah siap belajar!', 'happy', 'BU AINI', '🎓'),
          S('ARDI', 'Terima kasih, Bu Aini! Hai teman-teman! Hari ini kita bahas siklus IPO lewat satu contoh nyata.', 'happy'),
          S('NPC', 'Mas, satu pertanyaan! Kalau kita tekan Ctrl+P di Word, itu bagaimana prosesnya sampai kertas tercetak?', 'normal', 'SISWA RINA', '🙋'),
          S('ARDI', 'Pertanyaan bagus sekali, Rina! Itu contoh sempurna siklus Input-Process-Output!', 'happy'),
          S('ARDI', 'Yuk kita susun urutannya bersama. Siapa yang bisa bantu saya?', 'confident'),
        ],
        outro: [
          S('NPC', 'Waaaah! Jadi itu alurnya! Keyboard ➜ RAM ➜ CPU ➜ Driver ➜ Printer!', 'happy', 'SISWA RINA', '🙋'),
          S('ARDI', 'Tepat! Setiap tombol yang kamu tekan merupakan input, CPU sebagai processor, printer sebagai output!', 'happy'),
          S('NPC', 'Keren banget jelasinnya, Mas Ardi! Jelas dan mudah dipahami!', 'happy', 'BU AINI', '🎓'),
          S('BUDI', 'Ardi, ada email mendesak dari Lab Riset CPU di Surabaya. Ada bug aneh di program riset mereka.', 'thinking'),
          S('ARDI', 'Lab Riset CPU? Wah ini pasti kasus yang lebih kompleks. Segera kita ke sana, Pak!', 'confident'),
        ]
      }),
      question_text: 'Ardi mengajar Siklus IPO! Rina bertanya: bagaimana urutan kerja komputer dari menekan Ctrl+P hingga dokumen tercetak di kertas? Susun tahapannya dengan benar!',
      options_json: JSON.stringify([
        'Driver printer mengonversi data & mengirim sinyal ke port USB',
        'Tombol Ctrl+P ditekan — keyboard mengirim sinyal input',
        'Printer fisik mencetak dokumen pada kertas (Output)',
        'CPU memproses perintah cetak & menyiapkan data dokumen di RAM',
      ]),
      correct_config: JSON.stringify([
        'Tombol Ctrl+P ditekan — keyboard mengirim sinyal input',
        'CPU memproses perintah cetak & menyiapkan data dokumen di RAM',
        'Driver printer mengonversi data & mengirim sinyal ke port USB',
        'Printer fisik mencetak dokumen pada kertas (Output)',
      ]),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Alur IPO Nyata',
      explanation: 'Input (Ctrl+P) ➔ Process (CPU+RAM olah dokumen) ➔ Process lanjutan (driver konversi format) ➔ Output (printer cetak). Contoh sempurna siklus I-P-O di kehidupan nyata!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 8 — Lab Riset CPU Universitas
    // ─────────────────────────────────────────────────────
    {
      level_number: 8,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'lab_riset',
        chapter: 'Chapter 8: Misteri Program yang Membeku',
        intro: [
          S('NARASI', 'Kamis siang. Laboratorium Riset Arsitektur CPU, Universitas Lamongan.'),
          S('NPC', 'Mas Ardi! Akhirnya! Program simulasi riset kami macet total di tengah loop besar!', 'panic', 'DR. FANDI', '🔬'),
          S('ARDI', 'Halo Dr. Fandi. Sudah dicoba restart?', 'normal'),
          S('NPC', 'Sudah berkali-kali! Error log-nya bilang ada gangguan di register internal CPU. Tapi register mana?!', 'panic', 'DR. FANDI', '🔬'),
          S('ARDI', 'Dr. Fandi, program macet di tengah loop... dan ada gangguan di register...', 'thinking'),
          S('BUDI', 'Ardi, ini ada keterkaitan dengan register khusus yang menyimpan "posisi" eksekusi berikutnya!', 'thinking'),
          S('ARDI', 'Betul, Pak Budi! Saya tahu register mana yang bermasalah. Berikan saya akses log CPU-nya!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Ketemu! Program Counter-nya corrupt. Makanya CPU tidak tahu instruksi mana yang harus dijalankan berikutnya!', 'confident'),
          S('NPC', 'Program Counter! Tentu saja! Saya langsung reset register-nya. BERHASIL! Program jalan lagi!', 'happy', 'DR. FANDI', '🔬'),
          S('BUDI', 'Analisis yang brilian, Ardi. Pemahaman mendalam tentang register internal sangat jarang dimiliki.', 'happy'),
          S('ARDI', 'Terima kasih, Pak. Eh, besok kita ada kunjungan ke perpustakaan digital? Ada apa di sana?', 'normal'),
          S('BUDI', 'Ada mahasiswa yang salah paham tentang teori dasar Von Neumann. Kita perlu luruskan!', 'thinking'),
        ]
      }),
      question_text: 'Program Dr. Fandi macet di tengah loop! Error log menunjukkan gangguan pada register internal CPU. Register MANA yang bertugas menyimpan alamat instruksi CPU berikutnya?',
      options_json: JSON.stringify([
        'Accumulator Register — menyimpan hasil kalkulasi ALU',
        'Program Counter (PC) — menyimpan alamat instruksi berikutnya',
        'Memory Address Register (MAR) — menyimpan alamat memori yang diakses',
        'Instruction Register (IR) — menyimpan instruksi yang sedang dieksekusi'
      ]),
      correct_config: JSON.stringify('Program Counter (PC) — menyimpan alamat instruksi berikutnya'),
      bloom_level: 'C2 - Memahami',
      topic: 'Register Khusus CPU',
      explanation: 'Program Counter (PC) adalah "penanda lokasi" CPU. Setiap selesai instruksi, PC otomatis increment ke alamat berikutnya. Jika PC corrupt, CPU tidak tahu harus melanjutkan ke mana!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 9 — Perpustakaan Digital Lamongan
    // ─────────────────────────────────────────────────────
    {
      level_number: 9,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'perpustakaan',
        chapter: 'Chapter 9: Debat Teori',
        intro: [
          S('NARASI', 'Jumat pagi. Perpustakaan Digital Kota Lamongan. Hening dan sejuk.'),
          S('NPC', 'Mas Ardi, ini ada essai mahasiswa komputer. Dia nulis sesuatu yang menurutnya benar, tapi saya ragu...', 'thinking', 'PUSTAKAWAN', '📚'),
          S('ARDI', 'Boleh saya baca?', 'normal'),
          S('NPC', 'Silakan. Dia bilang Von Neumann menulis bahwa program dan data boleh disimpan terpisah di memori berbeda untuk keamanan!', 'thinking', 'PUSTAKAWAN', '📚'),
          S('ARDI', 'Hmm... ini bertentangan dengan apa yang saya pelajari...', 'thinking'),
          S('BUDI', 'Ardi, ini tentang konsep paling fundamental! "Stored-Program Concept". Kamu pasti tahu jawabannya!', 'confident'),
          S('ARDI', 'Saya perlu evaluasi pernyataan ini dengan teliti dulu...', 'thinking'),
        ],
        outro: [
          S('ARDI', 'Essai itu SALAH arah! Justru KESAMAAN memori untuk program & data adalah revolusi Von Neumann!', 'confident'),
          S('NPC', 'Oh jadi sebenarnya VON NEUMANN menyatukan program dan data dalam satu memori?', 'normal', 'PUSTAKAWAN', '📚'),
          S('ARDI', 'Tepat! "Stored-Program Concept" — program disimpan bersama data. Ini yang membuat software bisa diubah tanpa ganti hardware!', 'happy'),
          S('BUDI', 'Ardi... besok adalah hari terakhir KP-mu. Dan ada satu kasus terakhir yang menanti. Yang terberat.', 'thinking'),
          S('ARDI', 'Kasus terakhir? Apa itu, Pak Budi?', 'thinking'),
          S('BUDI', 'Empat laporan kerusakan PC dari empat klien berbeda... sekaligus. Ini ujian final-mu!', 'confident'),
          S('ARDI', '...EMPAT sekaligus?! B-baik, Pak. Saya siap!', 'panic'),
        ]
      }),
      question_text: 'Essai mahasiswa di perpustakaan menyatakan: "Von Neumann merancang agar program & data disimpan di SATU memori yang sama — inilah Stored-Program Concept yang merevolusi komputer modern." Benar atau Salah?',
      options_json: JSON.stringify(['BENAR', 'SALAH']),
      correct_config: JSON.stringify('BENAR'),
      bloom_level: 'C5 - Mengevaluasi',
      topic: 'Stored-Program Concept',
      explanation: 'BENAR! "Stored-Program Concept" adalah DNA arsitektur Von Neumann — program dan data hidup bersama dalam satu memori. Ini memungkinkan software diubah tanpa harus mengganti hardware fisik komputer!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 10 ⚔️ UJIAN FINAL — 4 Laporan Kerusakan
    // ─────────────────────────────────────────────────────
    {
      level_number: 10,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'final_boss',
        chapter: 'Chapter 10: Ujian Terakhir — FINAL BOSS! ⚔️',
        intro: [
          S('NARASI', 'Sabtu pagi. Hari terakhir KP Ardi. Pak Budi berdiri serius di depan papan tulis dengan 4 laporan.'),
          S('BUDI', 'Ardi, selama seminggu kamu sudah buktikan dirimu. Lab Komputer, Server Room, Studio Desain...', 'normal'),
          S('BUDI', 'Rumah Pak Darmo, Data Center, Lab Storage, Kelas SMK, Lab Riset, Perpustakaan...', 'normal'),
          S('ARDI', 'Satu minggu yang luar biasa, Pak Budi. Saya banyak belajar!', 'happy'),
          S('BUDI', 'Tapi... ujian finalmu belum selesai. Empat laporan ini datang hari ini. SEKALIGUS!', 'confident'),
          S('ARDI', 'Empat sekaligus..? Oke. Terapkan semua yang sudah saya pelajari seminggu ini. Bismillah!', 'confident'),
          S('BUDI', 'Ini momen penentu, Ardi! Jodohkan setiap GEJALA KERUSAKAN dengan KOMPONEN Von Neumann yang bermasalah!', 'confident'),
        ],
        outro: [
          S('NARASI', 'Sepuluh detik hening. Ardi memeriksa jawaban terakhirnya...'),
          S('BUDI', 'Semua BENAR! Ardi... kamu LULUS dengan sempurna!', 'happy'),
          S('ARDI', 'LULUS!! Terima kasih, Pak Budi! Alhamdulillah!', 'happy'),
          S('BUDI', 'Satu minggu ini kamu tidak hanya menyelesaikan kasus-kasus nyata. Kamu telah membuktikan bahwa teori Von Neumann bukan sekadar di buku!', 'happy'),
          S('ARDI', 'Saya jadi makin cinta dengan dunia IT, Pak. Arsitektur Von Neumann ada di mana-mana!', 'happy'),
          S('NARASI', '🎉 SELAMAT! Ardi berhasil menyelesaikan seluruh misi KP-nya dengan gemilang!'),
          S('NARASI', 'Dari Lab Komputer hingga Ujian Final — setiap tantangan telah diatasi dengan ilmu yang solid.'),
          S('NARASI', '🏆 Petualangan Von Neumann Quest selesai! Kamu adalah ahli teknologi sejati!'),
        ]
      }),
      question_text: '⚔️ UJIAN FINAL! Ardi menerima 4 laporan kerusakan PC dari klien berbeda. Jodohkan setiap GEJALA dengan KOMPONEN Von Neumann yang paling mungkin bermasalah!',
      options_json: JSON.stringify({
        left: [
          'PC menyala & BIOS tampil, tapi Windows gagal loading + bunyi "tik-tik-tik"',
          'Komputer restart sendiri setiap membuka banyak tab Chrome + aplikasi besar',
          'Layar freeze & CPU usage 100% padahal hanya buka Notepad',
          'File yang baru disimpan menghilang total setelah komputer direstart'
        ],
        right: [
          'Hard Disk Drive (HDD) — bad sector / kerusakan fisik piringan',
          'RAM (Memori Utama) — kapasitas tidak mencukupi kebutuhan aplikasi',
          'CPU / Prosesor — thermal throttling / overheating parah',
          'SSD / File System — error penulisan Non-Volatile storage'
        ]
      }),
      correct_config: JSON.stringify({
        'PC menyala & BIOS tampil, tapi Windows gagal loading + bunyi "tik-tik-tik"': 'Hard Disk Drive (HDD) — bad sector / kerusakan fisik piringan',
        'Komputer restart sendiri setiap membuka banyak tab Chrome + aplikasi besar': 'RAM (Memori Utama) — kapasitas tidak mencukupi kebutuhan aplikasi',
        'Layar freeze & CPU usage 100% padahal hanya buka Notepad': 'CPU / Prosesor — thermal throttling / overheating parah',
        'File yang baru disimpan menghilang total setelah komputer direstart': 'SSD / File System — error penulisan Non-Volatile storage',
      }),
      bloom_level: 'C6 - Mengkreasi',
      topic: 'Troubleshooting Arsitektur',
      explanation: 'Bunyi "tik-tik" = HDD bad sector. Restart saat banyak aplikasi = RAM penuh. CPU 100% untuk Notepad = CPU throttling. File hilang setelah restart = masalah penulisan Non-Volatile storage!'
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log('✅ Seeded 10 connected visual novel chapters!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
