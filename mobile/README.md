# Smart Cost

Bangla-first React Native mobile frontend for personal finance tracking.

## Stack

- React Native + TypeScript
- React Navigation
- Redux Toolkit
- React Query
- React Hook Form + Zod
- Axios
- Reanimated
- `@react-native-voice/voice` for Bangla speech input
- `react-native-gifted-charts` for dashboard and report charts

## Folder Structure

```text
src/
  api/              FastAPI endpoint clients
  app/providers/    Redux, React Query, Navigation providers
  components/       Reusable UI and global microphone flow
  config/           App runtime config
  constants/        Category labels and Bangla keyword maps
  hooks/            Theme, voice, transaction hooks
  navigation/       Root stack, auth stack, bottom tabs
  screens/          Feature screens
  store/            Redux Toolkit slices and typed hooks
  theme/            Light and dark theme tokens
  types/            Shared TypeScript domain types
  utils/            Bangla parsing, currency, date helpers
```

## Backend Contract

The frontend expects FastAPI routes under `src/config/env.ts`:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/verify-otp`
- `GET /transactions`
- `GET /transactions/summary`
- `POST /transactions`
- `PUT /transactions/{id}`
- `DELETE /transactions/{id}`
- `GET /budgets/current`
- `POST /budgets`
- `GET /savings-goals`
- `POST /savings-goals`
- `GET /reports?range=weekly|monthly|yearly`
- `GET /ai-insights/monthly`

## Voice Command Flow

The floating microphone button is rendered globally for authenticated users.

1. Starts speech recognition with `bn-BD`.
2. Parses Bangla transcript locally.
3. Extracts amount, category, and income or expense intent.
4. Shows a confirmation modal.
5. Saves the transaction through the same API mutation used by manual entry.

Example phrases:

- `আজ বাজারে ৫০০ টাকা খরচ করেছি`
- `আজ বেতন ৩০ হাজার টাকা পেয়েছি`
- `রিকশা ভাড়া ১০০ টাকা`

## Run

```bash
npm install
npm run android
```

For iOS, install pods first inside `ios/` after generating native project files.
