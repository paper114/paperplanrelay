import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdminKey } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/paper-planes", requireAdminKey, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.content = { contains: search };
    }

    const [items, total] = await Promise.all([
      prisma.paperPlane.findMany({
        where,
        include: {
          _count: { select: { likes: true, reports: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.paperPlane.count({ where }),
    ]);

    return res.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("获取纸飞机列表失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.delete("/paper-planes/:id", requireAdminKey, async (req: Request, res: Response) => {
  try {
    const planeId = parseInt(req.params.id as string, 10);

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    const plane = await prisma.paperPlane.findUnique({ where: { id: planeId } });
    if (!plane) {
      return res.status(404).json({ success: false, message: "纸飞机不存在" });
    }

    await prisma.paperPlane.update({
      where: { id: planeId },
      data: { status: "deleted" },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("删除纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.patch("/paper-planes/:id/restore", requireAdminKey, async (req: Request, res: Response) => {
  try {
    const planeId = parseInt(req.params.id as string, 10);

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    const plane = await prisma.paperPlane.findUnique({ where: { id: planeId } });
    if (!plane) {
      return res.status(404).json({ success: false, message: "纸飞机不存在" });
    }

    await prisma.paperPlane.update({
      where: { id: planeId },
      data: { status: "normal", reportCount: 0 },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("恢复纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.get("/stats", requireAdminKey, async (_req: Request, res: Response) => {
  try {
    const [totalPlanes, totalLikes, totalReports, todayPlanes] = await Promise.all([
      prisma.paperPlane.count(),
      prisma.like.count(),
      prisma.report.count(),
      prisma.paperPlane.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return res.json({ totalPlanes, totalLikes, totalReports, todayPlanes });
  } catch (error) {
    console.error("获取统计失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

export default router;
