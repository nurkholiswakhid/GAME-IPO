import React from 'react';

// ─── HELPER: build JSON strings from structured form state ───────────────────

export function buildOptionsJSON(type, optState) {
  try {
    if (type === 'TRUE_FALSE') {
      // TRUE_FALSE selalu punya opsi tetap BENAR dan SALAH
      return JSON.stringify(['BENAR', 'SALAH']);
    }
    if (type === 'MATCHING') {
      const left  = optState.left.filter(Boolean);
      const right = optState.right.filter(Boolean);
      if (left.length === 0 || right.length === 0) return ''; // validasi wajib isi
      return JSON.stringify({ left, right });
    }
    // CLASSIFICATION, SEQUENCE, MULTIPLE_CHOICE
    const items = optState.items.filter(Boolean);
    if (items.length === 0) return ''; // validasi: harus ada minimal 1 item
    return JSON.stringify(items);
  } catch { return ''; }
}

export function buildCorrectJSON(type, corState, optState = null) {
  try {
    if (type === 'CLASSIFICATION') {
      const res = {};
      // corState.mapping is now { indexStr: category }
      // Need to convert indices to item texts
      Object.entries(corState.mapping).forEach(([indexStrOrItem, cat]) => {
        if (!cat) return;
        if (!res[cat]) res[cat] = [];
        
        // Check if this is an index (numeric string) or item text
        if (optState && !isNaN(indexStrOrItem)) {
          const itemIdx = parseInt(indexStrOrItem, 10);
          const itemText = optState.items[itemIdx];
          if (itemText) {
            res[cat].push(itemText);
          }
        } else {
          // Backward compatibility: it's already item text
          res[cat].push(indexStrOrItem);
        }
      });
      if (Object.keys(res).length === 0) return ''; // validasi: semua item harus punya kategori
      return JSON.stringify(res);
    }
    if (type === 'MATCHING') {
      // Convert indices to text for storage
      const cleanMapping = {};
      Object.entries(corState.mapping).forEach(([leftIdxStr, rightIdxStr]) => {
        if (leftIdxStr === '' || rightIdxStr === '') return;
        if (optState && optState.left && optState.right) {
          const leftIdx = parseInt(leftIdxStr, 10);
          const rightIdx = parseInt(rightIdxStr, 10);
          const leftText = optState.left[leftIdx];
          const rightText = optState.right[rightIdx];
          if (leftText && rightText) {
            cleanMapping[leftText] = rightText;
          }
        } else {
          // Fallback: already text
          if (leftIdxStr && rightIdxStr) cleanMapping[leftIdxStr] = rightIdxStr;
        }
      });
      if (Object.keys(cleanMapping).length === 0) return ''; // validasi: harus ada pasangan
      return JSON.stringify(cleanMapping);
    }
    if (type === 'SEQUENCE' || type === 'SEQUENCING') {
      // Convert indices to item text for storage
      const order = corState.order.filter(idx => idx !== null && idx !== undefined && idx !== '');
      if (order.length === 0) return ''; // validasi: harus ada urutan
      if (optState && optState.items) {
        const itemTexts = order.map(idx => {
          const itemIdx = parseInt(idx, 10);
          return optState.items[itemIdx] || '';
        }).filter(Boolean);
        if (itemTexts.length === 0) return '';
        return JSON.stringify(itemTexts);
      }
      return JSON.stringify(order); // Fallback: already text
    }
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
      if (!corState.selected) return ''; // validasi: harus pilih jawaban benar
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
    // For CLASSIFICATION, SEQUENCE, MULTIPLE_CHOICE
    const items = Array.isArray(parsed) ? parsed : [];
    return { items, left: [], right: [] };
  } catch {
    return emptyOptState(type);
  }
}

export function parseCorrectState(type, correctJson, optState = null) {
  try {
    const parsed = JSON.parse(correctJson);
    if (type === 'CLASSIFICATION') {
      const mapping = {};
      // parsed format: { category: [items...] }
      // Convert to { itemIndex: category } for new system
      Object.entries(parsed).forEach(([cat, items]) => {
        if (Array.isArray(items)) {
          items.forEach(it => { 
            // If optState is provided, find the index of this item
            if (optState && optState.items) {
              const itemIndex = optState.items.indexOf(it);
              if (itemIndex >= 0) {
                mapping[itemIndex] = cat;
              } else {
                // Fallback: item not found, use text as key
                mapping[it] = cat;
              }
            } else {
              // No optState, use text as key (backward compatibility)
              mapping[it] = cat;
            }
          });
        }
      });
      return { mapping, order: [], selected: '' };
    }
    if (type === 'MATCHING') {
      // Convert stored text mapping back to indices
      const mapping = {};
      const parsedMapping = parsed || {};
      if (optState && optState.left && optState.right) {
        Object.entries(parsedMapping).forEach(([leftText, rightText]) => {
          const leftIdx = optState.left.indexOf(leftText);
          const rightIdx = optState.right.indexOf(rightText);
          if (leftIdx >= 0 && rightIdx >= 0) {
            mapping[leftIdx] = rightIdx;
          }
        });
      } else {
        // No optState, use text as key (backward compatibility)
        Object.entries(parsedMapping).forEach(([k, v]) => {
          if (k && v) mapping[k] = v;
        });
      }
      return { mapping, order: [], selected: '' };
    }
    if (type === 'SEQUENCE' || type === 'SEQUENCING') {
      // Convert stored item text back to indices for editing
      const order = parsed || [];
      if (optState && optState.items && Array.isArray(order)) {
        // If all items are numeric strings (already indices), use as-is
        const allIndices = order.every(o => !isNaN(parseInt(o, 10)));
        if (allIndices) {
          return { mapping: {}, order: order.map(o => parseInt(o, 10)), selected: '' };
        }
        // Otherwise, convert item text to indices
        const indices = order.map(itemText => {
          const idx = optState.items.indexOf(itemText);
          return idx >= 0 ? idx : null;
        }).filter(idx => idx !== null);
        return { mapping: {}, order: indices, selected: '' };
      }
      return { mapping: {}, order: order || [], selected: '' };
    }
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
      return { mapping: {}, order: [], selected: parsed || '' };
    }
  } catch {}
  return emptyCorState();
}

