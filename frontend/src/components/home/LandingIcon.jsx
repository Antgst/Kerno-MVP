const landingIconProps = {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const landingIcons = {
  eye: (
    <svg {...landingIconProps}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  search: (
    <svg {...landingIconProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  storefront: (
    <svg {...landingIconProps}>
      <path d="M4 10h16" />
      <path d="M5 10l1.2-5h11.6L19 10" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
    </svg>
  ),
  form: (
    <svg {...landingIconProps}>
      <rect width="14" height="16" x="5" y="4" rx="2" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  ),
  pin: (
    <svg {...landingIconProps}>
      <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

function LandingIcon({ name }) {
  return landingIcons[name] ?? null;
}

export default LandingIcon;
