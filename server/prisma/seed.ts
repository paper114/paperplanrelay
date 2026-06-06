import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const samplePlanes = [
    {
      content: "愿你每天都有好心情，像阳光一样温暖。",
      nickname: "小太阳",
      color: "yellow",
      userId: "seed-user-1",
    },
    {
      content: "人生就像一场旅行，不必在乎目的地，在乎的是沿途的风景以及看风景的心情。",
      nickname: "旅行者",
      color: "green",
      userId: "seed-user-2",
    },
    {
      content: "你今天也很棒哦！继续加油！",
      nickname: "啦啦队",
      color: "pink",
      userId: "seed-user-3",
    },
    {
      content: "世界上最美好的事情之一，就是有人在默默地关心着你。",
      nickname: null,
      color: "blue",
      userId: "seed-user-4",
    },
    {
      content: "不要因为走得太远，而忘记为什么出发。",
      nickname: "哲学家",
      color: "purple",
      userId: "seed-user-5",
    },
    {
      content: "希望这架纸飞机能带给你一天的好运！",
      nickname: "幸运星",
      color: "orange",
      userId: "seed-user-6",
    },
    {
      content: "每一个不曾起舞的日子，都是对生命的辜负。",
      nickname: "尼采",
      color: "red",
      userId: "seed-user-7",
    },
    {
      content: "生活不止眼前的苟且，还有诗和远方。",
      nickname: "诗人",
      color: "blue",
      userId: "seed-user-8",
    },
  ];

  for (const plane of samplePlanes) {
    await prisma.paperPlane.create({ data: plane });
  }

  console.log(`已插入 ${samplePlanes.length} 条示例数据`);
}

main()
  .catch((e) => {
    console.error("Seed 失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
