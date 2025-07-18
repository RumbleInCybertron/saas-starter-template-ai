# Taxonomy

An open source application built using the new router, server components and everything new in Next.js 13.

> **Warning**
> This app is a work in progress. I'm building this in public. You can follow the progress on Twitter [@shadcn](https://twitter.com/shadcn).
> See the roadmap below.

## About this project

This project as an experiment to see how a modern app (with features like authentication, subscriptions, API routes, static pages for docs ...etc) would work in Next.js 13 and server components.

**This is not a starter template.**

A few people have asked me to turn this into a starter. I think we could do that once the new features are out of beta.

## Note on Performance

> **Warning**
> This app is using the unstable releases for Next.js 13 and React 18. The new router and app dir is still in beta and not production-ready.
> **Expect some performance hits when testing the dashboard**.
> If you see something broken, you can ping me [@shadcn](https://twitter.com/shadcn).

## Features

- New `/app` dir,
- Routing, Layouts, Nested Layouts and Layout Groups
- Data Fetching, Caching and Mutation
- Loading UI
- Route handlers
- Metadata files
- Server and Client Components
- API Routes and Middlewares
- Authentication using **NextAuth.js**
- ORM using **Prisma**
- Database on **PlanetScale**
- UI Components built using **Radix UI**
- Documentation and blog using **MDX** and **Contentlayer**
- Subscriptions using **Stripe**
- Styled using **Tailwind CSS**
- Validations using **Zod**
- Written in **TypeScript**

## Roadmap

- [x] ~Add MDX support for basic pages~
- [x] ~Build marketing pages~
- [x] ~Subscriptions using Stripe~
- [x] ~Responsive styles~
- [x] ~Add OG image for blog using @vercel/og~
- [x] Dark mode

## Known Issues

A list of things not working right now:

1. ~GitHub authentication (use email)~
2. ~[Prisma: Error: ENOENT: no such file or directory, open '/var/task/.next/server/chunks/schema.prisma'](https://github.com/prisma/prisma/issues/16117)~
3. ~[Next.js 13: Client side navigation does not update head](https://github.com/vercel/next.js/issues/42414)~
4. [Cannot use opengraph-image.tsx inside catch-all routes](https://github.com/vercel/next.js/issues/48162)

## Why not tRPC, Turborepo or X?

I might add this later. For now, I want to see how far we can get using Next.js only.

If you have some suggestions, feel free to create an issue.

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Start the development server:

```sh
pnpm dev
```

## License

Licensed under the [MIT license](https://github.com/shadcn/taxonomy/blob/main/LICENSE.md).

🧾 Stripe Webhook Setup

This app uses Stripe webhooks to handle events like checkout.session.completed, invoice.paid, and more. Follow the appropriate instructions below depending on your environment:
🧪 Local Development (Test Mode)

    Install the Stripe CLI (if not already):
    https://stripe.com/docs/stripe-cli

    Start your dev server:

pnpm dev

In a new terminal, run:

stripe listen --forward-to localhost:3000/api/webhook

The CLI will display a webhook secret that looks like:

whsec_abc123...

Copy that value into your .env.local:

STRIPE_WEBHOOK_SECRET=whsec_abc123...

Trigger a test event (optional):

    stripe trigger checkout.session.completed

    Your local /api/webhook endpoint will receive and handle the event.

    ⚠️ Note: This webhook secret changes every time you restart the Stripe CLI. Make sure to update your .env.local with the latest value if needed.

🚀 Production or Staging Setup

    Go to your Stripe Dashboard → Webhooks

    Click “Create an event destination”

    Set the endpoint URL to:

https://yourdomain.com/api/webhook

Select the events to listen for, such as:

    checkout.session.completed

    invoice.paid

    invoice.payment_failed

    customer.subscription.created

    customer.subscription.updated

    customer.subscription.deleted

After saving, Stripe will show a signing secret (starts with whsec_...)

Add it to your production environment as:

    STRIPE_WEBHOOK_SECRET=whsec_your_permanent_secret

    ✅ This webhook secret remains the same unless manually rotated, making it ideal for long-term use.