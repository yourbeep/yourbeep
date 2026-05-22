# Game Flow Guide

This guide explains how all 4 games work in the current backend, which APIs the frontend should call, and in what sequence.

Base URL:

```text
http://localhost:4000/v1
```

All game endpoints require:

```text
Authorization: Bearer <firebase_id_token>
```

## 1. Before Any Game Starts

Before a user can play a course game, all of these must already be true:

1. the user is authenticated with Firebase
2. the frontend has called `POST /v1/auth/sync`
3. the user has valid paid access to the course
4. the frontend knows:
   - `courseId`
   - `gameId`
   - `gameKey`

Useful pre-check endpoints:

```http
GET /v1/courses/:courseId/content
GET /v1/commerce/courses/:courseId/access
GET /v1/courses/:courseId/videos/:videoId/stream
```

Notes:

- `GET /courses/:courseId/content` gives the visible course structure
- `GET /courses/:courseId/videos/:videoId/stream` may include `interactiveCues`
- a game can be opened:
  - from the course content list as a standalone activity
  - from a timed video cue popup

## 2. Core Game Endpoints

These are the main runtime endpoints for all 4 games:

```http
POST /v1/games/:gameId/submit
GET  /v1/games/:gameId/result
GET  /v1/games/:gameId/activities/:activityKey
GET  /v1/courses/:courseId/submissions
GET  /v1/submissions/:submissionId
GET  /v1/admin/submissions/:submissionId
```

What they do:

- `POST /games/:gameId/submit`
  - submits progress or a final result for a game
- `GET /games/:gameId/result`
  - returns the latest computed result for that game
- `GET /games/:gameId/activities/:activityKey`
  - returns activity detail for somatic activities
- `GET /courses/:courseId/submissions`
  - returns all submissions for that course plus final weighted score when available
- `GET /submissions/:submissionId`
  - returns one specific saved submission
- `GET /admin/submissions/:submissionId`
  - returns one specific saved submission for admin review, including stored payload and final course score context

## 3. Shared Submission Rules

Every game submission body includes:

- `type`
- `courseId`
- `payload`

Only `awareness_states` also uses `step`.

Backend rules:

- the user must have course access, otherwise `COURSE_NOT_PURCHASED (403)`
- the `gameId` in the route must belong to the `courseId` in the body
- the submitted `type` must match the actual library game key
- `reflect_act` cannot be submitted before the other 3 complete

## 4. Suggested Frontend Pattern

For every game screen, use this overall pattern:

1. open the game from a standalone course item or a video cue
2. collect the user’s UI selections locally
3. call `POST /games/:gameId/submit` when the current game step or final action is ready
4. render the response immediately
5. call `GET /games/:gameId/result` when reopening the game later or when the user refreshes
6. call `GET /courses/:courseId/submissions` when you want course-wide status and final score

## 5. Game 1: Awareness States

This is the only multi-step game that updates the same in-progress submission until the final step completes.

### Flow

1. user selects 1-2 activation states
2. frontend submits step 1
3. backend returns activation result mapping
4. user selects 1-2 expansion states
5. frontend submits step 2
6. backend returns expansion result mapping
7. user selects value-system domains and root causes
8. frontend submits step 3
9. backend marks the submission complete and returns summary data

### Step 1 request

```http
POST /v1/games/:gameId/submit
Content-Type: application/json
```

```json
{
  "type": "awareness_states",
  "courseId": "COURSE_ID",
  "step": 1,
  "payload": {
    "activationSelections": ["alert_nervous", "calm_steady"]
  }
}
```

### Step 2 request

```json
{
  "type": "awareness_states",
  "courseId": "COURSE_ID",
  "step": 2,
  "payload": {
    "activationSelections": ["alert_nervous", "calm_steady"],
    "expansionSelections": ["protection_resistance", "joy_abundance"]
  }
}
```

### Step 3 request

