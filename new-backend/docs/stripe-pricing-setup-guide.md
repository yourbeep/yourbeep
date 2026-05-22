# Stripe Pricing Setup Guide

This guide explains how to create real Stripe product and price ids for a course, save them in YourBeep, and verify that checkout works.

Your current error:

```json
{
  "success": false,
  "error": {
    "code": "resource_missing",
    "message": "No such price: 'fdgfdgdfgdfgfd'"
  }
}
```

means the backend is trying to create a Stripe Checkout Session with a fake or deleted Stripe price id.

Stripe expects real ids such as:

```text
prod_...
price_...
```

## 1. What You Need Per Course

For each course-region combination, YourBeep Commerce needs:

- one Stripe product for the 6 month plan
- one Stripe product for the annual plan
- one Stripe recurring price for the 6 month plan
- one Stripe recurring price for the annual plan

These map to the backend pricing fields:

- `stripeProductId6mo`
- `stripeProductId1yr`
- `stripePriceId6mo`
- `stripePriceId1yr`

## 2. Example Pricing Record

If your course is sold in India:

```json
{
  "region": "IN",
  "currency": "INR",
  "amount6mo": 199,
  "amount1yr": 499,
  "stripeProductId6mo": "prod_xxx",
  "stripeProductId1yr": "prod_yyy",
  "stripePriceId6mo": "price_xxx",
  "stripePriceId1yr": "price_yyy"
}
```

## 3. Create the Stripe Products

In Stripe Dashboard:

1. Open `Product catalog`
2. Click `Create product`
3. Create the 6 month product
4. Create the 1 year product

Recommended naming:

- `YourBeep - <Course Title> - 6 Months`
- `YourBeep - <Course Title> - 1 Year`

Example:

- `YourBeep - Behavioural Signal Intelligence - 6 Months`
- `YourBeep - Behavioural Signal Intelligence - 1 Year`

After creating each product, copy the product ids:

- `prod_...`

## 4. Create the Stripe Prices

Inside each product, create a recurring price.

### 6 month plan

Use:

- `INR 199`
- recurring
- custom billing period of `6 months`

### 1 year plan

Use:

- `INR 499`
- recurring
- billing period of `1 year`

After creating each recurring price, copy the price ids:

- `price_...`

## 5. Important Stripe Settings

When creating prices:

- currency must match backend pricing currency
- amount must match backend pricing amount
- price must be `Recurring`, not one-time
- 6 month plan should bill every `6 months`
- annual plan should bill every `1 year`

If you create a one-time Stripe price by mistake, renewal and subscription handling will not behave correctly.

## 6. Save the Pricing in YourBeep

Use the admin pricing endpoint:

```http
PUT /v1/admin/commerce/courses/:courseId/pricing
Authorization: Bearer <admin_firebase_token>
Content-Type: application/json
```

Example:

```json
{
  "region": "IN",
  "currency": "INR",
  "amount6mo": 199,
  "amount1yr": 499,
  "stripeProductId6mo": "prod_6mo_real",
  "stripeProductId1yr": "prod_1yr_real",
  "stripePriceId6mo": "price_6mo_real",
  "stripePriceId1yr": "price_1yr_real"
}
```

You can do this from:

- your admin panel pricing screen
- Swagger
- Postman
- curl

## 7. Verify the Saved Pricing

After saving it, check:

```http
GET /v1/courses/:courseId/price
```

or:

```http
GET /v1/courses/:courseId/price/IN
```

Expected response shape:

```json
{
  "success": true,
  "data": {
    "courseId": "COURSE_ID",
    "region": "IN",
    "currency": "INR",
    "plans": {
      "sixMonth": {
        "amount": 199,
        "displayPrice": "INR 199",
        "planType": "six_month",
        "stripePriceId": "price_6mo_real"
      },
      "annual": {
        "amount": 499,
        "displayPrice": "INR 499",
        "planType": "annual",
        "savings": null,
        "stripePriceId": "price_1yr_real"
      }
    }
  }
}
```

If the response still shows fake ids, the update did not persist correctly.

## 8. Test Checkout

Once real Stripe ids are saved:

1. open the course pricing page in `yourbeep-web`
2. choose a plan
3. click the Stripe checkout button
4. confirm the backend returns a real checkout url
5. finish payment in Stripe test mode
6. return to the app
7. confirm purchase on return

The checkout initiation endpoint is:

```http
POST /v1/commerce/courses/:courseId/purchase/initiate
```

## 9. Test Cards

In Stripe test mode, use Stripe test card numbers such as:

```text
4242 4242 4242 4242
```

Use any future expiry and any CVC.

## 10. Common Problems

### `No such price`

Cause:

- fake price id
- typo in `price_...`
- using a deleted price
- using a live id with test secret key
- using a test id with live secret key

Fix:

- copy the exact `price_...` from Stripe
- make sure Stripe mode matches your backend key

### Checkout still fails after saving price ids

Check:

- `STRIPE_SECRET_KEY` is correct in backend env
- price ids belong to the same Stripe account
- the price is recurring
- the course region matches the pricing record

### `REGION_NOT_SUPPORTED`

Cause:

- no pricing exists for the resolved region

Fix:

- create pricing for that region
- or request `GET /courses/:courseId/price/IN` explicitly when testing

## 11. Recommended Naming Convention

Keep Stripe product names predictable:

- `YourBeep - <Course Title> - 6 Months`
- `YourBeep - <Course Title> - 1 Year`

This makes refund, audit, and Stripe dashboard review much easier later.

## 12. Minimum Setup Checklist

Before checkout can work for a course:

- real Stripe account configured
- `STRIPE_SECRET_KEY` set
- 6 month recurring price created
- 1 year recurring price created
- real `price_...` ids saved in backend pricing
- course pricing endpoint returns those real ids
- frontend pricing page loads real amounts

## 13. Fastest Fix for Your Current Case

Replace:

```text
fdgdfggdfgdfgd
fdgfdgdfgdfgfd
```

with real Stripe `price_...` ids from Stripe Dashboard, then save them again with:

```http
PUT /v1/admin/commerce/courses/6a05939f043dbe12b94538bc/pricing
```

That is the direct fix for the error you are seeing now.
