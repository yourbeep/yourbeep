# Payment Flow Guide

This guide explains the complete payment flow for course purchases, renewals, promotions, Stripe webhooks, access checks, and admin refunds in the current YourBeep backend.

All examples assume requests go through the gateway at:

```text
http://localhost:4000/v1
```

User-side payment endpoints require:

```text
Authorization: Bearer <firebase_id_token>
```

## 1. What the Commerce Layer Owns

The Commerce service is responsible for:

- regional course pricing
- purchase initiation
- renewal initiation
- promotion preview and discount application
- Stripe Checkout session creation
- Stripe webhook verification and subscription sync
- course access checks
- refunds
- payment-related notifications

## 2. Required Environment Variables

These must be configured in `.env`:

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
INTERNAL_SERVICE_SECRET=...
```

Recommended for local webhook testing:

```bash
stripe listen --forward-to localhost:4000/v1/webhooks/stripe
```

Then copy the webhook signing secret Stripe prints into:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 3. High-Level Purchase Lifecycle

Normal purchase flow:

1. frontend checks pricing
2. frontend optionally previews a promotion
3. frontend initiates checkout
4. backend creates Stripe Checkout Session
5. user completes payment on Stripe
6. Stripe webhook updates purchase state
7. frontend optionally calls confirm endpoint
8. access becomes active
9. content/video/game access checks start succeeding

Renewal flow:

1. frontend checks existing access
2. frontend initiates renewal
3. Stripe checkout completes
4. webhook syncs updated subscription period
5. access continues or is reactivated

## 4. Pricing Flow

Pricing is configured per course and per region by admin.

### Admin configures pricing

```http
PUT /v1/admin/commerce/courses/:courseId/pricing
Content-Type: application/json
Authorization: Bearer <admin_firebase_token>
```

Example:

```json
{
  "region": "IN",
  "currency": "INR",
  "amount6mo": 4999,
  "amount1yr": 7999,
  "stripeProductId6mo": "prod_6mo_xxx",
  "stripeProductId1yr": "prod_1yr_xxx",
  "stripePriceId6mo": "price_6mo_xxx",
  "stripePriceId1yr": "price_1yr_xxx"
}
```

### Frontend reads pricing

Detected region:

```http
GET /v1/courses/:courseId/price
```

Specific region:

```http
GET /v1/courses/:courseId/price/:region
```

## 5. Promotion / Offer Flow

Promotions can be:

- code-based
- auto-applied
- percentage-based
- fixed-amount
- course-specific
- global
- region-specific
- plan-specific

### Preview a promotion before checkout

```http
POST /v1/commerce/courses/:courseId/promotion/preview
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

Example:

```json
{
  "planType": "annual",
  "promotionCode": "LAUNCH20"
}
```

Typical response shape:

```json
{
  "success": true,
  "message": "Promotion preview",
  "data": {
    "originalAmount": 7999,
    "discountAmount": 1600,
    "finalAmount": 6399,
    "appliedPromotion": {
      "id": "PROMOTION_ID",
      "name": "Launch Offer",
      "code": "LAUNCH20",
      "discountType": "percentage",
      "discountValue": 20
    }
  }
}
```

## 6. Purchase Initiation Flow

### Step 1: initiate purchase

