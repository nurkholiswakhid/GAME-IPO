require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  errorFormat: 'pretty',
});

// Test connection on initialization
prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

module.exports = prisma;
