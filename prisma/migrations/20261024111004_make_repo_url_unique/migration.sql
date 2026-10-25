/*
  Warnings:

  - A unique constraint covering the columns `[repoUrl]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "submissions_studentId_repoUrl_key";

-- CreateIndex
CREATE UNIQUE INDEX "submissions_repoUrl_key" ON "submissions"("repoUrl");
