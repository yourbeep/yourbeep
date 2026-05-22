# Course Section Structure Guide

This guide explains the updated course content structure.

## Structure Levels

The hierarchy is now:

1. `Course`
2. `Section`
3. `Content Item`

A content item can be:

- a `video`
- a `game`

There is no `submodule` level anymore.

## Mental Model

```text
Course
├─ Section 1
│  ├─ Video
│  ├─ Video
│  └─ Game
├─ Section 2
│  ├─ Video
│  └─ Game
└─ Section 3
   ├─ Video
   └─ Video
```

## Example

```text
Course: Nervous System Foundations

Section 1: Regulation Basics
Description: Introduces the first layer of awareness and self-regulation.

  1. Video - Welcome to Regulation
  2. Video - Understanding Breath Patterns
  3. Game  - Somatic Breath Check-In

Section 2: Pattern Awareness
Description: Helps the learner notice recurring regulation styles.

  1. Video - How Pattern Awareness Works
  2. Game  - Pattern Awareness

Section 3: Reflection and Action
Description: Turns insight into direction and follow-through.

  1. Video - Integrating the Learning
  2. Game  - Reflect & Act
```

## How Order Works

There are now two kinds of order:

1. `section.order`
   - controls the order of sections inside the course
2. `contentItem.order`
   - controls the order of content inside a single section

Important:

- content order is no longer global across the whole course
- content order is local to its section

So this is valid:

```text
Section 1
  order 1
  order 2

Section 2
  order 1
  order 2
  order 3
```

## How It Is Stored

### Course

The course now owns the section definitions:

```json
{
  "sections": [
    {
      "key": "regulation_basics",
      "title": "Regulation Basics",
      "description": "Introduces the first layer of awareness and self-regulation.",
      "order": 1
    },
    {
      "key": "pattern_awareness",
      "title": "Pattern Awareness",
      "description": "Helps the learner notice recurring regulation styles.",
      "order": 2
    }
  ]
}
```

### Content Item

Each content item now points to a section by `sectionKey`:

```json
{
  "type": "video",
  "refId": "VIDEO_ID",
  "sectionKey": "regulation_basics",
  "order": 2,
  "title": "Understanding Breath Patterns"
}
```

## API Behavior

The backend returns both:

- a flat ordered list: `contentItems`
- a grouped section tree: `contentSections`
- the course section definitions: `sections`

The flat list is sorted by:

1. `section.order`
2. `contentItem.order`

## Example Response Shape

```json
{
  "courseId": "COURSE_ID",
  "title": "Nervous System Foundations",
  "sections": [
    {
      "key": "regulation_basics",
      "title": "Regulation Basics",
      "description": "Introduces the first layer of awareness and self-regulation.",
      "order": 1
    }
  ],
  "contentItems": [
    {
      "_id": "ITEM_1",
      "sectionKey": "regulation_basics",
      "order": 1,
      "type": "video",
      "title": "Welcome to Regulation"
    },
    {
      "_id": "ITEM_2",
      "sectionKey": "regulation_basics",
      "order": 2,
      "type": "game",
      "title": "Somatic Breath Check-In"
    }
  ],
  "contentSections": [
    {
      "key": "regulation_basics",
      "title": "Regulation Basics",
      "description": "Introduces the first layer of awareness and self-regulation.",
      "order": 1,
      "itemCount": 2,
      "durationMinutes": 18,
      "contentItems": [
        {
          "_id": "ITEM_1",
          "sectionKey": "regulation_basics",
          "order": 1,
          "type": "video",
          "title": "Welcome to Regulation"
        }
      ]
    }
  ]
}
```

## Recommended Admin Flow

The admin flow should now be:

1. save basics
2. save pricing
3. create and order sections
4. upload videos into a selected section
5. add standalone game content into a selected section
6. manage cues
7. publish

## Recommended Frontend Usage

Use:

- `sections` for section navigation labels
- `contentSections` for grouped curriculum rendering
- `contentItems` for simple previous/next progression

This gives you a structured course without losing a reliable linear playback sequence.
