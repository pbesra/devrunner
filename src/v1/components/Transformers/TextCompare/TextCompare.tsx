import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Divider from "@mui/material/Divider";

type Mode    = "split" | "unified";
type DiffOp  = "equal" | "insert" | "delete";

interface DiffLine {
  op:       DiffOp;
  text:     string;
  leftNum?: number;
  rightNum?: number;
}

// ── Core diff algorithm (Myers line-level diff) ────────────────────────────

function diffLines(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const m      = linesA.length;
  const n      = linesB.length;
  const max    = m + n;

  const v: Record<number, number> = { 1: 0 };
  const trace: Record<number, number>[] = [];

  outer:
  for (let d = 0; d <= max; d++) {
    trace.push({ ...v });
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && (v[k - 1] ?? 0) < (v[k + 1] ?? 0))) {
        x = v[k + 1] ?? 0;
      } else {
        x = (v[k - 1] ?? 0) + 1;
      }
      let y = x - k;
      while (x < m && y < n && linesA[x] === linesB[y]) { x++; y++; }
      v[k] = x;
      if (x >= m && y >= n) break outer;
    }
  }

  // Backtrack
  const result: DiffLine[] = [];
  let x = m, y = n;

  for (let d = trace.length - 1; d >= 0; d--) {
    const vv = trace[d];
    const k  = x - y;
    let prevK: number;
    if (k === -d || (k !== d && (vv[k - 1] ?? 0) < (vv[k + 1] ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = vv[prevK] ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX + 1 && y > prevY + 1) {
      x--; y--;
      result.unshift({ op: "equal", text: linesA[x], leftNum: x + 1, rightNum: y + 1 });
    }
    if (d > 0) {
      if (x === prevX) {
        y--;
        result.unshift({ op: "insert", text: linesB[y], rightNum: y + 1 });
      } else {
        x--;
        result.unshift({ op: "delete", text: linesA[x], leftNum: x + 1 });
      }
    }
  }

  return result;
}

// ── Styling helpers ────────────────────────────────────────────────────────

const BG: Record<DiffOp, string> = {
  equal:  "transparent",
  insert: "#e6ffec",
  delete: "#ffebe9",
};

const COLOR: Record<DiffOp, string> = {
  equal:  "inherit",
  insert: "#1a7f37",
  delete: "#cf222e",
};

const PREFIX: Record<DiffOp, string> = {
  equal:  " ",
  insert: "+",
  delete: "−",
};

// ── Sub-components ─────────────────────────────────────────────────────────

const PanelHeader = ({
  label,
  children,
}: {
  label:     string;
  children?: React.ReactNode;
}) => (
  <Box
    sx={{
      px: 2, height: 36,
      bgcolor:      "grey.50",
      borderBottom: "1px solid",
      borderColor:  "divider",
      display:      "flex",
      alignItems:   "center",
      justifyContent: "space-between",
      flexShrink: 0,
    }}
  >
    <Typography variant="overline" color="text.secondary">{label}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{children}</Box>
  </Box>
);

const LineNum = ({ n }: { n?: number }) => (
  <Box
    component="span"
    sx={{
      display:    "inline-block",
      minWidth:   36,
      pr:         1.5,
      color:      "text.disabled",
      fontSize:   11,
      userSelect: "none",
      textAlign:  "right",
      flexShrink: 0,
    }}
  >
    {n ?? ""}
  </Box>
);

// ── Component ──────────────────────────────────────────────────────────────

export default function TextCompare() {
  const [left,    setLeft]    = useState("");
  const [right,   setRight]   = useState("");
  const [mode,    setMode]    = useState<Mode>("split");
  const [compared, setCompared] = useState(false);

  const diff = useMemo<DiffLine[]>(() => {
    if (!compared) return [];
    return diffLines(left, right);
  }, [compared, left, right]);

  const stats = useMemo(() => {
    const added   = diff.filter((d) => d.op === "insert").length;
    const removed = diff.filter((d) => d.op === "delete").length;
    return { added, removed, unchanged: diff.length - added - removed };
  }, [diff]);

  const compare = () => setCompared(true);

  const reset = () => {
    setLeft("");
    setRight("");
    setCompared(false);
  };

  // For split view — pair up left/right lines side by side
  const splitRows = useMemo(() => {
    if (mode !== "split") return [];
    const rows: { left?: DiffLine; right?: DiffLine }[] = [];
    const deletes: DiffLine[] = [];
    const inserts: DiffLine[] = [];

    diff.forEach((line) => {
      if (line.op === "equal") {
        // Flush pending pairs
        const max = Math.max(deletes.length, inserts.length);
        for (let i = 0; i < max; i++) {
          rows.push({ left: deletes[i], right: inserts[i] });
        }
        deletes.length = 0;
        inserts.length = 0;
        rows.push({ left: line, right: line });
      } else if (line.op === "delete") {
        deletes.push(line);
      } else {
        inserts.push(line);
      }
    });

    const max = Math.max(deletes.length, inserts.length);
    for (let i = 0; i < max; i++) {
      rows.push({ left: deletes[i], right: inserts[i] });
    }

    return rows;
  }, [diff, mode]);

  const DiffLineRow = ({ line, side }: { line?: DiffLine; side?: "left" | "right" }) => {
    if (!line) {
      return (
        <Box sx={{ display: "flex", bgcolor: "grey.50", minHeight: 22 }}>
          <LineNum />
          <Box sx={{ flex: 1 }} />
        </Box>
      );
    }
    const isLeft  = side === "left";
    const showNum = isLeft ? line.leftNum : line.rightNum;
    return (
      <Box
        sx={{
          display:   "flex",
          alignItems: "baseline",
          bgcolor:   BG[line.op],
          minHeight: 22,
          px:        0.5,
        }}
      >
        <LineNum n={showNum} />
        <Box
          component="span"
          sx={{
            color:      COLOR[line.op],
            fontFamily: "monospace",
            fontSize:   12,
            whiteSpace: "pre-wrap",
            wordBreak:  "break-all",
            flex:       1,
          }}
        >
          <Box component="span" sx={{ userSelect: "none", mr: 0.5, opacity: 0.5 }}>
            {line.op !== "equal" ? PREFIX[line.op] : " "}
          </Box>
          {line.text}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        Text Compare
      </Typography>

      {/* ── Toolbar ── */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 2, py: 1.5, mb: 1.5,
          display:     "flex",
          alignItems:  "center",
          gap:         2,
          flexWrap:    "wrap",
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, val) => val && setMode(val)}
          size="small"
        >
          <ToggleButton value="split"   sx={{ px: 2, fontSize: 12 }}>Split</ToggleButton>
          <ToggleButton value="unified" sx={{ px: 2, fontSize: 12 }}>Unified</ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Stats */}
        {compared && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={`+${stats.added} added`}
              size="small"
              sx={{ bgcolor: "#e6ffec", color: "#1a7f37", fontSize: 11, height: 22 }}
            />
            <Chip
              label={`−${stats.removed} removed`}
              size="small"
              sx={{ bgcolor: "#ffebe9", color: "#cf222e", fontSize: 11, height: 22 }}
            />
            <Chip
              label={`${stats.unchanged} unchanged`}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11, height: 22 }}
            />
          </Box>
        )}

        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            disableElevation
            onClick={compare}
            sx={{ minWidth: 110 }}
          >
            Compare
          </Button>
          <Button variant="outlined" onClick={reset} sx={{ minWidth: 80 }}>
            Reset
          </Button>
        </Box>
      </Paper>

      {/* ── Input panels (always visible) ── */}
      {!compared && (
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <PanelHeader label="Original" />
              <textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                placeholder="Paste original text here..."
                style={{
                  width:       "100%",
                  height:      "65vh",
                  padding:     "12px",
                  fontFamily:  "monospace",
                  fontSize:    12,
                  border:      "none",
                  outline:     "none",
                  resize:      "none",
                  boxSizing:   "border-box",
                  lineHeight:  1.6,
                  color:       "#374151",
                  background:  "transparent",
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <PanelHeader label="Modified" />
              <textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                placeholder="Paste modified text here..."
                style={{
                  width:      "100%",
                  height:     "65vh",
                  padding:    "12px",
                  fontFamily: "monospace",
                  fontSize:   12,
                  border:     "none",
                  outline:    "none",
                  resize:     "none",
                  boxSizing:  "border-box",
                  lineHeight: 1.6,
                  color:      "#374151",
                  background: "transparent",
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ── Diff output ── */}
      {compared && (
        <>
          {/* Split view */}
          {mode === "split" && (
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Grid container>
                {/* Left */}
                <Grid
                  item xs={6}
                  sx={{ borderRight: "1px solid", borderColor: "divider" }}
                >
                  <PanelHeader label="Original">
                    <Chip label="before" size="small" sx={{ fontSize: 10, height: 18 }} />
                  </PanelHeader>
                  <Box sx={{ overflow: "auto", maxHeight: "70vh" }}>
                    {splitRows.map((row, i) => (
                      <DiffLineRow key={i} line={row.left} side="left" />
                    ))}
                  </Box>
                </Grid>

                {/* Right */}
                <Grid item xs={6}>
                  <PanelHeader label="Modified">
                    <Chip label="after" size="small" sx={{ fontSize: 10, height: 18 }} />
                  </PanelHeader>
                  <Box sx={{ overflow: "auto", maxHeight: "70vh" }}>
                    {splitRows.map((row, i) => (
                      <DiffLineRow key={i} line={row.right} side="right" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Unified view */}
          {mode === "unified" && (
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <PanelHeader label="Unified Diff">
                <Chip label="unified" size="small" sx={{ fontSize: 10, height: 18 }} />
              </PanelHeader>
              <Box sx={{ overflow: "auto", maxHeight: "70vh" }}>
                {diff.map((line, i) => (
                  <Box
                    key={i}
                    sx={{
                      display:    "flex",
                      alignItems: "baseline",
                      bgcolor:    BG[line.op],
                      minHeight:  22,
                      px:         0.5,
                    }}
                  >
                    {/* Left line num */}
                    <LineNum n={line.op !== "insert" ? line.leftNum : undefined} />
                    {/* Right line num */}
                    <LineNum n={line.op !== "delete" ? line.rightNum : undefined} />
                    <Box
                      component="span"
                      sx={{
                        color:      COLOR[line.op],
                        fontFamily: "monospace",
                        fontSize:   12,
                        whiteSpace: "pre-wrap",
                        wordBreak:  "break-all",
                        flex:       1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ userSelect: "none", mr: 0.5, opacity: 0.6 }}
                      >
                        {PREFIX[line.op]}
                      </Box>
                      {line.text}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Edit again button */}
          <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setCompared(false)}
              sx={{ fontSize: 12 }}
            >
              ← Edit inputs
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}