import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_promo_banner_icon_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_banner_icon_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_promo_banner" ADD COLUMN "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_promo_banner" ADD COLUMN "subheading" varchar;
  ALTER TABLE "pages_blocks_promo_banner_icon_items" ADD CONSTRAINT "pages_blocks_promo_banner_icon_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_banner_icon_items" ADD CONSTRAINT "pages_blocks_promo_banner_icon_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_banner_icon_items" ADD CONSTRAINT "_pages_v_blocks_promo_banner_icon_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_banner_icon_items" ADD CONSTRAINT "_pages_v_blocks_promo_banner_icon_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promo_banner"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_promo_banner_icon_items_order_idx" ON "pages_blocks_promo_banner_icon_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_banner_icon_items_parent_id_idx" ON "pages_blocks_promo_banner_icon_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_banner_icon_items_locale_idx" ON "pages_blocks_promo_banner_icon_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promo_banner_icon_items_icon_idx" ON "pages_blocks_promo_banner_icon_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_promo_banner_icon_items_order_idx" ON "_pages_v_blocks_promo_banner_icon_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_banner_icon_items_parent_id_idx" ON "_pages_v_blocks_promo_banner_icon_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_banner_icon_items_locale_idx" ON "_pages_v_blocks_promo_banner_icon_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promo_banner_icon_items_icon_idx" ON "_pages_v_blocks_promo_banner_icon_items" USING btree ("icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_promo_banner_icon_items" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_banner_icon_items" CASCADE;
  ALTER TABLE "pages_blocks_promo_banner" DROP COLUMN "subheading";
  ALTER TABLE "_pages_v_blocks_promo_banner" DROP COLUMN "subheading";`)
}
