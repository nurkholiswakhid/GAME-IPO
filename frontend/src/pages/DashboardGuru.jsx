import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import QuestionFormFields, {
  buildOptionsJSON, buildCorrectJSON,
  parseOptionsState, parseCorrectState,
  emptyOptState, emptyCorState,
  StoryFormFields, buildStoryJSON, parseStoryState, emptyStoryState
} from '../components/QuestionFormFields';

export default function DashboardGuru() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('siswa');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({ 
    question_text: '', 
    story_json: '', 
    options_json: '', 
    correct_config: '', 
    explanation: '',
    failure_message: '',
    bloom_level: 'REMEMBER',
    level_emoji: '📚',
    topic: 'GENERAL',
    storyState: emptyStoryState(),
    showStory: false,
    optState: emptyOptState('CLASSIFICATION'),
    corState: emptyCorState()
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ 
    level_number: '', 
    type: 'CLASSIFICATION', 
    question_text: '', 
    story_json: '', 
    options_json: '', 
    correct_config: '', 
    bloom_level: 'REMEMBER',
    level_emoji: '📚',
    topic: 'GENERAL',
    explanation: '',
    failure_message: '',
    storyState: emptyStoryState(),
    showStory: false,
    optState: emptyOptState('CLASSIFICATION'),
    corState: emptyCorState()
  });
  const [validationError, setValidationError] = useState('');
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

  const fetchQuestions = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'siswa') fetchAdminData();
    if (activeTab === 'soal') fetchQuestions();
  }, [activeTab]);

  // Validasi JSON
  const validateJSON = (text) => {
    try {
      if (!text) return true; // Allow empty
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleEditClick = (q) => {
    setEditingQuestion(q);
    const storyState = parseStoryState(q.story_json);
    const hasStoryData = !!q.story_json && q.story_json.length > 5;
    const qType = q.type || 'CLASSIFICATION';
    const parsedOptState = parseOptionsState(qType, q.options_json || '[]');
    setEditForm({
      question_text: q.question_text || '',
      story_json: q.story_json || '',
      options_json: q.options_json || '',
      correct_config: q.correct_config || '',
      explanation: q.explanation || '',
      failure_message: q.failure_message || '',
      bloom_level: q.bloom_level || 'REMEMBER',
      level_emoji: q.level_emoji || '📚',
      topic: q.topic || 'GENERAL',
      storyState: storyState,
      showStory: hasStoryData,
      optState: parsedOptState,
      corState: parseCorrectState(qType, q.correct_config || '{}', parsedOptState)
    });
    setValidationError('');
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const qType = editingQuestion.type || 'CLASSIFICATION';
    const options_json = buildOptionsJSON(qType, editForm.optState);
    const correct_config = buildCorrectJSON(qType, editForm.corState, editForm.optState);
    const story_json = editForm.showStory ? buildStoryJSON(editForm.storyState) : '';

    if (!options_json) { setValidationError('❌ Opsi soal belum lengkap!'); return; }
    if (!correct_config) { setValidationError('❌ Kunci jawaban belum lengkap!'); return; }

    const dataToSave = {
      question_text: editForm.question_text,
      explanation: editForm.explanation,
      failure_message: editForm.failure_message,
      bloom_level: editForm.bloom_level,
      level_emoji: editForm.level_emoji,
      topic: editForm.topic,
      story_json,
      options_json,
      correct_config
    };

    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/questions/${editingQuestion.id}`, dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Soal berhasil diperbarui!');
      setEditingQuestion(null);
      setValidationError('');
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('❌ Gagal memperbarui soal.');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    if (!createForm.level_number || !createForm.question_text) {
      setValidationError('❌ Level dan pertanyaan wajib diisi!');
      return;
    }

    const options_json = buildOptionsJSON(createForm.type, createForm.optState);
    const correct_config = buildCorrectJSON(createForm.type, createForm.corState, createForm.optState);
    const story_json = createForm.showStory ? buildStoryJSON(createForm.storyState) : '';

    if (!options_json) { setValidationError('❌ Opsi soal belum lengkap!'); return; }
    if (!correct_config) { setValidationError('❌ Kunci jawaban belum lengkap!'); return; }

    const dataToSave = {
      level_number: Number(createForm.level_number),
      type: createForm.type,
      question_text: createForm.question_text,
      bloom_level: createForm.bloom_level,
      level_emoji: createForm.level_emoji,
      topic: createForm.topic,
      explanation: createForm.explanation,
      failure_message: createForm.failure_message,
      story_json,
      options_json,
      correct_config
    };

    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/questions`, dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Soal baru berhasil dibuat!');
      setIsCreating(false);
      setValidationError('');
      setCreateForm({ 
        level_number: '', 
        type: 'CLASSIFICATION', 
        question_text: '', 
        story_json: '', 
        options_json: '', 
        correct_config: '', 
        bloom_level: 'REMEMBER',
        level_emoji: '📚',
        topic: 'GENERAL',
        explanation: '',
        failure_message: '',
        storyState: emptyStoryState(),
        showStory: false,
        optState: emptyOptState('CLASSIFICATION'),
        corState: emptyCorState()
      });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('❌ Gagal membuat soal baru: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteQuestion = async (id, questionText) => {
    if (!window.confirm(`Yakin hapus soal: "${questionText}"?\n\n⚠️ Langkah ini tidak dapat dibatalkan!`)) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Soal berhasil dihapus!');
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('❌ Gagal menghapus soal.');
    }
  };

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
    <div className="min-h-screen city-bg text-stone-800 flex flex-col items-center justify-center">
      <div className="text-center glass rounded-3xl px-12 py-10 shadow-xl">
        <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-6 mx-auto"></div>
        <p className="text-sky-600 text-sm font-bold tracking-widest animate-pulse">MEMUAT PANEL GURU...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen city-bg bg-academy text-stone-800">

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-10 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-stone-800 tracking-tight mb-2">PANEL GURU</h1>
              <p className="text-stone-500 text-sm md:text-base font-bold">Media Pembelajaran Interaktif — Kelola Konten & Pantau Siswa</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { localStorage.removeItem('adminToken'); navigate('/'); }} 
              className="px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold transition-all shadow-sm text-red-600">
              Keluar Sesi
            </motion.button>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('siswa')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all text-sm md:text-base border ${activeTab === 'siswa' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 border-blue-600' : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200 shadow-sm'}`}>
            Data Murid & Hasil
          </button>
          <button 
            onClick={() => setActiveTab('soal')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all text-sm md:text-base border ${activeTab === 'soal' ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20 border-amber-500' : 'bg-white text-stone-600 hover:bg-amber-50 border-stone-200 shadow-sm'}`}>
            Kelola Bank Soal
          </button>
        </div>

        {activeTab === 'siswa' && (
          <>
        {/* STATS CARDS */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Siswa */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-3">Total Siswa</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-5xl font-black text-blue-700">
                {data.summary.total_siswa}
              </motion.p>
            </motion.div>

            {/* Lulus */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">Selesai</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-5xl font-black text-emerald-700">
                {data.summary.selesai}
              </motion.p>
            </motion.div>

            {/* Sedang Main */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
              <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">Aktif Bermain</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-5xl font-black text-amber-600">
                {data.summary.aktif}
              </motion.p>
            </motion.div>

            {/* Rata-rata */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">Rata-rata Poin</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-5xl font-black text-stone-700">
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
          className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mb-10">
          <div className="p-6 md:p-8 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-black text-stone-800">Daftar Kemajuan Siswa</h2>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchAdminData} 
              className="text-xs font-bold px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-700 transition-all">
              Segarkan
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Nama</th>
                  <th className="p-4 text-center text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Absen</th>
                  <th className="p-4 text-center text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="p-4 text-right text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Poin</th>
                  <th className="p-4 text-right text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Bintang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.students.map((s, i) => (
                  <motion.tr 
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 font-bold text-stone-800">{s.name}</td>
                    <td className="p-4 text-center text-stone-500 font-bold">{s.absen}</td>
                    <td className="p-4 text-center">
                      {s.is_complete ? 
                        <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">Selesai</span> : 
                        <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold border border-amber-200 animate-pulse">Bermain</span>}
                    </td>
                    <td className="p-4 text-right font-black text-blue-600 text-lg">{s.total_poin}</td>
                    <td className="p-4 text-right font-black text-amber-500 text-lg">★ {s.total_bintang}</td>
                  </motion.tr>
                ))}
                {data?.students.length === 0 && (
                  <tr><td colSpan="5" className="p-12 text-center text-stone-400 font-medium">Belum ada siswa yang mendaftar.</td></tr>
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
          className="bg-white rounded-3xl p-6 md:p-8 border border-red-200 shadow-sm mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-red-600 font-black text-lg md:text-xl mb-2 flex items-center gap-2">Zona Bahaya</h3>
              <p className="text-stone-500 text-sm md:text-base font-bold max-w-xl">Menghapus SEMUA data kelas: pendaftaran siswa, riwayat permainan, dan skor poin. <b className="text-red-500">Hanya lakukan saat transisi tahun ajaran/kelas baru!</b></p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset} 
              className="w-full md:w-auto px-8 py-4 bg-red-100 hover:bg-red-200 border border-red-200 rounded-2xl font-black text-red-600 transition-all shadow-sm">
              Bersihkan Sesi
            </motion.button>
          </div>
        </motion.div>
          </>
        )}

        {/* KONTEN TAB SOAL */}
        {activeTab === 'soal' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mb-10">
            <div className="p-6 md:p-8 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-stone-800">Daftar Soal & Cerita</h2>
                <p className="text-sm font-bold text-stone-500 mt-1">Kelola semua konten kuis dan visual novel di sini. Pastikan format JSON benar sebelum menyimpan.</p>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchQuestions} 
                  className="text-xs font-bold px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-700 transition-all">
                  🔄 Segarkan
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsCreating(true); setValidationError(''); }} 
                  className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-700 transition-all">
                  ✨ Soal Baru
                </motion.button>
              </div>
            </div>
            <div className="p-6 md:p-8 bg-stone-100">
              <div className="grid grid-cols-1 gap-6">
                {questions.map((q) => (
                  <div key={q.id} className="p-6 bg-white border border-stone-200 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-lg text-xs font-bold">Level {q.level_number}</span>
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">{q.type}</span>
                          {q.bloom_level && <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">{q.bloom_level}</span>}
                          {q.topic && <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">{q.topic}</span>}
                        </div>
                        <h3 className="font-bold text-stone-800 text-lg">{q.question_text}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClick(q)}
                          className="whitespace-nowrap px-6 py-2 h-max bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-sm font-bold transition-all flex border-b-4 active:border-b hover:-translate-y-1 active:translate-y-0">
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id, q.question_text)}
                          className="whitespace-nowrap px-6 py-2 h-max bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-bold transition-all flex border-b-4 active:border-b hover:-translate-y-1 active:translate-y-0">
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <div className="p-12 text-center text-stone-400 font-medium bg-white rounded-2xl border border-stone-200">Menyinkronkan data soal... (Jika kosong, periksa Database / Prisma seed)</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MODAL EDIT SOAL */}
        {editingQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setEditingQuestion(null)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <h3 className="text-xl font-black text-stone-800">Ubah Soal - Level {editingQuestion.level_number}</h3>
                <button 
                  onClick={() => setEditingQuestion(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors text-stone-400 font-bold">
                  ✕
                </button>
              </div>
              {validationError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border-b border-red-200 text-red-600 text-sm font-bold flex items-center gap-2">
                  {validationError}
                </motion.div>
              )}
              <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 city-bg relative">
                {/* Bloom Level & Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs font-black text-blue-900 uppercase tracking-wider">Tingkat Kognitif (Bloom)</label>
                      <div className="text-3xl">{editForm.level_emoji}</div>
                    </div>
                    <select 
                      value={editForm.bloom_level}
                      onChange={(e) => setEditForm({...editForm, bloom_level: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-sm font-semibold focus:border-blue-500 focus:bg-white outline-none transition-all mb-4">
                      <option>REMEMBER</option>
                      <option>UNDERSTAND</option>
                      <option>APPLY</option>
                      <option>ANALYZE</option>
                      <option>EVALUATE</option>
                      <option>CREATE</option>
                    </select>
                    <div className="grid grid-cols-6 gap-2">
                      {['📚', '🧠', '🎯', '🔍', '⚖️', '💡', '🚀', '📖', '🎨', '🔬', '📊', '🏆'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setEditForm({...editForm, level_emoji: emoji})}
                          className={`text-2xl py-2 px-2 rounded-lg border-2 transition-all ${
                            editForm.level_emoji === emoji 
                              ? 'border-blue-500 bg-blue-100 scale-110' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-purple-200 p-6 rounded-2xl shadow-sm">
                    <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-3">Topik Pembelajaran</label>
                    <input 
                      type="text"
                      value={editForm.topic}
                      onChange={(e) => setEditForm({...editForm, topic: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 bg-purple-50 text-sm font-semibold focus:border-purple-500 focus:bg-white outline-none transition-all"
                      placeholder="Contoh: Input & Output, Interrupt Handling" />
                  </div>
                </div>
                
                {/* Main Question */}
                <div className="bg-white border-2 border-blue-300 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-black text-blue-900 uppercase tracking-wider mb-3">Pertanyaan Utama (Instruksi)</label>
                  <textarea 
                    value={editForm.question_text}
                    onChange={(e) => setEditForm({...editForm, question_text: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-sm font-semibold focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                    rows="3" />
                </div>
                
                {/* Success Message */}
                <div className="bg-white border-2 border-green-300 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-black text-green-900 uppercase tracking-wider mb-3">Pesan Sukses (Jawaban Benar)</label>
                  <textarea 
                    value={editForm.explanation}
                    onChange={(e) => setEditForm({...editForm, explanation: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-300 bg-green-50 text-sm font-semibold focus:border-green-500 focus:bg-white outline-none transition-all resize-none"
                    rows="2"
                    placeholder="Pesan penyemangat yang muncul saat siswa menjawab BENAR" />
                </div>

                {/* Failure Message */}
                <div className="bg-white border-2 border-red-300 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-black text-red-900 uppercase tracking-wider mb-3">Pesan Gagal (Jawaban Salah)</label>
                  <textarea 
                    value={editForm.failure_message}
                    onChange={(e) => setEditForm({...editForm, failure_message: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-red-300 bg-red-50 text-sm font-semibold focus:border-red-500 focus:bg-white outline-none transition-all resize-none"
                    rows="2"
                    placeholder="Pesan yang muncul saat siswa menjawab SALAH atau gagal" />
                </div>

                <div className="glass p-6 rounded-2xl border border-emerald-100">
                  <label className="block text-sm font-black text-emerald-800 mb-3">📖 Cerita Naratif (Visual Novel)</label>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <input 
                      type="checkbox"
                      checked={editForm.showStory}
                      onChange={(e) => setEditForm({...editForm, showStory: e.target.checked})}
                      className="w-5 h-5 cursor-pointer" />
                    <label className="text-sm font-bold text-emerald-700 cursor-pointer">Aktifkan Cerita Naratif</label>
                  </div>

                  {editForm.showStory && (
                    <div className="mt-4">
                      <StoryFormFields storyState={editForm.storyState} setStoryState={(s) => setEditForm({...editForm, storyState: s})} />
                    </div>
                  )}
                </div>
                
                <div className="glass p-6 rounded-2xl">
                  <label className="block text-sm font-black text-stone-800 mb-3">Opsi &amp; Kunci Jawaban</label>
                  <QuestionFormFields
                    type={editingQuestion?.type || 'CLASSIFICATION'}
                    optState={editForm.optState}
                    setOptState={(s) => setEditForm({ ...editForm, optState: s })}
                    corState={editForm.corState}
                    setCorState={(s) => setEditForm({ ...editForm, corState: s })}
                  />
                </div>
              </form>
              <div className="p-6 border-t border-stone-100 flex justify-end gap-4 bg-white">
                <button 
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors">
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={handleSaveQuestion}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-black shadow-lg shadow-blue-500/30 transition-all border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                  Simpan Perubahan
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL CREATE SOAL */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsCreating(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <h3 className="text-xl font-black text-stone-800">✨ Buat Soal Baru</h3>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors text-stone-400 font-bold">
                  ✕
                </button>
              </div>
              {validationError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border-b border-red-200 text-red-600 text-sm font-bold flex items-center gap-2">
                  {validationError}
                </motion.div>
              )}
              <form onSubmit={handleCreateQuestion} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 city-bg relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6 rounded-2xl border border-blue-100">
                    <label className="block text-sm font-black text-blue-800 mb-2">Level *</label>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={createForm.level_number}
                      onChange={(e) => setCreateForm({...createForm, level_number: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-blue-50 shadow-sm focus:border-blue-400 outline-none transition-all"
                      placeholder="Contoh: 1, 2, 3..." />
                  </div>
                  <div className="glass p-6 rounded-2xl">
                    <label className="block text-sm font-black text-stone-800 mb-2">Tipe Soal</label>
                    <select 
                      value={createForm.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setCreateForm({
                          ...createForm,
                          type: newType,
                          optState: emptyOptState(newType),
                          corState: emptyCorState()
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white shadow-sm focus:border-blue-400 outline-none transition-all">
                      <option>CLASSIFICATION</option>
                      <option>MATCHING</option>
                      <option>SEQUENCE</option>
                      <option>MULTIPLE_CHOICE</option>
                      <option>TRUE_FALSE</option>
                    </select>
                  </div>
                </div>

                {/* Main Question */}
                <div className="bg-white border-2 border-blue-300 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-black text-blue-900 uppercase tracking-wider mb-3">Pertanyaan Utama (Instruksi) *</label>
                  <textarea 
                    required
                    value={createForm.question_text}
                    onChange={(e) => setCreateForm({...createForm, question_text: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-sm font-semibold focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                    rows="3" 
                    placeholder="Tulis instruksi/pertanyaan untuk siswa..."/>
                </div>
                
                {/* Success Message */}
                <div className="bg-white border-2 border-green-300 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-black text-green-900 uppercase tracking-wider mb-3">Pesan Sukses (Jawaban Benar)</label>
                  <textarea 
                    value={createForm.explanation}
                    onChange={(e) => setCreateForm({...createForm, explanation: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-300 bg-green-50 text-sm font-semibold focus:border-green-500 focus:bg-white outline-none transition-all resize-none"
                    rows="2"
                    placeholder="Pesan penyemangat yang muncul saat siswa menjawab BENAR" />
                </div>

                {/* Failure Message */}
                <div className="bg-white border-2 border-red-300 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-black text-red-900 uppercase tracking-wider mb-3">Pesan Gagal (Jawaban Salah)</label>
                  <textarea 
                    value={createForm.failure_message}
                    onChange={(e) => setCreateForm({...createForm, failure_message: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-red-300 bg-red-50 text-sm font-semibold focus:border-red-500 focus:bg-white outline-none transition-all resize-none"
                    rows="2"
                    placeholder="Pesan yang muncul saat siswa menjawab SALAH atau gagal" />
                </div>

                <div className="glass p-6 rounded-2xl border border-emerald-100">
                  <label className="block text-sm font-black text-emerald-800 mb-3">📖 Cerita Naratif (Visual Novel)</label>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <input 
                      type="checkbox"
                      checked={createForm.showStory}
                      onChange={(e) => setCreateForm({...createForm, showStory: e.target.checked})}
                      className="w-5 h-5 cursor-pointer" />
                    <label className="text-sm font-bold text-emerald-700 cursor-pointer">Aktifkan Cerita Naratif</label>
                  </div>

                  {createForm.showStory && (
                    <div className="mt-4">
                      <StoryFormFields storyState={createForm.storyState} setStoryState={(s) => setCreateForm({...createForm, storyState: s})} />
                    </div>
                  )}
                </div>
                
                <div className="glass p-6 rounded-2xl border border-blue-100">
                  <label className="block text-sm font-black text-blue-800 mb-3">Opsi &amp; Kunci Jawaban *</label>
                  <QuestionFormFields
                    type={createForm.type}
                    optState={createForm.optState}
                    setOptState={(s) => setCreateForm({ ...createForm, optState: s })}
                    corState={createForm.corState}
                    setCorState={(s) => setCreateForm({ ...createForm, corState: s })}
                  />
                </div>

                {/* Bloom Level & Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs font-black text-blue-900 uppercase tracking-wider">Tingkat Kognitif (Bloom)</label>
                      <div className="text-3xl">{createForm.level_emoji}</div>
                    </div>
                    <select 
                      value={createForm.bloom_level}
                      onChange={(e) => setCreateForm({...createForm, bloom_level: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-sm font-semibold focus:border-blue-500 focus:bg-white outline-none transition-all mb-4">
                      <option>REMEMBER</option>
                      <option>UNDERSTAND</option>
                      <option>APPLY</option>
                      <option>ANALYZE</option>
                      <option>EVALUATE</option>
                      <option>CREATE</option>
                    </select>
                    <div className="grid grid-cols-6 gap-2">
                      {['📚', '🧠', '🎯', '🔍', '⚖️', '💡', '🚀', '📖', '🎨', '🔬', '📊', '🏆'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setCreateForm({...createForm, level_emoji: emoji})}
                          className={`text-2xl py-2 px-2 rounded-lg border-2 transition-all ${
                            createForm.level_emoji === emoji 
                              ? 'border-blue-500 bg-blue-100 scale-110' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-purple-200 p-6 rounded-2xl shadow-sm">
                    <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-3">Topik Pembelajaran</label>
                    <input 
                      type="text"
                      value={createForm.topic}
                      onChange={(e) => setCreateForm({...createForm, topic: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 bg-purple-50 text-sm font-semibold focus:border-purple-500 focus:bg-white outline-none transition-all"
                      placeholder="Contoh: IPA, Matematika, Bahasa..." />
                  </div>
                </div>
              </form>
              <div className="p-6 border-t border-stone-100 flex justify-end gap-4 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors">
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={handleCreateQuestion}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-black shadow-lg shadow-emerald-500/30 transition-all border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1">
                  Buat Soal Baru
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
