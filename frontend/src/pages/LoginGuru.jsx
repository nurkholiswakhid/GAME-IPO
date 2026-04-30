import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function LoginGuru() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('adminToken')) navigate('/admin');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password tidak sesuai.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 city-bg bg-academy">

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-6">

          <h1 className="font-kodomo font-black text-stone-800 text-3xl tracking-tight mb-2">PORTAL GURU</h1>
          <p className="text-stone-500 text-sm">Akses pemantauan progres kelas</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-md">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex gap-2">
              <span className="font-bold mr-1">Error:</span>{error}
            </motion.div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="guru@smkn1lamongan.sch.id"
                className="w-full px-5 py-4 rounded-xl bg-white/80 border border-amber-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all shadow-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl bg-white/80 border border-amber-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all shadow-sm" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 tracking-wide mt-4">
              {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>MEMUAT...</> : 'MASUK PANEL'}
            </motion.button>
          </form>
          <button onClick={() => navigate('/')} className="w-full text-center text-sm text-stone-400 hover:text-amber-500 transition font-bold mt-8">
            ← Kembali ke Menu Utama
          </button>
        </div>
      </motion.div>
    </div>
  );
}
