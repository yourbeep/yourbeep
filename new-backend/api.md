# yourbeep

**UNDERSTANDING • BALANCE • EMPATHY**

---

# Full Platform API Reference

## Microservices Architecture — v2.0

|                  |                                                                  |
| ---------------- | ---------------------------------------------------------------- |
| **Stack**        | Node.js • Express • TypeScript • MongoDB • Bun • Zod • Swagger   |
| **Integrations** | Firebase Auth • FCM • Bunny.net Stream • Stripe                  |
| **Architecture** | 3 Microservices + API Gateway • HTTP inter-service communication |
| **Version**      | v2.0 — May 2025 • **Confidential & Internal Use Only**           |

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
   - 1.1 Service Map
   - 1.2 Base URLs
   - 1.3 Request Flow
   - 1.4 Client Types
   - 1.5 Authentication Model
2. [API Gateway](#2-api-gateway)
   - 2.1 Routing & Middleware
   - 2.2 Rate Limiting
3. [Service 1 — Identity & Notifications](#3-service-1--identity--notifications)
   - 3.1 Firebase Auth Sync
   - 3.2 User Profile
   - 3.3 MongoDB User Schema
   - 3.4 Push Notifications (FCM)
   - 3.5 Admin User Management
4. [Service 2 — Content & Courses](#4-service-2--content--courses)
   - 4.1 Games Library
   - 4.2 Course Management
   - 4.3 Course Content Structure
   - 4.4 Master Call
   - 4.5 Video Hosting (Bunny.net)
   - 4.6 Game Submissions & Scoring
   - 4.7 Awareness States Game
   - 4.8 Somatic States Game
   - 4.9 Pattern Awareness Game
   - 4.10 Reflect & Act Game
   - 4.11 Final Score Calculation
5. [Service 3 — Commerce](#5-service-3--commerce)
   - 5.1 Regional Pricing
   - 5.2 Course Purchase (Stripe)
   - 5.3 Subscription Plans
   - 5.4 Access Control
   - 5.5 Renewals & Expiry
   - 5.6 Refunds
6. [Dashboard & Recommendations](#6-dashboard--recommendations)
7. [Zod Validation Schemas](#7-zod-validation-schemas-typescript)
8. [Error Code Reference](#8-error-code-reference)
9. [Swagger / OpenAPI Configuration](#9-swagger--openapi-configuration)
10. [Inter-Service Communication](#10-inter-service-communication)
11. [MongoDB Collections Summary](#11-mongodb-collections-summary)

---

# 1. Architecture Overview

yourbeep is built as a 3-microservice platform fronted by a single API Gateway. Each service owns its domain completely — its own Express app, its own MongoDB database, and its own port. Services communicate with each other over plain HTTP on the internal network.

## 1.1 Service Map

| Service     | Domain                   | Port  | Responsibilities                                                                             |
| ----------- | ------------------------ | ----- | -------------------------------------------------------------------------------------------- |
| Service 1   | Identity & Notifications | :4001 | Firebase auth sync, user profiles, FCM push notifications, admin user management             |
| Service 2   | Content & Courses        | :4002 | Games library, courses, videos (Bunny.net), master call, activity submissions, scoring       |
| Service 3   | Commerce                 | :4003 | Course purchases, subscription plans (6 mo / 1 yr), Stripe payments, access control, refunds |
| API Gateway | Gateway                  | :4000 | Single entry point — JWT verification, routing, rate limiting, request logging               |

## 1.2 Base URLs

```
# Production
API Gateway:    https://api.yourbeep.com/v1

# Internal (server-to-server only — never exposed to clients)
Identity:       http://identity-service:4001
Content:        http://content-service:4002
Commerce:       http://commerce-service:4003

# Development
API Gateway:    http://localhost:4000/v1
Identity:       http://localhost:4001
Content:        http://localhost:4002
Commerce:       http://localhost:4003
```

## 1.3 Request Flow

```
Client (Web / iOS / Android)
  │
  │  Authorization: Bearer <firebase_id_token>
  ▼
API Gateway (:4000)
  ├── Verify Firebase ID Token (Firebase Admin SDK)
  ├── Attach decoded user context to request headers
  ├── Rate limit check
  ├── Route to correct microservice
  │
  ├──▶ /v1/auth/*         →  Identity Service (:4001)
  ├──▶ /v1/users/*        →  Identity Service (:4001)
  ├──▶ /v1/notifications/* →  Identity Service (:4001)
  ├──▶ /v1/courses/*      →  Content Service (:4002)
  ├──▶ /v1/games/*        →  Content Service (:4002)
  ├──▶ /v1/master-call/*  →  Content Service (:4002)
  ├──▶ /v1/commerce/*     →  Commerce Service (:4003)
  └──▶ /v1/admin/*        →  Routed by sub-path
```

## 1.4 Client Types

| Client            | Type                        | Access                                                                               |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| Web App           | User-facing web application | Full access — course purchase, video playback, games, payments                       |
| iOS / Android App | User mobile apps            | Full access except payments — no purchase flow on mobile (Stripe web-only)           |
| Admin Web App     | Separate admin dashboard    | Admin-only endpoints — course creation, game management, user management, broadcasts |

## 1.5 Authentication Model

All authentication is delegated to Firebase. The platform uses Firebase Auth (email/password + Google OAuth). The API Gateway verifies every request's Firebase ID Token using the Firebase Admin SDK. No server-side JWTs are issued or managed.

| Step                         | How                              | Result                                                                   |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| Client registers / logs in   | Via Firebase SDK                 | Firebase issues ID Token + handles refresh automatically                 |
| Client calls POST /auth/sync | After every sign-in              | Creates or updates MongoDB user record in Identity Service               |
| Client sends every request   | Authorization: Bearer <id_token> | Gateway verifies token, extracts uid + email, routes to service          |
| Service receives request     | X-User-Id, X-User-Email headers  | Gateway injects these headers — services trust them without re-verifying |

> ⚠️ **Warning:** Mobile app users cannot make purchases. The Stripe payment flow is web-only. Mobile users can access all purchased content after purchasing on web.

---

# 2. API Gateway

The API Gateway is the single entry point for all client traffic. It runs on port 4000 and handles authentication verification, request routing, rate limiting, and logging. No business logic lives here.

## 2.1 Routing & Middleware

### Middleware Stack (applied in order)

| #   | Middleware              | Purpose                                             | Applies To               |
| --- | ----------------------- | --------------------------------------------------- | ------------------------ |
| 1   | CORS                    | Allow configured origins (web, admin, mobile)       | All requests             |
| 2   | Request Logger          | Log method, path, status, latency                   | All requests             |
| 3   | Firebase Token Verifier | Verify Bearer token via Firebase Admin SDK          | All except public routes |
| 4   | User Context Injector   | Attach X-User-Id, X-User-Email, X-User-Role headers | After token verified     |
| 5   | Rate Limiter            | Enforce per-IP and per-user limits                  | All requests             |
| 6   | Router                  | Forward request to correct downstream service       | All requests             |

### Public Routes (no token required)

The following paths bypass Firebase token verification:

| Path                            | Description                               |
| ------------------------------- | ----------------------------------------- |
| POST /v1/auth/sync              | Create/sync user after Firebase sign-in   |
| GET /v1/courses                 | Browse available courses (public listing) |
| GET /v1/courses/:courseId       | View course detail and trailer            |
| GET /v1/courses/:courseId/price | Get regional price                        |
| GET /v1/master-call             | View master call info                     |
| POST /v1/webhooks/\*            | Stripe and Bunny.net webhooks             |

### Injected Headers (downstream services receive these)

| Header         | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| X-User-Id      | string | MongoDB ObjectId of the authenticated user |
| X-User-Email   | string | User's email from Firebase token           |
| X-User-Role    | string | user \| admin — from MongoDB user record   |
| X-Firebase-Uid | string | Raw Firebase UID                           |
| X-Request-Id   | string | UUID generated per request for tracing     |

## 2.2 Rate Limiting

| Scope             | Limit                 | Response              |
| ----------------- | --------------------- | --------------------- |
| Global (per IP)   | 200 req / min         | 429 Too Many Requests |
| Auth endpoints    | 10 req / min          | 429 Too Many Requests |
| Payment endpoints | 5 req / min           | 429 Too Many Requests |
| Video stream URL  | 30 req / min per user | 429 Too Many Requests |
| Game submissions  | 60 req / min per user | 429 Too Many Requests |

### Standard Response Envelope

All services return responses in this envelope:

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "string",
  "timestamp": "2025-01-01T00:00:00.000Z"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [ ... ]
  }
}
```

---

# 3. Service 1 — Identity & Notifications

The Identity Service owns all user data, authentication sync, profile management, and push notification dispatch. It runs on port 4001 and connects to the `yourbeep_identity` MongoDB database.

## 3.1 Firebase Auth Sync

Firebase handles all credential management on the client. The Identity Service only needs three auth-related endpoints — sync, profile fetch, and account deletion.

| Method | Path          | Description                                        | Auth   |
| ------ | ------------- | -------------------------------------------------- | ------ |
| POST   | /auth/sync    | Create or sync MongoDB user after Firebase sign-in | Public |
| GET    | /auth/me      | Get current authenticated user profile             | Bearer |
| DELETE | /auth/account | Delete account from Firebase + MongoDB             | Bearer |

### POST /auth/sync

Called by the client once after every sign-in (new and returning users). Creates a MongoDB user record on first login, updates it on subsequent logins.

#### Request Body

| Field    | Type   | Required | Description                                                        |
| -------- | ------ | -------- | ------------------------------------------------------------------ |
| timezone | string | No       | IANA timezone string e.g. Asia/Kolkata. Defaults to UTC            |
| region   | string | No       | ISO 3166-1 alpha-2 country code detected client-side on first load |
| fcmToken | string | No       | FCM device token if push notifications are enabled                 |

#### Response 200/201

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "ObjectId",
      "firebaseUid": "string",
      "name": "Alolika Sen",
      "email": "alolika@yourbeep.com",
      "avatar": "https://...",
      "timezone": "Asia/Kolkata",
      "role": "user",
      "userLevel": 1,
      "points": 0,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "isNewUser": true
  }
}
```

### GET /auth/me

Returns the full MongoDB user profile for the authenticated user. Used on app load to hydrate user state.

### DELETE /auth/account

Deletes the user's Firebase account and MongoDB record. Also cancels any active subscriptions in the Commerce Service via internal HTTP call. This action is irreversible.

> ⚠️ **Warning:** This endpoint calls Commerce Service internally: `DELETE http://commerce-service:4003/internal/users/:userId` — to cancel subscriptions before deletion.

## 3.2 User Profile

| Method | Path                   | Description                                              | Auth   |
| ------ | ---------------------- | -------------------------------------------------------- | ------ |
| GET    | /users/me              | Get authenticated user's full profile                    | Bearer |
| PATCH  | /users/me              | Update profile — name, avatar, timezone                  | Bearer |
| GET    | /users/me/stats        | Get user level, points, streaks, badges                  | Bearer |
| GET    | /users/me/activity-log | Paginated log of all completed game submissions          | Bearer |
| GET    | /users/me/purchases    | Get all course purchases — proxied from Commerce Service | Bearer |
| GET    | /users/me/progress     | Aggregated progress across all purchased courses         | Bearer |

### PATCH /users/me — Request Body

| Field            | Type   | Required | Description                                    |
| ---------------- | ------ | -------- | ---------------------------------------------- |
| name             | string | No       | Updated display name. Min 2, max 80 characters |
| avatar           | string | No       | URL to new profile image                       |
| timezone         | string | No       | Valid IANA timezone string                     |
| phoneCountryCode | string | No       | E.164 country code prefix e.g. +91 for India   |

### GET /users/me/activity-log — Query Parameters

| Field    | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| page     | number | No       | Page number, default 1                   |
| limit    | number | No       | Items per page, default 20, max 100      |
| courseId | string | No       | Filter by course ObjectId                |
| gameKey  | string | No       | Filter by game key e.g. awareness_states |
| from     | date   | No       | ISO date string — start of date range    |
| to       | date   | No       | ISO date string — end of date range      |

## 3.3 MongoDB User Schema

| Field            | Type     | Required | Description                                              |
| ---------------- | -------- | -------- | -------------------------------------------------------- |
| \_id             | ObjectId | Auto     | MongoDB document ID                                      |
| firebaseUid      | string   | Yes      | Firebase UID — unique, indexed. Replaces passwordHash    |
| name             | string   | Yes      | Display name                                             |
| email            | string   | Yes      | Unique email — indexed                                   |
| avatar           | string   | No       | URL to profile image (from Google OAuth or uploaded)     |
| timezone         | string   | No       | IANA timezone string, default UTC                        |
| role             | string   | Auto     | Enum: user \| admin. Default user                        |
| userLevel        | number   | Auto     | Integer level, starts at 1                               |
| points           | number   | Auto     | Cumulative XP points earned from completing games        |
| streakDays       | number   | Auto     | Consecutive days with at least one game activity         |
| badges           | string[] | Auto     | Array of earned badge keys                               |
| fcmTokens        | string[] | Auto     | FCM device tokens — array supports multi-device          |
| region           | string   | No       | ISO 3166-1 alpha-2 country code detected at first login  |
| phoneCountryCode | string   | No       | Country code from phone number (+91 for IN, etc.)        |
| isActive         | boolean  | Auto     | Soft-delete flag, default true                           |
| lastActiveAt     | Date     | Auto     | Timestamp of last API call — used for streak calculation |
| createdAt        | Date     | Auto     | Account creation timestamp                               |
| updatedAt        | Date     | Auto     | Last update timestamp                                    |

> ℹ️ `passwordHash` and `refreshTokens` fields from v1.0 are completely removed. Firebase manages all credentials.

## 3.4 Push Notifications (FCM)

The Identity Service manages FCM token registration and dispatches push notifications. Firebase Cloud Messaging handles delivery to iOS, Android, and web browsers.

| Method | Path                           | Description                                           | Auth   |
| ------ | ------------------------------ | ----------------------------------------------------- | ------ |
| POST   | /notifications/token           | Register an FCM device token                          | Bearer |
| DELETE | /notifications/token           | Remove an FCM device token on logout                  | Bearer |
| POST   | /admin/notifications/broadcast | Admin: send push to all or specific course purchasers | Admin  |

### POST /notifications/token — Request Body

| Field      | Type   | Required | Description                                              |
| ---------- | ------ | -------- | -------------------------------------------------------- |
| fcmToken   | string | Yes      | FCM registration token obtained from Firebase client SDK |
| deviceType | string | No       | web \| ios \| android — for diagnostic tracking          |

### Notification Types

| Type                  | Trigger                             | Audience                        | Message                                   |
| --------------------- | ----------------------------------- | ------------------------------- | ----------------------------------------- |
| course_ready          | Admin publishes new course          | All users                       | A new course is now available             |
| game_added            | Admin adds game to purchased course | Course purchasers               | A new game was added to your course       |
| game_reminder         | Scheduled cron — incomplete games   | Users with active subscriptions | You have unfinished games in [Course]     |
| purchase_confirmed    | Payment confirmed by Stripe         | Purchasing user                 | Your purchase of [Course] is confirmed    |
| subscription_expiring | 3 days before expiry                | User with expiring plan         | Your access to [Course] expires in 3 days |
| subscription_expired  | Day of expiry                       | User whose plan expired         | Your access to [Course] has expired       |
| admin_broadcast       | Admin sends manual push             | All or course-specific          | Admin-composed message                    |

### POST /admin/notifications/broadcast — Request Body

| Field    | Type   | Required | Description                                                                          |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| title    | string | Yes      | Notification title shown in OS notification tray                                     |
| body     | string | Yes      | Notification body text                                                               |
| imageUrl | string | No       | Optional image URL to include in notification                                        |
| courseId | string | No       | If provided, sends only to purchasers of this course. If omitted, sends to all users |
| data     | object | No       | Key-value pairs passed to client for deep linking                                    |

## 3.5 Admin User Management

| Method | Path                     | Description                                              | Auth  |
| ------ | ------------------------ | -------------------------------------------------------- | ----- |
| GET    | /admin/users             | List all users with pagination and filters               | Admin |
| GET    | /admin/users/:id         | Get a specific user with full stats and purchase history | Admin |
| PATCH  | /admin/users/:id/role    | Update user role: user \| admin                          | Admin |
| DELETE | /admin/users/:id         | Soft delete user account                                 | Admin |
| POST   | /admin/users/:id/restore | Restore soft-deleted user account                        | Admin |

### GET /admin/users — Query Parameters

| Field    | Type    | Required | Description                                                              |
| -------- | ------- | -------- | ------------------------------------------------------------------------ |
| page     | number  | No       | Page number, default 1                                                   |
| limit    | number  | No       | Items per page, default 20, max 100                                      |
| search   | string  | No       | Search by name or email (case-insensitive)                               |
| role     | string  | No       | Filter by role: user \| admin                                            |
| isActive | boolean | No       | Filter active or soft-deleted users                                      |
| sort     | string  | No       | Sort field: createdAt \| lastActiveAt \| points. Prefix - for descending |

---

# 4. Service 2 — Content & Courses

The Content Service owns everything related to learning content: games library, course structure, course content (videos + activities in sequence), master call, and all game submission and scoring logic. It runs on port 4002 and connects to the `yourbeep_content` MongoDB database.

## 4.1 Games Library

Games are standalone entities that live in a library. Each game has its own scoring logic (1–3 scale). Games are not bound to any course by default — admins select games when building a course.

| Method | Path                     | Description                         | Auth  |
| ------ | ------------------------ | ----------------------------------- | ----- |
| GET    | /admin/games             | List all games in the library       | Admin |
| POST   | /admin/games             | Add a new game to the library       | Admin |
| PUT    | /admin/games/:id         | Update game title or description    | Admin |
| DELETE | /admin/games/:id         | Soft delete a game from the library | Admin |
| POST   | /admin/games/:id/restore | Restore a soft-deleted game         | Admin |

### Game Schema (MongoDB)

| Field              | Type     | Required | Description                                             |
| ------------------ | -------- | -------- | ------------------------------------------------------- |
| \_id               | ObjectId | Auto     | MongoDB document ID                                     |
| key                | string   | Yes      | Unique identifier e.g. awareness_states, somatic_states |
| title              | string   | Yes      | Display name of the game                                |
| description        | string   | No       | What this game does and how it benefits the user        |
| internalScoreRange | object   | Auto     | { min: 1, max: 3 } — fixed for all games                |
| isActive           | boolean  | Auto     | Soft-delete flag, default true                          |
| createdAt          | Date     | Auto     | Creation timestamp                                      |

### Current Games in Library

| Key               | Title             | Description                                                                            |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------- |
| awareness_states  | Awareness States  | Energy orientation and flow stability through activation and expansion grid selections |
| somatic_states    | Somatic States    | Body-region sensation mapping with ordered awareness tests and physical exercises      |
| pattern_awareness | Pattern Awareness | Drawing and movement exercises assessing presence, action, and pattern scores          |
| reflect_act       | Reflect & Act     | Synthesises scores from all three preceding games into a final action recommendation   |

### POST /admin/games — Request Body

| Field       | Type   | Required | Description                                               |
| ----------- | ------ | -------- | --------------------------------------------------------- |
| key         | string | Yes      | Unique snake_case key. Must be unique across all games    |
| title       | string | Yes      | Display name shown to users. Max 100 characters           |
| description | string | No       | Description of what the game assesses. Max 500 characters |

## 4.2 Course Management

A course is built by an admin who selects games from the library and assigns a weight (%) to each. Weights must total 100%. The course also contains a flat list of content items (videos and game activities interleaved in a defined order).

| Method | Path                       | Description                                                   | Auth   |
| ------ | -------------------------- | ------------------------------------------------------------- | ------ |
| GET    | /courses                   | List all active courses with user progress (if authenticated) | Public |
| GET    | /courses/:courseId         | Get full course detail including content list and trailer     | Public |
| GET    | /courses/:courseId/content | Get ordered content list — requires valid purchase            | Bearer |
| POST   | /admin/courses             | Create a new course                                           | Admin  |
| PUT    | /admin/courses/:id         | Update course — games, weights, pricing, metadata             | Admin  |
| DELETE | /admin/courses/:id         | Soft delete a course                                          | Admin  |
| POST   | /admin/courses/:id/restore | Restore a soft-deleted course                                 | Admin  |
| GET    | /admin/courses             | List all courses including soft-deleted                       | Admin  |

### Course Schema (MongoDB)

| Field            | Type     | Required | Description                                                         |
| ---------------- | -------- | -------- | ------------------------------------------------------------------- |
| \_id             | ObjectId | Auto     | MongoDB document ID                                                 |
| title            | string   | Yes      | Course display title                                                |
| subtitle         | string   | No       | Short tagline shown in course card                                  |
| description      | string   | Yes      | Full course description                                             |
| shortDescription | string   | No       | One-liner for course listing cards, max 160 chars                   |
| thumbnail        | string   | No       | URL to course thumbnail image                                       |
| trailerVideoId   | string   | No       | Bunny.net video ID for the free preview trailer                     |
| games            | array    | Yes      | Array of { gameId, weight } objects — weights must sum to 100       |
| contentItems     | array    | Yes      | Ordered flat list of { type, refId, order } — see Content Structure |
| instructor       | object   | No       | { name, bio, avatar } — admin/instructor info shown on course page  |
| durationMinutes  | number   | No       | Total estimated duration in minutes                                 |
| isSeeded         | boolean  | Auto     | True for auto-seeded default course                                 |
| isActive         | boolean  | Auto     | Soft-delete flag, default true                                      |
| isPublished      | boolean  | Auto     | False = draft, True = visible to users. Default false               |
| createdBy        | ObjectId | Yes      | Admin user who created this course                                  |
| createdAt        | Date     | Auto     | Creation timestamp                                                  |
| updatedAt        | Date     | Auto     | Last update timestamp                                               |

### Course Games Sub-document

| Field  | Type     | Required | Description                                                                  |
| ------ | -------- | -------- | ---------------------------------------------------------------------------- |
| gameId | ObjectId | Yes      | Reference to Game document                                                   |
| weight | number   | Yes      | Contribution % to final score. All weights in course must sum to exactly 100 |

> ⚠️ **Validation:** `games[].weight` values must sum to exactly 100. Return `INVALID_WEIGHT_SUM` (422) if not.

### POST /admin/courses — Request Body

```json
POST /admin/courses
{
  "title": "Behavioural Signal Intelligence",
  "subtitle": "Begin your self-reflection journey",
  "description": "Full course description here",
  "shortDescription": "A 4-game journey into self-awareness",
  "instructor": {
    "name": "Instructor Name",
    "bio": "Brief bio here",
    "avatar": "https://..."
  },
  "games": [
    { "gameId": "ObjectId", "weight": 30 },
    { "gameId": "ObjectId", "weight": 25 },
    { "gameId": "ObjectId", "weight": 25 },
    { "gameId": "ObjectId", "weight": 20 }
  ],
  "durationMinutes": 120
}
```

### GET /courses Response

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "ObjectId",
        "title": "Behavioural Signal Intelligence",
        "subtitle": "Begin your self-reflection journey",
        "shortDescription": "A 4-game journey into self-awareness",
        "thumbnail": "https://...",
        "trailerVideoId": "bunny-video-id",
        "durationMinutes": 120,
        "gameCount": 4,
        "pricing": {
          "region": "IN",
          "currency": "INR",
          "amount": 999,
          "displayPrice": "₹999"
        },
        "userProgress": {
          "hasPurchase": true,
          "planType": "annual",
          "expiresAt": "2026-01-01T00:00:00.000Z",
          "gamesCompleted": 2,
          "gamesTotal": 4,
          "percentComplete": 50
        }
      }
    ]
  }
}
```

## 4.3 Course Content Structure

A course's content is a flat ordered list. Each item is either a video lesson or a game activity. The admin defines this order when building the course. Users can view the list and navigate to any item, but game activities can also be done independently outside the sequence from the activities tab.

### Content Item Schema

| Field           | Type     | Required | Description                                                                 |
| --------------- | -------- | -------- | --------------------------------------------------------------------------- |
| \_id            | ObjectId | Auto     | Content item document ID                                                    |
| courseId        | ObjectId | Yes      | Parent course reference                                                     |
| type            | string   | Yes      | Enum: video \| game — what kind of content this is                          |
| refId           | ObjectId | Yes      | Reference to Video document (if type=video) or Game document (if type=game) |
| order           | number   | Yes      | Sequential display order — 1-indexed, no gaps                               |
| title           | string   | Yes      | Display title shown in course content list                                  |
| description     | string   | No       | Short description shown in content list                                     |
| durationMinutes | number   | No       | Estimated time to complete this item                                        |
| isFree          | boolean  | Auto     | If true, accessible without purchase (for preview items). Default false     |
| isActive        | boolean  | Auto     | Soft-delete flag, default true                                              |

### Content Item Endpoints (Admin)

| Method | Path                                     | Description                                       | Auth  |
| ------ | ---------------------------------------- | ------------------------------------------------- | ----- |
| GET    | /admin/courses/:courseId/content         | List all content items in a course (ordered)      | Admin |
| POST   | /admin/courses/:courseId/content         | Add a content item (video or game activity)       | Admin |
| PUT    | /admin/content/:itemId                   | Update a content item (order, title, description) | Admin |
| DELETE | /admin/content/:itemId                   | Soft delete a content item                        | Admin |
| PUT    | /admin/courses/:courseId/content/reorder | Batch reorder content items                       | Admin |

### POST /admin/courses/:courseId/content — Request Body

| Field           | Type    | Required | Description                                                                  |
| --------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| type            | string  | Yes      | video \| game                                                                |
| refId           | string  | Yes      | ObjectId of Video or Game document to reference                              |
| order           | number  | Yes      | Position in the list — existing items at or above this order are shifted up  |
| title           | string  | Yes      | Display title for this content item                                          |
| description     | string  | No       | Short description                                                            |
| durationMinutes | number  | No       | Estimated completion time                                                    |
| isFree          | boolean | No       | If true, users can access without purchase (useful for first lesson preview) |

### GET /courses/:courseId/content — Response

```json
{
  "success": true,
  "data": {
    "courseId": "ObjectId",
    "title": "Behavioural Signal Intelligence",
    "contentItems": [
      {
        "_id": "ObjectId",
        "order": 1,
        "type": "video",
        "title": "Welcome to the Course",
        "durationMinutes": 5,
        "isFree": true,
        "userStatus": "completed"
      },
      {
        "_id": "ObjectId",
        "order": 2,
        "type": "video",
        "title": "Understanding Your Nervous System",
        "durationMinutes": 12,
        "userStatus": "in_progress"
      },
      {
        "_id": "ObjectId",
        "order": 3,
        "type": "game",
        "gameKey": "awareness_states",
        "title": "Awareness States Activity",
        "durationMinutes": 15,
        "userStatus": "not_started"
      }
    ],
    "progress": { "completed": 1, "total": 3, "percentComplete": 33 }
  }
}
```

## 4.4 Master Call

The Master Call is a single free pre-recorded video accessible to all registered users from their dashboard. It is hosted and managed by the admin (instructor). No purchase is required. There is one Master Call at any given time — the admin can update it by uploading a new video.

| Method | Path               | Description                             | Auth   |
| ------ | ------------------ | --------------------------------------- | ------ |
| GET    | /master-call       | Get Master Call info and stream URL     | Bearer |
| POST   | /admin/master-call | Upload or replace the Master Call video | Admin  |
| PATCH  | /admin/master-call | Update title, description               | Admin  |

### Master Call Schema (MongoDB)

| Field           | Type     | Required | Description                                               |
| --------------- | -------- | -------- | --------------------------------------------------------- |
| \_id            | ObjectId | Auto     | Document ID — only one document in this collection        |
| title           | string   | Yes      | Title displayed on the dashboard                          |
| description     | string   | No       | Description shown below the video                         |
| bunnyVideoId    | string   | Yes      | Bunny.net video GUID                                      |
| durationSeconds | number   | Auto     | Set after Bunny encoding webhook fires                    |
| thumbnail       | string   | No       | Thumbnail image URL                                       |
| isActive        | boolean  | Auto     | If false, Master Call is hidden. Default true             |
| updatedAt       | Date     | Auto     | Last updated timestamp — shown to users as 'last updated' |
| createdAt       | Date     | Auto     | Creation timestamp                                        |

### GET /master-call — Response

```json
{
  "success": true,
  "data": {
    "title": "Monthly Master Call — May 2025",
    "description": "Join us for this month's deep dive...",
    "streamUrl": "https://yourbeep.b-cdn.net/video-id/playlist.m3u8?token=...&expires=...",
    "expiresIn": 3600,
    "durationSeconds": 3600,
    "thumbnail": "https://...",
    "updatedAt": "2025-05-01T00:00:00.000Z"
  }
}
```

> ℹ️ The stream URL is a signed Bunny.net URL valid for 1 hour. The client must re-fetch to get a fresh URL if the session exceeds 1 hour.

## 4.5 Video Hosting (Bunny.net Stream)

All course videos and the Master Call are hosted on Bunny.net Stream. Bunny handles encoding, CDN delivery, and adaptive bitrate streaming. The backend generates signed HLS URLs that expire after 1 hour. Users must have a valid course purchase (or be watching the Master Call) to receive a signed URL.

### Video Schema (MongoDB)

| Field           | Type     | Required | Description                                                     |
| --------------- | -------- | -------- | --------------------------------------------------------------- |
| \_id            | ObjectId | Auto     | MongoDB document ID                                             |
| courseId        | ObjectId | Yes      | Which course this video belongs to. Null for Master Call videos |
| title           | string   | Yes      | Video title                                                     |
| description     | string   | No       | Short description                                               |
| bunnyVideoId    | string   | Yes      | Bunny Stream video GUID                                         |
| bunnyLibraryId  | string   | Yes      | Bunny Stream library ID                                         |
| durationSeconds | number   | Auto     | Populated after Bunny encoding webhook fires                    |
| thumbnailUrl    | string   | Auto     | Auto-generated by Bunny — populated after encoding              |
| order           | number   | Yes      | Display order within the course content list                    |
| isMasterCall    | boolean  | Auto     | True if this video is the master call. Default false            |
| isActive        | boolean  | Auto     | Soft-delete flag — becomes true after encoding completes        |
| uploadedBy      | ObjectId | Yes      | Admin user who uploaded this video                              |
| createdAt       | Date     | Auto     | Upload timestamp                                                |

### Video Endpoints

| Method | Path                                       | Description                                  | Auth   |
| ------ | ------------------------------------------ | -------------------------------------------- | ------ |
| POST   | /admin/courses/:courseId/videos/upload-url | Get direct upload URL from Bunny.net         | Admin  |
| POST   | /admin/master-call/upload-url              | Get upload URL for Master Call video         | Admin  |
| POST   | /webhooks/bunny/stream                     | Bunny.net webhook — encoding complete        | Public |
| GET    | /courses/:courseId/videos/:videoId/stream  | Get signed stream URL (requires purchase)    | Bearer |
| GET    | /master-call/stream                        | Get signed stream URL for Master Call (free) | Bearer |
| PATCH  | /admin/videos/:videoId                     | Update video title, description, order       | Admin  |
| DELETE | /admin/videos/:videoId                     | Soft delete a video                          | Admin  |

### Upload Flow — Step by Step

1. Admin calls `POST /admin/courses/:courseId/videos/upload-url` with the video title
2. Server creates a Bunny video entry and returns a direct upload URL + internal video ID
3. Admin frontend uploads the video file directly to Bunny using the upload URL (PUT)
4. Bunny processes and encodes the video (typically 5–15 minutes for a 30-min video)
5. Bunny calls `POST /webhooks/bunny/stream` with Status=4 when encoding is complete
6. Server marks the video as isActive=true and populates durationSeconds

### POST /admin/courses/:courseId/videos/upload-url — Request Body

| Field       | Type   | Required | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| title       | string | Yes      | Video title. Max 200 characters        |
| description | string | No       | Video description. Max 1000 characters |
| order       | number | Yes      | Position in course content list        |

### POST /admin/.../upload-url — Response

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://video.bunnycdn.com/library/LIBRARY_ID/videos/VIDEO_GUID",
    "videoId": "ObjectId",
    "bunnyVideoId": "bunny-video-guid",
    "method": "PUT",
    "headers": {
      "AccessKey": "BUNNY_API_KEY",
      "Content-Type": "video/mp4"
    },
    "note": "Upload directly from admin client to this URL using PUT"
  }
}
```

### POST /webhooks/bunny/stream — Bunny Webhook Payload

```json
// Bunny sends this when encoding is complete (Status = 4)
{
  "VideoGuid": "bunny-video-guid",
  "VideoLibraryId": 123456,
  "Status": 4,
  "StorageSize": 524288000,
  "VideoLength": 1800
}
```

### GET /courses/:courseId/videos/:videoId/stream — Response

```json
{
  "success": true,
  "data": {
    "streamUrl": "https://yourbeep.b-cdn.net/VIDEO_GUID/playlist.m3u8?token=TOKEN&expires=EXPIRY",
    "expiresIn": 3600,
    "title": "Understanding Your Nervous System",
    "durationSeconds": 720,
    "thumbnailUrl": "https://yourbeep.b-cdn.net/VIDEO_GUID/thumbnail.jpg"
  }
}
```

### Signed URL Generation (Bunny Token Auth)

```js
// Bunny signed URL formula
const expires = Math.floor(Date.now() / 1000) + 3600;
const path = `/${bunnyVideoId}/playlist.m3u8`;
const hashInput = BUNNY_TOKEN_AUTH_KEY + path + expires;
const token = crypto
  .createHash("sha256")
  .update(hashInput)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

const signedUrl = `https://yourbeep.b-cdn.net${path}?token=${token}&expires=${expires}`;
```

> ⚠️ **Warning:** The signed URL is only generated after verifying the user has a valid, non-expired CoursePurchase record with `accessGranted=true`. For the Master Call, any authenticated user receives a signed URL with no purchase check.

### Frontend Playback (HLS.js)

```html
<!-- Install: npm install hls.js -->
<video id="player" controls width="100%"></video>

<script>
  async function loadVideo(courseId, videoId) {
    const res = await authFetch(
      `/courses/${courseId}/videos/${videoId}/stream`,
    );
    const { data } = await res.json();
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(data.streamUrl);
      hls.attachMedia(document.getElementById("player"));
    }
  }
</script>
```

### Bunny.net Environment Variables

```
BUNNY_STREAM_API_KEY=your_bunny_stream_api_key
BUNNY_STREAM_LIBRARY_ID=your_library_id
BUNNY_CDN_HOSTNAME=yourbeep.b-cdn.net
BUNNY_TOKEN_AUTH_KEY=your_token_auth_key
```

## 4.6 Game Submissions & Scoring

Game submissions use a unified endpoint. The `type` field in the request body acts as the discriminator. All submissions are stored in a shared submissions collection with type-specific payload sub-documents. Each game scores on a 1–3 internal scale. The final course score is a weighted average.

| Method | Path                             | Description                           | Auth   |
| ------ | -------------------------------- | ------------------------------------- | ------ |
| POST   | /games/:gameId/submit            | Submit user response for a game       | Bearer |
| GET    | /games/:gameId/result            | Get user's computed result for a game | Bearer |
| GET    | /courses/:courseId/submissions   | Get all user submissions for a course | Bearer |
| GET    | /submissions/:submissionId       | Get a specific submission by ID       | Bearer |
| DELETE | /admin/submissions/:submissionId | Admin: hard delete a submission       | Admin  |

> ⚠️ **Warning:** `POST /games/:gameId/submit` checks for a valid CoursePurchase record before allowing submission. Returns `COURSE_NOT_PURCHASED` (403) if no valid, non-expired purchase exists.

### Base Submission Schema (MongoDB)

| Field       | Type     | Required | Description                                                                           |
| ----------- | -------- | -------- | ------------------------------------------------------------------------------------- |
| \_id        | ObjectId | Auto     | Unique submission ID                                                                  |
| userId      | ObjectId | Yes      | Submitting user                                                                       |
| gameId      | ObjectId | Yes      | Which game                                                                            |
| courseId    | ObjectId | Yes      | Which course                                                                          |
| type        | string   | Yes      | Discriminator: awareness_states \| somatic_states \| pattern_awareness \| reflect_act |
| payload     | object   | Yes      | Type-specific data — see sections 4.7–4.10                                            |
| score       | number   | Auto     | Computed overall score (1.0–3.0)                                                      |
| isComplete  | boolean  | Auto     | True when all required steps are done                                                 |
| completedAt | Date     | Auto     | Set when isComplete becomes true                                                      |
| createdAt   | Date     | Auto     | First saved timestamp                                                                 |
| updatedAt   | Date     | Auto     | Last modified timestamp                                                               |

## 4.7 Awareness States Game

The user flows through up to 7 sequential steps. The backend evaluates energy orientation and flow stability based on selections and returns a result mapping. The final submission includes activation selections, expansion selections, value system domains, and root cause assignments.

### Submission Flow

| Step   | Name             | Description                                                               |
| ------ | ---------------- | ------------------------------------------------------------------------- |
| Step 1 | Daily Activation | Select up to 2 states from activation grid (6 options)                    |
| Step 2 | Result Mapping   | Read-only: backend returns Energy Orientation + Flow Stability for step 1 |
| Step 3 | Expansion Check  | Select up to 2 states from expansion grid (6 options)                     |
| Step 4 | Result Mapping   | Read-only: backend returns Energy Orientation + Flow Stability for step 3 |
| Step 5 | Value System     | Select 2 High Point domains + 2 Low Point domains from 7 domain options   |
| Step 6 | Root Cause       | For each of the 4 domain selections, pick 1 root cause from 4 options     |
| Step 7 | Summary          | Read-only summary card generated from all selections                      |

### POST /games/:gameId/submit — Request Body

```json
{
  "type": "awareness_states",
  "step": 3,
  "payload": {
    "activationSelections": ["alert_nervous", "calm_steady"],
    "expansionSelections": ["protection_resistance", "joy_abundance"],
    "valueSystems": {
      "highPoints": ["work", "personal_development"],
      "lowPoints": ["finances", "family"]
    },
    "rootCauses": {
      "work": "learned_emotional_strategy",
      "personal_development": "unmet_need",
      "finances": "recurring_environmental_stressor",
      "family": "protective_belief_or_meaning"
    }
  }
}
```

### Awareness States — Request Schema

| Field                           | Type     | Required      | Description                                                                        |
| ------------------------------- | -------- | ------------- | ---------------------------------------------------------------------------------- |
| type                            | string   | Yes           | Must be `awareness_states`                                                         |
| step                            | number   | Yes           | 1 = after activation; 2 = after expansion; 3 = final (includes value + root cause) |
| payload.activationSelections    | string[] | Yes           | 1–2 items from activation grid enum                                                |
| payload.expansionSelections     | string[] | Yes (step 2+) | 1–2 items from expansion grid enum                                                 |
| payload.valueSystems.highPoints | string[] | Yes (step 3)  | Exactly 2 domain keys                                                              |
| payload.valueSystems.lowPoints  | string[] | Yes (step 3)  | Exactly 2 domain keys — must not overlap with highPoints                           |
| payload.rootCauses              | object   | Yes (step 3)  | Map of domain key → root cause enum for all 4 selected domains                     |

### Enumerations

**Activation Grid**

```
excitement_enthusiasm
alert_nervous
irritation_rage
calm_steady
resilient_contesting
stuck_rigid
```

**Expansion Grid**

```
joy_abundance
surprise_embrace
spiralling_enveloped
compassion_acceptance
protection_resistance
repress_conflicted
```

**Domain Keys**

```
work
relationships
family
finances
personal_development
health
previous_stress
```

**Root Cause Keys**

```
learned_emotional_strategy
recurring_environmental_stressor
protective_belief_or_meaning
unmet_need
```

### Energy Orientation Mapping

| State                 | Energy Orientation | Flow Stability | Label  |
| --------------------- | ------------------ | -------------- | ------ |
| excitement_enthusiasm | Activation ↑       | Equilibrium    | Stable |
| alert_nervous         | Activation ↑       | Waver          | Waver  |
| irritation_rage       | Activation ↑       | Chaos          | Chaos  |
| calm_steady           | Grounding ↓        | Equilibrium    | Stable |
| resilient_contesting  | Grounding ↓        | Waver          | Waver  |
| stuck_rigid           | Grounding ↓        | Chaos          | Chaos  |
| joy_abundance         | Expansion ↔        | Equilibrium    | Stable |
| surprise_embrace      | Expansion ↔        | Waver          | Waver  |
| spiralling_enveloped  | Expansion ↔        | Chaos          | Chaos  |
| compassion_acceptance | Embodiment →←      | Equilibrium    | Stable |
| protection_resistance | Embodiment →←      | Waver          | Waver  |
| repress_conflicted    | Embodiment →←      | Chaos          | Chaos  |

### Result Mapping Response

```json
{
  "success": true,
  "data": {
    "resultMapping": {
      "detectedState": "Alert & Nervous",
      "energyOrientation": {
        "label": "Activation",
        "description": "Heightened neural response and systemic readiness..."
      },
      "flowStability": {
        "label": "Waver",
        "description": "Oscillating focus marked by internal tension..."
      },
      "stateSynthesis": {
        "title": "Friction in the Pathway",
        "description": "The intersection of Activation and Waver indicates..."
      },
      "metrics": { "sensoryLoad": "87%", "vagalInterference": "High" }
    }
  }
}
```

### Awareness States Submission Schema (MongoDB)

| Field                | Type     | Required | Description                                   |
| -------------------- | -------- | -------- | --------------------------------------------- |
| \_id                 | ObjectId | Auto     | Submission document ID                        |
| userId               | ObjectId | Yes      | Reference to User                             |
| gameId               | ObjectId | Yes      | Reference to Game                             |
| courseId             | ObjectId | Yes      | Reference to Course                           |
| activationSelections | string[] | Yes      | Enum values selected in step 1                |
| expansionSelections  | string[] | Yes      | Enum values selected in step 3                |
| valueSystems         | object   | Yes      | { highPoints: string[], lowPoints: string[] } |
| rootCauses           | object   | Yes      | Map of domain → rootCause string              |
| resultMapping        | object   | Auto     | Computed energy orientation + flow stability  |
| summary              | object   | Auto     | Final awareness summary with all sections     |
| score                | number   | Auto     | Computed score (1–3)                          |
| completedAt          | Date     | Auto     | ISO timestamp when final step submitted       |

## 4.8 Somatic States Game

The user selects body regions and for each region selects a sensation. The backend returns an ordered sequence of awareness tests and exercises based on the region+sensation combination.

### Submission Flow

| Step   | Name              | Description                                                                          |
| ------ | ----------------- | ------------------------------------------------------------------------------------ |
| Step 1 | Body Map          | User taps a body region: head, face_throat, heart, chest, stomach, hands_legs        |
| Step 2 | Select Sensation  | User selects one sensation option for that region (see enums below)                  |
| Step 3 | Activity Sequence | Backend returns ordered awareness tests + exercises for region+sensation combination |
| Step 4 | Complete/Skip     | User completes or skips each activity — completion is logged per step                |
| Step 5 | Repeat            | User may tap additional body regions and repeat steps 1–4                            |
| Step 6 | Final Submit      | User submits all region selections and activity results at once                      |

### POST /games/:gameId/submit — Somatic States

```json
{
  "type": "somatic_states",
  "payload": {
    "regions": [
      {
        "region": "head",
        "sensation": "bright_clear_focus",
        "activities": [
          {
            "activityKey": "60_second_cognitive_check",
            "completed": true,
            "skipped": false,
            "durationSeconds": 60
          },
          {
            "activityKey": "expand_the_window",
            "completed": true,
            "skipped": false,
            "durationSeconds": 300
          }
        ]
      },
      {
        "region": "face_throat",
        "sensation": "subtle_tension",
        "activities": [
          {
            "activityKey": "clench_detection_drill",
            "completed": true,
            "skipped": false
          },
          {
            "activityKey": "jaw_awareness_reset",
            "completed": false,
            "skipped": true
          }
        ]
      }
    ]
  }
}
```

### Somatic States Submission Schema

| Field                        | Type    | Required | Description                                                          |
| ---------------------------- | ------- | -------- | -------------------------------------------------------------------- |
| type                         | string  | Yes      | Must be `somatic_states`                                             |
| payload.regions              | array   | Yes      | Array of region objects; min 1, max 6                                |
| payload.regions[].region     | string  | Yes      | Enum: head \| face_throat \| heart \| chest \| stomach \| hands_legs |
| payload.regions[].sensation  | string  | Yes      | Sensation key for that region — see activity sequences below         |
| payload.regions[].activities | array   | Yes      | Array of activity completion records                                 |
| activities[].activityKey     | string  | Yes      | Unique activity identifier from the sequence                         |
| activities[].completed       | boolean | Yes      | Whether the user finished the activity                               |
| activities[].skipped         | boolean | Yes      | Whether the user clicked Skip Activity                               |
| activities[].durationSeconds | number  | No       | Time spent on timed exercises                                        |
| activities[].response        | object  | No       | Optional structured response for test-type activities                |

### Region Sensation Enums & Activity Sequences

**Head**

| Sensation          | Activity Sequence                                             |
| ------------------ | ------------------------------------------------------------- |
| bright_clear_focus | 60_second_cognitive_check → expand_the_window                 |
| dizzy_spacey       | co2_indicator → co2_rebalancing → sensory_anchoring           |
| heaviness_fog      | flexibility_check → cognitive_diffusion_drill → fatigue_check |

**Face & Throat**

| Sensation        | Activity Sequence                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| relaxed_bright   | (No activities — record state only)                                                                                             |
| subtle_tension   | clench_detection_drill → jaw_awareness_reset → throat_openness_check → belly_breathing → neck_release_awareness → shoulder_drop |
| excessive_clench | clench_detection_drill → jaw_awareness_reset → throat_openness_check → belly_breathing → neck_release_awareness → shoulder_drop |

**Heart**

| Sensation                   | Activity Sequence                                                             |
| --------------------------- | ----------------------------------------------------------------------------- |
| steady_heart_integration    | baseline_pulse_awareness                                                      |
| increasing_pulse_activation | activation_differentiation_test → coherence_breathing                         |
| the_release_expansion       | expansion_allowance → sternum_pec_stretch                                     |
| pounding_heart_waver        | activation_differentiation_test → coherence_breathing → shoulder_neck_stretch |
| heart_ache_chaos            | expansion_allowance → sternum_pec_stretch                                     |

**Chest**

| Sensation | Activity Sequence                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| calm      | diaphragmatic_baseline_check → 360_breathing                                                                    |
| unrest    | co2_check → breath_hold_exercise                                                                                |
| spiral    | co2_check → breath_hold_exercise                                                                                |
| tightness | chest_tightness_vulnerability_check → light_shoulder_arm_movements → lie_on_bed_head_back → sternum_pec_stretch |

**Stomach & Pelvis**

| Sensation   | Activity Sequence                                            |
| ----------- | ------------------------------------------------------------ |
| butterflies | belly_softening                                              |
| whirlpool   | abdominal_scan → belly_softening → safety_cue → gut_reaction |
| armour      | abdominal_scan → belly_softening → safety_cue → gut_reaction |

**Hands & Legs**

| Sensation  | Activity Sequence                                              |
| ---------- | -------------------------------------------------------------- |
| calm       | grounding_drill                                                |
| springy    | grounding_drill                                                |
| sluggish   | freeze_check → rhythmic_grounding                              |
| fidgety    | fist_clench_release → shoulder_drop                            |
| braced     | fist_clench_release → shoulder_drop → proprioception_grounding |
| contracted | fist_clench_release → shoulder_drop → proprioception_grounding |

### Activity Detail Endpoint

| Method | Path                                   | Description                                   | Auth   |
| ------ | -------------------------------------- | --------------------------------------------- | ------ |
| GET    | /games/:gameId/activities/:activityKey | Get activity instructions, type, and duration | Bearer |

```json
{
  "success": true,
  "data": {
    "activityKey": "jaw_awareness_reset",
    "title": "Jaw Awareness Exercise",
    "subtitle": "Releasing Tension",
    "type": "timed_exercise",
    "instruction": "Drop the lower jaw. Allow a small gap...",
    "durationSeconds": 180,
    "canSkip": true,
    "ui": { "animationType": "timer_circle", "imageKey": "jaw_anatomy" }
  }
}
```

## 4.9 Pattern Awareness Game

Users perform 3 drawing/movement exercises. Each exercise produces a scored output across presence, action, and pattern parameters.

### Exercises

| Key               | Title             | Description                                                             |
| ----------------- | ----------------- | ----------------------------------------------------------------------- |
| draw_your_breath  | Map Your Breath   | Draw breathing pattern on canvas; track lift-offs, line length, spacing |
| awareness_circles | Awareness Circles | Draw concentric circles; assess completeness, size, overlap             |
| scribble_drawing  | Scribble Drawing  | Free-form scribble; assess spatial use, directional shifts, density     |

### POST /games/:gameId/submit — Pattern Awareness

```json
{
  "type": "pattern_awareness",
  "payload": {
    "exercises": [
      {
        "exerciseKey": "draw_your_breath",
        "durationSeconds": 245,
        "metrics": {
          "penLiftCount": 3,
          "totalLength": 820,
          "spatialCoverage": 0.72,
          "controlLimitSpacing": "medium",
          "intervalPattern": "narrow_to_wide"
        }
      },
      {
        "exerciseKey": "awareness_circles",
        "durationSeconds": 180,
        "metrics": {
          "penLiftCount": 1,
          "circleCompleteness": 0.85,
          "spatialCoverage": 0.61,
          "circlePattern": "scattered"
        }
      },
      {
        "exerciseKey": "scribble_drawing",
        "durationSeconds": 300,
        "metrics": {
          "penLiftCount": 5,
          "lineSpacing": "wide",
          "spatialCoverage": 0.8,
          "directionPattern": "defined_spatial"
        }
      }
    ]
  }
}
```

### Scoring Criteria

| Criterion                       | Range | Description                                                     |
| ------------------------------- | ----- | --------------------------------------------------------------- |
| Presence & Attention — Breaks   | 1–3   | 3 = few pen lifts; 2 = moderate; 1 = many pen lifts             |
| Presence & Attention — Duration | 1–3   | 3 = 4–5 min; 2 = 2–4 min; 1 = 0–2 min                           |
| Action — Variability            | 1–3   | 3 = more spacing in control limits; 1 = less spacing            |
| Action — Boldness               | 1–3   | 3 = higher intervals; 1 = crowded/narrow                        |
| Action — Vision                 | 1–3   | 3 = >75% spatial use; 2 = >40%; 1 = <40%                        |
| Pattern                         | 1–3   | 3 = defined+spatial; 2 = undefined scattered; 1 = tight+defined |

### Pattern Awareness Submission Schema (MongoDB)

| Field         | Type     | Required | Description                                                   |
| ------------- | -------- | -------- | ------------------------------------------------------------- |
| \_id          | ObjectId | Auto     | Submission document ID                                        |
| userId        | ObjectId | Yes      | Reference to User                                             |
| gameId        | ObjectId | Yes      | Reference to Game                                             |
| courseId      | ObjectId | Yes      | Reference to Course                                           |
| exercises     | array    | Yes      | Array of { exerciseKey, durationSeconds, metrics, scores }    |
| presenceScore | number   | Auto     | Computed: avg of breaks + duration scores (1–3)               |
| actionScore   | number   | Auto     | Computed: avg of variability + boldness + vision scores (1–3) |
| patternScore  | number   | Auto     | Computed: pattern score (1–3)                                 |
| overallScore  | number   | Auto     | Average of presenceScore, actionScore, and patternScore       |
| completedAt   | Date     | Auto     | ISO timestamp                                                 |

## 4.10 Reflect & Act Game

Reflect & Act aggregates scores from Awareness States, Somatic States, and Pattern Awareness to produce a final synthesis and recommend an action category. It cannot be submitted until the other three games have at least one completed submission each.

> ⚠️ **Warning:** Reflect & Act cannot be submitted until all three preceding games have at least one completed submission. Returns `PREREQUISITES_NOT_MET` (422) if attempted early.

### GET /games/:gameId/result — Pre-computed Reflect Data

```json
{
  "success": true,
  "data": {
    "sections": {
      "emotionalState": {
        "score": 2,
        "label": "Waver",
        "source": "awareness_states"
      },
      "physiology": {
        "score": 2,
        "label": "Mixed",
        "source": "somatic_states"
      },
      "presenceAttention": {
        "score": 1,
        "label": "Low",
        "source": "pattern_awareness"
      },
      "action": {
        "score": 2,
        "label": "Medium",
        "source": "pattern_awareness"
      },
      "pattern": { "score": 3, "label": "High", "source": "pattern_awareness" }
    },
    "totals": {
      "sum": 10,
      "average": 2.0,
      "percentage": "66%",
      "maxPossible": 15
    },
    "recommendedAction": "remediation",
    "actionDescription": "Total score is between 8-12 indicating moderate remediation focus"
  }
}
```

### Action Recommendation Logic

| Action      | Criteria                                                                              |
| ----------- | ------------------------------------------------------------------------------------- |
| acceptance  | Total score ≥ 13 OR cumulative ≥ 3; consistent 3s and 2s                              |
| transfer    | Total score ≥ 13 OR cumulative ≥ 3; 3s in emotional, functional application confirmed |
| remediation | Total score 8–12; cumulative between -2 to 1                                          |
| redesign    | Constant 1s and 2s; total score ≤ 7 OR cumulative ≤ -3                                |
| no_action   | Reserved for edge cases — TBD                                                         |

### POST /games/:gameId/submit — Reflect & Act

```json
{
  "type": "reflect_act",
  "payload": {
    "userReflectionNotes": "Optional free text from the user",
    "acknowledgedAction": "remediation"
  }
}
```

### Reflect & Act Submission Schema (MongoDB)

| Field               | Type     | Required | Description                                                                      |
| ------------------- | -------- | -------- | -------------------------------------------------------------------------------- |
| \_id                | ObjectId | Auto     | Submission document ID                                                           |
| userId              | ObjectId | Yes      | Reference to User                                                                |
| gameId              | ObjectId | Yes      | Reference to Game                                                                |
| courseId            | ObjectId | Yes      | Reference to Course                                                              |
| sourceSubmissions   | object   | Auto     | { awarenessId, somaticId, patternId } — ObjectId refs to source submissions      |
| scores              | object   | Auto     | { emotionalState, physiology, presenceAttention, action, pattern } — all numbers |
| totalScore          | number   | Auto     | Sum of all 5 section scores                                                      |
| averageScore        | number   | Auto     | Mean of all 5 section scores                                                     |
| recommendedAction   | string   | Auto     | Enum: acceptance \| transfer \| remediation \| redesign \| no_action             |
| userReflectionNotes | string   | No       | Optional free text from user, max 2000 chars                                     |
| acknowledgedAction  | string   | No       | The action the user acknowledged in the UI                                       |
| completedAt         | Date     | Auto     | ISO timestamp                                                                    |

## 4.11 Final Score Calculation

The final course score is a weighted average across all games in the course, using the weights the admin defined when building the course. The final score is only calculated once the user has submitted all games.

### Formula

```
Final Score = Σ (game_score × game_weight) / 100

Example:
  awareness_states   score: 2.5  weight: 30%  →  weighted: 0.75
  somatic_states     score: 2.0  weight: 25%  →  weighted: 0.50
  pattern_awareness  score: 1.5  weight: 25%  →  weighted: 0.375
  reflect_act        score: 3.0  weight: 20%  →  weighted: 0.60
  ─────────────────────────────────────────────────────────
  Final Score: 2.225 / 3.0
```

> ℹ️ Partial progress is tracked but no final course score is emitted until all games in the course have been completed by the user.

---

# 5. Service 3 — Commerce

The Commerce Service owns all payment, purchase, subscription, access control, and refund logic. It runs on port 4003 and connects to the `yourbeep_commerce` MongoDB database. All payments are processed via Stripe. Purchases are available on web only — mobile users cannot initiate purchases.

## 5.1 Regional Pricing

Each course has a pricing array — one entry per supported region. The price shown to the user is determined by their region. Region detection uses two layers: IP-based primary and phone number country code secondary.

| Method | Path                             | Description                                 | Auth   |
| ------ | -------------------------------- | ------------------------------------------- | ------ |
| GET    | /courses/:courseId/price         | Get regional price for a course based on IP | Public |
| GET    | /courses/:courseId/price/:region | Get price for a specific region             | Public |

### Pricing Sub-document

| Field              | Type   | Required | Description                                                                |
| ------------------ | ------ | -------- | -------------------------------------------------------------------------- |
| region             | string | Yes      | ISO 3166-1 alpha-2 country code e.g. IN, US, CA, GB                        |
| currency           | string | Yes      | ISO 4217 currency code e.g. INR, USD, CAD, GBP                             |
| amount6mo          | number | Yes      | 6-month plan price in smallest logical unit (e.g. 999 for ₹999)            |
| amount1yr          | number | Yes      | Annual plan price in smallest logical unit (e.g. 1499 for ₹1499)           |
| stripeProductId6mo | string | Auto     | Stripe Product ID for the 6-month plan — set after Stripe product creation |
| stripeProductId1yr | string | Auto     | Stripe Product ID for the annual plan — set after Stripe product creation  |
| stripePriceId6mo   | string | Auto     | Stripe Price ID for 6-month plan in this region's currency                 |
| stripePriceId1yr   | string | Auto     | Stripe Price ID for annual plan in this region's currency                  |

### Region Detection

| Method    | Type               | Description                                                                                                      |
| --------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Primary   | IP-based           | Detect user's country from IP on page load using IP geolocation                                                  |
| Secondary | Phone country code | At checkout — verify phone country code against IP-detected region. Mismatch is flagged and phone takes priority |

### GET /courses/:courseId/price — Response

```json
{
  "success": true,
  "data": {
    "courseId": "ObjectId",
    "region": "IN",
    "currency": "INR",
    "plans": {
      "sixMonth": {
        "amount": 999,
        "displayPrice": "₹999",
        "planType": "six_month",
        "stripePriceId": "price_xxx"
      },
      "annual": {
        "amount": 1499,
        "displayPrice": "₹1,499",
        "planType": "annual",
        "savings": "₹499",
        "stripePriceId": "price_yyy"
      }
    },
    "detectionMethod": "ip"
  }
}
```

## 5.2 Course Purchase (Stripe)

A user must purchase a course before accessing its games and videos. Payment is web-only via Stripe Checkout. The purchase creates a CoursePurchase record which drives all access control. A user cannot purchase the same course twice while an active subscription exists.

| Method | Path                                          | Description                                                    | Auth   |
| ------ | --------------------------------------------- | -------------------------------------------------------------- | ------ |
| POST   | /commerce/courses/:courseId/purchase/initiate | Initiate purchase — returns Stripe Checkout Session URL        | Bearer |
| POST   | /commerce/courses/:courseId/purchase/confirm  | Confirm payment — grants access (called after Stripe redirect) | Bearer |
| GET    | /commerce/courses/:courseId/access            | Check if current user has valid access to a course             | Bearer |
| GET    | /commerce/purchases                           | Get all purchases for the current user                         | Bearer |
| POST   | /webhooks/stripe                              | Stripe webhook for payment events                              | Public |

### POST /commerce/courses/:courseId/purchase/initiate — Request Body

| Field            | Type   | Required | Description                                                                    |
| ---------------- | ------ | -------- | ------------------------------------------------------------------------------ |
| planType         | string | Yes      | six_month \| annual — which plan the user is purchasing                        |
| phoneCountryCode | string | No       | Country code from user's phone number e.g. +91. Used for region mismatch check |
| successUrl       | string | Yes      | URL to redirect after successful Stripe Checkout (web only)                    |
| cancelUrl        | string | Yes      | URL to redirect if user cancels Stripe Checkout                                |

### POST /commerce/courses/:courseId/purchase/initiate — Response

```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_...",
    "sessionId": "cs_test_...",
    "purchaseId": "ObjectId",
    "expiresAt": "2025-01-01T00:30:00.000Z"
  }
}
```

> ℹ️ The client redirects the user to `checkoutUrl`. Stripe handles the payment form. On success, Stripe redirects back to `successUrl` with a `session_id` parameter.

### CoursePurchase Schema (MongoDB)

| Field                 | Type     | Required | Description                                                                  |
| --------------------- | -------- | -------- | ---------------------------------------------------------------------------- |
| \_id                  | ObjectId | Auto     | Purchase document ID                                                         |
| userId                | ObjectId | Yes      | Reference to User                                                            |
| courseId              | ObjectId | Yes      | Reference to Course                                                          |
| planType              | string   | Yes      | Enum: six_month \| annual                                                    |
| status                | string   | Auto     | Enum: pending \| active \| expired \| cancelled \| refunded. Default pending |
| region                | string   | Yes      | ISO country code at time of purchase                                         |
| currency              | string   | Yes      | Currency used for this purchase                                              |
| amountPaid            | number   | Yes      | Amount paid in smallest unit                                                 |
| stripePriceId         | string   | Yes      | Stripe Price ID used for this transaction                                    |
| stripeSessionId       | string   | Yes      | Stripe Checkout Session ID                                                   |
| stripePaymentIntentId | string   | Auto     | Stripe Payment Intent ID — populated after payment confirmation              |
| stripeRefundId        | string   | No       | Stripe Refund ID — populated if refunded                                     |
| detectedRegionIp      | string   | Yes      | Country code detected from IP at time of purchase                            |
| phoneCountryCode      | string   | No       | Country code from phone number (for mismatch check)                          |
| regionMismatch        | boolean  | Auto     | True if IP region and phone country code differ                              |
| accessGranted         | boolean  | Auto     | True once payment confirmed by Stripe. Default false                         |
| startDate             | Date     | Auto     | Date access was granted (payment confirmed timestamp)                        |
| expiryDate            | Date     | Auto     | startDate + 6 months OR startDate + 12 months based on planType              |
| renewedFromId         | ObjectId | No       | Reference to previous CoursePurchase if this is a renewal                    |
| purchasedAt           | Date     | Auto     | Timestamp of successful payment confirmation                                 |

## 5.3 Subscription Plans

| Plan      | Duration           | Expiry Logic                                                   |
| --------- | ------------------ | -------------------------------------------------------------- |
| six_month | 6 Calendar Months  | startDate + 6 months to the day. E.g. Jan 1 → Jul 1            |
| annual    | 12 Calendar Months | startDate + 12 months to the day. E.g. Jan 1 → Jan 1 next year |

### Plan Expiry Logic

```js
// startDate is set to the timestamp of payment confirmation

if (planType === "six_month") {
  expiryDate = addMonths(startDate, 6);
} else if (planType === "annual") {
  expiryDate = addMonths(startDate, 12);
}

// Access check
const hasAccess = purchase.accessGranted && new Date() < purchase.expiryDate;
```

### Access States

| Status    | Meaning                             | Access                               |
| --------- | ----------------------------------- | ------------------------------------ |
| pending   | Payment initiated but not confirmed | No access                            |
| active    | Payment confirmed, not yet expired  | Full access to all course content    |
| expired   | Subscription period has ended       | No access — user sees renewal prompt |
| cancelled | Admin cancelled the purchase        | No access                            |
| refunded  | Refund issued                       | Access revoked from refund date      |

## 5.4 Access Control

Access is checked on every game submission, video stream URL request, and course content fetch. The check is: does a CoursePurchase record exist for this `userId + courseId` where `status=active` AND `expiryDate` is in the future?

### GET /commerce/courses/:courseId/access — Response

```json
{
  "success": true,
  "data": {
    "hasAccess": true,
    "purchase": {
      "purchaseId": "ObjectId",
      "planType": "annual",
      "status": "active",
      "startDate": "2025-01-01T00:00:00.000Z",
      "expiryDate": "2026-01-01T00:00:00.000Z",
      "daysRemaining": 180
    }
  }
}

// No access response
{
  "success": true,
  "data": {
    "hasAccess": false,
    "reason": "expired",
    "expiredAt": "2025-06-01T00:00:00.000Z",
    "canRenew": true
  }
}
```

## 5.5 Renewals & Expiry

Users can renew before or after their subscription expires. Renewing before expiry extends from the current expiryDate. Renewing after expiry starts fresh from the payment date. A user cannot purchase the same course while an active (non-expired) subscription exists.

| Method | Path                                       | Description                                            | Auth   |
| ------ | ------------------------------------------ | ------------------------------------------------------ | ------ |
| POST   | /commerce/courses/:courseId/renew/initiate | Initiate renewal — returns Stripe Checkout Session URL | Bearer |
| POST   | /commerce/courses/:courseId/renew/confirm  | Confirm renewal payment and extend access              | Bearer |

### Renewal Logic

```js
// If renewing BEFORE expiry:
newExpiryDate = addMonths(currentExpiryDate, planMonths);
// e.g. Annual expires Jan 1 2026 → renew → expires Jan 1 2027

// If renewing AFTER expiry:
newExpiryDate = addMonths(paymentConfirmedAt, planMonths);
// e.g. Expired Jan 1 2026, renew Feb 1 2026 → expires Feb 1 2027

// New CoursePurchase record is created for each renewal
// renewedFromId links to the previous purchase
```

### Expiry Notifications (sent via Identity Service)

| Timing               | Type                  | Message                                                 |
| -------------------- | --------------------- | ------------------------------------------------------- |
| 7 days before expiry | subscription_expiring | Your access to [Course] expires in 7 days               |
| 3 days before expiry | subscription_expiring | Your access to [Course] expires in 3 days               |
| Day of expiry        | subscription_expired  | Your access to [Course] has expired — renew to continue |

> ℹ️ These are sent via a daily cron job in the Commerce Service that queries CoursePurchase records with upcoming expiryDates.

## 5.6 Refunds

The admin can issue refunds through the admin panel. Refunds are processed via the Stripe Refunds API. On successful refund, access is revoked immediately and the purchase status is updated to `refunded`. There is no self-serve refund flow for users — all refunds are admin-initiated.

| Method | Path                                         | Description                                       | Auth  |
| ------ | -------------------------------------------- | ------------------------------------------------- | ----- |
| POST   | /admin/commerce/purchases/:purchaseId/refund | Issue a refund and revoke access                  | Admin |
| GET    | /admin/commerce/purchases                    | List all purchases with filters                   | Admin |
| GET    | /admin/commerce/purchases/:purchaseId        | Get a specific purchase with full details         | Admin |
| GET    | /admin/commerce/revenue                      | Revenue summary with filters by period and region | Admin |

### POST /admin/commerce/purchases/:purchaseId/refund — Request Body

| Field         | Type   | Required | Description                                                                    |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------ |
| reason        | string | Yes      | Refund reason. Enum: duplicate \| fraudulent \| requested_by_customer \| other |
| notes         | string | No       | Internal admin notes. Max 500 characters                                       |
| partialAmount | number | No       | If provided, issues a partial refund of this amount. If omitted, full refund   |

### Refund Response

```json
{
  "success": true,
  "data": {
    "purchaseId": "ObjectId",
    "stripeRefundId": "re_...",
    "amountRefunded": 999,
    "currency": "INR",
    "status": "refunded",
    "accessRevoked": true,
    "revokedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Stripe Webhook Events Handled

| Event                         | Action                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| checkout.session.completed    | Payment confirmed — set accessGranted=true, set startDate + expiryDate, send purchase_confirmed notification |
| checkout.session.expired      | User did not complete checkout — mark purchase as cancelled                                                  |
| payment_intent.payment_failed | Payment failed — mark purchase as cancelled, notify user                                                     |
| charge.refunded               | Stripe refund confirmed — mark purchase as refunded, set accessGranted=false                                 |

> ⚠️ **Warning:** All payment processing happens server-side via Stripe webhooks. Never trust client-side confirmation alone. The `accessGranted` flag is only set true after the `checkout.session.completed` webhook fires.

---

# 6. Dashboard & Recommendations

The user dashboard aggregates data from across all three services. It shows the Master Call, user progress across purchased courses, and course recommendations. Recommendations are automatic and rule-based — generated by the Content Service based on the user's completed game scores.

## 6.1 Dashboard Endpoint

| Method | Path                | Description                                        | Auth   |
| ------ | ------------------- | -------------------------------------------------- | ------ |
| GET    | /users/me/dashboard | Get full dashboard data for the authenticated user | Bearer |

### GET /users/me/dashboard — Response

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "ObjectId",
      "name": "Alolika Sen",
      "userLevel": 3,
      "points": 450,
      "streakDays": 7
    },
    "masterCall": {
      "title": "Monthly Master Call — May 2025",
      "thumbnailUrl": "https://...",
      "durationSeconds": 3600,
      "updatedAt": "2025-05-01T00:00:00.000Z"
    },
    "purchases": [
      {
        "courseId": "ObjectId",
        "courseTitle": "Behavioural Signal Intelligence",
        "planType": "annual",
        "status": "active",
        "expiryDate": "2026-01-01T00:00:00.000Z",
        "daysRemaining": 248,
        "progress": {
          "gamesCompleted": 2,
          "gamesTotal": 4,
          "percentComplete": 50
        },
        "finalScore": null
      }
    ],
    "recommendations": [
      {
        "courseId": "ObjectId",
        "title": "Advanced Somatic Integration",
        "reason": "Based on your pattern awareness scores, this course will help...",
        "thumbnailUrl": "https://...",
        "pricing": {
          "region": "IN",
          "currency": "INR",
          "plans": {
            "sixMonth": { "displayPrice": "₹999" },
            "annual": { "displayPrice": "₹1,499" }
          }
        }
      }
    ]
  }
}
```

## 6.2 Recommendation Engine

Recommendations are automatically generated by the Content Service based on a user's completed game scores and current purchases. The logic is rule-based and runs when a user completes a course or when the dashboard is fetched.

### Recommendation Rules

| Trigger                             | Action                                                    | Reason                                   |
| ----------------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| Low awareness_states score (<2.0)   | Recommend courses with high awareness_states weight       | Strengthen emotional pattern recognition |
| Low somatic_states score (<2.0)     | Recommend courses with high somatic_states weight         | Deepen body-mind connection work         |
| High pattern_awareness score (>2.5) | Recommend advanced courses requiring this as prerequisite | Ready for higher complexity              |
| reflect_act = redesign              | Recommend foundational courses                            | Rebuild from core principles             |
| reflect_act = transfer              | Recommend application-focused courses                     | Apply skills in new contexts             |
| No purchases yet                    | Recommend most popular / featured course                  | Entry point for new users                |

### Admin Recommendation Override

| Method | Path                             | Description                                                 | Auth  |
| ------ | -------------------------------- | ----------------------------------------------------------- | ----- |
| POST   | /admin/courses/:courseId/feature | Mark a course as featured (always shows in recommendations) | Admin |
| DELETE | /admin/courses/:courseId/feature | Remove featured flag                                        | Admin |

> ℹ️ Featured courses always appear in recommendations regardless of user score rules. Useful for new course launches.

---

# 7. Zod Validation Schemas (TypeScript)

All request bodies are validated with Zod before reaching handler logic. Zod schemas are shared across the relevant service's route files.

## 7.1 Game Submission Discriminated Union

```ts
// submission.schema.ts
const SubmissionSchema = z.discriminatedUnion("type", [
  AwarenessStatesSchema,
  SomaticStatesSchema,
  PatternAwarenessSchema,
  ReflectActSchema,
]);

