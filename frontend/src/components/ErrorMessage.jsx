export function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <span className="error-icon">⚠️</span>
      <p>{message}</p>
    </div>
  );
}
