import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_steps_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "_pages_v_blocks_feature_steps_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "pages_blocks_feature_steps_items" ADD CONSTRAINT "pages_blocks_feature_steps_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_steps_items" ADD CONSTRAINT "_pages_v_blocks_feature_steps_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_feature_steps_items_icon_idx" ON "pages_blocks_feature_steps_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_feature_steps_items_icon_idx" ON "_pages_v_blocks_feature_steps_items" USING btree ("icon_id");
  ALTER TABLE "pages_blocks_feature_steps_items" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_feature_steps_items" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_feature_steps_items" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_feature_steps_items" DROP COLUMN "link_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_steps_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_feature_steps_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_feature_steps_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_feature_steps_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_feature_steps_items" DROP CONSTRAINT "pages_blocks_feature_steps_items_icon_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_feature_steps_items" DROP CONSTRAINT "_pages_v_blocks_feature_steps_items_icon_id_media_id_fk";
  DROP INDEX "pages_blocks_feature_steps_items_icon_idx";
  DROP INDEX "_pages_v_blocks_feature_steps_items_icon_idx";
  ALTER TABLE "pages_blocks_feature_steps_items" DROP COLUMN "icon_id";
  ALTER TABLE "_pages_v_blocks_feature_steps_items" DROP COLUMN "icon_id";`)
}