// Middleware usage
app.post("/games/:id/submit", validate(SubmissionSchema), submitHandler);
```

## 7.2 Awareness States Schema

```ts
const ActivationEnum = z.enum([
  "excitement_enthusiasm",
  "alert_nervous",
  "irritation_rage",
  "calm_steady",
  "resilient_contesting",
  "stuck_rigid",
]);

const ExpansionEnum = z.enum([
  "joy_abundance",
  "surprise_embrace",
  "spiralling_enveloped",
  "compassion_acceptance",
  "protection_resistance",
  "repress_conflicted",
]);

const DomainEnum = z.enum([
  "work",
  "relationships",
  "family",
  "finances",
  "personal_development",
  "health",
  "previous_stress",
]);

const RootCauseEnum = z.enum([
  "learned_emotional_strategy",
  "recurring_environmental_stressor",
  "protective_belief_or_meaning",
  "unmet_need",
]);

const AwarenessStatesSchema = z.object({
  type: z.literal("awareness_states"),
  step: z.number().int().min(1).max(3),
  payload: z.object({
    activationSelections: z.array(ActivationEnum).min(1).max(2),
    expansionSelections: z.array(ExpansionEnum).min(1).max(2),
    valueSystems: z
      .object({
        highPoints: z.array(DomainEnum).length(2),
        lowPoints: z.array(DomainEnum).length(2),
      })
      .refine((v) => !v.highPoints.some((d) => v.lowPoints.includes(d)), {
        message: "Same domain cannot appear in both highPoints and lowPoints",
      }),
    rootCauses: z.record(DomainEnum, RootCauseEnum),
  }),
});
```

## 7.3 Somatic States Schema

```ts
const RegionEnum = z.enum([
  "head",
  "face_throat",
  "heart",
  "chest",
  "stomach",
  "hands_legs",
]);

