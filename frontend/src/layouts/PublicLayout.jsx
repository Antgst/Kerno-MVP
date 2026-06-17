import Header from "../components/Header";
import globalBackground from "../assets/store-dashboard-bg.png";

function PublicLayout({ children }) {
  return (
    <div
      className="public-layout kerno-page-bg"
      style={{ "--kerno-global-bg": `url(${globalBackground})` }}
    >
      <Header />

      <main className="public-layout__content">{children}</main>
    </div>
  );
}

export default PublicLayout;
