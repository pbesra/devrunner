import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type Mode      = "decode" | "encode";
type Algorithm = "HS256" | "HS384" | "HS512";
type SigStatus = "idle" | "valid" | "invalid" | "unverified";

// ── Helpers ────────────────────────────────────────────────────────────────

function base64UrlDecode(str: string): string {
  const pad    = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const base64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

function base64UrlEncode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeJwt(token: string): {
  header?:    Record<string, unknown>;
  payload?:   Record<string, unknown>;
  signature?: string;
  error?:     string;
} {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3)
      return { error: "Invalid JWT: must have 3 parts (header.payload.signature)" };
    return {
      header:    JSON.parse(base64UrlDecode(parts[0])),
      payload:   JSON.parse(base64UrlDecode(parts[1])),
      signature: parts[2],
    };
  } catch (e: any) {
    return { error: e?.message ?? "Failed to decode JWT" };
  }
}

async function getHmacKey(secret: string, algorithm: Algorithm): Promise<CryptoKey> {
  const hash: Record<Algorithm, string> = {
    HS256: "SHA-256",
    HS384: "SHA-384",
    HS512: "SHA-512",
  };
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: hash[algorithm] },
    false,
    ["sign", "verify"]
  );
}

async function signJwt(
  header:    Record<string, unknown>,
  payload:   Record<string, unknown>,
  secret:    string,
  algorithm: Algorithm
): Promise<{ token?: string; error?: string }> {
  try {
    const headerB64  = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    const signing    = `${headerB64}.${payloadB64}`;
    const key        = await getHmacKey(secret, algorithm);
    const sigBuffer  = await crypto.subtle.sign(
      "HMAC", key, new TextEncoder().encode(signing)
    );
    const sigB64 = btoa(
      Array.from(new Uint8Array(sigBuffer))
        .map((b) => String.fromCharCode(b))
        .join("")
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return { token: `${signing}.${sigB64}` };
  } catch (e: any) {
    return { error: e?.message ?? "Signing failed" };
  }
}

async function verifyJwt(
  token:     string,
  secret:    string,
  algorithm: Algorithm
): Promise<SigStatus> {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) return "invalid";
    const signing  = `${parts[0]}.${parts[1]}`;
    const key      = await getHmacKey(secret, algorithm);
    const sigBytes = Uint8Array.from(
      atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify(
      "HMAC", key, sigBytes, new TextEncoder().encode(signing)
    );
    return valid ? "valid" : "invalid";
  } catch {
    return "invalid";
  }
}

function formatExpiry(exp: number): string {
  const date    = new Date(exp * 1000);
  const diff    = exp * 1000 - Date.now();
  const expired = diff < 0;
  return `${date.toLocaleString()} (${expired ? "expired" : "expires in"} ${Math.abs(
    Math.round(diff / 60000)
  )} min)`;
}

// ── Constants ──────────────────────────────────────────────────────────────

const ALGORITHMS: Algorithm[] = ["HS256", "HS384", "HS512"];

const DEFAULT_HEADER  = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify(
  {
    sub:  "1234567890",
    name: "John Doe",
    iat:  Math.floor(Date.now() / 1000),
    exp:  Math.floor(Date.now() / 1000) + 3600,
  },
  null,
  2
);

// ── Shared sub-components ──────────────────────────────────────────────────

const PanelHeader = ({
  label,
  chip,
  children,
}: {
  label:     string;
  chip?:     string;
  children?: React.ReactNode;
}) => (
  <Box
    sx={{
      px: 2, height: 36,
      bgcolor: "grey.50",
      borderBottom: "1px solid",
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
    }}
  >
    <Typography variant="overline" color="text.secondary">{label}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {chip && <Chip label={chip} size="small" sx={{ fontSize: 10, height: 18 }} />}
      {children}
    </Box>
  </Box>
);

const MonoBox = ({
  children,
  wordBreak = false,
}: {
  children:   React.ReactNode;
  wordBreak?: boolean;
}) => (
  <Box
    sx={{
      p:          1.5,
      fontFamily: "monospace",
      fontSize:   12,
      color:      "text.secondary",
      whiteSpace: "pre-wrap",
      textAlign:  "left",
      wordBreak:  wordBreak ? "break-all" : undefined,
    }}
  >
    {children}
  </Box>
);

const EmptyDash = () => (
  <Typography variant="body2" color="text.disabled">—</Typography>
);

// ── Component ──────────────────────────────────────────────────────────────

