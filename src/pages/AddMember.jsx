import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { compressImage } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function AddMember() {
  const { addRow, showToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    pad: '',
    age: '',
    photo: '',
    status: 'Active',
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await compressImage(file, 200);
        setForm({ ...form, photo: base64 });
      } catch (err) {
        showToast('फोटो लोड करने में त्रुटि');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('कृपया नाम भरें');
      return;
    }

    setLoading(true);
    await addRow('member', {
      Name: form.name.trim(),
      Pad: form.pad.trim(),
      Age: form.age.trim(),
      Mobile: form.mobile.trim(),
      Photo: form.photo,
      Status: form.status,
    });
    showToast('सदस्य जुड़ गया ✅');
    navigate('/members');
  };

  return (
    <div className="app">
      <PageHeader title="नया सदस्य जोड़ें" subtitle="Member details भरें" backTo="/members" />

      <form className="form-sheet" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '8px' }}>
            {form.photo ? (
              <img src={form.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '24px' }}>📷</span>
            )}
          </div>
          <label style={{ fontSize: '14px', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>
            फोटो चुनें
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>

        <Input
          label="पूरा नाम"
          id="f_name"
          placeholder="जैसे: लोकेश वर्मा"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="पद (Position)"
          id="f_pad"
          placeholder="जैसे: अध्यक्ष, सदस्य"
          value={form.pad}
          onChange={(e) => setForm({ ...form, pad: e.target.value })}
        />
        <Input
          label="आयु (Age)"
          id="f_age"
          type="number"
          placeholder="जैसे: 25"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <Input
          label="मोबाइल नंबर"
          id="f_mobile"
          type="tel"
          placeholder="10 अंकों का नंबर"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          maxLength="10"
        />
        <Select
          label="स्टेटस"
          id="f_status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
        />
        <Button disabled={loading}>{loading ? 'सेव हो रहा है...' : 'सदस्य सेव करें'}</Button>
      </form>

      <BottomNav active="members" />
    </div>
  );
}
