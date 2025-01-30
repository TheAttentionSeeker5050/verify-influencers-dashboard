-- Adminer 4.8.1 PostgreSQL 17.2 (Debian 17.2-1.pgdg120+1) dump

\connect "influencer-db";

DROP TABLE IF EXISTS "_prisma_migrations";
CREATE TABLE "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamptz,
    "migration_name" character varying(255) NOT NULL,
    "logs" text,
    "rolled_back_at" timestamptz,
    "started_at" timestamptz DEFAULT now() NOT NULL,
    "applied_steps_count" integer DEFAULT '0' NOT NULL,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

TRUNCATE "_prisma_migrations";
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") VALUES
('0a6d6208-2ee1-49e1-9719-0b0a12f5d325',	'b812f347c80c462eb66ba0e1e359af46b05cfb7c9c21cbfb5111062711116f46',	'2025-01-27 20:40:37.080997+00',	'20250123164053_init',	NULL,	NULL,	'2025-01-27 20:40:37.0701+00',	1),
('5158fc55-d8ea-444d-b177-22dc0afd0e56',	'b166cd21b959a7292f0b3cdfa1a0e859d6f21958cbe2cbbe0ec0795ad1ef53d4',	'2025-01-27 20:40:37.091129+00',	'20250123165329_init',	NULL,	NULL,	'2025-01-27 20:40:37.08339+00',	1),
('70652313-c9e8-457a-8f08-681f7b59460b',	'ba522dfb1ee7b9ac68410ffba0214ee90b23fa064f80f5e7a032408aa7068d77',	'2025-01-27 20:40:37.099622+00',	'20250123170230_init',	NULL,	NULL,	'2025-01-27 20:40:37.09336+00',	1),
('b4829dc4-5e96-42be-a965-3f6e59381049',	'2af94c94a0a7c34e7834f2cc1ebe2a80c768973d81472a21d7f0166ac6ef7a5b',	'2025-01-27 20:40:37.108676+00',	'20250124150235_init',	NULL,	NULL,	'2025-01-27 20:40:37.101641+00',	1),
('6f20abd3-dc7f-40c6-997b-fcd3187d6a04',	'f722d758dbf21438dafc6bf84930dfb3fea394b94deeec9dab002a24a9dc02b2',	'2025-01-27 20:40:37.116744+00',	'20250124154955_init',	NULL,	NULL,	'2025-01-27 20:40:37.110754+00',	1),
('6cb09ecb-bfb2-42dc-80db-a1435beda7e4',	'fa5372ca37137068a3f210e35c540863b308fc398c0131e796b8ba8c504de7c5',	'2025-01-27 20:40:37.125158+00',	'20250124174039_init',	NULL,	NULL,	'2025-01-27 20:40:37.118664+00',	1),
('06c6aa3a-8f7b-4e57-92aa-d77264fc1674',	'bd6ebdf18fdf2ed6f236ab3333c84b0fcd3156dc77dda847ba9e81638a4a35ce',	'2025-01-27 20:40:37.133339+00',	'20250124174407_init',	NULL,	NULL,	'2025-01-27 20:40:37.127166+00',	1),
('824a3793-c68c-46fa-b135-392a8bfb6926',	'8d7fa6a9fb87d3395a14a83d346473b4bbe67ee43cf3d71e23a9d315360b43d1',	'2025-01-27 20:40:37.141899+00',	'20250124174835_init',	NULL,	NULL,	'2025-01-27 20:40:37.135333+00',	1);

-- 2025-01-30 18:07:20.542352+00
