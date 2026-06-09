-- CreateTable
CREATE TABLE "ReceiveHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paperPlaneId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReceiveHistory_paperPlaneId_fkey" FOREIGN KEY ("paperPlaneId") REFERENCES "PaperPlane" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReceiveHistory_paperPlaneId_userId_key" ON "ReceiveHistory"("paperPlaneId", "userId");

-- CreateIndex
CREATE INDEX "ReceiveHistory_userId_idx" ON "ReceiveHistory"("userId");
