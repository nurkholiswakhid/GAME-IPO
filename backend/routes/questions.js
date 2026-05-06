const express = require('express');
const router = express.Router();
const prisma = require('../db');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Menggunakan sqlite mentah untuk memotong Prisma Cache (agar tidak perlu restart server)
const dbPath = path.join(__dirname, '../prisma/dev.db');

// Mengambil total jumlah level
router.get('/count', (req, res) => {
  try {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    db.get(`SELECT COUNT(DISTINCT level_number) AS total FROM questions`, [], (err, row) => {
      db.close();
      if (err) {
        console.error('Count query error:', err);
        return res.status(500).json({ error: 'Database read error', total: 10 });
      }
      const total = row?.total || 10;
      res.json({ total, success: true });
    });
  } catch (error) {
    console.error('Count endpoint error:', error);
    res.status(500).json({ error: error.message, total: 10 });
  }
});

// Ringkasan semua level yang punya soal (untuk dashboard siswa)
router.get('/levels-summary', (req, res) => {
  try {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    // Ambil setiap level: jumlah soal dan tipe soal pertama (representatif)
    db.all(
      `SELECT
         level_number,
         COUNT(*) AS question_count,
         (SELECT type FROM questions q2
          WHERE q2.level_number = q.level_number
          ORDER BY q2.id ASC LIMIT 1) AS type,
         (SELECT topic FROM questions q3
          WHERE q3.level_number = q.level_number
          ORDER BY q3.id ASC LIMIT 1) AS topic
       FROM questions q
       GROUP BY level_number
       ORDER BY level_number ASC`,
      [],
      (err, rows) => {
        db.close();
        if (err) {
          console.error('levels-summary error:', err);
          return res.status(500).json({ error: 'Database read error' });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    console.error('levels-summary endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mengambil bank soal untuk level tertentu
router.get('/:level', async (req, res) => {
  try {
    const levelNumber = parseInt(req.params.level);
    if (isNaN(levelNumber)) return res.status(400).json({ message: 'Level tidak valid.' });
    
    // Gunakan koneksi langsung untuk mendapatkan story_json yang ditambahkan belakangan tanpa load Prisma schema ulang
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    db.all(`SELECT * FROM questions WHERE level_number = ?`, [levelNumber], (err, rows) => {
      db.close();
      if (err) {
        console.error("Direct SQLite error:", err);
        return res.status(500).json({ error: 'Database read error' });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'Belum ada soal untuk level ini.' });
      }

      // SQLite driver raw array
      res.json(rows);
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
