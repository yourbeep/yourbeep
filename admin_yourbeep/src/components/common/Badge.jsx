const Badge = ({ label, variant = 'default' }) => {
  const variants = {
    active: {
      background: '#d1fae5',
      color: '#065f46',
    },
    pending: {
      background: '#fef3c7',
      color: '#92400e',
    },
    suspended: {
      background: '#fee2e2',
      color: '#991b1b',
    },
    default: {
      background: 'var(--bg)',
      color: 'var(--text)',
    },
  }

  const style = variants[variant] || variants.default

  return (
    <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold" style={style}>
      {label}
    </span>
  )
}

export default Badge