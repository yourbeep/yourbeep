# Your Beep Mobile

Expo Go foundation for the Your Beep app.

## What is ready

- Expo SDK 55 setup
- Expo Router entry and route shell
- Safe area and gesture handler providers
- Reanimated-ready component structure
- Feature-based `src` architecture
- Typed API client and service placeholders for future backend integration
- Prettier and ESLint setup

## Commands

```bash
npm run start
npm run android
npm run web
npm run lint
npm run typecheck
npm run format
```

## Folder map

```text
app/                    Expo Router routes
src/app/providers/      Root providers
src/components/         Reusable UI building blocks
src/features/           Feature slices and screen modules
src/lib/api/            Backend-ready API layer
src/lib/config/         Environment configuration
src/theme/              Design tokens
```

## Environment

Copy `.env.example` to `.env` when the backend is available and update:

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_USE_MOCKS`
- `EXPO_PUBLIC_REQUEST_TIMEOUT_MS`
