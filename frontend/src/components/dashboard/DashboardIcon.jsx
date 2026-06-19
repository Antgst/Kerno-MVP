function DashboardIcon({ name }) {
  const commonProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    box: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M12 13v8" />
      </svg>
    ),
    building: (
      <svg {...commonProps}>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h1" />
        <path d="M9 13h1" />
        <path d="M9 17h1" />
        <path d="M16 15h1" />
        <path d="M16 18h1" />
      </svg>
    ),
    check: (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12 2.3 2.3 4.8-5" />
      </svg>
    ),
    clock: (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3.5 2" />
      </svg>
    ),
    eye: (
      <svg {...commonProps}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
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
    map: (
      <svg {...commonProps}>
        <path d="M20 10c0 4.8-8 11-8 11s-8-6.2-8-11a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    package: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      </svg>
    ),
    plus: (
      <svg {...commonProps}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
    products: (
      <svg {...commonProps}>
        <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="14" width="7" height="6" rx="1.5" />
        <rect x="13.5" y="14" width="7" height="6" rx="1.5" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    stack: (
      <svg {...commonProps}>
        <rect x="4" y="5" width="16" height="5" rx="1.6" />
        <rect x="4" y="12" width="16" height="7" rx="1.6" />
        <path d="M8 7.5h.01" />
        <path d="M8 15.5h.01" />
        <path d="M11 7.5h5" />
        <path d="M11 15.5h5" />
      </svg>
    ),
    star: (
      <svg {...commonProps}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    ),
    tag: (
      <svg {...commonProps}>
        <path d="M20.6 13.2 13.2 20.6a2 2 0 0 1-2.8 0L3 13.2V3h10.2l7.4 7.4a2 2 0 0 1 0 2.8Z" />
        <circle cx="8" cy="8" r="1.3" />
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

export default DashboardIcon;