const ActivityLogSchema = z.object({
  activityKey: z.string().min(1),
  completed: z.boolean(),
  skipped: z.boolean(),
  durationSeconds: z.number().int().min(0).optional(),
  response: z.record(z.unknown()).optional(),
});

const SomaticStatesSchema = z.object({
  type: z.literal("somatic_states"),
  payload: z.object({
    regions: z
      .array(
        z.object({
          region: RegionEnum,
          sensation: z.string().min(1),
          activities: z.array(ActivityLogSchema),
        }),
      )
      .min(1)
      .max(6),
  }),
});
```

## 7.4 Pattern Awareness Schema

```ts
const ExerciseKeyEnum = z.enum([
  "draw_your_breath",
  "awareness_circles",
  "scribble_drawing",
]);

const PatternAwarenessSchema = z.object({
  type: z.literal("pattern_awareness"),
  payload: z.object({
    exercises: z
      .array(
        z.object({
          exerciseKey: ExerciseKeyEnum,
          durationSeconds: z.number().int().min(0),
          metrics: z.record(z.unknown()),
        }),
      )
      .min(1)
      .max(3),
  }),
});
```

## 7.5 Reflect & Act Schema

```ts
const ActionEnum = z.enum([
  "acceptance",
  "transfer",
  "remediation",
  "redesign",
  "no_action",
]);

