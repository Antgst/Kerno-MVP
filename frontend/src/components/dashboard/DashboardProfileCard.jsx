import { Link } from "react-router-dom";
import { getSafeCompletionPercent } from "../../utils/completionPercent";
import DashboardIcon from "./DashboardIcon";
import ProfileCompletionGauge from "./ProfileCompletionGauge";

function DashboardProfileCard({
  prefix,
  completionPercent,
  profileIsComplete,
  profileTo,
  completeTitle = "Profil complet",
  incompleteTitle = "Complétez votre profil",
  completeMessage,
  incompleteMessage = "Ajoutez les informations manquantes pour renforcer votre crédibilité.",
  ariaLabel,
}) {
  const safeCompletionPercent = getSafeCompletionPercent(completionPercent);
  const isProfileComplete = Boolean(profileIsComplete) || safeCompletionPercent >= 100;

  const profileCardClass = [
    `${prefix}__profile-card`,
    isProfileComplete
      ? `${prefix}__profile-card--complete`
      : `${prefix}__profile-card--incomplete`,
  ].join(" ");

  return (
    <article className={profileCardClass}>
      <div className={`${prefix}__profile-content`}>
        <div className={`${prefix}__profile-copy`}>
          <h2>{isProfileComplete ? completeTitle : incompleteTitle}</h2>
          <p>{isProfileComplete ? completeMessage : incompleteMessage}</p>
        </div>

        <div className={`${prefix}__profile-gauge`}>
          <ProfileCompletionGauge
            value={safeCompletionPercent}
            isComplete={isProfileComplete}
            ariaLabel={ariaLabel}
          />
        </div>
      </div>

      <Link className={`${prefix}__profile-action`} to={profileTo}>
        <DashboardIcon name={isProfileComplete ? "user" : "check"} />
        <span>{isProfileComplete ? "Modifier le profil" : "Compléter maintenant"}</span>
      </Link>
    </article>
  );
}

export default DashboardProfileCard;
