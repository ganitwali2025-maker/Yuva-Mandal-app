
/* ======================= STATE ======================= */
const STORAGE_KEY = 'yuva_mandal_settings_v1';
const CACHE_KEY = 'yuva_mandal_cache_v1';

let settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
if (!settings.mandalName || settings.mandalName === 'Yuva Vikas Mandal') settings.mandalName = 'YUVA MITRA MANDAL';
if (!settings.village || settings.village === 'आपका गाँव / शहर') settings.village = 'श्री बजरंग युवा गणेश उत्सव समिति';
settings.scriptUrl = settings.scriptUrl || '';
settings.monthlyMashikJamaAmt = settings.monthlyMashikJamaAmt || 100;

let DB = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') || { members: [], mashikJama: [], sahyog: [], expense: [] };
DB.mashikJama = DB.mashikJama || DB.chanda || [];
delete DB.chanda;

let route = { page: 'home' };
let connState = settings.scriptUrl ? 'connecting' : 'offline';

/* ======================= HELPERS ======================= */
function fmt(n){ n = Number(n)||0; return '₹' + n.toLocaleString('en-IN'); }
function initials(name){
  if(!name) return '?';
  const p = name.trim().split(/\s+/);
  return (p[0][0] + (p[1]?p[1][0]:'')).toUpperCase();
}
function todayStr(){ return new Date().toISOString().slice(0,10); }
function fdate(d){
  if(!d) return '-';
  const dt = new Date(d);
  if(isNaN(dt)) return String(d).slice(0,10);
  return dt.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}
function saveCache(){ localStorage.setItem(CACHE_KEY, JSON.stringify(DB)); }
function saveSettings(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }

function totals(){
  const income = DB.mashikJama.reduce((s,r)=>s+Number(r.Amount||r['राशि (₹)']||0),0) + DB.sahyog.reduce((s,r)=>s+Number(r.Amount||0),0);
  const expense = DB.expense.reduce((s,r)=>s+Number(r.Amount||0),0);
  const balance = income - expense;
  const mashikJamaTotal = DB.mashikJama.reduce((s,r)=>s+Number(r.Amount||r['राशि (₹)']||0),0);
  const sahyogTotal = DB.sahyog.reduce((s,r)=>s+Number(r.Amount||0),0);
  return {income, expense, balance, mashikJamaTotal, sahyogTotal};
}

/* ======================= BACKEND SYNC ======================= */
async function syncAll(){
  if(!settings.scriptUrl){ connState='offline'; render(); return; }
  connState = 'connecting'; render();
  try{
    const res = await fetch(settings.scriptUrl + '?action=all&t=' + Date.now());
    const data = await res.json();
    if(data.ok){
      DB = { members:data.members||[], mashikJama:data.mashikJama||[], sahyog:data.sahyog||[], expense:data.expense||[] };
      saveCache();
      connState = 'online';
    } else {
      connState = 'error';
    }
  }catch(err){
    connState = 'error';
  }
  render();
}

async function pushRow(type, data){
  if(!settings.scriptUrl){
    // offline fallback: keep locally only
    const key = {member:'members',mashikJama:'mashikJama',sahyog:'sahyog',expense:'expense'}[type];
    const id = (DB[key].reduce((m,r)=>Math.max(m,Number(r.ID)||0),0)) + 1;
    DB[key].push(Object.assign({ID:id}, data));
    saveCache();
    return {ok:true, offline:true};
  }
  try{
    const res = await fetch(settings.scriptUrl, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify({type, data})
    });
    const out = await res.json();
    if(out.ok){ await syncAll(); }
    return out;
  }catch(err){
    return {ok:false, error:String(err)};
  }
}

/* ======================= RENDER ROOT ======================= */
function render(){
  const app = document.getElementById('app');
  app.innerHTML = pageTemplate();
  bindEvents();
}

function navBar(active){
  const items = [
    {k:'home', ic:'home', label:'होम'},
    {k:'members', ic:'group', label:'सदस्य'},
    {k:'mashikJama', ic:'currency_rupee', label:'लेन-देन'},
    {k:'reports', ic:'bar_chart', label:'रिपोर्ट'},
    {k:'settings', ic:'settings', label:'सेटिंग'},
  ];
  return `<div class="bottom-nav">
    ${items.map(i=>`<button class="nav-item ${active===i.k?'active':''}" data-nav="${i.k}">
      <span class="nic material-symbols-outlined">${i.ic}</span><span>${i.label}</span>
    </button>`).join('')}
  </div>`;
}

function pageTemplate(){
  switch(route.page){
    case 'home': return homePage();
    case 'members': return membersPage();
    case 'idcard': return idCardPage(route.id);
    case 'mashikJama': return chandaPage();
    case 'sahyog': return sahyogPage();
    case 'expense': return expensePage();
    case 'reports': return reportsPage();
    case 'settings': return settingsPage();
    case 'addMember': return addMemberForm();
    default: return homePage();
  }
}

