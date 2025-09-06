/*
  Warnings:

  - The values [APPROVAL,REJECT] on the enum `InviteStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."InviteStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
ALTER TABLE "public"."WorkspaceUser" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."WorkspaceUser" ALTER COLUMN "status" TYPE "public"."InviteStatus_new" USING ("status"::text::"public"."InviteStatus_new");
ALTER TYPE "public"."InviteStatus" RENAME TO "InviteStatus_old";
ALTER TYPE "public"."InviteStatus_new" RENAME TO "InviteStatus";
DROP TYPE "public"."InviteStatus_old";
ALTER TABLE "public"."WorkspaceUser" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