```json
{
  "type": "awareness_states",
  "courseId": "COURSE_ID",
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

### What the backend returns

- step 1:
  - `resultMapping`
  - `step`
  - submission is not complete
- step 2:
  - `resultMapping`
  - `step`
  - submission is not complete
- step 3:
  - `activationResultMapping`
  - `expansionResultMapping`
  - `summary`
  - `score`
  - submission is complete

### Reopen behavior

Use:

```http
GET /v1/games/:gameId/result
```

That returns the latest completed result for this game.

## 6. Game 2: Somatic States

This is submitted as one final body containing all selected regions and completed/skipped activities.

### Flow

1. user taps a body region
2. user chooses a sensation
3. frontend fetches the required activities when needed
4. user completes or skips activities
5. repeat for more regions if needed
6. frontend submits the full somatic payload once the user finishes

### Activity detail endpoint

Use this to render instructions for an activity:

```http
GET /v1/games/:gameId/activities/:activityKey
```

Example:

```http
GET /v1/games/GAME_ID/activities/jaw_awareness_reset
```

### Final somatic submission

```http
POST /v1/games/:gameId/submit
Content-Type: application/json
```

```json
{
  "type": "somatic_states",
  "courseId": "COURSE_ID",
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
      }
    ]
  }
}
```

### Backend behavior

- validates the region+sensation activity sequence
- checks required activity keys are present
- calculates region scores
- calculates one overall physiology score
- marks the submission complete immediately

### Reopen behavior

Use:

```http
GET /v1/games/:gameId/result
```

## 7. Game 3: Pattern Awareness

This supports incremental sub-activity saves. The frontend may submit one exercise at a time, and the backend merges them into the latest in-progress submission. The game only completes once all three required exercises are present.

### Flow

1. user performs `draw_your_breath`
2. frontend collects metrics
3. user performs `awareness_circles`
4. frontend collects metrics
5. user performs `scribble_drawing`
6. frontend collects metrics
7. frontend submits each exercise when it is done, or submits all 3 together at the end

### Incremental pattern submission

```http
POST /v1/games/:gameId/submit
Content-Type: application/json
```

```json
{
  "type": "pattern_awareness",
  "courseId": "COURSE_ID",
  "payload": {
    "exercises": [
      {
        "exerciseKey": "draw_your_breath",
        "durationSeconds": 245,
        "metrics": {
          "penLiftCount": 3,
          "totalLength": 820,
          "spatialCoverage": 0.72,
          "strokeCount": 42,
          "averageStep": 8.6,
          "directionChanges": 12,
          "axisDrift": 0.18,
          "controlLimitSpacing": "medium",
          "intervalPattern": "narrow_to_wide",
          "trace": [
            { "x": 0.14, "y": 0.42, "t": 0 },
            { "x": 0.19, "y": 0.39, "t": 36 }
          ],
          "bounds": { "minX": 0.1, "minY": 0.2, "maxX": 0.8, "maxY": 0.7 },
          "canvas": { "width": 1024, "height": 768 }
        }
      },
    ]
  }
}
```

### Backend behavior

- validates each submitted exercise payload
- merges that exercise into the user's latest incomplete `pattern_awareness` submission
- for partial saves returns:
  - `stage: "in_progress"`
  - `progressScore`
  - `progress.completedCount`
  - `progress.pendingExerciseKeys`
  - saved exercise diagnostics so far
- once all 3 required exercises are present, backend:
  - scores each exercise
  - computes:
    - `presenceScore`
    - `actionScore`
    - `patternScore`
    - `overallScore`
  - also returns richer `resultData` with:
    - `criteria`
    - `exerciseDiagnostics`
    - `adminReviewSummary`
  - marks the submission complete immediately

### Reopen behavior

Use:

```http
GET /v1/games/:gameId/result
```

## 8. Game 4: Reflect & Act

This is the final synthesis game.

### Prerequisite rule

Before this can be submitted, the user must already have completed:

- `awareness_states`
- `somatic_states`
- `pattern_awareness`

If not, backend returns:

- `PREREQUISITES_NOT_MET (422)`

### Frontend flow

1. user opens Reflect & Act
2. frontend calls `GET /games/:gameId/result`
3. if no completed reflect submission exists yet, backend computes the pre-synthesis data from the previous 3 games
4. frontend renders sections, totals, and recommended action
5. user enters optional reflection notes and acknowledges the suggested action
6. frontend submits the final reflect payload

### Pre-computed result fetch

```http
GET /v1/games/:gameId/result
```

This returns:

- `sections`
- `scores`
- `totals`
- `recommendedAction`
- `actionDescription`

### Final reflect submission

```http
POST /v1/games/:gameId/submit
Content-Type: application/json
```

```json
{
  "type": "reflect_act",
  "courseId": "COURSE_ID",
  "payload": {
    "userReflectionNotes": "Optional free text from the user",
    "acknowledgedAction": "remediation"
  }
}
```

### Backend behavior

- loads the latest completed results from the previous 3 games
- computes:
  - emotional state
  - physiology
  - presence & attention
  - action
  - pattern
- computes:
  - total score
  - average score
  - percentage
  - recommended action
- marks the submission complete immediately

## 9. Course-Level Score Flow

The backend also computes a final weighted course score once all required games are completed.

This weighted result appears in:

- the response of the final completed submission when enough games are done
- `GET /courses/:courseId/submissions`
- `GET /submissions/:submissionId`

### Get all submissions in a course

```http
GET /v1/courses/:courseId/submissions
```

Response includes:

- `submissions`
- `finalCourseScore`

### Get one submission

```http
GET /v1/submissions/:submissionId
```

Response includes:

- the specific submission
- `finalCourseScore`

### Admin get one submission

```http
GET /v1/admin/submissions/:submissionId
```

Response includes:

- the specific submission
- stored mixed payload data such as rich somatic or pattern telemetry
- `finalCourseScore`

## 10. Recommended Frontend Sequence Per Course

This is the cleanest sequence for a frontend course player:

1. `GET /courses/:courseId/content`
2. user opens video or standalone game
3. if video:
   - `GET /courses/:courseId/videos/:videoId/stream`
   - use `interactiveCues` if present
4. if a game starts:
   - render the game UI by `gameKey`
   - submit in the sequence described below
5. after each completed game:
   - optionally call `GET /games/:gameId/result`
6. after the user finishes the course flow:
   - call `GET /courses/:courseId/submissions`

## 11. Recommended Call Sequence Summary

### Awareness States

1. `POST /games/:gameId/submit` step 1
2. render mapping
3. `POST /games/:gameId/submit` step 2
4. render mapping
5. `POST /games/:gameId/submit` step 3
6. optionally `GET /games/:gameId/result`

### Somatic States

1. `GET /games/:gameId/activities/:activityKey` as needed
2. collect all region activity outcomes
3. `POST /games/:gameId/submit`
4. optionally `GET /games/:gameId/result`

### Pattern Awareness

1. collect metrics for all 3 exercises
2. `POST /games/:gameId/submit`
3. optionally `GET /games/:gameId/result`

### Reflect & Act

1. `GET /games/:gameId/result`
2. render synthesis
3. `POST /games/:gameId/submit`
4. `GET /courses/:courseId/submissions`

## 12. Error Cases to Expect

Common game-related failures:

- `403 COURSE_NOT_PURCHASED`
  - user is trying to play without valid access
- `404 GAME_NOT_FOUND`
  - gameId does not exist or does not belong to the course
- `422 VALIDATION_ERROR`
  - wrong payload shape or missing required fields
- `422 PREREQUISITES_NOT_MET`
  - reflect_act was attempted too early

## 13. Quick Endpoint Checklist

```text
POST /v1/games/:gameId/submit
GET  /v1/games/:gameId/result
GET  /v1/games/:gameId/activities/:activityKey
GET  /v1/courses/:courseId/submissions
GET  /v1/submissions/:submissionId
```

## 14. Important Notes

- only `awareness_states` is step-based
- `somatic_states` and `reflect_act` are completed in one final submit
- `pattern_awareness` supports incremental sub-activity saves and completes once all three required exercises are present
- `reflect_act` depends on the previous 3 games
- games can be launched either from standalone course items or video cue popups
- final weighted course score only becomes available once all required games are completed
