import DashboardIcon from "./DashboardIcon";

function DashboardStats({ prefix, stats, ariaLabel }) {
  return (
    <section className={`${prefix}__stats`} aria-label={ariaLabel}>
      {stats.map((stat) => (
        <article className={`${prefix}__stat-card`} key={stat.label}>
          <span
            className={[
              `${prefix}__stat-icon`,
              stat.featured ? `${prefix}__stat-icon--featured` : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <DashboardIcon name={stat.icon} />
          </span>

          <div>
            <strong>{stat.value}</strong>
            <p>{stat.label}</p>
            <small>{stat.helper}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

export default DashboardStats;
