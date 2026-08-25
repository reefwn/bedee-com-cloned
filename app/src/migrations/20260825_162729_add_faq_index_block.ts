import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_faq_index_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_index_priority_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"category_index" numeric,
  	"item_index" numeric
  );
  
  CREATE TABLE "pages_blocks_faq_index_categories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_index_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"safety_notice" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_index_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_index_priority_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"category_index" numeric,
  	"item_index" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_index_categories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_index_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"safety_notice" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_faq_index_quick_links" ADD CONSTRAINT "pages_blocks_faq_index_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_index_priority_questions" ADD CONSTRAINT "pages_blocks_faq_index_priority_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_index_categories_items" ADD CONSTRAINT "pages_blocks_faq_index_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_index_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_index_categories" ADD CONSTRAINT "pages_blocks_faq_index_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_index" ADD CONSTRAINT "pages_blocks_faq_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_index_quick_links" ADD CONSTRAINT "_pages_v_blocks_faq_index_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_index_priority_questions" ADD CONSTRAINT "_pages_v_blocks_faq_index_priority_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_index_categories_items" ADD CONSTRAINT "_pages_v_blocks_faq_index_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_index_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_index_categories" ADD CONSTRAINT "_pages_v_blocks_faq_index_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_index" ADD CONSTRAINT "_pages_v_blocks_faq_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_faq_index_quick_links_order_idx" ON "pages_blocks_faq_index_quick_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_index_quick_links_parent_id_idx" ON "pages_blocks_faq_index_quick_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_index_quick_links_locale_idx" ON "pages_blocks_faq_index_quick_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_index_priority_questions_order_idx" ON "pages_blocks_faq_index_priority_questions" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_index_priority_questions_parent_id_idx" ON "pages_blocks_faq_index_priority_questions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_index_priority_questions_locale_idx" ON "pages_blocks_faq_index_priority_questions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_index_categories_items_order_idx" ON "pages_blocks_faq_index_categories_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_index_categories_items_parent_id_idx" ON "pages_blocks_faq_index_categories_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_index_categories_items_locale_idx" ON "pages_blocks_faq_index_categories_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_index_categories_order_idx" ON "pages_blocks_faq_index_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_index_categories_parent_id_idx" ON "pages_blocks_faq_index_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_index_categories_locale_idx" ON "pages_blocks_faq_index_categories" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_index_order_idx" ON "pages_blocks_faq_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_index_parent_id_idx" ON "pages_blocks_faq_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_index_path_idx" ON "pages_blocks_faq_index" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_index_locale_idx" ON "pages_blocks_faq_index" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_index_quick_links_order_idx" ON "_pages_v_blocks_faq_index_quick_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_index_quick_links_parent_id_idx" ON "_pages_v_blocks_faq_index_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_index_quick_links_locale_idx" ON "_pages_v_blocks_faq_index_quick_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_index_priority_questions_order_idx" ON "_pages_v_blocks_faq_index_priority_questions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_index_priority_questions_parent_id_idx" ON "_pages_v_blocks_faq_index_priority_questions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_index_priority_questions_locale_idx" ON "_pages_v_blocks_faq_index_priority_questions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_index_categories_items_order_idx" ON "_pages_v_blocks_faq_index_categories_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_index_categories_items_parent_id_idx" ON "_pages_v_blocks_faq_index_categories_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_index_categories_items_locale_idx" ON "_pages_v_blocks_faq_index_categories_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_index_categories_order_idx" ON "_pages_v_blocks_faq_index_categories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_index_categories_parent_id_idx" ON "_pages_v_blocks_faq_index_categories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_index_categories_locale_idx" ON "_pages_v_blocks_faq_index_categories" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_index_order_idx" ON "_pages_v_blocks_faq_index" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_index_parent_id_idx" ON "_pages_v_blocks_faq_index" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_index_path_idx" ON "_pages_v_blocks_faq_index" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_index_locale_idx" ON "_pages_v_blocks_faq_index" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_faq_index_quick_links" CASCADE;
  DROP TABLE "pages_blocks_faq_index_priority_questions" CASCADE;
  DROP TABLE "pages_blocks_faq_index_categories_items" CASCADE;
  DROP TABLE "pages_blocks_faq_index_categories" CASCADE;
  DROP TABLE "pages_blocks_faq_index" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_index_quick_links" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_index_priority_questions" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_index_categories_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_index_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_index" CASCADE;`)
}
