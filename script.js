/* ==========================================================================
   BUKU KAS AUL gen2 — script.js
   Struktur file:
   1. Ikon & util dasar
   2. Lapisan data (localStorage)
   3. Util tanggal, angka, dompet
   4. Helper SweetAlert2 (tema, konfirmasi, date/time/range picker)
   5. Wallet picker + tambah/hapus dompet
   6. Form transaksi (kategori & keterangan picker)
   7. Render transaksi (riwayat, detail kategori) + edit/hapus
   8. Hutang & Piutang (generik untuk kedua jenis)
   9. Grafik (Chart.js)
   10. Invoice / cetak PDF (jsPDF)
   11. Opsi (cari, tema, backup, restore, reset, transfer)
   12. Navigasi & inisialisasi
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* 1. IKON & UTIL DASAR                                                    */
/* ---------------------------------------------------------------------- */
const ICONS = {
  calendar: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v3M16 3v3" stroke-linecap="round"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
  edit: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7"/></svg>',
  trashSm: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5.5 5.5L20 6.5"/></svg>',
  coin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M9.5 9.2c0-1.1 1-2 2.5-2s2.5.7 2.5 1.7c0 2.3-5 1.5-5 4 0 1 1 1.8 2.5 1.8s2.5-.8 2.5-1.9M12 6v1.1M12 16.9V18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h12A2 2 0 0 1 19.5 7.5V8h-14Z"/><path d="M3.5 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10.5a1.5 1.5 0 0 0-1.5-1.5h-3a2 2 0 1 0 0 4"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.3-4.3"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 3v2.2M12 18.8V21M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M3 12h2.2M18.8 12H21M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11.5M7 11l5 5 5-5M4.5 19.5h15"/></svg>',
  upload: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V8.5M7 13l5-5 5 5M4.5 19.5h15"/></svg>',
  swap: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 3 4 4-4 4M6 7h11a3 3 0 0 1 3 3v1M18 21l-4-4 4-4M18 17H7a3 3 0 0 1-3-3v-1"/></svg>',
  warning: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4.5M12 17h.01M10.4 3.6 2.9 17a1.7 1.7 0 0 0 1.5 2.5h15.2a1.7 1.7 0 0 0 1.5-2.5L13.6 3.6a1.7 1.7 0 0 0-3.2 0Z"/></svg>',
  empty: '<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="6.5" width="17" height="13" rx="2.5"/><path d="M3.5 10.5h17M7 3.5h10"/></svg>'
};

function $(sel, scope){ return (scope||document).querySelector(sel); }
function $all(sel, scope){ return Array.from((scope||document).querySelectorAll(sel)); }

function escapeHtml(str){
  return String(str==null?'':str).replace(/[&<>"']/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  });
}

function uid(prefix){
  return (prefix||'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
}

function debounce(fn, ms){
  let t;
  return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), ms); };
}

/* ---------------------------------------------------------------------- */
/* 2. LAPISAN DATA (localStorage)                                          */
/* ---------------------------------------------------------------------- */
const DB_KEY = 'bukukasaul_gen2_v1';
let DB = null;
let STORAGE_AVAILABLE = true;

function defaultData(){
  return {
    wallets: [
      { id: 'w-utama', name: 'Dompet Utama', balance: 0, deletable: false },
      { id: 'w-bank',  name: 'Rekening Bank', balance: 0, deletable: true },
      { id: 'w-ovo',   name: 'OVO',           balance: 0, deletable: true },
      { id: 'w-gopay', name: 'GoPay',         balance: 0, deletable: true },
      { id: 'w-dana',  name: 'DANA',          balance: 0, deletable: true }
    ],
    transactions: [],
    debts: [],
    receivables: [],
    descriptions: { income: [], expense: [] },
    settings: { theme: 'light', selectedWalletId: 'w-utama' }
  };
}

/** Menerima format lama (array datar) maupun baru ({income:[],expense:[]}).
    Data lama dipindahkan ke KEDUA kategori supaya tidak ada yang hilang;
    pengguna tinggal menghapus yang tidak relevan lewat picker keterangan. */
function normalizeDescriptions(desc){
  if(Array.isArray(desc)) return { income: desc.slice(), expense: desc.slice() };
  if(desc && typeof desc === 'object'){
    return {
      income: Array.isArray(desc.income) ? desc.income : [],
      expense: Array.isArray(desc.expense) ? desc.expense : []
    };
  }
  return { income: [], expense: [] };
}

function normalizeDB(obj){
  const def = defaultData();
  const out = {
    wallets: Array.isArray(obj.wallets) && obj.wallets.length ? obj.wallets : def.wallets,
    transactions: Array.isArray(obj.transactions) ? obj.transactions : [],
    debts: Array.isArray(obj.debts) ? obj.debts : [],
    receivables: Array.isArray(obj.receivables) ? obj.receivables : [],
    descriptions: normalizeDescriptions(obj.descriptions),
    settings: Object.assign({}, def.settings, obj.settings || {})
  };
  if(!out.wallets.find(w=>w.id===out.settings.selectedWalletId)){
    out.settings.selectedWalletId = out.wallets[0].id;
  }
  return out;
}

function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(!raw){ DB = defaultData(); saveDB(); return DB; }
    DB = normalizeDB(JSON.parse(raw));
    return DB;
  }catch(e){
    console.error('Gagal memuat data tersimpan:', e);
    STORAGE_AVAILABLE = false;
    DB = defaultData();
    return DB;
  }
}

function saveDB(){
  try{
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
    STORAGE_AVAILABLE = true;
  }catch(e){
    console.error('Gagal menyimpan data:', e);
    if(STORAGE_AVAILABLE){
      STORAGE_AVAILABLE = false;
      notify('Penyimpanan browser tidak tersedia. Perubahan hanya bertahan selama sesi ini.', 'error');
    }
  }
}

/* ---------------------------------------------------------------------- */
/* 3. UTIL TANGGAL, ANGKA, DOMPET                                          */
/* ---------------------------------------------------------------------- */
function pad2(n){ return String(n).padStart(2,'0'); }

function localDateStr(d){
  d = d || new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}
