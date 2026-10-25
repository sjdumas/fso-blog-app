# Full Stack Open: Next.js

![End-to-End Tests](https://github.com/sjdumas/fso-blog-app/actions/workflows/playwright.yml/badge.svg)

This repository contains my work for the [Next.js](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs) section of the Full Stack Open course.

It is a blog app built with Next.js and TypeScript. Users can register, log in, share blogs, like them, save them to a personal reading list, and generate an API token for accessing their data.

## Live Demo

Visit the app at [https://fso-blog-app-xi.vercel.app/](https://fso-blog-app-xi.vercel.app/).

## Features

- Homepage written in MDX
- Account registration, login, and logout with Auth.js credentials and bcrypt-hashed passwords
- Blog list sorted by likes, with search by title
- Blog pages with a like button and a button for saving the blog to your reading list
- Form for adding a blog with a title, author, and URL (logged-in users only)
- New blogs start with zero likes and are added to the creator's reading list
- User list and user pages showing the blogs each user has added
- Personal page (`/me`) with a reading list grouped by read status and a "mark as read" button
- API token generation for a token-authenticated API route

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router, Server Actions, Cache Components) and React 19
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4
- PostgreSQL on [Neon](https://neon.tech/), accessed with [Drizzle ORM](https://orm.drizzle.team/)
- [Auth.js](https://authjs.dev/) (NextAuth v5) for authentication
- [Playwright](https://playwright.dev/) for end-to-end tests, run in GitHub Actions

## Routes

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/blogs` | Blog list with search (`/blogs?filter=...`) |
| `/blogs/new` | Form for adding a blog (requires login) |
| `/blogs/[id]` | Blog details, likes, and reading list button |
| `/users` | User list |
| `/users/[username]` | A user's added blogs |
| `/register` | Registration form |
| `/login` | Login form |
| `/me` | Reading list and API token (requires login) |

### API

| Endpoint | Description |
| --- | --- |
| `GET /api/me` | Returns the user that owns the given API token |
| `DELETE /api/testing/reset` | Empties the database (disabled in production) |
| `POST /api/testing/users` | Creates a user from `username`, `name`, and `password` (disabled in production) |

To call `/api/me`, generate a token on the `/me` page and send it as a bearer token:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/me
```

## Run Locally

### Requirements

- Node.js 20.9 or later
- npm
- A PostgreSQL database, for example a free [Neon](https://neon.tech/) project

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/sjdumas/fso-blog-app.git
   cd fso-blog-app
   npm ci
   ```

2. Create a `.env.local` file in the project directory:

   ```bash
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   AUTH_SECRET=your-random-secret
   AUTH_TRUST_HOST=true
   ```

   You can generate a value for `AUTH_SECRET` with `openssl rand -base64 32`.

   `AUTH_TRUST_HOST=true` is only needed for running the production build locally with `npm start`. Vercel is trusted automatically.

3. Create the database tables:

   ```bash
   npm run db:migrate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser, then register an account to start adding blogs.

## Database

The schema is defined in `db/schema.ts` and has three tables: `users`, `blogs`, and `reading_list`. Migrations are stored in the `drizzle` directory.

After changing the schema, generate a new migration and apply it:

```bash
npm run db:generate
npm run db:migrate
```

Drizzle Kit reads `.env.local` by default, and `.env.test` when `NODE_ENV=test` or `CI` is set.

To hash a password manually, for example when adding a user directly to the database, run:

```bash
node scripts/hash-password.mjs <password>
```

## Testing

The end-to-end tests are in the `tests` directory and cover authentication, navigation, blogs, and the `/me` page.

Install the Playwright browser once, then run the tests:

```bash
npx playwright install chromium
npm run test:e2e
```

Use `npm run test:e2e:ui` to open the Playwright UI. Playwright starts the development server automatically if one is not already running.

> [!WARNING]
> The tests reset the database before each test by calling `/api/testing/reset`, which deletes all users, blogs, and reading list entries. When run locally, the tests use the database in `.env.local`, so point it at a separate test database first.

### Continuous Integration

The [End-to-End Tests](.github/workflows/playwright.yml) workflow runs on pushes and pull requests to `main`. It creates a `.env.test` file from these repository secrets, applies the schema with `drizzle-kit push`, and runs the tests:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

The app reads its auth secret from `AUTH_SECRET`, or from `NEXTAUTH_SECRET` if that isn't set, so the same code works locally and in CI.

The HTML test report is uploaded as a workflow artifact.

## Useful Commands

```bash
npm run lint
npm run build
npm start
```

`npm start` runs the production build, so run `npm run build` first.
