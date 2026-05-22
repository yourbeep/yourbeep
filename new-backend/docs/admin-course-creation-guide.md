# Admin Course Creation Guide

This guide explains the full backend flow for creating and launching a course from the admin side in the current YourBeep backend.

All examples below assume requests go through the gateway at:

```text
http://localhost:4000/v1
```

All admin endpoints require:

```text
Authorization: Bearer <firebase_id_token>
```

The Firebase user must already exist in the app and have `role=admin`.

## 1. Admin Login Flow

The backend does not have its own email/password login endpoint. Admin login is handled through Firebase.

Admin flow:

1. Admin signs in on the frontend with Firebase Auth.
2. Frontend gets the Firebase ID token.
3. Frontend calls:

```http
POST /v1/auth/sync
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

Example body:

```json
{
  "timezone": "Asia/Calcutta",
  "region": "IN"
}
```

After that, all admin API calls use the same Bearer token.

## 2. Recommended Creation Order

Use this order to avoid rework:

1. Create or confirm the games in the library
2. Create the course as a draft
3. Set pricing for the course
4. Upload course videos
5. Create course content items in the right order
6. Add in-video game cue points where needed
7. Reorder content if needed
8. Add promotions or launch offers if needed
9. Publish the course

Important sequencing note:

- upload the course videos first so you have real `videoId` values
- create the visible course content structure next so videos and standalone games appear in the right order
- add cue points after that, because cues attach to uploaded videos and usually reference games already placed in the course

## 3. Step 1: Create or Confirm Games

Games live in a library and can be reused across multiple courses.

### List existing games

```http
GET /v1/admin/games
```

### Create a new game

```http
POST /v1/admin/games
Content-Type: application/json
```

```json
{
  "key": "awareness_states",
  "title": "Awareness States",
  "description": "Energy orientation and flow stability activity"
}
```

### Update a game

```http
PUT /v1/admin/games/:id
```

### Soft delete a game

```http
DELETE /v1/admin/games/:id
```

### Restore a deleted game

```http
POST /v1/admin/games/:id/restore
```

## 4. Step 2: Create the Course Draft

Create the course first with metadata and game weighting.

### Create course

```http
POST /v1/admin/courses
Content-Type: application/json
```

Example:

```json
{
  "title": "Behavioural Signal Intelligence",
  "subtitle": "Begin your self-reflection journey",
  "description": "Full course description here",
  "shortDescription": "A 4-game journey into self-awareness",
  "thumbnail": "https://example.com/course-thumb.jpg",
  "instructor": {
    "name": "Instructor Name",
    "bio": "Brief instructor bio",
    "avatar": "https://example.com/instructor.jpg"
  },
  "games": [
    { "gameId": "GAME_ID_1", "weight": 30 },
    { "gameId": "GAME_ID_2", "weight": 25 },
    { "gameId": "GAME_ID_3", "weight": 25 },
    { "gameId": "GAME_ID_4", "weight": 20 }
  ],
  "durationMinutes": 120,
  "isPublished": false
}
```

Important rules:

- `games[].weight` must sum to exactly `100`
- create it as draft first with `isPublished: false`
- keep the course hidden until pricing and content are ready

### List admin courses

```http
GET /v1/admin/courses
```

### Update course

```http
PUT /v1/admin/courses/:id
```

### Soft delete / restore course

```http
DELETE /v1/admin/courses/:id
POST /v1/admin/courses/:id/restore
```

## 5. Step 3: Add Pricing

Pricing is managed in Commerce per course and per region.

### Upsert pricing

```http
PUT /v1/admin/commerce/courses/:courseId/pricing
Content-Type: application/json
```

Example:

```json
{
  "region": "IN",
  "currency": "INR",
  "amount6mo": 4999,
  "amount1yr": 7999,
  "stripeProductId6mo": "prod_xxx",
  "stripeProductId1yr": "prod_yyy",
  "stripePriceId6mo": "price_xxx",
  "stripePriceId1yr": "price_yyy"
}
```

### List configured pricing

```http
GET /v1/admin/commerce/courses/:courseId/pricing
```

Recommended:

- configure at least one region before publishing
- make sure the Stripe price IDs are correct before opening sales

## 6. Step 4: Upload Course Videos

Videos are uploaded through Bunny Stream using a direct upload URL flow.

### 4.1 Create upload URL

```http
POST /v1/admin/courses/:courseId/videos/upload-url
Content-Type: application/json
```

Example:

```json
{
  "title": "Welcome to the Course",
  "description": "Opening lesson",
  "order": 1
}
```

The response includes:

- `uploadUrl`
- internal `videoId`
- `bunnyVideoId`
- HTTP method and headers to use for direct upload

### 4.2 Upload file directly to Bunny

The admin frontend uploads the raw video file directly to Bunny using the returned `uploadUrl`.

### 4.3 Wait for Bunny webhook

When Bunny finishes encoding, it calls:

```http
POST /v1/webhooks/bunny/stream
```

That marks the video as ready in the backend.

### 4.4 Update video metadata if needed

```http
PATCH /v1/admin/videos/:videoId
Content-Type: application/json
```

Example:

```json
{
  "title": "Updated Lesson Title",
  "description": "Updated lesson description",
  "order": 2
}
```

### 4.5 Delete a video if needed

```http
DELETE /v1/admin/videos/:videoId
```

## 7. Step 5: Build the Course Content Structure

Course content is a flat ordered list of `video` and `game` items.

Important:

- `video` items define the lesson sequence
- `game` items define standalone activities in the course flow
- video cues do not replace content items; they are an extra interactive layer on top of videos

### List existing content items

```http
GET /v1/admin/courses/:courseId/content
```

The content response now gives the frontend enough information to build both the lesson list and the player launch behavior. Video items can include:

- `videoId`
- `bunnyVideoId`
- `interactiveCueCount`

Game items still remain ordinary playable activities in the content list.

### Add a content item

```http
POST /v1/admin/courses/:courseId/content
Content-Type: application/json
```

Example video item:

```json
{
  "type": "video",
  "refId": "VIDEO_ID",
  "order": 1,
  "title": "Welcome to the Course",
  "description": "Intro lesson",
  "durationMinutes": 5,
  "isFree": true
}
```

Example game item:

```json
{
  "type": "game",
  "refId": "GAME_ID",
  "order": 3,
  "title": "Awareness States Activity",
  "description": "First guided activity",
  "durationMinutes": 15,
  "isFree": false
}
```

### Update a content item

```http
PUT /v1/admin/content/:itemId
```

### Delete a content item

```http
DELETE /v1/admin/content/:itemId
```

### Reorder content items in batch

```http
PUT /v1/admin/courses/:courseId/content/reorder
Content-Type: application/json
```

Example:

```json
{
  "items": [
    { "itemId": "ITEM_1", "order": 1 },
    { "itemId": "ITEM_2", "order": 2 },
    { "itemId": "ITEM_3", "order": 3 }
  ]
}
```

Recommended structure:

1. intro video
2. foundation video
3. first standalone game
4. follow-up lesson
5. second standalone game
6. deeper lesson
7. third standalone game
8. final integration lesson
9. reflect and act standalone game

Recommended cue usage:

- use cues when a video should intentionally stop or prompt the learner at a precise second
- keep the standalone game item too if the learner should be able to revisit that activity later from the course list

## 8. Step 6: Add In-Video Game Cue Points

If a game should pop up while a lesson video is playing, attach a cue point to that video.

This does not replace standalone game play. Games can still be opened separately from the course flow. Cue points only tell the frontend:

- which game to pop
- at what second to pop it
- whether the video should pause
- whether the user can skip that prompt

This means the same game can behave in two ways:

1. as a normal standalone game item in the course structure
2. as a timed popup while a related video is playing

Important rule:

- the cue can only point to a game that already belongs to the same course

### List cues for a video

```http
GET /v1/admin/videos/:videoId/cues
```

### Create a cue

```http
POST /v1/admin/videos/:videoId/cues
Content-Type: application/json
```

Example:

```json
{
  "gameId": "GAME_ID",
  "triggerAtSeconds": 510,
  "title": "Pause and Reflect",
  "description": "Take a moment to complete the next activity before continuing.",
  "ctaLabel": "Start Activity",
  "pauseVideo": true,
  "isSkippable": false
}
```

### Update a cue

```http
PUT /v1/admin/video-cues/:cueId
```

### Delete a cue

```http
DELETE /v1/admin/video-cues/:cueId
```

### Runtime behavior for the frontend

When the user starts a video, this endpoint now returns cue metadata together with the signed stream URL:

```http
GET /v1/courses/:courseId/videos/:videoId/stream
```

The response now includes:

- `interactiveCues`

Each cue includes:

- `triggerAtSeconds`
- `gameId`
- `gameKey`
- `gameTitle`
- `title`
- `description`
- `ctaLabel`
- `pauseVideo`
- `isSkippable`

Recommended frontend behavior:

1. start the video using the signed stream URL
2. monitor current playback time
3. when a cue time is reached, show the popup
4. if `pauseVideo=true`, pause the player
5. open the linked game using the cue's `gameId` / `gameKey`
6. after the user completes or dismisses the popup, continue playback if appropriate

## 9. Step 7: Set Promotions / Offers

Promotions are managed in Commerce and can behave like launch offers, promo codes, or auto-applied discounts.

### Create promotion

```http
POST /v1/admin/commerce/promotions
Content-Type: application/json
```

Percentage example:

```json
{
  "name": "Launch Offer",
  "code": "LAUNCH20",
  "description": "20% off annual launch offer",
  "courseId": "COURSE_ID",
  "regions": ["IN"],
  "planTypes": ["annual"],
  "discountType": "percentage",
  "percentageOff": 20,
  "autoApply": false,
  "perUserLimit": 1,
  "isActive": true
}
```

Fixed amount example:

```json
{
  "name": "India Intro Offer",
  "code": "INDIA500",
  "courseId": "COURSE_ID",
  "regions": ["IN"],
  "planTypes": ["six_month"],
  "discountType": "fixed_amount",
  "amountOff": 500,
  "currency": "INR",
  "autoApply": true,
  "perUserLimit": 1,
  "isActive": true
}
```

### Promotion endpoints

```http
GET    /v1/admin/commerce/promotions
GET    /v1/admin/commerce/promotions/summary
GET    /v1/admin/commerce/promotions/:promotionId
PUT    /v1/admin/commerce/promotions/:promotionId
DELETE /v1/admin/commerce/promotions/:promotionId
POST   /v1/admin/commerce/promotions/:promotionId/restore
```

## 10. Step 8: Publish the Course

There is no separate publish endpoint right now. Publishing is done through course update.

### Publish course

```http
PUT /v1/admin/courses/:id
Content-Type: application/json
```

Example:

```json
{
  "isPublished": true
}
```

Before publishing, confirm:

- game weights total `100`
- pricing exists
- videos are uploaded and active
- cue points are attached to the correct videos and correct timestamps
- content order is correct
- first preview item is marked `isFree` if needed
- thumbnail and instructor details are set

## 11. Step 9: QA Before Launch

Check these public and protected endpoints after publishing:

### Public checks

```http
GET /v1/courses
GET /v1/courses/:courseId
GET /v1/courses/:courseId/price
```

### Paid-user checks

```http
GET /v1/courses/:courseId/content
GET /v1/courses/:courseId/videos/:videoId/stream
POST /v1/commerce/courses/:courseId/promotion/preview
```

For cue testing, verify:

1. `GET /v1/courses/:courseId/videos/:videoId/stream` returns `interactiveCues`
2. cue times match the intended lesson moments
3. each cue points to the expected game
4. the same game still appears as a normal standalone activity if that is part of the course design

### Admin checks

```http
GET /v1/admin/courses
GET /v1/admin/courses/:courseId/content
GET /v1/admin/commerce/courses/:courseId/pricing
GET /v1/admin/commerce/promotions
GET /v1/admin/videos/:videoId/cues
```

## 12. Optional: Master Course Free Video

This is separate from paid courses. It is a free authenticated video for all users.

### Create or update master course

```http
POST  /v1/admin/master-course
PATCH /v1/admin/master-course
```

### Upload master course video

```http
POST /v1/admin/master-course/upload-url
```

This should be used for the platform-wide free video, not for a paid course module.

## 13. Suggested Admin UX Flow

If you are building the admin panel UI, the cleanest wizard/order is:

1. Course basics
2. Select games and assign weights
3. Save draft
4. Add pricing
5. Upload videos
6. Add cue points for activity popups
7. Build content order
8. Configure offers/promotions
9. Preview course
10. Publish

## 14. Quick Endpoint Checklist

### Content service

```text
GET    /v1/admin/games
POST   /v1/admin/games
PUT    /v1/admin/games/:id
DELETE /v1/admin/games/:id
POST   /v1/admin/games/:id/restore