function localTimeStr(d){
  d = d || new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function isToday(dateStr){ return dateStr === localDateStr(); }

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTHS_LONG = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function formatDateID(dateStr){
  if(!dateStr) return '-';
  const [y,m,d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS_SHORT[m-1]} ${y}`;
}
function formatDateLong(dateStr){
  const [y,m,d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS_LONG[m-1]} ${y}`;
}

function formatRupiah(n){
  n = Math.round(Number(n) || 0);
  const sign = n < 0 ? '-' : '';
  return `${sign}Rp ${Math.abs(n).toLocaleString('id-ID')}`;
}
function formatShortNumber(v){
  const abs = Math.abs(v);
  if(abs >= 1e9) return (v/1e9).toFixed(v%1e9===0?0:1) + 'M';
  if(abs >= 1e6) return (v/1e6).toFixed(v%1e6===0?0:1) + 'jt';
  if(abs >= 1e3) return (v/1e3).toFixed(0) + 'rb';
  return String(v);
}
function parseAmountInput(str){
  const digits = String(str||'').replace(/[^0-9]/g,'');
  return digits ? parseInt(digits,10) : 0;
}
function formatAmountLive(str){
  const digits = String(str||'').replace(/[^0-9]/g,'');
  if(!digits) return '';
  return parseInt(digits,10).toLocaleString('id-ID');
}

function signedAmount(tx){
  return tx.type === 'income' ? tx.amount : -tx.amount;
}
function sortTxDesc(txs){
  return txs.slice().sort((a,b)=>
    (b.date+b.time).localeCompare(a.date+a.time) || (b.createdAt - a.createdAt)
  );
}

function getSelectedWallet(){
  return DB.wallets.find(w=>w.id===DB.settings.selectedWalletId) || DB.wallets[0];
}
function getWalletName(id){
  const w = DB.wallets.find(w=>w.id===id);
  return w ? w.name : '(Dompet dihapus)';
}
function applyBalanceDelta(walletId, delta){
  const w = DB.wallets.find(x=>x.id===walletId);
  if(w) w.balance += delta;
}

function emptyStateHtml(title, sub){
  return `<div class="empty-state">${ICONS.empty}
    <div class="empty-state__title">${escapeHtml(title)}</div>
    <div class="empty-state__sub">${escapeHtml(sub)}</div>
  </div>`;
}

function notify(msg, type){
  const root = document.getElementById('toast-root');
  if(!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  if(type === 'error') el.style.background = '#7A2E22';
  el.innerHTML = `${type==='error'?ICONS.warning:ICONS.check}<span>${escapeHtml(msg)}</span>`;
  root.appendChild(el);
  setTimeout(()=>{
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s ease';
    setTimeout(()=>el.remove(), 320);
  }, 2400);
}

/* ---------------------------------------------------------------------- */
/* 4. HELPER SWEETALERT2                                                   */
/* ---------------------------------------------------------------------- */
const SWAL_CLASSES = {
  popup: 'swal-theme-popup',
  title: 'swal-theme-title',
  htmlContainer: 'swal-theme-html',
  confirmButton: 'swal-theme-confirm',
  denyButton: 'swal-theme-deny',
  cancelButton: 'swal-theme-cancel'
};

function swalFire(opts){
  const merged = Object.assign({
    buttonsStyling: false,
    reverseButtons: true,
    customClass: SWAL_CLASSES
  }, opts);
  if(opts.customClass){
    merged.customClass = Object.assign({}, SWAL_CLASSES, opts.customClass);
  }
  return Swal.fire(merged);
}

async function swalConfirmDanger(title, text){
  const res = await swalFire({
    title,
    html: `<p class="swal-theme-html">${escapeHtml(text)}</p>`,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak',
    customClass: { confirmButton: 'swal-theme-deny' }
  });
  return res.isConfirmed;
}

async function swalConfirmInfo(title, text){
  const res = await swalFire({
    title,
    html: `<p class="swal-theme-html">${escapeHtml(text)}</p>`,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  });
  return res.isConfirmed;
}

/* --- Kalender & pemilih waktu KUSTOM (bukan <input type="date/time">) ---
   Dibangun sepenuhnya dengan tombol/HTML biasa agar TIDAK memicu date/time
   picker bawaan Android/iOS — semuanya tetap tampil bertema SweetAlert2. */
const WEEKDAYS_ID = ['Mg','Sn','Sl','Rb','Km','Jm','Sb'];

function daysInMonth(year, month){ return new Date(year, month+1, 0).getDate(); }

function buildCalendarHtml(viewYear, viewMonth, selectedDateStr, todayStr){
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const total = daysInMonth(viewYear, viewMonth);
  let cells = '';
  for(let i=0;i<firstDow;i++) cells += `<span class="cal-cell cal-cell--empty"></span>`;
  for(let d=1; d<=total; d++){
    const ds = `${viewYear}-${pad2(viewMonth+1)}-${pad2(d)}`;
    const sel = ds === selectedDateStr;
    const isToday = ds === todayStr;
    cells += `<button type="button" class="cal-cell ${sel?'cal-cell--selected':''} ${isToday&&!sel?'cal-cell--today':''}" data-date="${ds}">${d}</button>`;
  }
  return `
    <div class="cal-header">
      <button type="button" class="cal-nav" id="cal-prev" aria-label="Bulan sebelumnya">${ICONS_CHEVRON_LEFT}</button>
      <span class="cal-month-label">${MONTHS_LONG[viewMonth]} ${viewYear}</span>
      <button type="button" class="cal-nav" id="cal-next" aria-label="Bulan berikutnya">${ICONS_CHEVRON_RIGHT}</button>
    </div>
    <div class="cal-weekdays">${WEEKDAYS_ID.map(w=>`<span>${w}</span>`).join('')}</div>
    <div class="cal-grid" id="cal-grid">${cells}</div>
  `;
}

const ICONS_CHEVRON_LEFT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const ICONS_CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

async function pickDate(initial, title){
  let selected = initial || localDateStr();
  let [vy, vm] = selected.split('-').map(Number); vm -= 1;
  const today = localDateStr();

  const { value } = await swalFire({
    title: title || 'Pilih Tanggal',
    html: `<div id="cal-wrap">${buildCalendarHtml(vy, vm, selected, today)}</div>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Pilih',
    cancelButtonText: 'Batal',
    didOpen: (popup) => {
      const wrap = $('#cal-wrap', popup);
      function wire(){
        $('#cal-prev', wrap).addEventListener('click', ()=>{ vm--; if(vm<0){vm=11;vy--;} update(); });
        $('#cal-next', wrap).addEventListener('click', ()=>{ vm++; if(vm>11){vm=0;vy++;} update(); });
        $all('.cal-cell:not(.cal-cell--empty)', wrap).forEach(cell=>{
          cell.addEventListener('click', ()=>{ selected = cell.getAttribute('data-date'); update(); });
        });
      }
      function update(){ wrap.innerHTML = buildCalendarHtml(vy, vm, selected, today); wire(); }
      wire();
    },
    preConfirm: () => selected
  });
  return value || null;
}

function buildTimePickerHtml(hh, mm){
  return `<div class="time-picker">
      <div class="time-picker__col">
        <button type="button" class="time-picker__btn" id="tp-hour-up">${ICONS_CHEVRON_UP}</button>
        <div class="time-picker__value" id="tp-hour-value">${pad2(hh)}</div>
        <button type="button" class="time-picker__btn" id="tp-hour-down">${ICONS_CHEVRON_DOWN}</button>
        <span class="time-picker__label">Jam</span>
      </div>
      <div class="time-picker__colon">:</div>
      <div class="time-picker__col">
        <button type="button" class="time-picker__btn" id="tp-min-up">${ICONS_CHEVRON_UP}</button>
        <div class="time-picker__value" id="tp-min-value">${pad2(mm)}</div>
        <button type="button" class="time-picker__btn" id="tp-min-down">${ICONS_CHEVRON_DOWN}</button>
        <span class="time-picker__label">Menit</span>
      </div>
    </div>`;
}
const ICONS_CHEVRON_UP = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>';
const ICONS_CHEVRON_DOWN = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

async function pickTime(initial, title){
  let [hh, mm] = (initial || localTimeStr()).split(':').map(Number);
  const { value } = await swalFire({
    title: title || 'Pilih Waktu',
    html: buildTimePickerHtml(hh, mm),
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Pilih',
    cancelButtonText: 'Batal',
    didOpen: (popup) => {
      const hourVal = $('#tp-hour-value', popup), minVal = $('#tp-min-value', popup);
      $('#tp-hour-up', popup).addEventListener('click', ()=>{ hh = (hh+1)%24; hourVal.textContent = pad2(hh); });
      $('#tp-hour-down', popup).addEventListener('click', ()=>{ hh = (hh+23)%24; hourVal.textContent = pad2(hh); });
      $('#tp-min-up', popup).addEventListener('click', ()=>{ mm = (mm+1)%60; minVal.textContent = pad2(mm); });
      $('#tp-min-down', popup).addEventListener('click', ()=>{ mm = (mm+59)%60; minVal.textContent = pad2(mm); });
    },
    preConfirm: () => `${pad2(hh)}:${pad2(mm)}`
  });
  return value || null;
}

function shiftDate(dateStr, days){
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return localDateStr(d);
}
function todayRange(){ const t = localDateStr(); return { from: t, to: t }; }
function yesterdayRange(){ const y = shiftDate(localDateStr(), -1); return { from: y, to: y }; }
function thisWeekRange(){
  const d = new Date();
  const dow = d.getDay(); // 0=Minggu .. 6=Sabtu
  const diffToMonday = dow === 0 ? -6 : (1 - dow);
  const monday = new Date(d); monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  return { from: localDateStr(monday), to: localDateStr(sunday) };
}
function defaultMonthRange(){
  const d = new Date();
  const from = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-01`;
  const lastDay = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
  const to = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(lastDay)}`;
  return { from, to };
}
function thisYearRange(){
  const y = new Date().getFullYear();
  return { from: `${y}-01-01`, to: `${y}-12-31` };
}
function formatRangeLabel(range){
  if(!range) return 'Semua tanggal';
  if(range.from === range.to) return formatDateID(range.from);
  return `${formatDateID(range.from)} – ${formatDateID(range.to)}`;
}

/** Mengembalikan {mode:'range',from,to} | {mode:'all'} | {mode:'cancel'}
    Menu utama berupa daftar shortcut; "Rentang Custom" baru membuka
    kalender kustom berurutan (dari -> sampai). */
async function pickDateRangeDialog(current){
  const result = await swalFire({
    title: 'Rentang Tanggal',
    html: `<div class="swal-list">
        <button type="button" class="swal-list__item" data-range="yesterday">${ICONS.calendar}<span>Kemarin</span></button>
        <button type="button" class="swal-list__item" data-range="today">${ICONS.calendar}<span>Hari Ini</span></button>
        <button type="button" class="swal-list__item" data-range="week">${ICONS.calendar}<span>Minggu Ini</span></button>
        <button type="button" class="swal-list__item" data-range="month">${ICONS.calendar}<span>Bulan Ini</span></button>
        <button type="button" class="swal-list__item" data-range="year">${ICONS.calendar}<span>Tahun Ini</span></button>
        <div class="swal-list__divider"></div>
        <button type="button" class="swal-list__item" data-range="custom">${ICONS.edit}<span>Rentang Custom…</span></button>
        <button type="button" class="swal-list__item swal-list__item--muted" data-range="all">${ICONS.calendar}<span>Semua Tanggal</span></button>
      </div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Batal',
    didOpen: (popup) => {
      $all('[data-range]', popup).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          Swal.close({ isConfirmed: true, value: btn.getAttribute('data-range') });
        });
      });
    }
  });
  if(!result.isConfirmed) return { mode: 'cancel' };

  switch(result.value){
    case 'all': return { mode: 'all' };
    case 'yesterday': return { mode: 'range', ...yesterdayRange() };
    case 'today': return { mode: 'range', ...todayRange() };
    case 'week': return { mode: 'range', ...thisWeekRange() };
    case 'month': return { mode: 'range', ...defaultMonthRange() };
    case 'year': return { mode: 'range', ...thisYearRange() };
    case 'custom': {
      const defFrom = (current && current.from) || localDateStr();
      const defTo = (current && current.to) || localDateStr();
      const from = await pickDate(defFrom, 'Dari Tanggal');
      if(!from) return { mode: 'cancel' };
      const to = await pickDate(defTo >= from ? defTo : from, 'Sampai Tanggal');
      if(!to) return { mode: 'cancel' };
      if(from > to){
        notify('Tanggal awal harus sebelum tanggal akhir', 'error');
        return { mode: 'cancel' };
      }
      return { mode: 'range', from, to };
    }
    default: return { mode: 'cancel' };
  }
}


/* ---------------------------------------------------------------------- */
/* 5. WALLET: render, picker, tambah/hapus                                 */
/* ---------------------------------------------------------------------- */
function renderWalletCard(){
  const w = getSelectedWallet();
  $('#wallet-card-name').textContent = w.name;
  $('#wallet-card-balance').textContent = formatRupiah(w.balance);
}

function renderHomeSummary(){
  const w = getSelectedWallet();
  const txs = DB.transactions.filter(t=>t.walletId===w.id);
  const income = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  $('#summary-income-value').textContent = formatRupiah(income);
  $('#summary-expense-value').textContent = formatRupiah(expense);
}

