const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');

// Middleware JWT Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'rahasia_gamifikasi_ipo', (err, user) => {
    if (err) return res.status(403).json({ message: 'Sesi anda telah berakhir atau token tidak valid.' });
    req.user = user;
    next();
  });
};

router.use(authenticateToken);

// Mendapatkan data seluruh murid beserta statistik ringkas
router.get('/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { level_results: true },
      orderBy: { total_poin: 'desc' }
    });
    
    // Summary data for UI
    const totalStudents = students.length;
    const completedStudents = students.filter(s => s.is_complete).length;
    const totalPoinAll = students.reduce((acc, curr) => acc + curr.total_poin, 0);
    const avgPoin = totalStudents > 0 ? (totalPoinAll / totalStudents).toFixed(2) : 0;
    
    res.json({
      summary: {
        total_siswa: totalStudents,
        rata_rata_poin: avgPoin,
        selesai: completedStudents,
        aktif: totalStudents - completedStudents
      },
      students
    });
  } catch (error) {
    console.error('Admin students fetch error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Reset Sesi Massal (Hapus semua data murid & hasil)
router.delete('/session', async (req, res) => {
  try {
    // Pada SQLite Prisma, levelResult akan ikut terhapus bila cascade nyala atau dihapus manual
    await prisma.levelResult.deleteMany();
    await prisma.student.deleteMany();
    res.json({ message: 'Sesi semua siswa berhasil direset untuk kelas baru!' });
  } catch (error) {
    console.error('Session reset error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
