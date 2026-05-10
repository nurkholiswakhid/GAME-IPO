const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Endpoint untuk submit hasil per level
router.post('/', async (req, res) => {
  try {
    const { session_id, level_number, poin, bintang, waktu_detik, is_complete, attempts } = req.body;
    
    if (!session_id || !level_number) {
      return res.status(400).json({ message: 'Data submission tidak lengkap (session_id dan level_number wajib).' });
    }

    const student = await prisma.student.findFirst({ where: { session_id } });
    if (!student) return res.status(404).json({ message: 'Sesi siswa tidak ditemukan.' });

    const newPoin = parseInt(poin || 0);
    const newBintang = parseInt(bintang || 0);
    const newWaktu = parseInt(waktu_detik || 0);
    const newIsComplete = Boolean(is_complete);
    const lvl = parseInt(level_number);

    // ── Cek apakah sudah ada hasil untuk level ini ──────────
    const existingResult = await prisma.levelResult.findFirst({
      where: {
        student_id: student.id,
        level_number: lvl
      },
      orderBy: { bintang: 'desc' } // Ambil yang bintangnya tertinggi
    });

    let result;

    if (existingResult) {
      // Sudah pernah mengerjakan level ini
      const prevBintang = existingResult.bintang || 0;
      const prevPoin = existingResult.poin || 0;

      // Jika bintang sebelumnya sudah 3 (max) dan hasil baru tidak lebih baik, 
      // tetap catat attempt tapi jangan tambah poin/bintang di profil siswa
      if (prevBintang >= 3 && newBintang <= prevBintang) {
        // Catat log attempt saja (untuk riwayat)
        result = await prisma.levelResult.create({
          data: {
            student_id: student.id,
            level_number: lvl,
            poin: newPoin,
            bintang: newBintang,
            waktu_detik: newWaktu,
            is_complete: newIsComplete,
            attempts: parseInt(attempts || 1),
            completed_at: new Date()
          }
        });

        // TIDAK update total_poin dan total_bintang siswa
        return res.status(201).json({ 
          message: 'Hasil dicatat. Bintang sudah maksimal (3) di level ini.', 
          result,
          already_max: true 
        });
      }

      // Jika hasil baru lebih baik dari sebelumnya
      if (newBintang > prevBintang || newPoin > prevPoin) {
        // Hitung selisih untuk increment (hanya tambah selisihnya)
        const bintangDiff = Math.max(0, newBintang - prevBintang);
        const poinDiff = Math.max(0, newPoin - prevPoin);

        // Catat log attempt baru
        result = await prisma.levelResult.create({
          data: {
            student_id: student.id,
            level_number: lvl,
            poin: newPoin,
            bintang: newBintang,
            waktu_detik: newWaktu,
            is_complete: newIsComplete,
            attempts: parseInt(attempts || 1),
            completed_at: new Date()
          }
        });

        // Update profil siswa: hanya increment selisihnya
        await prisma.student.update({
          where: { id: student.id },
          data: {
            total_poin: { increment: poinDiff },
            total_bintang: { increment: bintangDiff },
            is_complete: lvl === 10 ? true : student.is_complete
          }
        });

        return res.status(201).json({ 
          message: 'Hasil berhasil disimpan (skor lebih baik dari sebelumnya).', 
          result,
          improved: true,
          prev_bintang: prevBintang,
          new_bintang: newBintang
        });
      }

      // Hasil baru TIDAK lebih baik — catat attempt tapi jangan update total
      result = await prisma.levelResult.create({
        data: {
          student_id: student.id,
          level_number: lvl,
          poin: newPoin,
          bintang: newBintang,
          waktu_detik: newWaktu,
          is_complete: newIsComplete,
          attempts: parseInt(attempts || 1),
          completed_at: new Date()
        }
      });

      // TIDAK update total_poin dan total_bintang
      return res.status(201).json({ 
        message: 'Hasil dicatat. Skor sebelumnya lebih tinggi.', 
        result,
        kept_previous: true 
      });

    } else {
      // ── Pertama kali mengerjakan level ini ──────────────────
      result = await prisma.levelResult.create({
        data: {
          student_id: student.id,
          level_number: lvl,
          poin: newPoin,
          bintang: newBintang,
          waktu_detik: newWaktu,
          is_complete: newIsComplete,
          attempts: parseInt(attempts || 1),
          completed_at: new Date()
        }
      });

      // Update profil siswa (full increment karena pertama kali)
      await prisma.student.update({
        where: { id: student.id },
        data: {
          total_poin: { increment: newPoin },
          total_bintang: { increment: newBintang },
          is_complete: lvl === 10 ? true : student.is_complete
        }
      });

      res.status(201).json({ message: 'Hasil berhasil disimpan.', result });
    }
  } catch (error) {
    console.error('Results submission error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
