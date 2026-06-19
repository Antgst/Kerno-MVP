import RequestIcon from "./RequestIcon";

function RequestDetailField({
  fallback = "Non renseigné",
  hideWhenEmpty = false,
  icon,
  label,
  value,
}) {
  if (!value && hideWhenEmpty) {
    return null;
  }

  return (
    <div>
      <dt>
        <RequestIcon name={icon} />
        {label}
      </dt>
      <dd>{value || fallback}</dd>
    </div>
  );
}

export default RequestDetailField;
