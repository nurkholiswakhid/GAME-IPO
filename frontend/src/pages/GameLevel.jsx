import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GameContext } from '../context/GameContext';

// ─────────────────────────────────────────────────────────────
//  CHARACTER DEFINITIONS & MOODS
// ─────────────────────────────────────────────────────────────
const CHARS = {
  NARASI:       { img: null,              name: 'SYSTEM', color: '#94a3b8', side: 'center', emoji: '⚙️' },
  ARKA:         { img: '/char_arka.png',  name: 'Arka',   color: '#3b82f6', side: 'left',   emoji: '🧑‍🔧' },
  NEXA:         { img: '/char_nexa.png',  name: 'Nexa',   color: '#8b5cf6', side: 'right',  emoji: '👩‍💻' },
  DIRA:         { img: '/char_dira.png',  name: 'Dira',   color: '#10b981', side: 'left',   emoji: '👩‍🎨' },
  RIVO:         { img: '/char_rivo.png',  name: 'Rivo',   color: '#f97316', side: 'right',  emoji: '👨‍✈️' },
  ZENO:         { img: '/char_zeno.png',  name: 'Zeno',   color: '#06b6d4', side: 'left',   emoji: '🤖' },
  NPC:          { img: null,              name: 'NPC',    color: '#94a3b8', side: 'left',   emoji: '🧑'  },
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
  lab_komputer: {
    bg: 'transparent',
    glow: '#87ceeb', label: 'Pusat Input Data', icon: '⌨️',
    accent: 'from-blue-100/40 to-blue-50/20',
    grid: 'rgba(135,206,235,0.1)',
  },
  server_room: {
    bg: 'transparent',
    glow: '#98fb98', label: 'Jalur Distribusi', icon: '🚦',
    accent: 'from-green-100/40 to-green-50/20',
    grid: 'rgba(152,251,152,0.1)',
  },
  studio_it: {
    bg: 'transparent',
    glow: '#ffb6c1', label: 'Pusat Proses (CPU)', icon: '🧠',
    accent: 'from-pink-100/40 to-pink-50/20',
    grid: 'rgba(255,182,193,0.1)',
  },
  rumah_user: {
    bg: 'transparent',
    glow: '#ffa07a', label: 'Terminal Output', icon: '🖥️',
    accent: 'from-orange-100/40 to-orange-50/20',
    grid: 'rgba(255,160,122,0.1)',
  },
  data_center: {
    bg: 'transparent',
    glow: '#ffd700', label: 'Pabrik Perangkat', icon: '🏭',
    accent: 'from-amber-100/40 to-amber-50/20',
    grid: 'rgba(255,215,0,0.1)',
  },
  lab_storage: {
    bg: 'transparent',
    glow: '#a7f3d0', label: 'Gudang Storage', icon: '🗄️',
    accent: 'from-emerald-100/40 to-emerald-50/20',
    grid: 'rgba(167,243,208,0.1)',
  },
  kelas_smk: {
    bg: 'transparent',
    glow: '#e9d5ff', label: 'Akademi Sistem', icon: '🏫',
    accent: 'from-purple-100/40 to-purple-50/20',
    grid: 'rgba(233,213,255,0.1)',
  },
  lab_riset: {
    bg: 'transparent',
    glow: '#c7d2fe', label: 'Lab Inovasi IT', icon: '🔬',
    accent: 'from-indigo-100/40 to-indigo-50/20',
    grid: 'rgba(199,210,254,0.1)',
  },
  perpustakaan: {
    bg: 'transparent',
    glow: '#cbd5e1', label: 'Jaringan Kota', icon: '🌐',
    accent: 'from-slate-100/40 to-slate-50/20',
    grid: 'rgba(203,213,225,0.1)',
  },
  final_boss: {
    bg: 'transparent',
    glow: '#fef08a', label: 'Ujian Arsitektur', icon: '👑',
    accent: 'from-yellow-100/40 to-yellow-50/20',
    grid: 'rgba(254,240,138,0.1)',
  },
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
  const def = CHARS[charKey];
  if (!def || !def.img) return null;
  const moodDef = MOOD[mood] || MOOD.normal;

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

  // 'INTRO' | 'CHAR_SELECT' | 'PRE_GAME_ANIM' | 'GAME' | 'OUTRO' | 'COMPLETE'
  const [phase, setPhase]           = useState('INTRO');
  const [dialogIdx, setDialogIdx]   = useState(0);
  const [selectedSolver, setSelectedSolver] = useState(null);

  const [timeLeft, setTimeLeft]     = useState(300);
  const [lives, setLives]           = useState(3);
  const [submitted, setSubmitted]   = useState(false);
  const [feedback, setFeedback]     = useState(null);
  const [winData, setWinData]       = useState(null);
  const [totalLevels, setTotalLevels] = useState(null);
  const [hintsUsed, setHintsUsed]   = useState(0);
  const gameOverRef                 = useRef(false);

  const [seqAns, setSeqAns]         = useState([]);
  const [classAns, setClassAns]     = useState({});
  const [matchAns, setMatchAns]     = useState({});
  const [isNavigating, setIsNavigating] = useState(false);

  // ── Load question & total levels ─────────────────────────
  useEffect(() => {
    if (!student) return;
    
    // Reset all game states when level changes
    setLoadingQ(true);
    setDataReady(false);
    setPhase('INTRO');
    setDialogIdx(0);
    setSelectedSolver(null);
    setTimeLeft(300);
    setLives(3);
    setSubmitted(false);
    setFeedback(null);
    setWinData(null);
    setSeqAns([]);
    setClassAns({});
    setMatchAns({});
    setHintsUsed(0);
    setIsNavigating(false);
    gameOverRef.current = false;
    
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
  useEffect(() => {
    if (phase === 'GAME') {
      if (selectedSolver === 'ARKA') { setTimeLeft(180); setLives(999); }
      else if (selectedSolver === 'NEXA') { setTimeLeft(240); setLives(1); }
      else if (selectedSolver === 'DIRA') { setTimeLeft(999); setLives(3); }
      else { setTimeLeft(300); setLives(3); }
    }
  }, [phase, selectedSolver]);

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'GAME' || submitted || gameOverRef.current) return;
    if ((lives <= 0 && selectedSolver !== 'ARKA') || timeLeft <= 0) {
      if (!gameOverRef.current) { gameOverRef.current = true; doSubmit(false); }
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, lives, phase, submitted, selectedSolver]);

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
      // Outro selesai → tampilkan layar Level Complete
      setPhase('COMPLETE');
    }
  }, [dialogIdx, currentDialogs.length, phase]);

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
    if (submitted) return;
    const ok = verifyAnswer(question.type, question.correct_config, ans);
    if (ok) {
      setFeedback({ type: 'success', text: 'KERJA BAGUS!', explanation: question.explanation });
      setTimeout(() => { 
        if (feedback?.type === 'success' && !submitted) {
          setFeedback(null); 
          handleLevelComplete(); 
        }
      }, 10000);
    } else {
      let nl = lives;
      if (selectedSolver !== 'ARKA') {
        nl -= 1;
        setLives(nl);
      }
      setFeedback({ type: 'error', text: `JAWABAN KURANG TEPAT. ${selectedSolver !== 'ARKA' ? `KESEMPATAN: ${nl}` : 'WAKTU TERUS BERJALAN!' }`, explanation: question.explanation });
      setSeqAns([]); setClassAns({}); setMatchAns({});
      if (nl <= 0 && selectedSolver !== 'ARKA') setTimeout(() => { gameOverRef.current=true; setFeedback(null); doSubmit(false); }, 2800);
      else setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleLevelComplete = async () => {
    if (submitted) return;
    setSubmitted(true);
    let baseTime = 300;
    if (selectedSolver === 'ARKA') baseTime = 180;
    if (selectedSolver === 'DIRA') baseTime = 999;
    
    // Default ratio scoring
    let r = timeLeft / baseTime;
    if (selectedSolver === 'DIRA') r = 0.5; // Dira scores standard/middle speed always
    
    let pts = 0, st = 0;
    if (r > 0.75) { pts = 100; st = 3; } 
    else if (r > 0.4) { pts = 80; st = 3; } 
    else if (r > 0.15) { pts = 60; st = 2; } 
    else { pts = 40; st = 1; }

    // ✅ BALANCED Character Impacts - All equal at ~1.3x bonus for fairness
    if (selectedSolver === 'ARKA') pts = Math.floor(pts * 1.3); // Speed bonus
    if (selectedSolver === 'NEXA') pts = Math.floor(pts * 1.3); // Precision bonus (same as Arka, different challenge)
    
    // Zeno Hint Impacts
    if (hintsUsed > 0) {
      pts = Math.max(10, Math.floor(pts - (hintsUsed * 20))); // Reduce score per hint
    }
    
    let success = false;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
        session_id: student.session_id, 
        level_number: lvl,
        poin: pts, 
        bintang: st, 
        waktu_detik: 300 - timeLeft, 
        is_complete: true, 
        attempts: 1
      }, { timeout: 10000 });
      
      if (res.status === 201 || res.data?.message) {
        console.log(`Level ${lvl} result saved successfully`);
        success = true;
        // Wait briefly for database sync, then refresh student data
        await new Promise(r => setTimeout(r, 100));
        await refreshStudentData();
      }
    } catch (e) { 
      console.error('Failed to submit level result:', e.message); 
      setSubmitted(false); // Reset so user can try again
      setFeedback({ type: 'error', text: 'SAVE_FAILED: Network error', explanation: 'Level result could not be saved. Please try again.' });
      return;
    }
    
    if (success) {
      setWinData({ pts, bintang: st });
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
      <div className={`min-h-screen flex flex-col items-center justify-center text-stone-800 city-bg ${bgClass} font-sans`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center glass rounded-3xl px-10 py-10 shadow-2xl max-w-xs w-full mx-4"
        >
          {/* Spinning rings */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-sky-100 animate-ping opacity-30" />
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-sky-100 border-t-sky-400 animate-spin" />
            <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-amber-100 border-b-amber-400 animate-[spin_1.5s_linear_reverse_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-sky-600">{lvl}</div>
          </div>
          <h2 className="text-xl font-black text-stone-800 tracking-tight mb-1">MEMUAT BAB {lvl}</h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-stone-500 text-xs font-bold uppercase tracking-widest"
          >
            Menyiapkan soal...
          </motion.p>
          {/* Progress bar */}
          <div className="mt-5 h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '90%' }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }
  if (!student) return <Navigate to="/register" replace />;
  if (!question) return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-stone-800 city-bg ${bgClass} font-sans`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center glass rounded-3xl p-10 shadow-xl max-w-sm mx-4">
        <div className="text-6xl mb-4">🙈</div>
        <p className="mb-2 text-xl text-stone-700 font-black">Modul Tidak Ditemukan</p>
        <p className="text-stone-400 text-sm mb-8">Bab {lvl} belum tersedia. Hubungi guru.</p>
        <button onClick={()=>navigate('/dashboard')}
          className="px-8 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold hover:from-sky-500 hover:to-blue-600 rounded-xl tracking-wide shadow-md transition-all w-full">
          ← Kembali ke Peta
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen w-full flex flex-col relative overflow-hidden text-stone-800 font-sans city-bg ${bgClass}`}>

      {/* ── MODERN KODOMO CITY AMBIENT BACKGROUND OVERLAY ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-white/5 backdrop-blur-[2px]">
        {/* Soft lighting */}
        <div
          className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-white/30 to-transparent"
        />
      </div>

      {/* ════════════════ PRE-GAME TRANSITION ════════════════ */}
      <AnimatePresence>
        {phase === 'PRE_GAME_ANIM' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] w-screen h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(28px)' }}
          >
            {/* Animated color blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
                style={{ background: scene.glow, top: '-15%', left: '-10%' }} />
              <motion.div animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
                style={{ background: '#fbbf24', bottom: '-15%', right: '-10%' }} />
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">

              {/* Scene icon & label badge */}
              <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="mb-5">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] px-4 py-1.5 rounded-full border"
                  style={{ color: scene.glow, borderColor: `${scene.glow}55`, background: `${scene.glow}12` }}>
                  {scene.icon} {scene.label}
                </span>
              </motion.div>

              {/* Big BAB number */}
              <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 16 }}
                className="mb-2">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-1"
                  style={{ color: `${scene.glow}99` }}>BAB</p>
                <p className="font-black leading-none"
                  style={{ fontSize: 'clamp(6rem, 18vw, 9rem)', color: scene.glow,
                    textShadow: `0 0 60px ${scene.glow}50, 0 4px 24px rgba(0,0,0,0.08)`,
                    WebkitTextStroke: `2px ${scene.glow}30` }}>
                  {lvl}
                </p>
              </motion.div>

              {/* Chapter title */}
              {storyData?.chapter && (
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-stone-600 font-bold text-sm md:text-base mb-8 px-4 leading-snug">
                  {storyData.chapter}
                </motion.p>
              )}

              {/* Progress bar + label */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                className="w-full px-2">
                <div className="h-1 bg-stone-200/70 rounded-full overflow-hidden mb-2.5">
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }}
                    transition={{ duration: 1.3, ease: 'easeInOut', delay: 0.38 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${scene.glow}, #fbbf24)`,
                      boxShadow: `0 0 8px ${scene.glow}60` }} />
                </div>
                <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}
                  className="text-[10px] font-black uppercase tracking-[0.35em]"
                  style={{ color: `${scene.glow}aa` }}>
                  Bersiap masuk ke misi...
                </motion.p>
              </motion.div>
            </div>
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
                {scene.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{storyData?.chapter}</p>
                <p className="text-sm font-bold text-stone-800 tracking-wide">{scene.label}</p>
              </div>
            </div>

            {phase === 'INTRO' && (
              <button onClick={() => { setPhase('PRE_GAME_ANIM'); setTimeout(()=>setPhase('GAME'), 1500); setDialogIdx(0); }}
                className="group flex items-center gap-2 text-xs font-bold text-sky-600 border border-sky-300 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full hover:bg-sky-50 hover:border-sky-400 transition-all shadow-sm">
                Lewati Cerita <span className="group-hover:translate-x-1 transition-transform">▶▶</span>
              </button>
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
                  <span className="opacity-90">{scene.icon}</span>{scene.label}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">


              <div className="flex items-center gap-1.5 bg-stone-100 px-4 py-2 rounded-full border border-stone-200 shadow-inner">
                {[...Array(selectedSolver === 'ARKA' ? 1 : 3)].map((_,i)=>(
                  <motion.div key={i} 
                    initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay: i*0.1}}
                    className={`relative w-4 h-4 rounded-full border ${
                      selectedSolver === 'ARKA' ? 'bg-blue-400 border-blue-300' :
                      i < lives 
                        ? 'bg-rose-400 border-rose-300 shadow-[0_2px_4px_rgba(251,113,133,0.3)]' 
                        : 'bg-stone-300 border-stone-200'
                    }`} 
                  />
                ))}
                {selectedSolver === 'ARKA' && <span className="text-blue-500 font-bold ml-1 text-sm">∞</span>}
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Waktu</span>
                <div className={`font-mono text-xl font-bold tracking-wider ${timeLeft<60?'text-rose-500 animate-pulse':'text-stone-700'}`}>
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
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded border border-emerald-200 uppercase tracking-widest flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> TUGAS AKTIF</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded bg-stone-100 text-stone-500 border border-stone-200 uppercase">{question.topic}</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded bg-stone-100 text-stone-500 border border-stone-200 uppercase">{question.bloom_level}</span>
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

      {/* ════════════════ LEVEL COMPLETE SCREEN ════════════════ */}
      <AnimatePresence>
        {phase === 'COMPLETE' && winData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-auto city-bg"
          >
            <div className="absolute inset-0 bg-white/50 pointer-events-none" />

            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
              className="relative z-10 w-full max-w-lg text-center font-sans"
            >
              {/* Trophy Icon */}
              <motion.div
                animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl md:text-8xl mb-4 select-none drop-shadow-xl"
              >
                🏆
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl md:text-5xl font-serif font-black tracking-wide uppercase mb-1 text-amber-600"
              >
                LEVEL SELESAI
              </motion.h1>
              <p className="text-amber-800 font-bold mb-8">Bab {lvl} — Misi Berhasil</p>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.35 + i * 0.18, type: 'spring', stiffness: 200 }}
                    className="text-4xl md:text-5xl drop-shadow-md"
                  >
                    {i < winData.bintang ? '⭐' : '☆'}
                  </motion.div>
                ))}
              </div>

              {/* Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl border border-stone-200 bg-white p-6 mb-8 shadow-xl"
              >
                <div className="flex justify-around">
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Skor</p>
                    <p className="text-3xl font-black text-amber-500">{winData.pts}</p>
                  </div>
                  <div className="w-px bg-stone-200" />
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Bintang</p>
                    <p className="text-3xl font-black text-amber-500">{winData.bintang} / 3</p>
                  </div>
                  <div className="w-px bg-stone-200" />
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Level</p>
                    <p className="text-3xl font-black text-stone-700">{lvl}</p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {/* Next Level Button - Show unless this is the last level */}
                {lvl < (totalLevels || 10) && (
                  <motion.button
                    whileHover={!isNavigating ? { scale: 1.04 } : {}}
                    whileTap={!isNavigating ? { scale: 0.96 } : {}}
                    onClick={() => {
                      if (!isNavigating) {
                        setIsNavigating(true);
                        setTimeout(() => navigate(`/game/${lvl + 1}`), 300);
                      }
                    }}
                    disabled={isNavigating}
                    className="flex-1 py-5 rounded-xl font-black text-lg uppercase tracking-widest border-2 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isNavigating 
                        ? `${scene.glow}20` 
                        : `linear-gradient(135deg, ${scene.glow}40, ${scene.glow}20)`,
                      borderColor: scene.glow,
                      color: '#fff',
                      boxShadow: `0 0 25px ${scene.glow}${isNavigating ? '20' : '40'}`,
                    }}
                  >
                    {isNavigating ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-transparent border-r-white border-t-white rounded-full"
                        />
                        <span>MEMUAT...</span>
                      </>
                    ) : (
                      <>
                        <span>Next Level</span>
                        <span className="text-xl">▶</span>
                      </>
                    )}
                  </motion.button>
                )}

                {/* Exit / Dashboard Button */}
                <motion.button
                  whileHover={!isNavigating ? { scale: 1.02 } : {}}
                  whileTap={!isNavigating ? { scale: 0.97 } : {}}
                  onClick={() => {
                    if (!isNavigating) {
                      setIsNavigating(true);
                      setTimeout(() => navigate('/dashboard'), 300);
                    }
                  }}
                  disabled={isNavigating}
                  className="flex-1 py-5 rounded-xl font-black text-lg uppercase tracking-widest border-2 border-stone-300 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <span>◁</span>
                  <span>{(lvl >= (totalLevels || 10)) ? 'Selesai 🎉' : 'Dashboard'}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ FEEDBACK POPUP (BERHASIL / GAGAL) ════════════════ */}
      {feedback && createPortal(
        <AnimatePresence mode="wait">
          {feedback && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} onClick={(e) => { if (e.target === e.currentTarget && feedback.type === 'error') setFeedback(null); }} onKeyDown={(e) => { if (e.key === 'Escape' && feedback.type === 'error') setFeedback(null); }}>
            <motion.div initial={{ scale: 0.75, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }} className="relative w-full max-w-md max-h-[90vh] overflow-auto custom-scrollbar pointer-events-auto" style={{ background: 'rgba(255,255,255,0.98)', borderRadius: '1.75rem', boxShadow: feedback.type === 'success' ? '0 40px 100px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.15)' : '0 40px 100px rgba(244,63,94,0.3), 0 0 60px rgba(244,63,94,0.15)' }}>
              <div className="h-1.5 w-full" style={{ background: feedback.type === 'success' ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)' : 'linear-gradient(90deg, #f43f5e, #fb7185, #fda4af)' }} />
              <div className="px-7 py-7 flex flex-col items-center text-center font-sans">
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.08 }} className="relative mb-5">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl font-black shadow-xl border-4" style={feedback.type === 'success' ? { background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderColor: '#6ee7b7', color: '#059669' } : { background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', borderColor: '#fda4af', color: '#e11d48' }}>
                    {feedback.type === 'success' ? '✓' : '✕'}
                  </div>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none" style={{ background: feedback.type === 'success' ? '#10b981' : '#f43f5e', animationDuration: '1.8s' }} />
                </motion.div>
                <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-2xl md:text-3xl font-black mb-1 tracking-wide uppercase" style={{ color: feedback.type === 'success' ? '#059669' : '#e11d48' }}>{feedback.text}</motion.h3>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: feedback.type === 'success' ? '#6ee7b7' : '#fda4af' }}>{feedback.type === 'success' ? '— Jawaban Tepat —' : '— Jawaban Salah —'}</motion.p>
                {feedback.explanation && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full rounded-2xl p-4 mb-6 text-left border" style={feedback.type === 'success' ? { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' } : { background: '#fff1f2', borderColor: '#fecdd3', color: '#9f1239' }}><p className="text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: feedback.type === 'success' ? '#15803d' : '#be123c' }}><span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ background: feedback.type === 'success' ? '#16a34a' : '#e11d48' }} />Penjelasan</p><p className="text-sm leading-relaxed">{feedback.explanation}</p></motion.div>}
                {feedback.type === 'success' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="w-full flex flex-col sm:flex-row gap-3">{lvl < (totalLevels || 10) && <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} onClick={async () => { setIsNavigating(true); if (!submitted) await handleLevelComplete(); setFeedback(null); setTimeout(() => navigate(`/game/${lvl + 1}`), 300); }} className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 24px rgba(16,185,129,0.4)' }}>Lanjut Level ▶</motion.button>}<motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} onClick={async () => { setIsNavigating(true); if (!submitted) await handleLevelComplete(); setFeedback(null); setTimeout(() => navigate('/dashboard'), 300); }} className="flex-1 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest border-2 border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors">◁ {lvl >= (totalLevels || 10) ? 'Selesai 🎉' : 'Dashboard'}</motion.button></motion.div>}
                {feedback.type === 'error' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="w-full flex flex-col sm:flex-row gap-3"><motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setFeedback(null)} className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 6px 24px rgba(244,63,94,0.4)' }}>🔄 Coba Lagi</motion.button><motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')} className="flex-1 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest border-2 border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors">◁ Dashboard</motion.button></motion.div>}
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}