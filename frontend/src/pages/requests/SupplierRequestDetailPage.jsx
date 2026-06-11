import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  getRequestById,
  updateRequestStatus,
} from "../../services/requestService";

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "READ", label: "Read" },
  { value: "ANSWERED", label: "Answered" },
  { value: "CLOSED", label: "Closed" },
];

function SupplierRequestDetailPage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequest() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getRequestById(id);

        if (shouldUpdateState) {
          setRequest(response.request);
          setSelectedStatus(response.request.status);
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

  async function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === request.status) {
      return;
    }

    setIsUpdatingStatus(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await updateRequestStatus(request.id, {
        status: selectedStatus,
      });

      setRequest(response.request);
      setSelectedStatus(response.request.status);
      setStatusMessage("Request status updated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to update request status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Received request"
        title={request?.subject || "Request details"}
        description="Review the contact request received from a store."
      >
        <Link to="/supplier/requests">
          <Button variant="secondary">Back to received requests</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading request details..." />}

      {errorMessage && (
        <ErrorState
          className="mb-6"
          title="Request unavailable"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && !request && (
        <EmptyState
          title="Request not found"
          message="The request may no longer exist."
        />
      )}

      {!isLoading && request && (
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
                  Product
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {request.product?.name || "General request"}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card>
              <h2 className="m-0 text-xl font-black">Store information</h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Store
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {request.store?.storeName || "Unknown store"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Brand
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {request.store?.brandName || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {request.store?.location || "Not provided"}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="m-0 text-xl font-black">Request status</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep request tracking simple. This is not a full messaging or
                order management system.
              </p>

              {statusMessage && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                  {statusMessage}
                </div>
              )}

              {isUpdatingStatus && (
                <LoadingState
                  className="mt-5"
                  message="Updating request status..."
                />
              )}

              <div className="mt-5 space-y-4">
                <Select
                  label="Status"
                  name="status"
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  options={statusOptions}
                  placeholder="Choose a status"
                />

                <Button
                  className="w-full"
                  disabled={
                    isUpdatingStatus || selectedStatus === request.status
                  }
                  onClick={handleStatusUpdate}
                >
                  Update status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierRequestDetailPage;
