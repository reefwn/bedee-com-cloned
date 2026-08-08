import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_promotion_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promotion_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "promotions_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "promotions_id" integer;
  ALTER TABLE "pages_blocks_promotion_grid" ADD CONSTRAINT "pages_blocks_promotion_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promotion_grid" ADD CONSTRAINT "_pages_v_blocks_promotion_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_promotion_grid_order_idx" ON "pages_blocks_promotion_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_promotion_grid_parent_id_idx" ON "pages_blocks_promotion_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promotion_grid_path_idx" ON "pages_blocks_promotion_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_promotion_grid_locale_idx" ON "pages_blocks_promotion_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promotion_grid_order_idx" ON "_pages_v_blocks_promotion_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promotion_grid_parent_id_idx" ON "_pages_v_blocks_promotion_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promotion_grid_path_idx" ON "_pages_v_blocks_promotion_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promotion_grid_locale_idx" ON "_pages_v_blocks_promotion_grid" USING btree ("_locale");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_promotions_id_idx" ON "pages_rels" USING btree ("promotions_id","locale");
  CREATE INDEX "_pages_v_rels_promotions_id_idx" ON "_pages_v_rels" USING btree ("promotions_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_promotion_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_promotion_grid" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_promotion_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_promotion_grid" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_promotions_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_promotions_fk";
  
  DROP INDEX "pages_rels_promotions_id_idx";
  DROP INDEX "_pages_v_rels_promotions_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "promotions_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "promotions_id";`)
}
