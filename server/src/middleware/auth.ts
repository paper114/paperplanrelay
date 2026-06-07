import { Request, Response, NextFunction } from "express";

const ADMIN_KEY = "admin123";

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
  const adminKey = getHeaderString(req, "x-admin-key");
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: "管理员密钥错误" });
  }
  next();
}
