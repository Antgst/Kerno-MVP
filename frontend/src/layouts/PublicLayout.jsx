import Header from "../components/Header";

function PublicLayout({ children }) {
  return (
    <div className="public-layout kerno-page-bg">
      <Header />

      <main className="public-layout__content">{children}</main>
    </div>
  );
}

export default PublicLayout;
