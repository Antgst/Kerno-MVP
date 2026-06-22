import NavigationLink from "../NavigationLink";

function PublicHeaderActions({ pathname }) {
  return (
    <div className="public-header-actions">
      {pathname !== "/login" && (
        <NavigationLink to="/login" variant="header-ghost">
          Se connecter
        </NavigationLink>
      )}

      {pathname !== "/register" && (
        <NavigationLink to="/register" variant="header-cta">
          Créer un compte
        </NavigationLink>
      )}
    </div>
  );
}

export default PublicHeaderActions;
