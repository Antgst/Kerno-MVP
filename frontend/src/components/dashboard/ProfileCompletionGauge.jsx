import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function getSafeCompletionPercent(value) {
  const percent = Number(value);

  if (!Number.isFinite(percent)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(percent)));
}

function ProfileCompletionGauge({ value, isComplete = false, ariaLabel }) {
  const completionPercent = getSafeCompletionPercent(value);
  const pathColor = isComplete ? "#D6EBE2" : "#F97316";
  const trailColor = isComplete
    ? "rgba(248, 245, 239, 0.24)"
    : "rgba(248, 245, 239, 0.18)";

  return (
    <div
      className="dashboard-profile-gauge"
      role="img"
      aria-label={ariaLabel || `Profil complété à ${completionPercent}%`}
    >
      <CircularProgressbar
        value={completionPercent}
        strokeWidth={8}
        styles={buildStyles({
          pathColor,
          trailColor,
          strokeLinecap: "round",
          pathTransitionDuration: 0.45,
        })}
      />

      <div className="dashboard-profile-gauge__center" aria-hidden="true">
        <strong className="dashboard-profile-gauge__value">
          {completionPercent}%
        </strong>
      </div>
    </div>
  );
}

export default ProfileCompletionGauge;
