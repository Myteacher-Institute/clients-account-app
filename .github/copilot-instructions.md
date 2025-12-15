This repo is a React Native mobile app (Clients Account). The notes below capture project-specific conventions, API patterns, debugging tips and run/test commands so an AI coding agent can be productive immediately.

- Project layout: `app/` is the source root. Key directories:
  - `app/api/` — API layer (see `instance.js`, `request.js`, `endpoints.js`).
  - `app/navigation/` — modular navigators (`AppNavigator.js`, `DashboardNavigator.js`, etc.).
  - `app/context/` — React contexts (`UserContext`, `ToastContext`).
  - `app/hooks/` — local hooks (notably `useApi.js`, `useForm.js`, `useToast.js`).
  - `app/components/` — reusable UI components (prefixed `Clients*`).

- Alias & imports: Babel `module-resolver` maps `@` → `./app`. Prefer imports like `import { Get } from '@/api'`.

- API conventions and examples:
  - Use the exported helpers `Get`, `Post`, `Patch` from `app/api/request.js` or `useApi()` hook.
  - The endpoints are keyed in `app/api/endpoints.js` (some keys are functions that accept `dynamicId`).
  - Method signatures: object-style params to avoid order bugs. Examples:
    - `Get({ endpointKey: 'userProfile', dynamicId: userId, requiresAuth: true })`
    - `Post({ endpointKey: 'login', data: { email, password }, requiresAuth: false })`
  - `options` can include `onErrorMessage` and `onSuccessMessage` (strings or booleans). `useApi` performs automatic FormData conversion when it detects file-like objects.

- Auth and tokens:
  - Tokens live in `react-native-encrypted-storage` via `app/auth/token.js` (`getToken`, `setToken`, `clearToken`).
  - `instance.js` has an axios response interceptor that auto-clears the token on 403 invalid-token responses.

- Network / local dev notes:
  - `app/api/instance.js` chooses base URL by platform. For Android emulators/devices change the Android IP (`192.168.18.2`) to your machine's LAN IP.
  - No dotenv/env file is used by default; update `instance.js` when working offline or with local backends.

- Debugging & logs:
  - The API layer has logging and a `DEBUG_MODE` toggle in `request.js`. The repo uses many console logs across navigation and context initialization — follow those for quick traces.

- App startup and providers:
  - `App.jsx` mounts `UserProvider` then `ToastProvider` and `ClientsToast` listens to `eventBus` (`app/utils/eventBus.js`) for toast events.
  - `UserContext.fetchUser()` decodes JWT and fetches `userProfile` using `Get` — changes here affect auth flow and initial routing.

- Navigation patterns:
  - `AppNavigator.js` decides initial route using `user` state from `useUser()`. Add new auth screens to the stack or to `DashboardNavigator` for logged-in UI.

- Tests, lint, and scripts:
  - Run Metro: `yarn start`.
  - Run Android: `yarn android`. iOS: `yarn ios`.
  - Tests: `yarn test` (Jest preset `react-native`).
  - Lint: `yarn lint` (ESLint via `@react-native/eslint-config`).

- Conventions to preserve when editing:
  - Keep API calls object-based (avoid positional args) and use endpoint keys from `endpoints.js`.
  - Respect `requiresAuth` boolean to avoid unexpected token usage.
  - Use the `useApi` hook when altering UI components — it centralizes FormData conversion and loading state.

- When adding or changing features that touch auth/networking:
  - Update `endpoints.js` with a clear key name and test via `useApi` and `request.js` with `DEBUG_MODE` enabled.
  - If backend changes marker strings (e.g., token rejection message), update axios interceptor logic in `instance.js`.

If anything here is unclear or you'd like more details about a particular area (navigation flow, a specific screen, or the API error handling semantics), tell me which part to expand and I'll iterate.