export function emptyOptState(type) {
  if (type === 'MATCHING') return { left: [''], right: [''], items: [] };
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
// CATEGORY PICKER - Enhanced Dropdown Selector
// ════════════════════════════════════════════════════════════════════════════
function CategoryPicker({ existingCategories, value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(value);
  
  React.useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const suggestions = existingCategories.filter(cat => 
    cat.toLowerCase().includes(searchTerm.toLowerCase()) && cat !== value
  );

  const handleSelect = (cat) => {
    onChange(cat);
    setSearchTerm(cat);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setOpen(val.length > 0);
  };

  const handleAddNew = (cat) => {
    if (cat && !existingCategories.includes(cat)) {
      onChange(cat);
      setOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={`w-full px-4 py-3 pr-12 rounded-lg border-2 font-bold outline-none transition-all text-sm ${value ? 'bg-green-100 border-green-500 text-green-900 shadow-sm' : 'bg-white border-amber-400 focus:border-violet-500 focus:bg-violet-50 text-stone-700'}`}
          placeholder="Pilih atau ketik kategori..." 
        />
        <div className="absolute right-3 flex gap-2 items-center">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-red-400 hover:text-red-600 font-bold text-lg hover:scale-125 transition-transform"
              title="Hapus pilihan"
            >
              ✕
            </button>
          )}
          {value && <span className="text-xl">✓</span>}
        </div>
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border-2 border-violet-300 rounded-xl shadow-xl overflow-hidden">
          {/* Existing Categories */}
          {existingCategories.length > 0 && (
            <div className="p-3 border-b border-stone-100">
              <p className="text-xs font-black text-stone-500 uppercase mb-2 px-2">📌 Kategori Tersedia</p>
              <div className="space-y-1.5">
                {existingCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      value === cat
                        ? 'bg-violet-500 text-white'
                        : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200'
                    }`}
                  >
                    🏷️ {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions or Add New */}
          {searchTerm && !existingCategories.includes(searchTerm) && (
            <div className="p-3">
              <button
                type="button"
                onClick={() => handleAddNew(searchTerm)}
                className="w-full px-3 py-2.5 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 font-bold text-sm hover:shadow-md transition-all flex items-center gap-2 justify-center"
              >
                ➕ Tambah Kategori: <strong>"{searchTerm}"</strong>
              </button>
            </div>
          )}

          {existingCategories.length === 0 && !searchTerm && (
            <div className="p-4 text-center text-stone-500 text-xs font-medium">
              Ketik kategori untuk mulai menambah
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CLASSIFICATION FIELDS
// ════════════════════════════════════════════════════════════════════════════
function ClassificationFields({ optState, setOptState, corState, setCorState }) {
  const items = optState.items.filter(Boolean);
  const allItems = optState.items;
  const [activeStep, setActiveStep] = React.useState(allItems.length === 0 ? 1 : items.length > 0 && Object.values(corState.mapping).filter(Boolean).length === items.length ? 3 : 2);

  const updateItem = (idx, val) => {
    const next = [...allItems];
    next[idx] = val;
    setOptState({ ...optState, items: next });
  };

  const addItem = () => {
    setOptState({ ...optState, items: [...allItems, ''] });
  };

  const removeItem = (idx) => {
    const next = allItems.filter((_, i) => i !== idx);
    const newMapping = {};
    Object.entries(corState.mapping).forEach(([indexStr, cat]) => {
      const indexNum = parseInt(indexStr, 10);
      if (indexNum === idx) return;
      else if (indexNum > idx) newMapping[indexNum - 1] = cat;
      else newMapping[indexNum] = cat;
    });
    setOptState({ ...optState, items: next });
    setCorState({ ...corState, mapping: newMapping });
  };

  const getCategories = () => {
    const cats = {};
    Object.values(corState.mapping).forEach(cat => {
      if (cat) cats[cat] = true;
    });
    return Object.keys(cats);
  };

  const getItemsByCategory = (cat) => {
    return Object.entries(corState.mapping)
      .filter(([_, c]) => c === cat)
      .map(([indexStr, _]) => {
        const idx = parseInt(indexStr, 10);
        return items[idx] || allItems[idx];
      })
      .filter(Boolean);
  };

  const CATEGORY_COLORS = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-cyan-100'];
  const CATEGORY_TEXT_COLORS = ['text-red-700', 'text-blue-700', 'text-green-700', 'text-yellow-700', 'text-purple-700', 'text-pink-700', 'text-indigo-700', 'text-cyan-700'];
  const CATEGORY_BORDER_COLORS = ['border-red-200', 'border-blue-200', 'border-green-200', 'border-yellow-200', 'border-purple-200', 'border-pink-200', 'border-indigo-200', 'border-cyan-200'];
  
  const getCategoryColor = (idx) => ({
    bg: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    text: CATEGORY_TEXT_COLORS[idx % CATEGORY_TEXT_COLORS.length],
    border: CATEGORY_BORDER_COLORS[idx % CATEGORY_BORDER_COLORS.length]
  });

  const completionPercentage = items.length > 0 ? Math.round((Object.values(corState.mapping).filter(Boolean).length / items.length) * 100) : 0;
  const isComplete = items.length > 0 && Object.values(corState.mapping).filter(Boolean).length === items.length;

  return (
    <div className="space-y-5">
      {/* PROGRESS BAR */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xs font-black text-violet-800 uppercase tracking-widest">📊 Progress Setup Soal</span>
            <p className="text-xs text-violet-600 mt-1">Kelengkapan data untuk soal klasifikasi</p>
          </div>
          <span className="text-lg font-black text-violet-700">{completionPercentage}%</span>
        </div>
        <div className="w-full h-4 bg-violet-200 rounded-full overflow-hidden border-2 border-violet-300 shadow-inner">
          <div className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 transition-all duration-500 rounded-full shadow-lg" style={{width: `${completionPercentage}%`}}></div>
        </div>
      </div>

      {/* STEP 1: INPUT ITEMS */}
      <div className={`border-2 rounded-2xl transition-all overflow-hidden ${activeStep === 1 ? 'border-violet-400 bg-violet-50/50 shadow-lg' : 'border-stone-200 bg-white'}`}>
        <div className={`px-6 py-5 rounded-t-xl flex items-center gap-3 ${activeStep === 1 ? 'bg-gradient-to-r from-violet-100 to-purple-100 border-b border-violet-200' : 'bg-stone-50 border-b border-stone-100'}`}>
          <span className={`flex-shrink-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shadow-md ${activeStep === 1 ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' : 'bg-gradient-to-br from-violet-400 to-purple-500 text-white'}`}>1️⃣</span>
          <div className="flex-1">
            <h3 className="font-black text-lg text-violet-900">Langkah 1: Masukkan Item-Item</h3>
            <p className="text-xs text-violet-600 mt-1 font-medium">Tambahkan semua item/objek yang akan dikelompokkan siswa</p>
          </div>
          {allItems.length > 0 && (
            <span className="text-sm font-bold px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-400 shadow-sm">📦 {allItems.length} item</span>
          )}
        </div>
        <div className="px-6 py-5 space-y-3 bg-white">
          {allItems.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-stone-600 font-black text-base mb-4">Belum ada item. Mulai dengan menambah item pertama!</p>
              <p className="text-xs text-stone-500 mb-6">Contoh item: Keyboard, Monitor, CPU, RAM, Printer, dll</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {allItems.map((it, idx) => (
                <div key={idx} className={`flex gap-3 items-center p-4 rounded-xl border-2 transition-all duration-300 group ${it ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-300 hover:shadow-md' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shadow-sm">{idx + 1}</div>
                  <input 
                    value={it} 
                    onChange={e => updateItem(idx, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-stone-300 bg-white focus:bg-violet-50 focus:border-violet-400 outline-none text-sm font-medium transition-all" 
                    placeholder="Contoh: Keyboard, Monitor, Printer..." />
                  <button type="button" onClick={() => removeItem(idx)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold border border-red-200 transition-all">🗑️</button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={addItem} 
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-black text-sm transition-all shadow-md hover:shadow-lg active:scale-95">
            ➕ Tambah Item Baru
          </button>
          {allItems.length > 0 && (
            <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl mt-4">
              <div className="flex gap-2 items-start">
                <span className="text-lg mt-0.5">💡</span>
                <div>
                  <p className="text-xs text-blue-900 font-black mb-1">Tips Menambah Item:</p>
                  <p className="text-xs text-blue-700 leading-relaxed">Tambahkan <strong>minimal 3-5 item</strong> untuk membuat soal yang bermakna. Pastikan item-item tersebut dapat dikelompokkan ke dalam <strong>2-3 kategori berbeda</strong>.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 2: ASSIGN CATEGORIES */}
      {items.length > 0 && (
        <div className={`border-2 rounded-2xl transition-all overflow-hidden ${activeStep === 2 ? 'border-violet-400 bg-violet-50/50 shadow-lg' : 'border-stone-200 bg-white'}`}>
          <div className={`px-6 py-5 rounded-t-xl flex items-center gap-3 ${activeStep === 2 ? 'bg-gradient-to-r from-violet-100 to-purple-100 border-b border-violet-200' : 'bg-stone-50 border-b border-stone-100'}`}>
            <span className={`flex-shrink-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shadow-md ${activeStep === 2 ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' : Object.values(corState.mapping).filter(Boolean).length > 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>2️⃣</span>
            <div className="flex-1">
              <h3 className="font-black text-lg text-violet-900">Langkah 2: Kelompokkan ke Kategori</h3>
              <p className="text-xs text-violet-600 mt-1 font-medium">Tentukan kategori untuk setiap item yang akan siswa pelajari</p>
            </div>
            {Object.values(corState.mapping).filter(Boolean).length > 0 && (
              <span className="text-sm font-bold px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full border border-blue-300 shadow-sm">{Object.values(corState.mapping).filter(Boolean).length}/{items.length} ✓</span>
            )}
          </div>
          <div className="px-6 py-5 space-y-3 bg-white">
            {/* Quick Category Selector - Show existing categories */}
            {getCategories().length > 0 && (
              <div className="mb-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl">
                <p className="text-xs font-black text-purple-800 uppercase mb-3">⚡ Tombol Cepat - Kategori yang Ada</p>
                <div className="flex flex-wrap gap-2">
                  {getCategories().map((cat, idx) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const unassignedIdx = items.findIndex((_, i) => !corState.mapping[i]);
                        if (unassignedIdx >= 0) {
                          setCorState({ ...corState, mapping: { ...corState.mapping, [unassignedIdx]: cat } });
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-white border-2 border-purple-300 text-purple-800 font-bold text-sm hover:bg-purple-100 transition-all active:scale-95"
                    >
                      🏷️ {cat}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-purple-700 mt-3 font-medium">Klik tombol untuk assign ke item pertama yang belum punya kategori</p>
              </div>
            )}

            <div className="space-y-3">
              {items.map((it, pidx) => {
                const category = corState.mapping[pidx] || '';
                const isAssigned = !!category;
                return (
                  <div key={pidx} className={`flex gap-3 items-center p-4 rounded-xl border-2 transition-all duration-300 ${isAssigned ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 hover:shadow-md'}`}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shadow-sm">{pidx + 1}</div>
                    <div className="flex-shrink-0">
                      <div className={`px-4 py-2 rounded-lg font-bold text-sm border-2 transition-all ${isAssigned ? 'bg-white border-green-400 text-green-800 shadow-sm' : 'bg-white border-stone-300 text-stone-700'}`}>{it}</div>
                    </div>
                    <div className={`text-2xl ${isAssigned ? 'text-green-500' : 'text-stone-300'}`}>→</div>
                    <div className="flex-1 relative">
                      <CategoryPicker
                        existingCategories={getCategories()}
                        value={category}
                        onChange={(cat) => setCorState({ ...corState, mapping: { ...corState.mapping, [pidx]: cat } })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl">
              <div className="flex gap-2 items-start">
                <span className="text-lg mt-0.5">💡</span>
                <div>
                  <p className="text-sm text-blue-900 font-black mb-1">Tips Memberikan Kategori:</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    ✅ <strong>Pilih dari dropdown</strong> kategori yang sudah ada (lebih cepat)<br/>
                    ✅ atau <strong>ketik nama baru</strong> untuk membuat kategori baru<br/>
                    ✅ Gunakan nama <strong>konsisten, jelas, dan mudah diingat</strong><br/>
                    Contoh: HARDWARE, SOFTWARE, NETWORK atau INPUT, OUTPUT, STORAGE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & PREVIEW */}
      {items.length > 0 && getCategories().length > 0 && (
        <div className={`border-2 rounded-2xl transition-all overflow-hidden ${activeStep === 3 ? 'border-violet-400 bg-violet-50/50 shadow-lg' : 'border-stone-200 bg-white'}`}>
          <div className={`px-6 py-5 rounded-t-xl flex items-center gap-3 ${activeStep === 3 ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-b border-emerald-200' : 'bg-stone-50 border-b border-stone-100'}`}>
            <span className={`flex-shrink-0 w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shadow-md ${isComplete ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>3️⃣</span>
            <div className="flex-1">
              <h3 className="font-black text-lg text-emerald-900">Langkah 3: Pratinjau Kategori</h3>
              <p className="text-xs text-emerald-700 mt-1 font-medium">Lihat bagaimana pengelompokan yang akan dilihat siswa</p>
            </div>
            {isComplete && (
              <span className="text-sm font-bold px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-400 shadow-md animate-pulse">✨ Sempurna!</span>
            )}
          </div>
          <div className="px-6 py-6 bg-white">
            <div className="space-y-4">
              {getCategories().map((cat, catIdx) => {
                const colors = getCategoryColor(catIdx);
                const itemsInCat = getItemsByCategory(cat);
                return (
                  <div key={cat} className={`${colors.bg} border-3 ${colors.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} border-3 ${colors.border} flex items-center justify-center text-lg font-bold`}>🏷️</div>
                      <div>
                        <div className={`text-lg font-black ${colors.text}`}>{cat}</div>
                        <div className="text-xs font-bold text-stone-500">{itemsInCat.length} item</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {itemsInCat.map((item, idx) => (
                        <span key={idx} className={`px-4 py-2.5 rounded-xl font-bold text-sm bg-white ${colors.text} border-2 ${colors.border} shadow-sm transition-transform hover:scale-105`}>
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {!isComplete && (
              <div className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl flex-shrink-0">⏳</span>
                  <div>
                    <p className="text-sm font-black text-amber-900 mb-1">Belum Selesai!</p>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      <strong>{items.length - Object.values(corState.mapping).filter(Boolean).length} item</strong> masih perlu kategori. 
                      Selesaikan <strong>Langkah 2</strong> terlebih dahulu sebelum menyimpan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isComplete && (
              <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-black text-green-900 mb-1">Mantap! Setup Selesai!</p>
                    <p className="text-xs text-green-800 font-medium leading-relaxed">
                      Soal klasifikasi Anda sudah siap. <strong>{getCategories().length} kategori</strong> dengan total <strong>{items.length} item</strong> akan ditampilkan kepada siswa. 
                      Sekarang Anda bisa menyimpan soal ini!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPLETION CHECK */}
      {items.length > 0 && !isComplete && Object.values(corState.mapping).filter(Boolean).length < items.length && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl shadow-sm">
          <div className="flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">⏳</span>
            <div className="flex-1">
              <p className="font-black text-amber-900 text-sm mb-1.5">Masih Ada Pekerjaan!</p>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                <strong>{items.length - Object.values(corState.mapping).filter(Boolean).length} dari {items.length} item</strong> masih perlu kategori. 
                Selesaikan pengelompokan di <strong>Langkah 2</strong> untuk melanjutkan.
              </p>
            </div>
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
  const leftItems = left.filter(Boolean);
  const rightItems = right.filter(Boolean);
  const mapping = corState.mapping;

  // Step calculations
  const hasItems = leftItems.length > 0 && rightItems.length > 0;
  const filledPairs = Object.entries(mapping).filter(([l, r]) => l !== '' && r !== '').length;
  const progress = hasItems ? Math.round((filledPairs / leftItems.length) * 100) : 0;
  const allPaired = filledPairs === leftItems.length;

  const updateSide = (side, idx, val) => {
    const arr = side === 'left' ? [...left] : [...right];
    arr[idx] = val;
    setOptState({ ...optState, [side]: arr });
  };

  const addSide = (side) => {
    if (side === 'left') setOptState({ ...optState, left: [...left, ''] });
    else setOptState({ ...optState, right: [...right, ''] });
  };

  const removeSide = (side, idx) => {
    if (side === 'left') {
      const newLeft = left.filter((_, i) => i !== idx);
      // Remove mappings and shift indices > idx down by 1
      const newMapping = {};
      Object.entries(mapping).forEach(([lIdx, rIdx]) => {
        const lIdxNum = parseInt(lIdx, 10);
        if (lIdxNum !== idx) {
          const newLIdx = lIdxNum > idx ? lIdxNum - 1 : lIdxNum;
          newMapping[newLIdx] = rIdx;
        }
      });
      setOptState({ ...optState, left: newLeft });
      setCorState({ ...corState, mapping: newMapping });
    } else {
      const newRight = right.filter((_, i) => i !== idx);
      // Remove mappings pointing to this right item
      const newMapping = {};
      Object.entries(mapping).forEach(([lIdx, rIdx]) => {
        const rIdxNum = parseInt(rIdx, 10);
        if (rIdxNum !== idx) {
          const newRIdx = rIdxNum > idx ? rIdxNum - 1 : rIdxNum;
          newMapping[lIdx] = newRIdx;
        }
      });
      setOptState({ ...optState, right: newRight });
      setCorState({ ...corState, mapping: newMapping });
    }
  };

  const setMapping = (leftIdx, rightIdx) => {
    const newMapping = { ...mapping };
    if (rightIdx === '') {
      delete newMapping[leftIdx];
    } else {
      newMapping[leftIdx] = rightIdx;
    }
    setCorState({ ...corState, mapping: newMapping });
  };

  const getUnpairedRight = (leftIdx) => {
    const pairedRightIndices = Object.values(mapping)
      .filter(rIdx => rIdx !== '' && rIdx !== null && rIdx !== undefined)
      .map(rIdx => parseInt(rIdx, 10));
    return rightItems.map((_, idx) => idx).filter(idx => !pairedRightIndices.includes(idx) || mapping[leftIdx] === idx);
  };

  return (
    <div className="space-y-5">
      {/* PROGRESS BAR */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-2 border-rose-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <p className="text-sm font-black text-rose-800 uppercase tracking-wider leading-tight">Progres Pasangan</p>
              <p className="text-xs text-rose-600 font-medium mt-0.5">{filledPairs} dari {leftItems.length} pasangan</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-300 shadow-md">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">{progress}%</span>
          </div>
        </div>
        <div className="w-full bg-rose-100 rounded-full h-5 border-2 border-rose-300 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 h-full rounded-full transition-all duration-700 shadow-md"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* STEP 1️⃣ & 2️⃣ TWO COLUMNS - RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* LEFT COLUMN */}
        <div className="bg-white border-2 border-blue-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-blue-150 via-blue-50 to-white border-b-2 border-blue-200">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-3xl">❓</span>
              <div>
                <p className="text-sm font-black text-blue-900 uppercase tracking-wider leading-tight">Pertanyaan/Konsep</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">Item yang akan dicocokkan</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2.5 max-h-96 overflow-y-auto">
            {left.map((it, idx) => (
              <div key={idx} className="flex gap-3 items-center group bg-blue-50 hover:bg-blue-100 p-2.5 rounded-lg transition-all hover:shadow-sm">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                  {idx + 1}
                </span>
                <input
                  value={it}
                  onChange={e => updateSide('left', idx, e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border-2 border-blue-200 bg-white font-semibold text-sm focus:border-blue-500 focus:bg-blue-50 outline-none transition-all hover:border-blue-300 shadow-sm focus:shadow-md"
                  placeholder="Ketik pertanyaan..."
                />
                <button
                  type="button"
                  onClick={() => removeSide('left', idx)}
                  className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 text-base font-bold border-2 border-red-200 transition-all hover:scale-110 opacity-0 group-hover:opacity-100 shadow-sm"
                  title="Hapus item"
                >
                  ✕
                </button>
              </div>
            ))}
            {left.length === 0 && (
              <div className="text-center py-8 text-blue-300">
                <span className="text-4xl">❓</span>
                <p className="text-xs font-semibold text-blue-400 mt-2">Belum ada pertanyaan</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => addSide('left')}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 text-blue-700 font-bold text-sm hover:shadow-lg hover:border-blue-400 active:scale-95 transition-all duration-200"
            >
              ➕ Tambah Pertanyaan
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-white border-2 border-cyan-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-cyan-150 via-cyan-50 to-white border-b-2 border-cyan-200">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-3xl">💡</span>
              <div>
                <p className="text-sm font-black text-cyan-900 uppercase tracking-wider leading-tight">Jawaban/Penjelasan</p>
                <p className="text-xs text-cyan-600 font-medium mt-0.5">Pasangan untuk item di kiri</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2.5 max-h-96 overflow-y-auto">
            {right.map((it, idx) => (
              <div key={idx} className="flex gap-3 items-center group bg-cyan-50 hover:bg-cyan-100 p-2.5 rounded-lg transition-all hover:shadow-sm">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                  {idx + 1}
                </span>
                <input
                  value={it}
                  onChange={e => updateSide('right', idx, e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border-2 border-cyan-200 bg-white font-semibold text-sm focus:border-cyan-500 focus:bg-cyan-50 outline-none transition-all hover:border-cyan-300 shadow-sm focus:shadow-md"
                  placeholder="Ketik jawaban..."
                />
                <button
                  type="button"
                  onClick={() => removeSide('right', idx)}
                  className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 text-base font-bold border-2 border-red-200 transition-all hover:scale-110 opacity-0 group-hover:opacity-100 shadow-sm"
                  title="Hapus item"
                >
                  ✕
                </button>
              </div>
            ))}
            {right.length === 0 && (
              <div className="text-center py-8 text-cyan-300">
                <span className="text-4xl">💡</span>
                <p className="text-xs font-semibold text-cyan-400 mt-2">Belum ada jawaban</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => addSide('right')}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-100 to-cyan-50 border-2 border-cyan-300 text-cyan-700 font-bold text-sm hover:shadow-lg hover:border-cyan-400 active:scale-95 transition-all duration-200"
            >
              ➕ Tambah Jawaban
            </button>
          </div>
        </div>
      </div>

      {/* STEP 3️⃣ PAIR ITEMS */}
      {hasItems && (
        <div className="bg-white border-2 border-purple-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-purple-150 via-purple-50 to-white border-b-2 border-purple-200">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-3xl">🔗</span>
              <div>
                <p className="text-sm font-black text-purple-900 uppercase tracking-wider leading-tight">Cocokkan Pasangan</p>
                <p className="text-xs text-purple-600 font-medium mt-0.5">Pilih jawaban yang sesuai untuk setiap pertanyaan</p>
              </div>
            </div>
            {/* Status Summary */}
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-purple-200 text-purple-900 px-3 py-1.5 rounded-full">
                <span className="text-lg">✓</span>
                <span>Lengkap: {filledPairs}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-200 text-stone-900 px-3 py-1.5 rounded-full">
                <span className="text-lg">⏳</span>
                <span>Sisa: {leftItems.length - filledPairs}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-2.5">
            {leftItems.map((leftItem, leftIdx) => {
              const mappedRightIdx = mapping[leftIdx];
              const unpairedRight = getUnpairedRight(leftIdx);
              const isComplete = mappedRightIdx !== null && mappedRightIdx !== undefined && mappedRightIdx !== '';
              const selectedRightItem = isComplete ? rightItems[mappedRightIdx] : '';

              return (
                <div
                  key={leftIdx}
                  className={`border-2 rounded-xl transition-all transform duration-300 overflow-hidden ${
                    isComplete
                      ? 'bg-gradient-to-br from-purple-150 to-purple-100 border-purple-500 shadow-lg hover:shadow-xl hover:scale-102'
                      : 'bg-gradient-to-br from-stone-100 to-white border-stone-300 hover:border-purple-300 hover:shadow-md hover:scale-101'
                  }`}
                >
                  {/* Question + Answer Display */}
                  <div className="p-4">
                    {/* Row 1: Question + Connector + Answer */}
                    <div className="flex gap-3 items-center mb-3">
                      {/* Question Badge */}
                      <div className="flex-1">
                        <div className={`flex gap-2 items-start p-3 rounded-lg transition-all ${isComplete ? 'bg-purple-200' : 'bg-stone-200'}`}>
                          <span className={`w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm transition-all ${isComplete ? 'bg-gradient-to-br from-purple-600 to-purple-700 ring-2 ring-purple-400' : 'bg-gradient-to-br from-stone-500 to-stone-600'}`}>
                            {leftIdx + 1}
                          </span>
                          <p className={`text-sm font-bold break-words transition-colors pt-0.5 ${isComplete ? 'text-purple-900' : 'text-stone-700'}`}>
                            {leftItem}
                          </p>
                        </div>
                      </div>

                      {/* Connector */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`text-3xl font-bold transition-all duration-300 ${isComplete ? 'text-purple-500 scale-125' : 'text-stone-300 scale-100'}`}>↔</div>
                        {isComplete && <span className="text-lg text-purple-500 animate-bounce">✓</span>}
                      </div>

                      {/* Answer Badge */}
                      <div className="flex-1">
                        {isComplete ? (
                          <div className="flex gap-2 items-start p-3 rounded-lg bg-gradient-to-br from-emerald-200 to-green-200 ring-2 ring-green-400 ring-opacity-50">
                            <span className="text-lg">✓</span>
                            <p className="text-sm font-bold text-green-900 break-words">
                              {selectedRightItem}
                            </p>
                          </div>
                        ) : (
                          <div className="flex gap-2 items-start p-3 rounded-lg bg-stone-200">
                            <span className="text-lg text-stone-400">?</span>
                            <p className="text-sm font-medium text-stone-600 italic">
                              Belum dipilih
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Dropdown Selector */}
                    <div>
                      <label className={`text-xs font-black uppercase tracking-wider mb-2 block transition-colors ${isComplete ? 'text-purple-700' : 'text-stone-600'}`}>
                        Pilih jawaban untuk: <span className="text-purple-600">{leftItem}</span>
                      </label>
                      <select
                        value={mappedRightIdx || ''}
                        onChange={e => setMapping(leftIdx, e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className={`w-full px-4 py-3 rounded-lg border-2 font-semibold text-sm outline-none transition-all shadow-sm focus:shadow-lg ${
                          isComplete
                            ? 'bg-gradient-to-br from-purple-300 to-purple-200 border-purple-600 text-purple-900 focus:border-purple-700 cursor-default'
                            : 'bg-white border-stone-300 text-stone-700 focus:border-purple-400 focus:bg-purple-50 focus:ring-2 focus:ring-purple-200'
                        }`}
                      >
                        <option value="">-- Pilih jawaban --</option>
                        {unpairedRight.map(rightIdx => (
                          <option key={rightIdx} value={rightIdx}>
                            {rightItems[rightIdx]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Row 3: Action Buttons (Optional) */}
                    {isComplete && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMapping(leftIdx, '')}
                          className="flex-1 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs border-2 border-red-300 transition-all hover:shadow-md"
                        >
                          🔄 Ubah Jawaban
                        </button>
                        <div className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-semibold text-xs border-2 border-green-400 text-center">
                          ✅ Terpasang Benar
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Cards */}
          {leftItems.length > 0 && (
            <div className="px-4 pb-4 border-t-2 border-purple-200 mt-2 pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-purple-600">{leftItems.length}</p>
                  <p className="text-xs font-bold text-purple-700 uppercase">Total Soal</p>
                </div>
                <div className={`border-2 rounded-lg p-3 text-center transition-all ${filledPairs === leftItems.length ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400' : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300'}`}>
                  <p className={`text-2xl font-black ${filledPairs === leftItems.length ? 'text-green-600' : 'text-blue-600'}`}>{filledPairs}</p>
                  <p className={`text-xs font-bold uppercase ${filledPairs === leftItems.length ? 'text-green-700' : 'text-blue-700'}`}>Terpasang</p>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-orange-50 border-2 border-amber-300 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-amber-600">{leftItems.length - filledPairs}</p>
                  <p className="text-xs font-bold text-amber-700 uppercase">Sisa</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4️⃣ PREVIEW */}
      {allPaired && (
        <div className="bg-white border-2 border-green-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-green-150 via-green-50 to-white border-b-2 border-green-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-bounce">✅</span>
              <div>
                <p className="text-sm font-black text-green-900 uppercase tracking-wider leading-tight">Pratinjau Pasangan</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">Semua pasangan sudah dikonfigurasi</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {leftItems.map((leftItem, leftIdx) => {
                const rightIdx = mapping[leftIdx];
                const rightItem = rightIdx !== null && rightIdx !== undefined ? rightItems[rightIdx] : '';
                return (
                  <div key={leftIdx} className="flex gap-3 items-center bg-gradient-to-br from-green-150 via-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-102 duration-300">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-green-300">
                      {leftIdx + 1}
                    </span>
                    <span className="flex-1 text-sm font-bold text-green-900">{leftItem}</span>
                    <span className="text-2xl font-bold text-green-500">↔</span>
                    <span className="flex-1 text-sm font-bold text-green-900">{rightItem}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 border-2 border-green-400 rounded-xl text-center shadow-md">
              <p className="text-lg font-black text-green-800 uppercase tracking-wider">🎉 Sempurna!</p>
              <p className="text-sm text-green-700 font-semibold mt-2">Semua {leftItems.length} pasangan sudah dikonfigurasi dengan benar</p>
            </div>
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
  const items = optState.items.filter(Boolean);
  const order = corState.order.filter(idx => items[idx] !== undefined && items[idx] !== '');
  const unordered = items.map((_, idx) => idx).filter(idx => !order.includes(idx));

  // Step calculations
  const hasItems = items.length > 0;
  const allOrdered = unordered.length === 0 && items.length > 0;
  const progress = hasItems ? Math.round((order.length / items.length) * 100) : 0;

  const updateItem = (idx, val) => {
    const next = [...optState.items];
    next[idx] = val;
    setOptState({ ...optState, items: next });
  };

  const addItem = () => setOptState({ ...optState, items: [...optState.items, ''] });
  
  const removeItem = (idx) => {
    // Remove item and shift down all indices > idx
    const next = optState.items.filter((_, i) => i !== idx);
    const newOrder = corState.order
      .filter(orderIdx => orderIdx !== idx) // Remove if this index
      .map(orderIdx => orderIdx > idx ? orderIdx - 1 : orderIdx); // Shift down indices > removed
    setOptState({ ...optState, items: next });
    setCorState({ ...corState, order: newOrder });
  };

  const addToOrder = (idx) => {
    if (!order.includes(idx)) {
      setCorState({ ...corState, order: [...order, idx] });
    }
  };

  const removeFromOrder = (orderIdx) => {
    setCorState({ ...corState, order: order.filter((_, i) => i !== orderIdx) });
  };

  const moveUp = (orderIdx) => {
    if (orderIdx === 0) return;
    const next = [...order];
    [next[orderIdx - 1], next[orderIdx]] = [next[orderIdx], next[orderIdx - 1]];
    setCorState({ ...corState, order: next });
  };

  const moveDown = (orderIdx) => {
    if (orderIdx === order.length - 1) return;
    const next = [...order];
    [next[orderIdx], next[orderIdx + 1]] = [next[orderIdx + 1], next[orderIdx]];
    setCorState({ ...corState, order: next });
  };

  const addAllQuickly = () => {
    const allIndices = items.map((_, idx) => idx);
    setCorState({ ...corState, order: allIndices });
  };

  return (
    <div className="space-y-5">
      {/* PROGRESS BAR */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-black text-amber-800">📊 Progres Urutan</span>
          <span className="text-lg font-black text-amber-700">{progress}%</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-3 border border-amber-300 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* STEP 1️⃣ ADD ITEMS */}
      <div className="bg-white border-2 border-blue-300 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-b-2 border-blue-200">
          <span className="text-sm font-black text-blue-900 uppercase tracking-widest">
            1️⃣ Tambah Item/Langkah
          </span>
          <p className="text-xs text-blue-600 mt-1">Daftarkan semua item yang perlu diurutkan</p>
        </div>
        <div className="p-4 space-y-2">
          {optState.items.map((it, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <span className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <input
                value={it}
                onChange={e => updateItem(idx, e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border-2 border-blue-200 font-semibold text-sm focus:border-blue-500 focus:bg-blue-50 outline-none transition-all"
                placeholder="Ketik langkah..."
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="px-2 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 text-lg font-bold border border-red-200 transition-all hover:scale-110"
                title="Hapus item"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full mt-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 text-blue-700 font-bold text-sm hover:shadow-md transition-all hover:border-blue-400"
          >
            ➕ Tambah Item
          </button>
        </div>
      </div>

      {/* STEP 2️⃣ ORDER ITEMS */}
      {hasItems && (
        <div className="bg-white border-2 border-purple-300 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-50 border-b-2 border-purple-200 flex justify-between items-center">
            <div>
              <span className="text-sm font-black text-purple-900 uppercase tracking-widest">
                2️⃣ Atur Urutan Benar
              </span>
              <p className="text-xs text-purple-600 mt-1">Susun item sesuai urutan yang benar</p>
            </div>
            {unordered.length > 0 && (
              <button
                type="button"
                onClick={addAllQuickly}
                className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-black transition-all"
                title="Tambahkan semua sekaligus"
              >
                ⚡ Semua
              </button>
            )}
          </div>
          <div className="p-4 space-y-3">
            {/* Ordered Items */}
            <div className="space-y-2">
              {order.length > 0 && <p className="text-xs font-black text-stone-500 uppercase px-1">✓ Sudah Diurutkan</p>}
              {order.map((itemIdx, orderIdx) => (
                <div key={orderIdx} className="flex gap-2 items-center bg-gradient-to-r from-purple-50 to-purple-25 border-2 border-purple-200 rounded-lg p-3 hover:shadow-md transition-all">
                  <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {orderIdx + 1}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-stone-700">{items[itemIdx]}</span>
                  <button
                    type="button"
                    onClick={() => moveUp(orderIdx)}
                    disabled={orderIdx === 0}
                    className="px-2 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold disabled:opacity-30 transition-all"
                    title="Naik"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(orderIdx)}
                    disabled={orderIdx === order.length - 1}
                    className="px-2 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold disabled:opacity-30 transition-all"
                    title="Turun"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromOrder(orderIdx)}
                    className="px-2 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-all"
                    title="Hapus dari urutan"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Unordered Items */}
            {unordered.length > 0 && (
              <div className="pt-3 border-t-2 border-stone-200">
                <p className="text-xs font-black text-stone-500 uppercase px-1 mb-2">⏳ Belum Diurutkan</p>
                <div className="flex flex-wrap gap-2">
                  {unordered.map(itemIdx => (
                    <button
                      key={itemIdx}
                      type="button"
                      onClick={() => addToOrder(itemIdx)}
                      className="px-3 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold border border-purple-300 transition-all hover:shadow-md"
                    >
                      ➕ {items[itemIdx]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3️⃣ PREVIEW */}
      {allOrdered && (
        <div className="bg-white border-2 border-green-300 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gradient-to-r from-green-100 to-green-50 border-b-2 border-green-200">
            <span className="text-sm font-black text-green-900 uppercase tracking-widest">
              3️⃣ Pratinjau Urutan Benar
            </span>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {order.map((itemIdx, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                  <span className="w-7 h-7 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-green-900">{items[itemIdx]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-center text-green-700 font-semibold">
              ✅ Semua item sudah diurutkan dengan benar!
            </div>
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
  const hasItems = items.length > 0;
  const hasCorrect = corState.selected && corState.selected !== '';
  const completeness = hasItems && hasCorrect ? 100 : (hasItems ? 50 : 0);
  const emptyOptions = items.filter(it => !it || it.trim() === '').length;
  const filledOptions = items.filter(it => it && it.trim() !== '').length;

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
    if (val && val.trim() !== '') {
      setCorState({ ...corState, selected: val });
    }
  };

  return (
    <div className="space-y-4">
      {/* STEP 1️⃣ ADD OPTIONS */}
      <div className="bg-white border-2 border-blue-300 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="px-4 py-4 bg-gradient-to-br from-blue-150 via-blue-50 to-white border-b-2 border-blue-200">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-3xl">❓</span>
            <div>
              <p className="text-sm font-black text-blue-900 uppercase tracking-wider leading-tight">Tambah Opsi Jawaban</p>
              <p className="text-xs text-blue-600 font-medium mt-0.5">Buat pilihan jawaban untuk soal</p>
            </div>
          </div>
          {/* Progress Info */}
          {hasItems && (
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-blue-200 text-blue-900 px-3 py-1.5 rounded-full">
                <span className="text-lg">📝</span>
                <span>Opsi: {filledOptions}</span>
              </div>
              {emptyOptions > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full">
                  <span className="text-lg">⏳</span>
                  <span>Kosong: {emptyOptions}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Options List */}
        {!hasItems ? (
          <div className="px-4 py-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-stone-500 font-medium mb-4">Belum ada opsi jawaban</p>
            <button
              type="button"
              onClick={addItem}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              + Tambah Opsi Pertama
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-2.5">
            {items.map((it, idx) => {
              const isFilled = it && it.trim() !== '';
              const isCorrect = corState.selected === it && isFilled;

              return (
                <div
                  key={idx}
                  className={`border-2 rounded-xl p-3 transition-all ${
                    isCorrect
                      ? 'bg-gradient-to-r from-blue-150 to-blue-100 border-blue-400 shadow-md'
                      : isFilled
                      ? 'bg-gradient-to-r from-stone-100 to-white border-stone-300 hover:border-blue-300 hover:shadow-sm'
                      : 'bg-gradient-to-r from-red-100 to-red-50 border-red-300'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    {/* Option Number Badge */}
                    <span
                      className={`w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm transition-all ${
                        isCorrect
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-400'
                          : isFilled
                          ? 'bg-gradient-to-br from-stone-400 to-stone-500'
                          : 'bg-gradient-to-br from-red-400 to-red-500'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Input Field */}
                    <input
                      value={it}
                      onChange={e => updateItem(idx, e.target.value)}
                      placeholder="Masukkan teks pilihan jawaban..."
                      className={`flex-1 px-3 py-2.5 rounded-lg border-2 font-semibold text-sm outline-none transition-all ${
                        isCorrect
                          ? 'border-blue-500 bg-blue-50 text-blue-900 focus:border-blue-600 focus:shadow-lg'
                          : isFilled
                          ? 'border-stone-300 text-stone-700 focus:border-blue-400 focus:bg-blue-50 focus:shadow-md'
                          : 'border-red-300 text-red-700 focus:border-red-500 focus:bg-red-50 focus:shadow-md'
                      }`}
                    />

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="px-2.5 py-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-bold text-sm border-2 border-red-300 transition-all hover:shadow-md active:scale-95"
                      title="Hapus opsi ini"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Button */}
        {hasItems && (
          <div className="px-4 pb-4 border-t-2 border-blue-200 pt-3">
            <button
              type="button"
              onClick={addItem}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              + Tambah Opsi
            </button>
          </div>
        )}
      </div>

      {/* STEP 2️⃣ SELECT CORRECT ANSWER */}
      {filledOptions >= 2 && (
        <div className="bg-white border-2 border-emerald-300 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-emerald-150 via-emerald-50 to-white border-b-2 border-emerald-200">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-3xl">✓</span>
              <div>
                <p className="text-sm font-black text-emerald-900 uppercase tracking-wider leading-tight">Pilih Jawaban Benar</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">Tentukan mana opsi yang merupakan jawaban yang benar</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2.5">
            {items.map((it, idx) => {
              if (!it || it.trim() === '') return null;
              const isCorrect = corState.selected === it;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCorrect(it)}
                  className={`w-full text-left border-2 rounded-xl p-4 transition-all transform duration-300 ${
                    isCorrect
                      ? 'bg-gradient-to-br from-emerald-150 to-emerald-100 border-emerald-500 shadow-lg hover:shadow-xl hover:scale-102'
                      : 'bg-gradient-to-br from-stone-100 to-white border-stone-300 hover:border-emerald-300 hover:shadow-md hover:scale-101'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    {/* Radio Button */}
                    <div
                      className={`w-8 h-8 rounded-full border-3 flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
                        isCorrect
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-600 ring-2 ring-emerald-300'
                          : 'border-stone-400 hover:border-emerald-400'
                      }`}
                    >
                      {isCorrect && <span className="text-white font-bold text-lg">✓</span>}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1">
                      <p
                        className={`font-bold text-sm break-words transition-colors duration-200 ${
                          isCorrect ? 'text-emerald-900' : 'text-stone-700'
                        }`}
                      >
                        {it}
                      </p>
                    </div>

                    {/* Status Badge */}
                    {isCorrect && (
                      <div className="flex-shrink-0 px-3 py-1.5 bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold animate-bounce ring-2 ring-emerald-300">
                        Benar ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selection Status */}
          {hasCorrect && (
            <div className="px-4 pb-4 border-t-2 border-emerald-200 pt-4">
              <div className="bg-gradient-to-r from-emerald-150 to-green-150 border-2 border-emerald-400 rounded-xl p-4 text-center">
                <p className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-1">
                  ✅ Jawaban Benar Dipilih
                </p>
                <p className="text-xs text-emerald-700 font-semibold">
                  "{corState.selected}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3️⃣ PREVIEW (when complete) */}
      {hasItems && filledOptions >= 2 && hasCorrect && (
        <div className="bg-white border-2 border-green-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-green-150 via-green-50 to-white border-b-2 border-green-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-bounce">👁️</span>
              <div>
                <p className="text-sm font-black text-green-900 uppercase tracking-wider leading-tight">Preview Soal</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">Cara siswa akan melihat soal ini</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-3 text-center">
                <p className="text-2xl font-black text-blue-600">{items.length}</p>
                <p className="text-xs font-bold text-blue-700 uppercase mt-1">Total Opsi</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-400 rounded-lg p-3 text-center">
                <p className="text-2xl font-black text-green-600">✓</p>
                <p className="text-xs font-bold text-green-700 uppercase mt-1">Lengkap</p>
              </div>
            </div>

            {/* Preview of Options */}
            <div className="space-y-2">
              <p className="text-xs font-black text-stone-700 uppercase tracking-wider">Pilihan yang Ditampilkan:</p>
              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-3 transition-all ${
                      it === corState.selected
                        ? 'bg-gradient-to-r from-green-200 to-emerald-150 border-green-500 ring-2 ring-green-400 ring-opacity-50'
                        : 'bg-stone-100 border-stone-300'
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <span className={`text-sm font-black ${it === corState.selected ? 'text-green-700' : 'text-stone-600'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className={`font-semibold text-sm ${it === corState.selected ? 'text-green-900' : 'text-stone-700'}`}>
                        {it}
                      </span>
                      {it === corState.selected && <span className="ml-auto text-lg animate-bounce">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-150 via-emerald-100 to-green-100 border-2 border-green-400 rounded-xl p-4 text-center">
              <p className="text-sm font-black text-green-900 uppercase tracking-wider">
                ✅ Soal Siap Disimpan
              </p>
              <p className="text-xs text-green-700 font-medium mt-2">
                Semua opsi sudah lengkap dan jawaban benar sudah ditentukan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TRUE/FALSE FIELDS
// ════════════════════════════════════════════════════════════════════════════
function TrueFalseFields({ optState, setOptState, corState, setCorState }) {
  const options = [
    { label: 'BENAR ✓', value: 'BENAR', emoji: '✅', color: 'green', description: 'Pernyataan tersebut benar' },
    { label: 'SALAH ✗', value: 'SALAH', emoji: '❌', color: 'red', description: 'Pernyataan tersebut salah' }
  ];

  const hasSelected = corState.selected && corState.selected !== '';

  return (
    <div className="space-y-4">
      {/* STEP 1️⃣ SELECT ANSWER */}
      <div className="bg-white border-2 border-cyan-300 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="px-4 py-4 bg-gradient-to-br from-cyan-150 via-cyan-50 to-white border-b-2 border-cyan-200">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-sm font-black text-cyan-900 uppercase tracking-wider leading-tight">Pilih Jawaban Benar</p>
              <p className="text-xs text-cyan-600 font-medium mt-0.5">Tentukan apakah pernyataan BENAR atau SALAH</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {options.map((opt, idx) => {
            const isCorrect = corState.selected === opt.value;
            const bgColor = opt.color === 'green' ? 'from-green-150 to-green-100 border-green-500' : 'from-red-150 to-red-100 border-red-500';
            const hoverColor = opt.color === 'green' ? 'hover:border-green-300 hover:shadow-md' : 'hover:border-red-300 hover:shadow-md';
            const textColor = opt.color === 'green' ? 'text-green-900' : 'text-red-900';
            const badgeColor = opt.color === 'green' ? 'from-green-600 to-green-700 ring-green-300' : 'from-red-600 to-red-700 ring-red-300';

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCorState({ ...corState, selected: opt.value })}
                className={`w-full text-left border-2 rounded-xl p-5 transition-all transform duration-300 ${
                  isCorrect
                    ? `bg-gradient-to-br ${bgColor} shadow-lg hover:shadow-xl hover:scale-102`
                    : `bg-gradient-to-br from-stone-100 to-white border-stone-300 ${hoverColor} hover:scale-101`
                }`}
              >
                <div className="flex gap-4 items-center">
                  {/* Radio Button */}
                  <div
                    className={`w-10 h-10 rounded-full border-3 flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
                      isCorrect
                        ? `bg-gradient-to-br ${badgeColor} border-${opt.color}-700 ring-2`
                        : `border-stone-400 hover:border-${opt.color === 'green' ? 'green' : 'red'}-400`
                    }`}
                  >
                    {isCorrect && <span className="text-xl text-white font-bold">✓</span>}
                  </div>

                  {/* Option Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className={`font-black text-lg transition-colors duration-200 ${isCorrect ? textColor : 'text-stone-700'}`}>
                          {opt.label}
                        </p>
                        <p className={`text-xs font-medium mt-0.5 transition-colors ${isCorrect ? textColor : 'text-stone-500'}`}>
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selection Badge */}
                  {isCorrect && (
                    <div className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                      opt.color === 'green'
                        ? 'bg-green-200 text-green-800 ring-2 ring-green-400 ring-opacity-50'
                        : 'bg-red-200 text-red-800 ring-2 ring-red-400 ring-opacity-50'
                    } animate-bounce`}>
                      Dipilih
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selection Confirmation */}
        {hasSelected && (
          <div className="px-4 pb-4 border-t-2 border-cyan-200 pt-4">
            <div className={`border-2 rounded-xl p-4 text-center transition-all ${
              corState.selected === 'BENAR'
                ? 'bg-gradient-to-r from-green-150 to-emerald-100 border-green-400'
                : 'bg-gradient-to-r from-red-150 to-rose-100 border-red-400'
            }`}>
              <p className={`text-sm font-black uppercase tracking-wider ${
                corState.selected === 'BENAR' ? 'text-green-900' : 'text-red-900'
              }`}>
                {corState.selected === 'BENAR' ? '✅ Jawaban: BENAR' : '❌ Jawaban: SALAH'}
              </p>
              <p className={`text-xs font-medium mt-1.5 ${
                corState.selected === 'BENAR' ? 'text-green-700' : 'text-red-700'
              }`}>
                Pernyataan dipilih sebagai {corState.selected}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* STEP 2️⃣ PREVIEW */}
      {hasSelected && (
        <div className="bg-white border-2 border-green-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-green-150 via-green-50 to-white border-b-2 border-green-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-bounce">👁️</span>
              <div>
                <p className="text-sm font-black text-green-900 uppercase tracking-wider leading-tight">Preview Soal</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">Cara siswa akan melihat soal ini</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 border-2 border-cyan-300 rounded-lg p-3 text-center">
                <p className="text-2xl font-black text-cyan-600">2</p>
                <p className="text-xs font-bold text-cyan-700 uppercase mt-1">Pilihan</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-400 rounded-lg p-3 text-center">
                <p className="text-2xl font-black text-green-600">✓</p>
                <p className="text-xs font-bold text-green-700 uppercase mt-1">Lengkap</p>
              </div>
            </div>

            {/* Preview Options */}
            <div className="space-y-2">
              <p className="text-xs font-black text-stone-700 uppercase tracking-wider">Pilihan yang Ditampilkan:</p>
              <div className="space-y-2">
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      opt.value === corState.selected
                        ? opt.value === 'BENAR'
                          ? 'bg-gradient-to-r from-green-200 to-emerald-150 border-green-500 ring-2 ring-green-400 ring-opacity-50'
                          : 'bg-gradient-to-r from-red-200 to-rose-150 border-red-500 ring-2 ring-red-400 ring-opacity-50'
                        : 'bg-stone-100 border-stone-300'
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`text-xl font-black ${
                        opt.value === corState.selected
                          ? opt.value === 'BENAR'
                            ? 'text-green-700'
                            : 'text-red-700'
                          : 'text-stone-600'
                      }`}>
                        {opt.emoji}
                      </span>
                      <span className={`font-semibold text-sm ${
                        opt.value === corState.selected
                          ? opt.value === 'BENAR'
                            ? 'text-green-900'
                            : 'text-red-900'
                          : 'text-stone-700'
                      }`}>
                        {opt.label}
                      </span>
                      {opt.value === corState.selected && (
                        <span className="ml-auto text-lg animate-bounce">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Message */}
            <div className={`border-2 rounded-xl p-4 text-center ${
              corState.selected === 'BENAR'
                ? 'bg-gradient-to-r from-green-150 via-emerald-100 to-green-100 border-green-400'
                : 'bg-gradient-to-r from-red-150 via-rose-100 to-red-100 border-red-400'
            }`}>
              <p className={`text-sm font-black uppercase tracking-wider ${
                corState.selected === 'BENAR' ? 'text-green-900' : 'text-red-900'
              }`}>
                ✅ Soal Siap Disimpan
              </p>
              <p className={`text-xs font-medium mt-2 ${
                corState.selected === 'BENAR' ? 'text-green-700' : 'text-red-700'
              }`}>
                Jawaban yang benar adalah: <span className="font-black">{corState.selected}</span>
              </p>
            </div>
          </div>
        </div>
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
      {type === 'TRUE_FALSE'      && <TrueFalseFields       optState={optState} setOptState={setOptState} corState={corState} setCorState={setCorState} />}
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

  const hasIntro = storyState.intro && storyState.intro.length > 0;
  const hasOutro = storyState.outro && storyState.outro.length > 0;
  const hasScene = storyState.scene && storyState.scene.trim() !== '';
  const hasChapter = storyState.chapter && storyState.chapter.trim() !== '';
  const isComplete = hasScene && hasChapter && hasIntro && hasOutro;

  const renderDialogList = (phase, emoji, title, description) => (
    <div className="bg-white border-2 border-orange-300 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="px-4 py-4 bg-gradient-to-br from-orange-150 via-orange-50 to-white border-b-2 border-orange-200">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <p className="text-sm font-black text-orange-900 uppercase tracking-wider leading-tight">{title}</p>
            <p className="text-xs text-orange-600 font-medium mt-0.5">{description}</p>
          </div>
        </div>
        {/* Status Summary */}
        <div className="flex gap-2 text-xs font-bold">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            storyState[phase].filter(d => d.text && d.text.trim()).length > 0
              ? 'bg-orange-200 text-orange-900'
              : 'bg-stone-200 text-stone-900'
          }`}>
            <span className="text-lg">💬</span>
            <span>Dialog: {storyState[phase].filter(d => d.text && d.text.trim()).length}</span>
          </div>
        </div>
      </div>

      {/* Dialog List */}
      <div className="p-4 space-y-3">
        {storyState[phase].length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-stone-500 font-medium">Belum ada dialog</p>
            <button
              type="button"
              onClick={() => addDialog(phase)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              + Tambah Dialog Pertama
            </button>
          </div>
        ) : (
          <>
            {storyState[phase].map((d, idx) => {
              const isFilled = d.speaker && d.text && d.text.trim() !== '';
              return (
                <div
                  key={idx}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isFilled
                      ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-400 shadow-md'
                      : 'bg-gradient-to-r from-stone-100 to-white border-stone-300 hover:border-orange-300 hover:shadow-sm'
                  }`}
                >
                  {/* Character + Mood + Delete */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <CharacterPicker
                      value={d.npcName || ''}
                      onChange={(npc) => pickCharacter(phase, idx, npc)}
                    />
                    <input
                      value={d.speaker}
                      onChange={e => updateDialog(phase, idx, 'speaker', e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 font-bold text-xs outline-none transition-all ${
                        isFilled
                          ? 'border-orange-400 bg-orange-50 focus:border-orange-500'
                          : 'border-stone-300 focus:border-orange-400 focus:bg-orange-50'
                      }`}
                      placeholder="Nama speaker"
                    />
                    <select
                      value={d.mood}
                      onChange={e => updateDialog(phase, idx, 'mood', e.target.value)}
                      className={`px-3 py-2 rounded-lg border-2 text-xs outline-none transition-all ${
                        isFilled
                          ? 'border-orange-400 bg-orange-50 focus:border-orange-500'
                          : 'border-stone-300 focus:border-orange-400 focus:bg-orange-50'
                      }`}
                    >
                      <option value="normal">😐 Normal</option>
                      <option value="happy">😄 Happy</option>
                      <option value="sad">😢 Sad</option>
                      <option value="thinking">🤔 Thinking</option>
                      <option value="confident">😎 Confident</option>
                      <option value="panic">😱 Panic</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeDialog(phase, idx)}
                      className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-bold text-sm border-2 border-red-300 transition-all hover:shadow-md active:scale-95"
                      title="Hapus dialog"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dialog Text */}
                  <textarea
                    value={d.text}
                    onChange={e => updateDialog(phase, idx, 'text', e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border-2 text-sm outline-none transition-all resize-none ${
                      isFilled
                        ? 'border-orange-400 bg-white focus:border-orange-500 focus:shadow-lg'
                        : 'border-stone-300 focus:border-orange-400 focus:bg-white focus:shadow-md'
                    }`}
                    placeholder="Isi percakapan karakter..."
                    rows="3"
                  />

                  {/* Status Indicator */}
                  {isFilled && (
                    <div className="mt-2 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-200 text-orange-800 rounded-full text-xs font-bold">
                        <span className="animate-bounce">✓</span>
                        Dialog Lengkap
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Button */}
            <button
              type="button"
              onClick={() => addDialog(phase)}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              + Tambah Dialog
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* STEP 1️⃣ SCENE & CHAPTER */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="px-4 py-4 bg-gradient-to-br from-amber-150 via-amber-50 to-white border-b-2 border-amber-200">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-3xl">🎬</span>
            <div>
              <p className="text-sm font-black text-amber-900 uppercase tracking-wider leading-tight">Latar & Judul Chapter</p>
              <p className="text-xs text-amber-600 font-medium mt-0.5">Pilih latar tempat dan beri judul untuk cerita ini</p>
            </div>
          </div>
          {/* Progress Info */}
          <div className="flex gap-2 text-xs font-bold">
            {hasScene && (
              <div className="flex items-center gap-1.5 bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full">
                <span className="text-lg">✓</span>
                <span>Scene Dipilih</span>
              </div>
            )}
            {hasChapter && (
              <div className="flex items-center gap-1.5 bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full">
                <span className="text-lg">✓</span>
                <span>Judul Diisi</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-2.5">Latar Tempat (Scene)</label>
            <ScenePicker value={storyState.scene} onChange={(val) => updateField('scene', val)} />
          </div>
          <div>
            <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-2.5">Judul Chapter</label>
            <input
              value={storyState.chapter}
              onChange={e => updateField('chapter', e.target.value)}
              className={inp + ' border-2 focus:border-amber-400 focus:bg-amber-50'}
              placeholder="misal: Level 1: Bahan Baku Sistem"
            />
          </div>
        </div>

        {/* Status */}
        {hasScene && hasChapter && (
          <div className="px-4 pb-4 border-t-2 border-amber-200 pt-4">
            <div className="bg-gradient-to-r from-amber-150 to-orange-100 border-2 border-amber-400 rounded-xl p-3 text-center">
              <p className="text-xs font-black text-amber-900 uppercase tracking-wider">✅ Latar & Judul Lengkap</p>
            </div>
          </div>
        )}
      </div>

      {/* STEP 2️⃣ INTRO DIALOGS */}
      {hasScene && hasChapter && renderDialogList('intro', '💬', 'Percakapan Awal (Intro)', 'Dialog yang muncul di awal cerita')}

      {/* STEP 3️⃣ OUTRO DIALOGS */}
      {hasIntro && renderDialogList('outro', '🏁', 'Percakapan Akhir (Outro)', 'Dialog yang muncul di akhir cerita')}

      {/* STEP 4️⃣ PREVIEW */}
      {isComplete && (
        <div className="bg-white border-2 border-green-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-4 bg-gradient-to-br from-green-150 via-green-50 to-white border-b-2 border-green-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-bounce">👁️</span>
              <div>
                <p className="text-sm font-black text-green-900 uppercase tracking-wider leading-tight">Preview Cerita</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">Cara siswa akan melihat cerita ini</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-amber-600">🎬</p>
                <p className="text-xs font-bold text-amber-700 uppercase mt-1">Scene</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-blue-600">{storyState.intro.length}</p>
                <p className="text-xs font-bold text-blue-700 uppercase mt-1">Intro</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-purple-600">{storyState.outro.length}</p>
                <p className="text-xs font-bold text-purple-700 uppercase mt-1">Outro</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-50 border-2 border-green-400 rounded-lg p-3 text-center">
                <p className="text-lg font-black text-green-600">✓</p>
                <p className="text-xs font-bold text-green-700 uppercase mt-1">Lengkap</p>
              </div>
            </div>

            {/* Story Summary */}
            <div className="bg-gradient-to-br from-orange-100 to-amber-50 border-2 border-orange-400 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs font-black text-orange-900 uppercase tracking-wider mb-1">Chapter</p>
                <p className="text-sm font-bold text-orange-900">{storyState.chapter}</p>
              </div>
              <div>
                <p className="text-xs font-black text-orange-900 uppercase tracking-wider mb-1">Latar Tempat</p>
                <p className="text-sm font-bold text-orange-900">
                  {SCENE_LIST.find(s => s.id === storyState.scene)?.label || storyState.scene}
                </p>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-150 via-emerald-100 to-green-100 border-2 border-green-400 rounded-xl p-4 text-center">
              <p className="text-sm font-black text-green-900 uppercase tracking-wider">
                ✅ Cerita Siap Disimpan
              </p>
              <p className="text-xs text-green-700 font-medium mt-2">
                Cerita dengan {storyState.intro.length} dialog intro dan {storyState.outro.length} dialog outro siap ditampilkan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