```http
POST /v1/commerce/courses/:courseId/purchase/initiate
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

Example request:

```json
{
  "planType": "annual",
  "phoneCountryCode": "+91",
  "promotionCode": "LAUNCH20",
  "successUrl": "https://app.example.com/payment/success",
  "cancelUrl": "https://app.example.com/payment/cancel"
}
```

Typical response:

```json
{
  "success": true,
  "message": "Purchase initiated",
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/...",
    "sessionId": "cs_test_123",
    "purchaseId": "PURCHASE_ID",
    "originalAmount": 7999,
    "discountAmount": 1600,
    "finalAmount": 6399,
    "appliedPromotion": {
      "id": "PROMOTION_ID",
      "name": "Launch Offer",
      "code": "LAUNCH20",
      "discountType": "percentage",
      "discountValue": 20
    },
    "expiresAt": "2026-05-11T12:00:00.000Z"
  }
}
```

Important validation rules:

- purchase is blocked if user already has active access
- pricing must exist for resolved region
- Stripe price IDs must exist for selected plan
- promotion must be valid for region, plan, and course

## 7. Stripe Checkout Completion

After `checkoutUrl` is returned:

1. frontend redirects user to Stripe
2. user completes payment on Stripe
3. Stripe emits webhook events
4. backend updates purchase state

The webhook endpoint is:

```http
POST /v1/webhooks/stripe
```

The backend verifies the Stripe signature using `STRIPE_WEBHOOK_SECRET`.

Events handled in the backend include:

- `checkout.session.completed`
- `checkout.session.expired`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `charge.refunded`

## 8. Confirm Purchase Endpoint

The confirm endpoint is still useful after redirect because it lets the client explicitly sync and fetch purchase state.

```http
POST /v1/commerce/courses/:courseId/purchase/confirm
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

Example:

```json
{
  "sessionId": "cs_test_123"
}
```

Typical response:

```json
{
  "success": true,
  "message": "Purchase confirmed",
  "data": {
    "purchaseId": "PURCHASE_ID",
    "status": "active",
    "accessGranted": true,
    "startDate": "2026-05-10T10:00:00.000Z",
    "expiryDate": "2027-05-10T10:00:00.000Z"
  }
}
```

## 9. Renewal Flow

Renewal uses the same Stripe pattern but different endpoints.

### Initiate renewal

```http
POST /v1/commerce/courses/:courseId/renew/initiate
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

Example:

```json
{
  "planType": "annual",
  "phoneCountryCode": "+91",
  "promotionCode": "LOYAL10",
  "successUrl": "https://app.example.com/payment/success",
  "cancelUrl": "https://app.example.com/payment/cancel"
}
```

### Confirm renewal

```http
POST /v1/commerce/courses/:courseId/renew/confirm
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

```json
{
  "sessionId": "cs_test_renewal_123"
}
```

Renewal rules:

- renewal requires a previous purchase record
- Stripe subscription state becomes the source of truth
- webhook updates extend or reactivate access

## 10. Access Check Flow

The frontend or other services can verify whether a user currently has course access.

```http
GET /v1/commerce/courses/:courseId/access
Authorization: Bearer <firebase_id_token>
```

Possible active response:

```json
{
  "success": true,
  "message": "Course access",
  "data": {
    "hasAccess": true,
    "purchase": {
      "purchaseId": "PURCHASE_ID",
      "planType": "annual",
      "status": "active",
      "startDate": "2026-05-10T10:00:00.000Z",
      "expiryDate": "2027-05-10T10:00:00.000Z",
      "daysRemaining": 365
    }
  }
}
```

Possible inactive response:

```json
{
  "success": true,
  "message": "Course access",
  "data": {
    "hasAccess": false,
    "reason": "expired",
    "expiredAt": "2026-05-01T10:00:00.000Z",
    "canRenew": true
  }
}
```

## 11. User Purchase History

The user can retrieve all their purchase records:

```http
GET /v1/commerce/purchases
Authorization: Bearer <firebase_id_token>
```

This can be used for:

- account billing section
- purchase audit history
- renewal prompts
- support context

## 12. How Access Affects Content

Once a purchase is active:

- `GET /v1/courses/:courseId/content` returns paid content
- `GET /v1/courses/:courseId/videos/:videoId/stream` succeeds
- `POST /v1/games/:gameId/submit` succeeds for games in that course
- comments on course/lesson content are allowed

Without valid access:

- paid content is blocked
- paid video stream endpoints are blocked
- game submission returns `COURSE_NOT_PURCHASED`
- course/lesson comment creation is blocked

## 13. Refund Flow

Refunds are admin-driven.

### Admin refund endpoint

