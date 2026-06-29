-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'APPROVAL');

-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('ALLOW', 'DENY');

-- CreateTable
CREATE TABLE "users" (
    "username" CHAR(8) NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(254),
    "password" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" CHAR(8) NOT NULL,
    "updated_at" TIMESTAMPTZ(0),
    "updated_by" CHAR(8),

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "roles" (
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" CHAR(8) NOT NULL,
    "updated_at" TIMESTAMPTZ(0),
    "updated_by" CHAR(8),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "features" (
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" CHAR(8) NOT NULL,
    "updated_at" TIMESTAMPTZ(0),
    "updated_by" CHAR(8),

    CONSTRAINT "features_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "user_role" (
    "username" CHAR(8) NOT NULL,
    "role_code" VARCHAR(50) NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("username","role_code")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_code" VARCHAR(50) NOT NULL,
    "feature_code" VARCHAR(100) NOT NULL,
    "action" "Action" NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_code","feature_code","action")
);

-- CreateTable
CREATE TABLE "user_permission" (
    "username" CHAR(8) NOT NULL,
    "feature_code" VARCHAR(100) NOT NULL,
    "action" "Action" NOT NULL,
    "decision" "Decision" NOT NULL,

    CONSTRAINT "user_permission_pkey" PRIMARY KEY ("username","feature_code","action")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_code_fkey" FOREIGN KEY ("role_code") REFERENCES "roles"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_code_fkey" FOREIGN KEY ("role_code") REFERENCES "roles"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_feature_code_fkey" FOREIGN KEY ("feature_code") REFERENCES "features"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_feature_code_fkey" FOREIGN KEY ("feature_code") REFERENCES "features"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
