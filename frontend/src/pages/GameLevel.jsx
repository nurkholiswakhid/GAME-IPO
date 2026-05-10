import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GameContext } from '../context/GameContext';

// ─────────────────────────────────────────────────────────────
//  CHARACTER DEFINITIONS & MOODS
// ─────────────────────────────────────────────────────────────
const CHARS = {
  NARASI:       { img: null,                  name: 'SYSTEM',     color: '#94a3b8', side: 'center', emoji: '⚙️' },
  ARKA:         { img: '/char_arka.png',       name: 'Arka',       color: '#3b82f6', side: 'left',   emoji: '🧑‍🔧' },
  NEXA:         { img: '/char_nexa.png',       name: 'Nexa',       color: '#8b5cf6', side: 'right',  emoji: '👩‍💻' },
  DIRA:         { img: '/char_dira.png',       name: 'Dira',       color: '#10b981', side: 'left',   emoji: '👩‍🎨' },
  RIVO:         { img: '/char_rivo.png',       name: 'Rivo',       color: '#f97316', side: 'right',  emoji: '👨‍✈️' },
  ZENO:         { img: '/char_zeno.png',       name: 'Zeno',       color: '#06b6d4', side: 'left',   emoji: '🤖' },
  ARDI:         { img: '/char_ardi.png',       name: 'Ardi',       color: '#f59e0b', side: 'right',  emoji: '👦' },
  BUDI:         { img: '/char_budi.png',       name: 'Budi',       color: '#84cc16', side: 'left',   emoji: '👨' },
  NPC_MALE:     { img: '/char_npc_male.png',   name: 'NPC Pria',   color: '#64748b', side: 'left',   emoji: '🧑' },
  NPC_FEMALE:   { img: '/char_npc_female.png', name: 'NPC Wanita', color: '#ec4899', side: 'right',  emoji: '👩' },
  NPC:          { img: null,                   name: 'NPC',        color: '#94a3b8', side: 'left',   emoji: '🧑' },
};

const MOOD = {
  panic:     { emoji: '😰', filter: 'saturate(0.8) brightness(0.9)', label: 'PANIC'      },
  happy:     { emoji: '😊', filter: 'saturate(1.2) brightness(1.05)', label: 'HAPPY'     },
  thinking:  { emoji: '🤔', filter: 'saturate(0.9)',                  label: 'THINKING'  },
  sad:       { emoji: '😢', filter: 'saturate(0.6) brightness(0.85)', label: 'SAD'       },
  confident: { emoji: '😤', filter: 'saturate(1.1) brightness(1.1)',  label: 'CONFIDENT' },
  normal:    { emoji: '',   filter: '',                                label: 'IDLE'      },
  angry:     { emoji: '😠', filter: 'saturate(1.3) hue-rotate(10deg)', label: 'ANGRY'   },
  surprised: { emoji: '😲', filter: 'brightness(1.15)',               label: 'SURPRISED' },
};

const SCENES = {
  lab_komputer:     { bg: 'transparent', glow: '#87ceeb', label: 'Pusat Input Data',   icon: '🎯', accent: 'from-blue-100/40 to-blue-50/20',    grid: 'rgba(135,206,235,0.1)' },
  server_room:      { bg: 'transparent', glow: '#98fb98', label: 'Jalur Distribusi',   icon: '🚦', accent: 'from-green-100/40 to-green-50/20',   grid: 'rgba(152,251,152,0.1)' },
  studio_it:        { bg: 'transparent', glow: '#ffb6c1', label: 'Pusat Proses (CPU)', icon: '🧠', accent: 'from-pink-100/40 to-pink-50/20',     grid: 'rgba(255,182,193,0.1)' },
  rumah_user:       { bg: 'transparent', glow: '#ffa07a', label: 'Terminal Output',    icon: '🖥️', accent: 'from-orange-100/40 to-orange-50/20', grid: 'rgba(255,160,122,0.1)' },
  data_center:      { bg: 'transparent', glow: '#ffd700', label: 'Pabrik Perangkat',   icon: '🏭', accent: 'from-amber-100/40 to-amber-50/20',   grid: 'rgba(255,215,0,0.1)'   },
  lab_storage:      { bg: 'transparent', glow: '#a7f3d0', label: 'Gudang Storage',     icon: '📄', accent: 'from-emerald-100/40 to-emerald-50/20', grid: 'rgba(167,243,208,0.1)' },
  kelas_smk:        { bg: 'transparent', glow: '#e9d5ff', label: 'Akademi Sistem',    icon: '🏫', accent: 'from-purple-100/40 to-purple-50/20', grid: 'rgba(233,213,255,0.1)' },
  lab_riset:        { bg: 'transparent', glow: '#c7d2fe', label: 'Lab Inovasi IT',    icon: '🔬', accent: 'from-indigo-100/40 to-indigo-50/20', grid: 'rgba(199,210,254,0.1)' },
  perpustakaan:     { bg: 'transparent', glow: '#cbd5e1', label: 'Jaringan Kota',     icon: '🌐', accent: 'from-slate-100/40 to-slate-50/20',   grid: 'rgba(203,213,225,0.1)' },
  final_boss:       { bg: 'transparent', glow: '#fef08a', label: 'Ujian Arsitektur',  icon: '👑', accent: 'from-yellow-100/40 to-yellow-50/20', grid: 'rgba(254,240,138,0.1)' },
  // Alias: scene dari form guru (SCENE_LIST) yang memakai nama berbeda
  academy_kodomo:   { bg: 'transparent', glow: '#e9d5ff', label: 'Akademi Sistem',    icon: '🏫', accent: 'from-purple-100/40 to-purple-50/20', grid: 'rgba(233,213,255,0.1)' },
  core_kodomo:      { bg: 'transparent', glow: '#ffb6c1', label: 'Pusat Proses (CPU)', icon: '🧠', accent: 'from-pink-100/40 to-pink-50/20',    grid: 'rgba(255,182,193,0.1)' },
  hardware_kodomo:  { bg: 'transparent', glow: '#ffd700', label: 'Pabrik Perangkat',  icon: '🏭', accent: 'from-amber-100/40 to-amber-50/20',   grid: 'rgba(255,215,0,0.1)'   },
  home_kodomo:      { bg: 'transparent', glow: '#ffa07a', label: 'Terminal Output',   icon: '🖥️', accent: 'from-orange-100/40 to-orange-50/20', grid: 'rgba(255,160,122,0.1)' },
  network_kodomo:   { bg: 'transparent', glow: '#cbd5e1', label: 'Jaringan Kota',     icon: '🌐', accent: 'from-slate-100/40 to-slate-50/20',   grid: 'rgba(203,213,225,0.1)' },
};

// ─────────────────────────────────────────────────────────────
//  TYPEWRITER HOOK
// ─────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 25) {
  const [chars, setChars] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setChars(''); setDone(false);
    if (!text) { setDone(true); return; }
    let i = 0;
    const tid = setInterval(() => {
      i++;
      setChars(text.slice(0, i));
      if (i >= text.length) { clearInterval(tid); setDone(true); }
    }, speed);
    return () => clearInterval(tid);
  }, [text, speed]);
  return [chars, done];
}

