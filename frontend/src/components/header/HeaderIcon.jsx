function HeaderIcon({ name }) {
  const commonProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    bell: (
      <svg {...commonProps}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    box: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m21 12-9 5-9-5" />
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      </svg>
    ),
    chevron: (
      <svg {...commonProps}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
    grid: (
      <svg {...commonProps}>
        <rect width="7" height="7" x="3" y="3" rx="1.5" />
        <rect width="7" height="7" x="14" y="3" rx="1.5" />
        <rect width="7" height="7" x="3" y="14" rx="1.5" />
        <rect width="7" height="7" x="14" y="14" rx="1.5" />
      </svg>
    ),
    leaf: (
      <svg {...commonProps}>
        <path d="M20 4c-6.6.4-11.4 3.1-14.2 8.2-1.7 3.1-.2 6.9 3.2 7.8 3.8 1 7.2-1.5 8.5-5.3C18.4 12 18.8 8.1 20 4Z" />
        <path d="M8 16c2.2-2.9 5-5.1 8.5-6.6" />
      </svg>
    ),
    mail: (
      <svg {...commonProps}>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    user: (
      <svg {...commonProps}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

export default HeaderIcon;
