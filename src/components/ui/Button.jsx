export default function Button({ children, onClick, disabled, variant = 'primary', className = '' }) {
  const baseClass = variant === 'primary' ? 'btn-primary' : '';
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClass} ${className}`}>
      {children}
    </button>
  );
}
