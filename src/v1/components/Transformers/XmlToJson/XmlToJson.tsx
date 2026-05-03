import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";
import { EDITOR_NAME } from "v1/components/NextGenEditor/EditorMapper/EditorMapper";
import { APP_LANGUAGE } from "@utils/constants/APP_LANGUAGE";

const PANEL_HEIGHT  = "75vh";
const HEADER_HEIGHT = 36;

type Direction = "xml-to-json" | "json-to-xml";

// ── XML → JSON ─────────────────────────────────────────────────────────────

function xmlNodeToJson(node: Node): unknown {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() ?? "";
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el     = node as Element;
    const result: Record<string, unknown> = {};

    if (el.attributes.length > 0) {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        attrs[`@${el.attributes[i].name}`] = el.attributes[i].value;
      }
      result["@attributes"] = attrs;
    }

    const children = Array.from(el.childNodes).filter(
      (c) => !(c.nodeType === Node.TEXT_NODE && !c.nodeValue?.trim())
    );

    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      const text = children[0].nodeValue?.trim() ?? "";
      if (el.attributes.length > 0) { result["#text"] = text; return result; }
      return text;
    }

    const tagCounts: Record<string, number> = {};
    children.forEach((c) => {
      if (c.nodeType === Node.ELEMENT_NODE) {
        const tag = (c as Element).tagName;
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    });

    children.forEach((c) => {
      if (c.nodeType === Node.ELEMENT_NODE) {
        const tag = (c as Element).tagName;
        const val = xmlNodeToJson(c);
        if (tagCounts[tag] > 1) {
          if (!Array.isArray(result[tag])) result[tag] = [];
          (result[tag] as unknown[]).push(val);
        } else {
          result[tag] = val;
        }
      }
    });

    return result;
  }
  return null;
}

function convertXmlToJson(xmlStr: string): { output?: string; error?: string } {
  try {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(xmlStr, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) return { error: "Invalid XML: " + (parseError.textContent ?? "Parse error") };
    const root   = doc.documentElement;
    return { output: JSON.stringify({ [root.tagName]: xmlNodeToJson(root) }, null, 2) };
  } catch (e: any) {
    return { error: e?.message ?? "Conversion failed" };
  }
}

// ── JSON → XML ─────────────────────────────────────────────────────────────

function jsonNodeToXml(tagName: string, value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);

  if (value === null || value === undefined) {
    return `${pad}<${tagName}/>`;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return `${pad}<${tagName}>${value}</${tagName}>`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => jsonNodeToXml(tagName, item, indent)).join("\n");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    let attrs = "";
    let children = "";

    Object.entries(obj).forEach(([k, v]) => {
      if (k === "@attributes" && typeof v === "object" && v !== null) {
        Object.entries(v as Record<string, string>).forEach(([ak, av]) => {
          attrs += ` ${ak.replace(/^@/, "")}="${av}"`;
        });
      } else if (k === "#text") {
        children += v;
      } else {
        children += "\n" + jsonNodeToXml(k, v, indent + 1);
      }
    });

    if (!children.trim()) return `${pad}<${tagName}${attrs}/>`;
    if (!children.includes("\n")) return `${pad}<${tagName}${attrs}>${children}</${tagName}>`;
    return `${pad}<${tagName}${attrs}>${children}\n${pad}</${tagName}>`;
  }

  return "";
}

