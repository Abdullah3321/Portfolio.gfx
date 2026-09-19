# PostgreSQL setup

The application uses Prisma with a hosted PostgreSQL provider such as [Neon](https://neon.tech). Neon hosts the database; the Next.js application connects through `DATABASE_URL`.

1. Create a Neon project and database.
2. Copy Neon's pooled connection string into `.env.local` as `DATABASE_URL`.
3. Run `npm run db:migrate` to apply the existing SQL baseline, then run `npm run db:generate`.
4. For future schema changes, update `prisma/schema.prisma`, create a reviewed migration with `npx prisma migrate dev --name <change>`, and deploy it with `npx prisma migrate deploy`.
5. Add the same variables to Hostinger's application environment settings.
6. Deploy the application and verify `/admin` after the API/auth layer is enabled.

Prisma reuses one client per Node.js process in development and is configured for server-side use. Use Neon's pooled connection URL for runtime traffic and the direct/unpooled URL for migration commands when Neon provides both.

Required production variables:

```env
DATABASE_URL=postgresql://...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=scrypt:salt:derived-key
ADMIN_SESSION_SECRET=at-least-32-random-characters
```

Never put the plain password or connection string in source control. Keep automated backups enabled in Neon. For an additional backup, run `pg_dump` on a scheduled machine and store encrypted dumps outside the web server.
