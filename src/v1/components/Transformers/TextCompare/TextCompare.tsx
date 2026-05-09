import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import WrapTextIcon from "@mui/icons-material/WrapText";
import CheckIcon from "@mui/icons-material/Check";
import TuneIcon from "@mui/icons-material/Tune";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import FilterNoneIcon from "@mui/icons-material/FilterNone";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiffType = "eq" | "ins" | "del";
type DiffToken = { type: DiffType; val: string };
type DiffMode = "inline" | "split" | "line";
type GranularityMode = "word" | "char";

// ─── LCS core ─────────────────────────────────────────────────────────────────

function buildDp(a: string[], b: string[]): Int32Array[] {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp;
}

function traceback(a: string[], b: string[], dp: Int32Array[]): DiffToken[] {
  const out: DiffToken[] = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      out.unshift({ type: "eq", val: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      out.unshift({ type: "ins", val: b[j - 1] });
      j--;
    } else {
      out.unshift({ type: "del", val: a[i - 1] });
      i--;
    }
  }
  return out;
}

function diffWords(a: string, b: string): DiffToken[] {
  const tokA = a.split(/(\s+)/);
  const tokB = b.split(/(\s+)/);
  return traceback(tokA, tokB, buildDp(tokA, tokB));
}

function diffChars(a: string, b: string): DiffToken[] {
  const cA = a.split("");
  const cB = b.split("");
  return traceback(cA, cB, buildDp(cA, cB));
}

function diffLines(a: string, b: string): DiffToken[] {
  const lA = a.split("\n");
  const lB = b.split("\n");
  return traceback(lA, lB, buildDp(lA, lB));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countStats(tokens: DiffToken[]) {
  return tokens.reduce(
    (acc, t) => {
      if (t.type === "ins") acc.added++;
      else if (t.type === "del") acc.removed++;
      else acc.unchanged++;
      return acc;
    },
    { added: 0, removed: 0, unchanged: 0 }
  );
}

function similarity(tokens: DiffToken[]): number {
  const total = tokens.length;
  if (total === 0) return 100;
  const eq = tokens.filter((t) => t.type === "eq").length;
  return Math.round((eq / total) * 100);
}

function textMeta(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  return { chars: text.length, words, lines };
}

// ─── Token styles ─────────────────────────────────────────────────────────────

const INS_SX = {
  bgcolor: "#E1F5EE",
  color: "#085041",
  px: 0.5,
  borderRadius: "3px",
};
const DEL_SX = {
  bgcolor: "#FCEBEB",
  color: "#791F1F",
  px: 0.5,
  borderRadius: "3px",
  textDecoration: "line-through" as const,
};

// ─── Sub-views ────────────────────────────────────────────────────────────────

function InlineDiff({ tokens, wrap }: { tokens: DiffToken[]; wrap: boolean }) {
  return (
    <Box
      sx={{
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.9,
        whiteSpace: wrap ? "pre-wrap" : "pre",
        wordBreak: wrap ? "break-word" : "normal",
        overflowX: wrap ? "visible" : "auto",
      }}
    >
      {tokens.map((t, i) =>
        t.type === "eq" ? (
          <span key={i}>{t.val}</span>
        ) : t.type === "ins" ? (
          <Box component="span" key={i} sx={INS_SX}>
            {t.val}
          </Box>
        ) : (
          <Box component="span" key={i} sx={DEL_SX}>
            {t.val}
          </Box>
        )
      )}
    </Box>
  );
}

function SplitDiff({ tokens, wrap }: { tokens: DiffToken[]; wrap: boolean }) {
  const leftTokens = tokens.filter((t) => t.type !== "ins");
  const rightTokens = tokens.filter((t) => t.type !== "del");

  const renderSide = (toks: DiffToken[], side: "left" | "right") =>
    toks.map((t, i) =>
      t.type === "eq" ? (
        <span key={i}>{t.val}</span>
      ) : side === "left" ? (
        <Box component="span" key={i} sx={DEL_SX}>
          {t.val}
        </Box>
      ) : (
        <Box component="span" key={i} sx={INS_SX}>
          {t.val}
        </Box>
      )
    );

  const textSx = {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 1.9,
    whiteSpace: wrap ? "pre-wrap" : "pre",
    wordBreak: wrap ? "break-word" : "normal",
    overflowX: wrap ? "visible" : "auto",
    mt: 0.75,
  };

  return (
    <Grid container spacing={1.5}>
      {(
        [
          ["Original", leftTokens, "left"],
          ["Modified", rightTokens, "right"],
        ] as const
      ).map(([label, toks, side]) => (
        <Grid item xs={6} key={side}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}
          >
            {label}
          </Typography>
          <Divider sx={{ mt: 0.5, mb: 0.75 }} />
          <Box sx={textSx}>{renderSide(toks, side)}</Box>
        </Grid>
      ))}
    </Grid>
  );
}

