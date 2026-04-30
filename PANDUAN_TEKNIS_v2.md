# 👨‍💻 PANDUAN TEKNIS - PERUBAHAN UI UNTUK DEVELOPER

**Versi**: 2.0  
**File**: `frontend/src/pages/DashboardGuru.jsx`  
**Ukuran**: ~950 lines (improved dari 900 lines)  
**Status**: ✅ Production Ready

---

## 🎯 Ringkasan Perubahan

### Sebelum (v1.0)
- ❌ Form besar dengan banyak JSON textarea
- ❌ Tidak ada validasi per-step
- ❌ User bingung dengan JSON format
- ❌ Error message teknis

### Sesudah (v2.0)
- ✅ Wizard 5-step dengan progress bar
- ✅ Validasi per-step sebelum lanjut
- ✅ UI form builder tanpa JSON
- ✅ Error message user-friendly Bahasa Indonesia
- ✅ Visual novel editor dengan character+dialog fields
- ✅ Question preview sebelum submit
- ✅ Much better UX for non-technical users

---

## 📁 Struktur State Baru

### Create Form State (Wizard)
```javascript
const [createForm, setCreateForm] = useState({
  level_number: '',           // String: '1'-'5'
  type: 'MULTIPLE_CHOICE',   // String: question type
  question_text: '',          // String: pertanyaan
  explanation: '',            // String: pesan sukses
  bloom_level: 'UNDERSTAND', // String: cognitive level
  topic: 'GENERAL',          // String: subject
  options: [                  // Array of objects (UI format)
    { id: '1', label: '' },   // id untuk identify, label adalah text
    { id: '2', label: '' }
  ],
  correct_answers: ['1'],     // Array: IDs of correct answers
  story_characters: [         // Array of objects (UI format)
    { 
      character: 'Tutor', 
      dialogs: ['']            // Array of dialog strings
    }
  ],
  showStory: false            // Boolean: apakah perlu cerita
});
```

**Perubahan dari v1.0:**
- Bukan menyimpan JSON string, tapi object terstruktur
- `options` bukan JSON, tapi array of {id, label}
- `correct_answers` bukan JSON, tapi array of IDs
- `story_characters` bukan JSON, tapi array of {character, dialogs}
- `showStory` boolean untuk toggle cerita

### Edit Form State
```javascript
const [editForm, setEditForm] = useState({
  question_text: '',          // String
  explanation: '',            // String
  options: [],                // Array of {id, label}
  correct_answers: [],        // Array of IDs
  story_characters: [],       // Array of {character, dialogs}
  showStory: false            // Boolean
});
```

### Create Wizard Step
```javascript
const [createStep, setCreateStep] = useState(1); // 1-5
```

---

## 🔄 Aliran Data: Dari UI ke Backend

### Step 1: User Input (UI)
```javascript
// User isi form dengan UI
options: [
  { id: '1', label: 'Jakarta' },
  { id: '2', label: 'Surabaya' }
]
correct_answers: ['1']
```

### Step 2: Convert ke JSON
```javascript
function convertFormToJSON(form) {
  const options_json = JSON.stringify(form.options);
  // [{"id":"1","label":"Jakarta"},{"id":"2","label":"Surabaya"}]
  
  const correct_config = JSON.stringify({ correct: form.correct_answers });
  // {"correct":["1"]}
  
  const story_json = form.showStory && form.story_characters.length > 0 
    ? JSON.stringify(form.story_characters.flatMap(char => 
        char.dialogs.filter(d => d.trim()).map(dialog => ({
          character: char.character,
          dialog: dialog
        }))
      ))
    : '';
  // [{"character":"Tutor","dialog":"Halo!"}]
  
  return { options_json, correct_config, story_json };
}
```

### Step 3: Send ke Backend
```javascript
await axios.post('/api/admin/questions', {
  level_number: 2,
  type: 'MULTIPLE_CHOICE',
  question_text: 'Pertanyaan...',
  explanation: 'Pesan sukses...',
  bloom_level: 'UNDERSTAND',
  topic: 'GENERAL',
  options_json: '[{...}]',      // JSON string
  correct_config: '{...}',      // JSON string
  story_json: '[{...}]'         // JSON string
});
```

### Step 4: Backend Processing
Database menerima JSON string dan menyimpannya apa adanya (sudah sama dengan v1.0).

### Step 5: Edit Flow - JSON ke UI
Saat edit, reverse prosesnya:

```javascript
// Backend response
q.options_json = '[{"id":"1","label":"Jakarta"}]'

// Parse ke UI format
const options = JSON.parse(q.options_json || '[]');
// [{id: '1', label: 'Jakarta'}]

// Set state
setEditForm({
  options: options,
  // ... fields lainnya
});
```

---

## ⚙️ Validasi Per-Step

### Step 1: Level Selection
```javascript
if (!createForm.level_number) {
  setValidationError('❌ Mohon pilih Level soal terlebih dahulu!');
  return false;
}
```

