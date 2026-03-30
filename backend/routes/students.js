const express = require('express');
const router = express.Router();
const prisma = require('../db');
const crypto = require('crypto');

// Registrasi sesi belajar siswa baru
router.post('/register', async (req, res) => {
  try {
    const { name, absen } = req.body;
    if (!name || !absen) {
      return res.status(400).json({ message: 'Nama dan nomor absen wajib diisi.' });
    }
    
    const sessionId = crypto.randomBytes(8).toString('hex');
    const student = await prisma.student.create({
      data: { 
        name: String(name).trim(), 
        absen: String(absen).trim(), 
        session_id: sessionId 
      }
    });
    
    res.status(201).json({ message: 'Berhasil mendaftar sesi', session_id: sessionId, student });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Mengambil profil dan riwayat progress level siswa berdasarkan ID Sesi
router.get('/:sessionId', async (req, res) => {
  try {
    const student = await prisma.student.findFirst({
      where: { session_id: req.params.sessionId },
      include: { level_results: { orderBy: { level_number: 'asc' } } }
    });
    
    if (!student) return res.status(404).json({ message: 'Sesi tidak ditemukan atau sudah berakhir.' });
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
