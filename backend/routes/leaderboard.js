const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Endpoints Ranking Leaderboard (Top 50)
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: [
        { total_poin: 'desc' },
        { total_bintang: 'desc' }
      ],
      take: 50
    });
    
    res.json(students);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
