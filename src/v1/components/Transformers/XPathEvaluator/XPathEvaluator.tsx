import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";
import { EDITOR_NAME } from "v1/components/NextGenEditor/EditorMapper/EditorMapper";
import { APP_LANGUAGE } from "@utils/constants/APP_LANGUAGE";

type MatchedNode = {
  index: number;
  value: string;
  nodeType: string;
};

const PANEL_HEIGHT = "75vh";
const HEADER_HEIGHT = 36;

export default function XPathEvaluator() {
  const [xml, setXml]             = useState("");
  const [xpath, setXpath]         = useState("");
  const [results, setResults]     = useState<MatchedNode[]>([]);
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState<number | "all" | null>(null);
  const [evaluated, setEvaluated] = useState(false);

  const reset = () => {
    setXml("");
    setXpath("");
    setResults([]);
    setError(null);
    setEvaluated(false);
    setCopied(null);
  };

  const getNodeType = (node: Node): string => {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:   return "element";
      case Node.ATTRIBUTE_NODE: return "attribute";
      case Node.TEXT_NODE:      return "text";
      default:                  return "node";
    }
  };

  const serializeNode = (node: Node): string => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return new XMLSerializer().serializeToString(node);
    }
    return node.nodeValue ?? node.textContent ?? "";
  };

  const evaluate = () => {
    setError(null);
    setResults([]);
    setEvaluated(true);

    if (!xml.trim())   { setError("Please enter XML input."); return; }
    if (!xpath.trim()) { setError("Please enter an XPath expression."); return; }

    try {
      const parser = new DOMParser();
      const doc    = parser.parseFromString(xml, "application/xml");

      const parseError = doc.querySelector("parsererror");
      if (parseError) { setError("Invalid XML: " + parseError.textContent); return; }

      const xpathResult = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
      const nodes: MatchedNode[] = [];

      switch (xpathResult.resultType) {
        case XPathResult.STRING_TYPE:
          nodes.push({ index: 0, value: xpathResult.stringValue, nodeType: "string" });
          break;
        case XPathResult.NUMBER_TYPE:
          nodes.push({ index: 0, value: String(xpathResult.numberValue), nodeType: "number" });
          break;
        case XPathResult.BOOLEAN_TYPE:
          nodes.push({ index: 0, value: String(xpathResult.booleanValue), nodeType: "boolean" });
          break;
        default: {
          let node = xpathResult.iterateNext();
          let i    = 0;
          while (node) {
            nodes.push({ index: i++, value: serializeNode(node), nodeType: getNodeType(node) });
            node = xpathResult.iterateNext();
          }
        }
      }

      setResults(nodes);
    } catch (e: any) {
      setError("XPath error: " + (e?.message ?? "Invalid expression"));
    }
  };

  const copy = (text: string, idx: number | "all") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        XPath Evaluator
      </Typography>

      {/* ── Top toolbar ── */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          p: 1.5,
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography variant="overline" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          XPath
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="//item[@id='1']"
          value={xpath}
          onChange={(e) => setXpath(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && evaluate()}
          slotProps={{
            input: { sx: { fontFamily: "monospace", fontSize: 13 } },
          }}
        />
        <Button
          variant="contained"
          disableElevation
          onClick={evaluate}
          sx={{ whiteSpace: "nowrap", minWidth: 100 }}
        >
          Evaluate
        </Button>
        <Button
          variant="outlined"
          onClick={reset}
          sx={{ whiteSpace: "nowrap", minWidth: 80 }}
        >
          Reset
        </Button>
      </Paper>

      {/* ── Main two-column panel ── */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden", minHeight: PANEL_HEIGHT }}
      >
        <Grid container sx={{ minHeight: PANEL_HEIGHT }}>

          {/* Left: XML Editor */}
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
                XML Input
              </Typography>
              <Chip label="XML" size="small" sx={{ fontSize: 10, height: 18 }} />
            </Box>

            {/* Editor */}
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

          {/* Right: Results */}
          <Grid
            item xs={12} sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: PANEL_HEIGHT,
            }}
          >
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
                Results
              </Typography>
              {results.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={`${results.length} match${results.length > 1 ? "es" : ""}`}
                    size="small"
                    color="primary"
                    sx={{ fontSize: 10, height: 18 }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      copied === "all"
                        ? <CheckIcon fontSize="small" />
                        : <ContentCopyIcon fontSize="small" />
                    }
                    color={copied === "all" ? "success" : "primary"}
                    onClick={() => copy(results.map((r) => r.value).join("\n"), "all")}
                  >
                    {copied === "all" ? "Copied!" : "Copy all"}
                  </Button>
                </Box>
              )}
            </Box>

            {/* Results body */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflow: "auto",
                height: `calc(${PANEL_HEIGHT} - ${HEADER_HEIGHT}px)`,
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 1.5, fontSize: 13 }}>
                  {error}
                </Alert>
              )}

              {!evaluated && !error && (
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" color="text.disabled">
                    Enter XML and an XPath expression, then click "Evaluate"
                  </Typography>
                </Box>
              )}

              {evaluated && !error && results.length === 0 && (
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" color="text.disabled">
                    No matching nodes found
                  </Typography>
                </Box>
              )}

              {results.length > 0 && (
                <Stack spacing={0.75}>
                  {results.map((r) => (
                    <Box
                      key={r.index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        px: 1.5,
                        py: 1,
                        bgcolor: "grey.50",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1.5,
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Chip
                          label={r.nodeType}
                          size="small"
                          sx={{ mb: 0.5, fontSize: 10, height: 18 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: "text.secondary",
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {r.value}
                        </Typography>
                      </Box>
                      <Tooltip title={copied === r.index ? "Copied!" : "Copy"}>
                        <IconButton
                          size="small"
                          onClick={() => copy(r.value, r.index)}
                          sx={{ mt: 0.5 }}
                        >
                          {copied === r.index
                            ? <CheckIcon fontSize="small" color="success" />
                            : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}