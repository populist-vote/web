import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./RestApiInspector.module.scss";

const STAGING_API_BASE_URL = "https://api.staging.populist.us/api/v1";
const EXAMPLE_ELECTION_ID = "5fa881d7-f8f3-4b90-9063-45236c85c77a";
const REQUEST_TIMEOUT_MS = 30_000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type JsonPrimitive = boolean | null | number | string;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type ViewMode = "tree" | "raw";

interface InspectorForm {
  city: string;
  country: string;
  electionId: string;
  endorserId: string;
  line1: string;
  postalCode: string;
  state: string;
}

interface InspectorResult {
  contentType: string | null;
  elapsedMs: number;
  ok: boolean;
  payload: JsonValue;
  requestId: string | null;
  status: number;
  statusText: string;
}

interface BallotSummary {
  ballotMeasureCount: number;
  ballotMeasureCoverage: string;
  electionTitle: string;
  raceCount: number;
  raceCoverage: string;
}

const INITIAL_FORM: InspectorForm = {
  city: "Minneapolis",
  country: "US",
  electionId: EXAMPLE_ELECTION_ID,
  endorserId: "",
  line1: "350 S 5th St",
  postalCode: "55415",
  state: "MN",
};

function isJsonRecord(
  value: JsonValue | undefined,
): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getBallotSummary(payload: JsonValue): BallotSummary | null {
  if (!isJsonRecord(payload) || !isJsonRecord(payload.data)) {
    return null;
  }

  const { ballotMeasures, coverage, election, races } = payload.data;
  if (
    !Array.isArray(races) ||
    !Array.isArray(ballotMeasures) ||
    !isJsonRecord(election) ||
    !isJsonRecord(coverage)
  ) {
    return null;
  }

  return {
    ballotMeasureCount: ballotMeasures.length,
    ballotMeasureCoverage:
      typeof coverage.ballotMeasures === "string"
        ? coverage.ballotMeasures
        : "unknown",
    electionTitle:
      typeof election.title === "string" ? election.title : "Election",
    raceCount: races.length,
    raceCoverage:
      typeof coverage.races === "string" ? coverage.races : "unknown",
  };
}

function validateForm(form: InspectorForm): Partial<InspectorForm> {
  const errors: Partial<InspectorForm> = {};

  if (!UUID_PATTERN.test(form.electionId.trim())) {
    errors.electionId = "Enter a valid election UUID.";
  }
  if (form.endorserId.trim() && !UUID_PATTERN.test(form.endorserId.trim())) {
    errors.endorserId = "Enter a valid organization UUID or leave this blank.";
  }
  if (!form.line1.trim()) {
    errors.line1 = "Street address is required.";
  }
  if (!form.city.trim()) {
    errors.city = "City is required.";
  }
  if (!/^[a-z]{2}$/i.test(form.state.trim())) {
    errors.state = "Use a two-letter state or territory code.";
  }
  if (!/^\d{5}(?:-\d{4})?$/.test(form.postalCode.trim())) {
    errors.postalCode = "Use a five-digit ZIP or ZIP+4.";
  }
  if (!/^(?:US|USA)$/i.test(form.country.trim())) {
    errors.country = "This endpoint currently accepts US or USA.";
  }

  return errors;
}

function requestUrlFor(form: InspectorForm) {
  const path = `/elections/${encodeURIComponent(form.electionId.trim())}/ballot`;
  const endorserId = form.endorserId.trim();
  const query = endorserId
    ? `?endorserId=${encodeURIComponent(endorserId)}`
    : "";

  return `${STAGING_API_BASE_URL}${path}${query}`;
}

function requestBodyFor(form: InspectorForm) {
  return {
    address: {
      line1: form.line1.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim().toUpperCase(),
    },
  };
}

