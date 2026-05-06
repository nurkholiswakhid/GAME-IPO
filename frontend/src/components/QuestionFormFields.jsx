import React from 'react';

// ─── HELPER: build JSON strings from structured form state ───────────────────

export function buildOptionsJSON(type, optState) {
  try {
    if (type === 'MATCHING') {
      return JSON.stringify({ left: optState.left.filter(Boolean), right: optState.right.filter(Boolean) });
    }
    // TRUE_FALSE always has exactly 2 fixed options
    if (type === 'TRUE_FALSE') {
      return JSON.stringify(['BENAR', 'SALAH']);
    }
    // CLASSIFICATION, SEQUENCE, MULTIPLE_CHOICE
    return JSON.stringify(optState.items.filter(Boolean));
  } catch { return ''; }
}

export function buildCorrectJSON(type, corState) {
  try {
    if (type === 'CLASSIFICATION') {
      const res = {};
      Object.entries(corState.mapping).forEach(([item, cat]) => {
        if (!cat || !item) return;
        if (!res[cat]) res[cat] = [];
        res[cat].push(item);
      });
      return JSON.stringify(res);
    }
    if (type === 'MATCHING') {
      const cleanMapping = {};
      Object.entries(corState.mapping).forEach(([l, r]) => {
        if (l && r) cleanMapping[l] = r;
      });
      return JSON.stringify(cleanMapping);
    }
    if (type === 'SEQUENCE' || type === 'SEQUENCING') {
      return JSON.stringify(corState.order.filter(Boolean));
    }
    if (type === 'MULTIPLE_CHOICE') {
      return JSON.stringify(corState.selected);
    }
    if (type === 'TRUE_FALSE') {
      // selected must be exactly 'BENAR' or 'SALAH'
      if (corState.selected !== 'BENAR' && corState.selected !== 'SALAH') return '';
      return JSON.stringify(corState.selected);
    }
  } catch { return ''; }
}

export function buildStoryJSON(storyState) {
  try {
    const cleanIntro = storyState.intro.filter(d => d.speaker && d.text).map(d => ({
      speaker: d.speaker,
      text: d.text,
      mood: d.mood || 'normal',
      ...(d.npcName ? { npcName: d.npcName } : {})
    }));
    const cleanOutro = storyState.outro.filter(d => d.speaker && d.text).map(d => ({
      speaker: d.speaker,
      text: d.text,
      mood: d.mood || 'normal',
      ...(d.npcName ? { npcName: d.npcName } : {})
    }));
    
    return JSON.stringify({
      scene: storyState.scene || '',
      chapter: storyState.chapter || '',
      intro: cleanIntro,
      outro: cleanOutro
    });
  } catch { return ''; }
}

// ─── HELPER: parse existing JSON into structured state ───────────────────────

export function parseOptionsState(type, optionsJson) {
  try {
    const parsed = JSON.parse(optionsJson);
    if (type === 'MATCHING') {
      return { left: parsed.left || [], right: parsed.right || [], items: [] };
    }
    return { items: Array.isArray(parsed) ? parsed : [], left: [], right: [] };
  } catch {
    return emptyOptState(type);
  }
}

export function parseCorrectState(type, correctJson) {
  try {
    const parsed = JSON.parse(correctJson);
    if (type === 'CLASSIFICATION') {
      const mapping = {};
      Object.entries(parsed).forEach(([cat, items]) => {
        if (Array.isArray(items)) {
          items.forEach(it => { mapping[it] = cat; });
        }
      });
      return { mapping, order: [], selected: '' };
    }
    if (type === 'MATCHING') {
      return { mapping: parsed || {}, order: [], selected: '' };
    }
    if (type === 'SEQUENCE' || type === 'SEQUENCING') {
      return { mapping: {}, order: parsed || [], selected: '' };
    }
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
      return { mapping: {}, order: [], selected: parsed || '' };
    }
  } catch {}
  return emptyCorState();
}

export function emptyOptState(type) {
  if (type === 'MATCHING') return { left: [''], right: [''], items: [] };
  if (type === 'TRUE_FALSE') return { items: ['BENAR', 'SALAH'], left: [], right: [] };
  return { items: [''], left: [], right: [] };
}
export function emptyCorState() {
  return { mapping: {}, order: [], selected: '' };
}

export function emptyStoryState() {
  return {
    scene: '',
    chapter: '',
    intro: [{ speaker: '', text: '', mood: 'normal', npcName: '' }],
    outro: [{ speaker: '', text: '', mood: 'normal', npcName: '' }]
  };
}

export function parseStoryState(jsonStr) {
  const empty = emptyStoryState();
  if (!jsonStr) return empty;
  try {
    const data = JSON.parse(jsonStr);
    if (Array.isArray(data)) return empty; // old format
    return {
      scene: data.scene || '',
      chapter: data.chapter || '',
      intro: (data.intro && data.intro.length > 0) ? data.intro.map(d => ({
        speaker: d.speaker || '', text: d.text || '', mood: d.mood || 'normal', npcName: d.npcName || ''
      })) : [{ speaker: '', text: '', mood: 'normal', npcName: '' }],
      outro: (data.outro && data.outro.length > 0) ? data.outro.map(d => ({
        speaker: d.speaker || '', text: d.text || '', mood: d.mood || 'normal', npcName: d.npcName || ''
      })) : [{ speaker: '', text: '', mood: 'normal', npcName: '' }]
    };
  } catch {
    return empty;
  }
}

