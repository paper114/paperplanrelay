import express from "express";
import cors from "cors";
import path from "path";
import paperPlanesRouter from "./routes/paper-planes";
import favoritesRouter from "./routes/favorites";
import adminRouter from "./routes/admin";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/paper-planes", paperPlanesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, "../../client/dist")));
app.get("{*path}", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

export default app;