function createRequestId() {
  if (typeof crypto.randomUUID === "function") {
    return `docs-${crypto.randomUUID()}`;
  }

  return `docs-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function scalar(value: JsonPrimitive) {
  if (value === null) {
    return <span className={styles.jsonNull}>null</span>;
  }
  if (typeof value === "string") {
    return <span className={styles.jsonString}>{JSON.stringify(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className={styles.jsonNumber}>{value}</span>;
  }
  return <span className={styles.jsonBoolean}>{String(value)}</span>;
}

function JsonNode({
  depth,
  name,
  value,
}: {
  depth: number;
  name?: string;
  value: JsonValue;
}) {
  const expandable = typeof value === "object" && value !== null;
  const [isOpen, setIsOpen] = useState(depth < 2);

  if (!expandable) {
    return (
      <div className={styles.jsonRow}>
        {name !== undefined && (
          <span className={styles.jsonKey}>{JSON.stringify(name)}: </span>
        )}
        {scalar(value)}
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  const openingBracket = Array.isArray(value) ? "[" : "{";
  const closingBracket = Array.isArray(value) ? "]" : "}";
  const itemLabel = `${entries.length} ${
    entries.length === 1 ? "item" : "items"
  }`;

  return (
    <details
      className={styles.jsonDetails}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>
        {name !== undefined && (
          <span className={styles.jsonKey}>{JSON.stringify(name)}: </span>
        )}
        <span className={styles.jsonBracket}>{openingBracket}</span>
        {!isOpen && <span className={styles.jsonCount}> {itemLabel} </span>}
        {!isOpen && (
          <span className={styles.jsonBracket}>{closingBracket}</span>
        )}
      </summary>
      {isOpen && (
        <>
          <div className={styles.jsonChildren}>
            {entries.map(([key, child]) => (
              <JsonNode depth={depth + 1} key={key} name={key} value={child} />
            ))}
          </div>
          <div className={styles.jsonBracket}>{closingBracket}</div>
        </>
      )}
    </details>
  );
}

function Field({
  error,
  hint,
  label,
  optional = false,
  ...inputProps
}: {
  error?: string;
  hint?: string;
  label: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = `${inputProps.id}-hint`;
  const errorId = `${inputProps.id}-error`;
  const describedBy = [hint ? hintId : "", error ? errorId : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={styles.field} htmlFor={inputProps.id}>
      <span className={styles.fieldLabel}>
        {label}
        {optional && <span>Optional</span>}
      </span>
      <input
        {...inputProps}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
      />
      {hint && (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      )}
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={styles.summaryItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function RestApiInspector() {
  const [form, setForm] = useState<InspectorForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<InspectorForm>>({});
  const [result, setResult] = useState<InspectorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [copyLabel, setCopyLabel] = useState("Copy JSON");
  const abortRef = useRef<AbortController | null>(null);

  const requestUrl = useMemo(() => requestUrlFor(form), [form]);
  const prettyPayload = result
    ? JSON.stringify(result.payload, null, 2)
    : undefined;
  const summary = result?.ok ? getBallotSummary(result.payload) : null;

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const scrollToInspector = () => {
      if (window.location.hash !== "#try-it-in-staging") {
        return;
      }

      window.requestAnimationFrame(() => {
        document
          .getElementById("try-it-in-staging")
          ?.scrollIntoView({ block: "start" });
      });
    };

    scrollToInspector();
    window.addEventListener("hashchange", scrollToInspector);
    return () => window.removeEventListener("hashchange", scrollToInspector);
  }, []);

  function updateField(field: keyof InspectorForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );
    const startedAt = performance.now();
    setIsLoading(true);
    setResult(null);
    setCopyLabel("Copy JSON");

    try {
      const response = await fetch(requestUrlFor(form), {
        method: "POST",
        body: JSON.stringify(requestBodyFor(form)),
        cache: "no-store",
        credentials: "omit",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Request-Id": createRequestId(),
        },
        signal: controller.signal,
      });
      const responseText = await response.text();
      let payload: JsonValue = null;

      if (responseText) {
        try {
          payload = JSON.parse(responseText) as JsonValue;
        } catch {
          payload = responseText;
        }
      }

      setResult({
        contentType: response.headers.get("content-type"),
        elapsedMs: Math.round(performance.now() - startedAt),
        ok: response.ok,
        payload,
        requestId: response.headers.get("x-request-id"),
        status: response.status,
        statusText: response.statusText,
      });
      setViewMode("tree");
    } catch (error) {
      const aborted =
        error instanceof DOMException && error.name === "AbortError";
      setResult({
        contentType: null,
        elapsedMs: Math.round(performance.now() - startedAt),
        ok: false,
        payload: {
          title: aborted ? "Request timed out" : "Request failed",
          detail: aborted
            ? "The staging API did not respond within 30 seconds."
            : "The browser could not reach the staging API. Check your connection and try again.",
        },
        requestId: null,
        status: 0,
        statusText: aborted ? "Timeout" : "Network error",
      });
      setViewMode("tree");
    } finally {
      window.clearTimeout(timeoutId);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setIsLoading(false);
    }
  }

  async function copyJson() {
    if (!prettyPayload) {
      return;
    }
    try {
      await navigator.clipboard.writeText(prettyPayload);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy JSON"), 2000);
    } catch {
      setCopyLabel("Copy failed");
    }
  }

  function downloadJson() {
    if (!prettyPayload) {
      return;
    }
    const url = URL.createObjectURL(
      new Blob([prettyPayload], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `populist-ballot-${form.electionId.trim()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      className={styles.inspector}
      aria-labelledby="api-inspector-title"
      id="try-it-in-staging"
    >
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Interactive API inspector</span>
          <h3 id="api-inspector-title">Try Ballot by Address</h3>
          <p>
            Send a request to the live staging API and inspect the complete JSON
            response.
          </p>
        </div>
        <span className={styles.environment}>
          <span aria-hidden="true" />
          Staging
        </span>
      </header>

      <div className={styles.notice}>
        <strong>Safe testing boundary</strong>
        <span>
          This tool sends the entered address directly to Populist staging. It
          does not request an API key, send cookies, or save form and response
          data in browser storage. Use non-sensitive test addresses only.
        </span>
      </div>

      <div className={styles.workspace}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.requestHeading}>
            <div>
              <span>Request</span>
              <strong>POST</strong>
            </div>
            <code title={requestUrl}>{requestUrl}</code>
          </div>

          <Field
            autoComplete="off"
            error={errors.electionId}
            id="rest-inspector-election"
            label="Election ID"
            maxLength={36}
            onChange={(event) => updateField("electionId", event.target.value)}
            required
            spellCheck={false}
            value={form.electionId}
          />

          <div className={styles.addressGrid}>
            <Field
              autoComplete="street-address"
              error={errors.line1}
              id="rest-inspector-line1"
              label="Street address"
              maxLength={200}
              onChange={(event) => updateField("line1", event.target.value)}
              required
              value={form.line1}
            />
            <Field
              autoComplete="address-level2"
              error={errors.city}
              id="rest-inspector-city"
              label="City"
              maxLength={100}
              onChange={(event) => updateField("city", event.target.value)}
              required
              value={form.city}
            />
            <Field
              autoCapitalize="characters"
              autoComplete="address-level1"
              error={errors.state}
              id="rest-inspector-state"
              label="State"
              maxLength={2}
              onChange={(event) => updateField("state", event.target.value)}
              required
              value={form.state}
            />
            <Field
              autoComplete="postal-code"
              error={errors.postalCode}
              id="rest-inspector-postal-code"
              inputMode="numeric"
              label="ZIP code"
              maxLength={10}
              onChange={(event) =>
                updateField("postalCode", event.target.value)
              }
              required
              value={form.postalCode}
            />
            <Field
              autoCapitalize="characters"
              autoComplete="country"
              error={errors.country}
              id="rest-inspector-country"
              label="Country"
              maxLength={3}
              onChange={(event) => updateField("country", event.target.value)}
              required
              value={form.country}
            />
          </div>

          <Field
            autoComplete="off"
            error={errors.endorserId}
            hint="Filters each race's candidate list to this organization's endorsements."
            id="rest-inspector-endorser"
            label="Endorser ID"
            maxLength={36}
            onChange={(event) => updateField("endorserId", event.target.value)}
            optional
            spellCheck={false}
            value={form.endorserId}
          />

          <div className={styles.formActions}>
            <button
              className={styles.sendButton}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Sending request
                </>
              ) : (
                "Send request"
              )}
            </button>
            <button
              className={styles.resetButton}
              disabled={isLoading}
              onClick={() => {
                setForm(INITIAL_FORM);
                setErrors({});
                setResult(null);
              }}
              type="button"
            >
              Reset example
            </button>
          </div>
        </form>

        <div className={styles.response}>
          <div className={styles.responseHeader}>
            <div>
              <span>Response</span>
              {result && (
                <strong
                  className={result.ok ? styles.statusOk : styles.statusError}
                >
                  {result.status > 0 ? result.status : "—"} {result.statusText}
                </strong>
              )}
            </div>
            {result && (
              <div className={styles.responseMeta}>
                <span>{result.elapsedMs} ms</span>
                {result.requestId && (
                  <span title={result.requestId}>
                    Request ID <code>{result.requestId}</code>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className={styles.responseBody} aria-live="polite">
            {isLoading && (
              <div className={styles.emptyState}>
                <span className={styles.largeSpinner} aria-hidden="true" />
                <strong>Resolving ballot data</strong>
                <span>Geocoding and district matching can take a moment.</span>
              </div>
            )}

            {!isLoading && !result && (
              <div className={styles.emptyState}>
                <span className={styles.emptyGlyph} aria-hidden="true">
                  {"{ }"}
                </span>
                <strong>Your JSON response will appear here</strong>
                <span>The example uses Minneapolis City Hall.</span>
              </div>
            )}

            {!isLoading && result && (
              <>
                {summary && (
                  <div className={styles.summary}>
                    <SummaryItem
                      label="Election"
                      value={summary.electionTitle}
                    />
                    <SummaryItem label="Races" value={summary.raceCount} />
                    <SummaryItem
                      label="Measures"
                      value={summary.ballotMeasureCount}
                    />
                    <SummaryItem
                      label="Coverage"
                      value={
                        <span className={styles.coverage}>
                          {summary.raceCoverage}
                          {summary.raceCoverage !==
                            summary.ballotMeasureCoverage &&
                            ` / ${summary.ballotMeasureCoverage}`}
                        </span>
                      }
                    />
                  </div>
                )}

                <div className={styles.responseToolbar}>
                  <div aria-label="Response view" role="tablist">
                    <button
                      aria-selected={viewMode === "tree"}
                      className={viewMode === "tree" ? styles.activeTab : ""}
                      onClick={() => setViewMode("tree")}
                      role="tab"
                      type="button"
                    >
                      Tree
                    </button>
                    <button
                      aria-selected={viewMode === "raw"}
                      className={viewMode === "raw" ? styles.activeTab : ""}
                      onClick={() => setViewMode("raw")}
                      role="tab"
                      type="button"
                    >
                      Raw JSON
                    </button>
                  </div>
                  <div>
                    <button onClick={copyJson} type="button">
                      {copyLabel}
                    </button>
                    <button onClick={downloadJson} type="button">
                      Download
                    </button>
                  </div>
                </div>

                <div
                  aria-label={`${viewMode === "tree" ? "Tree" : "Raw JSON"} response`}
                  className={styles.jsonViewer}
                  role="tabpanel"
                >
                  {viewMode === "tree" ? (
                    <JsonNode depth={0} value={result.payload} />
                  ) : (
                    <pre>{prettyPayload}</pre>
                  )}
                </div>

                <div className={styles.responseFooter}>
                  <span>
                    {result.contentType || "No content type returned"}
                  </span>
                  <span>Responses are not saved by this inspector</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
