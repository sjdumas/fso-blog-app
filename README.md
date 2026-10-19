# Full Stack Open: Next.js

This repository contains my work for the [Next.js](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs) section of the Full Stack Open course.

It is a small blog app built with Next.js and TypeScript. You can browse a list of sample blogs, open a blog to see its details, and submit a form to add a blog.

## Live Demo

Visit the app at [https://fso-blog-app-xi.vercel.app/](https://fso-blog-app-xi.vercel.app/).

## Features

- Home page with navigation to the blog list
- Blog list with links to individual blog pages
- Form for adding a blog with a title, author, and URL
- New blogs start with zero likes

## Run Locally

### Requirements

- Node.js 20.9 or later
- npm

### Setup

Clone the repository, then run these commands from the project directory:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Visit `/blogs` to browse blogs or create one.

## Data Storage

The app currently uses sample blog data stored in memory; it does not use a database. Blogs added while the app is running are temporary and are lost when the server restarts. The sample data is defined in `lib/blogs.ts`.

## Useful commands

```bash
npm run lint
npm run build
npm start
```

`npm start` runs the production build, so run `npm run build` first.
