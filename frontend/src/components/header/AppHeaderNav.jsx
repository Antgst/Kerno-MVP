import NavigationLink from "../NavigationLink";
import HeaderIcon from "./HeaderIcon";

function AppHeaderNav({ navigationItems }) {
  return (
    <nav
      className="kerno-app-header__nav"
      aria-label="Navigation principale"
    >
      {navigationItems.map((item) => (
        <NavigationLink
          key={item.to}
          to={item.to}
          end={item.end}
          variant="app-nav"
        >
          <HeaderIcon name={item.icon} />
          <span>{item.label}</span>
        </NavigationLink>
      ))}
    </nav>
  );
}

export default AppHeaderNav;
