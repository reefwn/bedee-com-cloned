import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_icon_grid_variant" AS ENUM('tinted', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_grid_variant" AS ENUM('tinted', 'plain');
  ALTER TABLE "pages_blocks_icon_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_icon_grid" ADD COLUMN "variant" "enum_pages_blocks_icon_grid_variant" DEFAULT 'tinted';
  ALTER TABLE "pages_blocks_promo_banner" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_promo_banner" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_icon_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_icon_grid" ADD COLUMN "variant" "enum__pages_v_blocks_icon_grid_variant" DEFAULT 'tinted';
  ALTER TABLE "_pages_v_blocks_promo_banner" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_promo_banner" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_promo_banner" ADD CONSTRAINT "pages_blocks_promo_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_banner" ADD CONSTRAINT "_pages_v_blocks_promo_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_promo_banner_image_idx" ON "pages_blocks_promo_banner" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_promo_banner_image_idx" ON "_pages_v_blocks_promo_banner" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_promo_banner" DROP CONSTRAINT "pages_blocks_promo_banner_image_id_media_id_fk";

  ALTER TABLE "_pages_v_blocks_promo_banner" DROP CONSTRAINT "_pages_v_blocks_promo_banner_image_id_media_id_fk";

  DROP INDEX "pages_blocks_promo_banner_image_idx";
  DROP INDEX "_pages_v_blocks_promo_banner_image_idx";
  ALTER TABLE "pages_blocks_icon_grid" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_icon_grid" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_promo_banner" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_promo_banner" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_icon_grid" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_icon_grid" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_promo_banner" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_promo_banner" DROP COLUMN "image_id";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_icon_grid_variant";`)
}
