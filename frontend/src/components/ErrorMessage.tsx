// Capa: Presentación – Componente de error reutilizable

import React from 'react';

interface Props {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<Props> = ({ message, onClose }) => (
  <div
    role="alert"
    style={{
      background: '#fff0f0',
      border: '2px solid #FF6B6B',
      borderRadius: 14,
      padding: '16px 20px',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}
  >
    <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
    <p
      style={{
        flex: 1,
        margin: 0,
        color: '#c0392b',
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 1.5,
      }}
    >
      {message}
    </p>
    {onClose && (
      <button
        onClick={onClose}
        aria-label="Cerrar mensaje de error"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          color: '#FF6B6B',
          padding: 4,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    )}
  </div>
);

export default ErrorMessage;
