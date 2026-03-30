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

  if(isLoading) return <div className="min-h-screen bg-slate-900 text-indigo-200 flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mb-4"></div>Memuat Kontrol Panel...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-indigo-950 text-white p-8 rounded-3xl shadow-xl border border-indigo-900/50">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Guru</h1>
            <p className="text-indigo-300 text-sm mt-1.5 font-medium">Control Panel — Gamifikasi Arsitektur Komputer</p>
          </div>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/'); }} className="bg-indigo-900 hover:bg-slate-800 px-6 py-2.5 rounded-xl text-sm font-bold border border-indigo-700 hover:border-slate-700 transition shadow">
            Keluar Panel
          </button>
        </header>

        {data && (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
               <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Total Murid</p>
               <p className="text-4xl font-black text-slate-800">{data.summary.total_siswa}</p>
             </div>
             <div className="bg-emerald-50 p-6 rounded-3xl shadow-sm border border-emerald-100/50 text-center flex flex-col items-center justify-center">
               <p className="text-emerald-600/80 text-xs font-black uppercase tracking-wider mb-2">Selesai (Lulus)</p>
               <p className="text-4xl font-black text-emerald-600">{data.summary.selesai}</p>
             </div>
             <div className="bg-amber-50 p-6 rounded-3xl shadow-sm border border-amber-100/50 text-center flex flex-col items-center justify-center">
               <p className="text-amber-600/80 text-xs font-black uppercase tracking-wider mb-2">Sedang Main</p>
               <p className="text-4xl font-black text-amber-500">{data.summary.aktif}</p>
             </div>
             <div className="bg-blue-50 p-6 rounded-3xl shadow-sm border border-blue-100/50 text-center flex flex-col items-center justify-center">
               <p className="text-blue-600/80 text-xs font-black uppercase tracking-wider mb-2">Rata-Rata Poin</p>
               <p className="text-4xl font-black text-blue-600">{data.summary.rata_rata_poin}</p>
             </div>
           </div>
        )}

        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden mb-10">
          <div className="p-6 md:px-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">📋 Daftar Progress Siswa</h2>
            <button onClick={fetchAdminData} className="text-sm text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition">🔄 Refresh Data</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 md:px-8 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Nama Siswa</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Absen</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Status</th>
                  <th className="p-4 text-xs font-black text-blue-500 uppercase tracking-widest text-right whitespace-nowrap">Total Poin</th>
                  <th className="p-4 md:px-8 text-xs font-black text-amber-500 uppercase tracking-widest text-right whitespace-nowrap">Bintang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 md:px-8 font-bold text-slate-800 text-lg whitespace-nowrap">{s.name}</td>
                    <td className="p-4 text-slate-500 text-center font-medium">{s.absen}</td>
                    <td className="p-4 text-center">
                      {s.is_complete ? 
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-xs font-bold border border-emerald-200 shadow-sm">LULUS</span> : 
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-xs font-bold border border-amber-200 shadow-sm">BERMAIN</span>}
                    </td>
                    <td className="p-4 font-black text-blue-600 text-right text-xl">{s.total_poin}</td>
                    <td className="p-4 md:px-8 font-bold text-amber-500 text-right text-xl">★ {s.total_bintang}</td>
                  </tr>
                ))}
                {data?.students.length === 0 && (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-400 font-medium">Belum ada siswa yang mendaftar sesi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-red-800 font-black text-lg mb-1 flex items-center gap-2">⚠️ ZONA BAHAYA</h3>
            <p className="text-red-600/80 text-sm font-medium mt-1 max-w-xl">Menghapus semua data sesi pendaftaran siswa dan riwayat permainan skor poin di database. <b>Pastikan anda melakukannya hanya ketika sesi kelas ini telah usai secara keseluruhan!</b></p>
          </div>
          <button onClick={handleReset} className="w-full md:w-auto flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-red-500/30">
            Bersihkan Sesi Kelas
          </button>
        </div>

      </div>
    </div>
  );
}
