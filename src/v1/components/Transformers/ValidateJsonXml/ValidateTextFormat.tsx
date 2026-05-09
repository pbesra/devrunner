import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";
import { EDITOR_NAME } from "v1/components/NextGenEditor/EditorMapper/EditorMapper";
import { APP_LANGUAGE } from "@utils/constants/APP_LANGUAGE";
import * as yaml from "js-yaml";

const PANEL_HEIGHT  = "75vh";
const HEADER_HEIGHT = 36;

type Mode            = "json" | "xml" | "yaml";
type ValidationState = "idle" | "valid" | "invalid";

// ── Validators ─────────────────────────────────────────────────────────────

function validateJson(input: string): { state: ValidationState; error?: string; lines?: number } {
  if (!input.trim()) return { state: "idle" };
  try {
    const parsed = JSON.parse(input);
    const lines  = JSON.stringify(parsed, null, 2).split("\n").length;
    return { state: "valid", lines };
  } catch (e: any) {
    return { state: "invalid", error: e?.message ?? "Invalid JSON" };
  }
}

function validateXml(input: string): { state: ValidationState; error?: string } {
  if (!input.trim()) return { state: "idle" };
  try {
    const parser     = new DOMParser();
    const doc        = parser.parseFromString(input, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      const raw   = parseError.textContent ?? "Invalid XML";
      const match = raw.match(/error on line (\d+).+?:(.*)/i);
      const error = match
        ? `Line ${match[1]}: ${match[2].trim()}`
        : raw.split("\n")[0].trim();
      return { state: "invalid", error };
    }
    return { state: "valid" };
  } catch (e: any) {
    return { state: "invalid", error: e?.message ?? "Invalid XML" };
  }
}

function validateYaml(input: string): { state: ValidationState; error?: string; lines?: number } {
  if (!input.trim()) return { state: "idle" };
  try {
    const parsed = yaml.load(input);
    const lines  = input.split("\n").length;
    if (parsed === null || parsed === undefined) {
      return { state: "valid", lines };
    }
    return { state: "valid", lines };
  } catch (e: any) {
    // js-yaml errors include line info in the message already
    const msg = e?.message ?? "Invalid YAML";
    return { state: "invalid", error: msg };
  }
}

// ── Formatters ─────────────────────────────────────────────────────────────

