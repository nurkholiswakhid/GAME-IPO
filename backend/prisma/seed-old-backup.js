const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Helper to create story dialog arrays
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
        chapter: 'Chapter 1: Hari Pertama KP IT',
        intro: [
          S('NARASI', 'Pagi hari, Senin, 07.30 WIB. SMK Negeri 1 Lamongan.'),
          S('NARASI', 'Reza — mahasiswa D3 IT — memulai Kerja Praktik hari ini di Lab Komputer SMKN 1.'),
          S('BUDI', 'Selamat datang, Reza! Saya Pak Budi, Guru IT. Kamu datang di saat yang tepat!', 'thinking'),
          S('REZA', 'Terima kasih, Pak. Ada apa?', 'normal'),
          S('BUDI', 'Kami punya 5 hardware rusak tapi saya bingung prioritas perbaikan. Yang kritis duluan atau yang gampang dulu?', 'panic'),
          S('REZA', 'Apa saja hardwarenya, Pak?', 'thinking'),
          S('BUDI', 'Ada monitor rusak, UPS mati, keyboard error, harddisk penuh, dan printer offline!', 'panic'),
          S('REZA', 'Aha! Ini tentang triage support tickets!', 'confident'),
        ],
        outro: [
          S('BUDI', 'Sempurna! Kamu tahu prioritas perbaikan berdasarkan impact-nya!', 'happy'),
          S('REZA', 'Iya, Pak. UPS kritis karena bisa sebabkan data loss. Monitor juga penting untuk usability!', 'confident'),
          S('BUDI', 'Benar! Manajemen prioritas adalah skill IT support penting. Ada issue lagi di server room. Mau?', 'thinking'),
          S('REZA', 'Server room? Siap, Pak!', 'confident'),
        ]
      }),
      question_text: '⚠️ Lab Komputer chaos! Ada 5 hardware error: Monitor rusak, UPS mati, Keyboard error, Harddisk penuh, Printer offline. Prioritas perbaikan mana dulu berdasarkan DAMPAK OPERASIONAL?',
      options_json: JSON.stringify(['Monitor Rusak', 'UPS Mati', 'Keyboard Error', 'Harddisk Penuh', 'Printer Offline']),
      correct_config: JSON.stringify({
        'KRITIS (Fix Immediately)': ['UPS Mati', 'Harddisk Penuh'],
        'TINGGI (Fix Soon)': ['Monitor Rusak'],
        'SEDANG (Fix Later)': ['Keyboard Error', 'Printer Offline'],
      }),
      bloom_level: 'C2 - Memahami',
      topic: 'Prioritas Perbaikan Hardware',
      explanation: 'UPS & Storage = risiko data loss (KRITIS). Monitor = produktivitas terhenti (TINGGI). Keyboard & Printer = workaround ada (SEDANG). Prioritas berdasarkan business impact!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 2 — Studio Desain Kota Lamongan
    // ─────────────────────────────────────────────────────
    {
      level_number: 2,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'server_room',
        chapter: 'Chapter 2: Chaos di Studio Desain',
        intro: [
          S('NARASI', 'Siang hari. Studio Desain Grafis "KreatiLab" di pusat kota Lamongan. Suasana sangat chaos!'),
          S('NPC', 'Tolong, Ardi! Project deadline besok 2 jam! Tapi timeline kerjanya berantakan!', 'panic', 'REZA'),
          S('ARDI', 'Tenang, Pak. Ceritakan prosesnya dari awal.', 'thinking'),
          S('NPC', 'Client minta poster band. Tapi tim saya tidak tahu urutan kerja yang benar! Ada briefing, konsep, design, revisi, final...', 'panic', 'REZA'),
          S('ARDI', 'Ah, itu prosesnya. Urutan sangat penting agar desain berkualitas...', 'thinking'),
          S('BUDI', 'Ardi, ingatkan mereka: penelitian terlebih dahulu baru brainstorm! Jangan langsung design!', 'thinking'),
          S('ARDI', 'Betul, Pak! Mari saya susun urutan proses desain yang tepat!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Nah! Urutan yang benar: Briefing ➜ Research ➜ Brainstorm ➜ Konsep ➜ Design ➜ Revisi ➜ Final!', 'happy'),
          S('NPC', 'Wah, ternyata gitu prosesnya! Sekarang jelas kenapa hasilnya sering kena reject!', 'happy', 'REZA'),
          S('BUDI', 'Kerja bagus, Ardi. Proses desain yang terstruktur adalah kunci klien puas.', 'happy'),
          S('ARDI', 'Pak, ada project lagi ungkin untuk studio lain?', 'normal'),
          S('BUDI', 'Ada. Kantor printing bilang ada masalah fonts di desain export mereka. Ayo ke sana!', 'thinking'),
        ]
      }),
      question_text: 'Studio desain chaos! Pak Reza bingung urutan proses design yang benar. Ardi harus menyusun tahapan dari awal sampai klien menerima desain final!',
      options_json: JSON.stringify([
        'Design — Membuat komposisi visual sesuai konsep yang sudah disetujui',
        'Brainstorm — Mengumpulkan ide-ide kreatif dengan tim',
        'Briefing — Klien menjelaskan kebutuhan & target desain',
        'Research — Mempelajari brand, kompetitor, trend pasar terkini',
        'Konsep — Menuangkan ide terbaik menjadi arah visual',
        'Revisi — Menerima feedback klien & perbaikan desain',
        'Final — Deliver file publish-ready ke klien',
      ]),
      correct_config: JSON.stringify([
        'Briefing — Klien menjelaskan kebutuhan & target desain',
        'Research — Mempelajari brand, kompetitor, trend pasar terkini',
        'Brainstorm — Mengumpulkan ide-ide kreatif dengan tim',
        'Konsep — Menuangkan ide terbaik menjadi arah visual',
        'Design — Membuat komposisi visual sesuai konsep yang sudah disetujui',
        'Revisi — Menerima feedback klien & perbaikan desain',
        'Final — Deliver file publish-ready ke klien',
      ]),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'Proses Desain Profesional',
      explanation: 'Proses design: Briefing ➔ Research (pahami klien) ➔ Brainstorm ➔ Konsep (arah visual) ➔ Design (eksekusi) ➔ Revisi ➔ Final. Jangan terburu-buru jump ke design sebelum research selesai!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 3 — Kantor Printing Klien
    // ─────────────────────────────────────────────────────
    {
      level_number: 3,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'studio_it',
        chapter: 'Chapter 3: Problem Typography',
        intro: [
          S('NARASI', 'Sore hari. Kantor Percetakan "PrintMaster" di tepi kota.'),
          S('NPC', 'Ardi! Syukurlah kamu datang! File desain poster dari studio kemarin, font-nya jelek di cetak!', 'panic', 'SARI'),
          S('ARDI', 'Font jelek gimana, Mbak? Bisa dijelaskan?', 'thinking'),
          S('NPC', 'Font scriptnya terlalu tipis, tidak fokus di ukuran cetak kecil. Banyak garis putus-putus!', 'panic', 'SARI'),
          S('ARDI', 'Ah, klasik! Masalah cetak dengan font jenis apa...', 'thinking'),
          S('BUDI', 'Ardi, ini tentang font family! Serif vs Sans-serif punya karakteristik berbeda di cetak!', 'thinking'),
          S('ARDI', 'Oh! Justru untuk cetak kecil, sans-serif atau serif tebal lebih cocok!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Ganti font-nya jadi "Helvetica Bold" atau "Georgia". Keduanya cocok cetak kecil!', 'confident'),
          S('NPC', 'Wah, bedanya apa sih? Sebelumnya pakai Script Italic tipis...', 'thinking', 'SARI'),
          S('ARDI', 'Script itu dekoratif, cocok headline besar. Tapi serif/sans-serif tebal lebih readabel di cetak kecil!', 'happy'),
          S('BUDI', 'Benar. Typography untuk digital berbeda dari cetak. Fontnya pun perlu disesuaikan dpi dan ukurannya.', 'happy'),
          S('ARDI', 'Pak, setelah ini ada project apa lagi?', 'normal'),
          S('BUDI', 'Ada klien telpon. Anaknya bilang kalau warna "biru" di folder project aman dan cocok cetak tanpa perlu color correction!', 'thinking'),
        ]
      }),
      question_text: 'Font di poster terlihat jelek saat dicetak! Garis-garis tipis font Script Italic "putus-putus". Font MANA yang paling cocok untuk cetakan kecil dengan keterbacaan maksimal?',
      options_json: JSON.stringify([
        'Script Italic Tipis — Elegan dan dekoratif',
        'Serif Bold (Georgia) — Readabel cetak, ada kaki garis',
        'Sans-Serif Bold (Helvetica) — Readabel cetak, garis tegas',
        'Display Decorative — Unik tapi sulit dibaca cetak kecil'
      ]),
      correct_config: JSON.stringify('Sans-Serif Bold (Helvetica) — Readabel cetak, garis tegas'),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Typography untuk Cetak',
      explanation: 'Script tipis jelek di cetak kecil! Font untuk cetak harus Bold (tebal) dengan letterform jelas. Sans-Serif (Helvetica, Arial) atau Serif (Georgia, Times) Bold yang terbaik!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 4 — Rumah Klien
    // ─────────────────────────────────────────────────────
    {
      level_number: 4,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'rumah_user',
        chapter: 'Chapter 4: Miskonsepsi Warna',
        intro: [
          S('NARASI', 'Malam hari. Rumah di perumahan Lamongan Baru. Klien sidang dengan anaknya.'),
          S('NPC', 'Mas Ardi, anak saya bilang warna "biru muda" di design saya aman dan cocok cetak tanpa color correction!', 'thinking', 'PAK DARMO'),
          S('ARDI', 'Hmm, nama "biru muda" itu dari mana?', 'thinking'),
          S('NPC', 'Dari file design RGB di laptop dia. Dia bilang, "Kan cuma ganti mode cetak jadi CMYK, pasti aman!"', 'sad', 'PAK DARMO'),
          S('ARDI', 'Astaga... dan hasilnya?', 'panic'),
          S('NPC', 'Hasilnya kusam sekali! Beda jauh dari yang di design dulu!', 'sad', 'PAK DARMO'),
          S('BUDI', 'Ardi, ini kesempatan edukasi penting! Jelaskan perbedaan RGB cetak dan perubahan CMYK!', 'thinking'),
        ],
        outro: [
          S('ARDI', 'Pernyataan itu SALAH, Pak. Konversi RGB ke CMYK bisa mengubah warna secara drastis!', 'confident'),
          S('NPC', 'Mengapa bisa berbeda jauh? Padahal warnanya sama, to?', 'normal', 'PAK DARMO'),
          S('ARDI', 'RGB itu cahaya (layar), CMYK itu tinta cetak. Rentang warna RGB lebih luas dari CMYK!', 'confident'),
          S('ARDI', 'Warna "biru cerah" RGB tidak bisa replikasi sempurna di CMYK. Jadi lebih kusam.', 'happy'),
          S('BUDI', 'Solusinya? Proofing dan color correction SEBELUM cetak, bukan setelah!', 'happy'),
          S('ARDI', 'Pak, besok ada yang lagi?', 'normal'),
          S('BUDI', 'Ada. Percetakan besar butuh bantuan. Ada 4 format warna yang perlu dicocokkan dengan penggunaannya!', 'thinking'),
        ]
      }),
      question_text: 'Klien percaya anaknya yang bilang: "Warna biru muda di design RGB aman untuk cetak CMYK tanpa perbaikan warna!" Benar atau Salah?',
      options_json: JSON.stringify(['BENAR', 'SALAH']),
      correct_config: JSON.stringify('SALAH'),
      bloom_level: 'C5 - Mengevaluasi',
      topic: 'Color Mode Conversion',
      explanation: 'SALAH! RGB (cahaya) dan CMYK (tinta) punya gamut warna berbeda. RGB lebih luas. Konversi RGB➜CMYK pasti ada color shift. HARUS ada proofing & color correction sebelum cetak!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 5 — Percetakan Besar Surabaya
    // ─────────────────────────────────────────────────────
    {
      level_number: 5,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'data_center',
        chapter: 'Chapter 5: Ujian Warna di Percetakan',
        intro: [
          S('NARASI', 'Selasa pagi. Percetakan Besar Tier-1, Surabaya. Mesin cetak besar berjajar rapi.'),
          S('NPC', 'Selamat datang, Mas Ardi, Pak Budi! Saya Wira, Head Print Dept di sini.', 'normal', 'WIRA'),
          S('ARDI', 'Wah, fasilitasnya profesional sekali, Pak Wira!', 'happy'),
          S('NPC', 'Terima kasih. Kami baru hire 4 designer junior lokal. Mereka harus tahu perbedaan format warna sebelum kerja!', 'normal', 'WIRA'),
          S('BUDI', 'Ardi, kamu buat soal testing-nya! Jodohkan format warna dengan penggunaan yang tepat!', 'confident'),
          S('ARDI', 'Baik! RGB, CMYK, HEX, Pantone... semua harus mereka pahami!', 'confident'),
        ],
        outro: [
          S('NARASI', 'Sepuluh menit kemudian...'),
          S('NPC', 'Sempurna! Semua designer junior lulus! Mereka sekarang paham kapan pakai RGB, CMYK, HEX!', 'happy', 'WIRA'),
          S('ARDI', 'RGB untuk digital, CMYK untuk cetak offset, HEX untuk web/UI, Pantone untuk warna khusus!', 'happy'),
          S('BUDI', 'Excellent! Kamu sudah jadi "color consultant" yang handal, Ardi!', 'happy'),
          S('NPC', 'Ada satu project lagi untuk minggu depan. Asset library kami kacau organisasinya.', 'thinking', 'WIRA'),
          S('ARDI', 'Asset library? Mau saya bantu organisir!', 'confident'),
        ]
      }),
      question_text: '⚡ Testing untuk designer junior! Wira minta Ardi jodohkan FORMAT WARNA dengan PENGGUNAAN yang paling tepat untuk setiap medium!',
      options_json: JSON.stringify({
        left: ['RGB Color Mode', 'CMYK Color Mode', 'HEX Code Color', 'Pantone PMS Color'],
        right: [
          'Editing: software saat design display/digital.',
          'Percetakan: offset printing untuk media cetak berkualitas tinggi.',
          'Web/Mobile: coding CSS & desain interface digital.',
          'Branding: warna eksklusif brand yang konsisten semua medium.'
        ]
      }),
      correct_config: JSON.stringify({
        'RGB Color Mode': 'Editing: software saat design display/digital.',
        'CMYK Color Mode': 'Percetakan: offset printing untuk media cetak berkualitas tinggi.',
        'HEX Code Color': 'Web/Mobile: coding CSS & desain interface digital.',
        'Pantone PMS Color': 'Branding: warna eksklusif brand yang konsisten semua medium.',
      }),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Color Modes & Standards',
      explanation: 'RGB = Cahaya (design) | CMYK = Tinta (cetak) | HEX = Web coding | Pantone = Brand identity. Masing-masing punya konteks pakai yang sangat spesifik!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 6 — Asset Library Percetakan
    // ─────────────────────────────────────────────────────
    {
      level_number: 6,
      type: 'CLASSIFICATION',
      story_json: JSON.stringify({
        scene: 'lab_storage',
        chapter: 'Chapter 6: Organisir Asset Library',
        intro: [
          S('NARASI', 'Ruang file server percetakan. Folder-folder design terlihat berantakan.'),
          S('NPC', 'Mas Ardi! Kacau sekali! Ada AI, PSD, JPEG, SVG semua campur aduk di satu folder!', 'panic', 'DITO'),
          S('ARDI', 'Waduh, file format campur aduk! Susah dicari yang mana!', 'thinking'),
          S('NPC', 'Iya! Saya tidak tahu mana file kerja, mana file final, mana hasil export!', 'panic', 'DITO'),
          S('ARDI', 'Tenang. Ini bisa diorganisir berdasarkan tipe file dan fungsinya!', 'confident'),
          S('BUDI', 'Bagus, Ardi! Ingatkan tentang perbedaan Vector, Raster, dan Working File!', 'happy'),
        ],
        outro: [
          S('ARDI', 'Selesai! Sekarang terorganisir: Folder Adobe untuk working files, Folder Export untuk hasil jadi!', 'happy'),
          S('NPC', 'Wow, jadi rapi gini! SVG sama AI ke folder Vector, JPEG ke Raster export... jelas!', 'happy', 'DITO'),
          S('BUDI', 'Benar. Sistem folder yang logis menghemat waktu cari file. Penting banget untuk agency besar!', 'happy'),
          S('ARDI', 'Pak, sudah minggu kedua. Masih ada project lagi?', 'normal'),
          S('BUDI', 'Ada. Workshop pengajaran design di SMKN 1. Kali ini kamu yang jadi semacam mentor junior!', 'thinking'),
        ]
      }),
      question_text: 'Asset library chaos! Ada AI, PSD, JPEG, SVG, EPS semua campur di 1 folder. Ardi perlu organize berdasarkan FORMAT & FUNGSI. Klasifikasikan dengan benar!',
      options_json: JSON.stringify(['Adobe Illustrator (AI)', 'Photoshop Document (PSD)', 'Joint Photographic (JPEG)', 'Scalable Vector (SVG)', 'Encapsulated Postscript (EPS)']),
      correct_config: JSON.stringify({
        'WORKING FILES (Editing — disimpan di PC lokal)': ['Adobe Illustrator (AI)', 'Photoshop Document (PSD)'],
        'EXPORT FILES (Final — disimpan di server backup)': ['Joint Photographic (JPEG)', 'Scalable Vector (SVG)', 'Encapsulated Postscript (EPS)'],
      }),
      bloom_level: 'C3 - Mengaplikasikan',
      topic: 'File Format & Organization',
      explanation: 'Working files (AI, PSD) = editing document. Export files (JPEG, SVG, EPS) = final delivery. Sistem folder yang jelas menghemat waktu dan prevent file corruption!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 7 — Workshop SMKN 1
    // ─────────────────────────────────────────────────────
    {
      level_number: 7,
      type: 'SEQUENCE',
      story_json: JSON.stringify({
        scene: 'kelas_smk',
        chapter: 'Chapter 7: Ardi Sebagai Mentor!',
        intro: [
          S('NARASI', 'Rabu pagi. Kelas XI DKV SMKN 1 Lamongan. 30 murid menunggu workshop mentor.'),
          S('NPC', 'Selamat datang, Mas Ardi! Murid-murid sudah siap belajar!', 'happy', 'BU AINI'),
          S('ARDI', 'Terima kasih, Bu Aini! Pai teman-teman! Hari ini "Workflow Design dari Briefing hingga Delivery"!', 'happy'),
          S('NPC', 'Mas, pertanyaan! Kalau design saya di-reject klien, apa yang harus saya lakukan?', 'normal', 'SISWA RINA'),
          S('ARDI', 'Pertanyaan bagus! Itu bagian dari tahap "Revisi" dalam proses design!', 'happy'),
          S('ARDI', 'Yuk kita susun ulang urutan workflow dari user submit design sampai klien happy!', 'confident'),
        ],
        outro: [
          S('NPC', 'Wow! Jadi gitu alurnya! Design ➜ Present ➜ Feedback ➜ Revisi ➜ Final ➜ Deliver!', 'happy', 'SISWA RINA'),
          S('ARDI', 'Tepat! Dan jangan lupa dokumentasi setiap tahap untuk portfolio!', 'happy'),
          S('NPC', 'Keren banget mentor-nya! Jelas dan mudah dipahami, Mas!', 'happy', 'BU AINI'),
          S('BUDI', 'Ardi, ada email mendesak dari creative agency di kota. Ada UX problem di aplikasi mereka!', 'thinking'),
          S('ARDI', 'UX problem? Itu tentang user experience kan? Menarik!', 'confident'),
        ]
      }),
      question_text: 'Ardi mengajar workflow design! Rina bertanya: urutan workflow setelah design jadi, hingga klien puas dan bayar. Susun tahapannya dengan benar!',
      options_json: JSON.stringify([
        'Deliver — Serah file final & dokumentasi ke klien',
        'Design — Buat final art sesuai konsep yang disetujui',
        'Present — Presentasi draft design ke klien',
        'Revisi — Menerima feedback & perbaikan design',
        'Approval — Klien setuju final version, approval untuk print/publish',
      ]),
      correct_config: JSON.stringify([
        'Design — Buat final art sesuai konsep yang disetujui',
        'Present — Presentasi draft design ke klien',
        'Revisi — Menerima feedback & perbaikan design',
        'Approval — Klien setuju final version, approval untuk print/publish',
        'Deliver — Serah file final & dokumentasi ke klien',
      ]),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Workflow Design Profesional',
      explanation: 'Design ➔ Present (jangan langsung deliver!) ➔ Revisi (sesuai feedback) ➔ Approval (final) ➔ Deliver (dengan dokumen lengkap). Transparansi & dokumentasi itu kunci!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 8 — Creative Agency Surabaya
    // ─────────────────────────────────────────────────────
    {
      level_number: 8,
      type: 'MULTIPLE_CHOICE',
      story_json: JSON.stringify({
        scene: 'lab_riset',
        chapter: 'Chapter 8: Problem UX di Aplikasi',
        intro: [
          S('NARASI', 'Kamis siang. Creative Agency "DigitalMind", Surabaya.'),
          S('NPC', 'Mas Ardi! Akhirnya! Aplikasi mobile kami launch tapi user-nya banyak yang langsung uninstall!', 'panic', 'DR. FANDI'),
          S('ARDI', 'Alasan uninstall-nya apa?', 'normal'),
          S('NPC', 'Mereka bilang interface-nya rumit, tombol tidak jelas, warna background terlalu gelap!', 'panic', 'DR. FANDI'),
          S('ARDI', 'Ah, jelas masalah UX! Harus dievaluasi dengan user research...', 'thinking'),
          S('BUDI', 'Ardi, ini tentang prinsip design apa? Clarity? Contrast? Simplicity?', 'thinking'),
          S('ARDI', 'Semua tiga-tiganya! Tapi prioritas utama adalah... clarity UI!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Masalahnya: button tidak jelas teksture, warna text dan background contrast rendah!', 'confident'),
          S('NPC', 'Jadi... apa solusinya, Mas?', 'normal', 'DR. FANDI'),
          S('ARDI', 'Redesign interface: tombol lebih prominent, warna background terang, contrast text diperbaiki!', 'happy'),
          S('BUDI', 'Desain bukan sekadar cantik. Harus functional dan user-friendly juga!', 'happy'),
          S('ARDI', 'Pak, minggu ketiga sudah mau selesai. Masih ada kasus lagi?', 'normal'),
          S('BUDI', 'Final minggu... empat project besar dari klien berbeda sekaligus. Itu ujian final-mu!', 'confident'),
          S('ARDI', 'Empat proyek sekaligus?! B-baik, Pak!', 'panic'),
        ]
      }),
      question_text: 'Aplikasi launch tapi langsung dihapus user! Interface rumit, tombol tidak jelas, warna gelap. Masalah DESIGN mana yang paling kritis sebabkan user frustasi & uninstall?',
      options_json: JSON.stringify([
        'Clarity — Interface tidak intuitif, user bingung mencari fungsi',
        'Contrast — Text dan background tidak cukup berbeda, susah dibaca',
        'Consistency — Design style tidak konsisten antar screen',
        'Color Harmony — Warna background terlalu dominan, membuat mata lelah'
      ]),
      correct_config: JSON.stringify('Clarity — Interface tidak intuitif, user bingung mencari fungsi'),
      bloom_level: 'C4 - Menganalisis',
      topic: 'Prinsip UX Design',
      explanation: 'Clarity adalah prioritas pertama UX! User harus langsung paham fungsi setiap elemen tanpa thinking. Jika tidak jelas, user akan langsung annoyed dan uninstall!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 9 — Galeri Design Modern
    // ─────────────────────────────────────────────────────
    {
      level_number: 9,
      type: 'TRUE_FALSE',
      story_json: JSON.stringify({
        scene: 'perpustakaan',
        chapter: 'Chapter 9: Teori Design Sejati',
        intro: [
          S('NARASI', 'Jumat pagi. Galeri Digital Kota Lamongan. Pameran design kerjaan lokal.'),
          S('NPC', 'Mas Ardi, lihat karya desainer muda ini. Judulnya "Simplicity is Beauty". Dia claim, desain bagus harus "simple"!', 'thinking', 'PUSTAKAWAN'),
          S('ARDI', 'Hmm, simple gimana?', 'normal'),
          S('NPC', 'Dia bilang: "Desain bagus harus selalu simple, tanpa dekorasi, minimal design saja!"', 'thinking', 'PUSTAKAWAN'),
          S('ARDI', 'Ee... tunggu. Itu tidak selalu benar lho!', 'thinking'),
          S('BUDI', 'Ardi, ini tentang filosofi desain. "Simple" dan "Effective" adalah dua hal berbeda!', 'confident'),
          S('ARDI', 'Betul! Simplicity adalah TOOLS, bukan GOAL dalam design!', 'confident'),
        ],
        outro: [
          S('ARDI', 'Pernyataan itu SALAH! Simple bukan satu-satunya "bagus" dalam design!', 'confident'),
          S('NPC', 'Terus yang penting apa, Mas? Kalau bukan simple?', 'normal', 'PUSTAKAWAN'),
          S('ARDI', 'Yang penting adalah EFFECTIVE! Desain bisa simple, atau bisa ornamental — selama SEL ALIGN dengan brief & problem!', 'happy'),
          S('ARDI', 'Poster jualan bisa penuh warna & ornamented. Tapi logo brand harus clean & timeless. Keduanya BAGUS, sesuai konteks!', 'happy'),
          S('BUDI', 'Bravo, Ardi. Kamu sudah belajar prinsip penting: design adalah tentang SOLVING PROBLEM, bukan tentang aesthetic semata!', 'happy'),
          S('ARDI', 'Pak, minggu terakhir KP... apa yang menunggu?', 'thinking'),
          S('BUDI', 'Empat klien besar, empat masalah design berbeda. Hari Sabtu adalah ujian final-mu yang sesungguhnya!', 'confident'),
          S('ARDI', 'Saya siap, Pak. Bismillah!', 'confident'),
        ]
      }),
      question_text: 'Desainer muda claim: "Desain yang bagus HARUS simple, minimal, tanpa dekorasi! Ornamental design itu tanda desainer kuno." Benar atau Salah?',
      options_json: JSON.stringify(['BENAR', 'SALAH']),
      correct_config: JSON.stringify('SALAH'),
      bloom_level: 'C5 - Mengevaluasi',
      topic: 'Filosofi & Teori Design',
      explanation: 'SALAH! Simplicity adalah TOOL, bukan RULE. Design bagus adalah yang SOLVES PROBLEM, baik simple maupun ornamental. Setiap style punya konteks pakai. Efektivitas > estetika saja!'
    },

    // ─────────────────────────────────────────────────────
    //  CHAPTER 10 ⚔️ UJIAN FINAL — 4 Project Design Besar
    // ─────────────────────────────────────────────────────
    {
      level_number: 10,
      type: 'MATCHING',
      story_json: JSON.stringify({
        scene: 'final_boss',
        chapter: 'Chapter 10: Ujian Final — DESIGN CHAMPION! 🎨',
        intro: [
          S('NARASI', 'Sabtu pagi. Hari terakhir KP Ardi. Pak Budi duduk dengan empat folder project besar.'),
          S('BUDI', 'Ardi, dua minggu ini kamu sudah buktikan skill design management-mu. Dari kelas, studio, percetakan...', 'normal'),
          S('BUDI', 'Sekarang saatnya final exam. Empat klien berbeda, empat masalah design berbeda, DEADLINE HARI INI!', 'confident'),
          S('ARDI', 'Empat sekaligus, Pak? Wah, beneran ujian terakhir nih!', 'panic'),
          S('BUDI', 'Tapi kamu sudah siap. Jodohkan setiap PROBLEMA DESIGN dengan SOLUSI yang tepat!', 'confident'),
          S('ARDI', 'Baik, Pak. Saya gunakan semua ilmu 2 minggu ini. Let\'s do this!', 'confident'),
          S('BUDI', 'Go! Dengarkan keempat klien. Diagnosa. Solusi. Selesai!', 'confident'),
        ],
        outro: [
          S('NARASI', 'Lima belas menit kemudian...'),
          S('BUDI', 'SEMPURNA! Semua diagnosis benar dan solusi pas! ARDI LULUS!', 'happy'),
          S('ARDI', 'LULUS! Alhamdulillah! Terima kasih, Pak Budi!', 'happy'),
          S('BUDI', 'Dua minggu ini kamu belajar design bukan sekadar soal cantik, tapi problem solving!', 'happy'),
          S('ARDI', 'Iya, Pak. Dari elemen warna, typography, process, hingga UX — semuanya connected!', 'happy'),
          S('BUDI', 'Yup. Setiap keputusan design harus based on RESEARCH dan TUJUAN klien. Keep that in mind!', 'happy'),
          S('NARASI', '🎉 SELAMAT! Ardi berhasil menyelesaikan tiga minggu KP dengan outstanding!'),
          S('NARASI', 'Dari Kelas Design hingga Ujian Final — setiap challenge teratasi dengan ilmu yang solid!'),
          S('NARASI', '🏆 Ardi adalah Designer Research-Driven sesungguhnya!'),
        ]
      }),
      question_text: '⚔️ UJIAN FINAL! Ardi dapat 4 brief klien besar dengan 4 masalah design berbeda. Jodohkan setiap PROBLEM dengan SOLUSI DESIGN yang paling tepat!',
      options_json: JSON.stringify({
        left: [
          'Klien A: "Logo kami tidak memorable, sering tertukar dengan kompetitor."',
          'Klien B: "Poster event kami blank terasa, contrast jauh dengan poster kompetitor."',
          'Klien C: "Website kami bounce rate tinggi, user tidak tahu harus klik apa dulu."',
          'Klien D: "Packaging produk kami di rak tidak standout, tersembunyi di antara kompetitor."'
        ],
        right: [
          'Clarity dan Hierarchy UX — redesign navigation dengan visual hierarchy jelas, CTA prominent.',
          'Strong Contrast dan Emphasis — add bold elemen visual, color yang "pukul" mata, dominant imagery.',
          'Distinctive Visual Identity — buat logo brand dengan unique style, memorable shape & color palette.',
          'Packaging Design Impact — buat visual yang standout di rak (shelf impact), warna bold, typography besar.'
        ]
      }),
      correct_config: JSON.stringify({
        'Klien A: "Logo kami tidak memorable, sering tertukar dengan kompetitor."': 'Distinctive Visual Identity — buat logo brand dengan unique style, memorable shape & color palette.',
        'Klien B: "Poster event kami blank terasa, contrast jauh dengan poster kompetitor."': 'Strong Contrast dan Emphasis — add bold elemen visual, color yang "pukul" mata, dominant imagery.',
        'Klien C: "Website kami bounce rate tinggi, user tidak tahu harus klik apa dulu."': 'Clarity dan Hierarchy UX — redesign navigation dengan visual hierarchy jelas, CTA prominent.',
        'Klien D: "Packaging produk kami di rak tidak standout, tersembunyi di antara kompetitor."': 'Packaging Design Impact — buat visual yang standout di rak (shelf impact), warna bold, typography besar.',
      }),
      bloom_level: 'C6 - Mengkreasi',
      topic: 'Design Problem Solving',
      explanation: 'Logo ➜ Distinctive | Poster blank ➜ Contrast | Website confuse ➜ Clarity UX | Packaging invisible ➜ Shelf Impact. Setiap problem punya design principle solution spesifik!'
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log('✅ Seeded 10 DKV visual novel chapters!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
