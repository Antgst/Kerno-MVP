import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__body">
        <Header variant="app" />
        <div className="app-layout__content">{children}</div>
      </div>
    </div>
  );
}

export default AppLayout;