function formatXml(input: string): string {
  const parser     = new DOMParser();
  const doc        = parser.parseFromString(input, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error("Cannot format invalid XML");

  const serialize = (node: Node, indent: number): string => {
    const pad = "  ".repeat(indent);
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim() ? `${node.nodeValue.trim()}` : "";
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el       = node as Element;
      const attrs    = Array.from(el.attributes)
        .map((a) => ` ${a.name}="${a.value}"`)
        .join("");
      const children = Array.from(el.childNodes)
        .map((c) => serialize(c, indent + 1))
        .filter(Boolean);

      if (children.length === 0) return `${pad}<${el.tagName}${attrs}/>`;
      if (children.length === 1 && !children[0].includes("\n")) {
        return `${pad}<${el.tagName}${attrs}>${children[0]}</${el.tagName}>`;
      }
      return `${pad}<${el.tagName}${attrs}>\n${children
        .map((c) => `${"  ".repeat(indent + 1)}${c}`)
        .join("\n")}\n${pad}</${el.tagName}>`;
    }
    return "";
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n${serialize(doc.documentElement, 0)}`;
}

function formatYaml(input: string): string {
  // Round-trip through js-yaml to normalise indentation and quoting
  const parsed = yaml.load(input);
  return yaml.dump(parsed, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ValidateTextFormat() {
  const [mode,       setMode]       = useState<Mode>("json");
  const [jsonInput,  setJsonInput]  = useState("");
  const [xmlInput,   setXmlInput]   = useState("");
  const [yamlInput,  setYamlInput]  = useState("");
  const [validation, setValidation] = useState<ReturnType<typeof validateJson>>({ state: "idle" });

  const input    = mode === "json" ? jsonInput : mode === "xml" ? xmlInput : yamlInput;
  const setInput = mode === "json" ? setJsonInput : mode === "xml" ? setXmlInput : setYamlInput;

  const handleModeChange = (_: React.MouseEvent, val: Mode | null) => {
    if (!val) return;
    setMode(val);
    setValidation({ state: "idle" });
  };

  const validate = () => {
    if (!input.trim()) { setValidation({ state: "idle" }); return; }
    if (mode === "json") setValidation(validateJson(input));
    else if (mode === "xml") setValidation(validateXml(input));
    else setValidation(validateYaml(input));
  };

  const format = () => {
    try {
      if (mode === "json") {
        const pretty = JSON.stringify(JSON.parse(input), null, 2);
        setInput(pretty);
        setValidation({ state: "valid", lines: pretty.split("\n").length });
      } else if (mode === "xml") {
        const pretty = formatXml(input);
        setInput(pretty);
        setValidation({ state: "valid" });
      } else {
        const pretty = formatYaml(input);
        setInput(pretty);
        setValidation({ state: "valid", lines: pretty.split("\n").length });
      }
    } catch (e: any) {
      setValidation({ state: "invalid", error: e?.message ?? "Format failed" });
    }
  };

  const reset = () => {
    setInput("");
    setValidation({ state: "idle" });
  };

  const isValid   = validation.state === "valid";
  const isInvalid = validation.state === "invalid";

  const inputLang =
    mode === "json" ? APP_LANGUAGE.JSON :
    mode === "xml"  ? APP_LANGUAGE.XML  :
    APP_LANGUAGE.YAML;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        JSON / XML / YAML — Validate &amp; Format
      </Typography>

      {/* ── Toolbar ── */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 2,
          py: 1.5,
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Mode toggle */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
        >
          <ToggleButton value="json" sx={{ px: 2, fontSize: 12 }}>JSON</ToggleButton>
          <ToggleButton value="xml"  sx={{ px: 2, fontSize: 12 }}>XML</ToggleButton>
          <ToggleButton value="yaml" sx={{ px: 2, fontSize: 12 }}>YAML</ToggleButton>
        </ToggleButtonGroup>

        {/* Status badge */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", px: 1 }}>
          {validation.state === "idle" && (
            <Typography variant="body2" color="text.secondary">
              Paste {mode.toUpperCase()} and click Validate.
            </Typography>
          )}
          {isValid && (
            <Chip
              icon={<CheckCircleOutlineIcon />}
              label={`Valid ${mode.toUpperCase()}${"lines" in validation && validation.lines ? ` · ${validation.lines} lines` : ""}`}
              color="success"
              variant="outlined"
              size="small"
            />
          )}
          {isInvalid && (
            <Chip
              icon={<ErrorOutlineIcon />}
              label={`Invalid ${mode.toUpperCase()}`}
              color="error"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button variant="outlined" onClick={format} disabled={!input.trim()} sx={{ minWidth: 80 }}>
            Format
          </Button>
          <Button variant="contained" disableElevation onClick={validate} sx={{ minWidth: 100 }}>
            Validate
          </Button>
          <Button variant="outlined" onClick={reset} sx={{ minWidth: 80 }}>
            Reset
          </Button>
        </Box>
      </Paper>

      {/* ── Editor panel ── */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", minHeight: PANEL_HEIGHT }}>

        {/* Panel header */}
        <Box
          sx={{
            px: 2,
            height: HEADER_HEIGHT,
            bgcolor: "grey.50",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            {mode.toUpperCase()} Input
          </Typography>
          <Chip label={mode.toUpperCase()} size="small" sx={{ fontSize: 10, height: 18 }} />
        </Box>

        {/* Error / success banner */}
        {isInvalid && validation.error && (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon fontSize="small" />}
            sx={{ borderRadius: 0, py: 0.5, fontSize: 13 }}
          >
            {validation.error}
          </Alert>
        )}
        {isValid && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon fontSize="small" />}
            sx={{ borderRadius: 0, py: 0.5, fontSize: 13 }}
          >
            {mode.toUpperCase()} is valid.
          </Alert>
        )}

        {/* Monaco editor */}
        <NextGenEditor
          readonly={false}
          name={EDITOR_NAME.monaco}
          value={input}
          handleOnChangeInputText={(val: string) => setInput(val)}
          border="none"
          width="100%"
          height={`calc(${PANEL_HEIGHT} - ${HEADER_HEIGHT}px)`}
          language={inputLang}
        />
      </Paper>
    </Box>
  );
}