// ─────────────────────────────────────────────────────────────
//  CHARACTER SPRITE COMPONENT
// ─────────────────────────────────────────────────────────────
function CharacterSprite({ charKey, isActive, side, mood }) {
  const def = CHARS[charKey] || CHARS['NPC'];
  const moodDef = MOOD[mood] || MOOD.normal;

  // Jika tidak ada img (karakter emoji-only atau NPC tanpa sprite)
  if (!def.img) {
    if (!isActive) return null;
    return (
      <motion.div
        key={charKey}
        initial={{ y: 20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.8 }}
        className={`absolute bottom-[120px] flex items-center justify-center z-10 pointer-events-none`}
        style={{ [side === 'right' ? 'right' : 'left']: '8%' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 bg-white"
          style={{ borderColor: def.color }}
        >
          {def.emoji}{moodDef.emoji}
        </div>
      </motion.div>
    );
  }

  // Combined filter: mood-based brightness adjustments + soft drop-shadow
  const activeFilter = `brightness(1.05) ${moodDef.filter} drop-shadow(0 10px 15px rgba(0,0,0,0.2))`;
  const inactiveFilter = 'brightness(0.7) saturate(0.8) blur(1px)';

  return (
    <motion.div
      key={charKey}
      initial={{ x: side === 'left' ? -150 : 150, opacity: 0, scale: 0.9 }}
      animate={{
        x: 0,
        opacity: isActive ? 1 : 0.8,
        scale: isActive ? 1.02 : 0.96,
        y: isActive ? [0, -4, 0] : 0,
      }}
      exit={{ x: side === 'left' ? -150 : 150, opacity: 0, scale: 0.9 }}
      transition={{
        x: { type: 'spring', stiffness: 150, damping: 20 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        y: isActive ? { duration: 2, ease: 'easeInOut', repeat: Infinity } : { duration: 0 },
      }}
      className="absolute bottom-0 flex items-end drop-shadow-xl"
      style={{
        [side]: side === 'left' ? '5%' : '5%',
        height: '85%',
        filter: isActive ? activeFilter : inactiveFilter,
        transition: 'filter 0.5s ease',
        zIndex: isActive ? 40 : 10,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Mood emoji floating at shoulder area */}
      {isActive && moodDef.emoji && (
        <motion.div
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: [0, -5, 0], opacity: 1, scale: 1 }}
          exit={{ y: 0, opacity: 0, scale: 0 }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
          className="absolute top-[25%] left-1/2 -translate-x-1/2 text-4xl z-50 drop-shadow-sm pointer-events-none"
        >
          {moodDef.emoji}
        </motion.div>
      )}

      <img
        src={def.img}
        alt={def.name}
        style={{
          height: '100%',
          width: 'auto',
          maxWidth: '320px',
          objectFit: 'contain',
          objectPosition: 'bottom',
          mixBlendMode: 'multiply',
          transform: side === 'right' ? 'scaleX(-1)' : 'none',
        }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  FUTURISTIC DIALOG BOX
// ─────────────────────────────────────────────────────────────
function DialogBox({ dialog, onNext, isLast, sceneGlow }) {
  const speakerKey = dialog.npcName || dialog.speaker;
  const def = CHARS[speakerKey] || CHARS['NPC'];
  const isNarrator = dialog.speaker === 'NARASI';
  const moodDef = MOOD[dialog.mood] || MOOD.normal;
  const [typedText, done] = useTypewriter(dialog.text, 18);

  // Click to skip typewriter OR advance
  const handleClick = () => {
    onNext();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer select-none w-full max-w-5xl mx-auto px-4 pb-4">
      <motion.div
        key={`${speakerKey}-${dialog.text?.slice(0,10)}`}
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -10, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl shadow-xl border bg-white/90 backdrop-blur-md"
        style={{
          borderColor: isNarrator ? 'rgba(148,163,184,0.4)' : `${def.color}80`,
          boxShadow: `0 15px 40px -10px rgba(0,0,0,0.1)`,
        }}
      >
        {/* Top accent bar - color of character */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: isNarrator ? '#cbd5e1' : def.color }}
        />

        {isNarrator ? (
          <div className="px-8 py-6 text-center">
            <p className="text-slate-700 italic text-base md:text-lg leading-relaxed font-serif">
              <span className="text-slate-500 font-bold text-xs tracking-widest not-italic block mb-2">[SYSTEM]</span>
              {typedText}
              {!done && <span className="inline-block w-1.5 h-4 bg-slate-400 ml-1 align-middle animate-pulse rounded-full" />}
            </p>
            {done && <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-4 animate-pulse">▼ klik untuk lanjut</p>}
          </div>
        ) : (
          <div>
            {/* Name plate */}
            <div
              className="flex items-center gap-4 px-6 pt-5 pb-3 border-b"
              style={{ borderColor: `${def.color}30` }}
            >
              {/* Avatar badge */}
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 shadow-sm border-2 bg-white"
                style={{
                  borderColor: def.color,
                }}
              >
                {def.emoji}
              </motion.div>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-mono font-bold tracking-[0.25em] uppercase opacity-60 mb-0.5" style={{ color: def.color }}>
                  {speakerKey} · {moodDef.label}
                </span>
                <span className="font-black text-base md:text-lg font-sans tracking-wide text-stone-800 truncate block">
                  {def.name || speakerKey}
                </span>
              </div>
            </div>

            {/* Text area */}
            <div className="px-6 pb-5 pt-4 min-h-[100px] flex flex-col justify-between">
              <p className="text-stone-700 text-sm md:text-[1.05rem] leading-relaxed font-medium">
                {typedText}
                {!done && <span className="inline-block w-2 h-[1.1em] bg-stone-500/60 ml-1 align-middle animate-pulse rounded-sm" />}
              </p>
              {done && (
                <div className="flex items-center justify-between mt-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${def.color}20)` }} />
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] ml-3"
                    style={{ color: def.color }}
                  >
                    {isLast ? <><span>MULAI MISI</span><span>▶</span></> : <><span>lanjut</span><span>▼</span></>}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  VERIFY ENGINE
// ─────────────────────────────────────────────────────────────
function verifyAnswer(type, correctConfig, userAnswer) {
  try {
    const correct = JSON.parse(correctConfig);
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE')
      return String(userAnswer).trim() === String(correct).trim();
    if (type === 'SEQUENCE') {
      if (!Array.isArray(userAnswer) || userAnswer.length !== correct.length) return false;
      return userAnswer.every((v, i) => v === correct[i]);
    }
    if (type === 'CLASSIFICATION') {
      for (const [cat, items] of Object.entries(correct)) {
        const user = userAnswer[cat] || [];
        if (user.length !== items.length || !items.every(it => user.includes(it))) return false;
      }
      return true;
    }
    if (type === 'MATCHING') {
      for (const [k, v] of Object.entries(correct)) {
        if (userAnswer[k] !== v) return false;
      }
      return true;
    }
  } catch { return false; }
  return false;
}

// ─────────────────────────────────────────────────────────────
//  MECHANIC COMPONENTS (Redesigned Cyberpunk / Glassmorphism)
// ─────────────────────────────────────────────────────────────
function MultipleChoice({ options, onAnswer }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((opt, i) => (
        <motion.button key={i} whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.05)' }} whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(opt)}
          className="relative overflow-hidden p-5 bg-white border border-stone-200 hover:border-emerald-400/60 hover:shadow-md rounded-xl text-left text-stone-700 font-medium text-sm md:text-base leading-relaxed transition-all shadow-sm group">
          <div className="relative z-10 flex items-start">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700 mr-3 shrink-0">
              {String.fromCharCode(65+i)}
            </span>
            <span className="mt-0.5">{opt}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function TrueFalse({ onAnswer }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center py-4">
      {['BENAR','SALAH'].map(opt => (
        <motion.button key={opt} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(opt)}
          className={`relative overflow-hidden flex-1 py-8 text-2xl font-black rounded-2xl border-2 transition-all shadow-md group ${
            opt==='BENAR'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-300 text-rose-700 hover:border-rose-500 hover:bg-rose-100'
          }`}>
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-3xl">{opt === 'BENAR' ? '✓' : '✕'}</span>
            {opt === 'BENAR' ? 'BENAR' : 'SALAH'}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function Sequence({ options, userAnswer, setUserAnswer }) {
  const add = (opt) => { if (!userAnswer.includes(opt)) setUserAnswer(p=>[...p,opt]); };
  const rem = (i) => setUserAnswer(p=>p.filter((_,idx)=>idx!==i));
  return (
    <div className="space-y-6">
      <div className="space-y-3 min-h-[6rem] p-4 rounded-xl border border-dashed border-stone-300 bg-white shadow-inner">
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">» Urutan Solusi [Execution Order]</p>
        
        {userAnswer.length===0 && (
          <div className="flex flex-col items-center justify-center py-6 opacity-40 text-stone-600">
            <span className="text-3xl mb-2">⬇️</span>
            <p className="text-sm font-medium">AREA KOSONG</p>
          </div>
        )}

        {userAnswer.map((item,i)=>(
          <motion.div key={`${i}`} initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}}
            className="group flex items-center gap-4 bg-amber-50 border border-amber-200 px-5 py-3 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-white border border-amber-300 rounded-lg flex items-center justify-center text-sm font-bold text-amber-700 shrink-0 shadow-sm">
              {i + 1}
            </div>
            <span className="flex-1 text-sm md:text-base text-stone-800 font-medium">{item}</span>
            <button onClick={()=>rem(i)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-rose-100 text-rose-500 hover:text-rose-600 transition-all flex items-center justify-center">✕</button>
          </motion.div>
        ))}
      </div>
      
      <div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">» Pilihan Instruksi</p>
        <div className="grid gap-2">
          {options.map((opt,i)=>{
            const used=userAnswer.includes(opt);
            return <motion.button key={i} whileHover={!used?{scale:1.01}:{}} onClick={()=>!used&&add(opt)} disabled={used}
              className={`px-4 py-3 rounded-xl text-sm md:text-base font-medium border text-left flex items-center justify-between transition-all ${
                used
                  ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                  :'bg-white border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm'
              }`}>
                <span>{opt}</span>
                {!used && <span className="text-emerald-500/50 text-xs">PILIH</span>}
              </motion.button>
          })}
        </div>
      </div>
    </div>
  );
}

function Classification({ categories, options, userAnswer, setUserAnswer }) {
  const place = (cat, opt) => setUserAnswer(prev=>{
    const next={};
    for(const c of categories) next[c]=(prev[c]||[]).filter(v=>v!==opt);
    next[cat]=[...(next[cat]||[]), opt];
    return next;
  });
  const remove = (cat,opt) => setUserAnswer(p=>({...p,[cat]:(p[cat]||[]).filter(v=>v!==opt)}));
  const unused = options.filter(o=>!Object.values(userAnswer).flat().includes(o));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categories.map((cat, idx)=>(
          <div key={cat} className="relative bg-white border border-stone-200 rounded-2xl p-4 overflow-hidden shadow-sm min-h-[140px]">
            {/* Header Accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${idx%2===0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${idx%2===0 ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              {cat}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {(userAnswer[cat]||[]).map((item,j)=>(
                <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} key={j} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-stone-800 border shadow-sm ${
                    idx%2===0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                  {item}
                  <button onClick={()=>remove(cat,item)} className="ml-1 w-5 h-5 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">✕</button>
                </motion.div>
              ))}
              {!(userAnswer[cat]||[]).length && (
                <div className="w-full py-4 text-center border border-dashed border-stone-300 rounded-xl bg-stone-50 text-stone-400 font-medium text-xs">
                  KOSONG
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {unused.length>0&&(
        <div className="pt-4 border-t border-stone-200">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">» Objek Belum Diklasifikasikan</p>
          <div className="space-y-3">
            {unused.map((opt,i)=>(
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm">
                <p className="text-sm font-medium text-stone-800">"{opt}"</p>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {categories.map((cat, idx)=>(
                    <motion.button key={cat} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={()=>place(cat,opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border ${
                        idx%2===0 
                          ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200' 
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
                      }`}>
                      Pilih ➔ {idx===0 ? 'A' : 'B'}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {unused.length===0&&<p className="text-emerald-700 text-sm font-bold text-center bg-emerald-100 py-3 rounded-xl border border-emerald-300">✓ Semua objek terklasifikasi. Siap diselesaikan.</p>}
    </div>
  );
}

function Matching({ leftItems, rightItems, userAnswer, setUserAnswer }) {
  const [sel, setSel] = useState(null);
  const pick = (r) => { if(!sel) return; setUserAnswer(p=>({...p,[sel]:r})); setSel(null); };
  const clear = (l) => { setUserAnswer(p=>{const n={...p};delete n[l];return n;}); setSel(null); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">» Hubungkan Konsep</p>
        <span className="text-xs font-bold bg-white text-stone-600 px-3 py-1 rounded-full border border-stone-200 shadow-sm">
          {Object.keys(userAnswer).length}/{leftItems.length} TERHUBUNG
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-[10px] font-black font-sans text-stone-400 uppercase mb-2 border-b border-stone-200 pb-2">KOLOM A [PILIH]</p>
          {leftItems.map((item,i)=>{
            const isPaired=userAnswer[item]; const isSel=sel===item;
            return <motion.button key={i} whileHover={{scale:1.02}} onClick={()=>isSel?setSel(null):isPaired?clear(item):setSel(item)}
              className={`w-full p-4 rounded-xl text-sm md:text-base text-left font-medium border transition-all leading-snug shadow-sm relative overflow-hidden ${
                isSel
                  ?'bg-amber-100 border-amber-300 text-amber-800'
                  :isPaired
                    ?'bg-emerald-50 border-emerald-300 text-emerald-800'
                    :'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}>
              {isPaired && <div className="text-[10px] font-bold text-emerald-600 mb-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> TERHUBUNG</div>}
              {isSel && <div className="text-[10px] font-bold text-amber-600 mb-1 flex items-center gap-1 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> PILIH TARGET DI KOLOM B</div>}
              {item}
            </motion.button>;
          })}
        </div>
        
        <div className="space-y-3">
          <p className="text-[10px] font-black font-sans text-stone-400 uppercase mb-2 border-b border-stone-200 pb-2">KOLOM B [TARGET]</p>
          {rightItems.map((item,i)=>{
            const usedBy=Object.entries(userAnswer).find(([_,v])=>v===item)?.[0];
            return <motion.button key={i} whileHover={sel && !usedBy ? {scale:1.02} : {}} onClick={()=>usedBy?clear(usedBy):pick(item)}
              className={`w-full p-4 rounded-xl text-sm md:text-base text-left font-medium border transition-all leading-snug shadow-sm ${
                usedBy
                  ?'bg-emerald-50 border-emerald-300 text-emerald-800'
                  :sel
                    ?'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 cursor-pointer pointer-events-auto'
                    :'bg-stone-100 border-stone-200 text-stone-500 cursor-default pointer-events-none'
              }`}>
              {usedBy && <div className="text-[10px] font-bold text-emerald-600 mb-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> TERHUBUNG KE KOLOM A</div>}
              {item}
            </motion.button>;
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN GAME LEVEL COMPONENT
// ─────────────────────────────────────────────────────────────
export default function GameLevel() {
  const { level } = useParams();
  const lvl = parseInt(level, 10) || 1;
  const navigate = useNavigate();
  const { student, loading, refreshStudentData } = useContext(GameContext);

  const [question, setQuestion]     = useState(null);
  const [storyData, setStoryData]   = useState(null);
  const [loadingQ, setLoadingQ]     = useState(true);
  const [dataReady, setDataReady]   = useState(false);

  // 'INTRO' | 'PRE_GAME_ANIM' | 'GAME' | 'OUTRO' | 'COMPLETE'
  const [phase, setPhase]           = useState('INTRO');
  const [dialogIdx, setDialogIdx]   = useState(0);
  // Character selection removed — using default game settings (300s, 3 lives)

  const [timeLeft, setTimeLeft]     = useState(300);
  const [lives, setLives]           = useState(3);
  const [wrongCount, setWrongCount] = useState(0); // Track total wrong answers for star calc
  const [submitted, setSubmitted]   = useState(false);
  const [feedback, setFeedback]     = useState(null);
  const [winData, setWinData]       = useState(null);
  const [totalLevels, setTotalLevels] = useState(null);
  const [hintsUsed, setHintsUsed]   = useState(0);
  const gameOverRef                 = useRef(false);
  const correctAnswerRef            = useRef(false); // Lock: cegah double-trigger jawaban benar
  const capturedTimeRef             = useRef(300);   // Snapshot timeLeft saat jawaban benar
  const capturedWrongRef            = useRef(0);     // Snapshot wrongCount saat jawaban benar
  const dbSavePromiseRef            = useRef(null);  // Promise DB save — ditunggu saat outro selesai

  const [seqAns, setSeqAns]         = useState([]);
  const [classAns, setClassAns]     = useState({});
  const [matchAns, setMatchAns]     = useState({});
  const [isNavigating, setIsNavigating] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);

  // ── Load question & total levels ─────────────────────────
  // prevLvlRef: deteksi apakah trigger karena lvl berubah atau hanya student berubah
  const prevLvlRef = useRef(null);
  useEffect(() => {
    if (!student) return;

    const lvlChanged = prevLvlRef.current !== lvl;
    prevLvlRef.current = lvl;

    // GUARD: Hanya skip jika student berubah (bukan lvl) dan game sedang outro/complete
    // Ini mencegah refreshStudentData() men-trigger reset saat outro masih berjalan
    if (!lvlChanged && correctAnswerRef.current) return;

    // Jika lvl berubah (navigasi ke level baru), selalu reset semua state
    if (lvlChanged) {
      correctAnswerRef.current = false;
      dbSavePromiseRef.current  = null;
    }

    // Reset all game states
    setLoadingQ(true);
    setDataReady(false);
    setPhase('INTRO');
    setDialogIdx(0);
    setTimeLeft(300);
    setLives(3);
    setWrongCount(0);
    setSubmitted(false);
    setFeedback(null);
    setWinData(null);
    setSeqAns([]);
    setClassAns({});
    setMatchAns({});
    setHintsUsed(0);
    setIsNavigating(false);
    gameOverRef.current = false;
    correctAnswerRef.current = false;
    capturedTimeRef.current  = 300;
    capturedWrongRef.current = 0;
    dbSavePromiseRef.current = null;
    
    // Fetch total levels count with retries
    const fetchLevelCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions/count`, { timeout: 5000 });
        const total = res.data?.total || 10;
        setTotalLevels(Math.max(total, 10)); // Ensure at least 10 levels
      } catch (err) {
        console.warn('Failed to fetch level count:', err.message);
        setTotalLevels(10); // Default to 10 levels
      }
    };
    
    fetchLevelCount();

    axios.get(`${import.meta.env.VITE_API_URL}/api/questions/${lvl}`)
      .then(res => {
        const q = res.data?.[0];
        if (!q) { navigate('/dashboard'); return; }
        setQuestion(q);
        if (q.story_json) {
          try {
            const parsed = JSON.parse(q.story_json);
            setStoryData(parsed);
            setPhase('INTRO');
          } catch {
            setStoryData(null);
            setPhase('GAME');
          }
        } else {
          setStoryData(null);
          setPhase('GAME');
        }
        setLoadingQ(false);
        setDataReady(true);
      })
      .catch(() => {
        console.error(`Failed to load level ${lvl}`);
        navigate('/dashboard');
      });
  }, [lvl, student]);

  // ── Adaptive Mechanics Setup ─────────────────────────────
  // ── Game Setup (default: 300s timer, 3 lives) ─────────────
  useEffect(() => {
    if (phase === 'GAME') {
      setTimeLeft(300);
      setLives(3);
    }
  }, [phase]);

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'GAME' || submitted || gameOverRef.current) return;
    if (lives <= 0 || timeLeft <= 0) {
      if (!gameOverRef.current) {
          gameOverRef.current = true;
          setFeedback(null);
          axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
            session_id: student.session_id,
            level_number: lvl,
            poin: 0, bintang: 0,
            waktu_detik: 300 - timeLeft,
            is_complete: false, attempts: 1
          }).catch(e => console.error('Timer game over submit failed:', e.message));
          setShowGameOverPopup(true);
        }
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, lives, phase, submitted]);

  // ── Dialog data ───────────────────────────────────────────
  const introDialogs = storyData?.intro  || [];
  const outroDialogs = storyData?.outro  || [];
  const currentDialogs = phase === 'INTRO' ? introDialogs : (phase === 'OUTRO' ? outroDialogs : []);
  const curDialog = currentDialogs[dialogIdx] || null;

  // ── Which characters are on stage ─────────────────────────
  const speakerKey = curDialog ? (curDialog.npcName || curDialog.speaker) : null;

  // Collect left and right characters from nearby dialogs
  const nearbyDialogs = currentDialogs.slice(Math.max(0, dialogIdx - 5), dialogIdx + 6);
  let leftKey = null, rightKey = null;
  for (const d of nearbyDialogs) {
    const sk = d.npcName || d.speaker;
    const def = CHARS[sk];
    if (!def) continue;
    if (def.side === 'left' && !leftKey) leftKey = sk;
    if (def.side === 'right' && !rightKey) rightKey = sk;
  }
  // Ardi always on right if no right speaker found
  if (!rightKey && phase !== 'GAME') rightKey = 'ZENO';

  const handleDialogNext = useCallback(() => {
    if (dialogIdx + 1 < currentDialogs.length) {
      setDialogIdx(i => i + 1);
    } else if (phase === 'INTRO') {
      setPhase('PRE_GAME_ANIM');
      setTimeout(() => { setPhase('GAME'); setDialogIdx(0); }, 1500);
    } else if (phase === 'OUTRO') {
      // Outro selesai — tunggu DB save selesai dulu, lalu refresh data & tampilkan COMPLETE
      const doFinish = async () => {
        try {
          // Tunggu DB save yang dimulai di handleLevelComplete
          if (dbSavePromiseRef.current) {
            await dbSavePromiseRef.current;
          }
        } catch (e) {
          console.warn('DB save error saat outro selesai:', e.message);
        }
        // Refresh data siswa → level berikutnya terbuka
        await refreshStudentData();
        setPhase('COMPLETE');
      };
      doFinish();
    }
  }, [dialogIdx, currentDialogs.length, phase, refreshStudentData]);

  // ── Verify helpers ────────────────────────────────────────
  const getUserAnswer = () => {
    if (!question) return null;
    if (question.type === 'SEQUENCE') return seqAns;
    if (question.type === 'CLASSIFICATION') return classAns;
    if (question.type === 'MATCHING') return matchAns;
    return null;
  };
  const canVerify = () => {
    if (!question) return false;
    if (question.type === 'SEQUENCE') return seqAns.length > 0;
    if (question.type === 'CLASSIFICATION') {
      try { const c=JSON.parse(question.correct_config); return Object.values(classAns).flat().length>=Object.values(c).flat().length; } catch { return false; }
    }
    if (question.type === 'MATCHING') {
      try { const c=JSON.parse(question.correct_config); return Object.keys(matchAns).length>=Object.keys(c).length; } catch { return false; }
    }
    return false;
  };

  const processAnswer = (ans) => {
    // Ref-based lock — cegah double-trigger (state React async tidak reliable di closure)
    if (correctAnswerRef.current || gameOverRef.current) return;
    const ok = verifyAnswer(question.type, question.correct_config, ans);
    if (ok) {
      // LOCK SEGERA — sinkron, sebelum React re-render apapun
      correctAnswerRef.current = true;
      gameOverRef.current = true; // Hentikan timer seketika

      // Snapshot nilai tepat saat jawaban benar (hindari stale closure)
      capturedTimeRef.current  = timeLeft;
      capturedWrongRef.current = wrongCount;

      // Feedback singkat 1.2 detik, lalu langsung Outro → Complete
      setFeedback({ type: 'success', text: 'KERJA BAGUS!', explanation: question.explanation });
      setTimeout(() => {
        setFeedback(null);
        handleLevelComplete();
      }, 1200);
    } else {
      let nl = lives;
      nl -= 1;
      setLives(nl);
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      setFeedback({ type: 'error', text: `JAWABAN KURANG TEPAT. KESEMPATAN: ${nl}`, explanation: question.failure_message || question.explanation });
      setSeqAns([]); setClassAns({}); setMatchAns({});
      if (nl <= 0) {
        // Game over (3x gagal): submit dengan 0 bintang, 0 XP
        setTimeout(() => {
          gameOverRef.current = true;
          setFeedback(null);
          axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
            session_id: student.session_id,
            level_number: lvl,
            poin: 0,
            bintang: 0,
            waktu_detik: 300 - timeLeft,
            is_complete: false,
            attempts: 1,
            wrong_count: newWrongCount
          }).catch(e => console.error('Game over submit failed:', e.message));
          setShowGameOverPopup(true);
        }, 2800);
      } else {
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  // ── XP Timer brackets ────────────────────────────────────
  const getTimerXP = (elapsedSeconds) => {
    if (elapsedSeconds < 30)  return 50;
    if (elapsedSeconds < 60)  return 45;
    if (elapsedSeconds < 90)  return 40;
    if (elapsedSeconds < 120) return 35;
    if (elapsedSeconds < 150) return 30;
    if (elapsedSeconds < 180) return 25;
    if (elapsedSeconds < 210) return 20;
    if (elapsedSeconds < 240) return 15;
    if (elapsedSeconds < 270) return 10;
    return 5;
  };

  const handleLevelComplete = async () => {
    // Guard secondary — ref sudah handle primary lock di processAnswer
    if (submitted) return;
    setSubmitted(true);

    // Gunakan nilai snapshot (diambil saat jawaban benar, sebelum async apapun)
    const snapshotWrong  = capturedWrongRef.current;
    const snapshotTime   = capturedTimeRef.current;
    const elapsedSeconds = 300 - snapshotTime;
    const st             = Math.max(0, 3 - snapshotWrong);

    const starXPMap  = { 3: 50, 2: 30, 1: 10, 0: 0 };
    const starXP     = starXPMap[st] || 0;
    const timerXP    = getTimerXP(elapsedSeconds);
    const totalXP    = starXP + timerXP;
    const pendingWin = { bintang: st, starXP, timerXP, totalXP, wrongCount: snapshotWrong, elapsedSeconds };

    const outroDialogs = storyData?.outro || [];

    if (outroDialogs.length > 0) {
      // ── Tampilkan OUTRO dulu, simpan DB di background ────
      setWinData(pendingWin);
      setDialogIdx(0);
      setPhase('OUTRO'); // Langsung pindah ke VN outro

      // Simpan ke DB — simpan promise ke ref agar handleDialogNext bisa menunggu
      dbSavePromiseRef.current = axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
        session_id: student.session_id, level_number: lvl,
        poin: totalXP, bintang: st, waktu_detik: elapsedSeconds,
        is_complete: true, attempts: 1, wrong_count: snapshotWrong
      }, { timeout: 10000 })
        .then(res => {
          if (res.status === 201 || res.data?.message) {
            console.log(`Level ${lvl} saved — ${st}★, XP: ${totalXP}`);
          }
          return res;
        })
        .catch(e => { console.error('Save failed (background):', e.message); throw e; });
    } else {
      // ── Tidak ada outro: simpan dulu, baru tampilkan popup ─
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
          session_id: student.session_id, level_number: lvl,
          poin: totalXP, bintang: st, waktu_detik: elapsedSeconds,
          is_complete: true, attempts: 1, wrong_count: snapshotWrong
        }, { timeout: 10000 });
        if (res.status === 201 || res.data?.message) {
          await refreshStudentData();
        }
      } catch (e) {
        console.error('Failed to submit result:', e.message);
        setSubmitted(false);
        correctAnswerRef.current = false;
        setFeedback({ type: 'error', text: 'SAVE_FAILED: Network error', explanation: 'Level result could not be saved.' });
        return;
      }
      setWinData(pendingWin);
      setPhase('COMPLETE');
    }
  };

  // ── Parse options ─────────────────────────────────────────
  let opts=[], cats=[], leftItems=[], rightItems=[];
  if (question) {
    try {
      const raw = JSON.parse(question.options_json);
      if (question.type==='CLASSIFICATION') {
        opts = Array.isArray(raw) ? raw : [];
        try { cats = Object.keys(JSON.parse(question.correct_config)); } catch {}
      } else if (question.type==='MATCHING') {
        leftItems = raw.left||[]; rightItems = raw.right||[];
      } else {
        opts = Array.isArray(raw) ? raw : [];
      }
    } catch {}
  }

  const scene = storyData?.scene ? (SCENES[storyData.scene]||SCENES.lab_komputer) : SCENES.lab_komputer;
  const mm = Math.floor(timeLeft/60).toString().padStart(2,'0');
  const ss = (timeLeft%60).toString().padStart(2,'0');

  const getBgClass = (l) => {
    if ([1, 2, 4, 5, 6].includes(l)) return 'bg-hardware';
    if ([3].includes(l)) return 'bg-core';
    if ([7, 8].includes(l)) return 'bg-academy';
    if ([9, 10].includes(l)) return 'bg-network';
    return 'bg-hardware';
  };
  const bgClass = getBgClass(lvl);

  // ── Guards ────────────────────────────────────────────────
  if (loading || loadingQ || !dataReady) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center font-sans city-bg ${bgClass}`}>
        {/* Frosted overlay — tipis agar background city terlihat */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[3px]" />

        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 65%)' }} />

        {/* Content — full width, vertically centered */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-10 w-full h-full px-8 py-16">

          {/* Spinner block */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin" style={{ animationDuration: '12s' }} />
              <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-t-sky-400 border-r-sky-300/50 animate-spin" style={{ animationDuration: '1.4s' }} />
              <div className="absolute inset-8 rounded-full border-2 border-transparent border-t-amber-400 border-l-amber-300/40 animate-spin" style={{ animationDuration: '0.85s', animationDirection: 'reverse' }} />
              {/* Glow core */}
              <div className="absolute inset-[42px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)' }} />
              <span className="text-5xl relative z-10" style={{ filter: 'drop-shadow(0 4px 16px rgba(14,165,233,0.7))' }}>⚡</span>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-600/80">MEMUAT MISI</p>
              <h2 className="text-3xl font-black text-stone-800 drop-shadow-sm">
                MENYIAPKAN <span className="text-sky-500">BAB {lvl}</span>
              </h2>
              <p className="text-stone-500/70 text-sm font-medium">Tunggu sebentar, sedang memuat data...</p>
            </div>
          </div>

          {/* Progress card */}
          <div className="w-full max-w-sm rounded-2xl px-7 py-5 space-y-3" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)', border: '1px solid rgba(255,255,255,0.85)' }}>
            <div className="flex justify-between text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              <span>Memuat data...</span>
              <span className="text-sky-500 font-bold">Harap Tunggu</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full animate-pulse relative overflow-hidden" style={{ width: '55%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)', boxShadow: '0 0 10px rgba(14,165,233,0.5)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 1.5s infinite' }} />
              </div>
            </div>
            <p className="text-center text-[10px] text-stone-400 font-mono uppercase tracking-widest">Sistem sedang menyiapkan sesi belajar Anda</p>
          </div>

        </div>
      </div>
    );
  }

  if (!student) return <Navigate to="/register" replace />;
  if (!question) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center font-sans city-bg ${bgClass}`}>
      <div className="absolute inset-0 bg-white/45 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center gap-5 px-10 w-full max-w-sm">
        <div className="text-7xl" style={{ filter: 'drop-shadow(0 4px 16px rgba(251,191,36,0.5))' }}>🗺️</div>
        <div className="w-full rounded-2xl px-7 py-7 text-center space-y-4" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.8)' }}>
          <h2 className="text-xl font-black text-stone-800">Modul Tidak Ditemukan</h2>
          <p className="text-stone-500 text-sm">Bab {lvl} belum tersedia di sistem.</p>
          <button onClick={()=>navigate('/dashboard')} className="w-full py-3 rounded-xl font-bold text-white text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' }}>KEMBALI KE PETA</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <div className={`min-h-screen w-full flex flex-col relative overflow-hidden text-stone-800 font-sans city-bg ${bgClass}`}>

      {/* ── MODERN KODOMO CITY AMBIENT BACKGROUND OVERLAY ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-white/5 backdrop-blur-[2px]">
        {/* Soft lighting */}
        <div
          className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-white/30 to-transparent"
        />
      </div>

      {/* ════════════════ PRE-GAME TRANSITION ANIMATION ════════════════ */}
      <AnimatePresence>
        {phase === 'PRE_GAME_ANIM' && (
          <motion.div
            key="pre-game-anim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            className={`city-bg ${bgClass}`}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* — BG LAYERS (pointer-events:none, tidak ganggu centering) — */}
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.32)', backdropFilter:'blur(4px)' }} />
            <div style={{ position:'absolute', inset:0, opacity:0.06, backgroundImage:`linear-gradient(${scene.glow} 1px, transparent 1px), linear-gradient(90deg, ${scene.glow} 1px, transparent 1px)`, backgroundSize:'52px 52px' }} />
            <motion.div animate={{ scale:[1,1.3,1], opacity:[0.22,0.48,0.22] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }} style={{ position:'absolute', top:'-10vh', left:'-10vw', width:'55vw', height:'55vw', maxWidth:600, maxHeight:600, borderRadius:'50%', background:`radial-gradient(circle, ${scene.glow}80 0%, transparent 65%)`, filter:'blur(70px)', pointerEvents:'none' }} />
            <motion.div animate={{ scale:[1.2,0.85,1.2], opacity:[0.12,0.32,0.12] }} transition={{ duration:7, repeat:Infinity, ease:'easeInOut', delay:1.5 }} style={{ position:'absolute', bottom:'-8vh', right:'-8vw', width:'45vw', height:'45vw', maxWidth:500, maxHeight:500, borderRadius:'50%', background:`radial-gradient(circle, ${scene.glow}60 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />
            {/* Floating particles */}
            <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
              {[0,1,2,3,4,5,6,7].map(i => (
                <motion.div key={i}
                  initial={{ opacity:0, y:'110vh', x:`${5+i*12}vw` }}
                  animate={{ opacity:[0,0.7,0.7,0], y:'-10vh' }}
                  transition={{ delay:i*0.35, duration:4+i*0.5, repeat:Infinity, ease:'easeOut' }}
                  style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:scene.glow, boxShadow:`0 0 8px ${scene.glow}, 0 0 16px ${scene.glow}80` }}
                />
              ))}
            </div>

            {/* — CENTER CONTENT — guaranteed centered by parent flex — */}
            <motion.div
              initial={{ scale:0.88, opacity:0, y:32 }}
              animate={{ scale:1, opacity:1, y:0 }}
              transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
              style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, width:'100%', maxWidth:360, padding:'0 24px' }}
            >
              {/* Orbiting rings */}
              <div style={{ position:'relative', width:160, height:160, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <motion.div animate={{ rotate:-360 }} transition={{ duration:14, repeat:Infinity, ease:'linear' }} style={{ position:'absolute', inset:0, borderRadius:'50%', border:`2px dashed ${scene.glow}40` }} />
                <motion.div animate={{ rotate:360 }} transition={{ duration:3, repeat:Infinity, ease:'linear' }} style={{ position:'absolute', inset:16, borderRadius:'50%', borderWidth:3, borderStyle:'solid', borderColor:'transparent', borderTopColor:scene.glow, borderRightColor:`${scene.glow}60`, boxShadow:`0 0 20px ${scene.glow}60` }} />
                <motion.div animate={{ rotate:-360 }} transition={{ duration:1.8, repeat:Infinity, ease:'linear' }} style={{ position:'absolute', inset:40, borderRadius:'50%', borderWidth:2, borderStyle:'solid', borderColor:'transparent', borderTopColor:scene.glow, borderLeftColor:`${scene.glow}40` }} />
                <div style={{ position:'absolute', inset:52, borderRadius:'50%', background:`radial-gradient(circle, ${scene.glow}30 0%, transparent 70%)` }} />
                <motion.div animate={{ scale:[0.9,1.1,0.9] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }} style={{ fontSize:52, lineHeight:1, position:'relative', zIndex:1, filter:`drop-shadow(0 4px 14px ${scene.glow}90)` }}>
                  {question?.level_emoji || scene.icon}
                </motion.div>
              </div>

              {/* Text */}
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ textAlign:'center' }}>
                <p style={{ fontSize:10, fontWeight:900, letterSpacing:'0.5em', textTransform:'uppercase', color:scene.glow, marginBottom:6 }}>PROBLEM SOLVING PROTOCOL</p>
                <h2 style={{ fontSize:'clamp(28px, 6vw, 40px)', fontWeight:900, color:'#1c1917', lineHeight:1.15, marginBottom:8, textShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>SIAP<br/>BERTARUNG!</h2>
                <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:'6px 8px' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.1em' }}>BAB {lvl}</span>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:scene.glow, display:'inline-block' }} />
                  <span style={{ fontSize:11, fontWeight:700, color:scene.glow, textTransform:'uppercase', letterSpacing:'0.1em' }}>{scene.label}</span>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:scene.glow, display:'inline-block' }} />
                  <span style={{ fontSize:11, fontWeight:700, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.1em' }}>{lvl>=7?'🔥 HARD':lvl>=4?'⭐ MEDIUM':'💚 EASY'}</span>
                </div>
              </motion.div>

              {/* Progress card */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} style={{ width:'100%', borderRadius:16, padding:'18px 22px', background:'rgba(255,255,255,0.80)', backdropFilter:'blur(20px)', boxShadow:`0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.9)` }}>
                <div style={{ height:3, borderRadius:4, marginBottom:12, background:`linear-gradient(90deg, ${scene.glow}, ${scene.glow}80, ${scene.glow})` }} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8, color:'#a8a29e' }}>
                  <span>Memuat soal...</span>
                  <motion.span style={{ color:scene.glow, fontWeight:700 }} animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}>Siap!</motion.span>
                </div>
                <div style={{ width:'100%', height:8, background:'#f5f5f4', borderRadius:8, overflow:'hidden' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:'100%' }} transition={{ duration:3.2, ease:'easeInOut', delay:0.1 }} style={{ height:'100%', borderRadius:8, position:'relative', overflow:'hidden', background:`linear-gradient(90deg, ${scene.glow}, ${scene.glow}cc)`, boxShadow:`0 0 10px ${scene.glow}80` }}>
                    <motion.div animate={{ x:['-100%','200%'] }} transition={{ duration:1.1, repeat:Infinity, ease:'easeInOut', delay:0.4 }} style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Bouncing dots */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }} style={{ display:'flex', gap:10 }}>
                {[0,1,2,3].map(i => (
                  <motion.div key={i}
                    animate={{ y:[0,-10,0], opacity:[0.35,1,0.35] }}
                    transition={{ duration:0.85, delay:i*0.18, repeat:Infinity, ease:'easeInOut' }}
                    style={{ width:10, height:10, borderRadius:'50%', background:i%2===0?scene.glow:'rgba(0,0,0,0.12)', boxShadow:i%2===0?`0 0 8px ${scene.glow}`:undefined }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* ════════════════ VN PHASE (INTRO / OUTRO) ════════════════ */}
      {(phase === 'INTRO' || phase === 'OUTRO') && (
        <>
          {/* Kodomo-style VN Header */}
          <div className="relative z-30 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 glass px-5 py-2.5 rounded-full shadow-md">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg bg-white/80 shadow-sm border border-white/90" style={{ borderColor: scene.glow }}>
                {question?.level_emoji || scene.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{storyData?.chapter}</p>
                <p className="text-sm font-bold text-stone-800 tracking-wide">{scene.label}</p>
              </div>
            </div>

            {phase === 'INTRO' && (
              <button onClick={() => { setPhase('PRE_GAME_ANIM'); setTimeout(()=>setPhase('GAME'), 1500); setDialogIdx(0); }}
                className="group flex items-center gap-2 text-xs font-bold text-sky-600 border border-sky-300 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full hover:bg-sky-50 hover:border-sky-400 transition-all shadow-sm">
                Lewati Cerita <span className="group-hover:translate-x-1 transition-transform"></span>
              </button>
            )}
            {phase === 'OUTRO' && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">✨ Percakapan Akhir</span>
                <button onClick={() => setPhase('COMPLETE')}
                  className="group flex items-center gap-2 text-xs font-bold text-stone-500 border border-stone-300 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full hover:bg-stone-50 transition-all shadow-sm">
                  Lewati <span className="group-hover:translate-x-1 transition-transform"></span>
                </button>
              </div>
            )}
          </div>

          {/* Progress dots - Kodomo style */}
          <div className="relative z-30 px-8 flex gap-1.5 justify-center max-w-2xl mx-auto">
            {currentDialogs.map((_, i) => (
              <div key={i}
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: i === dialogIdx ? '36px' : '10px',
                  background: i <= dialogIdx ? scene.glow : 'rgba(0,0,0,0.15)',
                  boxShadow: i === dialogIdx ? `0 0 8px ${scene.glow}` : 'none'
                }} />
            ))}
          </div>

          {/* CHARACTER STAGE */}
          <div className="flex-1 relative z-10 w-full max-w-7xl mx-auto" style={{ minHeight: '50vh' }}>
            {/* Scene mood overlay - subtle color wash based on scene */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${scene.glow}10 0%, transparent 70%)`,
              }}
            />
            <AnimatePresence mode="popLayout">
              {leftKey && leftKey !== 'NARASI' && (
                <CharacterSprite
                  key={`L-${leftKey}`}
                  charKey={leftKey}
                  isActive={speakerKey === leftKey}
                  side="left"
                  mood={speakerKey === leftKey ? curDialog?.mood : 'normal'}
                />
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {rightKey && rightKey !== 'NARASI' && (
                <CharacterSprite
                  key={`R-${rightKey}`}
                  charKey={rightKey}
                  isActive={speakerKey === rightKey}
                  side="right"
                  mood={speakerKey === rightKey ? curDialog?.mood : 'normal'}
                />
              )}
            </AnimatePresence>
          </div>

          {/* DIALOG BOX AREA */}
          <div className="relative z-40 pb-5 w-full drop-shadow-2xl">
            <AnimatePresence mode="wait">
              {curDialog && (
                <DialogBox
                  key={`${phase}-${dialogIdx}`}
                  dialog={curDialog}
                  onNext={handleDialogNext}
                  isLast={dialogIdx === currentDialogs.length - 1}
                  sceneGlow={scene.glow}
                />
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ════════════════ GAME PHASE ════════════════ */}
      {phase === 'GAME' && (
        <div className="flex-1 flex flex-col relative z-20 h-screen overflow-hidden">
          {/* Ghibli HUD Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3 flex justify-between items-center z-30 shrink-0 shadow-sm">
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => navigate('/dashboard')} className="group flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors shadow-sm text-stone-500 hover:text-stone-700">
                <span className="group-hover:-translate-x-0.5 transform block">◁</span>
              </button>
              
              <div className="hidden sm:block h-8 w-px bg-stone-300" />
              
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">{storyData?.chapter || `CHAPTER ${lvl}`}</p>
                <p className="text-base font-serif font-black text-stone-800 flex items-center gap-2">
                  <span className="opacity-90">{question?.level_emoji || scene.icon}</span>{scene.label}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">


              <div className="flex items-center gap-1.5 bg-stone-100 px-4 py-2 rounded-full border border-stone-200 shadow-inner">
                {[...Array(3)].map((_,i)=>(
                  <motion.div key={i} 
                    initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay: i*0.1}}
                    className={`relative w-4 h-4 rounded-full border ${
                      i < lives 
                        ? 'bg-rose-400 border-rose-300 shadow-[0_2px_4px_rgba(251,113,133,0.3)]' 
                        : 'bg-stone-300 border-stone-200'
                    }`} 
                  />
                ))}
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Waktu</span>
                <div className={`font-mono text-xl font-bold tracking-wider ${timeLeft<=120?'text-rose-500 animate-pulse':'text-stone-700'}`}>
                  {mm}:{ss}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Quest Briefing Panel */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-md p-6 shadow-xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
              
              <div className="flex flex-wrap items-start gap-3 mb-4">
                {question.level_emoji && (
                  <div className="text-5xl md:text-6xl" style={{filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'}}>
                    {question.level_emoji}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded border border-emerald-200 uppercase tracking-widest flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> TUGAS AKTIF</span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded bg-stone-100 text-stone-500 border border-stone-200 uppercase">{question.topic}</span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded bg-stone-100 text-stone-500 border border-stone-200 uppercase">{question.bloom_level}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-lg md:text-xl font-medium text-stone-800 leading-relaxed font-serif">{question.question_text}</p>
            </motion.div>

            {/* Interactive Workspace */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/95 backdrop-blur-md p-6 shadow-xl">
              
              {/* Subtle texture in workspace */}
              <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              <div className="relative z-10 w-full mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-stone-300" />
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest shrink-0">
                  {question.type==='MULTIPLE_CHOICE'&&'PILIHAN GANDA'}
                  {question.type==='TRUE_FALSE'&&'BENAR ATAU SALAH'}
                  {question.type==='SEQUENCE'&&'SUSUN URUTAN'}
                  {question.type==='CLASSIFICATION'&&'KLASIFIKASI OBJEK'}
                  {question.type==='MATCHING'&&'HUBUNGKAN KONSEP'}
                </p>
                <div className="h-px flex-1 bg-stone-300" />
              </div>

              <div className="relative z-10 w-full pb-6">
                {question.type==='MULTIPLE_CHOICE'&&<MultipleChoice options={opts} onAnswer={processAnswer} />}
                {question.type==='TRUE_FALSE'     &&<TrueFalse onAnswer={processAnswer} />}
                {question.type==='SEQUENCE'       &&<Sequence options={opts} userAnswer={seqAns} setUserAnswer={setSeqAns} />}
                {question.type==='CLASSIFICATION' &&<Classification categories={cats} options={opts} userAnswer={classAns} setUserAnswer={setClassAns} />}
                {question.type==='MATCHING'       &&<Matching leftItems={leftItems} rightItems={rightItems} userAnswer={matchAns} setUserAnswer={setMatchAns} />}
              </div>
              
              {/* Submit Button (Only for complex mechanics) */}
              {['SEQUENCE','CLASSIFICATION','MATCHING'].includes(question.type) && (
                <div className="relative z-10 pt-6 mt-4">
                  <motion.button whileHover={{scale:canVerify()?1.02:1}} whileTap={{scale:canVerify()?0.98:1}}
                    onClick={()=>processAnswer(getUserAnswer())} disabled={!canVerify()}
                    className={`w-full py-4 font-bold text-lg rounded-xl transition-all tracking-wide flex items-center justify-center gap-3 shadow-md ${
                      canVerify() 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer shadow-blue-500/30' 
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                    }`}>
                    {canVerify() ? (
                      <><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> SELESAIKAN TUGAS</>
                    ) : (
                      <><span className="opacity-70">MEMBUTUHKAN INPUT</span></>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      )}

      {/* ════════════════ LEVEL COMPLETE — POPUP CARD ════════════════ */}
      <AnimatePresence>
        {phase === 'COMPLETE' && winData && (
          <motion.div
            key="complete-popup-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className={`fixed inset-0 z-[300] font-sans city-bg ${bgClass}`}
          >
            {/* Full screen dark blur overlay */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-none" />
            
            {/* Confetti (Di luar popup agar meriah di seluruh layar) */}
            <div className="absolute top-0 inset-x-0 w-full pointer-events-none z-0">
              {[...Array(24)].map((_, i) => (
                <motion.div key={i}
                  className="absolute top-0 rounded-sm"
                  style={{ left: `${(i / 23) * 100}%`, width: 8 + (i%3)*4, height: 8 + (i%3)*4,
                    background: ['#FFD166','#EF476F','#06D6A0','#A29BFE', scene.glow || '#FFD166'][i % 5] }}
                  initial={{ y: -20, rotate: 0, opacity: 1 }}
                  animate={{ y: '110vh', rotate: 720*(i%2?1:-1), opacity:[1,1,0] }}
                  transition={{ duration: 4 + (i%3)*1.2, delay: i*0.07, ease:'easeOut' }}
                />
              ))}
            </div>

            {/* Flex container khusus untuk Pop Up agar tidak terganggu elemen absolute */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 overflow-y-auto z-10 pointer-events-none">
              {/* POPUP CARD */}
              <motion.div
                initial={{ scale: 0.85, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-10 text-center shadow-2xl border-4 overflow-hidden pointer-events-auto"
                style={{ borderColor: winData.bintang === 3 ? '#A7F3D0' : winData.bintang === 2 ? '#FDE68A' : '#FECDD3' }}
              >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 w-full h-3" 
                   style={{ background: winData.bintang === 3 ? 'linear-gradient(90deg, #34D399, #10B981)' : winData.bintang === 2 ? 'linear-gradient(90deg, #FCD34D, #F59E0B)' : 'linear-gradient(90deg, #FB7185, #E11D48)' }} />

              {/* Ambient inner glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none"
                   style={{ background: winData.bintang === 3 ? '#10B981' : winData.bintang === 2 ? '#F59E0B' : '#E11D48' }} />

              <div className="relative z-10 flex flex-col items-center">
                {/* Trophy */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.1 }}
                  className="mb-2"
                >
                  <motion.span
                    animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: 80, lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(251,191,36,0.5))' }}
                    className="inline-block"
                  >🏆</motion.span>
                </motion.div>

                {/* Title & Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">BAB {lvl}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full text-white" style={{ background: scene.glow || '#6366f1' }}>{scene.label}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-4">
                  LEVEL <span style={{ color: winData.bintang === 3 ? '#10B981' : winData.bintang === 2 ? '#F59E0B' : '#E11D48' }}>SELESAI!</span>
                </h1>

                {/* Stars */}
                <div className="flex gap-3 mb-4">
                  {[0,1,2].map(i => (
                    <motion.span key={i}
                      initial={{ scale:0, rotate:-45 }} animate={{ scale:1, rotate:0 }} transition={{ delay: 0.3 + i*0.15, type:'spring', stiffness:250, damping:18 }}
                      style={{ fontSize: 52, filter: i < winData.bintang ? 'drop-shadow(0 4px 12px rgba(251,191,36,0.6))' : 'grayscale(1) opacity(0.15)' }}
                    >⭐</motion.span>
                  ))}
                </div>

                {/* Grade Label */}
                <div className="text-sm font-black uppercase tracking-widest px-5 py-2 rounded-full mb-6"
                     style={{
                       color: winData.bintang===3?'#059669':winData.bintang===2?'#D97706':'#BE123C',
                       background: winData.bintang===3?'#D1FAE5':winData.bintang===2?'#FEF3C7':'#FFE4E6'
                     }}>
                  {winData.bintang===3?'✨ PERFORMA SEMPURNA!':winData.bintang===2?'👍 KERJA BAGUS!':'💪 TERUS BERLATIH!'}
                </div>

                {/* Stats Grid */}
                <div className="w-full grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon:'⭐', val:`${winData.bintang}/3`, lbl:'Bintang', bg:'bg-amber-50', border:'border-amber-100', text:'text-amber-600' },
                    { icon:'❌', val:winData.wrongCount, lbl:'Salah', bg:'bg-rose-50', border:'border-rose-100', text:'text-rose-600' },
                    { icon:'⏱️', val:`${Math.floor(winData.elapsedSeconds/60)}:${String(winData.elapsedSeconds%60).padStart(2,'0')}`, lbl:'Waktu', bg:'bg-indigo-50', border:'border-indigo-100', text:'text-indigo-600' },
                  ].map(({icon,val,lbl,bg,border,text},idx)=>(
                    <motion.div key={lbl} initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5+idx*0.1 }}
                      className={`rounded-2xl p-3 text-center ${bg} border ${border}`}
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className={`text-lg font-black ${text}`}>{val}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{lbl}</div>
                    </motion.div>
                  ))}
                </div>

                {/* XP Summary Box */}
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8">
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">⭐ Star XP</span>
                    <span className="font-black text-amber-500">+{winData.starXP}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">⏱️ Timer XP</span>
                    <span className="font-black text-indigo-500">+{winData.timerXP}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="font-black text-slate-700 uppercase tracking-widest text-xs">TOTAL XP</span>
                    <motion.span initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.8, type:'spring', stiffness:200 }}
                      className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500"
                    >
                      +{winData.totalXP}
                    </motion.span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="w-full flex flex-col gap-3">
                  {lvl < (totalLevels||10) && (
                    <motion.button
                      whileHover={!isNavigating?{scale:1.02}:{}} whileTap={!isNavigating?{scale:0.98}:{}}
                      onClick={()=>{ if(!isNavigating){ setIsNavigating(true); setTimeout(()=>navigate(`/game/${lvl+1}`),300); } }}
                      disabled={isNavigating}
                      className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-md disabled:opacity-50 transition-all"
                      style={{ background: scene.glow || '#6366f1' }}
                    >
                      {isNavigating
                        ? <><motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} className="w-4 h-4 border-2 border-transparent border-r-white border-t-white rounded-full"/><span>MEMUAT...</span></>
                        : <><span>LEVEL BERIKUTNYA</span><span className="text-lg">▶</span></>
                      }
                    </motion.button>
                  )}
                  {lvl >= (totalLevels||10) && (
                    <motion.button
                      whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                      onClick={()=>{ setIsNavigating(true); setTimeout(()=>navigate('/dashboard'),300); }}
                      className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white shadow-md bg-gradient-to-r from-amber-400 to-rose-400"
                    >🎉 SEMUA LEVEL SELESAI!</motion.button>
                  )}
                  <motion.button
                    whileHover={!isNavigating?{scale:1.02}:{}} whileTap={!isNavigating?{scale:0.98}:{}}
                    onClick={()=>{ if(!isNavigating){ setIsNavigating(true); setTimeout(()=>navigate('/dashboard'),300); } }}
                    disabled={isNavigating}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-all"
                  >◁ KEMBALI KE DASHBOARD</motion.button>
                </div>

              </div>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    {/* ════════════════ TERMINAL FEEDBACK OVERLAY (Fixed to Viewport) ════════════════ */}
    <AnimatePresence>
      {feedback && (
        <motion.div 
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          exit={{opacity:0}}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
        >
            
            <motion.div initial={{scale:0.85, y: 30}} animate={{scale:1, y: 0}} exit={{scale:0.85, opacity:0}} transition={{type: 'spring', stiffness: 300, damping: 30}}
              className={`relative max-w-2xl w-full p-8 md:p-10 rounded-3xl border shadow-2xl overflow-hidden bg-white ${
                feedback.type==='success'
                  ? 'border-emerald-200'
                  : 'border-rose-200'
              }`}>
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFeedback(null)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:shadow-md ${
                  feedback.type==='success' 
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                    : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                }`}
              >
                ✕
              </motion.button>
              
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${feedback.type==='success'?'bg-gradient-to-r from-emerald-400 to-emerald-500':'bg-gradient-to-r from-rose-400 to-rose-500'}`} />
              
              <div className="flex flex-col items-center text-center font-sans">
                {/* Icon Circle */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg border-2 ${
                    feedback.type==='success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-500' 
                      : 'bg-rose-50 border-rose-200 text-rose-500'
                  }`}>
                  {feedback.type==='success'?'✓':'✕'}
                </motion.div>
                
                {/* Main Title */}
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-3xl md:text-4xl font-black mb-4 tracking-tight ${feedback.type==='success'?'text-emerald-600':'text-rose-600'}`}>
                  {feedback.text}
                </motion.h3>
                
                {/* Explanation Box */}
                {feedback.explanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-left w-full p-5 rounded-2xl border-2 leading-relaxed text-sm md:text-base mb-8 ${
                      feedback.type==='success'
                        ?'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        :'bg-rose-50/50 border-rose-200 text-rose-900'
                    }`}>
                    <p className={`font-bold mb-3 uppercase tracking-wide text-xs flex items-center gap-2 ${feedback.type==='success'?'text-emerald-700':'text-rose-700'}`}>
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className={`w-2 h-2 rounded-full ${feedback.type==='success'?'bg-emerald-500':'bg-rose-500'}`} 
                      />
                      PENJELASAN
                    </p>
                    <p className="font-medium leading-relaxed">{feedback.explanation}</p>
                  </motion.div>
                )}

                {/* Success: auto-lanjut ke Outro VN dalam 2 detik */}
                {feedback.type === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full flex items-center justify-center gap-3 text-emerald-600"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 rounded-full border-2 border-emerald-300 border-t-emerald-600 inline-block flex-shrink-0"
                    />
                    <span className="text-xs font-black uppercase tracking-widest">Melanjutkan ke percakapan akhir...</span>
                  </motion.div>
                )}
                
                {/* Error Action Buttons */}
                {feedback.type === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full flex flex-col sm:flex-row gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFeedback(null)}
                      className="flex-1 py-4 rounded-xl font-bold text-base uppercase tracking-wide border-2 transition-all shadow-lg flex items-center justify-center gap-2 bg-gradient-to-br from-rose-400 to-rose-500 border-rose-600 text-white hover:shadow-xl active:shadow-md"
                    >
                      <span>↻ Coba Lagi</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFeedback(null);
                        navigate('/dashboard');
                      }}
                      className="flex-1 py-4 rounded-xl font-bold text-base uppercase tracking-wide border-2 border-stone-300 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:shadow-sm"
                    >
                      <span>◁ Dashboard</span>
                    </motion.button>
                  </motion.div>
                )}
                
                {feedback.type==='success' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 flex items-center justify-center gap-3 text-emerald-600 text-xs font-bold uppercase tracking-wide"
                  >
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 rounded-full border-2 border-emerald-300 border-t-emerald-600" 
                    />
                    Memproses Poin & Bintang...
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ GAME OVER POPUP (3x Gagal) ════════════════ */}
      <AnimatePresence>
        {showGameOverPopup && (
          <GameOverPopup lvl={lvl} navigate={navigate} setShowGameOverPopup={setShowGameOverPopup} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  GAME OVER POPUP COMPONENT (Auto-redirect with countdown)
// ─────────────────────────────────────────────────────────────
function GameOverPopup({ lvl, navigate, setShowGameOverPopup }) {
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    if (countdown <= 0) {
      setShowGameOverPopup(false);
      navigate('/dashboard');
      return;
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate, setShowGameOverPopup]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-200"
      >
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-red-500 to-rose-400" />

        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -200],
                x: [0, (i % 2 === 0 ? 30 : -30)],
                opacity: [0.3, 0],
                scale: [1, 0.5]
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                width: 8 + i * 3,
                height: 8 + i * 3,
                left: `${15 + i * 14}%`,
                bottom: '-10%',
                background: i % 2 === 0 ? 'rgba(244,63,94,0.2)' : 'rgba(251,113,133,0.15)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-8 py-10">
          {/* Animated Failure Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
            className="relative mb-6"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-100 to-red-50 border-4 border-rose-200 flex items-center justify-center shadow-xl">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl select-none"
              >
                😞
              </motion.span>
            </div>
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-rose-300"
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl md:text-4xl font-black text-rose-600 mb-2 tracking-tight"
          >
            MISI GAGAL
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-stone-500 font-medium text-sm md:text-base mb-6"
          >
            Kamu telah kehabisan 3 kesempatan menjawab.<br />
            Jangan menyerah, pelajari materinya dan coba lagi!
          </motion.p>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="w-full rounded-2xl bg-rose-50/80 border border-rose-200 p-5 mb-8"
          >
            <div className="flex justify-around text-center">
              <div>
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Level</p>
                <p className="text-2xl font-black text-rose-600">{lvl}</p>
              </div>
              <div className="w-px bg-rose-200" />
              <div>
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Skor</p>
                <p className="text-2xl font-black text-rose-600">0</p>
              </div>
              <div className="w-px bg-rose-200" />
              <div>
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Bintang</p>
                <p className="text-2xl font-black text-rose-600">☆ ☆ ☆</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full flex flex-col gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setShowGameOverPopup(false);
                navigate(`/game/${lvl}`);
                window.location.reload();
              }}
              className="w-full py-4 rounded-xl font-black text-base uppercase tracking-widest border-2 border-amber-400 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
              style={{ boxShadow: '0 8px 30px rgba(245,158,11,0.3)' }}
            >
              <span>↻</span>
              <span>Ulangi Level</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setShowGameOverPopup(false);
                navigate('/dashboard');
              }}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest border-2 border-stone-300 bg-white text-stone-600 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
            >
              <span>◁</span>
              <span>Kembali ke Dashboard</span>
            </motion.button>
          </motion.div>

          {/* Auto-redirect countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-5 flex flex-col items-center gap-2"
          >
            <p className="text-xs text-stone-400 font-medium">
              Otomatis kembali ke dashboard dalam
            </p>
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#fecdd3" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="#f43f5e" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={97.4}
                    animate={{ strokeDashoffset: 97.4 - (97.4 * countdown / 5) }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-rose-600">
                  {countdown}
                </span>
              </div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">detik</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
