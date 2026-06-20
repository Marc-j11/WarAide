import React from 'react';

/**
 * Input WarAide.
 * Si `icon` est fourni, on rend la version "input-icon".
 */
export default function Input({
  label,
  icon,
  iconColor,
  value,
  onChange,
  placeholder,
  type = 'text',
  name,
  ...rest
}) {
  if (icon) {
    return (
      <div className="wa-input-wrap">
        {label && <span className="wa-label">{label}</span>}
        <div className="wa-input-icon">
          <i className={`ti ${icon}`} style={iconColor ? { color: iconColor } : undefined} />
          <input
            type={type}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            {...rest}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="wa-input-wrap">
      {label && <span className="wa-label">{label}</span>}
      <input
        className="wa-input"
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
