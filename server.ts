import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { extractMeetingTasks } from "./lib/gemini.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to support file uploads (PDF, docx, images)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Endpoint: Extract tasks from meeting notes or file using Gemini API
  app.post("/api/extract-tasks", async (req, res) => {
    try {
      const { text, file, meetingContext } = req.body || {};

      if (!text && !file) {
        return res.status(400).json({
          success: false,
          tasks: [],
          error: "请求参数不完整，请提供会议文本或上传文件。",
        });
      }

      const result = await extractMeetingTasks({
        text,
        file,
        meetingContext,
      });

      return res.json(result);
    } catch (err: any) {
      console.error("API /api/extract-tasks Error:", err);
      return res.status(500).json({
        success: false,
        tasks: [],
        error: err.message || "服务器内部错误，未能成功提取任务。",
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Meeting Tracker Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
