-- CreateTable
CREATE TABLE "Marketing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "consent" BOOLEAN NOT NULL,
    CONSTRAINT "Marketing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Marketing_userId_key" ON "Marketing"("userId");
