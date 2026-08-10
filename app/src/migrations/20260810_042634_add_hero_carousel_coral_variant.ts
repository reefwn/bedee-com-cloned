import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_hero_carousel_variant" ADD VALUE 'coral';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" ADD VALUE 'coral';
  ALTER TABLE "pages_blocks_hero_carousel" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_carousel" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "pages_blocks_hero_carousel" ADD CONSTRAINT "pages_blocks_hero_carousel_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_carousel_background_image_idx" ON "pages_blocks_hero_carousel" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_background_image_idx" ON "_pages_v_blocks_hero_carousel" USING btree ("background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_carousel" DROP CONSTRAINT "pages_blocks_hero_carousel_background_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_hero_carousel" DROP CONSTRAINT "_pages_v_blocks_hero_carousel_background_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_carousel_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_carousel_variant" AS ENUM('dark', 'light');
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::"public"."enum_pages_blocks_hero_carousel_variant";
  ALTER TABLE "pages_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_carousel_variant" USING "variant"::"public"."enum_pages_blocks_hero_carousel_variant";
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_carousel_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" AS ENUM('dark', 'light');
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DEFAULT 'dark'::"public"."enum__pages_v_blocks_hero_carousel_variant";
  ALTER TABLE "_pages_v_blocks_hero_carousel" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_carousel_variant";
  DROP INDEX "pages_blocks_hero_carousel_background_image_idx";
  DROP INDEX "_pages_v_blocks_hero_carousel_background_image_idx";
  ALTER TABLE "pages_blocks_hero_carousel" DROP COLUMN "background_image_id";
  ALTER TABLE "_pages_v_blocks_hero_carousel" DROP COLUMN "background_image_id";`)
}
