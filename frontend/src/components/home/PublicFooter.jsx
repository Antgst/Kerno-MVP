const footerLinks = [
  { label: "Contact", href: "#" },
  { label: "Mentions légales", href: "#" },
  { label: "Confidentialité", href: "#" },
  { label: "Conditions d’utilisation", href: "#" },
  { label: "À propos", href: "#" },
];

function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__brand">
        <strong>KERNO</strong>
        <p>
          Le premier contact B2B entre magasins et fournisseurs directs.
        </p>
      </div>

      <nav className="public-footer__links" aria-label="Liens de pied de page">
        {footerLinks.map((link) => (
          <a href={link.href} key={link.label}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

export default PublicFooter;
