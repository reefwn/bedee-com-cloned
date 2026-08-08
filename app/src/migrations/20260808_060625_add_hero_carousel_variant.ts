import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_carousel_variant" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_carousel_variant" AS ENUM('dark', 'light');
  ALTER TABLE "pages_blocks_hero_carousel" ADD COLUMN "variant" "enum_pages_blocks_hero_carousel_variant" DEFAULT 'dark';
  ALTER TABLE "_pages_v_blocks_hero_carousel" ADD COLUMN "variant" "enum__pages_v_blocks_hero_carousel_variant" DEFAULT 'dark';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_carousel" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_hero_carousel" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_hero_carousel_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_carousel_variant";`)
}
