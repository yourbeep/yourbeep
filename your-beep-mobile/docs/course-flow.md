# Course Flow and Game Integration

This document explains how the `Behavioural Signal Intelligence` course is structured in the backend, how the mobile app consumes it, and how the game/video flow is expected to work end to end.

## 1. Core backend model

The course system in `new-backend/apps/content` is built on four linked entities:

- `Course`
  - The parent program shown on the mobile `Courses` page.
- `ContentItem`
  - The ordered bridge table for the user journey.
  - Each row belongs to one course and points to either a `video` or a `game`.
  - Important fields: `type`, `refId`, `order`, `title`, `description`, `isFree`, `isActive`.
- `Game`
  - The interactive assessment or activity logic.
  - Important fields: `key`, `title`, `description`, `internalScoreRange`.
- `Video`
  - Streamed learning content that belongs to a course.

In practice, a course is not rendered directly from `Game` or `Video` records. The app should follow `ContentItem.order` because that is the sequence the admin has built.

## 2. Public vs protected course APIs

### Public

- `GET /v1/courses`
  - Returns published course cards for the `Courses` page.
- `GET /v1/courses/:courseId`
  - Returns high-level course detail for the selected course.
- `GET /v1/master-call`
  - Returns the free featured masterclass video data used on the `Videos` page.

### Protected

- `GET /v1/courses/:courseId/content`
  - Returns the real ordered course content for the signed-in user.
  - Access control is already handled by the backend.
  - If the user has no purchase, only free items are returned.
- `POST /v1/games/:gameId/submit`
  - Submits a game payload.
- `GET /v1/games/:gameId/result`
  - Returns the result for a game.
- `GET /v1/games/:gameId/activities/:activityKey`
  - Returns metadata for an activity inside a somatic or guided exercise flow.
- `GET /v1/courses/:courseId/submissions`
  - Returns user submissions and final course score.
- `GET /v1/submissions/:submissionId`
  - Returns one submission in detail.
- `GET /v1/courses/:courseId/videos/:videoId/stream`
  - Returns the signed stream payload for a course video.
- `POST /v1/courses/:courseId/videos/:videoId/watch-event`
  - Records watch progress for a course video.

## 3. Behavioural Signal Intelligence structure

Based on the backend game keys and the feedback document, the mobile flow is built around these four game modules:

1. `awareness_states`
2. `somatic_states`
3. `pattern_awareness`
4. `reflect_act`

The mobile app should treat these as the core journey inside the course:

1. `Awareness States`
2. `Somatic States`
3. `Pattern Awareness`
4. `Reflect & Act`

## 4. Game flow details

### Awareness States

Backend game key:
- `awareness_states`

Expected frontend sequence from feedback doc:
- activation state selection
- expansion state selection
- value-system mapping
- root-cause mapping
- summary

Backend submission shape:
- uses the same game with progressive `step` values
- step `1` stores activation
- step `2` requires expansion selections
- step `3` requires value systems and root causes

Important note:
- this is not three separate games
- it is one game that is progressively updated

### Somatic States

Backend game key:
- `somatic_states`

Expected frontend sequence from feedback doc:
- body region selection
- sensation selection
- awareness checks
- related activities and exercises

Backend submission shape:
- one payload with `regions`
- each region contains:
  - `region`
  - `sensation`
  - `activities`

The activity list is where the completion trail for body exercises should be captured.

### Pattern Awareness

Backend game key:
- `pattern_awareness`

Expected frontend sequence from feedback doc:
- map your breath
- related pattern exercises
- result screen

Backend submission shape:
- requires exactly three exercises:
  - `draw_your_breath`
  - `awareness_circles`
  - `scribble_drawing`

Each exercise stores:
- `exerciseKey`
- `durationSeconds`
- `metrics`

### Reflect & Act

Backend game key:
- `reflect_act`

Expected frontend sequence from feedback doc:
- reflect synthesis
- act / recommended next step

Backend rule:
- this game depends on completed results from:
  - `awareness_states`
  - `somatic_states`
  - `pattern_awareness`

If those are missing, the backend returns `PREREQUISITES_NOT_MET`.

If they exist, the backend computes the reflect result dynamically using the latest completed submissions and produces:
- emotional state
- physiology
- presence & attention
- action
- pattern
- recommended action

## 5. Video flow

There are two video types in the current app:

### Masterclass / master call

- shown on the top of the `Videos` page
- loaded from `GET /v1/master-call`
- free/public

### Course videos

- loaded from `GET /v1/courses/:courseId/videos/:videoId/stream`
- require signed-in access
- backend returns stream metadata such as title, duration, thumbnail, and cue information

Progress should be written back through:
- `POST /v1/courses/:courseId/videos/:videoId/watch-event`

Payload:
- `watchedSeconds`
- `positionSeconds`
- `contentItemId`
- `completed`

## 6. Current mobile integration status

### Live now

- Firebase email/password auth
- `/v1/auth/sync`
- course card list from `/v1/courses`
- course detail title/description on `Behavioural Signal Intelligence`
- dynamic behavioural module mapping from `/v1/courses/:courseId/content`
- masterclass data from `/v1/master-call`
- dashboard/profile/support/tickets
- ticket creation
- course video stream metadata fetch for the video detail page

### Added mobile service layer for next steps

The mobile app now has service hooks ready for:

- game submit
- game result
- game activity detail
- course submissions
- submission detail
- course video watch-event

These live in:
- `src/lib/api/services/submissions.ts`

## 7. Mobile page mapping

Current page mapping for the course journey:

- `Courses`
  - list of courses from backend
- `Behavioural Signal Intelligence`
  - reads the selected course
  - builds the four behavioural cards from backend content items
- `Awareness States`
  - frontend journey for `awareness_states`
- `Somatic States`
  - frontend journey for `somatic_states`
- `Pattern Awareness`
  - frontend journey for `pattern_awareness`
- `Reflect`
  - frontend journey for `reflect_act`

Route params now forward these IDs where available:
- `courseId`
- `gameId`
- `contentItemId`

That makes the deeper screen binding possible without changing the route structure later.

## 8. Suggested next implementation order

To keep the app aligned with the real backend:

1. bind `Awareness States` submit flow to `POST /games/:gameId/submit`
2. bind `Somatic States` submit flow to `POST /games/:gameId/submit`
3. bind `Pattern Awareness` submit flow to `POST /games/:gameId/submit`
4. bind `Reflect & Act` result flow to `GET /games/:gameId/result`
5. convert `Video Detail` from a UI shell into a real player and send `watch-event`
6. read `course submissions` for completion history and final score

## 9. Feedback-doc alignment notes

The `App page feedback-1.docx` file mainly confirms:

- the course should be presented as four major segments
- the real labels should be:
  - Awareness States
  - Somatic States
  - Pattern Awareness
  - Reflect & Act
- `Start Assessment` should follow the course sequence
- body-region exercises in `Somatic States` map into awareness checks plus activities

That is why the mobile module screen now builds around the backend course content order instead of staying fully static.