GET    /v1/admin/courses
POST   /v1/admin/courses
PUT    /v1/admin/courses/:id
DELETE /v1/admin/courses/:id
POST   /v1/admin/courses/:id/restore

GET    /v1/admin/courses/:courseId/content
POST   /v1/admin/courses/:courseId/content
PUT    /v1/admin/courses/:courseId/content/reorder
PUT    /v1/admin/content/:itemId
DELETE /v1/admin/content/:itemId

POST   /v1/admin/courses/:courseId/videos/upload-url
PATCH  /v1/admin/videos/:videoId
DELETE /v1/admin/videos/:videoId
GET    /v1/admin/videos/:videoId/cues
POST   /v1/admin/videos/:videoId/cues
PUT    /v1/admin/video-cues/:cueId
DELETE /v1/admin/video-cues/:cueId

POST   /v1/admin/master-course
PATCH  /v1/admin/master-course
POST   /v1/admin/master-course/upload-url
```

### Commerce service

```text
GET    /v1/admin/commerce/courses/:courseId/pricing
PUT    /v1/admin/commerce/courses/:courseId/pricing

GET    /v1/admin/commerce/promotions
GET    /v1/admin/commerce/promotions/summary
GET    /v1/admin/commerce/promotions/:promotionId
POST   /v1/admin/commerce/promotions
PUT    /v1/admin/commerce/promotions/:promotionId
DELETE /v1/admin/commerce/promotions/:promotionId
POST   /v1/admin/commerce/promotions/:promotionId/restore
```

## 15. Notes

- Admin auth is Firebase-based, not backend password-based
- Publishing is currently a `PUT /admin/courses/:id` update with `isPublished: true`
- Promotions live in Commerce, not Content
- Course videos use Bunny upload URLs and webhook activation
- In-video activity popups are now driven by video cue points
- Games can be both timed video popups and separate standalone course activities
- Comments, purchases, and learner progress only become meaningful after the course is published and sold
