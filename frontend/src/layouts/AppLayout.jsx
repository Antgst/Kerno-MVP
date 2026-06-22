import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import globalBackground from "../assets/store-dashboard-bg.png";

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

      <div
        className="kerno-shell__main kerno-page-bg"
        style={{ "--kerno-global-bg": `url(${globalBackground})` }}
      >
        <Header
          variant="app"
          onMenuClick={() => setIsSidebarOpen((currentValue) => !currentValue)}
        />

        <main className="kerno-shell__content">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
