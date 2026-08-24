import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_promo_banner_variant" AS ENUM('tinted', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_article_grid_variant" AS ENUM('tinted', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_promo_banner_variant" AS ENUM('tinted', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_article_grid_variant" AS ENUM('tinted', 'plain');
  ALTER TABLE "pages_blocks_promo_banner" ADD COLUMN "variant" "enum_pages_blocks_promo_banner_variant" DEFAULT 'tinted';
  ALTER TABLE "pages_blocks_article_grid" ADD COLUMN "variant" "enum_pages_blocks_article_grid_variant" DEFAULT 'plain';
  ALTER TABLE "_pages_v_blocks_promo_banner" ADD COLUMN "variant" "enum__pages_v_blocks_promo_banner_variant" DEFAULT 'tinted';
  ALTER TABLE "_pages_v_blocks_article_grid" ADD COLUMN "variant" "enum__pages_v_blocks_article_grid_variant" DEFAULT 'plain';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_promo_banner" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_article_grid" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_promo_banner" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_article_grid" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_promo_banner_variant";
  DROP TYPE "public"."enum_pages_blocks_article_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_promo_banner_variant";
  DROP TYPE "public"."enum__pages_v_blocks_article_grid_variant";`)
}
