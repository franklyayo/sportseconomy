# Nigeria Sports Aggregation Platform

A modern, high-performance web application designed to aggregate sports events, funding, facilities, talents, and organizational data across Nigeria. Built with a focus on speed, reliability, and edge-compatibility.

## Technology Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **Database**: [Neon (Serverless Postgres)](https://neon.tech/)
- **ORM**: [Prisma v7](https://www.prisma.io/)
- **Driver Adapter**: `@prisma/adapter-neon` with `@neondatabase/serverless`
- **Styling**: Modern CSS modules & Vanilla CSS

## Local Development

### Prerequisites
- Node.js (v20+ recommended)
- A Neon Postgres database
- A Neon Auth project

### Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory and add your Neon credentials:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
   NEXT_PUBLIC_NEON_AUTH_URL="https://<auth-host>/auth"
   NEON_JWKS_URL="https://<auth-host>/auth/.well-known/jwks.json"
   ```
3. Generate the Prisma Client (this runs automatically via the `postinstall` hook, but can be run manually):
   ```bash
   npx prisma generate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technical Architecture & Vercel Deployment

This project uses modern edge-compatible architectures to deploy cleanly to Vercel without typical serverless Node.js bottlenecks.

### Known Deployment Hurdles & Implemented Solutions

During the migration to Next.js 16 (Turbopack) and Prisma v7, several specific deployment errors on Vercel were encountered and permanently resolved:

#### 1. Turbopack Native Module Crashes (`externalRequire` Errors)
**Symptom:** Next.js Turbopack crashing during the build phase with `Context.externalRequire` stack traces.
**Cause:** The standard `pg` driver relies on native Node.js C++ bindings which can confuse modern serverless bundlers during static module evaluation.
**Solution:** Migrated the database connection from `pg` to `@neondatabase/serverless` via `@prisma/adapter-neon`. Additionally, explicitly opted-out native packages from Turbopack bundling by adding `serverExternalPackages: ['ws', 'pg', '@neondatabase/serverless']` to `next.config.mjs`.

#### 2. Build-Time Database Connections (`esmImport` / `Failed to collect page data`)
**Symptom:** Vercel build fails precisely on the first API route (e.g., `/api/events/register`) with a `Context.esmImport` module evaluation crash.
**Cause:** Next.js aggressively imports Route Handlers during the static "page data collection" phase. If `src/lib/prisma.js` unconditionally initializes the database connection (`new Pool()`) at the top level, it crashes because the Vercel build environment lacks the active runtime database connection.
**Solution:** Implemented **Lazy Initialization via a JavaScript Proxy**. The PrismaClient is now wrapped in a Proxy in `src/lib/prisma.js`, guaranteeing that the client and database pool are completely deferred and only instantiated on the very first real database query, safely bypassing static build evaluation.

#### 3. Missing Prisma Client in Vercel Environments
**Symptom:** "PrismaClient is unable to run in this environment" or silent crashes during Next.js compilation.
**Cause:** Vercel's automatic Prisma detection occasionally fails with Next.js Turbopack or Prisma v7, skipping the vital client generation step after installing `node_modules`.
**Solution:** Added `"postinstall": "prisma generate"` to `package.json` scripts, hard-enforcing that the Prisma client is built into the node cache immediately after dependencies are installed.

#### 4. Next.js 16 Middleware Deprecation
**Symptom:** Warning: `The "middleware" file convention is deprecated. Please use "proxy" instead.`
**Solution:** Migrated `src/middleware.js` to `src/proxy.js` and updated the export from `export function middleware` to `export default function proxy` in compliance with Next.js 16 conventions.

---

### Project Structure
- `src/app/`: Next.js 16 App Router pages and API routes (Route Handlers).
- `src/lib/`: Shared utilities, including the Proxy-wrapped Prisma database client.
- `src/proxy.js`: Edge-compatible proxy handling route protection and session verification.
- `prisma/`: Database schema and migrations.
