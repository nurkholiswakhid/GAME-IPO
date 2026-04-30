const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

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
    // LEVEL 1: Konsep Dasar Input (Analogi Dapur)
    // ─────────────────────────────────────────────────────
    {
      level_number: 1,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Level 1: Bahan Baku Sistem',
        intro: [
          S('NARASI', 'Pusat Simulasi Sistem. Misi pertama dimulai.'),
          S('ZENO', 'Selamat datang di Simulasi Arsitektur Von Neumann. Saya Zeno, AI Assistant Anda.', 'happy', 'ZENO'),
          S('RIVO', 'Hai Zeno! Hari ini kita akan membedakan apa yang masuk dan apa yang keluar dari sistem kan?', 'confident', 'RIVO'),
          S('ZENO', 'Benar, Rivo. Bayangkan sistem komputer seperti Dapur Restoran. "Input" adalah bahan mentah yang masuk ke dapur.', 'thinking', 'ZENO'),
          S('RIVO', 'Jadi kalau kita mengetik atau klik mouse, itu seperti memberikan pesanan dan bahan makanan ke koki?', 'normal', 'RIVO'),
          S('ZENO', 'Tepat! Sebelum koki (Prosesor) bekerja, kita harus memasukkan data yang benar.', 'confident', 'ZENO')
        ],
        outro: [
          S('ZENO', 'Analisis klasifikasi selesai. Sistem menerima input dengan baik.', 'happy', 'ZENO'),
          S('RIVO', 'Ternyata gampang ya! Keyboard, Mouse, Scanner, Microphone semua itu adalah pemberi "Bahan Baku".', 'happy', 'RIVO'),
          S('ZENO', 'Poin Perhatian: Input bukan sekadar alat, tapi jalur agar instruksi dan data bisa masuk ke dalam prosesor.', 'confident', 'ZENO')
        ]
      }),
      question_text: 'Menggunakan analogi Dapur, kelompokkan perangkat berikut ini! Identifikasi juga perangkat yang dapat berperan GANDA (Input-Output dalam fungsi berbeda) atau INTERNAL hanya.',
      options_json: JSON.stringify(['Keyboard', 'Mouse', 'Monitor', 'Printer', 'Scanner', 'Speaker', 'GPU (Kartu Grafis)', 'SSD/Hard Disk', 'RAM', 'USB Controller']),
      correct_config: JSON.stringify({
        'Pemberi Bahan (INPUT)': ['Keyboard', 'Mouse', 'Scanner'],
        'Penyaji Hidangan (OUTPUT)': ['Monitor', 'Printer', 'Speaker'],
        'Peran Ganda / Internal Koordinasi': ['GPU (Kartu Grafis)', 'SSD/Hard Disk', 'RAM', 'USB Controller']
      }),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Konsep Input & Output',
      explanation: 'Input (Keyboard, Mouse, Scanner) seperti bahan mentah dan pesanan yang masuk ke dapur. Output (Monitor, Printer) adalah hidangan matang yang disajikan kepada pengguna.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 2: Alur Linear IPO (Analogi Pabrik)
    // ─────────────────────────────────────────────────────
    {
      level_number: 2,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'data_center',
        chapter: 'Level 2: Jalur Perakitan',
        intro: [
          S('NARASI', 'Ruang Kontrol Data Center. Terjadi kemacetan arus data.'),
          S('DIRA', 'Zeno, mengapa data pembayaran user gagal dicetak di struk?', 'thinking', 'DIRA'),
          S('ZENO', 'Terdapat anomali pada alur kerjanya, Dira. Sistem mengabaikan urutan I-P-O.', 'normal', 'ZENO'),
          S('DIRA', 'Coba bayangkan ini seperti Pabrik Perakitan. Barang tidak bisa dikirim (Output) jika belum diproses, dan tidak bisa diproses jika bahan belum diterima (Input)!', 'confident', 'DIRA'),
          S('ZENO', 'Analogi Pabrik dikonfirmasi. Tugas Anda adalah memulihkan urutan linear pada mesin kasir ini.', 'thinking', 'ZENO')
        ],
        outro: [
          S('DIRA', 'Sukses! Semua berjalan lancar: Terima data -> Hitung -> Cetak!', 'happy', 'DIRA'),
          S('ZENO', 'Poin Perhatian: Konsep I-P-O bersifat sekuensial dasar. Meskipun terlihat instan di mata manusia, prosesor wajib mengikuti urutan langkah ini.', 'confident', 'ZENO')
        ]
      }),
      question_text: 'Sistem pembayaran macet karena urutan instruksinya berantakan! Susun urutan I-P-O yang benar. Tantangan: transaksi ini juga menyertakan verifikasi keamanan sebelum pembayaran disetujui.',
      options_json: JSON.stringify([
        'Tampilkan rincian struk ke layar monitor',
        'Kasir men-scan barcode barang',
        'Sistem menghitung total harga berdasarkan database',
        'Sistem verifikasi keamanan PIN/password pelanggan',
        'Hard disk mencatat transaksi dalam log penjualan'
      ]),
      correct_config: JSON.stringify([
        'Kasir men-scan barcode barang',
        'Sistem menghitung total harga berdasarkan database',
        'Sistem verifikasi keamanan PIN/password pelanggan',
        'Tampilkan rincian struk ke layar monitor',
        'Hard disk mencatat transaksi dalam log penjualan'
      ]),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Alur Sistem Von Neumann',
      explanation: 'Sistem komputer bekerja secara berurutan. SCAN barcode adalah Input. MENGHITUNG total harga adalah Proses (CPU). TAMPILKAN struk adalah Output.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 3: Dekomposisi Komponen Pemroses
    // ─────────────────────────────────────────────────────
    {
      level_number: 3,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'server_room',
        chapter: 'Level 3: Identifikasi Sang Koki',
        intro: [
          S('NARASI', 'Di dalam inti Server Room. Arka memantau aktivitas proses.'),
          S('ARKA', 'Zeno, mari kita bedah tahap PROCESS ini. CPU kan tidak bekerja sembarangan.', 'confident', 'ARKA'),
          S('ZENO', 'Benar, Arka. CPU (Central Processing Unit) memiliki bagian-bagian yang membagi beban. Kita sebut ini Dekomposisi peran koki di dapur.', 'thinking', 'ZENO'),
          S('ARKA', 'Jadi ada koki yang tugasnya menghitung resep (ALU), dan ada kepala koki pengatur urutan kerja (CU).', 'happy', 'ARKA'),
          S('ZENO', 'Dan memori CPU, yaitu Register, bertindak sebagai celemek tempat koki menyimpan catatan kecil secara kilat.', 'normal', 'ZENO')
        ],
        outro: [
          S('ARKA', 'Sempurna! Setiap subtopik dalam Proses punya tugasnya masing-masing.', 'confident', 'ARKA'),
          S('ZENO', 'Poin Perhatian: CPU tidak bekerja sendiri layaknya penyihir. CPU sangat bergantung pada interaksi antara ALU untuk eksekusi dan CU untuk mengambil arah (instruksi).', 'happy', 'ZENO')
        ]
      }),
      question_text: 'Dekonstruksi cara kerja prosesor pada kondisi pemrosesan intensif (multitasking). Jodohkan setiap bagian CPU dengan fungsi spesifiknya, termasuk peran critical path dan bottleneck yang mungkin terjadi!',
      options_json: JSON.stringify({
        left: ['ALU (Arithmetic Logic Unit)', 'CU (Control Unit)', 'Register', 'Cache L1/L2', 'Bus Sistem CPU'],
        right: [
          'Medium penyimpanan super cepat untuk instruksi frequently-used mencegah bottleneck akses memori',
          'Melakukan kalkulasi matematika dan logika (Koki Penghitung)',
          'Menyimpan instruksi dan data super cepat sementara (Saku/Catatan Koki)',
          'Mengambil instruksi dari memori dan mengatur alur eksekusi paralel (Kepala Koki Pelaksana)',
          'Jalur transportasi data antar komponen CPU internal'
        ]
      }),
      correct_config: JSON.stringify({
        'ALU (Arithmetic Logic Unit)': 'Melakukan kalkulasi matematika dan logika (Koki Penghitung)',
        'CU (Control Unit)': 'Mengambil instruksi dari memori dan mengatur alur eksekusi paralel (Kepala Koki Pelaksana)',
        'Register': 'Menyimpan instruksi dan data super cepat sementara (Saku/Catatan Koki)',
        'Cache L1/L2': 'Medium penyimpanan super cepat untuk instruksi frequently-used mencegah bottleneck akses memori',
        'Bus Sistem CPU': 'Jalur transportasi data antar komponen CPU internal'
      }),
      bloom_level: 'C5 - Menganalisis & Mensintesis',
      topic: 'Bagian Proses (CPU)',
      explanation: 'Dalam tahap rposes, Control Unit yang mengambil data, ALU yang mengeksekusi secara matematis/logika, dan Register menjadi memori kilat untuk tugas tersebut.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 4: Peran Memori Sementara & Pola Kemacetan
    // ─────────────────────────────────────────────────────
    {
      level_number: 4,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'lab_storage',
        chapter: 'Level 4: Ruang Kerja',
        intro: [
          S('NARASI', 'Pusat Data Storage. Terjadi kelambatan hebat pada sistem.'),
          S('NEXA', 'Hei, sistem melambat saat ada banyak software terbuka! Sepertinya ada pola bottleneck di sini.', 'confident', 'NEXA'),
          S('ZENO', 'Deteksi kemacetan dikonfirmasi, Nexa. Kapasitas Random Access Memory (RAM) mencapai titik kritis.', 'thinking', 'ZENO'),
          S('NEXA', 'Biar kuingat... RAM itu seperti ukuran Meja Kerja. Walaupun Koki (Prosesor) kita jenius, kalau mejanya kecil, dia nggak bisa menyiapkan banyak masakan besar sekaligus, kan?', 'thinking', 'NEXA'),
          S('ZENO', 'Deskripsi akurat. Evaluasi kondisi sistem sekarang dengan informasi ini.', 'normal', 'ZENO')
        ],
        outro: [
          S('NEXA', 'Sudah kuduga! RAM tidak menyimpan data selamanya, tapi sebagai zona kerja aktif.', 'happy', 'NEXA'),
          S('ZENO', 'Poin Perhatian: Menambah RAM memperbesar "Meja Kerja", bukan ukuran "Gudang" (Hard Drive).', 'confident', 'ZENO')
        ]
      }),
      question_text: 'Berdasarkan analisis masalah performa di atas, manakah strategi yang PALING AKURAT untuk mengatasi kelambatan sistem pada gaming dengan budget terbatas?',
      options_json: JSON.stringify([
        'Upgrade RAM DDR3 4GB → DDR4 16GB (kapasitas kerja) + replace HDD dengan SSD (kecepatan I/O)',
        'Menambah heatsink besar tanpa mengubah hardware utama',
        'Downgrade GPU dari DDR5 ke DDR4 untuk menghemat daya',
        'Hanya membersihkan debu dari heatsink sambil tetap menggunakan HDD lama'
      ]),
      correct_config: JSON.stringify('Upgrade RAM DDR3 4GB → DDR4 16GB (kapasitas kerja) + replace HDD dengan SSD (kecepatan I/O)'),
      bloom_level: 'C4 - Menganalisis & Merekomendasikan Solusi',
      topic: 'Ketergantungan Proses RAM',
      explanation: 'Upgrade RAM untuk kapasitas + SSD untuk kecepatan I/O adalah kombinasi optimal mengatasi keduanya: thrashing berkurang + I/O bottleneck teratasi. Pendinginan hanya mencegah thermal throttling tetapi tidak mengatasi masalah fundamental kapasitas dan kecepatan.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 5: Interaksi I/O Lanjut
    // ─────────────────────────────────────────────────────
    {
      level_number: 5,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'studio_it',
        chapter: 'Level 5: Kolaborasi Hardware',
        intro: [
          S('NARASI', 'Di dalam Studio Rendering. Sistem sedang menjalankan kompleksitas rendering video.'),
          S('RIVO', 'Zeno, rendering 3D ini membutuhkan aksi kolaboratif perangkat.', 'confident', 'RIVO'),
          S('ZENO', 'Data masuk dari Storage (Gudang), diproses oleh CPU dan GPU, kemudian hasil sementaranya masuk RAM.', 'thinking', 'ZENO'),
          S('RIVO', 'Ah, jadi I-P-O bukan sekadar mengetik dan mencetak. Baca file dari Hard disk juga bisa dianggap "Input" bagi Prosesor, dan menyimpannya kembali adalah "Output"!', 'happy', 'RIVO'),
          S('ZENO', 'Abstraksi yang brilian, Rivo! Sistem I-P-O dapat terjadi pada level perangkat internal.', 'confident', 'ZENO')
        ],
        outro: [
          S('RIVO', 'Mantap! Siklus IPO internal berjalan mulus.', 'happy', 'RIVO'),
          S('ZENO', 'Poin Perhatian: IPO terjadi pada banyak layer. Hard disk berperan ganda; ia mengeluarkan data (input ke CPU) dan menerima olahan spesifik (output dari CPU).', 'happy', 'ZENO')
        ]
      }),
      question_text: 'Evaluasi pernyataan Rivo berikut: "Saat merender video 4K, data mengalir dari GPU cache L3 → RAM untuk buffering → DMA Controller langsung ke SSD tanpa CPU intervensi berulang. Proses ini terjadi dalam microseconds karena koordinasi hardware dan OS scheduling yang presisi mengalirkan data secara streaming tanpa context switch yang merugikan." Apakah pemahaman ini BENAR tentang optimasi rendering modern?',
      options_json: JSON.stringify(['BENAR SEPENUHNYA - Sequence dan koordinasi dijabarkan akurat', 'SETENGAH BENAR - DMA tidak langsung dari GPU cache, harus via RAM dulu', 'SALAH - Proses rendering tidak melibatkan SSD secara langsung']),
      correct_config: JSON.stringify('BENAR SEPENUHNYA - Sequence dan koordinasi dijabarkan akurat'),
      bloom_level: 'C5 - Menganalisis Optimasi Hardware-OS',
      topic: 'Layer Internal I-P-O',
      explanation: 'BENAR. Proses rendering video menggunakan hasil penelitian dan optimasi puluhan tahun. GPU → Cache L3 → RAM untuk buffering sementara, DMA mengalirkan ke SSD tanpa membebani CPU. Koordinasi OS scheduler memastikan context switch minimal agar latency rendering rendah.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 6: Bottleneck dan Solusi Alternatif
    // ─────────────────────────────────────────────────────
    {
      level_number: 6,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'lab_komputer',
        chapter: 'Level 6: Perburuan Kemacetan (Bottleneck)',
        intro: [
          S('NARASI', 'Pusat Analisis Spesifikasi. Nexa sedang mendiagnosis rakitan komputer.'),
          S('NEXA', 'Aku melihat anomali. Beberapa rakitan PC gamer gagal memberikan FPS yang tinggi.', 'thinking', 'NEXA'),
          S('ARKA', 'Ya, karena mereka asal menggabungkan komponen. Ini menyebabkan bottleneck!', 'confident', 'ARKA'),
          S('NEXA', 'Bayangkan kamu punya mesin balap V8 (CPU super) tapi dipasang roda sepeda kecil (RAM lambat).', 'happy', 'NEXA'),
          S('ZENO', 'Harmoni I-P-O patah di kasus tersebut. Mari pisahkan komponen dengan benar untuk mencari kompatibilitas alir data.', 'normal', 'ZENO')
        ],
        outro: [
          S('NEXA', 'Bagus! Aku menemukan keseimbangan alur antar perangkat.', 'confident', 'NEXA'),
          S('ZENO', 'Poin Perhatian: Proses sehebat apapun (CPU mumpuni) akan sia-sia bila jalur input dan output (bus sistem / RAM lambat) tidak mampu mengimbanginya.', 'happy', 'ZENO')
        ]
      }),
      question_text: 'Arka menghadapi 4 kasus bottleneck berbeda. Manakah yang memerlukan STRATEGI DIAGNOSA DAN SOLUSI PALING KOMPLEKS karena melibatkan koordinasi multiple hardware layer dan OS memory management?',
      options_json: JSON.stringify([
        'Prosesor panas 85°C → Clean heatsink, apply thermal paste baru',
        'RAM 4GB untuk 4K editing + HDD 5400RPM sistem → Upgrade RAM ke 32GB DDR4 + ganti ke SSD, plus OS tuning memory cache strategy',
        'GPU PCIe 3.0 vs slot PCIe 4.0 → update motherboard atau downgrade card',
        'Database queries lambat → tambah index database saja'
      ]),
      correct_config: JSON.stringify('RAM 4GB untuk 4K editing + HDD 5400RPM sistem → Upgrade RAM ke 32GB DDR4 + ganti ke SSD, plus OS tuning memory cache strategy'),
      bloom_level: 'C5 - Sintesis Diagnosa Multi-layer',
      topic: 'Optimalisasi Proses',
      explanation: 'Masalah thermal = fix fisik sederhana. Masalah RAM+HDD bottleneck membutuhkan diagnosis mendalam: memory paging thrashing, buffer misses, OS cache invalidation, context switch overhead. Solusi memerlukan upgrade multiple komponen + OS tuning yang sophisticated.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 7: Pengenalan Sistem Operasi (Tugas Manajer)
    // ─────────────────────────────────────────────────────
    {
      level_number: 7,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'kelas_smk',
        chapter: 'Level 7: Sang Manajer Hadir',
        intro: [
          S('NARASI', 'Pusat Komando Perangkat Lunak mulai online.'),
          S('DIRA', 'Zeno, kita sudah mengerti hardware. Tapi bagaimana monitor, CPU, dan printer bisa bekerja selaras tanpa tabrakan?', 'thinking', 'DIRA'),
          S('ZENO', 'Karena mereka dioperasikan oleh Sistem Operasi (OS) Windows/Linux/Mac. OS itu layaknya Manajer Konstruksi.', 'confident', 'ZENO'),
          S('DIRA', 'Jadi OS bukanlah alat fisik? Dia adalah Software yang memimpin Software lain untuk berbicara pada Hardware?', 'happy', 'DIRA'),
          S('ZENO', 'Tepat! Tanpa OS, CPU dan hardware I/O tidak akan dapat menerima perintah dari program biasa yang kamu gunakan.', 'thinking', 'ZENO')
        ],
        outro: [
          S('DIRA', 'Memang betul! OS itu bertugas mengatur hardware. Tanpa OS, perangkat hanya besi tua!', 'happy', 'DIRA'),
          S('ZENO', 'Poin Perhatian: Sistem operasi bukanlah alat fisik (hardware) dan bukanlah program aplikasi. OS adalah sistem dasar (System Software) administrator kontrol.', 'confident', 'ZENO')
        ]
      }),
      question_text: 'Dira menonton bagaimana OS melayani multiple perangkat input secara bersamaan (keyboard, mouse, network adapter). Susun urutan algoritma OS dalam menangani scenario realistic saat ketiga device mengirim interrupt hampir bersamaan!',
      options_json: JSON.stringify([
        'CPU menerima Interrupt Signal dari Programmable Interrupt Controller (PIC), CPU alert status flag berubah',
        'OS Interrupt Handler mengecek Interrupt Vector Table (IVT) untuk menentukan prioritas interrupt mana yang diproses duluan (keyboard > network > mouse umum)',
        'OS simpan CPU state (register, program counter) ke memory stack untuk kelak restore',
        'OS execute Interrupt Service Routine (ISR) untuk device prioritas tertinggi, misal read keyboard dan simpan ke buffer',
        'OS defer interrupt berprioritas rendah ke interrupt queue untuk diproses kemudian',
        'OS restore CPU state dari stack dan lanjutkan program user yang tadi terjeda'
      ]),
      correct_config: JSON.stringify([
        'CPU menerima Interrupt Signal dari Programmable Interrupt Controller (PIC), CPU alert status flag berubah',
        'OS Interrupt Handler mengecek Interrupt Vector Table (IVT) untuk menentukan prioritas interrupt mana yang diproses duluan (keyboard > network > mouse umum)',
        'OS simpan CPU state (register, program counter) ke memory stack untuk kelak restore',
        'OS execute Interrupt Service Routine (ISR) untuk device prioritas tertinggi, misal read keyboard dan simpan ke buffer',
        'OS defer interrupt berprioritas rendah ke interrupt queue untuk diproses kemudian',
        'OS restore CPU state dari stack dan lanjutkan program user yang tadi terjeda'
      ]),
      bloom_level: 'C4 - Menganalisis Interrupt Sophisticated',
      topic: 'Dasar Sistem Operasi',
      explanation: 'Sistem Operasi ibarat Manajer yang menghubungkan hardware (pekerja keras) dengan software pengguna (pelanggan), secara cermat mengatur siapa dapat sumber daya.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 8: Interupsi & Manajemen OS
    // ─────────────────────────────────────────────────────
    {
      level_number: 8,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'lab_riset',
        chapter: 'Level 8: Konflik Data (Interrupt)',
        intro: [
          S('NARASI', 'Sistem menghadapi prioritas ganda secara bersamaan.'),
          S('ARKA', 'Zeno! Saat saya mengetik dan mendengarkan musik, tiba-tiba ada peringatan Baterai Lemah!', 'panic', 'ARKA'),
          S('ZENO', 'Itu adalah Interrupt (Interupsi), Arka. OS harus membuat keputusan manajemen sumber daya segera.', 'normal', 'ZENO'),
          S('ARKA', 'Jadi OS langsung menjeda aplikasi musik untuk memunculkan jendela dialog baterai tersebut?', 'thinking', 'ARKA'),
          S('ZENO', 'Betul. Algoritma pengelolaan proses mengharuskan OS menilai prioritas. Analisis mekanisme interrupt yang terjadi.', 'confident', 'ZENO')
        ],
        outro: [
          S('ARKA', 'Woow! Sistem Operasi sangat canggih merebut kontrol lalu mengembalikannya.', 'happy', 'ARKA'),
          S('ZENO', 'Poin Perhatian: CPU merespons interupsi seolah melompat tugas, OS memanajemen peralihannya agar tidak ada progam yang crash.', 'confident', 'ZENO')
        ]
      }),
      question_text: 'Arka menganalisis mekanisme interrupt modern: "Ketika keyboard dan network adapter mengirim interrupt bersamaan, Programmable Interrupt Controller (PIC) mengirimkan signal cpu interrupt. OS Interrupt Handler melihat IVT, menentukan device mana berprioritas (biasanya keyboard > network > disk). OS save registers ke stack, execute ISR untuk device prioritas tinggi dulu, defer yang lain ke queue, baru restore registers dan resume program user. Tanpa mekanisme ini, program akan crash dari data corruption atau infinite loop." Apakah penjelasan mekanisme interrupt Arka BENAR sepenuhnya?',
      options_json: JSON.stringify(['BENAR SEPENUHNYA - Penjelasan hardware dan OS coordination akurat', 'SETENGAH BENAR - Stack push/pop tidak diperlukan untuk interrupt handling', 'SALAH - PIC bukan component yang mengatur prioritas, hanya CPU']),
      correct_config: JSON.stringify('BENAR SEPENUHNYA - Penjelasan hardware dan OS coordination akurat'),
      bloom_level: 'C5 - Evaluasi Mekanisme Interrupt',
      topic: 'Interrupt Handling Sophisticated',
      explanation: 'BENAR. Programmable Interrupt Controller (PIC) adalah hardware yang mengelola interrupt prioritas. OS menggunakan Interrupt Vector Table (IVT) untuk menentukan ISR mana. Save-restore registers pada stack adalah standar untuk preemptive multitasking.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 9: Komunikasi OS dengan Driver (Abstraksi)
    // ─────────────────────────────────────────────────────
    {
      level_number: 9,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'perpustakaan',
        chapter: 'Level 9: Bahasa Rahasia Hardware',
        intro: [
          S('NARASI', 'Pusat Dokumentasi Abstraksi Sistem. Nexa menemukan modul tua.'),
          S('NEXA', 'Aku pasang VGA card baru, tapi monitor blank. Padahal VGA ini perangkat I/O paling mahal.', 'sad', 'NEXA'),
          S('ZENO', 'Sistem Operasi tidak langsung memahami semua jenis hardware di dunia. Ia butuh kamus penerjemah.', 'thinking', 'ZENO'),
          S('NEXA', 'Oh aku paham konsep Abstraksinya! Kamus penerjemah ini pasti yang dinamakan Device Driver!', 'happy', 'NEXA'),
          S('ZENO', 'Benar, Nexa. Bantu sistem mengklasifikasi layer-layer dalam software to hardware communication stack.', 'confident', 'ZENO')
        ],
        outro: [
          S('NEXA', 'Installasi Driver berhasil! VGA langsung berbicara pada OS.', 'happy', 'NEXA'),
          S('ZENO', 'Poin Perhatian: Hardware I/O bagai turis asing, Device Driver adalah penterjemahnya, dan OS Windows kita adalah pemandunya.', 'happy', 'ZENO')
        ]
      }),
      question_text: 'Nexa menemukan berbagai komponen dalam stack software-to-hardware. Klasifikasi berikut sesuai dengan layer abstraksi dan permission model mereka!',
      options_json: JSON.stringify([
        'Ms.Word text editor - baca/tulis dokumen dari disk',
        'Windows Kernel Scheduler - allocate CPU timeslice, manage process queue',
        'NVIDIA GPU Driver - translate DirectX calls ke GPU ISA, manage interrupt vectors',
        'BIOS/UEFI Firmware - initialize motherboard, detect hardware, setup interrupt routing',
        'SSD Hardware Controller - receive electrical signals dari driver, execute write operations',
        'System API (Syscall) - interface untuk user program memanggil OS services'
      ]),
      correct_config: JSON.stringify({
        'User Space Layer - Restricted Access (No Direct HW)': [
          'Ms.Word text editor - baca/tulis dokumen dari disk',
          'System API (Syscall) - interface untuk user program memanggil OS services'
        ],
        'Kernel Space Layer - Privileged (Resource Control)': [
          'Windows Kernel Scheduler - allocate CPU timeslice, manage process queue',
          'NVIDIA GPU Driver - translate DirectX calls ke GPU ISA, manage interrupt vectors'
        ],
        'Firmware/Hardware Layer - Complete Control': [
          'BIOS/UEFI Firmware - initialize motherboard, detect hardware, setup interrupt routing',
          'SSD Hardware Controller - receive electrical signals dari driver, execute write operations'
        ]
      }),
      bloom_level: 'C4 - Analisis Privilege Level Architecture',
      topic: 'Driver dalam Komunikasi I/O',
      explanation: 'Aplikasi user space tidak bisa akses hardware langsung - harus melalui syscall ke kernel. Kernel (OS + driver) punya privilege mode untuk dialog hardware. Firmware/hardware layer punya kontrol penuh.'
    },

    // ─────────────────────────────────────────────────────
    // LEVEL 10: Integrasi Total - Evaluasi Sistem
    // ─────────────────────────────────────────────────────
    {
      level_number: 10,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'final_boss',
        chapter: 'Level 10: Eksekusi Utama',
        intro: [
          S('NARASI', 'Ujian Akhir Simulasi. Sistem berjalan 100%. Semua entitas berkumpul.'),
          S('ZENO', 'Operasi final. Semua konsep Input-Process-Output dan Sistem Operasi kini terhubung.', 'confident', 'ZENO'),
          S('RIVO', 'Kita sudah membuktikan peran Input dan Output yang sekuensial.', 'happy', 'RIVO'),
          S('NEXA', 'Serta mengidentifikasi sumbatan bottleneck dan pentingnya RAM!', 'happy', 'NEXA'),
          S('ARKA', 'Hingga peran OS dan Device driver sebaga sang manajer pengendali.', 'happy', 'ARKA'),
          S('DIRA', 'Waktunya mengambil inferensi terakhir! Selesaikan simulasi ini!', 'confident', 'DIRA'),
          S('ZENO', 'Final Synthesis - Match setiap konsep dengan implementasi konkret yang saling bergantung.', 'normal', 'ZENO')
        ],
        outro: [
          S('ZENO', 'SIMULASI BERHASIL! Selamat!', 'happy', 'ZENO'),
          S('RIVO', 'Luar biasa! Kita melampaui kompleksitas mesin dengan analogi sederhana.', 'happy', 'RIVO'),
          S('ZENO', 'Poin Perhatian Akhir: Von Neumann Architecture bukan sekadar mesin tik tua. Ini adalah dasar setiap komputer modern, HP, dan AI yang Anda gunakan saat ini.', 'confident', 'ZENO'),
          S('NARASI', 'PBL SIMULATION COMPLETED. Terima kasih telah berpartisipasi.')
        ]
      }),
      question_text: 'Final Synthesis: Pada ujian akhir Von Neumann Architecture Simulation, jodohkan setiap konsep dengan implementasi konkret dalam sistem yang saling bergantung!',
      options_json: JSON.stringify({
        left: [
          'Input-Process-Output (I-P-O) Model',
          'Resource Allocation & Fair Sharing',
          'Memory Hierarchy Management',
          'Interrupt Handling & Concurrency',
          'Abstraction Layers & Device Drivers'
        ],
        right: [
          'Keyboard input → CPU processing → monitor output; setiap device harus terkoordinasi chronologically',
          'CPU scheduler membagi CPU time, memory manager membagi RAM, disk scheduler membagi I/O bandwidth secara fair',
          'Register (fastest) → L1/L2/L3 cache → RAM → disk storage; OS page replacement policy menjaga data di layer optimal',
          'Programmable Interrupt Controller + Interrupt Vector Table + priority queue = OS handle simultaneous events tanpa corruption',
          'Application calls syscall → OS kernel melalui privileged mode → device driver → hardware ISA; isolasi privilege level'
        ]
      }),
      correct_config: JSON.stringify({
        'Input-Process-Output (I-P-O) Model': 'Keyboard input → CPU processing → monitor output; setiap device harus terkoordinasi chronologically',
        'Resource Allocation & Fair Sharing': 'CPU scheduler membagi CPU time, memory manager membagi RAM, disk scheduler membagi I/O bandwidth secara fair',
        'Memory Hierarchy Management': 'Register (fastest) → L1/L2/L3 cache → RAM → disk storage; OS page replacement policy menjaga data di layer optimal',
        'Interrupt Handling & Concurrency': 'Programmable Interrupt Controller + Interrupt Vector Table + priority queue = OS handle simultaneous events tanpa corruption',
        'Abstraction Layers & Device Drivers': 'Application calls syscall → OS kernel melalui privileged mode → device driver → hardware ISA; isolasi privilege level'
      }),
      bloom_level: 'C6 - Sintesis Komprehensif & Evaluasi',
      topic: 'Von Neumann Architecture Synthesis',
      explanation: 'SEMPURNA! Kelima konsep terhubung membentuk ekosistem sempurna. I-P-O adalah struktur dasar; Resource Allocation memastikan multi-user fairness; Memory Hierarchy mengoptimalkan kecepatan; Interrupt Handling memungkinkan concurrency; Abstraction Layers melindungi hardware dari aplikasi. Tanpa satu pun, komputer modern tidak bisa berfungsi.'
    }
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log('✅ Seeded new 10 levels for Game Edukasi PBL: Simulasi IPO & Sistem Operasi');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
