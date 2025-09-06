/*
  Warnings:

  - The `role` column on the `WorkspaceUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER', 'GUEST');

-- CreateEnum
CREATE TYPE "public"."InviteStatus" AS ENUM ('PENDING', 'APPROVAL', 'REJECT');

-- AlterTable
ALTER TABLE "public"."WorkspaceUser" ADD COLUMN     "status" "public"."InviteStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';
