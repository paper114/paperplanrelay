import { Request, Response, NextFunction } from "express";

const ADMIN_KEY = "admin123";

export function requireUserId(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"] as string;
  if (!userId || userId.trim() === "") {
    return res.status(400).json({ success: false, message: "缺少 X-User-ID 请求头" });
  }
  next();
}

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers["x-admin-key"] as string;
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ success: false, message: "管理员密钥错误" });
  }
  next();
}
