import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_article_grid" ADD COLUMN "category_slug" varchar;
  ALTER TABLE "_pages_v_blocks_article_grid" ADD COLUMN "category_slug" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_article_grid" DROP COLUMN "category_slug";
  ALTER TABLE "_pages_v_blocks_article_grid" DROP COLUMN "category_slug";`)
}
