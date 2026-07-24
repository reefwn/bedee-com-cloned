# Required environment variables

Create a local `.env` file (never commit it) with:

```
# Postgres connection string (pooled, port 6543) — get from Supabase dashboard:
# Project Settings > Database > Connection string > Connection pooling > URI
# Project ref: fzxcitvbkfemjdhzjcib (bedee-payload, ap-southeast-1)
DATABASE_URI=postgresql://postgres.fzxcitvbkfemjdhzjcib:[YOUR-DB-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Generate with: openssl rand -hex 32 — never reuse across environments
PAYLOAD_SECRET=

# Vercel Blob storage token (Vercel dashboard > Storage > create Blob store)
BLOB_READ_WRITE_TOKEN=

NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

The Supabase DB password is never exposed via MCP tooling (by design) — get it
from the Supabase dashboard yourself: Project Settings > Database > Reset
database password if you don't have it, then use the "Connection pooling"
URI (port 6543, not 5432 — Vercel's serverless functions need the pooled
connection, the direct one exhausts Postgres's connection limit fast).

Set the same three vars (`DATABASE_URI`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`)
in Vercel: Project Settings > Environment Variables, for both Production and
Preview environments.

## One-time: create the database schema

Vercel's serverless filesystem is read-only, so Payload's `push` schema-sync
does not work there. Run this once, locally, against the real database (use
the exact same three env var values you set in Vercel):

```bash
cd app
DATABASE_URI="<paste pooled connection string>" \
PAYLOAD_SECRET="<same value as in Vercel>" \
BLOB_READ_WRITE_TOKEN="<same value as in Vercel>" \
npx payload migrate:create initial

DATABASE_URI="<paste pooled connection string>" \
PAYLOAD_SECRET="<same value as in Vercel>" \
BLOB_READ_WRITE_TOKEN="<same value as in Vercel>" \
npx payload migrate
```

Commit the generated `src/migrations/` files afterward — they're the schema
history and let future deploys run `payload migrate` cleanly instead of
guessing at schema state.
