# yourbeep backend

Bun-based microservices scaffold for the API described in [api.md](./api.md).

## Docs

- [Admin Course Creation Guide](./docs/admin-course-creation-guide.md)
- [Game Flow Guide](./docs/game-flow-guide.md)
- [Payment Flow Guide](./docs/payment-flow-guide.md)
- [Stripe Pricing Setup Guide](./docs/stripe-pricing-setup-guide.md)
- [Production Cost Plan](./docs/production-cost-plan.md)
- OpenAPI JSON: `GET /openapi.json`
- Swagger UI: `GET /docs`

## What is in place

- Bun workspace with 4 apps:
  - `apps/gateway`
  - `apps/identity`
  - `apps/content`
  - `apps/commerce`
- Shared package for env loading, error envelopes, auth helpers, logging, validation, and Mongo bootstrap
- API gateway request routing and auth/header injection
- Identity service first working slice:
  - `POST /auth/sync`
  - `GET /auth/me`
  - `DELETE /auth/account`
  - `GET/PATCH /users/me`
  - `GET /users/me/stats`
  - `GET /users/me/dashboard`
  - FCM token register/remove stubs
  - admin user list/detail/role/delete/restore
  - internal user lookup routes
- Starter Content and Commerce services with health and placeholder endpoints

## Run locally

1. Copy `.env.example` to `.env`
2. Start MongoDB locally
3. Install dependencies:

```bash
bun install
```

4. Run services in separate terminals:

```bash
bun run gateway
bun run identity
bun run content
bun run commerce
```

## Run with Docker

1. Copy `.env.example` to `.env`
2. Make sure your Firebase credentials are set through:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
3. Start the stack:

```bash
docker compose up --build
```

This starts:
- MongoDB on `27017`
- Gateway on `4000`
- Identity on `4001`
- Content on `4002`
- Commerce on `4003`

Inside Docker, the services automatically talk to each other over the Compose network, and MongoDB uses the `mongo` hostname instead of `localhost`.

This compose file is for local development convenience. In production, you can
use Atlas or another external MongoDB provider instead of the bundled `mongo`
container.

To stop everything:

```bash
docker compose down
```

To stop and remove Mongo data too:

```bash
docker compose down -v
```

## Run in production with Atlas

If you are using MongoDB Atlas in production, use the image-based compose file:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Requirements:

- `MONGODB_URI_IDENTITY` must point to your Atlas identity database
- `MONGODB_URI_CONTENT` must point to your Atlas content database
- `MONGODB_URI_COMMERCE` must point to your Atlas commerce database

This production compose file does not start a local `mongo` container.

## Firebase setup

Set these in `.env` from your Firebase service account:

```text
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Or more simply, point to the Firebase service account JSON file:

```text
FIREBASE_SERVICE_ACCOUNT_PATH=../your-service-account.json
```

Clients should send a real Firebase ID token:

```text
Authorization: Bearer <firebase_id_token>
```

To bootstrap admin access for the web admin panel, add the allowed admin email(s) to `.env`:

```text
ADMIN_EMAIL_ALLOWLIST=admin@yourbeep.com,another-admin@yourbeep.com
```

When a Firebase-authenticated user on this allowlist calls `POST /auth/sync`, Identity will automatically store or upgrade that user with `role: "admin"`.

## Stripe setup

Set these in `.env` for Commerce:

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

The backend now uses real Stripe Checkout Sessions for course purchases and renewals, verifies webhook signatures on `POST /webhooks/stripe`, and issues real refunds from the admin refund endpoint.

## GitHub Actions deployment

There is a production workflow at:

```text
../.github/workflows/deploy-production.yml
```

It builds and pushes four Docker images from this backend:

- `gateway`
- `identity`
- `content`
- `commerce`

Image repository and tag convention:

```text
<DOCKERHUB_USERNAME>/yourbeep:gateway-<sha>
<DOCKERHUB_USERNAME>/yourbeep:identity-<sha>
<DOCKERHUB_USERNAME>/yourbeep:content-<sha>
<DOCKERHUB_USERNAME>/yourbeep:commerce-<sha>
```

It can also clone and update an ops repo manifest with the new `github.sha` tags.

Required GitHub secrets:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
YOURBEEP_PAT
```

The workflow is currently configured to update this ops repo directly:

```text
chemic07/yourbeep_ops
```