function convertJsonToXml(jsonStr: string): { output?: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null) {
      return { error: "JSON root must be an object with a single root key." };
    }
    const entries = Object.entries(parsed);
    if (entries.length !== 1) {
      return { error: "JSON must have exactly one root key to map to an XML root element." };
    }
    const [rootTag, rootVal] = entries[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` + jsonNodeToXml(rootTag, rootVal, 0);
    return { output: xml };
  } catch (e: any) {
    return { error: "Invalid JSON: " + (e?.message ?? "Parse error") };
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function XmlJsonConverter() {
  const [input,     setInput]     = useState("");
  const [output,    setOutput]    = useState("");
  const [error,     setError]     = useState<string | null>(null);
  const [copied,    setCopied]    = useState(false);
  const [converted, setConverted] = useState(false);
  const [direction, setDirection] = useState<Direction>("xml-to-json");

  const isXmlToJson = direction === "xml-to-json";

  const handleDirectionChange = (_: React.MouseEvent, val: Direction | null) => {
    if (!val) return;
    setDirection(val);
    setInput("");
    setOutput("");
    setError(null);
    setConverted(false);
    setCopied(false);
  };

  const convert = () => {
    setError(null);
    setOutput("");
    setConverted(true);

    if (!input.trim()) {
      setError(`Please enter ${isXmlToJson ? "XML" : "JSON"} input.`);
      return;
    }

    const result = isXmlToJson
      ? convertXmlToJson(input)
      : convertJsonToXml(input);

    if (result.error)  { setError(result.error); return; }
    setOutput(result.output ?? "");
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError(null);
    setCopied(false);
    setConverted(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const inputLabel  = isXmlToJson ? "XML Input"   : "JSON Input";
  const outputLabel = isXmlToJson ? "JSON Output" : "XML Output";
  const inputLang   = isXmlToJson ? APP_LANGUAGE.XML  : APP_LANGUAGE.JSON;
  const outputLang  = isXmlToJson ? APP_LANGUAGE.JSON : APP_LANGUAGE.XML;
  const inputChip   = isXmlToJson ? "XML"  : "JSON";
  const outputChip  = isXmlToJson ? "JSON" : "XML";

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        XML ↔ JSON Converter
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
        {/* Direction toggle */}
        <ToggleButtonGroup
          value={direction}
          exclusive
          onChange={handleDirectionChange}
          size="small"
        >
          <ToggleButton value="xml-to-json" sx={{ px: 2, fontSize: 12 }}>
            XML → JSON
          </ToggleButton>
          <ToggleButton value="json-to-xml" sx={{ px: 2, fontSize: 12 }}>
            JSON → XML
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {isXmlToJson
              ? "Paste XML on the left and click Convert."
              : "Paste JSON on the left and click Convert."}
          </Typography>
          <SwapHorizIcon fontSize="small" sx={{ color: "text.disabled" }} />
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button variant="contained" disableElevation onClick={convert} sx={{ minWidth: 100 }}>
            Convert
          </Button>
          <Button variant="outlined" onClick={reset} sx={{ minWidth: 80 }}>
            Reset
          </Button>
        </Box>
      </Paper>

      {/* ── Main panel ── */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden", minHeight: PANEL_HEIGHT }}
      >
        <Grid container sx={{ minHeight: PANEL_HEIGHT }}>

          {/* Left: Input */}
          <Grid
            item xs={12} sm={6}
            sx={{
              borderRight: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              minHeight: PANEL_HEIGHT,
            }}
          >
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
                {inputLabel}
              </Typography>
              <Chip label={inputChip} size="small" sx={{ fontSize: 10, height: 18 }} />
            </Box>

            <Box sx={{ flex: 1 }}>
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
            </Box>
          </Grid>

          {/* Right: Output */}
          <Grid
            item xs={12} sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: PANEL_HEIGHT,
            }}
          >
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
                {outputLabel}
              </Typography>
              {output && (
                <Tooltip title={copied ? "Copied!" : `Copy ${outputChip}`}>
                  <IconButton size="small" onClick={copy}>
                    {copied
                      ? <CheckIcon fontSize="small" color="success" />
                      : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Box sx={{ flex: 1, position: "relative" }}>
              {error && (
                <Alert severity="error" sx={{ m: 2, fontSize: 13 }}>
                  {error}
                </Alert>
              )}

              {!converted && !error && (
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" color="text.disabled">
                    Paste {inputChip} on the left and click "Convert"
                  </Typography>
                </Box>
              )}

              {converted && !error && output && (
                <NextGenEditor
                  readonly={true}
                  name={EDITOR_NAME.monaco}
                  value={output}
                  border="none"
                  width="100%"
                  height={`calc(${PANEL_HEIGHT} - ${HEADER_HEIGHT}px)`}
                  language={outputLang}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}