async function openWalletPicker(){
  const wallets = DB.wallets;
  const itemsHtml = wallets.map(w => `
    <button type="button" class="swal-list__item ${w.id===DB.settings.selectedWalletId?'swal-list__item--active':''}" data-wallet-id="${w.id}">
      ${ICONS.wallet}<span>${escapeHtml(w.name)}</span>
      <span style="margin-left:auto;font-weight:700;font-size:12px;color:var(--text-muted);">${formatRupiah(w.balance)}</span>
    </button>`).join('');

  await swalFire({
    title: 'Pilih Dompet',
    html: `<div class="swal-list" id="swal-wallet-list">
        ${itemsHtml}
        <div class="swal-list__divider"></div>
        <button type="button" class="swal-list__item" id="swal-add-wallet">${ICONS.plus}<span>Tambah Dompet Manual</span></button>
        <button type="button" class="swal-list__item swal-list__item--danger" id="swal-delete-wallet">${ICONS.trash}<span>Hapus Dompet</span></button>
      </div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Kembali',
    didOpen: (popup) => {
      $all('[data-wallet-id]', popup).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          DB.settings.selectedWalletId = btn.getAttribute('data-wallet-id');
          saveDB();
          renderWalletCard();
          renderHomeSummary();
          Swal.close();
        });
      });
      $('#swal-add-wallet', popup).addEventListener('click', ()=>{ Swal.close(); promptAddWallet(); });
      $('#swal-delete-wallet', popup).addEventListener('click', ()=>{ Swal.close(); promptDeleteWallet(); });
    }
  });
}

async function promptAddWallet(){
  const { value: name } = await swalFire({
    title: 'Tambah Dompet',
    input: 'text',
    inputPlaceholder: 'Nama dompet baru',
    inputAttributes: { autocomplete: 'off' },
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    cancelButtonText: 'Batal',
    customClass: { input: 'swal-theme-input' },
    inputValidator: (v) => (!v || !v.trim()) ? 'Nama dompet tidak boleh kosong' : undefined
  });
  if(!name) return openWalletPicker();
  const wallet = { id: uid('w'), name: name.trim(), balance: 0, deletable: true };
  DB.wallets.push(wallet);
  DB.settings.selectedWalletId = wallet.id;
  saveDB();
  renderWalletCard();
  renderHomeSummary();
  notify(`Dompet "${wallet.name}" ditambahkan`);
}

async function promptDeleteWallet(){
  if(DB.wallets.length <= 1){
    notify('Tidak bisa menghapus dompet terakhir', 'error');
    return openWalletPicker();
  }
  const itemsHtml = DB.wallets.map(w => `
    <button type="button" class="swal-list__item swal-list__item--danger" data-del-wallet="${w.id}">
      ${ICONS.trash}<span>${escapeHtml(w.name)}</span>
    </button>`).join('');

  await swalFire({
    title: 'Hapus Dompet Mana?',
    html: `<div class="swal-list">${itemsHtml}</div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Kembali',
    didOpen: (popup) => {
      $all('[data-del-wallet]', popup).forEach(btn=>{
        btn.addEventListener('click', async ()=>{
          const id = btn.getAttribute('data-del-wallet');
          const w = DB.wallets.find(x=>x.id===id);
          Swal.close();
          const ok = await swalConfirmDanger(
            `Hapus dompet "${w.name}"?`,
            'Riwayat transaksi pada dompet ini tetap tersimpan di riwayat, namun dompet tidak dapat dipilih lagi.'
          );
          if(ok){
            DB.wallets = DB.wallets.filter(x=>x.id!==id);
            if(DB.settings.selectedWalletId === id) DB.settings.selectedWalletId = DB.wallets[0].id;
            saveDB();
            renderWalletCard();
            renderHomeSummary();
            notify('Dompet dihapus');
          }else{
            openWalletPicker();
          }
        });
      });
    }
  });
}

/* ---------------------------------------------------------------------- */
/* 6. FORM TRANSAKSI: draft state, kategori & keterangan picker             */
/* ---------------------------------------------------------------------- */
let draftTx = { date: localDateStr(), time: localTimeStr(), category: 'income', description: '' };

function resetEntryForm(){
  draftTx = { date: localDateStr(), time: localTimeStr(), category: 'income', description: '' };
  updateEntryFormUI();
  $('#field-amount').value = '';
}

function updateEntryFormUI(){
  $('#field-date-value').textContent = isToday(draftTx.date) ? 'Hari ini' : formatDateID(draftTx.date);
  $('#field-time-value').textContent = draftTx.time;
  setEntryCategory(draftTx.category);
  $('#field-description-value').textContent = draftTx.description || 'Pilih atau tambah keterangan';
}

function setEntryCategory(cat){
  draftTx.category = cat;
  $('#field-category').dataset.value = cat;
  $('#field-category-value').textContent = cat === 'income' ? 'Pendapatan' : 'Pengeluaran';
  $('#field-category-icon').innerHTML = cat === 'income' ? ICONS.arrowUp : ICONS.arrowDown;
  $('#field-category-icon').style.color = cat === 'income' ? 'var(--c-emerald-light)' : 'var(--c-coral)';
}

function setEntryDescription(desc){
  draftTx.description = desc;
  $('#field-description-value').textContent = desc;
}

async function pickCategoryValue(current){
  const result = await swalFire({
    title: 'Pilih Kategori',
    html: `<div class="swal-list">
        <button type="button" class="swal-list__item ${current==='income'?'swal-list__item--active':''}" data-cat="income">${ICONS.arrowUp}<span>Pendapatan</span></button>
        <button type="button" class="swal-list__item ${current==='expense'?'swal-list__item--active':''}" data-cat="expense">${ICONS.arrowDown}<span>Pengeluaran</span></button>
      </div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Batal',
    didOpen: (popup) => {
      $all('[data-cat]', popup).forEach(btn=>{
        btn.addEventListener('click', ()=>{
          Swal.close({ isConfirmed: true, value: btn.getAttribute('data-cat') });
        });
      });
    }
  });
  return result.isConfirmed ? result.value : null;
}

function descriptionListHtml(category){
  const list = DB.descriptions[category];
  if(!list.length){
    const label = category === 'income' ? 'pendapatan' : 'pengeluaran';
    return `<p style="font-size:12.5px;color:var(--text-muted);text-align:center;padding:14px 0;">Belum ada keterangan ${label} tersimpan</p>`;
  }
  return `<div class="swal-list">` + list.map(desc => `
    <div class="swal-list__item" style="padding-right:8px;" data-select-desc="${escapeHtml(desc)}">
      <span>${escapeHtml(desc)}</span>
      <button type="button" data-delete-desc="${escapeHtml(desc)}" style="margin-left:auto;color:var(--c-coral);flex-shrink:0;padding:4px;display:flex;" aria-label="Hapus keterangan">${ICONS.trashSm}</button>
    </div>`).join('') + `</div>`;
}

function descriptionPickerHtml(category){
  return `
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <input type="text" id="swal-new-desc" class="swal-theme-input" placeholder="Tambah keterangan baru" autocomplete="off" style="flex:1;padding:11px;border-radius:12px;">
      <button type="button" id="swal-add-desc" style="background:var(--gradient-primary);color:#fff;border-radius:12px;padding:0 18px;font-weight:700;font-size:18px;line-height:1;">+</button>
    </div>
    <div id="swal-desc-list-wrap" style="max-height:280px;overflow-y:auto;">${descriptionListHtml(category)}</div>
  `;
}

function wireDescriptionPicker(popup, category, onSelect){
  const wrap = $('#swal-desc-list-wrap', popup);

  function rewire(){
    wrap.innerHTML = descriptionListHtml(category);
    $all('[data-select-desc]', wrap).forEach(el=>{
      el.addEventListener('click', (e)=>{
        if(e.target.closest('[data-delete-desc]')) return;
        onSelect(el.getAttribute('data-select-desc'));
        Swal.close();
      });
    });
    $all('[data-delete-desc]', wrap).forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const desc = btn.getAttribute('data-delete-desc');
        DB.descriptions[category] = DB.descriptions[category].filter(d=>d!==desc);
        saveDB();
        rewire();
      });
    });
  }
  rewire();

  const addBtn = $('#swal-add-desc', popup);
  const input = $('#swal-new-desc', popup);
  addBtn.addEventListener('click', ()=>{
    const v = input.value.trim();
    if(!v) return;
    if(!DB.descriptions[category].includes(v)) DB.descriptions[category].unshift(v);
    saveDB();
    input.value = '';
    rewire();
  });
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ e.preventDefault(); addBtn.click(); }
  });
}

/** category: 'income' | 'expense'. onSelect(desc) dipanggil saat item dipilih. */
async function openDescriptionPicker(category, onSelect){
  await swalFire({
    title: `Keterangan ${category === 'income' ? 'Pendapatan' : 'Pengeluaran'}`,
    html: descriptionPickerHtml(category),
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Tutup',
    didOpen: (popup) => wireDescriptionPicker(popup, category, onSelect)
  });
}


/* ---------------------------------------------------------------------- */
/* 7. TRANSAKSI: render baris, riwayat, detail kategori, edit/hapus         */
/* ---------------------------------------------------------------------- */
const TX_SOURCE_BADGE = {
  'debt': 'Hutang', 'debt-payment': 'Bayar Hutang',
  'receivable': 'Piutang', 'receivable-payment': 'Bayar Piutang',
  'transfer-out': 'Transfer', 'transfer-in': 'Transfer'
};

function txRowHtml(tx){
  const badge = TX_SOURCE_BADGE[tx.source];
  return `
  <div class="tx-row ${tx.type==='income'?'tx-row--income':'tx-row--expense'}" data-tx-id="${tx.id}">
    <span class="tx-row__icon">${tx.type==='income'?ICONS.arrowUp:ICONS.arrowDown}</span>
    <span class="tx-row__body">
      <div class="tx-row__desc">${escapeHtml(tx.description)}</div>
      <div class="tx-row__meta">
        <span>${formatDateID(tx.date)} · ${tx.time}</span>
        <span class="tx-row__badge">${escapeHtml(getWalletName(tx.walletId))}</span>
        ${badge?`<span class="tx-row__badge">${badge}</span>`:''}
      </div>
    </span>
    <span class="tx-row__amount">${tx.type==='income'?'+':'-'} ${formatRupiah(tx.amount)}</span>
  </div>`;
}

function renderTxList(container, txs, opts){
  opts = opts || {};
  if(!txs.length){
    container.innerHTML = emptyStateHtml(opts.emptyTitle || 'Belum ada transaksi', opts.emptySub || 'Transaksi yang kamu catat akan muncul di sini');
    return;
  }
  container.innerHTML = txs.map(txRowHtml).join('');
  $all('[data-tx-id]', container).forEach(row=>{
    row.addEventListener('click', ()=>{
      const tx = DB.transactions.find(t=>t.id===row.getAttribute('data-tx-id'));
      if(tx) openTxActionPopup(tx);
    });
  });
}

let historyRange = todayRange();

function renderHistory(){
  let txs = DB.transactions.slice();
  if(historyRange) txs = txs.filter(t=>t.date>=historyRange.from && t.date<=historyRange.to);
  txs = sortTxDesc(txs);
  $('#history-range').textContent = formatRangeLabel(historyRange);
  renderTxList($('#history-list'), txs, { emptyTitle: 'Belum ada riwayat', emptySub: 'Semua transaksi akan tercatat di sini' });
}

let categoryDetailCtx = { type: 'income', walletId: null, range: todayRange() };

function openCategoryDetail(type){
  const wallet = getSelectedWallet();
  categoryDetailCtx = { type, walletId: wallet.id, range: todayRange() };
  $('#category-detail-title').textContent = type === 'income' ? 'Pendapatan' : 'Pengeluaran';
  renderCategoryDetail();
  goToPage('category-detail');
}

function renderCategoryDetail(){
  const { type, walletId, range } = categoryDetailCtx;
  let txs = DB.transactions.filter(t=>t.walletId===walletId && t.type===type);
  if(range) txs = txs.filter(t=>t.date>=range.from && t.date<=range.to);
  txs = sortTxDesc(txs);
  $('#category-detail-range').textContent = `${formatRangeLabel(range)} · ${getWalletName(walletId)}`;
  const total = txs.reduce((s,t)=>s+t.amount,0);
  const totalEl = $('#category-detail-total');
  totalEl.textContent = formatRupiah(total);
  totalEl.style.color = type === 'income' ? 'var(--c-emerald-light)' : 'var(--c-coral)';
  renderTxList($('#category-detail-list'), txs, {
    emptyTitle: type==='income' ? 'Belum ada pendapatan' : 'Belum ada pengeluaran',
    emptySub: 'Sesuaikan rentang tanggal atau catat transaksi baru'
  });
}

async function openTxActionPopup(tx){
  await swalFire({
    title: tx.description,
    html: `<p class="swal-theme-html" style="margin-top:-8px;">${formatDateID(tx.date)} · ${tx.time} · ${escapeHtml(getWalletName(tx.walletId))}</p>
      <div class="swal-list" style="margin-top:14px;">
        <button type="button" class="swal-list__item" id="swal-tx-edit">${ICONS.edit}<span>Edit Transaksi</span></button>
        <button type="button" class="swal-list__item swal-list__item--danger" id="swal-tx-delete">${ICONS.trash}<span>Hapus Transaksi</span></button>
      </div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Kembali',
    didOpen: (popup) => {
      $('#swal-tx-edit', popup).addEventListener('click', ()=>{ Swal.close(); handleEditTx(tx); });
      $('#swal-tx-delete', popup).addEventListener('click', ()=>{ Swal.close(); handleDeleteTx(tx); });
    }
  });
}

