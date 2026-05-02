import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

type Options = {
  format: boolean;
  braces: boolean;
  uppercase: boolean;
  quotes: boolean;
  base64: boolean;
};

const TOGGLES: { key: keyof Options; label: string }[] = [
  { key: "format", label: "Hyphens (formatted)" },
  { key: "braces", label: "Braces { }" },
  { key: "uppercase", label: "Uppercase" },
  { key: "quotes", label: 'Quotes " "' },
  { key: "base64", label: "Encode Base64" },
];

function formatGuid(raw: string, opts: Options): string {
  let g = raw;
  if (!opts.format) g = g.replace(/-/g, "");
  if (opts.uppercase) g = g.toUpperCase();
  if (opts.base64) g = btoa(g);
  if (opts.braces) g = `{${g}}`;
  if (opts.quotes) g = `"${g}"`;
  return g;
}

export default function GuidGenerator() {
  const [count, setCount] = useState(1);
  const [guids, setGuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);
  const [opts, setOpts] = useState<Options>({
    format: true,
    braces: false,
    uppercase: false,
    quotes: false,
    base64: false,
  });

  const toggle = (key: keyof Options) =>
    setOpts((o) => ({ ...o, [key]: !o[key] }));

  const generate = () => {
    const n = Math.min(100, Math.max(1, count));
    setGuids(Array.from({ length: n }, () => formatGuid(uuidv4(), opts)));
  };

  const reset = () => {
    setGuids([]);
    setCopied(null);
    setCount(1);
    setOpts({
      format: true,
      braces: false,
      uppercase: false,
      quotes: false,
      base64: false,
    });
  };

  const copy = (text: string, idx: number | "all") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
        GUID / UUID Generator
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Grid container sx={{ minHeight: 480 }}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              bgcolor: "grey.50",
              borderRight: "1px solid",
              borderColor: "divider",
              p: 2.5,
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ mb: 1.5, display: "block" }}
            >
              Options
            </Typography>

            <TextField
              label="Number of GUIDs"
              type="number"
              size="small"
              fullWidth
              slotProps={{ htmlInput: { min: 1, max: 100 } }}
              value={count}
              onChange={(e) =>
                setCount(e.target.value === "" ? 0 : Number(e.target.value))
              }
              onBlur={() => setCount((c) => (c < 1 ? 1 : c))}
              sx={{ mb: 2 }}
            />

            <Stack spacing={1} sx={{ mb: 3 }}>
              {TOGGLES.map(({ key, label }) => (
                <Box
                  key={key}
                  onClick={() => toggle(key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 1,
                    border: "1px solid",
                    borderColor: opts[key] ? "primary.main" : "divider",
                    borderRadius: 1.5,
                    bgcolor: opts[key] ? "primary.50" : "background.paper",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <Typography
                    variant="body2"
                    color={opts[key] ? "primary.main" : "text.primary"}
                    fontWeight={opts[key] ? 500 : 400}
                  >
                    {label}
                  </Typography>
                  <Switch
                    checked={opts[key]}
                    size="small"
                    onChange={() => toggle(key)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={generate}
                disableElevation
              >
                Generate GUIDs
              </Button>
              <Button variant="outlined" fullWidth onClick={reset}>
                Reset
              </Button>
            </Stack>
          </Grid>

          {/* Right panel */}
          <Grid
            item
            xs={12}
            sm={8}
            sx={{ p: 2.5, display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle2">Results</Typography>
              {guids.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={`${guids.length} guid${guids.length > 1 ? "s" : ""}`}
                    size="small"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      copied === "all" ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )
                    }
                    onClick={() => copy(guids.join("\n"), "all")}
                    color={copied === "all" ? "success" : "primary"}
                  >
                    {copied === "all" ? "Copied!" : "Copy all"}
                  </Button>
                </Box>
              )}
            </Box>

            {guids.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.disabled">
                  Click "Generate GUIDs" to start
                </Typography>
              </Box>
            ) : (
              <Stack spacing={0.75} sx={{ overflow: "auto", flex: 1 }}>
                {guids.map((g, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1.5,
                      py: 1,
                      bgcolor: "grey.50",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "text.secondary",
                        wordBreak: "break-all",
                      }}
                    >
                      {g}
                    </Typography>
                    <Tooltip title={copied === i ? "Copied!" : "Copy"}>
                      <IconButton
                        size="small"
                        onClick={() => copy(g, i)}
                        sx={{ ml: 1 }}
                      >
                        {copied === i ? (
                          <CheckIcon fontSize="small" color="success" />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
