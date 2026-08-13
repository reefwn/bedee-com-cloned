import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_corporate_inquiries_industry" AS ENUM('Agriculture', 'Manufacturing', 'Construction', 'Real Estate', 'Retail and Wholesale', 'Logistics', 'Hospitality and Tourism', 'Technology', 'Finance', 'Professional Services', 'Arts and Entertainment', 'Government and Public Administration', 'Consumer Goods', 'Healthcare', 'Avaition', 'Education', 'Insurance', 'Oil & Gas', 'Automotive', 'Others');
  CREATE TYPE "public"."enum_corporate_inquiries_company_size" AS ENUM('น้อยกว่า 50', '51-200', '201-500', '501-1,000', '> 1,000');
  CREATE TABLE "corporate_inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"industry" "enum_corporate_inquiries_industry" NOT NULL,
  	"company_size" "enum_corporate_inquiries_company_size" NOT NULL,
  	"message" varchar,
  	"honeypot" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "corporate_inquiries_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "corporate_inquiries_id" integer;
  ALTER TABLE "corporate_inquiries_texts" ADD CONSTRAINT "corporate_inquiries_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."corporate_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "corporate_inquiries_updated_at_idx" ON "corporate_inquiries" USING btree ("updated_at");
  CREATE INDEX "corporate_inquiries_created_at_idx" ON "corporate_inquiries" USING btree ("created_at");
  CREATE INDEX "corporate_inquiries_texts_order_parent" ON "corporate_inquiries_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_corporate_inquiries_fk" FOREIGN KEY ("corporate_inquiries_id") REFERENCES "public"."corporate_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_corporate_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("corporate_inquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "corporate_inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "corporate_inquiries_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "corporate_inquiries" CASCADE;
  DROP TABLE "corporate_inquiries_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_corporate_inquiries_fk";
  
  DROP INDEX "payload_locked_documents_rels_corporate_inquiries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "corporate_inquiries_id";
  DROP TYPE "public"."enum_corporate_inquiries_industry";
  DROP TYPE "public"."enum_corporate_inquiries_company_size";`)
}
