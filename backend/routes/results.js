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
    
    // Catat log hasil / attempts level
    const result = await prisma.levelResult.create({
      data: {
        student_id: student.id,
        level_number: parseInt(level_number),
        poin: parseInt(poin || 0),
        bintang: parseInt(bintang || 0),
        waktu_detik: parseInt(waktu_detik || 0),
        is_complete: Boolean(is_complete),
        attempts: parseInt(attempts || 1),
        completed_at: new Date()
      }
    });
    
    // Update profil induk siswa
    await prisma.student.update({
      where: { id: student.id },
      data: {
        total_poin: { increment: parseInt(poin || 0) },
        total_bintang: { increment: parseInt(bintang || 0) },
        is_complete: parseInt(level_number) === 10 ? true : student.is_complete // asumsikan L10 adalah boss level final
      }
    });
    
    res.status(201).json({ message: 'Hasil berhasil disimpan.', result });
  } catch (error) {
    console.error('Results submission error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