/* ======================= HOME ======================= */
function homePage(){
  const t = totals();
  const recent = [
    ...DB.mashikJama.map(r=>({...r, _type:'mashikJama', _date:r.Date || r['दिनांक']})),
    ...DB.sahyog.map(r=>({...r, _type:'sahyog', _date:r.Date})),
    ...DB.expense.map(r=>({...r, _type:'expense', _date:r.Date})),
  ].sort((a,b)=> new Date(b._date) - new Date(a._date)).slice(0,5);

  let greetMsg = connState==='online' ? 'Google Sheet से जुड़ा हुआ है' : connState==='connecting' ? 'जोड़ा जा रहा है...' : connState==='error' ? 'कनेक्शन में समस्या — Settings देखें' : 'Offline मोड (<b>Settings</b> में Sheet जोड़ें)';

  return `
  <div class="header-wrap">
    <div class="header-top">
      <div class="brand">
        <img src="/images.jpg" alt="Logo" class="profile-ic" style="object-fit:cover; padding:0; background:none; border:2px solid var(--primary-orange);">
        <div class="brand-name" style="font-size:18px; line-height:1.4;">${settings.village}</div>
      </div>
      <div class="header-actions" style="display: flex; gap: 8px;">
        <button class="icon-btn"><span class="material-symbols-outlined">notifications</span></button>
        <button class="icon-btn"><span class="material-symbols-outlined">person</span></button>
      </div>
    </div>
    <div class="greet">
      <div style="font-size:14px; font-weight:700; color:#FFD700; margin-bottom:4px; letter-spacing:0.5px;">श्री गणेशाय नमः</div>
      <h1 style="margin-top:0;">नमस्ते, साथियों 👋</h1>
    </div>
    <div class="header-wave"></div>
  </div>

  <div class="balance-card">
    <div class="balance-top">
      <div>
        <div class="balance-label">कुल बैलेंस (Total Balance)</div>
        <div class="balance-amt">${fmt(t.balance)}</div>
      </div>
      <button class="btn-view" data-nav="reports"><span class="material-symbols-outlined" style="font-size:16px;">visibility</span> देखें</button>
    </div>
    <div class="balance-split">
      <div class="split-item in">
        <div class="split-ic"><span class="material-symbols-outlined" style="font-size:20px;">trending_up</span></div>
        <div class="split-text">
          <div class="lbl">कुल आय</div>
          <div class="val">${fmt(t.income)}</div>
        </div>
        <span class="material-symbols-outlined split-watermark">account_balance_wallet</span>
      </div>
      <div class="split-item out">
        <div class="split-ic"><span class="material-symbols-outlined" style="font-size:20px;">trending_down</span></div>
        <div class="split-text">
          <div class="lbl">कुल खर्च</div>
          <div class="val">${fmt(t.expense)}</div>
        </div>
        <span class="material-symbols-outlined split-watermark">download</span>
      </div>
    </div>
  </div>

  <div class="content">

    <div class="services-grid">
      ${serviceIcon('members','groups','orange','सदस्य सूची')}
      ${serviceIcon('addMember','person_add','purple','नया सदस्य')}
      ${serviceIcon('mashikJama','account_balance_wallet','green','मासिक जमा')}
      ${serviceIcon('sahyog','volunteer_activism','blue','चंदा/योगदान')}
      ${serviceIcon('expense','receipt_long','red','खर्च दर्ज')}
      ${serviceIcon('reports','description','teal','रिपोर्ट देखें')}
      ${serviceIcon('reports','pie_chart','violet','लेन-देन देखें')}
    </div>


    ${recent.length===0 ? `<div class="empty">
      <div class="e-ic"><span class="material-symbols-outlined">assignment</span></div>
      <strong>अभी कोई एंट्री नहीं है</strong>
      लेन-देन जोड़ें और यहां देखें
    </div>` :
      `<div class="card-list">
        ${recent.map(r=>activityRow(r)).join('')}
      </div>`
    }
  </div>
  ${navBar('home')}
  `;
}

function serviceIcon(page, ic, colorClass, label){
  return `<button class="service ${colorClass}" data-nav="${page}">
    <div class="ic-box"><div class="material-symbols-outlined">${ic}</div></div>
    <span>${label}</span>
  </button>`;
}

function activityRow(r){
  const isIncome = r._type !== 'expense';
  const title = r._type==='mashikJama' ? (r['सदस्य का नाम'] || 'सदस्य') + ' — मासिक जमा'
              : r._type==='sahyog' ? (r.DonorName || 'सहयोग') + ' — सहयोग'
              : (r.Category || 'खर्च');
  const sub = r._type==='mashikJama' ? `${r['माह']||''} · ${fdate(r._date)}`
            : r._type==='sahyog' ? `${r.Purpose||''} · ${fdate(r._date)}`
            : `${r.Description||''} · ${fdate(r._date)}`;
  return `<div class="row-card">
    <div class="avatar" style="background:${isIncome?'var(--green-bg)':'var(--red-bg)'};color:${isIncome?'var(--green)':'var(--red)'}">${isIncome?'↑':'↓'}</div>
    <div class="row-main"><div class="t1">${title}</div><div class="t2">${sub}</div></div>
    <div class="row-amt ${isIncome?'in':'out'}">${isIncome?'+':'-'}${fmt(r.Amount || r['राशि (₹)'])}</div>
  </div>`;
}

