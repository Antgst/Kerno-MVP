import Header from "../components/Header";

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <Header variant="public" />
      <div className="public-layout__content">{children}</div>
    </div>
  );
}

export default PublicLayout;
