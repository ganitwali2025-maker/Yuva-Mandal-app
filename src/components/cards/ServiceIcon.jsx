import { useNavigate } from 'react-router-dom';

export default function ServiceIcon({ page, icon, color, label }) {
  const navigate = useNavigate();

  return (
    <button className="service" onClick={() => navigate('/' + page)}>
      <div className="ic" style={{ background: color }}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}
