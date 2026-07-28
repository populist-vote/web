import {
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildRestInspectorFetchInit, RestInspectorMethod } from "./request";
import styles from "./RestApiInspector.module.scss";

const SANDBOX_API_BASE_URL = "https://api.staging.populist.us/api/v1";
const EXAMPLE_ELECTION_ID = "5fa881d7-f8f3-4b90-9063-45236c85c77a";
const EXAMPLE_RACE_ID = "11111111-2222-4333-8444-555555555555";
const REQUEST_TIMEOUT_MS = 30_000;
const API_EXPLORER_ANCHOR = "api-explorer";
const LEGACY_API_EXPLORER_HASH = "#try-it-in-staging";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type JsonPrimitive = boolean | null | number | string;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };
type ViewMode = "tree" | "raw";
export type InspectorValues = Record<string, string>;
export type InspectorErrors = Record<string, string | undefined>;

interface InspectorResult {
  contentType: string | null;
  elapsedMs: number;
  ok: boolean;
  payload: JsonValue;
  requestId: string | null;
  status: number;
  statusText: string;
}

export interface InspectorSummaryItem {
  label: string;
  value: ReactNode;
}

export interface InspectorSelectOption {
  label: string;
  value: string;
}

export interface RestApiInspectorField {
  fullWidth?: boolean;
  hint?: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "id" | "name" | "onChange" | "value"
  >;
  label: string;
  name: string;
  optional?: boolean;
  options?: InspectorSelectOption[];
}

export interface RestApiInspectorConfig {
  buildBody?: (values: InspectorValues) => unknown;
  buildUrl: (values: InspectorValues) => string;
  description: string;
  downloadFilename: (values: InspectorValues) => string;
  emptyDetail: string;
  fields: RestApiInspectorField[];
  getSummary?: (payload: JsonValue) => InspectorSummaryItem[] | null;
  idPrefix: string;
  initialValues: InspectorValues;
  legacyHashes?: string[];
  loadingDetail: string;
  loadingTitle: string;
  method: RestInspectorMethod;
  notice: ReactNode;
  noticeTitle?: string;
  title: string;
  validate: (values: InspectorValues) => InspectorErrors;
}

export interface ConfigurableRestApiInspectorProps {
  anchorId?: string;
  config: RestApiInspectorConfig;
  formPreamble?: ReactNode;
}

function isJsonRecord(
  value: JsonValue | undefined,
): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dataFrom(payload: JsonValue): JsonValue | undefined {
  return isJsonRecord(payload) ? payload.data : undefined;
}

function collectionFrom(
  payload: JsonValue,
  keys: string[],
): JsonValue[] | null {
  const data = dataFrom(payload);
  if (Array.isArray(data)) {
    return data;
  }
  if (!isJsonRecord(data)) {
    return null;
  }

  for (const key of keys) {
    if (Array.isArray(data[key])) {
      return data[key] as JsonValue[];
    }
  }

  return null;
}

function resourceFrom(payload: JsonValue, key: string) {
  const data = dataFrom(payload);
  if (!isJsonRecord(data)) {
    return null;
  }

  return isJsonRecord(data[key]) ? data[key] : data;
}

function titleFrom(resource: { [key: string]: JsonValue } | null) {
  return resource && typeof resource.title === "string"
    ? resource.title
    : "Untitled";
}

function collectionSummary(
  payload: JsonValue,
  label: string,
  keys: string[],
): InspectorSummaryItem[] | null {
  const items = collectionFrom(payload, keys);
  if (!items) {
    return null;
  }

  return [{ label, value: items.length }];
}