function handleEditTx(tx){
  if(tx.source === 'debt'){ return openEditRecordForm('debt', tx.relatedId); }
  if(tx.source === 'receivable'){ return openEditRecordForm('receivable', tx.relatedId); }
  if(tx.source === 'debt-payment' || tx.source === 'receivable-payment'){
    notify('Cicilan/pelunasan tidak dapat diedit langsung. Hapus cicilan ini bila perlu koreksi.', 'error');
    return;
  }
  if(tx.source === 'transfer-out' || tx.source === 'transfer-in'){
    notify('Transaksi transfer tidak dapat diedit. Hapus lalu buat ulang bila perlu.', 'error');
    return;
  }
  openManualEditForm(tx);
}

async function handleDeleteTx(tx){
  if(tx.source === 'debt'){
    const debt = DB.debts.find(d=>d.id===tx.relatedId);
    const ok = await swalConfirmDanger('Hapus Data Hutang?', `Transaksi ini terhubung dengan hutang${debt?` "${debt.name}"`:''}. Menghapusnya akan menghapus seluruh data hutang beserta riwayat cicilannya secara permanen.`);
    if(ok){ deleteDebtOrReceivableCascade('debt', tx.relatedId); renderAll(); notify('Hutang dihapus'); }
    return;
  }
  if(tx.source === 'debt-payment'){
    const ok = await swalConfirmDanger('Hapus Cicilan Ini?', 'Saldo dompet dan sisa hutang akan disesuaikan kembali.');
    if(ok){ deletePaymentCascade('debt', tx.relatedId, tx.id); renderAll(); notify('Cicilan dihapus'); }
    return;
  }
  if(tx.source === 'receivable'){
    const r = DB.receivables.find(x=>x.id===tx.relatedId);
    const ok = await swalConfirmDanger('Hapus Data Piutang?', `Transaksi ini terhubung dengan piutang${r?` "${r.name}"`:''}. Menghapusnya akan menghapus seluruh data piutang beserta riwayat cicilannya secara permanen.`);
    if(ok){ deleteDebtOrReceivableCascade('receivable', tx.relatedId); renderAll(); notify('Piutang dihapus'); }
    return;
  }
  if(tx.source === 'receivable-payment'){
    const ok = await swalConfirmDanger('Hapus Cicilan Ini?', 'Saldo dompet dan sisa piutang akan disesuaikan kembali.');
    if(ok){ deletePaymentCascade('receivable', tx.relatedId, tx.id); renderAll(); notify('Cicilan dihapus'); }
    return;
  }
  if(tx.source === 'transfer-out' || tx.source === 'transfer-in'){
    const ok = await swalConfirmDanger('Hapus Transfer Ini?', 'Kedua sisi transaksi transfer akan dihapus dan saldo kedua dompet dikembalikan.');
    if(ok){ deleteTransferCascade(tx.relatedId); renderAll(); notify('Transfer dihapus'); }
    return;
  }
  const ok = await swalConfirmDanger('Hapus Transaksi Ini?', 'Saldo dompet akan disesuaikan kembali.');
  if(ok){
    applyBalanceDelta(tx.walletId, -signedAmount(tx));
    DB.transactions = DB.transactions.filter(t=>t.id!==tx.id);
    saveDB();
    renderAll();
    notify('Transaksi dihapus');
  }
}

async function openManualEditForm(tx){
  // Alur bertahap: kategori -> tanggal -> waktu -> keterangan & nominal.
  // Dipecah begini (bukan satu form gabungan) supaya kalender/pemilih waktu
  // kustom tidak perlu bersarang di dalam popup lain.
  const type = await pickCategoryValue(tx.type);
  if(!type) return openTxActionPopup(tx);
  const date = await pickDate(tx.date, 'Tanggal Transaksi');
  if(!date) return openTxActionPopup(tx);
  const time = await pickTime(tx.time, 'Waktu Transaksi');
  if(!time) return openTxActionPopup(tx);

  const datalistOptions = DB.descriptions[type].map(d=>`<option value="${escapeHtml(d)}">`).join('');
  const { value } = await swalFire({
    title: 'Keterangan & Nominal',
    html: `
      <label class="swal-field-label">Keterangan</label>
      <input type="text" id="edit-tx-desc" class="swal-theme-input" list="edit-desc-datalist" autocomplete="off" style="width:100%;padding:11px;border-radius:12px;" value="${escapeHtml(tx.description)}">
      <datalist id="edit-desc-datalist">${datalistOptions}</datalist>
      <label class="swal-field-label">Nominal</label>
      <input type="text" inputmode="numeric" id="edit-tx-amount" class="swal-theme-input" style="width:100%;padding:11px;border-radius:12px;font-weight:700;" value="${tx.amount.toLocaleString('id-ID')}">
    `,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    focusConfirm: false,
    didOpen: (popup) => {
      const amt = $('#edit-tx-amount', popup);
      amt.addEventListener('input', ()=>{ amt.value = formatAmountLive(amt.value); });
    },
    preConfirm: () => {
      const description = document.getElementById('edit-tx-desc').value.trim();
      const amount = parseAmountInput(document.getElementById('edit-tx-amount').value);
      if(!description){ Swal.showValidationMessage('Keterangan wajib diisi'); return false; }
      if(!amount || amount<=0){ Swal.showValidationMessage('Nominal harus lebih dari 0'); return false; }
      return { description, amount };
    }
  });
  if(!value) return openTxActionPopup(tx);
  const oldSigned = signedAmount(tx);
  tx.type = type; tx.date = date; tx.time = time;
  tx.description = value.description; tx.amount = value.amount;
  const newSigned = signedAmount(tx);
  applyBalanceDelta(tx.walletId, newSigned - oldSigned);
  if(!DB.descriptions[type].includes(value.description)) DB.descriptions[type].unshift(value.description);
  saveDB();
  renderAll();
  notify('Transaksi diperbarui');
}

function deleteTransferCascade(groupId){
  if(!groupId) return;
  const pair = DB.transactions.filter(t=>t.relatedId===groupId && (t.source==='transfer-out'||t.source==='transfer-in'));
  pair.forEach(tx=>applyBalanceDelta(tx.walletId, -signedAmount(tx)));
  DB.transactions = DB.transactions.filter(t=> !(t.relatedId===groupId && (t.source==='transfer-out'||t.source==='transfer-in')));
  saveDB();
}

/* ---------------------------------------------------------------------- */
/* 8. HUTANG & PIUTANG (logika generik untuk kedua jenis)                  */
/* ---------------------------------------------------------------------- */
const KIND_CONFIG = {
  debt: {
    store: 'debts', initialSign: 1, paymentSign: -1,
    initialLabel: 'Hutang dari', paymentLabel: 'Bayar hutang ke',
    txInitialType: 'income', txPaymentType: 'expense', label: 'Hutang'
  },
  receivable: {
    store: 'receivables', initialSign: -1, paymentSign: 1,
    initialLabel: 'Piutang untuk', paymentLabel: 'Bayar piutang dari',
    txInitialType: 'expense', txPaymentType: 'income', label: 'Piutang'
  }
};

function addDebtOrReceivable(kind, data){
  const cfg = KIND_CONFIG[kind];
  const wallet = getSelectedWallet();
  const id = uid(kind);
  const txId = uid('tx');
  const record = {
    id, name: data.name, amount: data.amount, remaining: data.amount,
    date: data.date, time: data.time, walletId: wallet.id,
    status: 'belum', payments: [], transactionId: txId
  };
  const tx = {
    id: txId, walletId: wallet.id, type: cfg.txInitialType,
    date: data.date, time: data.time,
    description: `${cfg.initialLabel} ${data.name}`, amount: data.amount,
    source: kind, relatedId: id, createdAt: Date.now()
  };
  DB[cfg.store].unshift(record);
  DB.transactions.unshift(tx);
  applyBalanceDelta(wallet.id, cfg.initialSign * data.amount);
  saveDB();
  return record;
}

