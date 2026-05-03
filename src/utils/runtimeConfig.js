/**
 * Production: Express serves /runtime-config.js (see server.js) using Cloud Run env vars.
 * Local dev: uses CRA-injected process.env from .env
 */
export function getGoogleClientId() {
  const fromRuntime =
    typeof window !== "undefined" &&
    window.__RUNTIME_CONFIG__?.REACT_APP_GOOGLE_CLIENT_ID;
  if (fromRuntime) {
    return String(fromRuntime);
  }
  return process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
}

export function getVertexApiKey() {
  const fromRuntime =
    typeof window !== "undefined" &&
    window.__RUNTIME_CONFIG__?.REACT_APP_VERTEX_API_KEY;
  if (fromRuntime) {
    return String(fromRuntime);
  }
  return process.env.REACT_APP_VERTEX_API_KEY || "";
}
