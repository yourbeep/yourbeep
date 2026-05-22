# Production Cost Plan

Cost planning note for `yourbeep` as of `2026-05-11`.

This is a practical planning document, not a vendor quote. Where the vendors expose exact public pricing, I use it directly. Where a vendor makes the exact production tier harder to quote publicly, I mark the number as an estimate.

## Assumptions

I am making these assumptions so the estimate is concrete:

- Initial launch means about `1,000 registered users`.
- Six-month target means about `20,000 registered users`.
- Firebase is used for auth + FCM only.
- Backend is deployed on AWS using Docker on `Lightsail` because the current codebase already has a Docker Compose path and Lightsail pricing is predictable.
- AWS `S3` is used for static assets, small file storage, exports, and backups.
- Bunny is used for course video delivery and storage.
- MongoDB is hosted on MongoDB Atlas.
- Transactional email is sent through either `AWS SES` or `Brevo`.
- Prices below are in `USD` and generally exclude taxes.

## Recommended Infra Shape

### Phase 1: launch to ~1k users

- `1 x Lightsail Medium-4GB` app server for production
- `1 x Lightsail Small-2GB` worker/staging/ops box
- `S3` for images, exports, backup artifacts
- `MongoDB Atlas Flex`
- `Bunny Stream` for videos
- `Firebase Auth + FCM`
- `AWS SES` for transactional email

### Phase 2: around month 6 at ~20k users

- `2 x Lightsail Medium-4GB` production nodes
- `1 x Lightsail Small-2GB` worker/staging/ops box
- `1 x Lightsail Load Balancer`
- `S3` usage grows with assets and exports
- `MongoDB Atlas` moves from `Flex` to a small dedicated production tier
- `Bunny Stream` remains the video layer
- `Firebase Auth + FCM`
- `AWS SES` stays the cheapest SMTP path unless marketing automation becomes a product requirement

## Vendor Pricing Used

### AWS Lightsail

From the official Lightsail bundle docs:

- `Small-2GB Linux with public IPv4`: `$12/month`
- `Medium-4GB Linux with public IPv4`: `$24/month`
- `Load balancer`: `$18/month`

### AWS S3

Using S3 Standard pricing assumptions:

- storage: `$0.023/GB/month` for the first 50 TB
- GET requests: `$0.0004 per 1,000`
- PUT/COPY/POST/LIST requests: `$0.005 per 1,000`

For this document I treat S3 as a small supporting cost, not the main delivery channel.

### AWS SES

Official SES pricing used here:

- outgoing email: `$0.10 per 1,000 emails`
- attachment data: `$0.12/GB`

This estimate assumes mostly transactional text emails with negligible attachment volume.

### Brevo

Official Brevo entry pricing:

- `Free`: `300 emails/day`
- `Starter`: starts at `$9/month`
- `Standard`: starts at `$18/month`

Brevo pricing becomes tier-dependent as send volume increases, so the month-6 Brevo cost below is a planning range, not a fixed vendor-quoted number.

### Firebase

Official pricing used:

- Firebase Cloud Messaging: `no cost`
- Identity Platform / Firebase Authentication Tier 1 providers:
  - first `50,000 MAU`: `free`
  - `50,000 to 100,000 MAU`: `$0.0055 per MAU`

For both 1k users and 20k users, the auth cost stays at `0` if you remain under `50k monthly active users`.

### MongoDB Atlas

Official MongoDB public guidance used:

- `Atlas Flex`: `$8 to $30/month`
- `M10` is the first small dedicated production tier, with `2 GB RAM` and `10 GB disk included`

MongoDB does not expose the clean dedicated price as plainly as Lightsail, so the `M10` month-6 number below is a planning estimate.

### Bunny Stream / CDN

Official Bunny pricing used:

- video storage: `$0.01/GB/month`
- stream delivery, Europe & North America: `$0.01/GB`
- stream delivery, Asia & Oceania: `$0.03/GB`
- stream delivery, Middle East & Africa: `$0.06/GB`
- stream delivery, South America: `$0.045/GB`
- premium encoding:
  - `1080p/720p`: `$0.05/minute`
  - `480p/360p/240p`: `$0.025/minute`

For budgeting, I assume a blended delivery rate of about `$0.022/GB` because an India-first product usually lands between Europe/NA and Asia/Oceania mixes.

## Usage Assumptions Behind the Budget

These are my working assumptions for the monthly estimates:

### Launch phase

- Bunny video library stored: `200 GB`
- Bunny monthly video traffic: `2 TB`
- S3 storage: `50 GB`
- S3 requests: low enough to stay under `$1`
- Transactional email volume: `10,000 emails/month`

### Month 6 phase

- Bunny video library stored: `500 GB`
- Bunny monthly video traffic: `12 TB`
- S3 storage: `200 GB`
- S3 requests: moderate, still a small line item
- Transactional email volume: `200,000 emails/month`

## Monthly Cost Estimate

### Phase 1: launch budget at ~1k users