function payDebtOrReceivable(kind, id, amount, isFull){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===id);
  if(!record) return;
  const pay = isFull ? record.remaining : Math.min(amount, record.remaining);
  if(pay <= 0) return;
  const txId = uid('tx');
  const tx = {
    id: txId, walletId: record.walletId, type: cfg.txPaymentType,
    date: localDateStr(), time: localTimeStr(),
    description: `${cfg.paymentLabel} ${record.name}`, amount: pay,
    source: kind + '-payment', relatedId: id, createdAt: Date.now()
  };
  DB.transactions.unshift(tx);
  applyBalanceDelta(record.walletId, cfg.paymentSign * pay);
  record.payments.push({ id: uid('pay'), amount: pay, date: tx.date, time: tx.time, transactionId: txId });
  record.remaining -= pay;
  record.status = record.remaining <= 0 ? 'lunas' : 'cicil';
  saveDB();
}

function editDebtOrReceivableCore(kind, id, data){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===id);
  if(!record) return;
  const oldAmount = record.amount;
  const paidSoFar = oldAmount - record.remaining;
  const delta = data.amount - oldAmount;
  record.amount = data.amount;
  record.remaining = Math.max(0, data.amount - paidSoFar);
  record.date = data.date; record.time = data.time;
  record.status = record.remaining <= 0 ? 'lunas' : (paidSoFar > 0 ? 'cicil' : 'belum');
  const tx = DB.transactions.find(t=>t.id===record.transactionId);
  if(tx){
    applyBalanceDelta(tx.walletId, cfg.initialSign * delta);
    tx.amount = data.amount; tx.date = data.date; tx.time = data.time;
  }
  saveDB();
}

function deleteDebtOrReceivableCascade(kind, id){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===id);
  if(!record) return;
  applyBalanceDelta(record.walletId, -cfg.initialSign * record.amount);
  record.payments.forEach(p=> applyBalanceDelta(record.walletId, -cfg.paymentSign * p.amount));
  const relatedTxIds = new Set([record.transactionId, ...record.payments.map(p=>p.transactionId)]);
  DB.transactions = DB.transactions.filter(t=>!relatedTxIds.has(t.id));
  DB[cfg.store] = DB[cfg.store].filter(r=>r.id!==id);
  saveDB();
}

function deletePaymentCascade(kind, recordId, transactionId){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===recordId);
  if(!record) return;
  const payment = record.payments.find(p=>p.transactionId===transactionId);
  if(!payment) return;
  applyBalanceDelta(record.walletId, -cfg.paymentSign * payment.amount);
  record.remaining += payment.amount;
  record.payments = record.payments.filter(p=>p.transactionId!==transactionId);
  record.status = record.remaining >= record.amount ? 'belum' : (record.remaining <= 0 ? 'lunas' : 'cicil');
  DB.transactions = DB.transactions.filter(t=>t.id!==transactionId);
  saveDB();
}

function recordRowHtml(r, kind){
  const pct = r.amount > 0 ? Math.min(100, Math.round(((r.amount - r.remaining) / r.amount) * 100)) : 0;
  const markClass = r.status==='lunas' ? 'mark--lunas' : r.status==='cicil' ? 'mark--cicil' : 'mark--belum';
  const markText = r.status==='lunas' ? 'Lunas' : r.status==='cicil' ? 'Cicil' : 'Belum Lunas';
  return `
  <div class="debt-row" data-record-id="${r.id}">
    <div class="debt-row__top">
      <span class="debt-row__name">${escapeHtml(r.name)} <span class="mark ${markClass}">${markText}</span></span>
      <span class="debt-row__amount">${formatRupiah(r.amount)}</span>
    </div>
    <div class="debt-row__meta">${formatDateID(r.date)} · ${r.time} · ${escapeHtml(getWalletName(r.walletId))}</div>
    ${r.status!=='belum' ? `
    <div class="debt-row__progress"><div class="debt-row__progress-fill" style="width:${pct}%"></div></div>
    <div class="debt-row__remaining">Sisa: ${formatRupiah(r.remaining)}</div>` : ''}
  </div>`;
}

function renderRecordList(container, list, kind){
  if(!list.length){
    container.innerHTML = emptyStateHtml(
      kind==='debt' ? 'Belum ada hutang' : 'Belum ada piutang',
      'Tambahkan lewat form di atas'
    );
    return;
  }
  container.innerHTML = list.map(r=>recordRowHtml(r,kind)).join('');
  $all('[data-record-id]', container).forEach(row=>{
    row.addEventListener('click', ()=> openRecordActionPopup(kind, row.getAttribute('data-record-id')));
  });
}

function renderDebtList(){
  const list = DB.debts.slice().sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
  renderRecordList($('#hutang-list'), list, 'debt');
}
function renderPiutangList(){
  const list = DB.receivables.slice().sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
  renderRecordList($('#piutang-list'), list, 'receivable');
}

