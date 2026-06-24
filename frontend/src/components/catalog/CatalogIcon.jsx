const catalogIconProps = {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const catalogIcons = {
  box: (
    <svg {...catalogIconProps}>
      <path d="m21 8-9 5-9-5 9-5 9 5Z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  ),
  grid: (
    <svg {...catalogIconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  image: (
    <svg {...catalogIconProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 15-5-5L5 20" />
    </svg>
  ),
  list: (
    <svg {...catalogIconProps}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  map: (
    <svg {...catalogIconProps}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  search: (
    <svg {...catalogIconProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
};

function CatalogIcon({ name }) {
  return catalogIcons[name] || null;
}

export default CatalogIcon;