```http
POST /v1/admin/commerce/purchases/:purchaseId/refund
Authorization: Bearer <admin_firebase_token>
Content-Type: application/json
```

Example:

```json
{
  "reason": "requested_by_customer",
  "notes": "Refund approved by support after duplicate purchase."
}
```

Optional partial refund:

```json
{
  "reason": "other",
  "notes": "Manual partial adjustment",
  "partialAmount": 500
}
```

Typical response:

```json
{
  "success": true,
  "message": "Purchase refunded",
  "data": {
    "purchaseId": "PURCHASE_ID",
    "stripeRefundId": "re_123",
    "amountRefunded": 999,
    "currency": "INR",
    "status": "refunded",
    "accessRevoked": true,
    "revokedAt": "2026-05-10T12:30:00.000Z"
  }
}
```

Refund behavior:

- backend triggers a real Stripe refund
- backend cancels Stripe subscription when applicable
- local purchase record is marked `refunded`
- course access is revoked

## 14. Subscription Notifications

The backend supports lifecycle notifications for expiring and expired subscriptions.

### Manual processing endpoint

```http
POST /v1/admin/commerce/notifications/process-subscriptions
Authorization: Bearer <admin_firebase_token>
Content-Type: application/json
```

Example:

```json
{
  "daysBeforeExpiry": 7
}
```

This processes:

- `subscription_expiring`
- `subscription_expired`
- payment failure related access loss

## 15. Local Testing Flow

Recommended local test sequence:

1. configure pricing with real Stripe test price IDs
2. configure a promotion if needed
3. start services
4. start Stripe CLI forwarding
5. initiate purchase
6. complete checkout in Stripe test mode
7. watch webhook logs
8. confirm purchase
9. verify access endpoint
10. verify paid content/video access

Commands:

```bash
bun run gateway
bun run identity
bun run content
bun run commerce
```

```bash
stripe listen --forward-to localhost:4000/v1/webhooks/stripe
```

## 16. Common Failure Cases

### Already purchased

Purchase initiation returns:

- `409 ALREADY_PURCHASED`

### Region pricing missing

Purchase initiation returns:

- `422 REGION_NOT_SUPPORTED`

### Stripe price missing

Purchase initiation returns:

- `422 STRIPE_PRICE_NOT_CONFIGURED`

### Checkout not completed yet

Confirm returns:

- `422 PAYMENT_NOT_COMPLETED`

### User has no valid access

Access-gated content or submission returns:

- `403 COURSE_NOT_PURCHASED`

## 17. Endpoint Checklist

### User-side commerce

```text
GET  /v1/courses/:courseId/price
GET  /v1/courses/:courseId/price/:region
POST /v1/commerce/courses/:courseId/promotion/preview
POST /v1/commerce/courses/:courseId/purchase/initiate
POST /v1/commerce/courses/:courseId/purchase/confirm
POST /v1/commerce/courses/:courseId/renew/initiate
POST /v1/commerce/courses/:courseId/renew/confirm
GET  /v1/commerce/courses/:courseId/access
GET  /v1/commerce/purchases
```

### Admin-side commerce

```text
PUT  /v1/admin/commerce/courses/:courseId/pricing
GET  /v1/admin/commerce/courses/:courseId/pricing
GET  /v1/admin/commerce/purchases
GET  /v1/admin/commerce/purchases/:purchaseId
POST /v1/admin/commerce/purchases/:purchaseId/refund
GET  /v1/admin/commerce/revenue
POST /v1/admin/commerce/notifications/process-subscriptions
```

### Webhooks

```text
POST /v1/webhooks/stripe
```

## 18. Notes

- payment auth is Firebase-based, not backend session-based
- Stripe Checkout is the entrypoint for purchase and renewal
- Stripe webhooks are the primary source of truth for subscription/payment state
- confirm endpoints are still useful for frontend post-checkout reconciliation
- a purchase record can exist in `pending` state before checkout completes
- access is granted only when purchase status and Stripe sync indicate valid active access
- promotions are resolved before checkout and redemption is finalized after purchase completion