### Step 2: Question Text
```javascript
if (!createForm.question_text.trim()) {
  setValidationError('❌ Pertanyaan tidak boleh kosong!');
  return false;
}
```

### Step 3: Options & Answers
```javascript
// Pastikan semua opsi terisi
if (createForm.options.some(o => !o.label.trim())) {
  setValidationError('❌ Semua pilihan harus diisi!');
  return false;
}

// Pastikan minimal 1 jawaban benar
if (createForm.correct_answers.length === 0) {
  setValidationError('❌ Minimal 1 jawaban harus dipilih sebagai kunci!');
  return false;
}
```

### Step 4: Story (Optional)
- Tidak ada validasi ketat
- User bisa skip dengan unchecking "Tambah Cerita"

### Step 5: Review
- Tidak ada validasi (hanya review/preview)

---

## 🎨 UI Components Baru

### 1. Progress Bar
```jsx
<div className="flex gap-2">
  {[1, 2, 3, 4, 5].map((step) => (
    <div 
      key={step}
      className={`flex-1 h-2 rounded-full transition-all ${
        step <= createStep ? 'bg-emerald-500' : 'bg-stone-200'
      }`}
    ></div>
  ))}
</div>
```

### 2. Level Selection Buttons
```jsx
<div className="grid grid-cols-3 gap-3">
  {[1, 2, 3, 4, 5].map((level) => (
    <button
      key={level}
      onClick={() => setCreateForm({...createForm, level_number: level.toString()})}
      className={`p-4 rounded-2xl font-black text-lg transition-all border-2 ${
        createForm.level_number === level.toString()
          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
      }`}>
      {level}
    </button>
  ))}
</div>
```

### 3. Options Builder
```jsx
{createForm.options.map((option, idx) => (
  <div key={option.id} className="flex gap-2 items-start">
    <input 
      type="checkbox"
      checked={createForm.correct_answers.includes(option.id)}
      onChange={(e) => {
        // Toggle ID di correct_answers array
      }}
      className="w-5 h-5 mt-3 cursor-pointer accent-emerald-600"
    />
    <input 
      type="text"
      value={option.label}
      onChange={(e) => {
        setCreateForm({
          ...createForm,
          options: createForm.options.map(o => 
            o.id === option.id ? {...o, label: e.target.value} : o
          )
        });
      }}
      className="flex-1 px-3 py-2 rounded-lg..."
      placeholder="Ketik pilihan..."
    />
  </div>
))}
```

### 4. Story Character Editor
```jsx
{createForm.story_characters.map((char, charIdx) => (
  <div key={charIdx} className="bg-emerald-50 p-4 rounded-xl">
    <input 
      type="text"
      value={char.character}
      onChange={(e) => setCreateForm({
        ...createForm,
        story_characters: createForm.story_characters.map((c, i) =>
          i === charIdx ? {...c, character: e.target.value} : c
        )
      })}
      placeholder="Nama Karakter..."
    />
    
    {char.dialogs.map((dialog, dialogIdx) => (
      <input
        key={dialogIdx}
        type="text"
        value={dialog}
        onChange={(e) => setCreateForm({
          ...createForm,
          story_characters: createForm.story_characters.map((c, i) =>
            i === charIdx
              ? {...c, dialogs: c.dialogs.map((d, j) =>
                  j === dialogIdx ? e.target.value : d
                )}
              : c
          )
        })}
        placeholder={`Dialog ${dialogIdx + 1}...`}
      />
    ))}
    
    <button onClick={() => {/* Add dialog */}}>+ Dialog</button>
  </div>
))}
```

---

## 🔄 Handler Functions

### handleCreateQuestion (Updated)
```javascript
const handleCreateQuestion = async () => {
  // Konversi UI format ke JSON format
  const { options_json, correct_config, story_json } = convertFormToJSON(createForm);
  
  // Send ke backend
  await axios.post('/api/admin/questions', {
    level_number: parseInt(createForm.level_number),
    type: createForm.type,
    question_text: createForm.question_text,
    explanation: createForm.explanation,
    bloom_level: createForm.bloom_level,
    topic: createForm.topic,
    options_json,       // JSON string
    correct_config,     // JSON string
    story_json          // JSON string
  }, {...});
  
  // Reset form
  setCreateStep(1);
  setCreateForm({ /* reset to default */ });
};
```

### handleEditClick (Enhanced)
```javascript
const handleEditClick = (q) => {
  try {
    // Parse JSON dari backend ke UI format
    const options = JSON.parse(q.options_json || '[]');
    const correct = JSON.parse(q.correct_config || '{"correct":[]}').correct;
    const stories = q.story_json ? JSON.parse(q.story_json) : [];
    
    // Convert stories array ke character+dialogs format
    const storyCharacters = stories.length > 0 
      ? [{ character: stories[0]?.character || 'Tutor', dialogs: stories.map(s => s.dialog) }]
      : [{ character: 'Tutor', dialogs: [''] }];
    
    setEditForm({
      question_text: q.question_text,
      explanation: q.explanation,
      options: options,
      correct_answers: correct,
      story_characters: storyCharacters,
      showStory: stories.length > 0
    });
  } catch (err) {
    alert('❌ Error membaca data soal. Format mungkin invalid.');
  }
};
```

