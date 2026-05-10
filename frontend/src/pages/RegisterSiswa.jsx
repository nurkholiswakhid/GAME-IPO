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
    <div className="min-h-screen flex items-center justify-center p-4 city-bg bg-academy">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-kodomo font-black text-stone-800 text-3xl tracking-tight mb-2">MULAI PETUALANGAN</h1>
          <p className="text-stone-500 text-sm">Daftarkan dirimu sebagai warga kota digital!</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-8 shadow-md">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex gap-2"
            >
              <span className="font-bold mr-1">Error:</span>{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Nama Panggilan</label>
              <input
                type="text"
                required
                minLength={3}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Masukkan nama lengkapmu..."
                className="w-full px-5 py-4 rounded-xl bg-white/80 border border-sky-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Nomor Absen</label>
              <input
                type="number"
                required
                min={1}
                value={absen}
                onChange={e => setAbsen(e.target.value)}
                placeholder="Nomor absen kelas..."
                className="w-full px-5 py-4 rounded-xl bg-white/80 border border-sky-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !name || !absen}
              className="w-full py-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 tracking-wide mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  MEMUAT...
                </>
              ) : (
                'MASUK KE KOTA'
              )}
            </motion.button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-sm text-stone-400 hover:text-sky-500 transition font-bold mt-8"
          >
            ← Kembali ke Menu Utama
          </button>
        </div>
      </motion.div>
    </div>
  );
}
