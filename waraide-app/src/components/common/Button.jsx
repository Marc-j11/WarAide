import React from 'react';

/**
 * Bouton WarAide.
 * variant: 'primary' (orange) | 'dark' | 'ghost'
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  icon,
  disabled = false,
  className = '',
}) {
  const cls = `wa-btn wa-btn-${variant} ${className}`.trim();
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {icon && <i className={`ti ${icon}`} />}
      {children}
    </button>
  );
}
