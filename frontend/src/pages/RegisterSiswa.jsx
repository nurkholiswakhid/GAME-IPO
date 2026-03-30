import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { GameContext } from '../context/GameContext';

export default function RegisterSiswa() {
  const [name, setName] = useState('');
  const [absen, setAbsen] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginStudent, student } = useContext(GameContext);

  React.useEffect(() => {
    if (student) navigate('/dashboard');
  }, [student, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/students/register`, { name, absen });
      loginStudent(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan internal server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="stars-bg" />
      <div className="scanlines" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header card */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl mb-4 shadow-2xl glow-indigo"
          >
            ⚔️
          </motion.div>
          <h1 className="font-game font-black text-white text-2xl text-glow-white mb-1">BUAT KARAKTER</h1>
          <p className="text-slate-400 text-sm">Masukkan identitasmu untuk memulai petualangan!</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-8 border border-indigo-500/25 glow-indigo">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/40 border border-red-500/40 text-red-300 rounded-xl text-sm flex items-start gap-2">
              <span>⚠️</span>{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 font-game">Nama Hero</label>
              <input
                type="text" required minLength={3} value={name} onChange={e => setName(e.target.value)}
                placeholder="Masukkan nama lengkapmu..."
                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 font-game">Nomor Absen</label>
              <input
                type="number" required min={1} value={absen} onChange={e => setAbsen(e.target.value)}
                placeholder="Nomor absen kelas..."
                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.6)' }}
              whileTap={{ scale: 0.97 }}
              type="submit" disabled={isLoading || !name || !absen}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl shadow-lg transition-all disabled:opacity-40 flex justify-center items-center gap-2 font-game tracking-wider mt-2"
            >
              {isLoading
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />MEMUAT...</>
                : '⚡ MULAI PETUALANGAN'}
            </motion.button>
          </form>

          <button onClick={() => navigate('/')} className="mt-6 w-full text-center text-sm text-slate-500 hover:text-indigo-400 transition font-medium">
            ← Kembali ke Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
