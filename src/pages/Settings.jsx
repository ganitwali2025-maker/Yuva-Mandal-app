import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { saveSettings } from '../api/backend';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StatusChip from '../components/ui/StatusChip';

export default function Settings() {
  const { settings, updateSettings, connState, showToast, performSync, language, switchLanguage, t } = useApp();
  const [form, setForm] = useState(settings);

  const handleSave = async () => {
    updateSettings(form);
    saveSettings(form);
    showToast('सेटिंग सेव हो गई ✅');
    await performSync();
  };

  const connStatus = connState === 'online' ? '● Google Sheet से जुड़ा है' :
                     connState === 'connecting' ? '● जोड़ा जा रहा है...' :
                     connState === 'error' ? '● कनेक्शन त्रुटि' :
                     '● ऑफ़लाइन (केवल लोकल)';

  return (
    <div className="app">
      <PageHeader title={t('settings')} subtitle="Mandal & Google Sheet Setup" backTo="/" />

      <div className="content" style={{ paddingTop: '14px' }}>
        <div className="settings-box">
          <h3>{t('language')}</h3>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button 
              onClick={() => switchLanguage('hi')} 
              style={{ flex: 1, padding: '8px', background: language === 'hi' ? '#311b92' : '#fff', color: language === 'hi' ? '#fff' : '#64748b', border: `1px solid ${language === 'hi' ? '#311b92' : '#cbd5e1'}` }}
            >
              {t('hindi')}
            </Button>
            <Button 
              onClick={() => switchLanguage('en')} 
              style={{ flex: 1, padding: '8px', background: language === 'en' ? '#311b92' : '#fff', color: language === 'en' ? '#fff' : '#64748b', border: `1px solid ${language === 'en' ? '#311b92' : '#cbd5e1'}` }}
            >
              {t('english')}
            </Button>
          </div>
        </div>

        <div className="settings-box">
          <h3>{t('connectionStatus')}</h3>
          <StatusChip status={connState === 'online' ? 'ok' : 'off'} text={connStatus} />
        </div>

        <div className="settings-box">
          <h3>{t('mandalName')}</h3>
          <Input
            id="set_name"
            value={form.mandalName}
            onChange={(e) => setForm({ ...form, mandalName: e.target.value })}
          />
          <h3>{t('village')}</h3>
          <Input
            id="set_village"
            value={form.village}
            onChange={(e) => setForm({ ...form, village: e.target.value })}
          />
        </div>

        <div className="settings-box">
          <h3>{t('defaultMashikJama')}</h3>
          <Input
            id="set_mashikJama"
            type="number"
            value={form.monthlyMashikJamaAmt}
            onChange={(e) => setForm({ ...form, monthlyMashikJamaAmt: Number(e.target.value) })}
          />
        </div>

        <div className="settings-box">
          <h3>Google Apps Script Web App URL</h3>
          <p>
            अपनी Google Sheet में Extensions → Apps Script खोलें, दिया गया कोड पेस्ट करें, फिर
            Deploy → Web App करें। वहाँ से मिला URL यहाँ पेस्ट करें।
          </p>
          <Input
            id="set_url"
            placeholder="https://script.google.com/macros/s/..../exec"
            value={form.scriptUrl}
            onChange={(e) => setForm({ ...form, scriptUrl: e.target.value })}
          />
        </div>

        <div className="form-sheet" style={{ paddingTop: 0 }}>
          <Button onClick={handleSave}>{t('saveSettings')}</Button>
        </div>
      </div>

      <BottomNav active="settings" />
    </div>
  );
}