/* ======================= MEMBERS ======================= */
function membersPage(){
  const q = (route.q||'').toLowerCase();
  const list = DB.members.filter(m => !q || (m.Name||'').toLowerCase().includes(q) || String(m.ID).includes(q));
  return `
  <div class="page-head" style="background: #311b92; color: white; padding: 24px 20px 40px; border-radius: 0 0 20px 20px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap: 12px;">
        <button class="back-btn" data-nav="home" style="background: rgba(255,255,255,0.15); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
        <div><h1 style="color:white; font-size:18px; margin:0;">सदस्य चुनें</h1><p style="color:rgba(255,255,255,0.8); font-size:12px; margin:0;">कुल सदस्य: ${DB.members.length}</p></div>
      </div>
      <span class="material-symbols-outlined" style="color:white;">group</span>
    </div>
  </div>
  <div class="search-bar" style="margin: -24px 20px 20px; background: white; padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); gap: 10px;">
    <span class="material-symbols-outlined" style="color:#64748b;font-size:20px;">search</span>
    <input id="memberSearch" placeholder="नाम से खोजें..." value="${route.q||''}" style="border:none; outline:none; flex:1; font-family:inherit; font-size:14px; background:transparent; color:#1e293b;">
    <span class="material-symbols-outlined" style="color:#64748b;font-size:20px;">filter_alt</span>
  </div>
  
  <div style="padding: 0 20px 12px; display: flex; justify-content: space-between; align-items: center;">
    <h3 style="margin:0; font-size: 15px; font-weight: 700; color: #311b92;">सदस्य सूची</h3>
    <span style="font-size: 12px; color: #64748b;">कुल ${DB.members.length} सदस्य</span>
  </div>

  <div class="content" style="padding-top:0;">
    ${list.length===0 ? `<div class="empty"><div class="e-ic"><span class="material-symbols-outlined" style="font-size:36px;color:var(--muted)">groups</span></div>अभी कोई सदस्य नहीं जुड़ा<br><br><button class="btn-primary" style="width:auto;padding:10px 20px;display:flex;align-items:center;margin:0 auto;" data-nav="addMember"><span class="material-symbols-outlined" style="margin-right:6px;font-size:18px;">person_add</span>सदस्य जोड़ें</button></div>` :
      `<div class="card-list">
        ${list.map(m=>`
          <div class="row-card" data-nav="idcard" data-id="${m.ID}" style="background: white; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); border: none;">
            <div class="avatar" style="width: 48px; height: 48px; border-radius: 50%; background: #ede9fe; color: #311b92; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
              ${m.Photo ? `<img src="${m.Photo}" style="width: 100%; height: 100%; object-fit: cover;">` : initials(m.Name)}
            </div>
            <div class="row-main" style="flex: 1;">
              <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 4px;">${m.Name}</div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="background: #ede9fe; color: #311b92; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">पद:</span>
                <span style="font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase;">${m.Pad||'SADSIYA'}</span>
              </div>
            </div>
            <div style="color: #311b92; font-size: 20px; display: flex; align-items: center;"><span class="material-symbols-outlined">chevron_right</span></div>
          </div>`).join('')}
      </div>`
    }
  </div>
  <button class="fab" data-nav="addMember" style="background: #311b92; box-shadow: 0 4px 12px rgba(49,27,146,0.3); border-radius: 50%;"><span class="material-symbols-outlined">add</span></button>
  ${navBar('members')}

  `;
}

function addMemberForm(){
  return `
  <style>
  .add-member-page { background: #f4f6f8; min-height: 100vh; padding-bottom: 80px; }
  .photo-card {
    background: #fff; border-radius: 16px; padding: 24px; text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin: -20px 20px 20px; position: relative; z-index: 10;
  }
  .photo-wrap {
    width: 90px; height: 90px; border-radius: 50%; background: #5c32b5; margin: 0 auto 12px;
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .photo-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .photo-wrap .cam-ic {
    position: absolute; bottom: 0; right: 0; background: #5c32b5; color: #fff; border: 2px solid #fff;
    width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  }
  .photo-title { color: #5c32b5; font-weight: 700; font-size: 15px; cursor: pointer; display: block; }
  .photo-sub { color: #64748b; font-size: 12px; margin-top: 4px; }

  .form-card {
    background: #fff; border-radius: 16px; padding: 20px; margin: 0 20px 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
  .new-field { margin-bottom: 20px; }
  .new-field label { display: block; font-weight: 600; color: #1e293b; font-size: 13px; margin-bottom: 8px; }
  .new-field label span { color: red; }
  .new-input-wrap {
    display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; transition: 0.2s;
  }
  .new-input-wrap:focus-within { border-color: #5c32b5; box-shadow: 0 0 0 3px rgba(92,50,181,0.1); }
  .new-input-ic {
    width: 44px; height: 44px; background: #f3f0ff; color: #5c32b5;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .new-input-wrap input, .new-input-wrap select {
    flex: 1; border: none; outline: none; padding: 0 12px; height: 44px; font-size: 14px; font-family: inherit; background: transparent; color: #1e293b;
  }
  .save-btn-new {
    width: 100%; padding: 14px; background: #5c32b5; color: #fff; border: none; border-radius: 12px;
    font-weight: 600; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
  }
  .save-btn-new:disabled { opacity: 0.7; }
  </style>
  <div class="add-member-page">
    <div class="page-head" style="padding-bottom: 40px; justify-content: space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="back-btn" data-nav="members"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
        <div><h1>नया सदस्य जोड़ें</h1><p>Member Details भरें</p></div>
      </div>
      <span class="material-symbols-outlined" style="font-size:28px;">badge</span>
    </div>
    
    <div class="photo-card">
      <label class="photo-title">
        <div class="photo-wrap" id="photo_preview_wrap">
          <span class="material-symbols-outlined" style="color:#fff;font-size:40px;">person</span>
          <div class="cam-ic"><span class="material-symbols-outlined" style="font-size:16px;">photo_camera</span></div>
        </div>
        फोटो चुनें
        <input type="file" id="f_photo" accept="image/*" style="display: none;">
      </label>
      <div class="photo-sub">JPG, PNG (Max 2MB)</div>
      <input type="hidden" id="f_photo_b64" value="">
    </div>

    <div class="form-card">
      <div class="new-field">
        <label>पूरा नाम (Full Name) <span>*</span></label>
        <div class="new-input-wrap">
          <div class="new-input-ic"><span class="material-symbols-outlined">person</span></div>
          <input id="f_name" placeholder="जैसे: लोकेश वर्मा">
        </div>
      </div>
      <div class="new-field">
        <label>पद (Position) <span>*</span></label>
        <div class="new-input-wrap">
          <div class="new-input-ic"><span class="material-symbols-outlined">work</span></div>
          <input id="f_pad" placeholder="जैसे: अध्यक्ष, सदस्य">
        </div>
      </div>
      <div class="new-field">
        <label>आयु (Age) <span>*</span></label>
        <div class="new-input-wrap">
          <div class="new-input-ic"><span class="material-symbols-outlined">cake</span></div>
          <input id="f_age" type="number" placeholder="जैसे: 25">
        </div>
      </div>
      <div class="new-field">
        <label>मोबाइल नंबर (Mobile Number) <span>*</span></label>
        <div class="new-input-wrap">
          <div class="new-input-ic"><span class="material-symbols-outlined">call</span></div>
          <input id="f_mobile" type="tel" maxlength="10" placeholder="10 अंकों का नंबर दर्ज करें">
        </div>
      </div>
      <div class="new-field">
        <label>पता (Address)</label>
        <div class="new-input-wrap">
          <div class="new-input-ic"><span class="material-symbols-outlined">location_on</span></div>
          <input id="f_address" placeholder="पूरा पता दर्ज करें">
        </div>
      </div>
      <div class="new-field">
        <label>स्टेटस (Status) <span>*</span></label>
        <div class="new-input-wrap">
          <div class="new-input-ic"><span class="material-symbols-outlined">verified</span></div>
          <select id="f_status"><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
        </div>
      </div>
      <button class="save-btn-new" id="saveMemberBtn">
        <span class="material-symbols-outlined">save</span> सदस्य सेव करें
      </button>
    </div>
    ${navBar('members')}
  </div>
  `;
}

