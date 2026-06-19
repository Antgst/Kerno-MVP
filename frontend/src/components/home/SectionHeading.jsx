function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="landing-section__heading">
      {eyebrow && <p className="landing-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default SectionHeading;
