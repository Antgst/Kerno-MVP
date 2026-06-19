import { useState } from "react";
import {
  getProductFallback,
  getProductImageSource,
} from "../../utils/productImages";

function ProductImage({
  product,
  alt,
  className = "",
  loading = "lazy",
}) {
  const fallback = getProductFallback(product);
  const configuredSource = getProductImageSource(product);
  const [failedSource, setFailedSource] = useState("");
  const configuredSourceFailed =
    configuredSource && failedSource === configuredSource;
  const source =
    configuredSource && !configuredSourceFailed
      ? configuredSource
      : fallback.source;

  if (!source && fallback.kind === "neutral") {
    return (
      <span
        className={["product-image-neutral", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={alt || `Aperçu neutre du produit ${product?.name || "KERNO"}`}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3c4.5 2.1 7 5.3 7 9a7 7 0 0 1-14 0c0-3.7 2.5-6.9 7-9Z" />
          <path d="M8.5 14.5c2-3 4.3-5.1 7-6.5" />
          <path d="M12 17c-1.1-2.1-1.2-4.2-.4-6.2" />
        </svg>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={source}
      alt={alt || `Aperçu du produit ${product?.name || "KERNO"}`}
      loading={loading}
      onError={() => {
        if (configuredSource && source === configuredSource) {
          setFailedSource(configuredSource);
        }
      }}
    />
  );
}

export default ProductImage;