function getBallotSummary(payload: JsonValue): InspectorSummaryItem[] | null {
  const data = dataFrom(payload);
  if (!isJsonRecord(data)) {
    return null;
  }

  const { ballotMeasures, coverage, election, races } = data;
  if (
    !Array.isArray(races) ||
    !Array.isArray(ballotMeasures) ||
    !isJsonRecord(election) ||
    !isJsonRecord(coverage)
  ) {
    return null;
  }

  const raceCoverage =
    typeof coverage.races === "string" ? coverage.races : "unknown";
  const measureCoverage =
    typeof coverage.ballotMeasures === "string"
      ? coverage.ballotMeasures
      : "unknown";

  return [
    {
      label: "Election",
      value: typeof election.title === "string" ? election.title : "Election",
    },
    { label: "Races", value: races.length },
    { label: "Measures", value: ballotMeasures.length },
    {
      label: "Coverage",
      value: (
        <span className={styles.coverage}>
          {raceCoverage}
          {raceCoverage !== measureCoverage && ` / ${measureCoverage}`}
        </span>
      ),
    },
  ];
}

function validateUuid(
  values: InspectorValues,
  errors: InspectorErrors,
  name: string,
  label: string,
  optional = false,
) {
  const value = values[name]?.trim() || "";
  if ((!optional || value) && !UUID_PATTERN.test(value)) {
    errors[name] = `Enter a valid ${label} UUID.`;
  }
}

function validateState(
  values: InspectorValues,
  errors: InspectorErrors,
  name = "state",
) {
  const value = values[name]?.trim() || "";
  if (value && !/^[a-z]{2}$/i.test(value)) {
    errors[name] = "Use a two-letter state or territory code.";
  }
}

function validateInteger(
  values: InspectorValues,
  errors: InspectorErrors,
  name: string,
  label: string,
  min: number,
  max?: number,
) {
  const value = values[name]?.trim() || "";
  if (!value) {
    return;
  }
  const parsed = Number(value);
  if (
    !Number.isInteger(parsed) ||
    parsed < min ||
    (max !== undefined && parsed > max)
  ) {
    errors[name] =
      max === undefined
        ? `${label} must be an integer of at least ${min}.`
        : `${label} must be an integer from ${min} to ${max}.`;
  }
}

function validatePagination(values: InspectorValues, errors: InspectorErrors) {
  validateInteger(values, errors, "limit", "Limit", 1, 100);
  validateInteger(values, errors, "offset", "Offset", 0);
}

