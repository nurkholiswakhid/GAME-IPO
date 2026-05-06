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

// Mendapatkan semua pertanyaan
router.get('/questions', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { level_number: 'asc' }
    });
    res.json(questions);
  } catch (error) {
    console.error('Admin get questions error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Update data pertanyaan & cerita
router.put('/questions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question_text, story_json, options_json, correct_config, explanation, failure_message } = req.body;
    
    const updated = await prisma.question.update({
      where: { id },
      data: {
        question_text,
        story_json,
        options_json,
        correct_config,
        explanation,
        failure_message
      }
    });
    res.json({ message: 'Soal berhasil diperbarui', question: updated });
  } catch (error) {
    console.error('Admin update question error:', error.message || error);
    res.status(500).json({ error: error.message || 'Server error', detail: error.toString() });
  }
});

// Membuat soal baru
router.post('/questions', async (req, res) => {
  try {
    const { level_number, type, question_text, image_url, options_json, correct_config, bloom_level, topic, explanation, failure_message, story_json } = req.body;
    
    // Validasi input minimal
    if (!level_number || !question_text || !options_json || !correct_config) {
      return res.status(400).json({ message: 'Level, pertanyaan, opsi, dan kunci jawaban wajib diisi.' });
    }
    
    const newQuestion = await prisma.question.create({
      data: {
        level_number: parseInt(level_number),
        type: type || 'CLASSIFICATION',
        question_text,
        image_url,
        options_json,
        correct_config,
        bloom_level: bloom_level || 'UNKNOWN',
        topic: topic || 'GENERAL',
        explanation,
        failure_message,
        story_json
      }
    });
    res.json({ message: 'Soal baru berhasil dibuat', question: newQuestion });
  } catch (error) {
    console.error('Admin create question error:', error.message || error);
    res.status(500).json({ error: error.message || 'Server error', detail: error.toString() });
  }
});

// Menghapus soal
router.delete('/questions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const deleted = await prisma.question.delete({
      where: { id }
    });
    res.json({ message: 'Soal berhasil dihapus', question: deleted });
  } catch (error) {
    console.error('Admin delete question error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
