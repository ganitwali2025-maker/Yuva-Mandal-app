// API Backend Integration

const STORAGE_KEY = 'yuva_mandal_settings_v1';
const CACHE_KEY = 'yuva_mandal_cache_v1';

export async function syncAll(scriptUrl) {
  if (!scriptUrl) return { connState: 'offline', db: getLocalDB() };

  try {
    const res = await fetch(scriptUrl + '?action=all&t=' + Date.now());
    const data = await res.json();

    if (data.ok) {
      const db = {
        members: data.members || [],
        chanda: data.chanda || [],
        sahyog: data.sahyog || [],
        expense: data.expense || [],
      };
      saveCache(db);
      return { connState: 'online', db };
    } else {
      return { connState: 'error', db: getLocalDB() };
    }
  } catch (err) {
    return { connState: 'error', db: getLocalDB() };
  }
}

export async function pushRow(scriptUrl, type, data) {
  if (!scriptUrl) {
    // Offline fallback
    const db = getLocalDB();
    const key = { member: 'members', chanda: 'chanda', sahyog: 'sahyog', expense: 'expense' }[type];
    const id = (db[key].reduce((m, r) => Math.max(m, Number(r.ID) || 0), 0)) + 1;
    db[key].push({ ID: id, ...data });
    saveCache(db);
    return { ok: true, offline: true };
  }

  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, data }),
    });
    const out = await res.json();
    if (out.ok) {
      await syncAll(scriptUrl);
    }
    return out;
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export function getSettings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getLocalDB() {
  return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') || {
    members: [],
    chanda: [],
    sahyog: [],
    expense: [],
  };
}

export function saveCache(db) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(db));
}

export function initializeDefaults() {
  let settings = getSettings();
  settings.mandalName = settings.mandalName || 'Yuva Vikas Mandal';
  settings.village = settings.village || 'आपका गाँव / शहर';
  settings.scriptUrl = settings.scriptUrl || '';
  settings.monthlyChandaAmt = settings.monthlyChandaAmt || 100;
  saveSettings(settings);
  return settings;
}
