import Button from "./Button";

function ErrorState({
  title = "Something went wrong",
  message = "Please try again later.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-red-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
    >
      <h3 className="m-0 text-base font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>

      {onRetry && (
        <Button className="mt-4" variant="danger" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
