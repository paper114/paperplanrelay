import express from "express";
import cors from "cors";
import path from "path";
import paperPlanesRouter from "./routes/paper-planes";
import favoritesRouter from "./routes/favorites";
import adminRouter from "./routes/admin";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";
const clientDistPath = path.join(__dirname, "../../client/dist");

const allowedOrigins = [
  process.env.PUBLIC_ORIGIN,
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => value!.split(","))
  .map((value) => value.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data:",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self'",
    ].join("; "),
  );
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || !isProduction || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-User-ID", "X-Admin-Key"],
  maxAge: 86400,
}));
app.use(express.json({ limit: "16kb" }));

app.use("/api/paper-planes", paperPlanesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(clientDistPath, {
  index: false,
  maxAge: isProduction ? "1h" : 0,
}));
app.get("{*path}", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

export default app;
