import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, subtitle, backTo }) {
  const navigate = useNavigate();

  return (
    <div className="page-head">
      <button className="back-btn" onClick={() => navigate(backTo)}>
        ←
      </button>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