/* ======================= ID CARD ======================= */
function idCardPage(id){
  const m = DB.members.find(x=>String(x.ID)===String(id)) || {ID:'—', Name:'Devendra Nishad', Mobile:'79743 59208', Village:'ग्राम पंचायत नगरगांव धरसींवा रायपुर छत्तीसगढ़ - 493111', JoinDate:todayStr()};
  const paid = DB.mashikJama.filter(c=>String(c.MemberID)===String(m.ID) || String(c['सदस्य का नाम'])===String(m.Name)).reduce((s,r)=>s+Number(r.Amount||r['राशि (₹)']||0),0);
  return `
  <div class="page-head">
    <button class="back-btn" data-nav="members"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
    <div><h1>सदस्य पहचान पत्र</h1><p>Member ID Card</p></div>
  </div>
  <div class="idcard-wrap">
    <div class="new-idcard">
      <div class="new-idcard-header">
        <div class="new-idcard-logo" style="width: 54px; height: 54px; margin-bottom: 6px; border-radius: 50%; overflow: hidden; background: #fff; border: 3px solid #fff; box-shadow: 0 3px 8px rgba(0,0,0,0.15); flex-shrink: 0;">
          <img src="/logo.png" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="new-idcard-header-text">
          <h2>जय बजरंग युवा गणेश उत्सव समिति</h2>
          <p>एकता • सेवा • संस्कार • विकास</p>
        </div>
      </div>
      
      <div class="new-idcard-body">
        <div class="new-idcard-photo-container">
          <img src="${m.Photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.Name)}&background=f1f5f9&color=64748b&size=120`}" alt="Profile" />
        </div>
        
        <div class="new-idcard-details">
          <div class="new-idcard-row">
            <div class="new-idcard-icon-label">
              <div class="new-idcard-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <span class="label">नाम</span>
            </div>
            <div class="new-idcard-separator"></div>
            <div class="new-idcard-value">${m.Name}</div>
          </div>
          
          <div class="new-idcard-row">
            <div class="new-idcard-icon-label">
              <div class="new-idcard-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              </div>
              <span class="label">पद</span>
            </div>
            <div class="new-idcard-separator"></div>
            <div class="new-idcard-value highlight-orange">${m.Pad || 'सदस्य'}</div>
          </div>
          
          <div class="new-idcard-row">
            <div class="new-idcard-icon-label">
              <div class="new-idcard-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <span class="label">आयु</span>
            </div>
            <div class="new-idcard-separator"></div>
            <div class="new-idcard-value">${m.Age || '-'}</div>
          </div>
          
          <div class="new-idcard-row">
            <div class="new-idcard-icon-label">
              <div class="new-idcard-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <span class="label">मोबाइल</span>
            </div>
            <div class="new-idcard-separator"></div>
            <div class="new-idcard-value">${m.Mobile}</div>
          </div>
        </div>
      </div>
      
      <div class="new-idcard-footer">
        <span style="font-weight: 700; font-size: 13px;">पता - ग्राम पोस्ट - नगरगांव, धरसींवा, रायपुर - 493111</span>
      </div>
    <!-- Total Chanda section removed as requested -->
  </div>
  ${navBar('members')}
  `;
}

/* ======================= CHANDA ======================= */
function chandaPage(){
  return `
  <style>
    .pay-mode-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; padding:12px; border:1px solid #cbd5e1; background:#fff; border-radius:8px; cursor:pointer; position:relative; transition: all 0.2s; }
    .pay-mode-btn.active { border-color: #311b92; background: #f5f3ff; }
    .pay-mode-btn .pm-radio { position:absolute; top:8px; left:8px; width:16px; height:16px; border-radius:50%; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; transition: all 0.2s; }
    .pay-mode-btn.active .pm-radio { border-color: #311b92; }
    .pay-mode-btn .pm-radio-inner { width:8px; height:8px; border-radius:50%; background:transparent; transition: all 0.2s; }
    .pay-mode-btn.active .pm-radio-inner { background: #311b92; }
    .pay-mode-btn .pm-icon { font-size:28px; color:#64748b; font-weight:bold; transition: all 0.2s; }
    .pay-mode-btn.active .pm-icon { color: #311b92; }
    .pay-mode-btn .pm-text { font-size:13px; font-weight:600; color:#64748b; transition: all 0.2s; }
    .pay-mode-btn.active .pm-text { color: #311b92; }
  </style>
  <div class="page-head" style="background: #311b92; color: white; padding: 16px 20px 24px; border-radius: 0 0 16px 16px; display: flex; align-items: center; gap: 16px;">
    <button class="back-btn" data-nav="home" style="background: rgba(255,255,255,0.15); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined">arrow_back</span></button>
    <h1 style="color:white; font-size:20px; margin:0; font-weight: 700;">मासिक जमा</h1>
  </div>
  
  <div class="content" style="padding: 20px; background: #f8fafc; min-height: calc(100vh - 80px);">
    <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
      
      <div style="margin-bottom: 20px;">
        <label style="display:block; font-size:14px; font-weight:700; color:#1e293b; margin-bottom:8px;">1. सदस्य चुनें <span style="color:red;">*</span></label>
        <div style="position:relative;">
          <span class="material-symbols-outlined" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#64748b;">person</span>
          <select id="c_member" style="width:100%; padding:12px 12px 12px 40px; border:1px solid #311b92; border-radius:8px; font-family:inherit; font-size:14px; background:#fff; appearance:none; outline:none; box-shadow:0 2px 8px rgba(49,27,146,0.05); color:#1e293b; font-weight: 500;">
            <option value="">सदस्य का नाम चुनें...</option>
            ${DB.members.map(m=>`<option value="${m.ID}">${m.Name}</option>`).join('')}
          </select>
          <span class="material-symbols-outlined" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#64748b; pointer-events:none;">expand_more</span>
        </div>
      </div>

      <div id="c_member_details" style="display:none; background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;">
        <h4 style="margin:0 0 12px 0; color:#311b92; font-size:14px; font-weight: 700;">सदस्य विवरण</h4>
        <div style="display:flex; align-items:center; gap:16px;">
          <div id="c_member_avatar" style="width:56px; height:56px; border-radius:50%; background:#ede9fe; color:#311b92; font-weight:bold; font-size:18px; display:flex; align-items:center; justify-content:center; overflow:hidden;"></div>
          <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:6px;">
              <span class="material-symbols-outlined" style="font-size:16px; color:#64748b;">person</span>
              <span style="font-size:12px; color:#64748b; width:36px;">नाम:</span>
              <span id="c_member_name" style="font-size:13px; font-weight:700; color:#1e293b;">-</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:6px;">
              <span class="material-symbols-outlined" style="font-size:16px; color:#64748b;">call</span>
              <span style="font-size:12px; color:#64748b; width:36px;">फोन:</span>
              <span id="c_member_phone" style="font-size:13px; font-weight:500; color:#1e293b;">-</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="material-symbols-outlined" style="font-size:16px; color:#64748b;">verified_user</span>
              <span style="font-size:12px; color:#64748b; width:36px;">पद:</span>
              <span id="c_member_pad" style="font-size:13px; font-weight:600; color:#1e293b; text-transform:uppercase;">-</span>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <label style="display:block; font-size:14px; font-weight:700; color:#1e293b; margin-bottom:8px;">2. माह <span style="color:red;">*</span></label>
        <div style="position:relative;">
          <span class="material-symbols-outlined" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#311b92;">calendar_month</span>
          <select id="c_month" style="width:100%; padding:12px 12px 12px 40px; border:1px solid #cbd5e1; border-radius:8px; font-family:inherit; font-size:14px; background:#fff; appearance:none; outline:none; color:#1e293b; font-weight:500;">
            <option value="">माह चुनें...</option>
            ${['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'].map((mm,i)=>`<option ${i===new Date().getMonth()?'selected':''}>${mm}</option>`).join('')}
          </select>
          <span class="material-symbols-outlined" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#64748b; pointer-events:none;">expand_more</span>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <label style="display:block; font-size:14px; font-weight:700; color:#1e293b; margin-bottom:8px;">3. राशि (₹) <span style="color:red;">*</span></label>
        <div style="position:relative;">
          <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); color:#1e293b; font-weight:bold; font-size:16px;">₹</span>
          <input id="c_amount" type="number" placeholder="राशि दर्ज करें" value="${settings.monthlyMashikJamaAmt}" style="width:100%; padding:12px 12px 12px 40px; border:1px solid #cbd5e1; border-radius:8px; font-family:inherit; font-size:14px; background:#fff; outline:none; color:#1e293b; font-weight:600;">
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <label style="display:block; font-size:14px; font-weight:700; color:#1e293b; margin-bottom:8px;">4. भुगतान माध्यम <span style="color:red;">*</span></label>
        <div style="display:flex; gap:12px;">
          <div class="pay-mode-btn active" data-mode="Cash">
            <div class="pm-radio"><div class="pm-radio-inner"></div></div>
            <span class="material-symbols-outlined pm-icon" style="font-size:32px;">payments</span>
            <span class="pm-text">नकद (Cash)</span>
          </div>
          <div class="pay-mode-btn" data-mode="UPI">
            <div class="pm-radio"><div class="pm-radio-inner"></div></div>
            <span class="pm-icon" style="font-size:28px; font-style:italic;">UPI</span>
            <span class="pm-text">यूपीआई (UPI)</span>
          </div>
        </div>
        <input type="hidden" id="c_mode" value="Cash">
      </div>
      
      <!-- Hidden fields to keep backend happy -->
      <input type="hidden" id="c_year" value="${new Date().getFullYear()}">
      <input type="hidden" id="c_date" value="${todayStr()}">

      <button id="saveChandaBtn" style="width:100%; background:#311b92; color:#fff; border:none; padding:14px; border-radius:8px; font-size:16px; font-weight:600; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(49,27,146,0.3); cursor:pointer;">
        <span class="material-symbols-outlined">save</span> सबमिट करें
      </button>
      
      <div style="text-align:center; margin-top:16px; display:flex; align-items:center; justify-content:center; gap:4px; color:#64748b;">
        <span class="material-symbols-outlined" style="font-size:14px;">lock</span> <span style="font-size:12px;">आपका डेटा सुरक्षित है</span>
      </div>
    </div>
  </div>
  `;
}

/* ======================= SAHYOG ======================= */
function sahyogPage(){
  const t = totals();
  return `
  <div class="page-head">
    <button class="back-btn" data-nav="home"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
    <div><h1>सहयोग / दान</h1><p>Sahyog & Donations</p></div>
  </div>
  <div class="content" style="padding-top:14px;">
    <div class="settings-box" style="margin:0 0 16px;">
      <h3>कुल सहयोग राशि</h3>
      <p style="margin-bottom:0;color:var(--green);font-family:Poppins;font-weight:800;font-size:22px;">${fmt(t.sahyogTotal)}</p>
    </div>
    <div class="field"><label>दानदाता / सदस्य का नाम</label><input id="s_donor" placeholder="नाम लिखें"></div>
    <div class="field"><label>उद्देश्य</label><input id="s_purpose" placeholder="जैसे: होली कार्यक्रम, त्यौहार आदि"></div>
    <div class="field"><label>राशि (₹)</label><input id="s_amount" type="number" placeholder="0"></div>
    <div class="field"><label>तारीख</label><input id="s_date" type="date" value="${todayStr()}"></div>
    <button class="btn-primary" id="saveSahyogBtn">सहयोग दर्ज करें</button>

    <div class="section-title"><h2>हाल की एंट्री</h2></div>
    ${DB.sahyog.length===0 ? `<div class="empty">कोई एंट्री नहीं</div>` :
      `<div class="card-list">${[...DB.sahyog].reverse().slice(0,15).map(r=>`
        <div class="row-card">
          <div class="avatar">${initials(r.DonorName)}</div>
          <div class="row-main"><div class="t1">${r.DonorName}</div><div class="t2">${r.Purpose||''} · ${fdate(r.Date)}</div></div>
          <div class="row-amt in">+${fmt(r.Amount)}</div>
        </div>`).join('')}</div>`
    }
  </div>
  ${navBar('mashikJama')}
  `;
}

/* ======================= EXPENSE ======================= */
function expensePage(){
  const t = totals();
  return `
  <div class="page-head">
    <button class="back-btn" data-nav="home"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
    <div><h1>खर्च दर्ज करें</h1><p>Expense Entry</p></div>
  </div>
  <div class="content" style="padding-top:14px;">
    <div class="settings-box" style="margin:0 0 16px;">
      <h3>कुल खर्च</h3>
      <p style="margin-bottom:0;color:var(--red);font-family:Poppins;font-weight:800;font-size:22px;">${fmt(t.expense)}</p>
    </div>
    <div class="field"><label>श्रेणी</label>
      <select id="e_category"><option>कार्यक्रम</option><option>स्टेशनरी</option><option>सजावट</option><option>यात्रा</option><option>अन्य</option></select>
    </div>
    <div class="field"><label>विवरण</label><input id="e_desc" placeholder="खर्च का विवरण लिखें"></div>
    <div class="field"><label>राशि (₹)</label><input id="e_amount" type="number" placeholder="0"></div>
    <div class="field"><label>किसे भुगतान किया</label><input id="e_paidto" placeholder="नाम / दुकान"></div>
    <div class="field"><label>तारीख</label><input id="e_date" type="date" value="${todayStr()}"></div>
    <button class="btn-primary" id="saveExpenseBtn">खर्च दर्ज करें</button>

    <div class="section-title"><h2>हाल के खर्च</h2></div>
    ${DB.expense.length===0 ? `<div class="empty">कोई एंट्री नहीं</div>` :
      `<div class="card-list">${[...DB.expense].reverse().slice(0,15).map(r=>`
        <div class="row-card">
          <div class="avatar" style="background:var(--red-bg);color:var(--red)">−</div>
          <div class="row-main"><div class="t1">${r.Category}</div><div class="t2">${r.Description||''} · ${fdate(r.Date)}</div></div>
          <div class="row-amt out">-${fmt(r.Amount)}</div>
        </div>`).join('')}</div>`
    }
  </div>
  ${navBar('home')}
  `;
}

/* ======================= REPORTS ======================= */
function reportsPage(){
  const tab = route.repTab || 'summary';
  const t = totals();
  let body = '';
  if(tab==='summary'){
    body = `
      <div class="settings-box">
        <h3>वित्तीय सारांश (Financial Summary)</h3>
        <table class="rep" style="margin-top:8px;">
          <tr><td>कुल आय (जमा + सहयोग)</td><td style="text-align:right;color:var(--green);font-weight:700;">${fmt(t.income)}</td></tr>
          <tr><td>— मासिक जमा</td><td style="text-align:right;">${fmt(t.mashikJamaTotal)}</td></tr>
          <tr><td>— सहयोग / दान</td><td style="text-align:right;">${fmt(t.sahyogTotal)}</td></tr>
          <tr><td>कुल खर्च</td><td style="text-align:right;color:var(--red);font-weight:700;">${fmt(t.expense)}</td></tr>
          <tr><td><b>कुल बैलेंस</b></td><td style="text-align:right;"><b>${fmt(t.balance)}</b></td></tr>
          <tr><td>कुल सदस्य</td><td style="text-align:right;">${DB.members.length}</td></tr>
        </table>
      </div>`;
  } else {
    const map = {members:['ID','Name','Mobile','Village','JoinDate','Status'],
                 mashikJama:['ID','दिनांक','माह','सदस्य का नाम','फोन नंबर','पद','राशि (₹)','भुगतान माध्यम','एंट्री दिनांक','एंट्री समय'],
                 sahyog:['ID','DonorName','Purpose','Amount','Date'],
                 expense:['ID','Date','Category','Description','Amount','PaidTo']};
    const cols = map[tab];
    const rows = DB[tab];
    body = `<div class="rep-wrap"><table class="rep">
      <tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>
      ${rows.length===0 ? `<tr><td colspan="${cols.length}" style="text-align:center;color:var(--muted);padding:20px;">कोई डेटा नहीं</td></tr>` :
        rows.map(r=>`<tr>${cols.map(c=>`<td>${c==='Amount'||c==='राशि (₹)'?fmt(r[c]):(r[c]||'-')}</td>`).join('')}</tr>`).join('')
      }
    </table></div>`;
  }
  return `
  <div class="page-head">
    <button class="back-btn" data-nav="home"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
    <div><h1>रिपोर्ट शीट</h1><p>Google Sheet का लाइव डेटा</p></div>
  </div>
  <div class="tabbar">
    ${['summary','members','mashikJama','sahyog','expense'].map(k=>`<div class="tab ${tab===k?'active':''}" data-reptab="${k}">${
      {summary:'सारांश',members:'सदस्य',mashikJama:'मासिक जमा',sahyog:'सहयोग',expense:'खर्च'}[k]
    }</div>`).join('')}
  </div>
  <div style="padding-top:10px;">${tab==='summary' ? `<div style="padding:0 18px;">${body}</div>` : body}</div>
  ${navBar('reports')}
  `;
}

/* ======================= SETTINGS ======================= */
function settingsPage(){
  return `
  <div class="page-head">
    <button class="back-btn" data-nav="home"><span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span></button>
    <div><h1>सेटिंग</h1><p>Mandal & Google Sheet Setup</p></div>
  </div>
  <div class="settings-box">
    <h3>कनेक्शन स्टेटस</h3>
    <span class="status-chip ${connState==='online'?'ok':'off'}">${
      connState==='online' ? '● Google Sheet से जुड़ा है' :
      connState==='connecting' ? '● जोड़ा जा रहा है...' :
      connState==='error' ? '● Connection Error' : '● Offline (Local only)'
    }</span>
  </div>
  <div class="settings-box">
    <h3>मंडल का नाम</h3>
    <div class="field" style="margin-bottom:10px;"><input id="set_name" value="${settings.mandalName}"></div>
    <h3>गाँव / शहर</h3>
    <div class="field" style="margin-bottom:0;"><input id="set_village" value="${settings.village}"></div>
  </div>
  <div class="settings-box">
    <h3>मासिक जमा (डिफ़ॉल्ट राशि)</h3>
    <div class="field" style="margin-bottom:0;"><input id="set_mashikJama" type="number" value="${settings.monthlyMashikJamaAmt}"></div>
  </div>
  <div class="settings-box">
    <h3>Google Apps Script Web App URL</h3>
    <p>अपनी Google Sheet में Extensions → Apps Script खोलें, दिया गया कोड पेस्ट करें, फिर Deploy → Web App करें। वहाँ से मिला URL यहाँ पेस्ट करें।</p>
    <div class="field" style="margin-bottom:0;"><input id="set_url" placeholder="https://script.google.com/macros/s/..../exec" value="${settings.scriptUrl}"></div>
  </div>
  <div class="form-sheet" style="padding-top:0;">
    <button class="btn-primary" id="saveSettingsBtn">सेव करें और जोड़ें</button>
  </div>
  ${navBar('settings')}
  `;
}

/* ======================= EVENTS ======================= */
function bindEvents(){
  document.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const page = el.getAttribute('data-nav');
      if(page==='idcard'){
        route = {page:'idcard', id: el.getAttribute('data-id')};
      } else if(page==='idcard-self'){
        route = {page:'idcard', id: DB.members[0]? DB.members[0].ID : 'demo'};
      } else {
        route = {page};
      }
      window.scrollTo(0,0);
      render();
    });
  });

  document.querySelectorAll('[data-reptab]').forEach(el=>{
    el.addEventListener('click', ()=>{
      route.repTab = el.getAttribute('data-reptab');
      render();
    });
  });

  const search = document.getElementById('memberSearch');
  if(search){
    search.addEventListener('input', (e)=>{ route.q = e.target.value; render(); document.getElementById('memberSearch').focus(); });
  }

  const saveMemberBtn = document.getElementById('saveMemberBtn');
  if(saveMemberBtn){
    const fPhoto = document.getElementById('f_photo');
    if(fPhoto) {
      fPhoto.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 200;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
            } else {
              if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
            }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const b64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('f_photo_b64').value = b64;
            document.getElementById('photo_preview_wrap').innerHTML = `<img src="${b64}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"><div class="cam-ic"><span class="material-symbols-outlined" style="font-size:16px;">photo_camera</span></div>`;
          };
        };
      });
    }

    saveMemberBtn.addEventListener('click', async ()=>{
      const name = document.getElementById('f_name').value.trim();
      if(!name){ toast('कृपया नाम भरें'); return; }
      saveMemberBtn.disabled = true; saveMemberBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> सेव हो रहा है...';
      const addressEl = document.getElementById('f_address');
      await pushRow('member', {
        Name:name,
        Pad: document.getElementById('f_pad').value.trim(),
        Age: document.getElementById('f_age').value.trim(),
        Mobile: document.getElementById('f_mobile').value.trim(),
        Address: addressEl ? addressEl.value.trim() : '',
        Photo: document.getElementById('f_photo_b64') ? document.getElementById('f_photo_b64').value : '',
        Status: document.getElementById('f_status').value,
      });
      toast('सदस्य जुड़ गया ✅');
      route = {page:'members'};
      render();
    });
  }


  // UPI Tabs
  const payModes = document.querySelectorAll('.pay-mode-btn');
  if(payModes.length > 0){
    payModes.forEach(btn => {
      btn.addEventListener('click', () => {
        payModes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('c_mode').value = btn.getAttribute('data-mode');
      });
    });
  }

  const saveMashikJamaBtn = document.getElementById('saveChandaBtn');
  if(saveMashikJamaBtn){
    saveMashikJamaBtn.addEventListener('click', async ()=>{
      const mid = document.getElementById('c_member').value;
      if(!mid){ toast('सदस्य चुनें'); return; }
      const member = DB.members.find(m=>String(m.ID)===String(mid));
      saveMashikJamaBtn.disabled = true; saveMashikJamaBtn.textContent = 'सेव हो रहा है...';
      await pushRow('mashikJama', {
        'सदस्य का नाम': member?member.Name:'',
        'फोन नंबर': member?member.Mobile:'',
        'पद': member?member.Pad:'',
        'माह': document.getElementById('c_month').value,
        'राशि (₹)': document.getElementById('c_amount').value,
        'दिनांक': document.getElementById('c_date').value,
        'भुगतान माध्यम': document.getElementById('c_mode').value,
        'एंट्री दिनांक': new Date().toLocaleDateString('en-GB'),
        'एंट्री समय': new Date().toLocaleTimeString('en-US', { hour12: true })
      });
      toast('जमा दर्ज हो गया ✅');
      render();
    });
  }

  const saveSahyogBtn = document.getElementById('saveSahyogBtn');
  if(saveSahyogBtn){
    saveSahyogBtn.addEventListener('click', async ()=>{
      const donor = document.getElementById('s_donor').value.trim();
      const amount = document.getElementById('s_amount').value;
      if(!donor || !amount){ toast('नाम और राशि भरें'); return; }
      saveSahyogBtn.disabled = true; saveSahyogBtn.textContent = 'सेव हो रहा है...';
      await pushRow('sahyog', {
        DonorName: donor,
        Purpose: document.getElementById('s_purpose').value.trim(),
        Amount: amount,
        Date: document.getElementById('s_date').value,
      });
      toast('सहयोग दर्ज हो गया ✅');
      render();
    });
  }

  const saveExpenseBtn = document.getElementById('saveExpenseBtn');
  if(saveExpenseBtn){
    saveExpenseBtn.addEventListener('click', async ()=>{
      const amount = document.getElementById('e_amount').value;
      if(!amount){ toast('राशि भरें'); return; }
      saveExpenseBtn.disabled = true; saveExpenseBtn.textContent = 'सेव हो रहा है...';
      await pushRow('expense', {
        Category: document.getElementById('e_category').value,
        Description: document.getElementById('e_desc').value.trim(),
        Amount: amount,
        PaidTo: document.getElementById('e_paidto').value.trim(),
        Date: document.getElementById('e_date').value,
      });
      toast('खर्च दर्ज हो गया ✅');
      render();
    });
  }

  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  if(saveSettingsBtn){
    saveSettingsBtn.addEventListener('click', ()=>{
      settings.mandalName = document.getElementById('set_name').value.trim() || settings.mandalName;
      settings.village = document.getElementById('set_village').value.trim() || settings.village;
      settings.monthlyMashikJamaAmt = Number(document.getElementById('set_mashikJama').value) || settings.monthlyMashikJamaAmt;
      settings.scriptUrl = document.getElementById('set_url').value.trim();
      saveSettings();
      toast('सेटिंग सेव हो गई ✅');
      syncAll();
    });
  }
}

/* ======================= INIT ======================= */
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
render();
if(settings.scriptUrl){ syncAll(); }
