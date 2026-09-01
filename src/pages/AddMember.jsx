import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { todayStr } from '../utils/helpers';
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
    village: '',
    join: todayStr(),
    status: 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('कृपया नाम भरें');
      return;
    }

    setLoading(true);
    await addRow('member', {
      Name: form.name.trim(),
      Mobile: form.mobile.trim(),
      Village: form.village.trim(),
      JoinDate: form.join,
      Status: form.status,
    });
    showToast('सदस्य जुड़ गया ✅');
    navigate('/members');
  };

  return (
    <div className="app">
      <PageHeader title="नया सदस्य जोड़ें" subtitle="Member details भरें" backTo="/members" />

      <form className="form-sheet" onSubmit={handleSubmit}>
        <Input
          label="पूरा नाम"
          id="f_name"
          placeholder="जैसे: लोकेश वर्मा"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
        <Input
          label="गाँव / वार्ड"
          id="f_village"
          placeholder="गाँव / मोहल्ले का नाम"
          value={form.village}
          onChange={(e) => setForm({ ...form, village: e.target.value })}
        />
        <Input
          label="जुड़ने की तारीख"
          id="f_join"
          type="date"
          value={form.join}
          onChange={(e) => setForm({ ...form, join: e.target.value })}
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
