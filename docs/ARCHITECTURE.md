# Architecture Notes

This project is currently a feature-rich product prototype with a large backend entrypoint. It is functional and demonstrates an end-to-end business suite experience, but it is still best described as a monolithic app with multiple business modules embedded in one file.

## Current shape

- `server.ts` acts as the central application file.
- API routes are defined directly in the same file.
- Many modules are bundled into the same runtime: billing, analytics, AI assistant modules, reviews, CRM, voice flows, and orchestration.
- The frontend build is configured via Vite and a PWA plugin.

## Recommended long-term structure

A cleaner production layout would look like this:

```text
.
├── app/
│   ├── routes/
│   │   ├── billing.ts
│   │   ├── analytics.ts
│   │   ├── ai.ts
│   │   └── crm.ts
│   ├── services/
│   │   ├── gemini.ts
│   │   ├── billing.ts
│   │   ├── seo.ts
│   │   └─�� leads.ts
│   ├── utils/
│   │   ├── env.ts
│   │   ├── validation.ts
│   │   └── logger.ts
│   └── types/
│       ├── billing.ts
│       └── business.ts
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
├── public/
├── server.ts
├── package.json
├── README.md
├── LICENSE
└── .env.example
```

## Why this matters

- easier onboarding for contributors
- clearer ownership of business features
- safer testing and debugging
- simpler deployment and maintenance
- easier scaling into real microservices or modules

## Current state vs. target state

### Current state

- product demo is rich and feature-driven
- fast to explore and iterate
- monolithic structure is acceptable for prototype stage

### Target state

- modular routes for each product domain
- contract-driven APIs
- shared domain services for billing, CRM, and AI flows
- test coverage for business-critical functionality

## Next milestone

Before taking this beyond a prototype, the best next refactor is to separate:

1. business routes
2. AI wrapper logic
3. billing and subscription logic
4. customer lead workflows
5. analytics and reporting modules

That will make the app much easier to document, test, and scale.
