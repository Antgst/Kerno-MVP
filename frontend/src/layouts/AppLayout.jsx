import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PublicFooter from "../components/home/PublicFooter";

function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="kerno-shell">
      <div
        className={[
          "kerno-shell__overlay",
          isSidebarOpen ? "kerno-shell__overlay--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleCloseSidebar}
        aria-hidden="true"
      />

      <aside
        className={[
          "kerno-shell__sidebar",
          isSidebarOpen ? "kerno-shell__sidebar--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Sidebar onNavigate={handleCloseSidebar} />
      </aside>

      <div className="kerno-shell__main kerno-page-bg">
        <Header
          variant="app"
          onMenuClick={() => setIsSidebarOpen((currentValue) => !currentValue)}
        />

        <main className="kerno-shell__content">{children}</main>

        <div className="app-layout__footer">
          <PublicFooter />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