export default function JsonWebToken() {
  const [mode,         setMode]         = useState<Mode>("decode");
  const [token,        setToken]        = useState("");
  const [secret,       setSecret]       = useState("");
  const [showSecret,   setShowSecret]   = useState(false);
  const [algorithm,    setAlgorithm]    = useState<Algorithm>("HS256");
  const [sigStatus,    setSigStatus]    = useState<SigStatus>("idle");
  const [error,        setError]        = useState<string | null>(null);
  const [copied,       setCopied]       = useState<"token" | "payload" | null>(null);
  const [decoded,      setDecoded]      = useState<{
    header?:    Record<string, unknown>;
    payload?:   Record<string, unknown>;
    signature?: string;
  } | null>(null);
  const [headerJson,   setHeaderJson]   = useState(DEFAULT_HEADER);
  const [payloadJson,  setPayloadJson]  = useState(DEFAULT_PAYLOAD);
  const [encodedToken, setEncodedToken] = useState("");

  const handleModeChange = (_: React.MouseEvent, val: Mode | null) => {
    if (!val) return;
    setMode(val);
    setError(null);
    setSigStatus("idle");
  };

  const handleDecode = async () => {
    setError(null);
    setDecoded(null);
    setSigStatus("idle");

    if (!token.trim()) { setError("Please paste a JWT token."); return; }

    const result = decodeJwt(token);
    if (result.error) { setError(result.error); return; }
    setDecoded(result);

    if (secret.trim()) {
      const alg    = (result.header?.alg as Algorithm) ?? algorithm;
      const status = await verifyJwt(token, secret, alg);
      setSigStatus(status);
    } else {
      setSigStatus("unverified");
    }
  };

  const handleEncode = async () => {
    setError(null);
    setEncodedToken("");

    if (!secret.trim()) { setError("A secret is required to sign the token."); return; }

    let header:  Record<string, unknown>;
    let payload: Record<string, unknown>;

    try { header  = JSON.parse(headerJson);  }
    catch { setError("Header is not valid JSON.");  return; }

    try { payload = JSON.parse(payloadJson); }
    catch { setError("Payload is not valid JSON."); return; }

    const result = await signJwt(
      { ...header, alg: algorithm }, payload, secret, algorithm
    );
    if (result.error) { setError(result.error); return; }
    setEncodedToken(result.token ?? "");
  };

  const reset = () => {
    setToken("");
    setSecret("");
    setShowSecret(false);
    setDecoded(null);
    setError(null);
    setSigStatus("idle");
    setEncodedToken("");
    setHeaderJson(DEFAULT_HEADER);
    setPayloadJson(DEFAULT_PAYLOAD);
  };

  const copy = (text: string, key: "token" | "payload") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const isExpired =
    typeof decoded?.payload?.exp === "number"
      ? decoded.payload.exp * 1000 < Date.now()
      : false;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        JSON Web Token
      </Typography>

      {/* ── Toolbar ── */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 2, py: 1.5, mb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Mode */}
        <ToggleButtonGroup
          value={mode} exclusive onChange={handleModeChange} size="small"
        >
          <ToggleButton value="decode" sx={{ px: 2, fontSize: 12 }}>Decode</ToggleButton>
          <ToggleButton value="encode" sx={{ px: 2, fontSize: 12 }}>Encode</ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Algorithm */}
        <ToggleButtonGroup
          value={algorithm}
          exclusive
          onChange={(_, val) => val && setAlgorithm(val)}
          size="small"
        >
          {ALGORITHMS.map((alg) => (
            <ToggleButton key={alg} value={alg} sx={{ px: 1.5, fontSize: 11 }}>
              {alg}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Secret with show/hide toggle */}
        <TextField
          size="small"
          placeholder="Secret key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          type={showSecret ? "text" : "password"}
          sx={{ minWidth: 220 }}
          slotProps={{
            input: {
              sx: { fontFamily: "monospace", fontSize: 13 },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={showSecret ? "Hide secret" : "Show secret"}>
                    <IconButton
                      size="small"
                      onClick={() => setShowSecret((v) => !v)}
                      edge="end"
                    >
                      {showSecret
                        ? <VisibilityOffIcon fontSize="small" />
                        : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Signature status */}
        {sigStatus === "valid" && (
          <Chip
            icon={<LockIcon />}
            label="Signature valid"
            color="success"
            variant="outlined"
            size="small"
          />
        )}
        {sigStatus === "invalid" && (
          <Chip
            icon={<LockOpenIcon />}
            label="Signature invalid"
            color="error"
            variant="outlined"
            size="small"
          />
        )}
        {sigStatus === "unverified" && (
          <Chip label="Signature not verified" variant="outlined" size="small" />
        )}

        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            disableElevation
            onClick={mode === "decode" ? handleDecode : handleEncode}
            sx={{ minWidth: 100 }}
          >
            {mode === "decode" ? "Decode" : "Encode"}
          </Button>
          <Button variant="outlined" onClick={reset} sx={{ minWidth: 80 }}>
            Reset
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 1.5, fontSize: 13 }}>{error}</Alert>
      )}

      {/* ── DECODE UI ── */}
      {mode === "decode" && (
        <Grid container spacing={1.5}>

          {/* Left: Token input */}
          <Grid item xs={12} sm={5}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <PanelHeader label="Token" chip="JWT" />
              <TextField
                multiline
                rows={18}
                fullWidth
                placeholder="Paste JWT token here..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    sx: {
                      fontFamily:   "monospace",
                      fontSize:     12,
                      borderRadius: 0,
                      wordBreak:    "break-all",
                      alignItems:   "flex-start",
                      textAlign:    "left",
                      "& fieldset": { border: "none" },
                    },
                  },
                }}
              />
            </Paper>
          </Grid>

          {/* Right: Decoded panels */}
          <Grid item xs={12} sm={7}>
            <Stack spacing={1.5}>

              {/* Header */}
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <PanelHeader label="Header" chip="algorithm + type" />
                <MonoBox>
                  {decoded?.header
                    ? JSON.stringify(decoded.header, null, 2)
                    : <EmptyDash />}
                </MonoBox>
              </Paper>

              {/* Payload */}
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <PanelHeader label="Payload">
                  {typeof decoded?.payload?.exp === "number" && (
                    <Chip
                      label={isExpired ? "Expired" : "Active"}
                      color={isExpired ? "error" : "success"}
                      size="small"
                      sx={{ fontSize: 10, height: 18 }}
                    />
                  )}
                  {decoded?.payload && (
                    <Tooltip title={copied === "payload" ? "Copied!" : "Copy payload"}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          copy(JSON.stringify(decoded.payload, null, 2), "payload")
                        }
                      >
                        {copied === "payload"
                          ? <CheckIcon fontSize="small" color="success" />
                          : <ContentCopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  )}
                </PanelHeader>
                <MonoBox>
                  {decoded?.payload
                    ? JSON.stringify(decoded.payload, null, 2)
                    : <EmptyDash />}
                </MonoBox>
                {typeof decoded?.payload?.exp === "number" && (
                  <Box sx={{ px: 2, pb: 1 }}>
                    <Typography
                      variant="caption"
                      color={isExpired ? "error" : "text.secondary"}
                    >
                      {formatExpiry(decoded.payload.exp)}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Signature */}
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <PanelHeader label="Signature">
                  {sigStatus === "valid" && (
                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                  )}
                  {sigStatus === "invalid" && (
                    <ErrorOutlineIcon fontSize="small" color="error" />
                  )}
                </PanelHeader>
                <MonoBox wordBreak>
                  {decoded?.signature ?? <EmptyDash />}
                </MonoBox>
              </Paper>

            </Stack>
          </Grid>
        </Grid>
      )}

      {/* ── ENCODE UI ── */}
      {mode === "encode" && (
        <Grid container spacing={1.5}>

          {/* Left: Header + Payload editors */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={1.5}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <PanelHeader label="Header" chip="JSON" />
                <TextField
                  multiline rows={5} fullWidth
                  value={headerJson}
                  onChange={(e) => setHeaderJson(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      sx: {
                        fontFamily:   "monospace",
                        fontSize:     12,
                        borderRadius: 0,
                        textAlign:    "left",
                        alignItems:   "flex-start",
                        "& fieldset": { border: "none" },
                      },
                    },
                  }}
                />
              </Paper>

              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <PanelHeader label="Payload" chip="JSON" />
                <TextField
                  multiline rows={10} fullWidth
                  value={payloadJson}
                  onChange={(e) => setPayloadJson(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      sx: {
                        fontFamily:   "monospace",
                        fontSize:     12,
                        borderRadius: 0,
                        textAlign:    "left",
                        alignItems:   "flex-start",
                        "& fieldset": { border: "none" },
                      },
                    },
                  }}
                />
              </Paper>
            </Stack>
          </Grid>

          {/* Right: Generated token */}
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden", height: "100%" }}
            >
              <PanelHeader label="Generated Token">
                {encodedToken && (
                  <Tooltip title={copied === "token" ? "Copied!" : "Copy token"}>
                    <IconButton size="small" onClick={() => copy(encodedToken, "token")}>
                      {copied === "token"
                        ? <CheckIcon fontSize="small" color="success" />
                        : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                )}
              </PanelHeader>

              {encodedToken ? (
                <Box
                  sx={{
                    p:          2,
                    fontFamily: "monospace",
                    fontSize:   12,
                    wordBreak:  "break-all",
                    lineHeight: 1.8,
                    textAlign:  "left",
                  }}
                >
                  {(() => {
                    const parts = encodedToken.split(".");
                    return (
                      <>
                        <Box component="span" sx={{ color: "#e06c75" }}>{parts[0]}</Box>
                        <Box component="span" sx={{ color: "text.disabled" }}>.</Box>
                        <Box component="span" sx={{ color: "#61afef" }}>{parts[1]}</Box>
                        <Box component="span" sx={{ color: "text.disabled" }}>.</Box>
                        <Box component="span" sx={{ color: "#98c379" }}>{parts[2]}</Box>
                      </>
                    );
                  })()}
                </Box>
              ) : (
                <Box
                  sx={{
                    height:         "80%",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.disabled">
                    Fill header, payload and secret then click "Encode"
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}