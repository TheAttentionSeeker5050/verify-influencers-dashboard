-- Adminer 4.8.1 PostgreSQL 17.2 (Debian 17.2-1.pgdg120+1) dump

\connect "influencer-db";

DROP TABLE IF EXISTS "Claim";
DROP SEQUENCE IF EXISTS "Claim_id_seq";
CREATE SEQUENCE "Claim_id_seq" INCREMENT  MINVALUE  MAXVALUE  CACHE ;

CREATE TABLE "public"."Claim" (
    "id" integer DEFAULT nextval('"Claim_id_seq"') NOT NULL,
    "influencerId" integer NOT NULL,
    "claim" text NOT NULL,
    "tweetId" text NOT NULL,
    "verificationStatus" text NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

TRUNCATE "Claim";

ALTER TABLE ONLY "public"."Claim" ADD CONSTRAINT "Claim_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."Claim" ADD CONSTRAINT "Claim_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

-- 2025-01-23 17:09:02.215233+00