import { Link } from "react-router-dom";

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
  const profileCardClass = [
    `${prefix}__profile-card`,
    profileIsComplete
      ? `${prefix}__profile-card--complete`
      : `${prefix}__profile-card--incomplete`,
  ].join(" ");

  return (
    <article className={profileCardClass}>
      <div className={`${prefix}__profile-content`}>
        <div className={`${prefix}__profile-copy`}>
          <h2>{profileIsComplete ? completeTitle : incompleteTitle}</h2>
          <p>{profileIsComplete ? completeMessage : incompleteMessage}</p>
        </div>

        <div
          className={`${prefix}__profile-gauge`}
          style={{ "--progress": completionPercent }}
          aria-label={ariaLabel}
        >
          <strong>{completionPercent}%</strong>
        </div>
      </div>

      <Link to={profileTo}>
        {profileIsComplete ? "Modifier le profil" : "Compléter maintenant"}
      </Link>
    </article>
  );
}

export default DashboardProfileCard;
