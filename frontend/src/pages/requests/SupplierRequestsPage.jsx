import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getReceivedRequests } from "../../services/requestService";

function SupplierRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequests() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getReceivedRequests();

        if (shouldUpdateState) {
          setRequests(response.requests || []);
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Unable to load received requests.");
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
        eyebrow="Supplier requests"
        title="Received requests"
        description="Track contact and quote requests received from stores."
      />

      {isLoading && <LoadingState message="Loading received requests..." />}

      {errorMessage && (
        <ErrorState
          title="Received requests unavailable"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && requests.length === 0 && (
        <EmptyState
          title="No received requests yet"
          message="Requests from stores will appear here when they contact your supplier profile."
        />
      )}

      {!isLoading && !errorMessage && requests.length > 0 && (
        <div className="grid gap-4">
          {requests.map((request) => (
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
                        Store
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {request.store?.storeName || "Unknown store"}
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

                <Link to={`/supplier/requests/${request.id}`}>
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

export default SupplierRequestsPage;
