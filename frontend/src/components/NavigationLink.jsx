import { NavLink } from "react-router-dom";

function NavigationLink({ to, children, variant = "default", end, ...props }) {
  const shouldMatchExactly = end ?? to === "/";

  return (
    <NavLink
      to={to}
      end={shouldMatchExactly}
      className={({ isActive }) =>
        [
          "navigation-link",
          `navigation-link--${variant}`,
          isActive ? "navigation-link--active" : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}

export default NavigationLink;
