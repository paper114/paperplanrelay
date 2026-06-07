import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { checkRateLimit } from "../middleware/rateLimit";
import { requireUserId, getHeaderString } from "../middleware/auth";
import { containsSensitiveWord } from "../utils/sensitiveWords";
import { aiModerate } from "../utils/aiModeration";

const router = Router();
const prisma = new PrismaClient();
const validPlaneColors = new Set(["blue", "purple", "pink", "green", "yellow", "red"]);

router.post("/", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");
    const { content, nickname, color } = req.body;

    if (!content || content.length < 1 || content.length > 500) {
      return res.status(400).json({ success: false, message: "内容长度需要在1-500字之间" });
    }

    if (nickname && nickname.length > 20) {
      return res.status(400).json({ success: false, message: "昵称不能超过20字" });
    }

    if (color && !validPlaneColors.has(color)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机颜色" });
    }

    if (containsSensitiveWord(content)) {
      return res.status(400).json({ success: false, message: "内容包含敏感词，请修改后重试" });
    }

    const aiResult = await aiModerate(content);
    if (!aiResult.safe) {
      return res.status(400).json({ success: false, message: aiResult.reason || "AI审核未通过，请修改内容后重试" });
    }

    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: rateCheck.reason });
    }

    const plane = await prisma.paperPlane.create({
      data: {
        content,
        nickname: nickname || null,
        color: color || "blue",
        userId,
      },
    });

    return res.json({ success: true, id: plane.id });
  } catch (error) {
    console.error("创建纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.get("/random", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");

    const planes = await prisma.paperPlane.findMany({
      where: {
        status: "normal",
        reportCount: { lt: 3 },
        userId: { not: userId },
      },
      select: {
        id: true,
        content: true,
        nickname: true,
        color: true,
        likeCount: true,
        createdAt: true,
      },
    });

    if (planes.length === 0) {
      return res.status(404).json({ success: false, message: "暂无可接收的纸飞机" });
    }

    const randomIndex = Math.floor(Math.random() * planes.length);
    const plane = planes[randomIndex];

    const existingLike = await prisma.like.findUnique({
      where: { paperPlaneId_userId: { paperPlaneId: plane.id, userId } },
    });
    const existingFavorite = await prisma.favorite.findUnique({
      where: { paperPlaneId_userId: { paperPlaneId: plane.id, userId } },
    });

    return res.json({
      ...plane,
      isLiked: !!existingLike,
      isFavorited: !!existingFavorite,
    });
  } catch (error) {
    console.error("获取随机纸飞机失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const totalCount = await prisma.paperPlane.count({
      where: { status: "normal" },
    });
    return res.json({ totalCount });
  } catch (error) {
    console.error("获取统计失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.post("/:id/like", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");
    const planeId = parseInt(req.params.id as string, 10);

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    const plane = await prisma.paperPlane.findUnique({ where: { id: planeId } });
    if (!plane) {
      return res.status(404).json({ success: false, message: "纸飞机不存在" });
    }

    const existingLike = await prisma.like.findUnique({
      where: { paperPlaneId_userId: { paperPlaneId: planeId, userId } },
    });

    if (existingLike) {
      return res.status(400).json({ success: false, message: "已经点赞过了" });
    }

    await prisma.$transaction([
      prisma.like.create({
        data: { paperPlaneId: planeId, userId },
      }),
      prisma.paperPlane.update({
        where: { id: planeId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error("点赞失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.delete("/:id/like", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");
    const planeId = parseInt(req.params.id as string, 10);

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    const existingLike = await prisma.like.findUnique({
      where: { paperPlaneId_userId: { paperPlaneId: planeId, userId } },
    });

    if (!existingLike) {
      return res.status(400).json({ success: false, message: "尚未点赞" });
    }

    await prisma.$transaction([
      prisma.like.delete({ where: { id: existingLike.id } }),
      prisma.paperPlane.update({
        where: { id: planeId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error("取消点赞失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

const validReportReasons = ["垃圾广告", "辱骂攻击", "色情低俗", "政治敏感", "违法内容", "其他原因"];

router.post("/:id/report", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");
    const planeId = parseInt(req.params.id as string, 10);
    const { reason } = req.body;

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    if (!reason || !validReportReasons.includes(reason)) {
      return res.status(400).json({ success: false, message: "无效的举报原因" });
    }

    const plane = await prisma.paperPlane.findUnique({ where: { id: planeId } });
    if (!plane) {
      return res.status(404).json({ success: false, message: "纸飞机不存在" });
    }

    const existingReport = await prisma.report.findFirst({
      where: { paperPlaneId: planeId, userId },
    });

    if (existingReport) {
      return res.status(400).json({ success: false, message: "你已经举报过该纸飞机" });
    }

    const newReportCount = plane.reportCount + 1;
    const updateData: any = { reportCount: newReportCount };

    if (newReportCount >= 3) {
      updateData.status = "hidden";
    }

    await prisma.$transaction([
      prisma.report.create({
        data: { paperPlaneId: planeId, userId, reason },
      }),
      prisma.paperPlane.update({
        where: { id: planeId },
        data: updateData,
      }),
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error("举报失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.post("/:id/favorite", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");
    const planeId = parseInt(req.params.id as string, 10);

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    const plane = await prisma.paperPlane.findUnique({ where: { id: planeId } });
    if (!plane) {
      return res.status(404).json({ success: false, message: "纸飞机不存在" });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: { paperPlaneId_userId: { paperPlaneId: planeId, userId } },
    });

    if (existingFavorite) {
      return res.status(400).json({ success: false, message: "已经收藏过了" });
    }

    await prisma.favorite.create({
      data: { paperPlaneId: planeId, userId },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("收藏失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

router.delete("/:id/favorite", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");
    const planeId = parseInt(req.params.id as string, 10);

    if (isNaN(planeId)) {
      return res.status(400).json({ success: false, message: "无效的纸飞机ID" });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: { paperPlaneId_userId: { paperPlaneId: planeId, userId } },
    });

    if (!existingFavorite) {
      return res.status(404).json({ success: false, message: "未收藏该纸飞机" });
    }

    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("取消收藏失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

export default router;
