const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ALLOWED_ORIGINS = new Set([
  "https://tacc-code-tacclab.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

const PARTICIPANT_FIELDS = [
  "age_band", "gender", "alertness", "sleep_quality", "prior_belief",
  "alcohol_12h", "psychoactive_12h", "attention_medication", "caffeine_4h",
  "physical_presence", "observer_attention", "observer_relationship", "gaming",
  "gambling", "prior_participation",
] as const;

const REQUIRED_FIELDS = PARTICIPANT_FIELDS.filter((field) => field !== "gender");

const ALLOWED_VALUES: Record<string, string[]> = {
  age_band: ["18–24", "25–34", "35–44", "45–54", "55–64", "65+", "Prefer not to say"],
  gender: ["", "Woman", "Man", "Non-binary / another identity"],
  alertness: ["1", "2", "3", "4", "5"],
  sleep_quality: ["1", "2", "3", "4", "5"],
  prior_belief: ["1", "2", "3", "4", "5", "6", "7"],
  alcohol_12h: ["None", "1 standard drink", "2 standard drinks", "3 or more standard drinks", "Prefer not to say"],
  psychoactive_12h: ["No", "Yes", "Prefer not to say"],
  attention_medication: ["No", "Yes", "Unsure", "Prefer not to say"],
  caffeine_4h: ["None", "1 serving", "2 servings", "3 or more servings", "Prefer not to say"],
  physical_presence: ["Completely alone", "One person nearby", "Two or more people nearby", "Prefer not to say"],
  observer_attention: ["No one is nearby", "Nearby, but not watching", "Watching occasionally", "Watching most or all rounds", "Prefer not to say"],
  observer_relationship: ["Not applicable — I am alone", "Romantic partner / spouse", "Family member", "Friend", "Colleague / acquaintance", "Other or mixed group", "Prefer not to say"],
  gaming: ["Never", "Monthly or less", "Weekly", "Most days", "Daily"],
  gambling: ["Never", "Less than monthly", "Monthly", "Weekly or more", "Prefer not to say"],
  prior_participation: ["No", "Yes", "Not sure"],
};

function cors(origin: string | null): HeadersInit {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://tacc-code-tacclab.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(status: number, value: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...cors(origin) },
  });
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function rpc(name: string, params: Record<string, unknown>): Promise<unknown> {
  assert(SUPABASE_URL && SERVICE_ROLE_KEY, "SERVER_CONFIGURATION_ERROR");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(params),
  });
  const text = await response.text();
  let payload: unknown = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload
      ? String((payload as { message: unknown }).message)
      : `DATABASE_ERROR_${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function validateIdentity(body: Record<string, unknown>): { publicId: string; tokenHash: Promise<string> } {
  const publicId = String(body.public_id ?? "");
  const token = String(body.session_token ?? "");
  assert(/^MJ2-[0-9A-F]{16}$/.test(publicId), "INVALID_SESSION_ID");
  assert(/^[0-9a-f]{64}$/.test(token), "INVALID_SESSION_TOKEN");
  return { publicId, tokenHash: sha256Hex(token) };
}

function cleanParticipant(input: unknown): Record<string, string> {
  assert(typeof input === "object" && input !== null && !Array.isArray(input), "INVALID_PARTICIPANT");
  const source = input as Record<string, unknown>;
  const clean: Record<string, string> = {};
  for (const field of PARTICIPANT_FIELDS) {
    const value = String(source[field] ?? "");
    assert(ALLOWED_VALUES[field].includes(value), `INVALID_${field.toUpperCase()}`);
    clean[field] = value;
  }
  for (const field of REQUIRED_FIELDS) assert(clean[field] !== "", `MISSING_${field.toUpperCase()}`);
  return clean;
}

function cleanConsents(input: unknown): Record<string, boolean> {
  assert(typeof input === "object" && input !== null && !Array.isArray(input), "INVALID_CONSENT");
  const source = input as Record<string, unknown>;
  const keys = ["adult", "understood", "consent", "storage", "solo_decisions", "summary_reporting"];
  const clean: Record<string, boolean> = {};
  for (const key of keys) {
    clean[key] = source[key] === true;
    assert(clean[key], `CONSENT_REQUIRED_${key.toUpperCase()}`);
  }
  return clean;
}

async function handle(body: Record<string, unknown>): Promise<unknown> {
  const action = String(body.action ?? "");

  if (action === "create_session") {
    const clientNonce = String(body.client_nonce ?? "");
    const sessionToken = String(body.session_token ?? "");
    const nickname = String(body.research_nickname ?? "").trim().toLowerCase();
    assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(clientNonce), "INVALID_CLIENT_NONCE");
    assert(/^[0-9a-f]{64}$/.test(sessionToken), "INVALID_SESSION_TOKEN");
    assert(/^[a-z0-9_-]{4,20}$/.test(nickname), "INVALID_RESEARCH_NICKNAME");
    assert(body.assets_verified === true, "ASSET_VERIFICATION_REQUIRED");
    const participant = cleanParticipant(body.participant);
    const consents = cleanConsents(body.consents);
    const clientSource = typeof body.client === "object" && body.client !== null ? body.client as Record<string, unknown> : {};
    const client = {
      language: String(clientSource.language ?? "").slice(0, 20),
      screen_bucket: ["small", "medium", "large"].includes(String(clientSource.screen_bucket)) ? String(clientSource.screen_bucket) : "unknown",
      touch: clientSource.touch === true,
      timezone: String(clientSource.timezone ?? "").slice(0, 80),
      user_agent_family: String(clientSource.user_agent_family ?? "browser").slice(0, 30),
    };
    return await rpc("mj_v2_create_session", {
      p_client_nonce: clientNonce,
      p_token_hash: await sha256Hex(sessionToken),
      p_longitudinal_id: await sha256Hex(`mind-jackpot-longitudinal-v2|${nickname}`),
      p_participant: participant,
      p_consents: consents,
      p_client: client,
      p_assets_verified: true,
      p_is_test: false,
    });
  }

  if (action === "reveal_round") {
    const { publicId, tokenHash } = validateIdentity(body);
    const roundIndex = Number(body.round_index);
    const prediction = body.prediction;
    const responseMs = body.response_ms === null || body.response_ms === undefined ? null : Number(body.response_ms);
    assert(Number.isInteger(roundIndex) && roundIndex >= 1 && roundIndex <= 60, "INVALID_ROUND");
    assert(Array.isArray(prediction) && prediction.length === 3 && prediction.every((value) => Number.isInteger(value) && value >= 0 && value < 6), "INVALID_PREDICTION");
    assert(responseMs === null || (Number.isInteger(responseMs) && responseMs >= 0 && responseMs <= 3600000), "INVALID_RESPONSE_TIME");
    return await rpc("mj_v2_reveal_round", {
      p_public_id: publicId,
      p_token_hash: await tokenHash,
      p_round_index: roundIndex,
      p_prediction: prediction,
      p_response_ms: responseMs,
    });
  }

  if (action === "start_bonus") {
    const { publicId, tokenHash } = validateIdentity(body);
    return await rpc("mj_v2_start_bonus", { p_public_id: publicId, p_token_hash: await tokenHash });
  }

  if (action === "finish_session") {
    const { publicId, tokenHash } = validateIdentity(body);
    const mode = String(body.finish_mode ?? "");
    assert(mode === "primary_only" || mode === "primary_plus_bonus", "INVALID_FINISH_MODE");
    return await rpc("mj_v2_finish_session", { p_public_id: publicId, p_token_hash: await tokenHash, p_finish_mode: mode });
  }

  if (action === "resume_session") {
    const { publicId, tokenHash } = validateIdentity(body);
    return await rpc("mj_v2_resume_session", { p_public_id: publicId, p_token_hash: await tokenHash });
  }

  throw new Error("UNKNOWN_ACTION");
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (request.method !== "POST") return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" }, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(403, { ok: false, error: "ORIGIN_NOT_ALLOWED" }, origin);
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 32768) return json(413, { ok: false, error: "REQUEST_TOO_LARGE" }, origin);
  try {
    const raw = await request.text();
    if (raw.length > 32768) return json(413, { ok: false, error: "REQUEST_TOO_LARGE" }, origin);
    const body = JSON.parse(raw) as Record<string, unknown>;
    const data = await handle(body);
    return json(200, { ok: true, data }, origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const safe = message.startsWith("MJ2_") || /^[A-Z0-9_]+$/.test(message) ? message : "REQUEST_FAILED";
    const status = safe.includes("NOT_FOUND") ? 404 : safe.includes("CONFLICT") || safe.includes("ALREADY") ? 409 : safe.includes("SERVER_CONFIGURATION") ? 500 : 400;
    return json(status, { ok: false, error: safe }, origin);
  }
});
