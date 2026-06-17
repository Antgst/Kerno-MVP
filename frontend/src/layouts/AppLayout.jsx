import Header from "../components/Header";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header variant="app" />
      <main className="app-layout__content">{children}</main>
    </div>
  );
}

export default AppLayout;