function LineDiff({
  tokens,
  wrap,
  hideUnchanged,
}: {
  tokens: DiffToken[];
  wrap: boolean;
  hideUnchanged: boolean;
}) {
  let lineL = 1;
  let lineR = 1;

  const rows = tokens.map((t) => {
    const lNum = t.type !== "ins" ? lineL++ : null;
    const rNum = t.type !== "del" ? lineR++ : null;
    return { t, lNum, rNum };
  });

  const visible = hideUnchanged ? rows.filter((r) => r.t.type !== "eq") : rows;

  if (visible.length === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CheckIcon sx={{ color: "success.main", fontSize: 18 }} />
        <Typography variant="body2" color="success.main">
          Texts are identical.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.8 }}>
      {visible.map(({ t, lNum, rNum }, idx) => {
        const marker = t.type === "ins" ? "+" : t.type === "del" ? "−" : " ";
        const bg =
          t.type === "ins" ? "#E1F5EE" : t.type === "del" ? "#FCEBEB" : undefined;
        const fg =
          t.type === "ins" ? "#085041" : t.type === "del" ? "#791F1F" : undefined;
        const mColor =
          t.type === "ins" ? "#1D9E75" : t.type === "del" ? "#E24B4A" : undefined;

        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              gap: 1,
              px: 0.75,
              py: "1px",
              borderRadius: "3px",
              bgcolor: bg,
              color: fg,
            }}
          >
            <Box sx={{ minWidth: 32, textAlign: "right", opacity: 0.4, fontSize: 11, pt: "2px", userSelect: "none", color: "text.secondary" }}>
              {lNum ?? ""}
            </Box>
            <Box sx={{ minWidth: 32, textAlign: "right", opacity: 0.4, fontSize: 11, pt: "2px", userSelect: "none", color: "text.secondary" }}>
              {rNum ?? ""}
            </Box>
            <Box sx={{ minWidth: 16, textAlign: "center", userSelect: "none", color: mColor, fontWeight: 500 }}>
              {marker}
            </Box>
            <Box sx={{ flex: 1, whiteSpace: wrap ? "pre-wrap" : "pre", wordBreak: wrap ? "break-word" : "normal", overflowX: wrap ? "visible" : "auto" }}>
              {t.val}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Similarity bar ───────────────────────────────────────────────────────────

function SimilarityBar({ value }: { value: number }) {
  const color = value >= 80 ? "success" : value >= 50 ? "warning" : "error";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 170 }}>
      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
        Similarity
      </Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ flex: 1, height: 5, borderRadius: 3 }}
      />
      <Typography variant="caption" fontWeight={500} sx={{ minWidth: 30, textAlign: "right" }}>
        {value}%
      </Typography>
    </Box>
  );
}

// ─── Panel header ─────────────────────────────────────────────────────────────

