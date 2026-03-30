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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="stars-bg" />
      <div className="scanlines" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-4xl mb-4 shadow-2xl glow-indigo">🎓</div>
          <h1 className="font-game font-black text-white text-2xl text-glow-white mb-1">PORTAL GURU</h1>
          <p className="text-slate-400 text-sm">Akses control panel monitoring kelas</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-blue-500/25 glow-indigo">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-5 p-3 bg-red-900/30 border border-red-500/30 text-red-300 text-sm rounded-xl flex gap-2">
              <span>⚠️</span>{error}
            </motion.div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2 font-game">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="guru@smkn1lamongan.sch.id"
                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2 font-game">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="submit" disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl shadow-lg transition-all disabled:opacity-40 flex justify-center items-center gap-2 font-game tracking-wide mt-2">
              {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>AUTENTIKASI...</> : '🔑 MASUK PANEL'}
            </motion.button>
          </form>
          <button onClick={() => navigate('/')} className="w-full text-center text-sm text-slate-500 hover:text-indigo-400 transition font-medium mt-6">
            ← Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
