import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdminKey } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();
const MANUAL_REVIEW_SETTING_KEY = "manual_review_enabled";
const validTrashReasons = new Set(["review_rejected", "manual_delete", "report_hidden"]);

async function getManualReviewEnabled(): Promise<boolean> {
  const setting = await prisma.appSetting.findUnique({
    where: { key: MANUAL_REVIEW_SETTING_KEY },
  });
  return setting?.value === "true";
}

router.get("/paper-planes", requireAdminKey, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const view = req.query.view as string;
    const trashReason = req.query.trashReason as string;
    const sort = req.query.sort === "asc" ? "asc" : "desc";

    const where: any = {};

    if (view === "trash") {
      where.status = "deleted";
      if (trashReason && validTrashReasons.has(trashReason)) {
        where.trashReason = trashReason;
      }
    } else if (status) {
      where.status = status;
    } else {
      where.status = { not: "deleted" };
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
        orderBy: view === "trash" ? { trashedAt: sort } : { createdAt: sort },
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
      data: {
        status: "deleted",
        trashReason: "manual_delete",
        trashedAt: new Date(),
      },
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
      data: {
        status: plane.trashReason === "review_rejected" ? "pending" : "normal",
        reportCount: 0,
        trashReason: null,
        trashedAt: null,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("恢复纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.patch("/paper-planes/:id/approve", requireAdminKey, async (req: Request, res: Response) => {
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
      data: {
        status: "normal",
        reportCount: 0,
        trashReason: null,
        trashedAt: null,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("通过纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.patch("/paper-planes/:id/reject", requireAdminKey, async (req: Request, res: Response) => {
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
      data: {
        status: "deleted",
        trashReason: "review_rejected",
        trashedAt: new Date(),
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("拒绝纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.get("/stats", requireAdminKey, async (_req: Request, res: Response) => {
  try {
    const [totalPlanes, totalLikes, totalReports, todayPlanes, pendingPlanes] = await Promise.all([
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
      prisma.paperPlane.count({ where: { status: "pending" } }),
    ]);

    return res.json({ totalPlanes, totalLikes, totalReports, todayPlanes, pendingPlanes });
  } catch (error) {
    console.error("获取统计失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.get("/settings", requireAdminKey, async (_req: Request, res: Response) => {
  try {
    return res.json({ manualReviewEnabled: await getManualReviewEnabled() });
  } catch (error) {
    console.error("获取设置失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.patch("/settings/manual-review", requireAdminKey, async (req: Request, res: Response) => {
  try {
    const enabled = Boolean(req.body?.enabled);
    await prisma.appSetting.upsert({
      where: { key: MANUAL_REVIEW_SETTING_KEY },
      create: {
        key: MANUAL_REVIEW_SETTING_KEY,
        value: enabled ? "true" : "false",
      },
      update: {
        value: enabled ? "true" : "false",
      },
    });

    return res.json({ success: true, manualReviewEnabled: enabled });
  } catch (error) {
    console.error("更新人工审核设置失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

export default router;
