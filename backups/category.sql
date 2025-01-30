-- Adminer 4.8.1 PostgreSQL 17.2 (Debian 17.2-1.pgdg120+1) dump

\connect "influencer-db";

DROP TABLE IF EXISTS "Category";
DROP SEQUENCE IF EXISTS "Category_id_seq";
CREATE SEQUENCE "Category_id_seq" INCREMENT  MINVALUE  MAXVALUE  CACHE ;

CREATE TABLE "public"."Category" (
    "id" integer DEFAULT nextval('"Category_id_seq"') NOT NULL,
    "name" text NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

TRUNCATE "Category";
INSERT INTO "Category" ("id", "name", "createdAt", "updatedAt") VALUES
(1,	'Nutrition',	'2025-01-23 17:06:27.658',	'2025-01-23 17:06:27.658'),
(2,	'Fitness',	'2025-01-23 17:06:27.658',	'2025-01-23 17:06:27.658'),
(3,	'Medicine',	'2025-01-23 17:06:27.658',	'2025-01-23 17:06:27.658'),
(4,	'Mental Health',	'2025-01-23 17:06:27.658',	'2025-01-23 17:06:27.658');

-- 2025-01-30 18:06:28.482085+00