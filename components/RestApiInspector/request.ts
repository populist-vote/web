export type RestInspectorMethod = "GET" | "POST";

export interface RestInspectorRequest {
  body?: unknown;
  method: RestInspectorMethod;
  url: string;
}

export function buildRestInspectorFetchInit(
  request: RestInspectorRequest,
  requestId: string,
  signal?: AbortSignal,
): RequestInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Request-Id": requestId,
  };
  const init: RequestInit = {
    cache: "no-store",
    credentials: "omit",
    headers,
    method: request.method,
    signal,
  };

  if (request.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(request.body);
  }

  return init;
}
