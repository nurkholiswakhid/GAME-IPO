import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GameContext } from '../context/GameContext';

// ─────────────────────────────────────────────────────────────
//  CHARACTER DEFINITIONS & MOODS
// ─────────────────────────────────────────────────────────────
const CHARS = {
  ARDI:         { img: '/char_ardi.png',       name: 'Ardi',          color: '#60a5fa', side: 'right', emoji: '👦🏻' },
  BUDI:         { img: '/char_budi.png',        name: 'Pak Budi',     color: '#34d399', side: 'left',  emoji: '👨‍🏫' },
  NARASI:       { img: null,                    name: 'SYSTEM',       color: '#94a3b8', side: 'center',emoji: '⚙️'  },
  NPC:          { img: '/char_npc_female.png',  name: 'NPC',          color: '#10b981', side: 'left',  emoji: '🧑'  },
  'PAK DARMO':  { img: '/char_npc_male.png',    name: 'Pak Darmo',    color: '#fb923c', side: 'left',  emoji: '🧓'  },
  'REZA':       { img: '/char_npc_male.png',    name: 'Pak Reza',     color: '#2dd4bf', side: 'left',  emoji: '👔'  },
  'SARI':       { img: '/char_npc_female.png',  name: 'Mbak Sari',    color: '#fbbf24', side: 'left',  emoji: '👩‍🎨' },
  'WIRA':       { img: '/char_npc_male.png',    name: 'Wira',         color: '#4ade80', side: 'left',  emoji: '👷'  },
  'DITO':       { img: '/char_npc_male.png',    name: 'Dito',         color: '#22d3ee', side: 'left',  emoji: '🧑‍🔧' },
  'BU AINI':    { img: '/char_npc_female.png',  name: 'Bu Aini',      color: '#f472b6', side: 'left',  emoji: '👩‍🏫' },
  'DR. FANDI':  { img: '/char_npc_male.png',    name: 'Dr. Fandi',    color: '#a78bfa', side: 'left',  emoji: '🔬'  },
  'PUSTAKAWAN': { img: '/char_npc_female.png',  name: 'Pustakawan',   color: '#94a3b8', side: 'left',  emoji: '📚'  },
  'SISWA RINA': { img: '/char_npc_female.png',  name: 'Siswa Rina',   color: '#fb7185', side: 'left',  emoji: '🙋'  },
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
    bg: 'linear-gradient(160deg, #020c1b 0%, #010810 60%, #001524 100%)',
    glow: '#3b82f6', label: 'Lab Komputer', icon: '🖥️',
    accent: 'from-blue-900/40 to-blue-950/20',
    grid: 'rgba(59,130,246,0.08)',
  },
  server_room: {
    bg: 'linear-gradient(160deg, #0f0518 0%, #08010e 60%, #130422 100%)',
    glow: '#8b5cf6', label: 'Server Room', icon: '⚙️',
    accent: 'from-purple-900/40 to-purple-950/20',
    grid: 'rgba(139,92,246,0.08)',
  },
  studio_it: {
    bg: 'linear-gradient(160deg, #170c02 0%, #0d0a01 60%, #1f1000 100%)',
    glow: '#f59e0b', label: 'Studio IT', icon: '💼',
    accent: 'from-amber-900/30 to-amber-950/15',
    grid: 'rgba(245,158,11,0.06)',
  },
  rumah_user: {
    bg: 'linear-gradient(160deg, #170505 0%, #100202 60%, #1d0404 100%)',
    glow: '#ef4444', label: 'Rumah User', icon: '🏠',
    accent: 'from-red-900/30 to-red-950/15',
    grid: 'rgba(239,68,68,0.06)',
  },
  data_center: {
    bg: 'linear-gradient(160deg, #021008 0%, #010c05 60%, #001205 100%)',
    glow: '#10b981', label: 'Data Center', icon: '🏭',
    accent: 'from-emerald-900/30 to-emerald-950/15',
    grid: 'rgba(16,185,129,0.07)',
  },
  lab_storage: {
    bg: 'linear-gradient(160deg, #021217 0%, #010e12 60%, #001520 100%)',
    glow: '#06b6d4', label: 'Lab Storage', icon: '🗄️',
    accent: 'from-cyan-900/30 to-cyan-950/15',
    grid: 'rgba(6,182,212,0.07)',
  },
  kelas_smk: {
    bg: 'linear-gradient(160deg, #15051a 0%, #0f0212 60%, #1a0420 100%)',
    glow: '#d946ef', label: 'Kelas SMK', icon: '🎓',
    accent: 'from-fuchsia-900/30 to-fuchsia-950/15',
    grid: 'rgba(217,70,239,0.07)',
  },
  lab_riset: {
    bg: 'linear-gradient(160deg, #020b1f 0%, #010815 60%, #020e2a 100%)',
    glow: '#60a5fa', label: 'Lab Riset', icon: '🔬',
    accent: 'from-blue-900/30 to-blue-950/15',
    grid: 'rgba(96,165,250,0.07)',
  },
  perpustakaan: {
    bg: 'linear-gradient(160deg, #09090b 0%, #06060a 60%, #0b0b10 100%)',
    glow: '#94a3b8', label: 'Perpustakaan', icon: '📚',
    accent: 'from-slate-800/30 to-slate-950/15',
    grid: 'rgba(148,163,184,0.05)',
  },
  final_boss: {
    bg: 'linear-gradient(160deg, #1a0400 0%, #120200 60%, #200500 100%)',
    glow: '#f97316', label: 'Final Boss', icon: '⚔️',
    accent: 'from-orange-900/40 to-orange-950/20',
    grid: 'rgba(249,115,22,0.08)',
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

  // Combined filter: mood-based color shift + active/inactive brightness + glow
  const activeFilter = `brightness(1.05) ${moodDef.filter} drop-shadow(0 0 28px ${def.color}80) drop-shadow(0 0 8px ${def.color}40)`;
  const inactiveFilter = 'brightness(0.25) saturate(0.15) blur(1.5px)';

  return (
    <motion.div
      key={charKey}
      initial={{ x: side === 'left' ? -150 : 150, opacity: 0, scale: 0.9 }}
      animate={{
        x: 0,
        opacity: isActive ? 1 : 0.55,
        scale: isActive ? 1.04 : 0.96,
        y: isActive ? [0, -6, 0] : 0,
      }}
      exit={{ x: side === 'left' ? -150 : 150, opacity: 0, scale: 0.9 }}
      transition={{
        x: { type: 'spring', stiffness: 200, damping: 22 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
        y: isActive ? { duration: 0.5, ease: 'easeInOut', repeat: 0 } : { duration: 0 },
      }}
      className="absolute bottom-0 flex items-end"
      style={{
        [side]: side === 'left' ? '3%' : '3%',
        height: '82%',
        filter: isActive ? activeFilter : inactiveFilter,
        transition: 'filter 0.45s ease, opacity 0.35s ease',
        zIndex: isActive ? 40 : 10,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Glow pedestal under active character */}
      {isActive && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full blur-2xl opacity-60 pointer-events-none"
          style={{ background: def.color }}
        />
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
        className="relative overflow-hidden rounded-2xl backdrop-blur-2xl shadow-2xl border"
        style={{
          background: isNarrator
            ? 'linear-gradient(135deg, rgba(2,6,23,0.96) 0%, rgba(10,12,30,0.92) 100%)'
            : `linear-gradient(135deg, rgba(2,6,23,0.97) 0%, ${def.color}18 70%, ${def.color}08 100%)`,
          borderColor: isNarrator ? 'rgba(148,163,184,0.15)' : `${def.color}60`,
          boxShadow: isNarrator
            ? '0 20px 60px -15px rgba(0,0,0,0.7)'
            : `0 20px 60px -15px ${def.color}25, 0 0 0 1px ${def.color}15 inset`,
        }}
      >
        {/* Top accent bar - color of character */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: isNarrator ? 'rgba(148,163,184,0.3)' : `linear-gradient(90deg, transparent, ${def.color}, transparent)` }}
        />
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t border-l opacity-40 rounded-tl-lg" style={{ borderColor: isNarrator ? '#94a3b8' : def.color }} />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r opacity-40 rounded-br-lg" style={{ borderColor: isNarrator ? '#94a3b8' : def.color }} />

        {isNarrator ? (
          <div className="px-8 py-5 text-center">
            <p className="text-slate-300 italic text-sm md:text-base leading-relaxed font-mono">
              <span className="text-slate-500/80 mr-2 font-bold text-xs tracking-widest not-italic">[SYSTEM]</span>
              {typedText}
              {!done && <span className="inline-block w-1.5 h-4 bg-slate-400/80 ml-1 align-middle animate-pulse rounded-sm" />}
            </p>
            {done && <p className="text-white/15 text-[9px] uppercase font-bold tracking-[0.4em] mt-3 animate-pulse">▼ klik untuk lanjut</p>}
          </div>
        ) : (
          <div>
            {/* Name plate */}
            <div
              className="flex items-center gap-3 px-5 pt-4 pb-2.5 border-b"
              style={{ borderColor: `${def.color}20` }}
            >
              {/* Avatar badge */}
              <motion.div
                animate={{ boxShadow: [`0 0 8px ${def.color}50`, `0 0 20px ${def.color}80`, `0 0 8px ${def.color}50`] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${def.color}30, ${def.color}10)`,
                  border: `1px solid ${def.color}70`,
                }}
              >
                {def.emoji}{moodDef.emoji}
              </motion.div>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-mono font-bold tracking-[0.25em] uppercase opacity-60 mb-0.5" style={{ color: def.color }}>
                  {speakerKey} · {moodDef.label}
                </span>
                <span className="font-black text-base md:text-lg font-sans tracking-wide text-white truncate block">
                  {def.name || speakerKey}
                </span>
              </div>
            </div>

            {/* Text area */}
            <div className="px-6 pb-5 pt-4 min-h-[100px] flex flex-col justify-between">
              <p className="text-white/92 text-sm md:text-[1.05rem] leading-relaxed font-medium">
                {typedText}
                {!done && <span className="inline-block w-2 h-[1.1em] bg-white/60 ml-1 align-middle animate-pulse rounded-sm" />}
              </p>
              {done && (
                <div className="flex items-center justify-between mt-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${def.color}30)` }} />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] ml-3"
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
        <motion.button key={i} whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(opt)}
          className="relative overflow-hidden p-5 bg-black/40 border border-white/10 hover:border-cyan-400/60 rounded-xl text-left text-white text-sm md:text-base leading-relaxed transition-all shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-start">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-xs font-mono font-bold text-cyan-300 mr-3 shrink-0 shadow-inner">
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
          className={`relative overflow-hidden flex-1 py-8 text-2xl font-black rounded-2xl border-2 transition-all shadow-xl group ${
            opt==='BENAR'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300 hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]'
          }`}>
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${opt==='BENAR'?'bg-emerald-500':'bg-rose-500'}`} />
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-3xl">{opt === 'BENAR' ? '✓' : '✕'}</span>
            {opt === 'BENAR' ? 'TRUE' : 'FALSE'}
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
      <div className="space-y-3 min-h-[6rem] p-4 rounded-xl border border-dashed border-white/20 bg-black/20">
        <p className="text-xs font-mono text-cyan-400/80 uppercase tracking-widest mb-2">» Sequence Array [Execution Order]</p>
        
        {userAnswer.length===0 && (
          <div className="flex flex-col items-center justify-center py-6 opacity-30">
            <span className="text-3xl mb-2">⬇️</span>
            <p className="text-sm font-mono">AWAITING_SEQUENCE_INPUT</p>
          </div>
        )}

        {userAnswer.map((item,i)=>(
          <motion.div key={`${i}`} initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}}
            className="group flex items-center gap-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 px-5 py-3 rounded-xl shadow-md">
            <div className="w-8 h-8 bg-blue-500/20 border border-blue-400/50 rounded-lg flex items-center justify-center text-sm font-mono font-bold text-blue-200 shrink-0 shadow-inner">
              {i}=
            </div>
            <span className="flex-1 text-sm md:text-base text-blue-50 font-medium">{item}</span>
            <button onClick={()=>rem(i)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-all flex items-center justify-center">✕</button>
          </motion.div>
        ))}
      </div>
      
      <div>
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">» Available Instructions</p>
        <div className="grid gap-2">
          {options.map((opt,i)=>{
            const used=userAnswer.includes(opt);
            return <motion.button key={i} whileHover={!used?{scale:1.01}:{}} onClick={()=>!used&&add(opt)} disabled={used}
              className={`px-4 py-3 rounded-xl text-sm md:text-base font-medium border text-left flex items-center justify-between transition-all ${
                used
                  ? 'bg-transparent border-white/5 text-white/20 cursor-not-allowed'
                  :'bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 shadow-sm'
              }`}>
                <span>{opt}</span>
                {!used && <span className="text-white/30 text-xs">CLICK_TO_ADD</span>}
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
          <div key={cat} className="relative bg-black/40 border border-white/15 rounded-2xl p-4 overflow-hidden shadow-lg min-h-[140px]">
            {/* Header Accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${idx%2===0 ? 'bg-indigo-500' : 'bg-teal-500'}`} />
            
            <p className="text-xs font-mono font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${idx%2===0 ? 'bg-indigo-500' : 'bg-teal-500'} animate-pulse`} />
              {cat}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {(userAnswer[cat]||[]).map((item,j)=>(
                <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} key={j} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white border shadow-sm ${
                    idx%2===0 ? 'bg-indigo-900/40 border-indigo-400/50' : 'bg-teal-900/40 border-teal-400/50'
                  }`}>
                  {item}
                  <button onClick={()=>remove(cat,item)} className="ml-1 w-5 h-5 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">✕</button>
                </motion.div>
              ))}
              {!(userAnswer[cat]||[]).length && (
                <div className="w-full py-4 text-center border border-dashed border-white/10 rounded-xl bg-white/5 text-white/20 font-mono text-xs">
                  [EMPTY_DIRECTORY]
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {unused.length>0&&(
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">» Unassigned Items</p>
          <div className="space-y-3">
            {unused.map((opt,i)=>(
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <p className="text-sm font-medium text-white/90">"{opt}"</p>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {categories.map((cat, idx)=>(
                    <motion.button key={cat} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={()=>place(cat,opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm border ${
                        idx%2===0 
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/40' 
                          : 'bg-teal-600/20 text-teal-300 border-teal-500/40 hover:bg-teal-600/40'
                      }`}>
                      ASSIGN ➔ {idx===0 ? 'A' : 'B'}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {unused.length===0&&<p className="text-emerald-400 text-sm font-mono text-center animate-pulse bg-emerald-900/20 py-3 rounded-xl border border-emerald-500/30">✓ SYSTEM_CHECK_PASSED: All objects assigned. Ready for verification.</p>}
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
        <p className="text-xs font-mono text-cyan-400/80 uppercase tracking-widest">» Configure Links</p>
        <span className="text-xs font-mono bg-black/50 px-3 py-1 rounded-full border border-white/10">
          {Object.keys(userAnswer).length}/{leftItems.length} CONNECTED
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-[10px] font-black font-mono text-white/40 uppercase mb-2 border-b border-white/10 pb-2">NODE A [SELECT]</p>
          {leftItems.map((item,i)=>{
            const isPaired=userAnswer[item]; const isSel=sel===item;
            return <motion.button key={i} whileHover={{scale:1.02}} onClick={()=>isSel?setSel(null):isPaired?clear(item):setSel(item)}
              className={`w-full p-4 rounded-xl text-sm md:text-base text-left font-medium border transition-all leading-snug shadow-sm relative overflow-hidden ${
                isSel
                  ?'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  :isPaired
                    ?'bg-emerald-900/40 border-emerald-500/60 text-emerald-100'
                    :'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}>
              {isPaired && <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LINKED</div>}
              {isSel && <div className="text-[10px] font-mono text-amber-400 mb-1 flex items-center gap-1 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> AWAITING TARGET</div>}
              {item}
            </motion.button>;
          })}
        </div>
        
        <div className="space-y-3">
          <p className="text-[10px] font-black font-mono text-white/40 uppercase mb-2 border-b border-white/10 pb-2">NODE B [TARGET]</p>
          {rightItems.map((item,i)=>{
            const usedBy=Object.entries(userAnswer).find(([_,v])=>v===item)?.[0];
            return <motion.button key={i} whileHover={sel && !usedBy ? {scale:1.02} : {}} onClick={()=>usedBy?clear(usedBy):pick(item)}
              className={`w-full p-4 rounded-xl text-sm md:text-base text-left font-medium border transition-all leading-snug shadow-sm ${
                usedBy
                  ?'bg-emerald-900/40 border-emerald-500/60 text-emerald-300'
                  :sel
                    ?'bg-cyan-900/40 border-cyan-400/60 text-white hover:bg-cyan-800/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer ring-1 ring-cyan-400/50'
                    :'bg-black/30 border-white/10 text-white/40 cursor-default'
              }`}>
              {usedBy && <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LINKED TO NODE A</div>}
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

  const [timeLeft, setTimeLeft]     = useState(300);
  const [lives, setLives]           = useState(3);
  const [submitted, setSubmitted]   = useState(false);
  const [feedback, setFeedback]     = useState(null);
  const [winData, setWinData]       = useState(null); // { pts, bintang }
  const [totalLevels, setTotalLevels] = useState(null);
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
    setTimeLeft(300);
    setLives(3);
    setSubmitted(false);
    setFeedback(null);
    setWinData(null);
    setSeqAns([]);
    setClassAns({});
    setMatchAns({});
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

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'GAME' || submitted || gameOverRef.current) return;
    if (lives <= 0 || timeLeft <= 0) {
      if (!gameOverRef.current) { gameOverRef.current = true; doSubmit(false); }
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
  if (!rightKey && phase !== 'GAME') rightKey = 'ARDI';

  const handleDialogNext = useCallback(() => {
    if (dialogIdx + 1 < currentDialogs.length) {
      setDialogIdx(i => i + 1);
    } else if (phase === 'INTRO') {
      // Transition animation before game
      setPhase('PRE_GAME_ANIM');
      setTimeout(() => {
        setPhase('GAME');
        setDialogIdx(0);
      }, 1500);
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
      setFeedback({ type: 'success', text: 'SYSTEM OVERRIDE SUCCESS!', explanation: question.explanation });
      // Wait for user to click button in feedback overlay, don't auto-dismiss
      // Set a timeout as fallback to go to complete after 10 seconds
      setTimeout(() => { 
        if (feedback?.type === 'success' && !submitted) {
          setFeedback(null); 
          handleLevelComplete(); 
        }
      }, 10000);
    } else {
      const nl = lives - 1;
      setLives(nl);
      setFeedback({ type: 'error', text: `ERROR: INCORRECT MATCH. HP REMAINING: ${nl}`, explanation: question.explanation });
      setSeqAns([]); setClassAns({}); setMatchAns({});
      if (nl <= 0) setTimeout(() => { gameOverRef.current=true; setFeedback(null); doSubmit(false); }, 2800);
      else setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleLevelComplete = async () => {
    if (submitted) return;
    setSubmitted(true);
    const r = timeLeft / 300;
    let pts = 0, st = 0;
    if (r > 0.75) { pts = 100; st = 3; } 
    else if (r > 0.5) { pts = 80; st = 3; } 
    else if (r > 0.25) { pts = 60; st = 2; } 
    else { pts = 40; st = 1; }
    
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

  // ── Guards ────────────────────────────────────────────────
  if (loading || loadingQ || !dataReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white font-mono bg-[#020617]">
        <div className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-black text-cyan-400 tracking-[0.3em]">INITIALIZING SYSTEM</h2>
        <p className="text-cyan-600/60 mt-2 text-sm">LOADING CHAPTER {lvl} DATA_MODULES</p>
      </div>
    );
  }
  if (!student) return <Navigate to="/register" replace />;
  if (!question) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#020617] font-mono">
      <div className="text-rose-500 text-6xl mb-4">⚠️</div>
      <p className="mb-8 text-xl text-rose-300">DATA_NOT_FOUND: Level {lvl} module missing.</p>
      <button onClick={()=>navigate('/dashboard')} className="px-8 py-3 bg-white/5 border border-white/20 hover:bg-white/10 rounded-lg tracking-widest">RETURN_TO_BASE</button>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden text-white font-sans"
      style={{ background: scene.bg }}>

      {/* ── ADVANCED CYBERPUNK AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary glow core - scene-specific color */}
        <div
          className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] rounded-full blur-[140px] opacity-25"
          style={{ background: scene.glow }}
        />
        <div
          className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] rounded-full blur-[120px] opacity-12"
          style={{ background: scene.glow }}
        />
        {/* Subtle secondary accent in opposite corner */}
        <div
          className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full blur-[80px] opacity-8"
          style={{ background: '#38bdf8' }}
        />

        {/* Scene-colored Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${scene.grid} 1px, transparent 1px), linear-gradient(90deg, ${scene.grid} 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
          }}
        />

        {/* Scanline Effect */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)' }}
        />

        {/* Vignette - heavier at edges */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)' }}
        />
      </div>

      {/* ════════════════ PRE-GAME TRANSITION ANIMATION ════════════════ */}
      <AnimatePresence>
        {phase === 'PRE_GAME_ANIM' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at center, #050a1a 0%, #000005 100%)' }}
          >
            {/* Scanline overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />
            {/* Glow pulse */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
              style={{ background: scene.glow }}
            />
            <div className="relative z-10 text-center font-mono px-6">
              {/* Top progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="h-[2px] mb-8 mx-auto max-w-md shadow-lg"
                style={{ background: `linear-gradient(90deg, transparent, ${scene.glow}, ${scene.glow}, transparent)`, boxShadow: `0 0 20px ${scene.glow}` }}
              />
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs tracking-[0.5em] uppercase mb-4 opacity-60"
                style={{ color: scene.glow }}
              >
                ◈ PROBLEM SOLVING PROTOCOL ◈
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                className="text-5xl md:text-7xl font-black text-transparent bg-clip-text tracking-[0.15em] drop-shadow-2xl leading-none"
                style={{ backgroundImage: `linear-gradient(135deg, #e2e8f0, ${scene.glow}, #e2e8f0)` }}
              >
                SYSTEM<br/>OVERRIDE
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 0.6, duration: 0.8, repeat: 1 }}
                className="mt-6 text-sm tracking-[0.35em] uppercase font-bold"
                style={{ color: scene.glow }}
              >
                INITIALIZING...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ VN PHASE (INTRO / OUTRO) ════════════════ */}
      {(phase === 'INTRO' || phase === 'OUTRO') && (
        <>
          {/* Cyberpunk VN Header */}
          <div className="relative z-30 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-black/40 border border-white/10 backdrop-blur-md px-5 py-2 rounded-full shadow-lg">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: `linear-gradient(135deg, ${scene.glow}40, transparent)`, border: `1px solid ${scene.glow}` }}>
                {scene.icon}
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">{storyData?.chapter}</p>
                <p className="text-sm font-bold text-white tracking-wide">{scene.label}</p>
              </div>
            </div>
            
            {phase === 'INTRO' && (
              <button onClick={() => { setPhase('PRE_GAME_ANIM'); setTimeout(()=>setPhase('GAME'), 1500); setDialogIdx(0); }}
                className="group flex items-center gap-2 text-xs font-mono font-bold text-white/40 border border-white/10 bg-black/30 px-4 py-2 rounded-full hover:text-white hover:border-white/30 hover:bg-white/5 transition-all">
                SKIP_SCENE <span className="group-hover:translate-x-1 transition-transform">▶▶</span>
              </button>
            )}
          </div>

          {/* Progress indicator - Tech style */}
          <div className="relative z-30 px-8 flex gap-1 justify-center max-w-2xl mx-auto">
            {currentDialogs.map((_, i) => (
              <div key={i}
                className="h-1 rounded-sm transition-all duration-500"
                style={{
                  width: i === dialogIdx ? '40px' : '12px',
                  background: i <= dialogIdx ? scene.glow : 'rgba(255,255,255,0.1)',
                  boxShadow: i === dialogIdx ? `0 0 10px ${scene.glow}` : 'none'
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
          {/* Cyberpunk HUD Header */}
          <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 flex justify-between items-center z-30 shrink-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => navigate('/dashboard')} className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-white/60 group-hover:text-white transition-colors group-hover:-translate-x-0.5 transform block">◁</span>
              </button>
              
              <div className="hidden sm:block h-8 w-px bg-white/10" />
              
              <div>
                <p className="text-[10px] font-mono font-bold text-cyan-500/80 uppercase tracking-widest">{storyData?.chapter || `CHAPTER ${lvl}`}</p>
                <p className="text-sm font-black text-white flex items-center gap-2">
                  <span className="opacity-70">{scene.icon}</span>{scene.label}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 bg-black/50 px-4 py-2 rounded-full border border-white/5">
                {[...Array(3)].map((_,i)=>(
                  <motion.div key={i} 
                    initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay: i*0.1}}
                    className={`relative w-4 h-4 rounded-sm rotate-45 border ${
                      i < lives 
                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                        : 'bg-black border-white/10'
                    }`} 
                  />
                ))}
              </div>
              
              <div className={`flex flex-col items-end`}>
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-0.5">SYS_TIME</span>
                <div className={`font-mono text-xl font-black tracking-wider ${timeLeft<60?'text-rose-400 animate-pulse':'text-cyan-300'}`} style={{ textShadow: `0 0 15px ${timeLeft<60?'#f43f5e':'#06b6d4'}80` }}>
                  {mm}:{ss}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Quest Briefing Panel */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md p-6 shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600" />
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-black px-3 py-1 rounded-sm border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"/> ACTIVE_DIRECTIVE</span>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-sm bg-white/5 text-white/50 border border-white/10 uppercase">{question.topic}</span>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-sm bg-white/5 text-white/50 border border-white/10 uppercase">{question.bloom_level}</span>
              </div>
              
              <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed font-sans">{question.question_text}</p>
            </motion.div>

            {/* Interactive Workspace */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl p-6 shadow-2xl">
              
              {/* Subtle grid pattern in workspace */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <div className="relative z-10 w-full mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <p className="text-[10px] font-mono font-black text-white/30 uppercase tracking-widest shrink-0">
                  {question.type==='MULTIPLE_CHOICE'&&'// MULTIPLE_CHOICE_INPUT'}
                  {question.type==='TRUE_FALSE'&&'// BOOLEAN_EVALUATION'}
                  {question.type==='SEQUENCE'&&'// CONSTRUCT_ARRAY_SEQUENCE'}
                  {question.type==='CLASSIFICATION'&&'// CLASSIFY_OBJECTS'}
                  {question.type==='MATCHING'&&'// ESTABLISH_NODE_LINKS'}
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
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
                <div className="relative z-10 pt-4 border-t border-white/10 mt-2">
                  <motion.button whileHover={{scale:canVerify()?1.01:1}} whileTap={{scale:canVerify()?0.98:1}}
                    onClick={()=>processAnswer(getUserAnswer())} disabled={!canVerify()}
                    className={`w-full py-5 font-black font-mono text-lg rounded-xl border-2 transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${
                      canVerify() 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer' 
                        : 'bg-black/50 border-white/10 text-white/20 cursor-not-allowed'
                    }`}>
                    {canVerify() ? (
                      <><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> EXECUTE_VERIFICATION</>
                    ) : (
                      <><span className="opacity-50">INPUT_REQUIRED</span></>
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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-auto"
            style={{ background: 'radial-gradient(ellipse at center, #050f1f 0%, #000005 100%)' }}
          >
            {/* Scanline */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)' }} />

            {/* Glow pulse */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none"
              style={{ background: scene.glow }}
            />

            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
              className="relative z-10 w-full max-w-lg text-center font-mono"
            >
              {/* Trophy Icon */}
              <motion.div
                animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl md:text-8xl mb-4 select-none"
              >
                🏆
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase mb-1"
                style={{ color: scene.glow, textShadow: `0 0 40px ${scene.glow}80` }}
              >
                LEVEL CLEAR
              </motion.h1>
              <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-8">Chapter {lvl} — Mission Accomplished</p>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.35 + i * 0.18, type: 'spring', stiffness: 200 }}
                    className="text-4xl md:text-5xl"
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
                className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 mb-8 shadow-2xl"
              >
                <div className="flex justify-around">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Poin</p>
                    <p className="text-3xl font-black" style={{ color: scene.glow }}>{winData.pts}</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Bintang</p>
                    <p className="text-3xl font-black text-amber-400">{winData.bintang} / 3</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Level</p>
                    <p className="text-3xl font-black text-white">{lvl}</p>
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
                        <span>LOADING...</span>
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
                  className="flex-1 py-5 rounded-xl font-black text-lg uppercase tracking-widest border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>◁</span>
                  <span>{(lvl >= (totalLevels || 10)) ? 'Selesai 🎉' : 'Dashboard'}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ TERMINAL FEEDBACK OVERLAY ════════════════ */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
            
            {/* Terminal scanline effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)' }} />
            
            <motion.div initial={{scale:0.9, y: 20}} animate={{scale:1, y: 0}} exit={{scale:0.9, opacity:0}}
              className={`relative max-w-2xl w-full p-8 md:p-10 rounded-2xl border shadow-2xl overflow-hidden ${
                feedback.type==='success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
                  : 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.15)]'
              }`}>
              
              <div className={`absolute top-0 left-0 w-full h-1 ${feedback.type==='success'?'bg-emerald-500':'bg-rose-500'}`} />
              
              <div className="flex flex-col items-center text-center font-mono">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl border ${
                  feedback.type==='success' ? 'bg-emerald-900/50 border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-rose-900/50 border-rose-400 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                }`}>
                  {feedback.type==='success'?'✓':'✕'}
                </div>
                
                <h3 className={`text-2xl md:text-3xl font-black mb-6 tracking-widest uppercase ${feedback.type==='success'?'text-emerald-400':'text-rose-400'}`}>
                  {feedback.text}
                </h3>
                
                {feedback.explanation && (
                  <div className={`text-left w-full p-5 rounded-xl border leading-relaxed text-sm md:text-base mb-6 ${
                    feedback.type==='success'?'bg-emerald-950/50 border-emerald-500/30 text-emerald-100':'bg-rose-950/50 border-rose-500/30 text-rose-100'
                  }`}>
                    <p className={`font-mono font-bold mb-2 uppercase tracking-widest text-xs flex items-center gap-2 ${feedback.type==='success'?'text-emerald-400':'text-rose-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${feedback.type==='success'?'bg-emerald-400':'bg-rose-400'}`} /> SYSTEM_NOTE:
                    </p>
                    {feedback.explanation}
                  </div>
                )}

                {/* Success Action Buttons */}
                {feedback.type === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="w-full flex flex-col sm:flex-row gap-3 mt-4"
                  >
                    {lvl < (totalLevels || 10) && (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={async () => {
                          setIsNavigating(true);
                          // Ensure level completion is submitted before navigating
                          if (!submitted) {
                            await handleLevelComplete();
                          }
                          setFeedback(null);
                          setTimeout(() => navigate(`/game/${lvl + 1}`), 300);
                        }}
                        className="flex-1 py-3 rounded-lg font-black text-base uppercase tracking-widest border-2 transition-all shadow-lg flex items-center justify-center gap-2 bg-emerald-600/30 border-emerald-400 text-emerald-300 hover:bg-emerald-600/50"
                      >
                        <span>Next Level</span>
                        <span>▶</span>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={async () => {
                        setIsNavigating(true);
                        // Ensure level completion is submitted before navigating
                        if (!submitted) {
                          await handleLevelComplete();
                        }
                        setFeedback(null);
                        setTimeout(() => navigate('/dashboard'), 300);
                      }}
                      className="flex-1 py-3 rounded-lg font-black text-base uppercase tracking-widest border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <span>◁</span>
                      <span>{lvl >= (totalLevels || 10) ? 'Selesai' : 'Dashboard'}</span>
                    </motion.button>
                  </motion.div>
                )}
                
                {feedback.type==='success' && (
                  <div className="mt-8 flex items-center gap-3 text-emerald-500/80 text-xs font-bold uppercase tracking-widest">
                    <span className="w-4 h-4 rounded-full border border-emerald-500/50 border-t-emerald-400 animate-spin" />
                    LOADING_NEXT_SEQUENCE...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