async function openRecordActionPopup(kind, id){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===id);
  if(!record) return;
  const notLunas = record.status !== 'lunas';
  await swalFire({
    title: record.name,
    html: `<p class="swal-theme-html" style="margin-top:-8px;">${cfg.label} · ${formatRupiah(record.amount)} · Sisa ${formatRupiah(record.remaining)}</p>
      <div class="swal-list" style="margin-top:14px;">
        ${notLunas ? `<button type="button" class="swal-list__item" id="act-lunas">${ICONS.check}<span>Tandai Lunas</span></button>` : ''}
        ${notLunas ? `<button type="button" class="swal-list__item" id="act-cicil">${ICONS.coin}<span>Cicil</span></button>` : ''}
        <button type="button" class="swal-list__item" id="act-edit">${ICONS.edit}<span>Edit ${cfg.label}</span></button>
        <button type="button" class="swal-list__item swal-list__item--danger" id="act-delete">${ICONS.trash}<span>Hapus</span></button>
      </div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Kembali',
    didOpen: (popup) => {
      const lunasBtn = $('#act-lunas', popup);
      const cicilBtn = $('#act-cicil', popup);
      if(lunasBtn) lunasBtn.addEventListener('click', async ()=>{
        Swal.close();
        const ok = await swalConfirmInfo('Tandai Lunas?', `Sisa ${formatRupiah(record.remaining)} akan dilunasi sekaligus dan saldo dompet akan ${kind==='debt'?'berkurang':'bertambah'}.`);
        if(ok){ payDebtOrReceivable(kind, id, 0, true); renderAll(); notify(`${cfg.label} ditandai lunas`); }
        else openRecordActionPopup(kind, id);
      });
      if(cicilBtn) cicilBtn.addEventListener('click', ()=>{ Swal.close(); openCicilForm(kind, id); });
      $('#act-edit', popup).addEventListener('click', ()=>{ Swal.close(); openEditRecordForm(kind, id); });
      $('#act-delete', popup).addEventListener('click', async ()=>{
        Swal.close();
        const ok = await swalConfirmDanger(`Hapus ${cfg.label} Ini?`, `Data ${cfg.label.toLowerCase()} beserta seluruh riwayat cicilan dan transaksi terkait akan dihapus permanen, termasuk dari halaman riwayat transaksi.`);
        if(ok){ deleteDebtOrReceivableCascade(kind, id); renderAll(); notify(`${cfg.label} dihapus`); }
        else openRecordActionPopup(kind, id);
      });
    }
  });
}

async function openCicilForm(kind, id){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===id);
  if(!record) return;
  const { value } = await swalFire({
    title: 'Bayar Cicilan',
    html: `<p class="swal-theme-html" style="margin-top:-8px;margin-bottom:10px;">Sisa saat ini: ${formatRupiah(record.remaining)}</p>
      <input type="text" inputmode="numeric" id="swal-cicil-amount" class="swal-theme-input" placeholder="0" style="width:100%;padding:12px;border-radius:12px;font-weight:700;font-size:16px;">`,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Kembali',
    focusConfirm: false,
    didOpen: (popup) => {
      const inp = $('#swal-cicil-amount', popup);
      inp.addEventListener('input', ()=>{ inp.value = formatAmountLive(inp.value); });
      inp.focus();
    },
    preConfirm: () => {
      const amt = parseAmountInput(document.getElementById('swal-cicil-amount').value);
      if(!amt || amt <= 0){ Swal.showValidationMessage('Nominal cicilan harus lebih dari 0'); return false; }
      if(amt > record.remaining){ Swal.showValidationMessage(`Nominal melebihi sisa (${formatRupiah(record.remaining)})`); return false; }
      return amt;
    }
  });
  if(value){
    payDebtOrReceivable(kind, id, value, false);
    renderAll();
    notify('Cicilan tersimpan');
  }else{
    openRecordActionPopup(kind, id);
  }
}

async function openEditRecordForm(kind, id){
  const cfg = KIND_CONFIG[kind];
  const record = DB[cfg.store].find(r=>r.id===id);
  if(!record) return;

  // Alur bertahap: tanggal -> waktu -> nominal (memakai picker kustom di atas).
  const date = await pickDate(record.date, `Tanggal ${cfg.label}`);
  if(!date) return openRecordActionPopup(kind, id);
  const time = await pickTime(record.time, `Waktu ${cfg.label}`);
  if(!time) return openRecordActionPopup(kind, id);

  const { value: amount } = await swalFire({
    title: `Nominal ${cfg.label}`,
    html: `<input type="text" inputmode="numeric" id="swal-edit-amount" class="swal-theme-input" style="width:100%;padding:11px;border-radius:12px;font-weight:700;font-size:16px;" value="${record.amount.toLocaleString('id-ID')}">`,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Kembali',
    focusConfirm: false,
    didOpen: (popup) => {
      const inp = $('#swal-edit-amount', popup);
      inp.addEventListener('input', ()=>{ inp.value = formatAmountLive(inp.value); });
      inp.focus();
    },
    preConfirm: () => {
      const amt = parseAmountInput(document.getElementById('swal-edit-amount').value);
      if(!amt || amt <= 0){ Swal.showValidationMessage('Nominal harus lebih dari 0'); return false; }
      const paidSoFar = record.amount - record.remaining;
      if(amt < paidSoFar){ Swal.showValidationMessage(`Nominal tidak boleh kurang dari yang sudah dibayar (${formatRupiah(paidSoFar)})`); return false; }
      return amt;
    }
  });

  if(amount){
    editDebtOrReceivableCore(kind, id, { date, time, amount });
    renderAll();
    notify(`${cfg.label} diperbarui`);
  }else{
    openRecordActionPopup(kind, id);
  }
}

/* ---------------------------------------------------------------------- */
/* 9. GRAFIK (Chart.js)                                                     */
/* ---------------------------------------------------------------------- */
let chartType = 'bar';
let chartRange = todayRange();
let chartInstance = null;

function daysBetween(a, b){ return Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 86400000); }

function buildBuckets(from, to, monthly){
  const buckets = [];
  if(monthly){
    let cur = new Date(from+'T00:00:00'); cur.setDate(1);
    const end = new Date(to+'T00:00:00');
    let guard = 0;
    while(cur <= end && guard < 120){
      const y = cur.getFullYear(), m = cur.getMonth();
      const lastDay = new Date(y, m+1, 0).getDate();
      buckets.push({
        from: `${y}-${pad2(m+1)}-01`,
        to: `${y}-${pad2(m+1)}-${pad2(lastDay)}`,
        label: `${MONTHS_SHORT[m]} ${y}`
      });
      cur.setMonth(cur.getMonth()+1);
      guard++;
    }
  }else{
    let cur = new Date(from+'T00:00:00');
    const end = new Date(to+'T00:00:00');
    let guard = 0;
    while(cur <= end && guard < 400){
      const y = cur.getFullYear(), m = cur.getMonth(), d = cur.getDate();
      const ds = `${y}-${pad2(m+1)}-${pad2(d)}`;
      buckets.push({ from: ds, to: ds, label: `${d}/${m+1}` });
      cur.setDate(cur.getDate()+1);
      guard++;
    }
  }
  return buckets;
}

function sumInRange(txs, type, from, to){
  return txs.filter(t=>t.type===type && t.date>=from && t.date<=to).reduce((s,t)=>s+t.amount,0);
}

function renderChart(){
  const rangeLabelEl = $('#chart-range');
  rangeLabelEl.textContent = formatRangeLabel(chartRange);

  const txs = DB.transactions.filter(t=>t.date>=chartRange.from && t.date<=chartRange.to);
  const canvas = document.getElementById('chart-canvas');
  const emptyEl = document.getElementById('chart-empty');

  if(chartInstance){ chartInstance.destroy(); chartInstance = null; }

  if(!txs.length){
    emptyEl.hidden = false;
    canvas.style.display = 'none';
    return;
  }
  emptyEl.hidden = true;
  canvas.style.display = 'block';

  const isDark = document.body.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(20,30,40,.08)';
  const textColor = isDark ? '#A8B2C0' : '#5B6572';
  const ctx = canvas.getContext('2d');

  if(chartType === 'pie'){
    const income = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
    const expense = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendapatan','Pengeluaran'],
        datasets: [{ data: [income, expense], backgroundColor: ['#12786A','#D6614F'], borderWidth: 0 }]
      },
      options: {
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c)=> `${c.label}: ${formatRupiah(c.parsed)}` } }
        }
      }
    });
    return;
  }

  const spanDays = daysBetween(chartRange.from, chartRange.to);
  const monthly = spanDays > 62;
  const buckets = buildBuckets(chartRange.from, chartRange.to, monthly);
  const incomeData = buckets.map(b=>sumInRange(txs,'income', b.from, b.to));
  const expenseData = buckets.map(b=>sumInRange(txs,'expense', b.from, b.to));
  const labels = buckets.map(b=>b.label);

  chartInstance = new Chart(ctx, {
    type: chartType === 'line' ? 'line' : 'bar',
    data: {
      labels,
      datasets: [
        { label:'Pendapatan', data: incomeData, backgroundColor:'#12786A', borderColor:'#12786A', tension:.4, fill: chartType==='line', borderRadius: chartType==='bar'?6:0, pointRadius: chartType==='line' ? 3 : 0 },
        { label:'Pengeluaran', data: expenseData, backgroundColor:'#D6614F', borderColor:'#D6614F', tension:.4, fill: chartType==='line', borderRadius: chartType==='bar'?6:0, pointRadius: chartType==='line' ? 3 : 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c)=> `${c.dataset.label}: ${formatRupiah(c.parsed.y)}` } }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: "'Inter'", size: 10.5 }, maxRotation: 0, autoSkip: true } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: "'Inter'" }, callback: (v)=>formatShortNumber(v) } }
      }
    }
  });
}

/* ---------------------------------------------------------------------- */
/* 10. INVOICE / CETAK LAPORAN (jsPDF + autotable)                          */
/* ---------------------------------------------------------------------- */
let invoiceRange = todayRange();

function groupSum(txs){
  const map = {};
  txs.forEach(t=>{ map[t.description] = (map[t.description] || 0) + t.amount; });
  return map;
}

function computeInvoiceData(){
  const txs = DB.transactions.filter(t=>t.date>=invoiceRange.from && t.date<=invoiceRange.to);
  const incomeMap = groupSum(txs.filter(t=>t.type==='income'));
  const expenseMap = groupSum(txs.filter(t=>t.type==='expense'));
  const incomeTotal = Object.values(incomeMap).reduce((a,b)=>a+b,0);
  const expenseTotal = Object.values(expenseMap).reduce((a,b)=>a+b,0);
  return { incomeMap, expenseMap, incomeTotal, expenseTotal, net: incomeTotal - expenseTotal };
}

function renderInvoicePreview(){
  $('#invoice-range').textContent = formatRangeLabel(invoiceRange);
  const data = computeInvoiceData();
  const container = $('#invoice-preview');
  const incomeEntries = Object.entries(data.incomeMap);
  const expenseEntries = Object.entries(data.expenseMap);

  if(!incomeEntries.length && !expenseEntries.length){
    container.innerHTML = emptyStateHtml('Belum ada data', 'Tidak ada transaksi pada rentang tanggal ini');
    return;
  }

  const incomeRows = incomeEntries.map(([k,v])=>`
    <div class="invoice-row"><span class="invoice-row__name">${escapeHtml(k)}</span><span class="invoice-row__value" style="color:var(--c-emerald-light)">${formatRupiah(v)}</span></div>`).join('');
  const expenseRows = expenseEntries.map(([k,v])=>`
    <div class="invoice-row"><span class="invoice-row__name">${escapeHtml(k)}</span><span class="invoice-row__value" style="color:var(--c-coral)">${formatRupiah(v)}</span></div>`).join('');

  container.innerHTML = `
    <div class="invoice-preview__brand">Buku Kas Aul Gen2.5</div>
    <div class="invoice-preview__meta">Laporan ${formatDateID(invoiceRange.from)} – ${formatDateID(invoiceRange.to)}</div>
    ${incomeRows ? `<div class="list-heading" style="margin-top:2px;">Pendapatan</div>${incomeRows}` : ''}
    ${expenseRows ? `<div class="list-heading" style="margin-top:14px;">Pengeluaran</div>${expenseRows}` : ''}
    <div class="invoice-total"><span>Saldo Bersih</span><span style="color:${data.net>=0?'var(--c-emerald-light)':'var(--c-coral)'}">${formatRupiah(data.net)}</span></div>
  `;
}

function generateInvoicePdf(){
  const data = computeInvoiceData();
  const incomeEntries = Object.entries(data.incomeMap);
  const expenseEntries = Object.entries(data.expenseMap);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 40;
  const pageRight = 555;
  let y = 56;

  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(11,79,69);
  doc.text('Buku Kas Aul Gen2.5', marginX, y);
  y += 20;
  doc.setFont('helvetica','normal'); doc.setFontSize(10.5); doc.setTextColor(90,100,110);
  doc.text('Laporan Keuangan Pribadi', marginX, y); y += 14;
  doc.text(`Periode: ${formatDateID(invoiceRange.from)} - ${formatDateID(invoiceRange.to)}`, marginX, y); y += 10;
  doc.setDrawColor(220,224,228); doc.line(marginX, y+8, pageRight, y+8); y += 26;

  if(incomeEntries.length){
    doc.autoTable({
      startY: y,
      head: [['Keterangan (Pendapatan)','Nominal']],
      body: incomeEntries.map(([k,v])=>[k, 'Rp ' + v.toLocaleString('id-ID')]),
      theme: 'plain',
      headStyles: { fillColor: [228,241,236], textColor: [11,79,69], fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right' } },
      styles: { fontSize: 10, cellPadding: 6 },
      margin: { left: marginX, right: 40 }
    });
    y = doc.lastAutoTable.finalY + 18;
  }
  if(expenseEntries.length){
    doc.autoTable({
      startY: y,
      head: [['Keterangan (Pengeluaran)','Nominal']],
      body: expenseEntries.map(([k,v])=>[k, 'Rp ' + v.toLocaleString('id-ID')]),
      theme: 'plain',
      headStyles: { fillColor: [251,234,231], textColor: [214,97,79], fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right' } },
      styles: { fontSize: 10, cellPadding: 6 },
      margin: { left: marginX, right: 40 }
    });
    y = doc.lastAutoTable.finalY + 22;
  }
  if(!incomeEntries.length && !expenseEntries.length){
    doc.setFontSize(11); doc.setTextColor(140,140,140);
    doc.text('Tidak ada transaksi pada rentang tanggal ini.', marginX, y);
    y += 24;
  }

  if(y > 760){ doc.addPage(); y = 56; }
  doc.setDrawColor(220,224,228); doc.line(marginX, y, pageRight, y); y += 20;
  const col = data.net >= 0 ? [11,79,69] : [214,97,79];
  doc.setFont('helvetica','bold'); doc.setFontSize(12.5);
  doc.setTextColor(col[0], col[1], col[2]);
  doc.text('Saldo Bersih', marginX, y);
  doc.text('Rp ' + data.net.toLocaleString('id-ID'), pageRight, y, { align: 'right' });

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(160,160,160);
  doc.text(`Dicetak pada ${formatDateLong(localDateStr())} ${localTimeStr()}`, marginX, 800);

  const fname = `Laporan-BukuKasAul-${invoiceRange.from}_${invoiceRange.to}.pdf`;
  doc.save(fname);
  notify('Laporan PDF berhasil diunduh');
}

/* ---------------------------------------------------------------------- */
/* 11. OPSI: cari, tema, backup, restore, reset, transfer                   */
/* ---------------------------------------------------------------------- */
function getTxDateBounds(){
  if(!DB.transactions.length) return defaultMonthRange();
  let min = DB.transactions[0].date, max = DB.transactions[0].date;
  DB.transactions.forEach(t=>{ if(t.date < min) min = t.date; if(t.date > max) max = t.date; });
  return { from: min, to: max };
}

async function openOptionsMenu(){
  const isDark = document.body.classList.contains('dark');
  await swalFire({
    title: 'Opsi',
    html: `<div class="swal-list">
        <button type="button" class="swal-list__item" id="opt-search">${ICONS.search}<span>Cari Transaksi</span></button>
        <button type="button" class="swal-list__item" id="opt-theme">${isDark?ICONS.sun:ICONS.moon}<span>Mode ${isDark?'Terang':'Gelap'}</span></button>
        <div class="swal-list__divider"></div>
        <button type="button" class="swal-list__item" id="opt-backup">${ICONS.download}<span>Backup Data</span></button>
        <button type="button" class="swal-list__item" id="opt-restore">${ICONS.upload}<span>Pulihkan Data</span></button>
        <button type="button" class="swal-list__item" id="opt-transfer">${ICONS.swap}<span>Transfer Antar Dompet</span></button>
        <div class="swal-list__divider"></div>
        <button type="button" class="swal-list__item swal-list__item--danger" id="opt-reset">${ICONS.warning}<span>Reset Data</span></button>
      </div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Kembali',
    didOpen: (popup) => {
      $('#opt-search', popup).addEventListener('click', ()=>{ Swal.close(); openSearchDialog(); });
      $('#opt-theme', popup).addEventListener('click', ()=>{ Swal.close(); toggleTheme(); });
      $('#opt-backup', popup).addEventListener('click', ()=>{ Swal.close(); backupData(); });
      $('#opt-restore', popup).addEventListener('click', ()=>{ Swal.close(); restoreDataPrompt(); });
      $('#opt-transfer', popup).addEventListener('click', ()=>{ Swal.close(); openTransferDialog(); });
      $('#opt-reset', popup).addEventListener('click', ()=>{ Swal.close(); resetDataPrompt(); });
    }
  });
}

