import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMPANIONS = [
  {
    key: 'ARKA',
    name: 'Arka',
    emoji: '🧑‍🔧',
    color: '#3b82f6',
    style: 'SPEEDRUNNER',
    time: '180 detik (3 menit)',
    lives: '∞ (unlimited)',
    points: '×1.5',
    description: 'Ahli infrastruktur yang cepat dan efisien. Gaya kerjanya terburu-buru tapi presisi tinggi.',
    strength: [
      '⚡ Waktu paling singkat untuk mental challenge',
      '♾️ Tidak perlu khawatir nyawa (unlimited)',
      '📈 Bonus speed: poin dikalikan 1.5x'
    ],
    weakness: [
      '⏰ Hanya 3 menit, harus cepat memutuskan',
      '🧠 Tekanan waktu tinggi, lebih stres'
    ]
  },
  {
    key: 'NEXA',
    name: 'Nexa',
    emoji: '👩‍💻',
    color: '#8b5cf6',
    style: 'PRECISION SPECIALIST',
    time: '240 detik (4 menit)',
    lives: '×1 (1 kesempatan)',
    points: '×1.5',
    description: 'Programmer handal yang fokus pada akurasi. Gaya kerjanya precision dan calculated.',
    strength: [
      '🎯 Fokus penuh pada keakuratan jawaban',
      '💪 Challenge tinggi untuk mental toughness',
      '📈 Bonus precision: poin dikalikan 1.5x'
    ],
    weakness: [
      '⚠️ Hanya 1 kesempatan! Sekali salah = GAME OVER',
      '😰 Tekanan psikologis sangat tinggi',
      '❌ Tidak ada ruang untuk percobaan'
    ]
  },
  {
    key: 'DIRA',
    name: 'Dira',
    emoji: '👩‍🎨',
    color: '#10b981',
    style: 'ANALYST METHODICAL',
    time: '∞ (unlimited)',
    lives: '×3 (3 kesempatan)',
    points: '×1',
    description: 'Desainer sistematis yang tidak terburu-buru. Gaya kerjanya santai untuk pembelajaran optimal.',
    strength: [
      '⏱️ Waktu unlimited - tidak ada tekanan waktu',
      '♻️ 3 kesempatan untuk belajar dari kesalahan',
      '🧘 Approach methodical untuk understanding mendalam'
    ],
    weakness: [
      '📊 No speed bonus, poin standard saja',
      '🐢 Bisa jadi terlalu santai, kurang focused'
    ]
  },
  {
    key: 'RIVO',
    name: 'Rivo',
    emoji: '👨‍✈️',
    color: '#f97316',
    style: 'BALANCED GUIDE',
    time: '300 detik (5 menit)',
    lives: '×3 (3 kesempatan)',
    points: '×1',
    description: 'Pilot navigasi yang seimbang. Gaya kerjanya standard untuk learner pemula.',
    strength: [
      '⏱️ Waktu paling lama - cukup santai',
      '♻️ 3 kesempatan untuk belajar',
      '🎯 Setup standard - rekomendasi awal'
    ],
    weakness: [
      '📊 Tidak ada bonus poin',
      '😴 Mungkin terlalu mudah untuk expert'
    ]
  }
];

export default function CompanionGuide({ isOpen, onClose, onSelect }) {
  const [selected, setSelected] = useState('RIVO');
  const selectedData = COMPANIONS.find(c => c.key === selected);

  if (!isOpen) return null;

  const handleSelect = (key) => {
    setSelected(key);
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto border border-stone-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 px-6 md:px-8 py-6 md:py-8 border-b border-amber-200">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-amber-900 mb-2">
                Panduan Sistem Pendamping
              </h2>
              <p className="text-amber-800 text-sm md:text-base font-medium">
                Pilih pendamping yang sesuai dengan gaya belajarmu. Setiap spesialis punya kekuatan unik!
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-1 text-amber-900 hover:text-amber-700 transition-colors text-2xl font-bold shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Companion Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {COMPANIONS.map(companion => (
              <motion.button
                key={companion.key}
                onClick={() => handleSelect(companion.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl p-5 border-2 transition-all text-left ${
                  selected === companion.key
                    ? `border-[${companion.color}] bg-white shadow-lg`
                    : 'border-stone-200 bg-stone-50 hover:bg-white hover:shadow-md'
                }`}
                style={{
                  borderColor: selected === companion.key ? companion.color : undefined,
                  boxShadow: selected === companion.key ? `0 0 20px ${companion.color}30` : undefined
                }}
              >
                {/* Active indicator */}
                {selected === companion.key && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: companion.color }}
                  />
                )}

                {/* Content */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl">{companion.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-stone-800">{companion.name}</h3>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {companion.style}
                    </p>
                  </div>
                  {selected === companion.key && (
                    <div className="text-emerald-600 text-2xl">✓</div>
                  )}
                </div>

                <p className="text-xs md:text-sm text-stone-600 leading-relaxed mb-3">
                  {companion.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 text-[11px] md:text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700 min-w-[60px]">⏱️ Waktu:</span>
                    <span>{companion.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700 min-w-[60px]">💪 Nyawa:</span>
                    <span>{companion.lives}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700 min-w-[60px]">⭐ Poin:</span>
                    <span>{companion.points}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detailed View */}
          <AnimatePresence mode="wait">
            {selectedData && (
              <motion.div
                key={selectedData.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 border border-stone-200 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Strengths */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">💪</span>
                      <h4 className="font-black text-stone-800 text-lg uppercase tracking-wide">Kekuatan</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedData.strength.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-stone-700 leading-relaxed">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">⚠️</span>
                      <h4 className="font-black text-stone-800 text-lg uppercase tracking-wide">Tantangan</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedData.weakness.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-stone-700 leading-relaxed">
                          <span className="text-amber-600 font-bold shrink-0">!</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rekomendasi */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
            <p className="font-bold mb-1">💡 Rekomendasi:</p>
            <p>
              Pemula? Pilih <strong>RIVO</strong> (standard). Mau challenge? Try <strong>NEXA</strong> atau <strong>ARKA</strong>. 
              Ingin fokus pembelajaran tanpa tekanan waktu? Pilih <strong>DIRA</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition-colors"
            >
              Tutup
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${selectedData?.color}, ${selectedData?.color}99)`,
              }}
            >
              Pilih {selectedData?.name}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
