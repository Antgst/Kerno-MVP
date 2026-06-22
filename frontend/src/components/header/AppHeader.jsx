import AppHeaderAccount from "./AppHeaderAccount";
import AppHeaderBrand from "./AppHeaderBrand";
import AppHeaderNav from "./AppHeaderNav";

function AppHeader({
  accountInitials,
  accountName,
  accountRoleLabel,
  dashboardPath,
  isMenuOpen,
  navigationItems,
  onLogout,
  onMenuClick,
  onMenuClose,
  onMenuToggle,
  profilePath,
}) {
  return (
    <header className="kerno-app-header">
      <div className="kerno-app-header__brand-row">
        <AppHeaderBrand
          dashboardPath={dashboardPath}
          onMenuClick={onMenuClick}
        />

        <AppHeaderNav navigationItems={navigationItems} />
      </div>

      <AppHeaderAccount
        accountInitials={accountInitials}
        accountName={accountName}
        accountRoleLabel={accountRoleLabel}
        dashboardPath={dashboardPath}
        isMenuOpen={isMenuOpen}
        onLogout={onLogout}
        onMenuClose={onMenuClose}
        onMenuToggle={onMenuToggle}
        profilePath={profilePath}
      />
    </header>
  );
}

export default AppHeader;