const ReflectActSchema = z.object({
  type: z.literal("reflect_act"),
  payload: z.object({
    userReflectionNotes: z.string().max(2000).optional(),
    acknowledgedAction: ActionEnum.optional(),
  }),
});
```

## 7.6 Purchase Schema

```ts
const PlanTypeEnum = z.enum(["six_month", "annual"]);

const PurchaseInitiateSchema = z.object({
  planType: PlanTypeEnum,
  phoneCountryCode: z
    .string()
    .regex(/^\+[1-9]\d{0,3}$/)
    .optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const PurchaseConfirmSchema = z.object({
  sessionId: z.string().min(1),
});
```

## 7.7 Course Creation Schema

```ts
const CourseGameSchema = z.object({
  gameId: z.string().regex(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId
  weight: z.number().int().min(1).max(100),
});

const PricingSchema = z.object({
  region: z.string().length(2).toUpperCase(),
  currency: z.string().length(3).toUpperCase(),
  amount6mo: z.number().int().positive(),
  amount1yr: z.number().int().positive(),
});

const CourseCreateSchema = z.object({
  title: z.string().min(2).max(100),
  subtitle: z.string().max(160).optional(),
  description: z.string().min(10).max(5000),
  shortDescription: z.string().max(160).optional(),
  games: z
    .array(CourseGameSchema)
    .min(1)
    .max(10)
    .refine((games) => games.reduce((s, g) => s + g.weight, 0) === 100, {
      message: "Game weights must sum to exactly 100",
    }),
  durationMinutes: z.number().int().positive().optional(),
});
```

---

# 8. Error Code Reference

All errors follow the standard response envelope. Error codes are machine-readable strings used for client-side handling and logging.

## 8.1 Authentication Errors (Gateway / Identity Service)

| Error Code     | HTTP | Description                                                                          |
| -------------- | ---- | ------------------------------------------------------------------------------------ |
| TOKEN_EXPIRED  | 401  | Firebase ID token has expired — client should call getIdToken() to get a fresh token |
| TOKEN_INVALID  | 401  | Firebase ID token failed signature verification                                      |
| USER_NOT_FOUND | 401  | Firebase token is valid but no MongoDB user record exists — call /auth/sync first    |
| UNAUTHORIZED   | 403  | Valid token but user does not have permission for this action                        |
| FORBIDDEN      | 403  | Valid token but role is insufficient — admin access required                         |

## 8.2 Validation Errors

| Error Code                 | HTTP | Description                                                                               |
| -------------------------- | ---- | ----------------------------------------------------------------------------------------- |
| VALIDATION_ERROR           | 400  | Zod schema validation failed — details array in error.details contains field-level errors |
| INVALID_SELECTION_COUNT    | 422  | Wrong number of selections for a grid step (e.g. 3 activation items instead of max 2)     |
| DUPLICATE_DOMAIN_SELECTION | 422  | Same domain selected for both highPoints and lowPoints in value system                    |
| INVALID_WEIGHT_SUM         | 422  | Game weights in a course do not sum to exactly 100                                        |
| INVALID_PLAN_TYPE          | 422  | planType must be six_month or annual                                                      |

## 8.3 Resource Errors

| Error Code            | HTTP | Description                                                                       |
| --------------------- | ---- | --------------------------------------------------------------------------------- |
| NOT_FOUND             | 404  | Requested resource does not exist or has been soft-deleted                        |
| EMAIL_TAKEN           | 409  | Email address is already registered to another account                            |
| ALREADY_PURCHASED     | 409  | User already has an active subscription for this course and cannot purchase again |
| PREREQUISITES_NOT_MET | 422  | Reflect & Act submitted before all three prerequisite games are completed         |

## 8.4 Commerce Errors

| Error Code             | HTTP | Description                                                                                  |
| ---------------------- | ---- | -------------------------------------------------------------------------------------------- |
| COURSE_NOT_PURCHASED   | 403  | User has not purchased this course — access to games and videos is denied                    |
| SUBSCRIPTION_EXPIRED   | 403  | User had a purchase but the subscription period has ended — renewal required                 |
| PAYMENT_FAILED         | 402  | Stripe returned a payment failure — details in message field                                 |
| REGION_NOT_SUPPORTED   | 422  | No pricing found for the user's detected region — contact support                            |
| REGION_MISMATCH        | 422  | IP-detected region and phone number country code do not match — phone country takes priority |
| REFUND_NOT_ELIGIBLE    | 422  | Purchase is not eligible for refund — check refund policy                                    |
| STRIPE_WEBHOOK_INVALID | 400  | Stripe webhook signature verification failed                                                 |

## 8.5 Content Errors

| Error Code             | HTTP | Description                                                            |
| ---------------------- | ---- | ---------------------------------------------------------------------- |
| VIDEO_NOT_READY        | 425  | Video is still being encoded by Bunny.net — try again in a few minutes |
| VIDEO_NOT_FOUND        | 404  | Video does not exist, has been deleted, or isActive=false              |
| STREAM_URL_FAILED      | 500  | Could not generate signed Bunny.net stream URL — check service config  |
| UPLOAD_FAILED          | 500  | Video upload to Bunny.net provider failed — check BUNNY_STREAM_API_KEY |
| GAME_NOT_FOUND         | 404  | Game with this ID or key does not exist in the library                 |
| CONTENT_ITEM_NOT_FOUND | 404  | Course content item does not exist or has been soft-deleted            |

## 8.6 HTTP Status Code Reference

| Status                    | Meaning                                                        |
| ------------------------- | -------------------------------------------------------------- |
| 200 OK                    | Request succeeded — data in response                           |
| 201 Created               | Resource successfully created                                  |
| 400 Bad Request           | Zod validation failed — see error.details                      |
| 401 Unauthorized          | Missing, expired, or invalid Firebase ID token                 |
| 402 Payment Required      | Payment failed                                                 |
| 403 Forbidden             | Valid token but insufficient permissions or no course purchase |
| 404 Not Found             | Resource does not exist                                        |
| 409 Conflict              | Duplicate resource — email taken, already purchased, etc.      |
| 422 Unprocessable Entity  | Business logic validation error — see error.code               |
| 425 Too Early             | Resource exists but is not ready yet (video encoding)          |
| 429 Too Many Requests     | Rate limit exceeded                                            |
| 500 Internal Server Error | Unexpected server-side failure — logged server-side            |

---

# 9. Swagger / OpenAPI Configuration

Each microservice has its own Swagger instance. The API Gateway optionally aggregates them via Swagger UI proxy. All three use the same security scheme (Firebase Bearer token).

```ts
// swagger.config.ts (replicated in each service with correct title/port)
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "yourbeep — Identity Service", // Change per service
      version: "2.0.0",
      description: "Firebase Auth, User Profiles, Push Notifications",
    },
    servers: [
      {
        url: "https://api.yourbeep.com/v1",
        description: "Production (via Gateway)",
      },
      {
        url: "http://localhost:4001",
        description: "Identity Service (direct)",
      },
    ],
    components: {
      securitySchemes: {
        firebaseAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Firebase ID Token",
          description:
            "Firebase ID Token from client SDK — auto-refreshed by Firebase",
        },
      },
    },
    security: [{ firebaseAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts", "./src/schemas/**/*.ts"],
};

// Entry point (Bun)
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger UIs (development)
// Identity:  http://localhost:4001/api-docs
// Content:   http://localhost:4002/api-docs
// Commerce:  http://localhost:4003/api-docs
```

---

# 10. Inter-Service Communication

Services communicate with each other over plain HTTP on the internal network. External clients never call service ports directly — all traffic goes through the API Gateway. Internal endpoints are prefixed with `/internal` and do not require Firebase token verification (they trust the shared internal service key header).

## 10.1 Internal Service Key

```
// Internal requests must include this header:
X-Internal-Service-Key: <INTERNAL_SERVICE_SECRET>

// Set in environment variables on all services:
INTERNAL_SERVICE_SECRET=long_random_secret_shared_across_all_services
```

## 10.2 Internal Endpoint Map

| Method | Path                                  | Description                                                        | Auth        |
| ------ | ------------------------------------- | ------------------------------------------------------------------ | ----------- |
| GET    | /internal/users/:userId               | Identity → Any: fetch user by MongoDB ID                           | Service Key |
| GET    | /internal/users/firebase/:uid         | Identity → Any: fetch user by Firebase UID                         | Service Key |
| DELETE | /internal/users/:userId/subscriptions | Identity → Commerce: cancel all subscriptions on account deletion  | Service Key |
| GET    | /internal/purchases/:userId/:courseId | Commerce → Content: verify user has valid access                   | Service Key |
| POST   | /internal/notifications/send          | Commerce → Identity: trigger push notifications on purchase events | Service Key |
| GET    | /internal/courses/:courseId/games     | Content → Commerce: get course game IDs for access check           | Service Key |

## 10.3 Call Patterns

| Trigger              | Direction                        | Action                                                                               |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| Purchase Confirmed   | Commerce → Identity              | POST /internal/notifications/send with purchase_confirmed payload                    |
| Account Deleted      | Identity → Commerce              | DELETE /internal/users/:userId/subscriptions                                         |
| Game Submission      | Content → Commerce (via Gateway) | GET /commerce/courses/:courseId/access to verify access before allowing submission   |
| Video Stream Request | Content → Commerce (via Gateway) | GET /commerce/courses/:courseId/access to verify access before generating signed URL |
| Expiry Notifications | Commerce → Identity              | POST /internal/notifications/send with subscription_expiring/expired payload         |

---

# 11. MongoDB Collections Summary

## 11.1 yourbeep_identity (Identity Service)

| Collection    | Contents                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------- |
| users         | All user accounts — firebaseUid, profile, fcmTokens, role, points, streaks                      |
| activity_logs | Aggregated log of user activity (game completions, video watches) for the activity log endpoint |

## 11.2 yourbeep_content (Content Service)

| Collection      | Contents                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| games           | Games library — key, title, description, isActive                                    |
| courses         | Course definitions — title, games[], weights, contentItems[], isPublished            |
| content_items   | Ordered flat list of video/game items per course — type, refId, order                |
| videos          | Video metadata — bunnyVideoId, durationSeconds, courseId, isMasterCall               |
| master_call     | Single document — current master call video metadata and bunnyVideoId                |
| submissions     | All game submissions — discriminated by type field, stores payload + computed scores |
| recommendations | Pre-computed course recommendations per user — refreshed on course completion        |

## 11.3 yourbeep_commerce (Commerce Service)

| Collection       | Contents                                                                             |
| ---------------- | ------------------------------------------------------------------------------------ |
| course_purchases | All purchase records — userId, courseId, planType, status, expiryDate, stripeIds     |
| pricing          | Regional pricing per course — region, currency, amount6mo, amount1yr, stripePriceIds |
| refunds          | Refund records — purchaseId, stripeRefundId, amount, reason, adminId, notes          |
| stripe_events    | Idempotency log of processed Stripe webhook events — event ID, type, processedAt     |

## 11.4 Index Recommendations

| Index                                | Type     | Reason                                                         |
| ------------------------------------ | -------- | -------------------------------------------------------------- |
| users.firebaseUid                    | unique   | Identity Service — fast lookup on every authenticated request  |
| users.email                          | unique   | Identity Service — login and duplicate check                   |
| submissions.userId + gameId          | compound | Content Service — prevent duplicate and upsert submissions     |
| submissions.courseId + userId        | compound | Content Service — fetch all submissions for a user in a course |
| course_purchases.userId + courseId   | compound | Commerce Service — access check on every game/video request    |
| course_purchases.expiryDate + status | compound | Commerce Service — expiry cron queries                         |
| course_purchases.stripeSessionId     | unique   | Commerce Service — webhook event deduplication                 |
| stripe_events.stripeEventId          | unique   | Commerce Service — webhook idempotency                         |

## 11.5 What Does NOT Change from v1.0

The following are preserved exactly as documented in API Reference v1.0 and the Firebase Auth docs:

| Item                         | Details                                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All game submission schemas  | Awareness States, Somatic States, Pattern Awareness, Reflect & Act — enums, Zod schemas, result mappings, scoring logic, activity sequences — all unchanged |
| Firebase Auth integration    | Firebase Admin SDK setup, auth middleware, /auth/sync, /auth/me, /auth/account endpoints — unchanged from Firebase Auth docs                                |
| FCM push notification logic  | notifyUser, notifyUsers, notifyAll functions, token registration/removal — unchanged from Firebase Auth docs                                                |
| Standard response envelope   | success, data, message, timestamp / error shape — unchanged                                                                                                 |
| HTTP status codes (existing) | 200, 201, 400, 401, 403, 404, 409, 422, 500 — all carry same meaning                                                                                        |
| Zod validation patterns      | discriminatedUnion, enum validation, length constraints — unchanged patterns                                                                                |
| Swagger/OpenAPI config       | Structure unchanged — only security scheme updated to reference Firebase token                                                                              |
| MongoDB schema patterns      | ObjectId refs, soft deletes (isActive), timestamps (createdAt/updatedAt) — all unchanged                                                                    |
| Admin user management        | GET/PATCH/DELETE /admin/users/\* — unchanged, role field stays                                                                                              |

---

_yourbeep API Reference v2.0 — Confidential & Internal Use Only_

_3 Microservices • Firebase Auth • Bunny.net Stream • Stripe_
