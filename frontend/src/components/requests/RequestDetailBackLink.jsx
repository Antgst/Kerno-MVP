import { Link } from "react-router-dom";
import RequestIcon from "./RequestIcon";

function RequestDetailBackLink({ children, to }) {
  return (
    <Link className="supplier-request-detail-back" to={to}>
      <RequestIcon name="back" />
      {children}
    </Link>
  );
}

export default RequestDetailBackLink;