// ─── PILL COLORS ─────────────────────────────────────────────────────────────
const TYPE_COLOR = {
  CLASSIFICATION: 'bg-violet-100 text-violet-700 border-violet-200',
  MATCHING:       'bg-blue-100 text-blue-700 border-blue-200',
  SEQUENCE:       'bg-amber-100 text-amber-700 border-amber-200',
  SEQUENCING:     'bg-amber-100 text-amber-700 border-amber-200',
  MULTIPLE_CHOICE:'bg-emerald-100 text-emerald-700 border-emerald-200',
  TRUE_FALSE:     'bg-teal-100 text-teal-700 border-teal-200',
};

const TYPE_HINT = {
  CLASSIFICATION: 'Item dikelompokkan ke kategori tertentu.',
  MATCHING:       'Item kiri dipasangkan dengan item kanan.',
  SEQUENCE:       'Item diurutkan dari posisi pertama hingga terakhir.',
  SEQUENCING:     'Item diurutkan dari posisi pertama hingga terakhir.',
  MULTIPLE_CHOICE:'Satu jawaban benar dipilih dari beberapa opsi.',
  TRUE_FALSE:     'Pilih jawaban Benar atau Salah.',
};

// ─── SHARED INPUT STYLES ─────────────────────────────────────────────────────
const inp = 'w-full px-3 py-2 rounded-lg border border-stone-200 bg-white focus:border-blue-400 outline-none text-sm transition-all';
const smBtn = (color='stone') => `px-3 py-1 text-xs font-bold rounded-lg bg-${color}-100 hover:bg-${color}-200 text-${color}-700 border border-${color}-200 transition-all`;