function queryStringFor(values: InspectorValues, names: string[]) {
  const search = new URLSearchParams();
  for (const name of names) {
    const value = values[name]?.trim();
    if (value) {
      search.set(name, value);
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

function sandboxUrl(path: string) {
  return `${SANDBOX_API_BASE_URL}${path}`;
}

function encodeId(values: InspectorValues, name: string) {
  return encodeURIComponent(values[name]?.trim() || "");
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
  onValueChange,
  optional = false,
  options,
  ...inputProps
}: {
  error?: string;
  hint?: string;
  label: string;
  onValueChange: (value: string) => void;
  optional?: boolean;
  options?: InspectorSelectOption[];
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const labelId = `${inputProps.id}-label`;
  const hintId = `${inputProps.id}-hint`;
  const errorId = `${inputProps.id}-error`;
  const describedBy = [hint ? hintId : "", error ? errorId : ""]
    .filter(Boolean)
    .join(" ");
  const commonProps = {
    "aria-describedby": describedBy || undefined,
    "aria-invalid": Boolean(error),
    "aria-labelledby": labelId,
    id: inputProps.id,
    name: inputProps.name,
    required: inputProps.required,
    value: inputProps.value,
  };

  return (
    <label className={styles.field} htmlFor={inputProps.id}>
      <span className={styles.fieldLabel} id={labelId}>
        {label}
        {optional && <span>Optional</span>}
      </span>
      {options ? (
        <select
          {...commonProps}
          onChange={(event) => onValueChange(event.target.value)}
          value={String(inputProps.value ?? "")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...inputProps}
          {...commonProps}
          onChange={(event) => onValueChange(event.target.value)}
        />
      )}
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

function SummaryItem({ label, value }: InspectorSummaryItem) {
  return (
    <div className={styles.summaryItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ConfigurableRestApiInspector({
  anchorId = API_EXPLORER_ANCHOR,
  config,
  formPreamble,
}: ConfigurableRestApiInspectorProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const idPrefix = `${config.idPrefix}-${reactId}`;
  const titleId = `${idPrefix}-title`;
  const treeTabId = `${idPrefix}-tree-tab`;
  const rawTabId = `${idPrefix}-raw-tab`;
  const responsePanelId = `${idPrefix}-response-panel`;
  const [form, setForm] = useState<InspectorValues>(config.initialValues);
  const [errors, setErrors] = useState<InspectorErrors>({});
  const [result, setResult] = useState<InspectorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [copyLabel, setCopyLabel] = useState("Copy JSON");
  const abortRef = useRef<AbortController | null>(null);

  const requestUrl = useMemo(() => config.buildUrl(form), [config, form]);
  const prettyPayload = result
    ? JSON.stringify(result.payload, null, 2)
    : undefined;
  const summary =
    result?.ok && config.getSummary ? config.getSummary(result.payload) : null;

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const scrollToInspector = () => {
      const acceptedHashes = [`#${anchorId}`, ...(config.legacyHashes || [])];
      if (!acceptedHashes.includes(window.location.hash)) {
        return;
      }

      window.requestAnimationFrame(() => {
        document.getElementById(anchorId)?.scrollIntoView({ block: "start" });
      });
    };

    scrollToInspector();
    window.addEventListener("hashchange", scrollToInspector);
    return () => window.removeEventListener("hashchange", scrollToInspector);
  }, [anchorId, config.legacyHashes]);

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = config.validate(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
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
      const request = {
        body: config.buildBody?.(form),
        method: config.method,
        url: config.buildUrl(form),
      };
      const response = await fetch(
        request.url,
        buildRestInspectorFetchInit(
          request,
          createRequestId(),
          controller.signal,
        ),
      );
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
            ? "The API sandbox did not respond within 30 seconds."
            : "The browser could not reach the API sandbox. Check your connection and try again.",
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
    anchor.download = config.downloadFilename(form);
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function selectView(nextView: ViewMode) {
    setViewMode(nextView);
    const tabId = nextView === "tree" ? treeTabId : rawTabId;
    window.requestAnimationFrame(() => document.getElementById(tabId)?.focus());
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectView(viewMode === "tree" ? "raw" : "tree");
    } else if (event.key === "Home") {
      event.preventDefault();
      selectView("tree");
    } else if (event.key === "End") {
      event.preventDefault();
      selectView("raw");
    }
  }

  return (
    <section
      className={styles.inspector}
      aria-labelledby={titleId}
      id={anchorId}
    >
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Interactive API inspector</span>
          <h3 id={titleId}>{config.title}</h3>
          <p>{config.description}</p>
        </div>
        <span className={styles.environment}>
          <span aria-hidden="true" />
          Sandbox
        </span>
      </header>

      <div className={styles.notice}>
        <strong>{config.noticeTitle || "Safe testing boundary"}</strong>
        <span>{config.notice}</span>
      </div>

      <div className={styles.workspace}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.requestHeading}>
            <div>
              <span>Request</span>
              <strong>{config.method}</strong>
            </div>
            <code title={requestUrl}>{requestUrl}</code>
          </div>

          {formPreamble}

          <div className={styles.fieldGrid}>
            {config.fields.map((field) => {
              const fieldId = `${idPrefix}-${field.name}`;
              return (
                <div
                  className={
                    field.fullWidth ? styles.fullWidthField : undefined
                  }
                  key={field.name}
                >
                  <Field
                    {...field.inputProps}
                    error={errors[field.name]}
                    hint={field.hint}
                    id={fieldId}
                    label={field.label}
                    name={field.name}
                    onValueChange={(value) => updateField(field.name, value)}
                    optional={field.optional}
                    options={field.options}
                    required={!field.optional}
                    value={form[field.name] || ""}
                  />
                </div>
              );
            })}
          </div>

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
                setForm(config.initialValues);
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
                <strong>{config.loadingTitle}</strong>
                <span>{config.loadingDetail}</span>
              </div>
            )}

            {!isLoading && !result && (
              <div className={styles.emptyState}>
                <span className={styles.emptyGlyph} aria-hidden="true">
                  {"{ }"}
                </span>
                <strong>Your JSON response will appear here</strong>
                <span>{config.emptyDetail}</span>
              </div>
            )}

            {!isLoading && result && (
              <>
                {summary && summary.length > 0 && (
                  <div className={styles.summary}>
                    {summary.map((item) => (
                      <SummaryItem
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                )}

                <div className={styles.responseToolbar}>
                  <div aria-label="Response view" role="tablist">
                    <button
                      aria-controls={responsePanelId}
                      aria-selected={viewMode === "tree"}
                      className={viewMode === "tree" ? styles.activeTab : ""}
                      id={treeTabId}
                      onClick={() => setViewMode("tree")}
                      onKeyDown={handleTabKeyDown}
                      role="tab"
                      tabIndex={viewMode === "tree" ? 0 : -1}
                      type="button"
                    >
                      Tree
                    </button>
                    <button
                      aria-controls={responsePanelId}
                      aria-selected={viewMode === "raw"}
                      className={viewMode === "raw" ? styles.activeTab : ""}
                      id={rawTabId}
                      onClick={() => setViewMode("raw")}
                      onKeyDown={handleTabKeyDown}
                      role="tab"
                      tabIndex={viewMode === "raw" ? 0 : -1}
                      type="button"
                    >
                      Raw JSON
                    </button>
                  </div>
                  <div>
                    <button aria-live="polite" onClick={copyJson} type="button">
                      {copyLabel}
                    </button>
                    <button onClick={downloadJson} type="button">
                      Download
                    </button>
                  </div>
                </div>

                <div
                  aria-label={`${
                    viewMode === "tree" ? "Tree" : "Raw JSON"
                  } response`}
                  className={styles.jsonViewer}
                  id={responsePanelId}
                  role="tabpanel"
                  tabIndex={0}
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

const BALLOT_CONFIG: RestApiInspectorConfig = {
  buildBody: (values) => ({
    address: {
      line1: values.line1?.trim() || "",
      city: values.city?.trim() || "",
      state: values.state?.trim().toUpperCase() || "",
      postalCode: values.postalCode?.trim() || "",
      country: values.country?.trim().toUpperCase() || "",
    },
  }),
  buildUrl: (values) =>
    sandboxUrl(
      `/elections/${encodeId(values, "electionId")}/ballot${queryStringFor(
        values,
        ["endorserId"],
      )}`,
    ),
  description:
    "Send a request to the API sandbox and inspect the complete JSON response.",
  downloadFilename: (values) =>
    `populist-ballot-${values.electionId?.trim() || "election"}.json`,
  emptyDetail: "The example uses Minneapolis City Hall.",
  fields: [
    {
      fullWidth: true,
      inputProps: { autoComplete: "off", maxLength: 36, spellCheck: false },
      label: "Election ID",
      name: "electionId",
    },
    {
      fullWidth: true,
      inputProps: { autoComplete: "street-address", maxLength: 200 },
      label: "Street address",
      name: "line1",
    },
    {
      inputProps: { autoComplete: "address-level2", maxLength: 100 },
      label: "City",
      name: "city",
    },
    {
      inputProps: {
        autoCapitalize: "characters",
        autoComplete: "address-level1",
        maxLength: 2,
      },
      label: "State",
      name: "state",
    },
    {
      inputProps: {
        autoComplete: "postal-code",
        inputMode: "numeric",
        maxLength: 10,
      },
      label: "ZIP code",
      name: "postalCode",
    },
    {
      inputProps: {
        autoCapitalize: "characters",
        autoComplete: "country",
        maxLength: 3,
      },
      label: "Country",
      name: "country",
    },
    {
      fullWidth: true,
      hint: "Filters each race's candidate list to this organization's endorsements.",
      inputProps: { autoComplete: "off", maxLength: 36, spellCheck: false },
      label: "Endorser ID",
      name: "endorserId",
      optional: true,
    },
  ],
  getSummary: getBallotSummary,
  idPrefix: "ballot-inspector",
  initialValues: {
    city: "Minneapolis",
    country: "US",
    electionId: EXAMPLE_ELECTION_ID,
    endorserId: "",
    line1: "350 S 5th St",
    postalCode: "55415",
    state: "MN",
  },
  legacyHashes: [LEGACY_API_EXPLORER_HASH],
  loadingDetail: "Geocoding and district matching can take a moment.",
  loadingTitle: "Resolving ballot data",
  method: "POST",
  notice: (
    <>
      This tool sends the entered address directly to the Populist API sandbox.
      It does not request an API key, send cookies, or save form and response
      data in browser storage. Use non-sensitive test addresses only.
    </>
  ),
  title: "Ballot by Address Explorer",
  validate: (values) => {
    const errors: InspectorErrors = {};
    validateUuid(values, errors, "electionId", "election");
    validateUuid(values, errors, "endorserId", "organization", true);
    if (!values.line1?.trim()) {
      errors.line1 = "Street address is required.";
    }
    if (!values.city?.trim()) {
      errors.city = "City is required.";
    }
    if (!/^[a-z]{2}$/i.test(values.state?.trim() || "")) {
      errors.state = "Use a two-letter state or territory code.";
    }
    if (!/^\d{5}(?:-\d{4})?$/.test(values.postalCode?.trim() || "")) {
      errors.postalCode = "Use a five-digit ZIP or ZIP+4.";
    }
    if (!/^(?:US|USA)$/i.test(values.country?.trim() || "")) {
      errors.country = "This endpoint currently accepts US or USA.";
    }
    return errors;
  },
};

const ELECTION_ID_FIELD: RestApiInspectorField = {
  fullWidth: true,
  inputProps: { autoComplete: "off", maxLength: 36, spellCheck: false },
  label: "Election ID",
  name: "electionId",
};

const RACE_ID_FIELD: RestApiInspectorField = {
  fullWidth: true,
  inputProps: { autoComplete: "off", maxLength: 36, spellCheck: false },
  label: "Race ID",
  name: "raceId",
};

const PAGINATION_FIELDS: RestApiInspectorField[] = [
  {
    inputProps: { inputMode: "numeric", maxLength: 3 },
    label: "Limit",
    name: "limit",
    optional: true,
  },
  {
    inputProps: { inputMode: "numeric", maxLength: 10 },
    label: "Offset",
    name: "offset",
    optional: true,
  },
];

const STATE_FIELD: RestApiInspectorField = {
  inputProps: {
    autoCapitalize: "characters",
    autoComplete: "address-level1",
    maxLength: 2,
  },
  label: "State",
  name: "state",
  optional: true,
};

const PUBLIC_GET_NOTICE = (
  <>
    This tool sends requests directly to the Populist API sandbox without an API
    key or browser cookies. Responses are kept only in this page and are not
    saved in browser storage.
  </>
);

function collectionConfig({
  collectionKeys,
  description,
  fields,
  idPrefix,
  initialValues,
  itemLabel,
  path,
  queryFields,
  title,
  validate,
}: {
  collectionKeys: string[];
  description: string;
  fields: RestApiInspectorField[];
  idPrefix: string;
  initialValues: InspectorValues;
  itemLabel: string;
  path: (values: InspectorValues) => string;
  queryFields: string[];
  title: string;
  validate: (values: InspectorValues) => InspectorErrors;
}): RestApiInspectorConfig {
  return {
    buildUrl: (values) =>
      sandboxUrl(`${path(values)}${queryStringFor(values, queryFields)}`),
    description,
    downloadFilename: (values) =>
      `populist-${idPrefix}-${values.electionId?.trim() || "collection"}.json`,
    emptyDetail: "Adjust the optional filters, then send a sandbox request.",
    fields,
    getSummary: (payload) =>
      collectionSummary(payload, itemLabel, collectionKeys),
    idPrefix,
    initialValues,
    loadingDetail: "The sandbox is preparing the requested election data.",
    loadingTitle: `Loading ${itemLabel.toLowerCase()}`,
    method: "GET",
    notice: PUBLIC_GET_NOTICE,
    title,
    validate,
  };
}

export type ElectionRestEndpoint =
  | "elections"
  | "election-detail"
  | "election-races"
  | "race-detail"
  | "election-results"
  | "election-ballot-measures";

export const ELECTION_REST_ENDPOINT_CONFIGS: Record<
  ElectionRestEndpoint,
  RestApiInspectorConfig
> = {
  elections: collectionConfig({
    collectionKeys: ["elections"],
    description:
      "Find elections for assignment planning, voter guides, and newsroom calendars.",
    fields: [
      STATE_FIELD,
      {
        inputProps: { inputMode: "numeric", maxLength: 4 },
        label: "Year",
        name: "year",
        optional: true,
      },
      {
        fullWidth: true,
        hint: "Searches election titles and other supported text fields.",
        inputProps: { maxLength: 200 },
        label: "Search query",
        name: "query",
        optional: true,
      },
      ...PAGINATION_FIELDS,
    ],
    idPrefix: "elections-inspector",
    initialValues: {
      limit: "25",
      offset: "0",
      query: "",
      state: "MN",
      year: "2026",
    },
    itemLabel: "Elections",
    path: () => "/elections",
    queryFields: ["state", "year", "query", "limit", "offset"],
    title: "Elections Explorer",
    validate: (values) => {
      const errors: InspectorErrors = {};
      validateState(values, errors);
      validateInteger(values, errors, "year", "Year", 1900, 2100);
      validatePagination(values, errors);
      return errors;
    },
  }),
  "election-detail": {
    buildUrl: (values) =>
      sandboxUrl(`/elections/${encodeId(values, "electionId")}`),
    description:
      "Inspect one election's canonical metadata before building coverage around it.",
    downloadFilename: (values) =>
      `populist-election-${values.electionId?.trim() || "detail"}.json`,
    emptyDetail: "The example is the Minnesota 2026 primary election.",
    fields: [ELECTION_ID_FIELD],
    getSummary: (payload) => {
      const election = resourceFrom(payload, "election");
      if (!election) {
        return null;
      }
      return [
        { label: "Election", value: titleFrom(election) },
        {
          label: "Date",
          value:
            typeof election.electionDate === "string"
              ? election.electionDate
              : "Not set",
        },
        {
          label: "State",
          value: typeof election.state === "string" ? election.state : "—",
        },
      ];
    },
    idPrefix: "election-detail-inspector",
    initialValues: { electionId: EXAMPLE_ELECTION_ID },
    loadingDetail: "The sandbox is loading election metadata.",
    loadingTitle: "Loading election",
    method: "GET",
    notice: PUBLIC_GET_NOTICE,
    title: "Election Detail Explorer",
    validate: (values) => {
      const errors: InspectorErrors = {};
      validateUuid(values, errors, "electionId", "election");
      return errors;
    },
  },
  "election-races": collectionConfig({
    collectionKeys: ["races"],
    description:
      "Filter an election's races for race pages, candidate guides, and assignment desks.",
    fields: [
      ELECTION_ID_FIELD,
      STATE_FIELD,
      {
        label: "Race type",
        name: "raceType",
        optional: true,
        options: [
          { label: "Any race type", value: "" },
          { label: "Primary", value: "primary" },
          { label: "General", value: "general" },
        ],
      },
      {
        label: "Political scope",
        name: "politicalScope",
        optional: true,
        options: [
          { label: "Any political scope", value: "" },
          { label: "Local", value: "local" },
          { label: "State", value: "state" },
          { label: "Federal", value: "federal" },
        ],
      },
      {
        label: "Election scope",
        name: "electionScope",
        optional: true,
        options: [
          { label: "Any election scope", value: "" },
          { label: "National", value: "national" },
          { label: "State", value: "state" },
          { label: "County", value: "county" },
          { label: "City", value: "city" },
          { label: "District", value: "district" },
        ],
      },
      {
        label: "District type",
        name: "districtType",
        optional: true,
        options: [
          { label: "Any district type", value: "" },
          { label: "US congressional", value: "us_congressional" },
          { label: "State senate", value: "state_senate" },
          { label: "State house", value: "state_house" },
          { label: "School", value: "school" },
          { label: "City", value: "city" },
          { label: "County", value: "county" },
          { label: "Judicial", value: "judicial" },
          { label: "Hospital", value: "hospital" },
          { label: "Soil and water", value: "soil_and_water" },
          { label: "Transportation", value: "transportation" },
          { label: "Park", value: "park" },
          { label: "Board of education", value: "board_of_education" },
          { label: "Court of appeals", value: "court_of_appeals" },
          { label: "Justice of the peace", value: "justice_of_the_peace" },
          { label: "Constable", value: "constable" },
          { label: "Voting precinct", value: "voting_precinct" },
        ],
      },
      {
        fullWidth: true,
        inputProps: { maxLength: 200 },
        label: "Search query",
        name: "query",
        optional: true,
      },
      ...PAGINATION_FIELDS,
    ],
    idPrefix: "election-races-inspector",
    initialValues: {
      districtType: "",
      electionId: EXAMPLE_ELECTION_ID,
      electionScope: "",
      limit: "25",
      offset: "0",
      politicalScope: "",
      query: "",
      raceType: "",
      state: "",
    },
    itemLabel: "Races",
    path: (values) => `/elections/${encodeId(values, "electionId")}/races`,
    queryFields: [
      "state",
      "raceType",
      "politicalScope",
      "electionScope",
      "districtType",
      "query",
      "limit",
      "offset",
    ],
    title: "Election Races Explorer",
    validate: (values) => {
      const errors: InspectorErrors = {};
      validateUuid(values, errors, "electionId", "election");
      validateState(values, errors);
      validatePagination(values, errors);
      return errors;
    },
  }),
  "race-detail": {
    buildUrl: (values) =>
      sandboxUrl(
        `/elections/${encodeId(values, "electionId")}/races/${encodeId(
          values,
          "raceId",
        )}`,
      ),
    description:
      "Inspect one race with its office, candidates, and current reporting context.",
    downloadFilename: (values) =>
      `populist-race-${values.raceId?.trim() || "detail"}.json`,
    emptyDetail: "Enter a race ID belonging to the selected election.",
    fields: [ELECTION_ID_FIELD, RACE_ID_FIELD],
    getSummary: (payload) => {
      const race = resourceFrom(payload, "race");
      if (!race) {
        return null;
      }
      return [
        { label: "Race", value: titleFrom(race) },
        {
          label: "Type",
          value: typeof race.raceType === "string" ? race.raceType : "—",
        },
        {
          label: "Candidates",
          value: Array.isArray(race.candidates) ? race.candidates.length : "—",
        },
      ];
    },
    idPrefix: "race-detail-inspector",
    initialValues: {
      electionId: EXAMPLE_ELECTION_ID,
      raceId: EXAMPLE_RACE_ID,
    },
    loadingDetail: "The sandbox is loading race and candidate data.",
    loadingTitle: "Loading race",
    method: "GET",
    notice: PUBLIC_GET_NOTICE,
    title: "Race Detail Explorer",
    validate: (values) => {
      const errors: InspectorErrors = {};
      validateUuid(values, errors, "electionId", "election");
      validateUuid(values, errors, "raceId", "race");
      return errors;
    },
  },
  "election-results": collectionConfig({
    collectionKeys: ["results", "races"],
    description:
      "Retrieve paginated race results for live blogs, result boards, and election-night updates.",
    fields: [ELECTION_ID_FIELD, ...PAGINATION_FIELDS],
    idPrefix: "election-results-inspector",
    initialValues: {
      electionId: EXAMPLE_ELECTION_ID,
      limit: "25",
      offset: "0",
    },
    itemLabel: "Results",
    path: (values) => `/elections/${encodeId(values, "electionId")}/results`,
    queryFields: ["limit", "offset"],
    title: "Election Results Explorer",
    validate: (values) => {
      const errors: InspectorErrors = {};
      validateUuid(values, errors, "electionId", "election");
      validatePagination(values, errors);
      return errors;
    },
  }),
  "election-ballot-measures": collectionConfig({
    collectionKeys: ["ballotMeasures"],
    description:
      "Filter ballot measures for explainers, voter guides, and issue-result pages.",
    fields: [
      ELECTION_ID_FIELD,
      STATE_FIELD,
      {
        label: "Status",
        name: "status",
        optional: true,
        options: [
          { label: "Any status", value: "" },
          { label: "Introduced", value: "introduced" },
          { label: "In consideration", value: "in_consideration" },
          { label: "Proposed", value: "proposed" },
          { label: "Gathering signatures", value: "gathering_signatures" },
          { label: "On the ballot", value: "on_the_ballot" },
          { label: "Became law", value: "became_law" },
          { label: "Failed", value: "failed" },
          { label: "Unknown", value: "unknown" },
        ],
      },
      {
        label: "Election scope",
        name: "electionScope",
        optional: true,
        options: [
          { label: "Any election scope", value: "" },
          { label: "National", value: "national" },
          { label: "State", value: "state" },
          { label: "County", value: "county" },
          { label: "City", value: "city" },
          { label: "District", value: "district" },
        ],
      },
      {
        inputProps: { maxLength: 100 },
        label: "County",
        name: "county",
        optional: true,
      },
      {
        inputProps: { maxLength: 100 },
        label: "Municipality",
        name: "municipality",
        optional: true,
      },
      {
        fullWidth: true,
        inputProps: { maxLength: 100 },
        label: "School district",
        name: "schoolDistrict",
        optional: true,
      },
      ...PAGINATION_FIELDS,
    ],
    idPrefix: "election-measures-inspector",
    initialValues: {
      county: "",
      electionId: EXAMPLE_ELECTION_ID,
      electionScope: "",
      limit: "25",
      municipality: "",
      offset: "0",
      schoolDistrict: "",
      state: "",
      status: "",
    },
    itemLabel: "Ballot measures",
    path: (values) =>
      `/elections/${encodeId(values, "electionId")}/ballot-measures`,
    queryFields: [
      "state",
      "status",
      "electionScope",
      "county",
      "municipality",
      "schoolDistrict",
      "limit",
      "offset",
    ],
    title: "Election Ballot Measures Explorer",
    validate: (values) => {
      const errors: InspectorErrors = {};
      validateUuid(values, errors, "electionId", "election");
      validateState(values, errors);
      validatePagination(values, errors);
      return errors;
    },
  }),
};

const ELECTION_ENDPOINT_OPTIONS: {
  label: string;
  value: ElectionRestEndpoint;
}[] = [
  { label: "Elections", value: "elections" },
  { label: "Election detail", value: "election-detail" },
  { label: "Election races", value: "election-races" },
  { label: "Race detail", value: "race-detail" },
  { label: "Election results", value: "election-results" },
  {
    label: "Election ballot measures",
    value: "election-ballot-measures",
  },
];

export function ElectionRestApiInspector({
  anchorId = API_EXPLORER_ANCHOR,
  endpoint = "elections",
}: {
  anchorId?: string;
  endpoint?: ElectionRestEndpoint;
}) {
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<ElectionRestEndpoint>(endpoint);
  const selectorId = `${useId().replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  )}-endpoint-selector`;
  const selectorLabelId = `${selectorId}-label`;

  useEffect(() => setSelectedEndpoint(endpoint), [endpoint]);

  return (
    <ConfigurableRestApiInspector
      anchorId={anchorId}
      config={ELECTION_REST_ENDPOINT_CONFIGS[selectedEndpoint]}
      formPreamble={
        <label className={styles.endpointSelector} htmlFor={selectorId}>
          <span className={styles.fieldLabel} id={selectorLabelId}>
            Endpoint
          </span>
          <select
            aria-labelledby={selectorLabelId}
            id={selectorId}
            onChange={(event) =>
              setSelectedEndpoint(event.target.value as ElectionRestEndpoint)
            }
            value={selectedEndpoint}
          >
            {ELECTION_ENDPOINT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      }
      key={selectedEndpoint}
    />
  );
}

export function RestApiInspector({
  anchorId = API_EXPLORER_ANCHOR,
}: {
  anchorId?: string;
}) {
  return (
    <ConfigurableRestApiInspector anchorId={anchorId} config={BALLOT_CONFIG} />
  );
}
