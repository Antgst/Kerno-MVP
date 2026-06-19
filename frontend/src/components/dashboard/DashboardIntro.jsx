import { Link } from "react-router-dom";
import DashboardIcon from "./DashboardIcon";

function DashboardIntro({
  prefix,
  titleId,
  displayName,
  subtitle = "Voici un aperçu de votre activité.",
  ctaTo,
  ctaLabel,
  ctaIcon,
}) {
  return (
    <section
      className={`${prefix}__intro`}
      aria-labelledby={titleId}
    >
      <div>
        <p className={`${prefix}__hello`}>Bonjour,</p>
        <h1 id={titleId}>{displayName}</h1>
        <p className={`${prefix}__subtitle`}>{subtitle}</p>
      </div>

      {ctaTo && ctaLabel && (
        <Link className={`${prefix}__primary-cta`} to={ctaTo}>
          {ctaIcon && <DashboardIcon name={ctaIcon} />}
          <span>{ctaLabel}</span>
        </Link>
      )}
    </section>
  );
}

export default DashboardIntro;