// ════════════════════════════════════════════════════════════════════════════
// CLASSIFICATION FIELDS
// ════════════════════════════════════════════════════════════════════════════
function ClassificationFields({ optState, setOptState, corState, setCorState }) {
  const items = optState.items;
  // categories derived from corState: array of unique category strings
  const categories = [...new Set(Object.values(corState.mapping).filter(Boolean))];
  const [newCat, setNewCat] = React.useState('');

  // ── Item helpers ──────────────────────────────────────────────────────────
  const updateItem = (idx, val) => {
    const oldVal = items[idx];
    const next = [...items];
    next[idx] = val;
    setOptState({ ...optState, items: next });
    if (oldVal !== val) {
      const map = { ...corState.mapping };
      if (oldVal && map[oldVal] !== undefined) {
        map[val] = map[oldVal];
        delete map[oldVal];
      }
      setCorState({ ...corState, mapping: map });
    }
  };

  const addItem = () => setOptState({ ...optState, items: [...items, ''] });
  const removeItem = (idx) => {
    const removed = items[idx];
    const map = { ...corState.mapping };
    delete map[removed];
    setOptState({ ...optState, items: items.filter((_, i) => i !== idx) });
    setCorState({ ...corState, mapping: map });
  };

  // ── Category helpers ──────────────────────────────────────────────────────
  const addCategory = () => {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) { setNewCat(''); return; }
    // Add a placeholder mapping so the category appears immediately
    setNewCat('');
  };

  const removeCategory = (cat) => {
    const map = { ...corState.mapping };
    Object.keys(map).forEach(k => { if (map[k] === cat) delete map[k]; });
    setCorState({ ...corState, mapping: map });
  };

  const assignItem = (item, cat) => {
    const map = { ...corState.mapping };
    if (cat === '') { delete map[item]; }
    else { map[item] = cat; }
    setCorState({ ...corState, mapping: map });
  };

  // Unique categories currently used in mapping + manually added
  const allCats = [...new Set([
    ...Object.values(corState.mapping).filter(Boolean),
  ])];

  // Group items by category for preview
  const grouped = {};
  allCats.forEach(c => { grouped[c] = []; });
  Object.entries(corState.mapping).forEach(([item, cat]) => {
    if (cat) { if (!grouped[cat]) grouped[cat] = []; grouped[cat].push(item); }
  });
  const unassigned = items.filter(it => it && !corState.mapping[it]);

  const catColors = [
    'bg-violet-100 border-violet-300 text-violet-800',
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-amber-100 border-amber-300 text-amber-800',
    'bg-emerald-100 border-emerald-300 text-emerald-800',
    'bg-pink-100 border-pink-300 text-pink-800',
    'bg-orange-100 border-orange-300 text-orange-800',
  ];

  return (
    <div className="space-y-4">
      {/* ── Step 1: Daftar Item ── */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-violet-50 border-b border-violet-100 flex justify-between items-center">
          <div>
            <span className="text-xs font-black text-violet-700 uppercase tracking-widest">① Daftar Item</span>
            <p className="text-xs text-violet-500 mt-0.5">Item-item yang akan diacak dan dikelompokkan siswa</p>
          </div>
          <button type="button" onClick={addItem} className={smBtn('violet')}>+ Tambah Item</button>
        </div>
        <div className="divide-y divide-stone-100">
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 items-center px-4 py-2">
              <span className="text-xs text-stone-400 w-5 text-right flex-shrink-0">{idx + 1}</span>
              <input value={it} onChange={e => updateItem(idx, e.target.value)}
                className={inp + ' flex-1'} placeholder="Teks item (contoh: Keyboard)" />
              <button type="button" onClick={() => removeItem(idx)}
                className="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold border border-red-100">✕</button>
            </div>
          ))}
          {items.length === 0 && <p className="text-xs text-stone-400 text-center py-4 italic">Belum ada item.</p>}
        </div>
      </div>

      {/* ── Step 2: Assign Kategori ── */}
      {items.filter(Boolean).length > 0 && (
        <div className="bg-white border border-violet-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-violet-50 border-b border-violet-100">
            <span className="text-xs font-black text-violet-700 uppercase tracking-widest">② Assign Kategori Tiap Item</span>
            <p className="text-xs text-violet-500 mt-1">Pilih atau ketik nama kategori untuk setiap item</p>
          </div>

          {/* Add new category shortcut */}
          <div className="px-4 py-3 bg-violet-50/50 border-b border-violet-100 flex gap-2">
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
              className="flex-1 px-3 py-1.5 rounded-lg border border-violet-200 text-xs outline-none focus:border-violet-400 bg-white"
              placeholder="Tulis nama kategori baru (Enter untuk tambah)..." />
            <button type="button" onClick={addCategory} className={smBtn('violet')}>+ Kategori</button>
          </div>

          {/* Existing categories as quick-assign buttons */}
          {allCats.length > 0 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-violet-100">
              <span className="text-xs text-stone-400 self-center">Kategori:</span>
              {allCats.map((cat, i) => (
                <span key={cat} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${catColors[i % catColors.length]}`}>
                  {cat}
                  <button type="button" onClick={() => removeCategory(cat)} className="hover:opacity-70 ml-0.5">✕</button>
                </span>
              ))}
            </div>
          )}

          {/* Per-item assignment */}
          <div className="divide-y divide-stone-100">
            {items.filter(Boolean).map((it, idx) => {
              const assignedCat = corState.mapping[it] || '';
              const catIdx = allCats.indexOf(assignedCat);
              return (
                <div key={idx} className={`flex gap-3 items-center px-4 py-2.5 ${assignedCat ? catColors[allCats.indexOf(assignedCat) % catColors.length].split(' ')[0] + '/30' : ''}`}>
                  <span className="flex-1 text-sm font-bold text-stone-700 truncate">{it}</span>
                  <span className="text-stone-300">→</span>
                  <select
                    value={assignedCat}
                    onChange={e => {
                      const val = e.target.value;
                      // If new category typed inline, add it
                      assignItem(it, val);
                    }}
                    className="w-48 px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none focus:border-violet-400 bg-white"
                  >
                    <option value="">— belum dikategori —</option>
                    {allCats.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {/* quick-type if category not in list yet */}
                  <input
                    value={assignedCat}
                    onChange={e => assignItem(it, e.target.value)}
                    className="w-36 px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none focus:border-violet-400 bg-white"
                    placeholder="atau ketik manual..."
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Preview Pengelompokan ── */}
      {allCats.length > 0 && (
        <div className="bg-white border border-violet-100 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-violet-50 border-b border-violet-100">
            <span className="text-xs font-black text-violet-700 uppercase tracking-widest">③ Preview Pengelompokan</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {allCats.map((cat, i) => (
              <div key={cat} className={`rounded-xl border-2 p-3 ${catColors[i % catColors.length]}`}>
                <p className="text-xs font-black uppercase tracking-wide mb-2">{cat}</p>
                <div className="flex flex-wrap gap-1">
                  {(grouped[cat] || []).map(item => (
                    <span key={item} className="px-2 py-1 bg-white/70 rounded-lg text-xs font-medium">{item}</span>
                  ))}
                  {(!grouped[cat] || grouped[cat].length === 0) && (
                    <span className="text-xs opacity-50 italic">Belum ada item</span>
                  )}
                </div>
              </div>
            ))}
            {unassigned.length > 0 && (
              <div className="rounded-xl border-2 border-dashed border-stone-300 p-3">
                <p className="text-xs font-black uppercase tracking-wide mb-2 text-stone-400">Belum Dikategori</p>
                <div className="flex flex-wrap gap-1">
                  {unassigned.map(item => (
                    <span key={item} className="px-2 py-1 bg-stone-100 rounded-lg text-xs font-medium text-stone-600">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
// MATCHING FIELDS
// ════════════════════════════════════════════════════════════════════════════
function MatchingFields({ optState, setOptState, corState, setCorState }) {
  const { left, right } = optState;

  const updateSide = (side, idx, val) => {
    const arr = side === 'left' ? [...left] : [...right];
    const oldVal = arr[idx];
    arr[idx] = val;
    setOptState({ ...optState, [side]: arr });
    if (side === 'left' && oldVal !== val) {
      const map = { ...corState.mapping };
      if (oldVal && map[oldVal] !== undefined) { map[val] = map[oldVal]; delete map[oldVal]; }
      setCorState({ ...corState, mapping: map });
    }
    if (side === 'right' && oldVal !== val) {
      const map = { ...corState.mapping };
      Object.keys(map).forEach(l => { if (map[l] === oldVal) map[l] = val; });
      setCorState({ ...corState, mapping: map });
    }
  };

  const addSide = (side) => {
    if (side === 'left') setOptState({ ...optState, left: [...left, ''] });
    else setOptState({ ...optState, right: [...right, ''] });
  };

  const removeSide = (side, idx) => {
    if (side === 'left') {
      const removed = left[idx];
      const map = { ...corState.mapping }; delete map[removed];
      setOptState({ ...optState, left: left.filter((_, i) => i !== idx) });
      setCorState({ ...corState, mapping: map });
    } else {
      const removed = right[idx];
      const map = { ...corState.mapping };
      Object.keys(map).forEach(l => { if (map[l] === removed) delete map[l]; });
      setOptState({ ...optState, right: right.filter((_, i) => i !== idx) });
      setCorState({ ...corState, mapping: map });
    }
  };

  const setPair = (lt, rt) => {
    setCorState({ ...corState, mapping: { ...corState.mapping, [lt]: rt } });
  };
  const clearPair = (lt) => {
    const map = { ...corState.mapping }; delete map[lt];
    setCorState({ ...corState, mapping: map });
  };

  const usedRight   = new Set(Object.values(corState.mapping).filter(Boolean));
  const leftFilled  = left.filter(Boolean);
  const rightFilled = right.filter(Boolean);
  const pairedCount = leftFilled.filter(l => corState.mapping[l]).length;
  const allPaired   = leftFilled.length > 0 && pairedCount === leftFilled.length;

  return (
    <div className="space-y-5">

      {/* ─── STEP INDICATOR ─── */}
      <div className="flex items-center gap-3 px-1">
        {['Isi Item Kiri', 'Isi Item Kanan', 'Pasangkan'].map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">{i+1}</span>
              <span className="text-xs font-bold text-stone-500 hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-stone-200 max-w-[40px]" />}
          </React.Fragment>
        ))}
        <div className="ml-auto">
          {leftFilled.length > 0 && rightFilled.length > 0 && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              allPaired
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {allPaired ? '✓ Semua terpasang' : `${pairedCount}/${leftFilled.length} terpasang`}
            </span>
          )}
        </div>
      </div>

      {/* ─── STEP 1 & 2: INPUT ITEM ─── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Kolom Kiri */}
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">1</div>
              <div>
                <p className="text-xs font-black text-blue-700 uppercase tracking-wide leading-none">Kolom Kiri</p>
                <p className="text-[10px] text-blue-400 mt-0.5">Item pertanyaan</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addSide('left')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold transition-all shadow-sm"
            >
              + Tambah
            </button>
          </div>
          <div className="p-2 space-y-1.5">
            {left.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 gap-2 opacity-50">
                <span className="text-2xl">📝</span>
                <p className="text-xs text-stone-400 italic text-center">Belum ada item.<br/>Klik + Tambah</p>
              </div>
            )}
            {left.map((it, idx) => {
              const isPaired = !!it && !!corState.mapping[it];
              return (
                <div key={idx} className={`group flex items-center gap-1.5 rounded-xl px-2.5 py-2 border-2 transition-all ${
                  isPaired
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-blue-200'
                }`}>
                  <span className={`w-5 h-5 flex-shrink-0 rounded-lg text-[10px] font-black flex items-center justify-center ${
                    isPaired ? 'bg-blue-500 text-white' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {isPaired ? '✓' : idx + 1}
                  </span>
                  <textarea
                    value={it}
                    onChange={e => updateSide('left', idx, e.target.value)}
                    rows={it.length > 40 ? 2 : 1}
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-stone-700 placeholder-stone-300 min-w-0 resize-none leading-snug"
                    placeholder={`Item ${idx + 1}...`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSide('left', idx)}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md bg-red-100 hover:bg-red-200 text-red-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-all"
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-violet-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-violet-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">2</div>
              <div>
                <p className="text-xs font-black text-violet-700 uppercase tracking-wide leading-none">Kolom Kanan</p>
                <p className="text-[10px] text-violet-400 mt-0.5">Pasangan / jawaban</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addSide('right')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-bold transition-all shadow-sm"
            >
              + Tambah
            </button>
          </div>
          <div className="p-2 space-y-1.5">
            {right.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 gap-2 opacity-50">
                <span className="text-2xl">🔗</span>
                <p className="text-xs text-stone-400 italic text-center">Belum ada item.<br/>Klik + Tambah</p>
              </div>
            )}
            {right.map((it, idx) => {
              const isUsed = !!it && usedRight.has(it);
              return (
                <div key={idx} className={`group flex items-center gap-1.5 rounded-xl px-2.5 py-2 border-2 transition-all ${
                  isUsed
                    ? 'border-violet-300 bg-violet-50 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-violet-200'
                }`}>
                  <span className={`w-5 h-5 flex-shrink-0 rounded-lg text-[10px] font-black flex items-center justify-center ${
                    isUsed ? 'bg-violet-500 text-white' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {isUsed ? '✓' : idx + 1}
                  </span>
                  <textarea
                    value={it}
                    onChange={e => updateSide('right', idx, e.target.value)}
                    rows={it.length > 40 ? 2 : 1}
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-stone-700 placeholder-stone-300 min-w-0 resize-none leading-snug"
                    placeholder={`Item ${idx + 1}...`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSide('right', idx)}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md bg-red-100 hover:bg-red-200 text-red-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-all"
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── STEP 3: PASANGKAN ─── */}
      {leftFilled.length > 0 && rightFilled.length > 0 && (
        <div className="rounded-2xl border-2 border-indigo-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 text-white text-[10px] font-black flex items-center justify-center">3</div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wide leading-none">Tentukan Pasangan Benar</p>
                <p className="text-[10px] text-blue-100 mt-0.5">Pilih item kanan yang cocok untuk setiap item kiri</p>
              </div>
            </div>
            {allPaired && (
              <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/30">
                ✓ Lengkap!
              </span>
            )}
          </div>

          {/* Pairing rows */}
          <div className="divide-y divide-stone-100 bg-white">
            {leftFilled.map((lt, idx) => {
              const paired = corState.mapping[lt] || '';
              return (
                <div key={idx} className={`px-4 py-3 transition-colors ${paired ? 'bg-indigo-50/40' : ''}`}>
                  {/* Left item label */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`w-5 h-5 flex-shrink-0 rounded-lg text-[10px] font-black flex items-center justify-center mt-0.5 ${
                      paired ? 'bg-blue-500 text-white' : 'bg-amber-400 text-white'
                    }`}>{idx + 1}</span>
                    <span className="text-sm font-semibold text-stone-800 leading-snug break-words min-w-0 flex-1">{lt}</span>
                  </div>

                  {/* Arrow + Right picker */}
                  <div className="pl-7">
                    {!paired ? (
                      <div className="flex flex-wrap gap-1.5">
                        {rightFilled.map((rt, ridx) => {
                          const taken = usedRight.has(rt) && corState.mapping[lt] !== rt;
                          return (
                            <button
                              key={ridx}
                              type="button"
                              disabled={taken}
                              onClick={() => !taken && setPair(lt, rt)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border-2 transition-all text-left break-words ${
                                taken
                                  ? 'border-stone-200 bg-stone-50 text-stone-300 cursor-not-allowed line-through'
                                  : 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-500 hover:text-white hover:border-violet-500 active:scale-95'
                              }`}
                            >
                              {rt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-indigo-300 mt-1">
                          <div className="h-px w-3 bg-indigo-300" />
                          <span className="text-xs font-black">↔</span>
                        </div>
                        <span className="flex-1 px-3 py-1.5 rounded-xl bg-indigo-100 border-2 border-indigo-200 text-sm font-semibold text-indigo-800 break-words leading-snug min-w-0">
                          {paired}
                        </span>
                        <button
                          type="button"
                          onClick={() => clearPair(lt)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all mt-0.5"
                          title="Ganti pasangan"
                        >✕</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning: unpaired */}
          {!allPaired && leftFilled.some(l => !corState.mapping[l]) && (
            <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-200 flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <p className="text-xs text-amber-700 font-medium">
                Belum dipasangkan: <span className="font-bold">{leftFilled.filter(l => !corState.mapping[l]).join(', ')}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── PREVIEW RINGKASAN ─── */}
      {Object.entries(corState.mapping).some(([l, r]) => l && r) && (
        <div className="rounded-2xl border border-stone-200 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="px-4 py-2.5 border-b border-stone-200 flex items-center gap-2">
            <span className="text-base">🗂️</span>
            <span className="text-xs font-black text-stone-600 uppercase tracking-widest">Ringkasan Pasangan</span>
            <span className="ml-auto text-[11px] font-bold text-stone-400">
              {Object.entries(corState.mapping).filter(([l,r]) => l && r).length} pasang
            </span>
          </div>
          <div className="p-3 space-y-1.5">
            {Object.entries(corState.mapping).filter(([l, r]) => l && r).map(([l, r], i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 flex-shrink-0 rounded-lg bg-blue-500 text-white text-[10px] font-black flex items-center justify-center mt-1">{i+1}</span>
                <div className="flex-1 min-w-0 flex flex-col gap-1 bg-white rounded-xl border border-stone-200 px-3 py-2 shadow-sm">
                  <span className="text-xs font-bold text-blue-700 break-words leading-snug">{l}</span>
                  <div className="flex items-center gap-1">
                    <div className="h-px flex-1 bg-stone-200" />
                    <span className="text-stone-400 font-black text-[10px] flex-shrink-0">↔</span>
                    <div className="h-px flex-1 bg-stone-200" />
                  </div>
                  <span className="text-xs font-bold text-violet-700 break-words leading-snug">{r}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SEQUENCE FIELDS
// ════════════════════════════════════════════════════════════════════════════
function SequenceFields({ optState, setOptState, corState, setCorState }) {
  const items = optState.items;

  const updateItem = (idx, val) => {
    const oldVal = items[idx];
    const next = [...items];
    next[idx] = val;
    setOptState({ ...optState, items: next });
    if (oldVal !== val) {
      const order = corState.order.map(o => o === oldVal ? val : o);
      setCorState({ ...corState, order });
    }
  };

  const addItem = () => setOptState({ ...optState, items: [...items, ''] });
  const removeItem = (idx) => {
    const removed = items[idx];
    setOptState({ ...optState, items: items.filter((_, i) => i !== idx) });
    setCorState({ ...corState, order: corState.order.filter(o => o !== removed) });
  };

  const availIds = items.filter(Boolean);
  const order = corState.order.filter(id => availIds.includes(id));
  const unordered = availIds.filter(id => !order.includes(id));

  const addToOrder = (id) => setCorState({ ...corState, order: [...order, id] });
  const removeFromOrder = (idx) => setCorState({ ...corState, order: order.filter((_, i) => i !== idx) });
  const moveUp = (idx) => {
    if (idx === 0) return;
    const next = [...order]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]];
    setCorState({ ...corState, order: next });
  };
  const moveDown = (idx) => {
    if (idx === order.length-1) return;
    const next = [...order]; [next[idx], next[idx+1]] = [next[idx+1], next[idx]];
    setCorState({ ...corState, order: next });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-amber-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Daftar Item (acak)</span>
          <button type="button" onClick={addItem} className={smBtn('amber')}>+ Tambah</button>
        </div>
        <div className="divide-y divide-stone-100">
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 items-center px-4 py-3">
              <input value={it} onChange={e => updateItem(idx, e.target.value)}
                className={inp + ' flex-1'} placeholder="Label langkah..." />
              <button type="button" onClick={() => removeItem(idx)}
                className="px-2 py-2 rounded bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold border border-red-100">✕</button>
            </div>
          ))}
        </div>
      </div>

      {availIds.length > 0 && (
        <div className="bg-white border border-amber-300 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Urutan yang Benar</span>
            <p className="text-xs text-amber-500 mt-1">Klik item untuk menambahkan ke urutan, lalu atur posisinya</p>
          </div>
          <div className="p-4 space-y-2">
            {order.map((id, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-black flex items-center justify-center">{idx+1}</span>
                <span className="flex-1 text-sm font-medium text-stone-700">{id}</span>
                <button type="button" onClick={() => moveUp(idx)} disabled={idx===0}
                  className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx===order.length-1}
                  className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs disabled:opacity-30">↓</button>
                <button type="button" onClick={() => removeFromOrder(idx)}
                  className="px-2 py-1 rounded bg-red-50 text-red-400 hover:bg-red-100 text-xs font-bold">✕</button>
              </div>
            ))}
            {unordered.length > 0 && (
              <div className="pt-2 border-t border-stone-100">
                <p className="text-xs text-stone-400 mb-2 font-medium">Belum diurutkan — klik untuk tambahkan:</p>
                <div className="flex flex-wrap gap-2">
                  {unordered.map((id, uidx) => (
                    <button key={uidx} type="button" onClick={() => addToOrder(id)}
                      className="px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold border border-amber-200 transition-all">
                      + {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MULTIPLE CHOICE FIELDS
// ════════════════════════════════════════════════════════════════════════════
function MultipleChoiceFields({ optState, setOptState, corState, setCorState }) {
  const items = optState.items;

  const updateItem = (idx, val) => {
    const oldVal = items[idx];
    const next = [...items];
    next[idx] = val;
    setOptState({ ...optState, items: next });
    if (corState.selected === oldVal) {
      setCorState({ ...corState, selected: val });
    }
  };

  const addItem = () => setOptState({ ...optState, items: [...items, ''] });
  const removeItem = (idx) => {
    const removed = items[idx];
    setOptState({ ...optState, items: items.filter((_, i) => i !== idx) });
    if (corState.selected === removed) {
      setCorState({ ...corState, selected: '' });
    }
  };

  const toggleCorrect = (val) => {
    setCorState({ ...corState, selected: val });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-emerald-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
          <div>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Pilihan Jawaban</span>
            <p className="text-xs text-emerald-500 mt-0.5">Centang satu opsi yang merupakan jawaban benar ✓</p>
          </div>
          <button type="button" onClick={addItem} className={smBtn('emerald')}>+ Tambah Opsi</button>
        </div>
        <div className="divide-y divide-stone-100">
          {items.map((it, idx) => {
            const isCorrect = corState.selected === it && it !== '';
            return (
              <div key={idx} className={`flex gap-2 items-center px-4 py-3 transition-colors ${isCorrect ? 'bg-emerald-50' : ''}`}>
                <button
                  type="button"
                  onClick={() => it && toggleCorrect(it)}
                  title="Tandai sebagai jawaban benar"
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all flex-shrink-0 ${
                    isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 text-stone-300 hover:border-emerald-400'
                  }`}>
                  ✓
                </button>
                <input value={it} onChange={e => updateItem(idx, e.target.value)}
                  className={inp + ' flex-1'} placeholder="Teks pilihan jawaban..." />
                <button type="button" onClick={() => removeItem(idx)}
                  className="px-2 py-2 rounded bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold border border-red-100">✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TRUE_FALSE FIELDS (Guru role)
// ════════════════════════════════════════════════════════════════════════════
function TrueFalseFields({ corState, setCorState }) {
  const selected = corState.selected; // 'BENAR' | 'SALAH' | ''

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200">
        <span className="text-lg mt-0.5">💡</span>
        <div>
          <p className="text-xs font-black text-teal-700 uppercase tracking-widest mb-0.5">Format Soal Benar / Salah</p>
          <p className="text-xs text-teal-600 leading-relaxed">
            Opsi jawaban sudah tetap: <strong>BENAR</strong> dan <strong>SALAH</strong>. Pilih satu yang menjadi <strong>kunci jawaban</strong> untuk soal ini.
          </p>
        </div>
      </div>

      {/* Fixed option buttons */}
      <div className="grid grid-cols-2 gap-4">
        {['BENAR', 'SALAH'].map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setCorState({ ...corState, selected: opt })}
              className={`relative overflow-hidden flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 font-black text-xl transition-all shadow-md ${
                opt === 'BENAR'
                  ? isSelected
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100'
                  : isSelected
                    ? 'bg-rose-500 border-rose-600 text-white shadow-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-400 hover:bg-rose-100'
              }`}
            >
              <span className="text-4xl">{opt === 'BENAR' ? '✓' : '✕'}</span>
              <span>{opt}</span>
              {isSelected && (
                <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest bg-white/30 px-2 py-0.5 rounded-full">
                  ✓ Kunci
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation hint */}
      {!selected && (
        <p className="text-xs text-amber-600 font-bold flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <span>⚠️</span> Pilih salah satu sebagai kunci jawaban!
        </p>
      )}
      {selected && (
        <p className="text-xs text-emerald-700 font-bold flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <span>✅</span> Kunci jawaban: <strong>{selected}</strong>
        </p>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT: QuestionFormFields
// ════════════════════════════════════════════════════════════════════════════
export default function QuestionFormFields({ type, optState, setOptState, corState, setCorState }) {
  return (
    <div className="space-y-3">
      {/* Type hint badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${TYPE_COLOR[type] || 'bg-stone-100 text-stone-600'}`}>
        <span>Tipe: {type}</span>
        <span className="font-normal opacity-70">— {TYPE_HINT[type]}</span>
      </div>

      {type === 'CLASSIFICATION'  && <ClassificationFields  optState={optState} setOptState={setOptState} corState={corState} setCorState={setCorState} />}
      {type === 'MATCHING'        && <MatchingFields        optState={optState} setOptState={setOptState} corState={corState} setCorState={setCorState} />}
      {(type === 'SEQUENCE' || type === 'SEQUENCING') && <SequenceFields      optState={optState} setOptState={setOptState} corState={corState} setCorState={setCorState} />}
      {type === 'MULTIPLE_CHOICE' && <MultipleChoiceFields  optState={optState} setOptState={setOptState} corState={corState} setCorState={setCorState} />}
      {type === 'TRUE_FALSE'      && <TrueFalseFields       corState={corState} setCorState={setCorState} />}
    </div>
  );
}

// ─── CHARACTER & SCENE DATA ───────────────────────────────────────────────────
const NPC_LIST = [
  { id: 'NARASI',     label: 'Narasi',     file: null },
  { id: 'ZENO',       label: 'Zeno',       file: '/char_zeno.png' },
  { id: 'RIVO',       label: 'Rivo',       file: '/char_rivo.png' },
  { id: 'ARKA',       label: 'Arka',       file: '/char_arka.png' },
  { id: 'DIRA',       label: 'Dira',       file: '/char_dira.png' },
  { id: 'NEXA',       label: 'Nexa',       file: '/char_nexa.png' },
  { id: 'ARDI',       label: 'Ardi',       file: '/char_ardi.png' },
  { id: 'BUDI',       label: 'Budi',       file: '/char_budi.png' },
  { id: 'NPC_MALE',   label: 'NPC Pria',   file: '/char_npc_male.png' },
  { id: 'NPC_FEMALE', label: 'NPC Wanita', file: '/char_npc_female.png' },
];

const SCENE_LIST = [
  { id: 'lab_komputer',    label: 'Lab Komputer',   file: '/bg_lab_komputer.png' },
  { id: 'data_center',     label: 'Data Center',    file: '/bg_data_center.png' },
  { id: 'perpustakaan',    label: 'Perpustakaan',   file: '/bg_perpustakaan.png' },
  { id: 'studio_it',       label: 'Studio IT',      file: '/bg_studio_it.png' },
  { id: 'academy_kodomo',  label: 'Academy',        file: '/bg_academy_kodomo.png' },
  { id: 'core_kodomo',     label: 'Core',           file: '/bg_core_kodomo.png' },
  { id: 'data_center',     label: 'Data Center',    file: '/bg_data_center.png' },
  { id: 'hardware_kodomo', label: 'Hardware',       file: '/bg_hardware_kodomo.png' },
  { id: 'home_kodomo',     label: 'Home',           file: '/bg_home_kodomo.png' },
  { id: 'network_kodomo',  label: 'Network',        file: '/bg_network_kodomo.png' },
];

// ─── CHARACTER PICKER COMPONENT ──────────────────────────────────────────────
function CharacterPicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const selected = NPC_LIST.find(n => n.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-2 py-1 rounded border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs font-bold min-w-[90px] h-9"
        title="Pilih Karakter"
      >
        {selected?.file
          ? <img src={selected.file} alt={selected.label} className="h-6 w-6 object-cover object-top rounded-full border border-stone-200 bg-stone-100" />
          : <span className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-stone-400 text-xs">?</span>
        }
        <span className="truncate max-w-[56px]">{selected?.label || 'Pilih...'}</span>
        <span className="text-stone-400 ml-auto">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 top-10 left-0 bg-white border border-stone-200 rounded-xl shadow-xl p-3 w-72">
          <p className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">Pilih Karakter</p>
          <div className="grid grid-cols-5 gap-2">
            {NPC_LIST.map(npc => (
              <button
                key={npc.id}
                type="button"
                onClick={() => { onChange(npc); setOpen(false); }}
                className={`flex flex-col items-center gap-1 p-1 rounded-lg border-2 transition-all hover:border-emerald-400 ${
                  value === npc.id ? 'border-emerald-500 bg-emerald-50' : 'border-transparent hover:bg-emerald-50'
                }`}
                title={npc.label}
              >
                {npc.file
                  ? <img src={npc.file} alt={npc.label} className="h-12 w-10 object-cover object-top rounded" />
                  : <div className="h-12 w-10 rounded bg-stone-200 flex items-center justify-center text-stone-500 text-lg">📢</div>
                }
                <span className="text-[10px] font-bold text-stone-600 leading-tight text-center">{npc.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCENE PICKER COMPONENT ───────────────────────────────────────────────────
function ScenePicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const selected = SCENE_LIST.find(s => s.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-sm text-left"
        title="Pilih Scene"
      >
        {selected?.file
          ? <img src={selected.file} alt={selected.label} className="h-7 w-12 object-cover rounded border border-stone-200" />
          : <div className="h-7 w-12 rounded bg-stone-200 flex items-center justify-center text-stone-400 text-xs">🌄</div>
        }
        <span className="flex-1 font-bold text-sm truncate">{selected?.label || value || 'Pilih Latar...'}</span>
        <span className="text-stone-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 top-12 left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-xl p-3">
          <p className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">Pilih Latar Tempat</p>
          <div className="grid grid-cols-3 gap-2">
            {SCENE_LIST.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i).map(scene => (
              <button
                key={scene.id}
                type="button"
                onClick={() => { onChange(scene.id); setOpen(false); }}
                className={`flex flex-col items-center rounded-lg border-2 overflow-hidden transition-all hover:border-emerald-400 ${
                  value === scene.id ? 'border-emerald-500' : 'border-transparent hover:bg-emerald-50'
                }`}
                title={scene.label}
              >
                <img src={scene.file} alt={scene.label} className="w-full h-14 object-cover" />
                <span className="text-[10px] font-bold text-stone-600 py-1 px-1 text-center leading-tight">{scene.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORT: StoryFormFields
// ════════════════════════════════════════════════════════════════════════════
export function StoryFormFields({ storyState, setStoryState }) {
  const updateField = (field, val) => setStoryState({ ...storyState, [field]: val });

  // When a character is chosen from the picker, sync both speaker + npcName at once
  const pickCharacter = (phase, idx, npc) => {
    const next = [...storyState[phase]];
    next[idx] = {
      ...next[idx],
      npcName: npc.id,
      // Only overwrite speaker when it's empty or matches a known character (avoid overwriting custom names)
      speaker: next[idx].speaker && !NPC_LIST.some(n => n.id === next[idx].speaker)
        ? next[idx].speaker
        : npc.id,
    };
    setStoryState({ ...storyState, [phase]: next });
  };

  const updateDialog = (phase, idx, field, val) => {
    const next = [...storyState[phase]];
    next[idx] = { ...next[idx], [field]: val };
    setStoryState({ ...storyState, [phase]: next });
  };

  const addDialog = (phase) => {
    setStoryState({ ...storyState, [phase]: [...storyState[phase], { speaker: '', text: '', mood: 'normal', npcName: '' }] });
  };

  const removeDialog = (phase, idx) => {
    setStoryState({ ...storyState, [phase]: storyState[phase].filter((_, i) => i !== idx) });
  };

  const renderDialogList = (phase, title) => (
    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-emerald-800">{title}</h4>
        <button type="button" onClick={() => addDialog(phase)} className={smBtn('emerald')}>+ Tambah Dialog</button>
      </div>
      <div className="space-y-2">
        {storyState[phase].map((d, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-emerald-200 p-3 space-y-2">
            {/* Row 1: Character picker + mood + delete */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Visual character picker — auto-syncs speaker + npcName */}
              <CharacterPicker
                value={d.npcName || ''}
                onChange={(npc) => pickCharacter(phase, idx, npc)}
              />
              {/* Speaker text (editable manually if needed) */}
              <input
                value={d.speaker}
                onChange={e => updateDialog(phase, idx, 'speaker', e.target.value)}
                className="w-28 px-2 py-1.5 rounded border border-stone-200 text-xs font-bold outline-none focus:border-emerald-400"
                placeholder="Nama speaker"
              />
              {/* Mood */}
              <select value={d.mood} onChange={e => updateDialog(phase, idx, 'mood', e.target.value)}
                className="w-28 px-2 py-1.5 rounded border border-stone-200 text-xs outline-none focus:border-emerald-400">
                <option value="normal">😐 Normal</option>
                <option value="happy">😄 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="thinking">🤔 Thinking</option>
                <option value="confident">😎 Confident</option>
                <option value="panic">😱 Panic</option>
              </select>
              <button type="button" onClick={() => removeDialog(phase, idx)}
                className="ml-auto px-2 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-all">✕</button>
            </div>
            {/* Row 2: Dialog text */}
            <input
              value={d.text}
              onChange={e => updateDialog(phase, idx, 'text', e.target.value)}
              className="w-full px-3 py-2 rounded border border-stone-200 text-xs outline-none focus:border-emerald-400"
              placeholder="Isi percakapan..."
            />
          </div>
        ))}
        {storyState[phase].length === 0 && (
          <p className="text-xs text-stone-400 text-center py-3 italic">Belum ada dialog.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Latar Tempat (Scene)</label>
          <ScenePicker value={storyState.scene} onChange={(val) => updateField('scene', val)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Judul Chapter</label>
          <input value={storyState.chapter} onChange={e => updateField('chapter', e.target.value)}
            className={inp} placeholder="misal: Level 1: Bahan Baku Sistem" />
        </div>
      </div>
      {renderDialogList('intro', '🎬 Percakapan Awal (Intro)')}
      {renderDialogList('outro', '🏁 Percakapan Akhir (Outro)')}
    </div>
  );
}

