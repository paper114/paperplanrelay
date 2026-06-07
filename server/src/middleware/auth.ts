import { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "crypto";

const DEV_ADMIN_KEY = "admin123";

function getConfiguredAdminKey(): string {
  const configuredKey = process.env.ADMIN_KEY?.trim();
  if (configuredKey) return configuredKey;
  return process.env.NODE_ENV === "production" ? "" : DEV_ADMIN_KEY;
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function getHeaderString(req: Request, name: string): string {
  const raw = req.headers[name];
  return (Array.isArray(raw) ? raw[0] : raw) || "";
}

export function requireUserId(req: Request, res: Response, next: NextFunction) {
  const userId = getHeaderString(req, "x-user-id");
  if (!userId || userId.trim() === "") {
    return res.status(400).json({ success: false, message: "缺少 X-User-ID 请求头" });
  }
  next();
}

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const configuredAdminKey = getConfiguredAdminKey();
  if (!configuredAdminKey) {
    return res.status(503).json({ success: false, message: "管理员密钥未配置" });
  }

  const adminKey = getHeaderString(req, "x-admin-key");
  if (!safeCompare(adminKey, configuredAdminKey)) {
    return res.status(403).json({ success: false, message: "管理员密钥错误" });
  }
  next();
}