/* Warna status bar (address bar/notch) untuk tiap mode.
   Nilainya mengikuti warna nyata header (.app-header) agar menyatu,
   bukan nilai statis terpisah yang bisa "lupa" disinkronkan. */
const STATUS_BAR_COLOR = { light: '#0B4F45', dark: '#0B4F45' };

function syncStatusBarColor(){
  const meta = document.getElementById('meta-theme-color');
  if(!meta) return;
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
  meta.setAttribute('content', STATUS_BAR_COLOR[mode]);
}

function toggleTheme(){
  document.body.classList.toggle('dark');
  DB.settings.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  saveDB();
  syncStatusBarColor();
  if(currentPage === 'charts') renderChart();
  notify(`Mode ${DB.settings.theme==='dark'?'gelap':'terang'} diaktifkan`);
}

function backupData(){
  const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-bukukasaul-${localDateStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  notify('Backup data berhasil diunduh');
}

async function restoreDataPrompt(){
  const { value: file } = await swalFire({
    title: 'Pulihkan Data',
    html: `<p class="swal-theme-html" style="margin-bottom:10px;">Pilih file backup (.json) yang sebelumnya diunduh. Data saat ini akan digantikan.</p>`,
    input: 'file',
    inputAttributes: { accept: '.json', 'aria-label': 'Unggah file backup' },
    showCancelButton: true,
    confirmButtonText: 'Pulihkan',
    cancelButtonText: 'Batal'
  });
  if(!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try{
      const parsed = JSON.parse(e.target.result);
      if(!parsed || !Array.isArray(parsed.wallets)) throw new Error('format tidak valid');
      const ok = await swalConfirmDanger('Timpa Data Saat Ini?', 'Seluruh data yang ada sekarang akan digantikan dengan data dari file backup ini.');
      if(ok){
        DB = normalizeDB(parsed);
        saveDB();
        document.body.classList.toggle('dark', DB.settings.theme === 'dark');
        syncStatusBarColor();
        historyRange = todayRange(); categoryDetailCtx = { type:'income', walletId:null, range:todayRange() };
        chartRange = todayRange(); invoiceRange = todayRange();
        renderAll();
        notify('Data berhasil dipulihkan');
      }
    }catch(err){
      notify('File backup tidak valid', 'error');
    }
  };
  reader.readAsText(file);
}

async function resetDataPrompt(){
  const ok = await swalConfirmDanger('Reset Semua Data?', 'Seluruh dompet, transaksi, hutang, dan piutang akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.');
  if(ok){
    DB = defaultData();
    saveDB();
    historyRange = todayRange(); categoryDetailCtx = { type:'income', walletId:null, range:todayRange() };
    chartRange = todayRange(); invoiceRange = todayRange();
    renderAll();
    notify('Semua data telah direset');
  }
}

async function openTransferDialog(){
  if(DB.wallets.length < 2){ notify('Minimal butuh 2 dompet untuk transfer', 'error'); return; }
  const options = DB.wallets.map(w=>`<option value="${w.id}">${escapeHtml(w.name)} (${formatRupiah(w.balance)})</option>`).join('');
  const { value } = await swalFire({
    title: 'Transfer Antar Dompet',
    html: `
      <label class="swal-field-label">Dari Dompet</label>
      <select id="swal-transfer-from" class="swal-theme-input" style="width:100%;padding:11px;border-radius:12px;">${options}</select>
      <label class="swal-field-label">Ke Dompet</label>
      <select id="swal-transfer-to" class="swal-theme-input" style="width:100%;padding:11px;border-radius:12px;">${options}</select>
      <label class="swal-field-label">Nominal</label>
      <input type="text" inputmode="numeric" id="swal-transfer-amount" class="swal-theme-input" placeholder="0" style="width:100%;padding:11px;border-radius:12px;font-weight:700;">
    `,
    showCancelButton: true,
    confirmButtonText: 'Transfer',
    cancelButtonText: 'Batal',
    focusConfirm: false,
    didOpen: (popup) => {
      const toSel = $('#swal-transfer-to', popup);
      toSel.selectedIndex = Math.min(1, DB.wallets.length - 1);
      const inp = $('#swal-transfer-amount', popup);
      inp.addEventListener('input', ()=>{ inp.value = formatAmountLive(inp.value); });
    },
    preConfirm: () => {
      const from = document.getElementById('swal-transfer-from').value;
      const to = document.getElementById('swal-transfer-to').value;
      const amount = parseAmountInput(document.getElementById('swal-transfer-amount').value);
      if(from === to){ Swal.showValidationMessage('Dompet asal dan tujuan harus berbeda'); return false; }
      if(!amount || amount <= 0){ Swal.showValidationMessage('Nominal harus lebih dari 0'); return false; }
      const wallet = DB.wallets.find(w=>w.id===from);
      if(amount > wallet.balance){ Swal.showValidationMessage(`Saldo ${wallet.name} tidak cukup`); return false; }
      return { from, to, amount };
    }
  });
  if(value) executeTransfer(value.from, value.to, value.amount);
}

function executeTransfer(fromId, toId, amount){
  const groupId = uid('trf');
  const fromW = DB.wallets.find(w=>w.id===fromId);
  const toW = DB.wallets.find(w=>w.id===toId);
  const date = localDateStr(), time = localTimeStr();
  DB.transactions.unshift({ id: uid('tx'), walletId: fromId, type: 'expense', date, time, description: `Transfer ke ${toW.name}`, amount, source: 'transfer-out', relatedId: groupId, createdAt: Date.now() });
  DB.transactions.unshift({ id: uid('tx'), walletId: toId, type: 'income', date, time, description: `Transfer dari ${fromW.name}`, amount, source: 'transfer-in', relatedId: groupId, createdAt: Date.now() });
  applyBalanceDelta(fromId, -amount);
  applyBalanceDelta(toId, amount);
  saveDB();
  renderAll();
  notify(`Transfer ke ${toW.name} berhasil`);
}

async function openSearchDialog(){
  const walletOptions = `<option value="all">Semua Dompet</option>` + DB.wallets.map(w=>`<option value="${w.id}">${escapeHtml(w.name)}</option>`).join('');
  await swalFire({
    title: 'Cari Transaksi',
    html: `
      <input type="text" id="swal-search-q" class="swal-theme-input" placeholder="Kata kunci keterangan atau nominal" autocomplete="off" style="width:100%;padding:11px;border-radius:12px;margin-bottom:10px;">
      <select id="swal-search-wallet" class="swal-theme-input" style="width:100%;padding:11px;border-radius:12px;">${walletOptions}</select>
      <div id="swal-search-results" style="margin-top:14px;max-height:280px;overflow-y:auto;"></div>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Tutup',
    didOpen: (popup) => {
      const q = $('#swal-search-q', popup);
      const walletSel = $('#swal-search-wallet', popup);
      const resultsEl = $('#swal-search-results', popup);

      function runSearch(){
        const term = q.value.trim().toLowerCase();
        const walletFilter = walletSel.value;
        let txs = DB.transactions.slice();
        if(walletFilter !== 'all') txs = txs.filter(t=>t.walletId===walletFilter);
        if(term){
          const amountDigits = term.replace(/[^0-9]/g,'');
          txs = txs.filter(t=> t.description.toLowerCase().includes(term) || (amountDigits && String(t.amount).includes(amountDigits)));
        }
        txs = sortTxDesc(txs).slice(0,40);
        if(!term && walletFilter === 'all'){
          resultsEl.innerHTML = `<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:16px 0;">Ketik kata kunci atau pilih dompet untuk mencari</p>`;
          return;
        }
        if(!txs.length){
          resultsEl.innerHTML = `<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:16px 0;">Tidak ditemukan</p>`;
          return;
        }
        resultsEl.innerHTML = `<div class="list-container">` + txs.map(txRowHtml).join('') + `</div>`;
        $all('[data-tx-id]', resultsEl).forEach(row=>{
          row.addEventListener('click', ()=>{
            const tx = DB.transactions.find(t=>t.id===row.getAttribute('data-tx-id'));
            Swal.close();
            if(tx) openTxActionPopup(tx);
          });
        });
      }
      q.addEventListener('input', debounce(runSearch, 200));
      walletSel.addEventListener('change', runSearch);
      runSearch();
    }
  });
}

/* ---------------------------------------------------------------------- */
/* 12. NAVIGASI & INISIALISASI                                              */
/* ---------------------------------------------------------------------- */
let currentPage = 'home';
let hutangDraft = { date: localDateStr(), time: localTimeStr() };
let piutangDraft = { date: localDateStr(), time: localTimeStr() };

