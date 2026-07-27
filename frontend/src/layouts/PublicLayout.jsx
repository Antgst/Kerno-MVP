import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import PublicFooter from "../components/home/PublicFooter";

function PublicLayout({ children }) {
  const { pathname } = useLocation();

  const layoutClassName = [
    "public-layout",
    "kerno-page-bg",
    pathname === "/" ? "public-layout--landing" : "",
    pathname === "/login" ? "public-layout--login" : "",
    pathname === "/register" ? "public-layout--register" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClassName}>
      <Header />

      <main className="public-layout__content">{children}</main>

      <div className="public-layout__footer">
        <PublicFooter />
      </div>
    </div>
  );
}

export default PublicLayout;
