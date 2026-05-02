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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";
import { EDITOR_NAME } from "v1/components/NextGenEditor/EditorMapper/EditorMapper";
import { APP_LANGUAGE } from "@utils/constants/APP_LANGUAGE";

const PANEL_HEIGHT  = "75vh";
const HEADER_HEIGHT = 36;

// ── Core conversion logic ──────────────────────────────────────────────────

function xmlNodeToJson(node: Node): unknown {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() ?? "";
  }

  // Element node
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el     = node as Element;
    const result: Record<string, unknown> = {};

    // Attributes
    if (el.attributes.length > 0) {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        attrs[`@${el.attributes[i].name}`] = el.attributes[i].value;
      }
      result["@attributes"] = attrs;
    }

    // Children
    const children = Array.from(el.childNodes).filter(
      (c) => !(c.nodeType === Node.TEXT_NODE && !c.nodeValue?.trim())
    );

    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      // Leaf text node — inline value
      const text = children[0].nodeValue?.trim() ?? "";
      if (el.attributes.length > 0) {
        result["#text"] = text;
        return result;
      }
      return text;
    }

    // Group repeated sibling tag names into arrays
    const tagCounts: Record<string, number> = {};
    children.forEach((c) => {
      if (c.nodeType === Node.ELEMENT_NODE) {
        const tag = (c as Element).tagName;
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    });

    children.forEach((c) => {
      if (c.nodeType === Node.ELEMENT_NODE) {
        const tag  = (c as Element).tagName;
        const val  = xmlNodeToJson(c);
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

function xmlToJson(xmlStr: string): { json?: string; error?: string } {
  try {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(xmlStr, "application/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      return { error: "Invalid XML: " + (parseError.textContent ?? "Parse error") };
    }

    const root   = doc.documentElement;
    const result = { [root.tagName]: xmlNodeToJson(root) };
    return { json: JSON.stringify(result, null, 2) };
  } catch (e: any) {
    return { error: e?.message ?? "Conversion failed" };
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function XmlToJson() {
  const [xml,     setXml]     = useState("");
  const [json,    setJson]    = useState("");
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);
  const [converted, setConverted] = useState(false);

  const convert = () => {
    setError(null);
    setJson("");
    setConverted(true);

    if (!xml.trim()) { setError("Please enter XML input."); return; }

    const result = xmlToJson(xml);
    if (result.error) { setError(result.error); return; }
    setJson(result.json ?? "");
  };

  const reset = () => {
    setXml("");
    setJson("");
    setError(null);
    setCopied(false);
    setConverted(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        XML to JSON
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
          gap: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Paste XML on the left and click Convert to see the JSON output.
        </Typography>
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

          {/* Left: XML Input */}
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
                XML Input
              </Typography>
              <Chip label="XML" size="small" sx={{ fontSize: 10, height: 18 }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <NextGenEditor
                readonly={false}
                name={EDITOR_NAME.monaco}
                value={xml}
                // onChange={(val: string) => setXml(val)}
                border="none"
                width="100%"
                height={`calc(${PANEL_HEIGHT} - ${HEADER_HEIGHT}px)`}
                language={APP_LANGUAGE.XML}
              />
            </Box>
          </Grid>

          {/* Right: JSON Output */}
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
                JSON Output
              </Typography>
              {json && (
                <Tooltip title={copied ? "Copied!" : "Copy JSON"}>
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
                    Paste XML on the left and click "Convert"
                  </Typography>
                </Box>
              )}

              {converted && !error && json && (
                <NextGenEditor
                  readonly={true}
                  name={EDITOR_NAME.monaco}
                  value={json}
                  border="none"
                  width="100%"
                  height={`calc(${PANEL_HEIGHT} - ${HEADER_HEIGHT}px)`}
                  language={APP_LANGUAGE.JSON}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}