function PanelHeader({
  label,
  value,
  onCopy,
  copied,
  onClear,
  onFileClick,
  showMeta,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  onClear: () => void;
  onFileClick: () => void;
  showMeta: boolean;
}) {
  const meta = textMeta(value);
  return (
    <Box sx={{ mb: 0.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Stack direction="row" spacing={0.25}>
          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton size="small" onClick={onCopy} disabled={!value}>
              {copied ? (
                <CheckIcon sx={{ fontSize: 14, color: "success.main" }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 14 }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Load file">
            <IconButton size="small" onClick={onFileClick}>
              <UploadFileIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear">
            <IconButton size="small" onClick={onClear} disabled={!value}>
              <ClearIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      {showMeta && value && (
        <Typography variant="caption" color="text.disabled">
          {meta.chars} chars · {meta.words} words · {meta.lines}{" "}
          {meta.lines === 1 ? "line" : "lines"}
        </Typography>
      )}
    </Box>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function TextCompare() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<DiffMode>("inline");
  const [granularity, setGranularity] = useState<GranularityMode>("word");
  const [wrap, setWrap] = useState(true);
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const [showMeta, setShowMeta] = useState(true);
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);

  const wordDiff = useMemo(() => diffWords(left, right), [left, right]);
  const charDiff = useMemo(() => diffChars(left, right), [left, right]);
  const lineDiff = useMemo(() => diffLines(left, right), [left, right]);

  const inlineDiff = granularity === "char" ? charDiff : wordDiff;
  const activeTokens = mode === "line" ? lineDiff : inlineDiff;

  const stats = useMemo(() => countStats(activeTokens), [activeTokens]);
  const sim = useMemo(() => similarity(activeTokens), [activeTokens]);

  const isEmpty = !left.trim() && !right.trim();
  const hasDiff = stats.added > 0 || stats.removed > 0;

  const copyText = useCallback(
    (text: string, setter: (v: boolean) => void) => {
      navigator.clipboard.writeText(text).then(() => {
        setter(true);
        setTimeout(() => setter(false), 1500);
      });
    },
    []
  );

  function handleFileLoad(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* ── Hidden file inputs ── */}
      <input
        type="file"
        accept=".txt,.md,.json,.xml,.csv,.log,.ts,.tsx,.js,.jsx,.cs,.py,.html,.css,.sql"
        ref={leftFileRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileLoad(e, setLeft)}
      />
      <input
        type="file"
        accept=".txt,.md,.json,.xml,.csv,.log,.ts,.tsx,.js,.jsx,.cs,.py,.html,.css,.sql"
        ref={rightFileRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileLoad(e, setRight)}
      />

      {/* ── Input panels ── */}
      <Grid container spacing={1.5} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6}>
          <PanelHeader
            label="Original"
            value={left}
            onCopy={() => copyText(left, setCopiedLeft)}
            copied={copiedLeft}
            onClear={() => setLeft("")}
            onFileClick={() => leftFileRef.current?.click()}
            showMeta={showMeta}
          />
          <TextField
            multiline
            rows={8}
            fullWidth
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text here…"
            InputProps={{ sx: { fontFamily: "monospace", fontSize: 13, lineHeight: 1.7 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PanelHeader
            label="Modified"
            value={right}
            onCopy={() => copyText(right, setCopiedRight)}
            copied={copiedRight}
            onClear={() => setRight("")}
            onFileClick={() => rightFileRef.current?.click()}
            showMeta={showMeta}
          />
          <TextField
            multiline
            rows={8}
            fullWidth
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified text here…"
            InputProps={{ sx: { fontFamily: "monospace", fontSize: 13, lineHeight: 1.7 } }}
          />
        </Grid>
      </Grid>

      {/* ── Swap row ── */}
      <Stack direction="row" justifyContent="center" sx={{ mb: 1.5 }}>
        <Tooltip title="Swap sides">
          <span>
            <IconButton size="small" onClick={() => { setLeft(right); setRight(left); }} disabled={isEmpty}>
              <SwapHorizIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* ── Toolbar ── */}
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
        <ToggleButtonGroup size="small" exclusive value={mode}
          onChange={(_e, v) => { if (v) setMode(v); }}>
          <ToggleButton value="inline">Inline</ToggleButton>
          <ToggleButton value="split">Split</ToggleButton>
          <ToggleButton value="line">Line</ToggleButton>
        </ToggleButtonGroup>

        {mode !== "line" && (
          <ToggleButtonGroup size="small" exclusive value={granularity}
            onChange={(_e, v) => { if (v) setGranularity(v); }}>
            <Tooltip title="Word-level diff">
              <ToggleButton value="word">
                <FormatSizeIcon sx={{ fontSize: 15, mr: 0.5 }} />Word
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Character-level diff">
              <ToggleButton value="char">
                <FilterNoneIcon sx={{ fontSize: 15, mr: 0.5 }} />Char
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        )}

        {!isEmpty && (
          <Stack direction="row" spacing={0.75}>
            <Chip size="small" label={`+${stats.added}`}
              sx={{ bgcolor: "#E1F5EE", color: "#085041", fontWeight: 500, border: "none" }} />
            <Chip size="small" label={`−${stats.removed}`}
              sx={{ bgcolor: "#FCEBEB", color: "#791F1F", fontWeight: 500, border: "none" }} />
            <Chip size="small" label={`${stats.unchanged} eq`}
              variant="outlined" sx={{ color: "text.secondary" }} />
          </Stack>
        )}

        {!isEmpty && <SimilarityBar value={sim} />}

        <Stack direction="row" spacing={0.5} sx={{ ml: "auto" }}>
          <Tooltip title={wrap ? "Disable word wrap" : "Enable word wrap"}>
            <IconButton size="small" onClick={() => setWrap((v) => !v)} color={wrap ? "primary" : "default"}>
              <WrapTextIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={copiedDiff ? "Copied!" : "Copy diff result"}>
            <span>
              <IconButton size="small"
                onClick={() => copyText(activeTokens.map((t) => t.val).join(""), setCopiedDiff)}
                disabled={isEmpty}>
                {copiedDiff
                  ? <CheckIcon sx={{ fontSize: 18, color: "success.main" }} />
                  : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}
          PaperProps={{ sx: { minWidth: 220 } }}>
          <MenuItem onClick={() => { setHideUnchanged((v) => !v); setMenuAnchor(null); }}>
            <ListItemIcon>{hideUnchanged ? <CheckIcon fontSize="small" /> : <TuneIcon fontSize="small" />}</ListItemIcon>
            <ListItemText>{hideUnchanged ? "Show unchanged lines" : "Hide unchanged lines"}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setShowMeta((v) => !v); setMenuAnchor(null); }}>
            <ListItemIcon>{showMeta ? <CheckIcon fontSize="small" /> : <TuneIcon fontSize="small" />}</ListItemIcon>
            <ListItemText>{showMeta ? "Hide text stats" : "Show text stats"}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setLeft(""); setRight(""); setMenuAnchor(null); }} disabled={isEmpty}>
            <ListItemIcon><ClearIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Clear all</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>

      {/* ── Diff output ── */}
      <Paper variant="outlined" sx={{ p: 1.5, minHeight: 80 }}>
        {isEmpty ? (
          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>
            Enter text in both panels above to see the diff.
          </Typography>
        ) : !hasDiff ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckIcon sx={{ color: "success.main", fontSize: 18 }} />
            <Typography variant="body2" color="success.main">
              Texts are identical.
            </Typography>
          </Box>
        ) : mode === "inline" ? (
          <InlineDiff tokens={inlineDiff} wrap={wrap} />
        ) : mode === "split" ? (
          <SplitDiff tokens={inlineDiff} wrap={wrap} />
        ) : (
          <LineDiff tokens={lineDiff} wrap={wrap} hideUnchanged={hideUnchanged} />
        )}
      </Paper>
    </Box>
  );
}