### handleSaveQuestion (Enhanced)
```javascript
const handleSaveQuestion = async (e) => {
  e.preventDefault();
  
  // Konversi UI format ke JSON
  const { options_json, correct_config, story_json } = convertFormToJSON(editForm);
  
  // Send update ke backend
  await axios.put(`/api/admin/questions/${editingQuestion.id}`, {
    question_text: editForm.question_text,
    explanation: editForm.explanation,
    options_json,
    correct_config,
    story_json
  }, {...});
};
```

---

## 📱 Responsive Classes

### Mobile First Approach
```jsx
// Grid yang responsive
className="grid grid-cols-1 md:grid-cols-2 gap-6"
// 1 kolom di mobile, 2 kolom di desktop

// Font yang responsive
className="text-lg md:text-xl lg:text-2xl"
// Kecil di mobile, besar di desktop

// Padding responsive
className="p-4 md:p-6 lg:p-8"
```

---

## 🔄 Backward Compatibility

### ✅ Kompatibel dengan Backend Lama
Database dan backend tidak berubah. Hanya UI yang berbeda.

Backend masih receive:
- options_json (JSON string) ✓
- correct_config (JSON string) ✓
- story_json (JSON string) ✓

Frontend mengirim format yang sama, jadi tidak ada breaking change.

### ✅ Edit Data Lama Tetap Berfungsi
Soal lama yang dibuat dengan v1.0 tetap bisa di-edit dengan v2.0.

Sistem automatically parse JSON ke UI format di `handleEditClick()`.

### ✅ Tidak Perlu Migration
Database tidak perlu di-migrate. Semua data tetap bisa dibaca dan diedit.

---

## 🐛 Error Handling

### Try-Catch di handleEditClick
```javascript
try {
  const options = JSON.parse(q.options_json || '[]');
  const correct = JSON.parse(q.correct_config || '{"correct":[]}').correct;
  // ... parsing lainnya
} catch (err) {
  alert('❌ Error membaca data soal. Format mungkin invalid.');
  console.error(err);
}
```

Jika JSON corrupt atau invalid, user akan dapat pesan yang jelas.

---

## 🎯 Performance Notes

### Tidak Ada Perubahan Performance
- Wizard hanya menampilkan 1 step per waktu (lebih ringan dari modal besar)
- Convert JSON hanya terjadi saat submit (bukan real-time)
- Parsing JSON hanya saat edit dan display

### Optimization Tips
- Lazy load form fields per step (opsional future improvement)
- Memoize handlers dengan useCallback (opsional)
- Virtual scroll jika ada banyak questions (future)

---

## 🔧 Maintenance & Debugging

### Console Logs untuk Debugging
```javascript
// Di convertFormToJSON()
console.log('Converting form to JSON:', { options_json, correct_config, story_json });

// Di handleCreateQuestion()
console.log('Creating question:', { ...payload });

// Di handleEditClick()
console.log('Parsing question data:', { options, correct, stories });
```

### Common Issues & Solutions

#### Issue: Story tidak tersimpan
**Cause**: `showStory` false atau `story_characters` kosong  
**Solution**: Check validasi di Step 4

#### Issue: Pilihan jawaban hilang
**Cause**: JSON parsing error di handleEditClick  
**Solution**: Check console untuk error message

#### Issue: Edit form tidak terisi
**Cause**: Data structure tidak match  
**Solution**: Check format di backend response

---

## 📊 Version Migration Path

```
v1.0 (JSON textarea UI)
    ↓ (UI improvement only)
v2.0 (Form builder UI) ← Current
    ↓ (future)
v2.1 (Drag-drop builder)
    ↓ (future)
v3.0 (AI-powered templates)
```

---

## 🚀 Deployment Checklist

- [x] Code changes tested locally
- [x] No breaking changes in API
- [x] Backward compatible with old data
- [x] Error handling implemented
- [x] Responsive design verified
- [x] Form validation working
- [x] JSON conversion tested
- [x] Edit flow tested with old data
- [x] Ready for production

---

## 📝 Commit Message Suggestion

```
feat(guru-dashboard): improve UX with form builder wizard

- Replace JSON textarea with form-based input
- Add 5-step wizard for creating questions  
- Replace manual JSON entry with UI builder
- Add character+dialog editor for visual novels
- Add question preview step
- Add per-step validation with clear error messages
- Improve responsive design
- Add helpful tips at each step
- Maintain backward compatibility
- All data formats unchanged

BREAKING: None
MIGRATION: None required
```

---

**Status**: ✅ Ready for Production  
**Last Updated**: April 29, 2026  
**Compatibility**: Backward compatible with v1.0 database
