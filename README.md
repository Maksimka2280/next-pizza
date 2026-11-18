# Next Pizza

> **Your next favorite pizza is just a few clicks away.**

A full-stack pizza ordering platform built with Next.js and TypeScript, featuring a product catalog, shopping cart, secure checkout, user accounts, and admin product management.

Browse the menu, customize your order, save favorites, and manage products from an admin account.

## Features

- Browse products by category and filter the catalog by ingredients
- Choose pizza sizes and crust types, and add extra ingredients
- Manage a shopping cart and place orders through the checkout flow
- Create an account, sign in, and manage profile details
- Save products to a personal favorites list
- Manage products with an admin interface and live preview
- Switch between light and dark themes
- Responsive layout for mobile and desktop

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL, Prisma 7
- **Authentication:** NextAuth.js
- **UI:** Base UI, Lucide icons

## Getting started

### Prerequisites

- Node.js and npm
- A PostgreSQL database
- AgentMail credentials for email verification flows

### Installation

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Maksimka2280/next-pizza.git
   cd next-pizza
   npm install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="replace-with-a-long-random-secret"
   AGENTMAIL_API_KEY="your-agentmail-api-key"
   AGENTMAIL_INBOX_ID="your-agentmail-inbox-id"
   ```

   Replace the example values with credentials for your local database and AgentMail account. Keep `.env` private and never commit real credentials.

3. Generate the Prisma client and sync the database schema:

   ```bash
   npx prisma generate
   npm run prisma:push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:push` | Sync the Prisma schema with the database |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:seed` | Reset and populate the database with sample data |
| `npm run storybook` | Start Storybook |

> **Warning:** The seed script truncates existing application data before inserting sample records. Use it only with a disposable development database.

## Project structure

```text
src/
  app/                 Next.js routes, pages, and API endpoints
  auth.ts              NextAuth configuration
shared/
  components/          UI, catalog, checkout, and profile components
  hooks/               Client-side hooks
  service/             API clients and data services
prisma/
  schema.prisma        Database schema
  seed.ts              Development seed data
```

## License

No license has been specified for this project.
