# Production backups

Backups must be scheduled outside the Next.js process. Use Hostinger's PostgreSQL backup facility if it is included in your plan, or run `pg_dump` from a scheduled server/CI job.

Example:

```bash
pg_dump "$DATABASE_URL" --format=custom --file="backup-$(date +%F).dump"
```

Keep encrypted backups in a separate provider, retain daily backups for 14 days and monthly backups for 12 months, and perform a restore test at least monthly. Never store backups in `public/` or commit them to Git.
