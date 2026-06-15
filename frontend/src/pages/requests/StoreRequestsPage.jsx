import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import { getSentRequests } from "../../services/requestService";
import { getListResource } from "../../utils/responseUtils";

const statusFilterOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "READ", label: "Read" },
  { value: "ANSWERED", label: "Answered" },
  { value: "CLOSED", label: "Closed" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

function StoreRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequests() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getSentRequests();

        if (shouldUpdateState) {
          setRequests(getListResource(response, ["requests"]));
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Unable to load sent requests.");
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Store requests"
        title="Sent requests"
        description="Track contact and quote requests sent to suppliers."
      >
        <Link to="/catalog">
          <Button>Open catalog</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading sent requests..." />}

      {errorMessage && (
        <ErrorState title="Sent requests unavailable" message={errorMessage} />
      )}

      {!isLoading && !errorMessage && requests.length > 0 && (
        <Card className="mb-5">
          <Select
            label="Filter by status"
            name="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={statusFilterOptions}
            placeholder="All statuses"
          />
        </Card>
      )}

      {!isLoading && !errorMessage && requests.length === 0 && (
        <EmptyState
          title="No sent requests yet"
          message="Start from the catalog, choose a product or supplier, then create your first request."
          action={
            <Link to="/catalog">
              <Button>Browse catalog</Button>
            </Link>
          }
        />
      )}

      {!isLoading &&
        !errorMessage &&
        requests.length > 0 &&
        requests.filter(
          (request) =>
            !statusFilter ||
            String(request.status || "").toUpperCase() === statusFilter,
        ).length === 0 && (
          <EmptyState
            title="No request for this status"
            message="Change or clear the status filter to see more requests."
          />
        )}

      {!isLoading && !errorMessage && requests.length > 0 && (
        <div className="grid gap-4">
          {requests
            .filter(
              (request) =>
                !statusFilter ||
                String(request.status || "").toUpperCase() === statusFilter,
            )
            .map((request) => (
            <Card key={request.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h2 className="m-0 text-2xl font-black">
                      {request.subject}
                    </h2>

                    <StatusBadge status={request.status} />
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-slate-500">
                    {request.message}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <div>
                      <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                        Supplier
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {request.supplier?.companyName || "Unknown supplier"}
                      </p>
                    </div>

                    <div>
                      <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                        Product
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {request.product?.name || "General request"}
                      </p>
                    </div>

                    <div>
                      <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                        Quantity / need
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {request.requestedQuantity || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <Link to={`/store/requests/${request.id}`}>
                  <Button variant="secondary">View details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreRequestsPage;
