import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireUserId, getHeaderString } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", requireUserId, async (req: Request, res: Response) => {
  try {
    const userId = getHeaderString(req, "x-user-id");

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        paperPlane: {
          select: {
            id: true,
            content: true,
            nickname: true,
            color: true,
            likeCount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(
      favorites.map((f) => ({
        ...f.paperPlane,
        favoriteAt: f.createdAt,
      }))
    );
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

export default router;
