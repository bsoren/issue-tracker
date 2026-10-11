# Database connection pool timeout

## Error

```text
DriverAdapterError: pool timeout: failed to retrieve a connection from pool after 10002ms
(pool connections: active=0 idle=0 limit=5)

Cause: RSA public key is not available client side. Either set option
`cachingRsaPublicKey` to indicate public key path, or allow public key
retrieval with option `allowPublicKeyRetrieval`.
```

The error occurs when `app/issues/page.tsx` calls:

```ts
const issues = await prisma.issue.findMany();
```

## Cause

MySQL authentication is failing, which then causes the pool timeout. The driver cannot complete authentication without the server's RSA public key. No connections become usable (`active=0 idle=0`), so the query times out after 10 seconds.

Increasing the pool size or timeout will not fix the authentication failure.

This project uses `PrismaMariaDb`. Its connection configuration in `lib/prisma.ts` does not currently provide a public key or enable retrieval.

## Fix for a trusted local development database

1. Add `allowPublicKeyRetrieval: true` to the adapter in `lib/prisma.ts`:

   ```ts
   adapter: new PrismaMariaDb({
     host: process.env.DATABASE_HOST,
     user: process.env.DATABASE_USER,
     password: process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE_NAME,
     connectionLimit: 5,
     allowPublicKeyRetrieval: true,
   }),
   ```

   This allows the driver to request the authentication public key from MySQL. The option defaults to `false`. See [MariaDB connection options](https://mariadb.com/docs/connectors/mariadb-connector-nodejs/node-js-connection-options).

2. Fully restart the Next.js development server. Stop it with `Ctrl+C`, then run:

   ```bash
   npm run dev
   ```

   The project caches Prisma on `globalThis` during development. A full restart ensures the new adapter configuration is used.

3. Open `/issues` again. The existing `prisma.issue.findMany()` call should work once authentication succeeds. This connection-option change does not require a schema migration or regenerating Prisma Client.

## Remote or production databases

Configure verified TLS, or obtain the server's public key through a trusted channel and set this adapter option:

```ts
cachingRsaPublicKey: "/absolute/path/to/mysql-public-key.pem",
```

Automatically retrieving an unverified key over an untrusted connection can expose authentication to interception. See [MariaDB connection options](https://mariadb.com/docs/connectors/mariadb-connector-nodejs/node-js-connection-options).

## Environment configuration

The application reads `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_NAME` directly in `lib/prisma.ts`.

Changing only `DATABASE_URL` in `.env` will not change this adapter configuration. That URL is currently used by the Prisma CLI configuration in `prisma.config.ts`.

## Verification status

The connection setup was inspected when preparing this explanation. The application configuration was not modified, and the database connection was not tested.
