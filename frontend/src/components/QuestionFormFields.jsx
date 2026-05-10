import React from 'react';

// ─── HELPER: build JSON strings from structured form state ───────────────────

export function buildOptionsJSON(type, optState) {
  try {
    if (type === 'MATCHING') {
      return JSON.stringify({ left: optState.left.filter(Boolean), right: optState.right.filter(Boolean) });
    }
    // CLASSIFICATION, SEQUENCE, MULTIPLE_CHOICE, TRUE_FALSE
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
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
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
  const items = optState.items.filter(Boolean);
  const allItems = optState.items;

  const updateItem = (idx, val) => {
    const oldVal = allItems[idx];
    const next = [...allItems];
    next[idx] = val;
    setOptState({ ...optState, items: next });
    
    if (oldVal !== val && oldVal) {
      const map = { ...corState.mapping };
      if (map[oldVal] !== undefined) {
        map[val] = map[oldVal];
        delete map[oldVal];
      }
      setCorState({ ...corState, mapping: map });
    }
  };

  const addItem = () => setOptState({ ...optState, items: [...allItems, ''] });
  const removeItem = (idx) => {
    const removed = allItems[idx];
    const next = allItems.filter((_, i) => i !== idx);
    const map = { ...corState.mapping };
    delete map[removed];
    setOptState({ ...optState, items: next });
    setCorState({ ...corState, mapping: map });
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
      .map(([item, _]) => item);
  };

  return (
    <div className="space-y-4">
      {/* ITEMS INPUT SECTION */}
      <div className="bg-white border border-violet-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-violet-50 border-b border-violet-100 flex justify-between items-center">
          <div>
            <span className="text-xs font-black text-violet-700 uppercase tracking-widest">Item yang Dikelompokkan</span>
            <p className="text-xs text-violet-500 mt-0.5">Daftar item yang akan siswa kelompokkan</p>
          </div>
          <button type="button" onClick={addItem} className={smBtn('violet')}>+ Tambah Item</button>
        </div>
        <div className="divide-y divide-stone-100">
          {allItems.map((it, idx) => (
            <div key={idx} className="flex gap-2 items-center px-4 py-3 hover:bg-violet-50 transition-colors">
              <span className="text-xs font-bold text-stone-400 w-5">{idx + 1}.</span>
              <input 
                value={it} 
                onChange={e => updateItem(idx, e.target.value)}
                className={inp + ' flex-1'} 
                placeholder="Contoh: Keyboard, Monitor, Printer..." />
              <button type="button" onClick={() => removeItem(idx)}
                className="px-2 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold border border-red-100 transition-all">✕</button>
            </div>
          ))}
          {allItems.length === 0 && (
            <div className="px-4 py-6 text-center text-stone-400 text-xs italic">Belum ada item. Klik "Tambah Item" untuk mulai.</div>
          )}
        </div>
      </div>

      {/* CATEGORY ASSIGNMENT SECTION */}
      {items.length > 0 && (
        <div className="bg-white border border-violet-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-violet-50 border-b border-violet-100">
            <div>
              <span className="text-xs font-black text-violet-700 uppercase tracking-widest">Kategori Tiap Item</span>
              <p className="text-xs text-violet-500 mt-0.5">Tentukan kategori untuk setiap item (contoh: INPUT, OUTPUT, INTERNAL)</p>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {items.map((it, pidx) => (
              <div key={it || pidx} className="flex gap-3 items-center px-4 py-3 hover:bg-violet-50 transition-colors">
                <span className="text-xs font-bold text-stone-400 w-5">{pidx + 1}.</span>
                <span className="flex-shrink-0 w-32 text-sm font-bold text-stone-700 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">{it}</span>
                <span className="text-stone-300 font-bold">→</span>
                <input
                  value={corState.mapping[it] || ''}
                  onChange={e => setCorState({ ...corState, mapping: { ...corState.mapping, [it]: e.target.value } })}
                  className={inp + ' flex-1'}
                  placeholder="Ketik nama kategori..." />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY SUMMARY SECTION */}
      {items.length > 0 && getCategories().length > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl overflow-hidden p-4">
          <div className="text-xs font-black text-violet-700 uppercase tracking-widest mb-3">📊 Ringkasan Kategori</div>
          <div className="space-y-2">
            {getCategories().map(cat => (
              <div key={cat} className="flex gap-2 items-start">
                <span className="inline-block px-2 py-1 bg-violet-500 text-white text-xs font-black rounded-full min-w-max">{cat}</span>
                <div className="flex flex-wrap gap-1 flex-1">
                  {getItemsByCategory(cat).map(item => (
                    <span key={item} className="inline-block px-2 py-1 bg-white text-stone-700 text-xs font-bold rounded border border-stone-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VALIDATION MESSAGE */}
      {items.length > 0 && Object.values(corState.mapping).filter(Boolean).length < items.length && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-bold">
          ⚠️ {items.length - Object.values(corState.mapping).filter(Boolean).length} item masih belum memiliki kategori
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
      if (oldVal && map[oldVal] !== undefined) {
        map[val] = map[oldVal];
        delete map[oldVal];
      }
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
      setOptState({ ...optState, right: right.filter((_, i) => i !== idx) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <span className="text-xs font-black text-blue-700 uppercase">Kolom Kiri</span>
            <button type="button" onClick={() => addSide('left')} className={smBtn('blue')}>+</button>
          </div>
          {left.map((it, idx) => (
            <div key={idx} className="flex gap-1 items-center px-3 py-2 border-b border-stone-50">
              <input value={it} onChange={e => updateSide('left', idx, e.target.value)}
                className="flex-1 px-2 py-2 rounded border border-stone-200 text-xs outline-none focus:border-blue-400"
                placeholder="Item kiri..." />
              <button type="button" onClick={() => removeSide('left', idx)}
                className="text-red-400 hover:text-red-600 font-bold text-xs px-1">✕</button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-sky-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex justify-between items-center">
            <span className="text-xs font-black text-sky-700 uppercase">Kolom Kanan</span>
            <button type="button" onClick={() => addSide('right')} className={smBtn('sky')}>+</button>
          </div>
          {right.map((it, idx) => (
            <div key={idx} className="flex gap-1 items-center px-3 py-2 border-b border-stone-50">
              <input value={it} onChange={e => updateSide('right', idx, e.target.value)}
                className="flex-1 px-2 py-2 rounded border border-stone-200 text-xs outline-none focus:border-sky-400"
                placeholder="Item kanan..." />
              <button type="button" onClick={() => removeSide('right', idx)}
                className="text-red-400 hover:text-red-600 font-bold text-xs px-1">✕</button>
            </div>
          ))}
        </div>
      </div>

      {left.filter(Boolean).length > 0 && right.filter(Boolean).length > 0 && (
        <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Pasangan Benar</span>
          </div>
          <div className="divide-y divide-stone-100">
            {left.filter(Boolean).map((lt, idx) => (
              <div key={idx} className="flex gap-3 items-center px-4 py-3">
                <span className="w-1/2 text-sm font-bold text-stone-600 truncate">{lt}</span>
                <span className="text-stone-300 font-bold">↔</span>
                <select
                  value={corState.mapping[lt] || ''}
                  onChange={e => setCorState({ ...corState, mapping: { ...corState.mapping, [lt]: e.target.value } })}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:border-blue-400 outline-none">
                  <option value="">-- pilih pasangan --</option>
                  {right.filter(Boolean).map((rt, ridx) => (
                    <option key={ridx} value={rt}>{rt}</option>
                  ))}
                </select>
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
// TRUE/FALSE FIELDS
// ════════════════════════════════════════════════════════════════════════════
function TrueFalseFields({ optState, setOptState, corState, setCorState }) {
  const options = [
    { label: 'BENAR ✓', value: 'BENAR' },
    { label: 'SALAH ✗', value: 'SALAH' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-teal-50 border-b border-teal-100">
          <span className="text-xs font-black text-teal-700 uppercase tracking-widest">Pilih Jawaban Benar</span>
          <p className="text-xs text-teal-500 mt-1">Tentukan apakah pernyataan adalah BENAR atau SALAH</p>
        </div>
        <div className="divide-y divide-stone-100">
          {options.map((opt, idx) => {
            const isCorrect = corState.selected === opt.value;
            return (
              <div key={idx} className={`flex gap-3 items-center px-4 py-3 transition-colors ${isCorrect ? 'bg-teal-50' : ''}`}>
                <button
                  type="button"
                  onClick={() => setCorState({ ...corState, selected: opt.value })}
                  title="Tandai sebagai jawaban benar"
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all flex-shrink-0 ${
                    isCorrect ? 'bg-teal-500 border-teal-500 text-white' : 'border-stone-300 text-stone-300 hover:border-teal-400'
                  }`}>
                  ✓
                </button>
                <span className="text-sm font-bold text-stone-700">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
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

