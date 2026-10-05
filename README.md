# Menuku

Menuku is a Next.js 15 App Router application using React 19, TypeScript, Supabase, Drizzle, and Tailwind CSS 4. The folder layout below is a project convention to keep route entry points small and place reusable product code by feature; it is not a Next.js requirement.

## Source layout

```text
src/
  app/            Next.js routes, layouts, metadata, loading/error UI, and API entry points
  components/
    ui/           Reusable interface primitives
    feedback/     Cross-feature loading and feedback UI
    brand/        Menuku brand elements
  features/
    admin/        Admin screens, actions, and queries
    auth/         Authentication screens and actions
    billing/      Plans, invoice data, payment reconciliation, and invoice email
    catalog/      Products, categories, and related actions
    dashboard/    Shared dashboard shell and motion
    marketing/    Landing page, sections, and marketing components
    onboarding/   Store setup flow
    stores/       Store profile, settings, publishing, and business links
    storefront/   Public store pages, display components, and analytics tracking
  i18n/           Locale configuration, options, messages, and locale hook
  lib/            Shared integrations and technical utilities
  config/         Site configuration and public URL helpers
  db/             Drizzle schema and optional Drizzle connection
```

The `@/*` import alias resolves to `src/*`. Next.js route conventions stay in `src/app`: keep `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, and `robots.ts` there. Move reusable feature implementation out of route files and into the matching `src/features/<feature>/` folder.

## Naming

- Use kebab-case for file and folder names, for example `product-form.tsx` and `invoice-data.ts`.
- Use PascalCase for React components and types, for example `StorefrontProduct` and `PendingInvoice`.
- Use camelCase for functions and variables, for example `buildWhatsAppUrl` and `getPendingInvoice`.
- Declare components, hooks, handlers, actions, queries, and helpers with `function` declarations. Short callbacks and wrappers such as `useCallback` or React `cache` may use arrows.
- Name Server Actions with the `Action` suffix. Name reads `get...` or `list...` so their purpose is clear.
- Use `useLocale` for the locale and locale setter, and `getMessages` to load translated messages.

## Server and client boundaries

- A file under `src/app` is a route entry point. Server Components are the default; add `"use client"` only to code that needs state, effects, browser APIs, or client event handlers.
- Keep credentials, privileged Supabase access, database connections, filesystem/network secrets, and server-only queries in server modules. Mark sensitive modules with `import "server-only"` to prevent accidental client imports.
- Put Server Actions in feature `actions/` files and mark those modules with `"use server"`. Validate all input and retain authentication, authorization, tenant scoping, redirects, and revalidation inside the action.
- Client components may import serializable types and browser-safe helpers from feature modules. Keep types and browser helpers separate from server query modules.
- Keep API handlers in `src/app/api/**/route.ts`; move shared payment, validation, and data logic into the owning feature.

## Adding a feature

1. Add its public route entry point under `src/app/` and keep route-specific metadata and Next.js loading/error files beside it.
2. Add implementation under `src/features/<feature>/`, with only the folders needed (`components/`, `actions/`, `queries/`, `schemas/`, `hooks/`, or `types.ts`). Avoid forwarding-only service or repository layers.
3. Use `src/components/ui/` for controls that are reusable across unrelated features, `src/components/feedback/` for shared feedback, and `src/components/brand/` for brand identity.
4. Put translations in a locale-specific JSON file under `src/i18n/messages/` and update the shared locale/message types when adding a locale.
5. Keep site-wide values in `src/config/`, common technical helpers in `src/lib/`, and Drizzle definitions in `src/db/`.
6. Check server/client imports and preserve existing URL, API, translation-storage, tenant, and database contracts. Run `npx tsc --noEmit`, `npm run build`, and `npm run lint` for a change that affects application code.

## Supabase and Drizzle

The application currently performs its request-time data access through the Supabase JavaScript clients in `src/lib/supabase/`. Drizzle schema declarations live in `src/db/schema.ts`, and `drizzle.config.ts` points Drizzle Kit at that file. `src/db/index.ts` provides an optional server-side Drizzle connection, but application features currently do not call it. SQL migrations are maintained under `supabase/migrations/`; keep schema/database changes separate from ordinary code-organization refactors.
