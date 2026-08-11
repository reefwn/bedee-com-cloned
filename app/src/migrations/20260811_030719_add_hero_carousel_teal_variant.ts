import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_hero_carousel_variant" ADD VALUE 'teal';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" ADD VALUE 'teal';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_carousel_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_carousel_variant" AS ENUM('dark', 'light', 'coral');
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::"public"."enum_pages_blocks_hero_carousel_variant";
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_carousel_variant" USING "variant"::"public"."enum_pages_blocks_hero_carousel_variant";
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_carousel_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" AS ENUM('dark', 'light', 'coral');
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::"public"."enum__pages_v_blocks_hero_carousel_variant";
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_carousel_variant";`)
}
