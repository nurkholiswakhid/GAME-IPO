import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function DashboardGuru() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/login-guru');
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      if(err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/login-guru');
      } else {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReset = async () => {
    if(!window.confirm('PERINGATAN! Anda yakin ingin MENGHAPUS SEMUA DATA siswa secara permanen? Langkah ini ditujukan ketika pergantian ruang kelas/sesi.')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/session`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sesi bermain murid berhasil dikosongkan.');
      fetchAdminData();
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus database.');
    }
  };

  if(isLoading) return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mb-6 mx-auto"></div>
        <p className="text-indigo-400 text-lg font-black tracking-widest animate-pulse">LOADING CONTROL PANEL...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-10 mb-8 border border-indigo-500/30 backdrop-blur-xl shadow-2xl" 
          style={{ boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ textShadow: '0 0 20px rgba(99,102,241,0.5)' }}>CONTROL PANEL</h1>
              <p className="text-indigo-300/90 text-sm md:text-base font-medium">Gamifikasi Arsitektur Komputer — Monitoring Kinerja Siswa</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { localStorage.removeItem('adminToken'); navigate('/'); }} 
              className="px-6 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-xl text-sm font-bold transition-all shadow-lg text-red-300">
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* STATS CARDS */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Siswa */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-all" 
              style={{ boxShadow: '0 0 30px rgba(59,130,246,0.1)' }}>
              <p className="text-blue-400/80 text-xs font-black uppercase tracking-widest mb-3">Total Siswa</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-5xl font-black text-blue-300" 
                style={{ textShadow: '0 0 15px rgba(59,130,246,0.5)' }}>
                {data.summary.total_siswa}
              </motion.p>
            </motion.div>

            {/* Lulus */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-md hover:border-emerald-400/50 transition-all" 
              style={{ boxShadow: '0 0 30px rgba(16,185,129,0.1)' }}>
              <p className="text-emerald-400/80 text-xs font-black uppercase tracking-widest mb-3">Lulus</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-5xl font-black text-emerald-300" 
                style={{ textShadow: '0 0 15px rgba(16,185,129,0.5)' }}>
                {data.summary.selesai}
              </motion.p>
            </motion.div>

            {/* Sedang Main */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-amber-500/30 backdrop-blur-md hover:border-amber-400/50 transition-all" 
              style={{ boxShadow: '0 0 30px rgba(251,146,60,0.1)' }}>
              <p className="text-amber-400/80 text-xs font-black uppercase tracking-widest mb-3">Aktif Bermain</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-5xl font-black text-amber-300" 
                style={{ textShadow: '0 0 15px rgba(251,146,60,0.5)' }}>
                {data.summary.aktif}
              </motion.p>
            </motion.div>

            {/* Rata-rata */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-6 border border-purple-500/30 backdrop-blur-md hover:border-purple-400/50 transition-all" 
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.1)' }}>
              <p className="text-purple-400/80 text-xs font-black uppercase tracking-widest mb-3">Rata-rata Poin</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-5xl font-black text-purple-300" 
                style={{ textShadow: '0 0 15px rgba(139,92,246,0.5)' }}>
                {data.summary.rata_rata_poin}
              </motion.p>
            </motion.div>
          </div>
        )}

        {/* TABLE */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl mb-10">
          <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-black">Daftar Progress Siswa</h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAdminData} 
              className="text-xs font-black px-4 py-2 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-500/50 text-indigo-300 transition-all">
              Refresh
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/5 backdrop-blur">
                <tr>
                  <th className="p-4 text-left text-xs font-black text-sky-400/80 uppercase tracking-widest">Nama</th>
                  <th className="p-4 text-center text-xs font-black text-sky-400/80 uppercase tracking-widest whitespace-nowrap">Absen</th>
                  <th className="p-4 text-center text-xs font-black text-sky-400/80 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="p-4 text-right text-xs font-black text-blue-400/80 uppercase tracking-widest whitespace-nowrap">Poin</th>
                  <th className="p-4 text-right text-xs font-black text-amber-400/80 uppercase tracking-widest whitespace-nowrap">Bintang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.students.map((s, i) => (
                  <motion.tr 
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{s.name}</td>
                    <td className="p-4 text-center text-slate-400">{s.absen}</td>
                    <td className="p-4 text-center">
                      {s.is_complete ? 
                        <span className="inline-block bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg text-xs font-black border border-emerald-500/50">Lulus</span> : 
                        <span className="inline-block bg-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-xs font-black border border-amber-500/50 animate-pulse">Bermain</span>}
                    </td>
                    <td className="p-4 text-right font-black text-blue-400 text-lg">{s.total_poin}</td>
                    <td className="p-4 text-right font-black text-amber-400 text-lg">★ {s.total_bintang}</td>
                  </motion.tr>
                ))}
                {data?.students.length === 0 && (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-400/60 font-medium">Belum ada siswa yang terdaftar.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* DANGER ZONE */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-6 md:p-8 border border-red-500/30 backdrop-blur-xl shadow-2xl" 
          style={{ boxShadow: '0 0 20px rgba(239,68,68,0.15)' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-red-400 font-black text-lg md:text-xl mb-2 flex items-center gap-2">Zona Bahaya</h3>
              <p className="text-red-400/70 text-sm md:text-base font-medium max-w-xl">Menghapus SEMUA data sesi: pendaftaran siswa, riwayat permainan, dan skor poin. <b className="text-red-300">Hanya lakukan ketika sesi kelas telah berakhir!</b></p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset} 
              className="w-full md:w-auto px-8 py-4 bg-red-600/40 hover:bg-red-600/60 border border-red-500/70 rounded-2xl font-black text-red-300 transition-all shadow-lg">
              Bersihkan Sesi
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
