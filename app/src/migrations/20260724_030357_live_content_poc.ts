import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_rich_text_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "media" ADD COLUMN "source_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "source_url" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_source_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "source_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_source_url" varchar;
  ALTER TABLE "pages_blocks_rich_text_content" ADD CONSTRAINT "pages_blocks_rich_text_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_content" ADD CONSTRAINT "_pages_v_blocks_rich_text_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_content_order_idx" ON "pages_blocks_rich_text_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_content_parent_id_idx" ON "pages_blocks_rich_text_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_content_path_idx" ON "pages_blocks_rich_text_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_content_locale_idx" ON "pages_blocks_rich_text_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_rich_text_content_order_idx" ON "_pages_v_blocks_rich_text_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_content_parent_id_idx" ON "_pages_v_blocks_rich_text_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_content_path_idx" ON "_pages_v_blocks_rich_text_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_content_locale_idx" ON "_pages_v_blocks_rich_text_content" USING btree ("_locale");
  CREATE UNIQUE INDEX "media_source_url_idx" ON "media" USING btree ("source_url");
  CREATE UNIQUE INDEX "posts_source_url_idx" ON "posts" USING btree ("source_url");
  CREATE INDEX "_posts_v_version_version_source_url_idx" ON "_posts_v" USING btree ("version_source_url");
  CREATE UNIQUE INDEX "pages_source_url_idx" ON "pages" USING btree ("source_url");
  CREATE INDEX "_pages_v_version_version_source_url_idx" ON "_pages_v" USING btree ("version_source_url");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_text_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_content" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_rich_text_content" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_content" CASCADE;
  DROP INDEX "media_source_url_idx";
  DROP INDEX "posts_source_url_idx";
  DROP INDEX "_posts_v_version_version_source_url_idx";
  DROP INDEX "pages_source_url_idx";
  DROP INDEX "_pages_v_version_version_source_url_idx";
  ALTER TABLE "media" DROP COLUMN "source_url";
  ALTER TABLE "posts" DROP COLUMN "source_url";
  ALTER TABLE "_posts_v" DROP COLUMN "version_source_url";
  ALTER TABLE "pages" DROP COLUMN "source_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_source_url";`)
}
