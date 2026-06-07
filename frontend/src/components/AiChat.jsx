import { useState, useRef, useEffect } from "react";
import {
  Box, Fab, Paper, Typography, TextField, IconButton,
  CircularProgress, Collapse, Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "../services/api";

const SUGGESTIONS = [
  "Quanto gastei este mês?",
  "Qual a categoria com mais gastos?",
  "Quanto enviei para o Brasil este ano?",
  "Estou dentro da meta?",
];

function Message({ role, content }) {
  const theme = useTheme();
  const isUser = role === "user";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          px: 1.75,
          py: 1.25,
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          bgcolor: isUser
            ? theme.palette.primary.main
            : alpha(theme.palette.text.primary, theme.palette.mode === "light" ? 0.06 : 0.12),
          color: isUser ? "#fff" : theme.palette.text.primary,
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
          {content}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AiChat() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiMissing, setApiMissing] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const userMsg = { role: "user", content: question };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setApiMissing(false);

    try {
      const { data } = await api.post("/ai/chat", { messages: updated });
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const msg = err?.response?.data?.error ?? "Erro ao contactar o assistente.";
      if (msg.includes("OPENAI_API_KEY")) setApiMissing(true);
      setMessages([...updated, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Chat panel */}
      <Collapse
        in={open}
        sx={{
          position: "fixed",
          bottom: 88,
          right: 24,
          zIndex: 1300,
          transformOrigin: "bottom right",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: 340,
            height: 480,
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: theme.palette.primary.main,
            }}
          >
            <SmartToyOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={700} color="#fff">
                Assistente IA
              </Typography>
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.75) }}>
                Perguntas sobre as tuas finanças
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5 }}>
            {messages.length === 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                  Sugestões de perguntas:
                </Typography>
                {SUGGESTIONS.map((s) => (
                  <Box
                    key={s}
                    onClick={() => send(s)}
                    sx={{
                      mb: 0.75,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.07),
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {s}
                    </Typography>
                  </Box>
                ))}
                {apiMissing && (
                  <Typography variant="caption" color="warning.main" display="block" mt={1}>
                    Configura OPENAI_API_KEY no ficheiro .env do backend.
                  </Typography>
                )}
              </Box>
            )}

            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
                <Box
                  sx={{
                    px: 1.75,
                    py: 1.25,
                    borderRadius: "18px 18px 18px 4px",
                    bgcolor: alpha(theme.palette.text.primary, theme.palette.mode === "light" ? 0.06 : 0.12),
                  }}
                >
                  <CircularProgress size={14} thickness={5} />
                </Box>
              </Box>
            )}

            <div ref={endRef} />
          </Box>

          <Divider />

          {/* Input */}
          <Box sx={{ px: 1.5, py: 1.25, display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              size="small"
              placeholder="Escreve uma pergunta…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "14px", fontSize: 13 },
              }}
            />
            <IconButton
              onClick={() => send()}
              disabled={!input.trim() || loading}
              color="primary"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                width: 36,
                height: 36,
                flexShrink: 0,
                "&:hover": { bgcolor: theme.palette.primary.dark },
                "&.Mui-disabled": { bgcolor: theme.palette.action.disabledBackground, color: theme.palette.action.disabled },
              }}
            >
              <SendOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      {/* FAB */}
      <Fab
        color="primary"
        onClick={() => setOpen((v) => !v)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        {open ? (
          <CloseIcon />
        ) : (
          <SmartToyOutlinedIcon />
        )}
      </Fab>
    </>
  );
}
