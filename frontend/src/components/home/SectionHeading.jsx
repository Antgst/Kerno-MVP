function SectionHeading({ title, subtitle }) {
  return (
    <div className="landing-section__heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default SectionHeading;
