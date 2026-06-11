import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getRequestById } from "../../services/requestService";

function StoreRequestDetailPage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequest() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getRequestById(id);

        if (shouldUpdateState) {
          setRequest(response.request);
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Unable to load request details.");
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadRequest();

    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Sent request"
        title={request?.subject || "Request details"}
        description="Review the contact request you sent to a supplier."
      >
        <Link to="/store/requests">
          <Button variant="secondary">Back to sent requests</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading request details..." />}

      {errorMessage && (
        <ErrorState title="Request unavailable" message={errorMessage} />
      )}

      {!isLoading && !errorMessage && !request && (
        <EmptyState
          title="Request not found"
          message="The request may no longer exist."
        />
      )}

      {!isLoading && !errorMessage && request && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Request subject
                </p>
                <h2 className="mt-2 text-3xl font-black">{request.subject}</h2>
              </div>

              <StatusBadge status={request.status} />
            </div>

            <p className="text-base leading-8 text-slate-600">
              {request.message}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Requested quantity / need
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {request.requestedQuantity || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Status
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {request.status}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="m-0 text-xl font-black">Linked information</h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Supplier
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {request.supplier?.companyName || "Unknown supplier"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {request.supplier?.location || "No location provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Product
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {request.product?.name || "General request"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {request.product?.priceInfo || "No price information"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default StoreRequestDetailPage;