| Component | Assumption | Monthly Cost |
|---|---:|---:|
| AWS Lightsail prod | `1 x Medium-4GB` | `$24` |
| AWS Lightsail worker/staging | `1 x Small-2GB` | `$12` |
| AWS S3 | `50 GB storage + light requests` | `$2` |
| MongoDB Atlas | `Flex` | `$8 to $30` |
| Bunny storage | `200 GB x $0.01` | `$2` |
| Bunny delivery | `2,000 GB x $0.022` | `$44` |
| Firebase Auth | `< 50k MAU` | `$0` |
| Firebase FCM | official free | `$0` |
| AWS SES | `10,000 emails` | `$1` |

### Phase 1 total

- With `SES` and Atlas at the low end: about **`$93/month`**
- With `SES` and Atlas at the high end of Flex: about **`$115/month`**
- With `Brevo Starter` instead of SES: add about **`$8/month`** over the SES version

## Month 6 Cost Estimate at ~20k users

| Component | Assumption | Monthly Cost |
|---|---:|---:|
| AWS Lightsail prod | `2 x Medium-4GB` | `$48` |
| AWS Lightsail worker/staging | `1 x Small-2GB` | `$12` |
| Lightsail load balancer | `1 x LB` | `$18` |
| AWS S3 | `200 GB storage + moderate requests` | `$6` |
| MongoDB Atlas | small dedicated production tier, planned as `M10-class` | `$60` estimate |
| Bunny storage | `500 GB x $0.01` | `$5` |
| Bunny delivery | `12,000 GB x $0.022` | `$264` |
| Firebase Auth | `< 50k MAU` | `$0` |
| Firebase FCM | official free | `$0` |
| AWS SES | `200,000 emails` | `$20` |

### Month 6 total

- With `SES`: about **`$433/month`**
- With `Brevo`: plan for about **`$450 to $490+/month`** depending on the selected send tier and whether you need automation features

## One-Time and Annual Store Costs

| Item | Cost |
|---|---:|
| Google Play developer registration | `$25` one-time |
| Apple Developer Program | `$99/year` |

### First-month launch cash outlay

If you publish on both stores immediately:

- baseline infra first month: about **`$93 to $115`**
- Play Store fee: **`$25`** one-time
- Apple Developer Program: **`$99/year`**

So the first month cash requirement is roughly:

- **`$217 to $239`** with `SES`

## SMTP Choice: SES vs Brevo

### Choose SES if

- you mainly need transactional email
- you want the lowest recurring cost
- your product team does not need a marketing CRM right now

### Choose Brevo if

- you want marketing campaigns, segmentation, landing pages, or basic CRM in the same tool
- you want a friendlier non-engineering interface for campaigns
- you accept a higher monthly cost than SES

### My recommendation

For `yourbeep`, I would start with:

- `AWS SES` for auth, support, transactional, purchase, and notification emails
- only move to `Brevo` later if marketing automation becomes a clear growth need

## What Can Change the Budget the Most

The biggest variables are:

1. `Bunny delivery traffic`
2. `MongoDB tier jump`
3. `email volume and tooling choice`
4. `whether you need a second production app node earlier than expected`

Useful rule of thumb:

- every extra `1 TB` of Bunny traffic is roughly:
  - about `+$10` if mostly Europe/NA
  - about `+$30` if mostly Asia/Oceania
- every extra `100,000 SES emails` is about `+$10`

## Costs Not Included

These are intentionally not included in the totals above:

- Stripe/payment gateway fees
- taxes/GST/VAT
- support plan upgrades
- observability tools like Sentry, Datadog, Logtail, New Relic
- CI/CD costs
- SMS/WhatsApp costs
- app store purchase commissions if you sell digital goods inside native apps

## Recommended Budget

If you want a realistic operating budget instead of the narrow infra total:

- **Launch target budget:** `~$150/month`
- **Month 6 target budget:** `~$500/month`

That gives you a little room for traffic variance, backups, and tooling without immediately needing to redo the architecture.

## Sources

- AWS Lightsail pricing and bundles:
  - https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-bundles.html
  - https://aws.amazon.com/lightsail/pricing/
- AWS S3 pricing:
  - https://aws.amazon.com/s3/pricing/
  - https://aws.amazon.com/pricing/
- AWS SES pricing:
  - https://aws.amazon.com/ses/pricing/
- Firebase pricing and limits:
  - https://firebase.google.com/products/cloud-messaging
  - https://cloud.google.com/identity-platform/pricing
  - https://firebase.google.com/docs/auth/limits
  - https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- Bunny pricing:
  - https://docs.bunny.net/stream/pricing
  - https://bunny.net/pricing/
  - https://bunny.net/pricing/stream/
- Brevo pricing:
  - https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans
- MongoDB pricing:
  - https://www.mongodb.com/pricing
  - https://www.mongodb.com/docs/atlas/billing/atlas-flex-costs/
  - https://www.mongodb.com/pricing/calculator
- App store developer account pricing:
  - https://support.google.com/googleplay/android-developer/answer/6112435
  - https://developer.apple.com/programs/
  - https://developer.apple.com/help/account/membership/program-enrollment/