function goToPage(pageKey){
  $all('.page').forEach(p=>p.classList.remove('page--active'));
  document.getElementById('page-' + pageKey).classList.add('page--active');
  $all('.bottom-nav__item').forEach(btn=>{
    btn.classList.toggle('is-active', btn.getAttribute('data-nav') === pageKey);
  });
  positionNavIndicator(pageKey);
  const main = document.getElementById('app-main');
  if(main) main.scrollTop = 0;
  currentPage = pageKey;
}

function positionNavIndicator(pageKey){
  const indicator = $('#nav-indicator');
  const order = ['history','debt','charts','invoice'];
  const idx = order.indexOf(pageKey);
  if(idx === -1){ indicator.classList.remove('is-visible'); return; }
  indicator.classList.add('is-visible');
  indicator.style.transform = `translateX(${idx * 100}%)`;
}

function handleNavigate(page){
  if(page === 'history'){ renderHistory(); goToPage('history'); }
  else if(page === 'debt'){ renderDebtList(); renderPiutangList(); goToPage('debt'); }
  else if(page === 'charts'){ goToPage('charts'); renderChart(); }
  else if(page === 'invoice'){ goToPage('invoice'); renderInvoicePreview(); }
}

function renderAll(){
  renderWalletCard();
  renderHomeSummary();
  if(currentPage === 'category-detail') renderCategoryDetail();
  if(currentPage === 'history') renderHistory();
  if(currentPage === 'debt'){ renderDebtList(); renderPiutangList(); }
  if(currentPage === 'charts') renderChart();
  if(currentPage === 'invoice') renderInvoicePreview();
}

function updateHutangDraftUI(){
  $('#hutang-date-value').textContent = isToday(hutangDraft.date) ? 'Hari ini' : formatDateID(hutangDraft.date);
  $('#hutang-time-value').textContent = hutangDraft.time;
}
function updatePiutangDraftUI(){
  $('#piutang-date-value').textContent = isToday(piutangDraft.date) ? 'Hari ini' : formatDateID(piutangDraft.date);
  $('#piutang-time-value').textContent = piutangDraft.time;
}

function wireStaticEvents(){
  $('#btn-home').addEventListener('click', ()=> goToPage('home'));
  $('#btn-options').addEventListener('click', openOptionsMenu);

  $('#wallet-card').addEventListener('click', openWalletPicker);
  $('#summary-income').addEventListener('click', ()=> openCategoryDetail('income'));
  $('#summary-expense').addEventListener('click', ()=> openCategoryDetail('expense'));

  $('#field-date').addEventListener('click', async ()=>{
    const v = await pickDate(draftTx.date);
    if(v){ draftTx.date = v; updateEntryFormUI(); }
  });
  $('#field-time').addEventListener('click', async ()=>{
    const v = await pickTime(draftTx.time);
    if(v){ draftTx.time = v; updateEntryFormUI(); }
  });
  $('#field-category').addEventListener('click', async ()=>{
    const v = await pickCategoryValue(draftTx.category);
    if(v) setEntryCategory(v);
  });
  $('#field-description').addEventListener('click', ()=>{
    openDescriptionPicker(draftTx.category, (desc)=> setEntryDescription(desc));
  });
  $('#field-amount').addEventListener('input', (e)=>{ e.target.value = formatAmountLive(e.target.value); });

  $('#entry-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const amount = parseAmountInput($('#field-amount').value);
    if(!amount){ notify('Nominal transaksi harus diisi', 'error'); return; }
    if(!draftTx.description){ notify('Pilih atau tambahkan keterangan transaksi', 'error'); return; }
    const wallet = getSelectedWallet();
    const tx = {
      id: uid('tx'), walletId: wallet.id, type: draftTx.category,
      date: draftTx.date, time: draftTx.time, description: draftTx.description,
      amount, source: 'manual', relatedId: null, createdAt: Date.now()
    };
    DB.transactions.unshift(tx);
    applyBalanceDelta(wallet.id, draftTx.category === 'income' ? amount : -amount);
    if(!DB.descriptions[draftTx.category].includes(draftTx.description)) DB.descriptions[draftTx.category].unshift(draftTx.description);
    saveDB();
    resetEntryForm();
    renderWalletCard();
    renderHomeSummary();
    notify('Transaksi tersimpan');
  });

  $('#btn-back-category').addEventListener('click', ()=> goToPage('home'));
  $('#btn-filter-category').addEventListener('click', async ()=>{
    const res = await pickDateRangeDialog(categoryDetailCtx.range);
    if(res.mode === 'range') categoryDetailCtx.range = { from: res.from, to: res.to };
    else if(res.mode === 'all') categoryDetailCtx.range = null;
    else return;
    renderCategoryDetail();
  });

  $('#btn-filter-history').addEventListener('click', async ()=>{
    const res = await pickDateRangeDialog(historyRange);
    if(res.mode === 'range') historyRange = { from: res.from, to: res.to };
    else if(res.mode === 'all') historyRange = null;
    else return;
    renderHistory();
  });

  $all('#debt-segmented .segmented__btn').forEach((btn, i)=>{
    btn.addEventListener('click', ()=>{
      $all('#debt-segmented .segmented__btn').forEach(b=>b.classList.remove('segmented__btn--active'));
      btn.classList.add('segmented__btn--active');
      $('#debt-segmented .segmented__indicator').style.transform = `translateX(${i*100}%)`;
      $all('.debt-panel').forEach(p=>p.classList.remove('debt-panel--active'));
      document.getElementById('panel-' + btn.dataset.panel).classList.add('debt-panel--active');
    });
  });

  $('#hutang-date').addEventListener('click', async ()=>{
    const v = await pickDate(hutangDraft.date);
    if(v){ hutangDraft.date = v; updateHutangDraftUI(); }
  });
  $('#hutang-time').addEventListener('click', async ()=>{
    const v = await pickTime(hutangDraft.time);
    if(v){ hutangDraft.time = v; updateHutangDraftUI(); }
  });
  $('#hutang-amount').addEventListener('input', (e)=>{ e.target.value = formatAmountLive(e.target.value); });
  $('#form-hutang').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = $('#hutang-name').value.trim();
    const amount = parseAmountInput($('#hutang-amount').value);
    if(!name){ notify('Nama wajib diisi', 'error'); return; }
    if(!amount){ notify('Nominal wajib diisi', 'error'); return; }
    addDebtOrReceivable('debt', { name, amount, date: hutangDraft.date, time: hutangDraft.time });
    $('#hutang-name').value = ''; $('#hutang-amount').value = '';
    hutangDraft = { date: localDateStr(), time: localTimeStr() };
    updateHutangDraftUI();
    renderWalletCard(); renderHomeSummary(); renderDebtList();
    notify('Hutang tersimpan');
  });

  $('#piutang-date').addEventListener('click', async ()=>{
    const v = await pickDate(piutangDraft.date);
    if(v){ piutangDraft.date = v; updatePiutangDraftUI(); }
  });
  $('#piutang-time').addEventListener('click', async ()=>{
    const v = await pickTime(piutangDraft.time);
    if(v){ piutangDraft.time = v; updatePiutangDraftUI(); }
  });
  $('#piutang-amount').addEventListener('input', (e)=>{ e.target.value = formatAmountLive(e.target.value); });
  $('#form-piutang').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = $('#piutang-name').value.trim();
    const amount = parseAmountInput($('#piutang-amount').value);
    if(!name){ notify('Nama wajib diisi', 'error'); return; }
    if(!amount){ notify('Nominal wajib diisi', 'error'); return; }
    addDebtOrReceivable('receivable', { name, amount, date: piutangDraft.date, time: piutangDraft.time });
    $('#piutang-name').value = ''; $('#piutang-amount').value = '';
    piutangDraft = { date: localDateStr(), time: localTimeStr() };
    updatePiutangDraftUI();
    renderWalletCard(); renderHomeSummary(); renderPiutangList();
    notify('Piutang tersimpan');
  });

  $all('#chart-type-segmented .segmented__btn').forEach((btn, i)=>{
    btn.addEventListener('click', ()=>{
      $all('#chart-type-segmented .segmented__btn').forEach(b=>b.classList.remove('segmented__btn--active'));
      btn.classList.add('segmented__btn--active');
      $('#chart-type-segmented .segmented__indicator').style.transform = `translateX(${i*100}%)`;
      chartType = btn.dataset.chart;
      renderChart();
    });
  });
  $('#btn-filter-chart').addEventListener('click', async ()=>{
    const res = await pickDateRangeDialog(chartRange);
    if(res.mode === 'range') chartRange = { from: res.from, to: res.to };
    else if(res.mode === 'all') chartRange = getTxDateBounds();
    else return;
    renderChart();
  });

  $('#btn-filter-invoice').addEventListener('click', async ()=>{
    const res = await pickDateRangeDialog(invoiceRange);
    if(res.mode === 'range') invoiceRange = { from: res.from, to: res.to };
    else if(res.mode === 'all') invoiceRange = getTxDateBounds();
    else return;
    renderInvoicePreview();
  });
  $('#btn-generate-invoice').addEventListener('click', generateInvoicePdf);

  $all('.bottom-nav__item').forEach(btn=>{
    btn.addEventListener('click', ()=> handleNavigate(btn.getAttribute('data-nav')));
  });
}

/** Jaring pengaman kedua untuk bug "landscape palsu saat keyboard terbuka":
    membandingkan tinggi visualViewport (area yang benar-benar terlihat, tidak
    termasuk keyboard) dengan tinggi window. Jika bedanya besar, keyboard
    dianggap terbuka -> paksa tata letak satu kolom lewat class body.kb-open. */
function setupKeyboardWatcher(){
  if(!window.visualViewport) return;
  const vv = window.visualViewport;
  function handleResize(){
    const shrink = window.innerHeight - vv.height;
    document.body.classList.toggle('kb-open', shrink > 120);
  }
  vv.addEventListener('resize', handleResize);
  handleResize();
}

function init(){
  loadDB();
  if(DB.settings.theme === 'dark') document.body.classList.add('dark');
  syncStatusBarColor();
  wireStaticEvents();
  setupKeyboardWatcher();
  resetEntryForm();
  updateHutangDraftUI();
  updatePiutangDraftUI();
  renderWalletCard();
  renderHomeSummary();
  goToPage('home');
  if(!STORAGE_AVAILABLE){
    notify('Penyimpanan browser tidak tersedia. Data tidak akan tersimpan permanen di perangkat ini.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);
