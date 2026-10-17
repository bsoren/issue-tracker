This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Run with Docker

The app and MySQL use separate Compose projects and private environment files:

```bash
cp .env.app.example .env.app
cp .env.mysql.example .env.mysql
chmod 600 .env.app .env.mysql
```

Do not overwrite existing configuration files. Replace the example passwords and
fill in `NEXTAUTH_SECRET` and Google OAuth credentials. The base `compose.yaml`
runs locally without Traefik. Add `compose.traefik.yaml` for your VPS.

Keep these settings consistent:

| App (`.env.app`) | MySQL (`.env.mysql`) |
| --- | --- |
| `DATABASE_NAME` | `MYSQL_DATABASE` |
| `DATABASE_USER` | `MYSQL_USER` (not root) |
| `DATABASE_PASSWORD` | `MYSQL_PASSWORD` |
| `DATABASE_NETWORK` | `DATABASE_NETWORK` |

Set `DATABASE_HOST=mysql` and `DATABASE_PORT=3306` for the shared Docker network.
`PORT` is the app's internal container port; `APP_PORT` is the local host port.
The base file publishes the app on localhost and contains no Traefik labels or
proxy network. The example `NEXTAUTH_URL` expands to `http://localhost:${APP_PORT}`.
Configure Google's local OAuth callback as
`http://localhost:3000/api/auth/callback/google` (adjust for your `APP_PORT`).

For VPS deployment, set these values in `.env.app`:

| Setting | Example | Meaning |
| --- | --- | --- |
| `APP_DOMAIN` | `issue-tracker.example.com` | Full public hostname |
| `TRAEFIK_NETWORK` | `traefik` | Existing network joined by Traefik |
| `TRAEFIK_ENTRYPOINT` | `websecure` | Existing HTTPS entrypoint |
| `TRAEFIK_CERT_RESOLVER` | `letsencrypt` | Existing certificate resolver |

The Traefik overlay adds routing labels and the proxy network, removes the local
published port, and sets the app's `NEXTAUTH_URL` to `https://${APP_DOMAIN}`.
These routing settings are not required for local use.

Traefik must already run with its Docker provider enabled and the selected HTTPS
entrypoint and certificate resolver configured. Its Docker network must exist and
Traefik must be attached to it. Point `APP_DOMAIN` at your VPS in DNS and configure
Google's callback as `https://YOUR_APP_DOMAIN/api/auth/callback/google`.
Use Traefik's existing HTTP-to-HTTPS redirect if needed. Nginx and a separate
Certbot installation are unnecessary. Use Docker Compose 2.24.4 or newer for
the overlay's custom YAML merge tags.

Runtime settings come from the respective env files; the VPS overlay derives
`NEXTAUTH_URL` from `APP_DOMAIN`. Compose has
no fallback values; required routing, network, volume, and port settings fail
validation if missing. Always pass the matching `--env-file`: `env_file` injects
container settings, while `--env-file` also supplies Compose's routing and network
variables.

Start MySQL first and wait for its authenticated health check:

```bash
docker compose --env-file .env.mysql -f compose.mysql.yaml up -d --wait
```

Run locally and open `http://localhost:3000` (or your configured `APP_PORT`):

```bash
docker compose --env-file .env.app up --build -d
```

On your VPS, add the Traefik overlay instead:

```bash
docker compose --env-file .env.app -f compose.yaml -f compose.traefik.yaml up --build -d
```

If your Traefik container uses `network_mode: host` on a Linux VPS, use the
host-network overlay instead (do not combine the two Traefik overlays):

```bash
docker compose --env-file .env.app -f compose.yaml -f compose.traefik-host.yaml up --build -d
```

This selects the app's IP on `DATABASE_NETWORK` for Traefik's Docker provider.
The Linux host can reach that bridge network directly; no separate proxy network
or `TRAEFIK_NETWORK` setting is needed. The app and database keep their bridge
networking, and the app has no published host port. Keep the Docker provider,
HTTPS entrypoint, and certificate resolver enabled in your existing Traefik.
Use this same host overlay for subsequent updates, logs, and shutdown commands.

Open `https://YOUR_APP_DOMAIN` on the VPS. The one-shot `migrate` service applies
committed Prisma migrations before the app starts. It constructs its database URL
from `.env.app` and escapes credentials. The `DATABASE_URL` setting is for direct
Prisma CLI use. For local Next.js development outside Docker, copy the app example
to `.env` and adjust the database host, URL, port, and TLS settings for a reachable
database; the Compose database does not publish a host port.

For troubleshooting:

```bash
docker compose --env-file .env.app logs migrate app
docker compose --env-file .env.mysql -f compose.mysql.yaml logs mysql
```

Other containers can join the network named by `DATABASE_NETWORK` and connect to
`mysql:3306`. The database project creates this network; start it before dependent
apps. With the VPS overlay, only the web app joins Traefik's network, and
migration discovery is disabled. MySQL always has `traefik.enable=false` and
does not publish a database port.

The example sets `DATABASE_SSL=false` for the bundled database on the private
Docker network. Use verified TLS for remote or production database connections.
The private env files are excluded from Git and Docker images. Each container
receives only its project's env file.

MySQL stores data in the volume specified by `MYSQL_VOLUME_NAME`. The example
uses `mysql_data`; the shared network is `mysql_database`. All connected apps
must use that network name. To retain an existing database, keep its actual
volume name in `.env.mysql` (for example, `issue-tracker_mysql_data` from the
original setup). Changing the name selects different storage. Stop the old
MySQL container before reusing its volume.
Initialization settings create the database and user only on first startup;
editing `.env.mysql` does not update existing users or passwords. Rotate existing
credentials with SQL and then update affected apps.

For local use, after changing app settings, recreate its containers:

```bash
docker compose --env-file .env.app up -d --force-recreate
```

For VPS updates, logs, restarts, and shutdown, always include both files. Examples:

```bash
docker compose --env-file .env.app -f compose.yaml -f compose.traefik.yaml logs -f app
docker compose --env-file .env.app -f compose.yaml -f compose.traefik.yaml up --build -d --force-recreate
docker compose --env-file .env.app -f compose.yaml -f compose.traefik.yaml down
```

Stop the local app independently; stop MySQL after all apps using its network:

```bash
docker compose --env-file .env.app down
docker compose --env-file .env.mysql -f compose.mysql.yaml down
```

Data survives ordinary shutdown. Adding `--volumes` to the MySQL shutdown
permanently deletes its database data.

The app image runs as a non-root user and excludes the Prisma CLI; the migration
image includes it. Builds generate Prisma Client without loading env files.
Future `NEXT_PUBLIC_*` settings must be supplied at build time because Next.js
embeds them in browser bundles.
