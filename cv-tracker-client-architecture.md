# CV-Tracker — Architecture & File Structure

## Overview

CV-Tracker is an Angular 18 job application tracking tool with an integrated AI agent. It uses standalone components, Angular Signals for state management, reactive forms, Material Design, and ApexCharts for visualization. The backend is a Node.js API consumed via HTTP.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Bootstrap & Configuration](#bootstrap--configuration)
3. [Routing](#routing)
4. [Core Layer](#core-layer)
5. [Shared Layer](#shared-layer)
6. [Pages](#pages)
7. [State Management](#state-management)
8. [Data Flow](#data-flow)
9. [Key Interfaces & Models](#key-interfaces--models)
10. [Enumerations](#enumerations)
11. [Component Architecture](#component-architecture)
12. [Build & Run](#build--run)

---

## Project Structure

```
job-search-client/
├── src/
│   ├── app/
│   │   ├── core/                        # Singleton services, models, guards
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts        # Blocks unauthenticated users
│   │   │   │   └── load.guard.ts        # Blocks logged-in users from login/register
│   │   │   ├── models/
│   │   │   │   ├── api.interface.ts     # API endpoint config types
│   │   │   │   ├── data.interface.ts    # Country, City, ChartTimeLine, NavBarLink
│   │   │   │   ├── users.interface.ts   # Auth/user request & response types
│   │   │   │   ├── table.interface.ts   # Job application row data types
│   │   │   │   ├── forms.interface.ts   # Typed FormControl models
│   │   │   │   ├── job-search.interface.ts  # JobSearchCriteria
│   │   │   │   ├── agent.interface.ts   # AgentSuggestion
│   │   │   │   ├── dialog.interface.ts  # GenericDialog types
│   │   │   │   ├── chart.interface.ts   # ApexCharts data types
│   │   │   │   ├── mcp.inrerface.ts     # MCP AI request/response types
│   │   │   │   └── enum/
│   │   │   │       ├── table-data.enum.ts   # Status, PositionType, Platform, etc.
│   │   │   │       ├── utils.enum.ts        # FormEnum, ROUTES, ActionLabels, etc.
│   │   │   │       ├── params.enum.ts       # API parameter enums
│   │   │   │       ├── messages.enum.ts     # User/error/session messages
│   │   │   │       ├── charts.enum.ts       # Chart-related enums
│   │   │   │       └── mcp.enum.ts          # MCP-related enums
│   │   │   └── services/
│   │   │       ├── api.service.ts           # All HTTP requests (single source)
│   │   │       ├── auth.service.ts          # Token storage & auth state
│   │   │       ├── configuration.service.ts # API URL builder (env-aware)
│   │   │       └── mcp.service.ts           # AI agent integration
│   │   │
│   │   ├── pages/                       # Feature page components
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── cv-counter/          # Total CVs sent count widget
│   │   │   │   ├── market-analyst/      # Market analysis section
│   │   │   │   ├── positions-list/      # Position breakdown list
│   │   │   │   └── status-preview/      # Status summary cards
│   │   │   └── activity-table/
│   │   │       └── activity-table.component.ts  # Full CRUD job table
│   │   │
│   │   ├── shared/                      # Reusable building blocks
│   │   │   ├── base/
│   │   │   │   ├── dialog-base.component.ts    # Mixin: openDialog() method
│   │   │   │   ├── helper-base.component.ts    # Base for authenticated pages
│   │   │   │   ├── forms-base.component.ts     # Base for form components (filtering)
│   │   │   │   └── charts-base.component.ts    # Base for chart components
│   │   │   ├── services/
│   │   │   │   ├── data.service.ts       # App-wide data facade (API + state)
│   │   │   │   ├── state.service.ts      # Global signal-based state store
│   │   │   │   ├── resolver.service.ts   # Route resolver: token verification
│   │   │   │   ├── routing.service.ts    # Navigation helpers
│   │   │   │   ├── forms.service.ts      # Form initialization & validators
│   │   │   │   ├── ui.service.ts         # Colors, sorting, mobile detection
│   │   │   │   └── charts.service.ts     # Table → ApexCharts data transforms
│   │   │   ├── components/
│   │   │   │   ├── agent/               # AI agent text input (debounced)
│   │   │   │   ├── charts/
│   │   │   │   │   ├── progress-chart/  # CV sending rate bar chart
│   │   │   │   │   ├── status-chart/    # Status distribution chart
│   │   │   │   │   └── market-chart/    # Market analysis chart
│   │   │   │   ├── forms/
│   │   │   │   │   ├── add-row/         # Add job application form
│   │   │   │   │   └── edit-row/        # Edit job application form
│   │   │   │   ├── navigation/          # Sidebar (Material sidenav)
│   │   │   │   ├── header/              # Top header bar
│   │   │   │   ├── filter/              # Day-range filter
│   │   │   │   └── spinner/             # Loading spinner
│   │   │   ├── dialogs/
│   │   │   │   └── generic-dialog/      # Multi-purpose dialog (forms + notifications)
│   │   │   ├── pages/
│   │   │   │   ├── layout/              # Shell: Navigation + RouterOutlet
│   │   │   │   ├── login/
│   │   │   │   ├── registration/
│   │   │   │   ├── my-account/
│   │   │   │   └── not-found/
│   │   │   ├── directives/
│   │   │   │   ├── snackbar.directive.ts      # MatSnackBar wrapper
│   │   │   │   ├── material.directive.ts      # Material form field styling
│   │   │   │   ├── fader.directive.ts         # Fade-in animation
│   │   │   │   └── hover.directive.ts
│   │   │   ├── pipes/
│   │   │   │   ├── custom-upper-case.pipe.ts  # Capitalizes first character
│   │   │   │   └── string-sanitizer.pipe.ts
│   │   │   └── style/
│   │   │       ├── custom-material.scss
│   │   │       ├── variables.scss
│   │   │       ├── status.scss
│   │   │       ├── charts.scss
│   │   │       └── form-layout.style.scss
│   │   │
│   │   ├── app.component.ts             # Root component (RouterOutlet only)
│   │   ├── app.config.ts               # Platform bootstrap providers
│   │   └── app.routes.ts               # Route definitions
│   │
│   ├── environments/
│   │   ├── environment.ts              # Dev config (local/remote API URLs, AI model)
│   │   └── environment.prod.ts         # Production config
│   │
│   ├── main.ts                         # Client entry — bootstrapApplication()
│   ├── main.server.ts                  # SSR entry point
│   └── index.html
│
├── CLAUDE.md
├── ARCHITECTURE.md                     # This file
├── angular.json
├── package.json
├── tsconfig.json
└── server.ts                           # Express SSR server
```

---

## Bootstrap & Configuration

**Entry point:** `src/main.ts`

```
bootstrapApplication(AppComponent, appConfig)
```

**`app.config.ts`** registers platform-level providers (no NgModules):

| Provider                                                | Purpose                         |
| ------------------------------------------------------- | ------------------------------- |
| `provideZoneChangeDetection({ eventCoalescing: true })` | Batches change detection events |
| `provideRouter(routes)`                                 | Registers route definitions     |
| `provideNativeDateAdapter()`                            | Material date picker support    |
| `provideClientHydration()`                              | SSR hydration                   |
| `provideAnimationsAsync()`                              | Lazy animation loading          |
| `provideHttpClient(withFetch())`                        | HTTP client using the Fetch API |

**`environment.ts`** shape:

```typescript
{
  production: boolean,
  apiUrls: { local: string, remote: string },
  defaultModel: string,          // e.g. 'gpt-4.1'
  defaultTemperature: number     // e.g. 0.7
}
```

---

## Routing

**File:** `src/app/app.routes.ts`

```
/login            → LoginComponent           (canActivate: loadGuard)
/register         → RegistrationComponent    (canActivate: loadGuard)

/ (shell)         → LayoutComponent          (canActivate: authGuard, resolve: AuthResolver)
  /               → DashboardComponent
  /activity       → ActivityTableComponent
  /account        → MyAccountComponent       (canActivate: authGuard)

/not-found        → NotFoundComponent
/**               → redirect → /not-found
```

**Key behaviors:**

- All routes use `loadComponent` (lazy loading).
- `AuthResolver` fires on every protected route and verifies the stored token. On failure, it logs the user out and redirects to `/login`.
- `authGuard` blocks unauthenticated access.
- `loadGuard` redirects already-logged-in users away from `/login` and `/register`.

---

## Core Layer

### Services

#### `ApiService` — HTTP Gateway

Single service for all HTTP calls. Exposes signals for the current user state.

| Signal                | Type     | Description             |
| --------------------- | -------- | ----------------------- |
| `currentUserData$`    | `signal` | Authenticated user data |
| `currentUserRequest$` | `signal` | Active request payload  |

Key methods:

| Method                        | Description                          |
| ----------------------------- | ------------------------------------ |
| `loginUserReq()`              | POST credentials → token             |
| `verifyTokenReq()`            | GET token validation                 |
| `generateTokenReq()`          | POST refresh token                   |
| `getUserDataReq()`            | GET full user profile                |
| `authUserDataReq()`           | GET job applications for user        |
| `addOrUpdateApplicationReq()` | POST add/edit job row                |
| `removeRowsReq()`             | DELETE multiple rows                 |
| `getCountriesListReq()`       | GET country list (external API)      |
| `getCitiesReq()`              | GET cities by country (external API) |
| `getCompaniesReq()`           | GET company suggestions              |
| `getChartDataReq()`           | GET chart timeline data              |
| `mcpRequest()`                | POST to AI MCP endpoint              |

---

#### `AuthService` — Authentication State

Manages token persistence in `localStorage`.

| Member             | Description                     |
| ------------------ | ------------------------------- |
| `isAuthenticated$` | Signal — current auth state     |
| `setToken(token)`  | Stores token, sets signal true  |
| `getToken()`       | Reads from localStorage         |
| `logout()`         | Clears token, sets signal false |

---

#### `ApiConfigService` — URL Builder

Constructs endpoint URLs from environment config. Supports local/remote switching and query-parameter building.

---

#### `MCPService` — AI Agent Orchestrator

Bridges user input to the AI backend via `ApiService.mcpRequest()`. Reads state from `StateService` and `AuthService` to attach context.

---

### Guards

| Guard       | File            | Logic                                                           |
| ----------- | --------------- | --------------------------------------------------------------- |
| `authGuard` | `auth.guard.ts` | Redirects to `/login` if `AuthService.isAuthenticated` is false |
| `loadGuard` | `load.guard.ts` | Redirects to `/dashboard` if user is already authenticated      |

---

## Shared Layer

### Services

#### `StateService` — Signal Store

Central reactive state using Angular Signals. All writable signals live here; computed/derived values are in `DataService`.

Key signals:

| Signal                            | Description                         |
| --------------------------------- | ----------------------------------- |
| `spinner`                         | Loading state                       |
| `_tableDataResponse`              | Raw job application rows            |
| `_statusPreviewList`              | Status counts for preview cards     |
| `_countries` / `_currentCountry`  | Country list & selection            |
| `_currentCitiesByCompany`         | Cities filtered by selected country |
| `_companiesList`                  | Company autocomplete list           |
| `_globalFilteredChartData`        | Chart data filtered by day range    |
| `_cvProgressTimeline`             | Timeline data for progress chart    |
| `_currentChartData`               | Active chart series data            |
| `_agentSuggestions`               | AI suggestions list                 |
| `_jobSearchCriterias`             | Job search form criteria            |
| `_progressChart` / `_statusChart` | ApexCharts config objects           |

---

#### `DataService` — Application Facade

Wraps `StateService` + `ApiService` behind a unified API. Components interact only with `DataService`.

Responsibilities:

- Exposes computed signals derived from `StateService`.
- Orchestrates auth flows: `loginUser()`, `addNewUser()`, `verifyUserToken()`, `generateUserToken()`.
- Fetches data: `authorizedUserDataRequest()`, `getCitiesByCountry()`, `getAllCountries()`, `getCompanies()`, `getChartData()`.
- Mutations: `addOrUpdateApplication()`, `removeMultipleRows()`.
- Chart state: `setProgressChart()`, `setStatusChart()`, `setCurrentTabIndex()`, `setDaysFilter()`.

---

#### `FormsService` — Form Factory

Initializes typed reactive forms with validation.

| Method                         | Form                                      |
| ------------------------------ | ----------------------------------------- |
| `initializeRegistrationForm()` | Name, email, password, confirm password   |
| `tableRowInit()`               | New job application                       |
| `editRowInit(row)`             | Edit pre-populated with existing row data |

Custom validators: `passwordMatchValidator`, `futureDateValidator`.

---

#### `UIService` — UI Utilities

| Method / Property              | Description                        |
| ------------------------------ | ---------------------------------- |
| `colorSwitch(row)`             | Maps `StatusEnum` → CSS class name |
| `sortDataSource(source, sort)` | Sorts table by any column          |
| `isMobile()` / `isWebView()`   | Platform detection                 |
| `calcDays(days)`               | Converts day count to date filter  |
| `navBarLinks`                  | Sidebar link definitions           |
| `displayColumns`               | Table column order                 |
| `timeLineCategories`           | Chart X-axis labels                |

---

#### `ChartsService` — Data Transformer

Converts raw `ITableDataRow[]` into ApexCharts series format.

| Method                   | Output                                          |
| ------------------------ | ----------------------------------------------- |
| `progressChartBuilder()` | `{ x: company, y: cvCount }[]` — bar chart      |
| `statusChartBuilder()`   | `{ x: company, y: string[] }[]` — status ranges |

---

#### `RoutingService` — Navigation Helpers

Type-safe navigation methods: `toLogin()`, `toRegister()`, `toAccount()`, `toDashboard()`, `toActivity()`, `checkIsActive(route)`.

---

#### `AuthResolver` — Route Resolver

Implements `Resolve<AuthorizedUser | null>`. Called before every protected route renders. On token failure: calls `AuthService.logout()` and navigates to `/login`.

---

### Base Components

| Base Class            | Extends               | Purpose                                         |
| --------------------- | --------------------- | ----------------------------------------------- |
| `DialogBaseComponent` | —                     | Provides `openDialog()` via MatDialog           |
| `HelperBaseComponent` | `DialogBaseComponent` | Base for authenticated page components          |
| `FormsBaseComponent`  | `HelperBaseComponent` | Adds form filtering logic                       |
| `ChartsBaseComponent` | —                     | Checks signal readiness before rendering charts |

---

### Directives

| Directive           | Description                              |
| ------------------- | ---------------------------------------- |
| `SnackBarDirective` | Wrapper around `MatSnackBar`             |
| `FaderDirective`    | Adds a fade-in CSS class on element init |
| `MaterialDirective` | Applies Material form field styling      |
| `HoverDirective`    | Hover interaction helper                 |

---

### Generic Dialog

`GenericDialogComponent` is the single dialog used across the app. It accepts a `GenericDialogType` input:

```typescript
type GenericDialogType = {
  notification?: {
    title: NotificationsStatusEnum; // 'error' | 'successlog' | 'successreg'
    message: string;
  };
  form?: {
    formTitle: FormEnum; // 'add' | 'edit' | 'remove'
    formType: FormGroup;
  };
};
```

---

## Pages

### Dashboard (`/`)

- Host component: `DashboardComponent`
- Child widgets: `CvCounterComponent`, `StatusPreviewComponent`, `PositionsListComponent`, `MarketAnalystComponent`
- Displays: total CVs sent, status breakdown cards, charts

### Activity Table (`/activity`)

- Host component: `ActivityTableComponent`
- Full Material table with sorting, multi-select, day-range filter, inline CRUD via dialogs

---

## State Management

The app uses **Angular Signals** (no NgRx / RxJS BehaviorSubject store).

```
StateService          ← writable signals (raw state)
    ↑  write
DataService           ← computed signals + API call side-effects
    ↑  read
Components            ← read computed signals, call DataService methods
```

- Components never write to `StateService` directly.
- `DataService` taps HTTP responses to update `StateService` signals.
- Signal updates propagate automatically to all subscribed component templates.

---

## Data Flow

### HTTP Request

```
Component
  → DataService method
    → ApiService HTTP call
      → Backend REST API
        ← JSON response
      ← Observable
    ← tap() → StateService.signal.set()
  ← computed signal updates
← Component re-renders
```

### Authentication

```
User submits login form
  → DataService.loginUser()
    → ApiService.loginUserReq()
      ← { auth_token }
    → AuthService.setToken()        (localStorage + signal)
    → ApiService.verifyTokenReq()
      ← AuthorizedUser
    → StateService signals updated
  → RoutingService.toDashboard()
→ AuthResolver fires on route
  → verifyTokenReq() again
  → LayoutComponent mounts
  → DataService.authorizedUserDataRequest() loads table data
```

### Form Submission (Add / Edit Row)

```
Form component submits FormGroup.value
  → DataService.addOrUpdateApplication()
    → ApiService.addOrUpdateApplicationReq()
      ← updated ITableDataResponse
    → StateService._tableDataResponse.set()
    → ChartsService rebuilds chart data
    → StateService._progressChart / _statusChart updated
  → Dialog closes
→ Table and charts re-render automatically
```

---

## Key Interfaces & Models

### User & Auth

```typescript
interface UserLogin {
  email: string;
  password: string;
  auth_token?: string;
}
interface UserToken {
  auth_token: string;
}
interface AuthorizedUser {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
interface UserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
```

### Job Applications

```typescript
interface ITableDataRow {
  status: StatusEnum;
  company: string;
  position: string;
  positionType: PositionTypeEnum;
  platform: PlatformEnum;
  applicationDate: string;
  notes: string;
  hunch: string;
}

interface ITableDataResponse {
  jobId: string;
  tableData: ITableDataRow[];
}
```

### Charts

```typescript
type ChartDataType1 = { x: string; y: number }; // timeline bar
type ChartDataType2 = { x: string; y: string[] }; // status range
```

### AI / MCP

```typescript
interface IMCPRequest {
  model: "gpt-3" | "gpt-4" | string;
  input: string;
}
interface AgentSuggestion {
  text: string;
  id: string;
  source: "user" | "agent" | "criteria_changed" | "system";
  type: string;
  score: number;
  context: string;
}
```

---

## Enumerations

| Enum                      | Values (sample)                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `StatusEnum`              | `Awaiting response`, `HR reached back`, `Rejected`, `Passed`, `Ghosted`, … (15 total) |
| `PositionTypeEnum`        | `Fullstack`, `Frontend`, `Angular`, `Senior`, … (8 total)                             |
| `PositionStackEnum`       | `Angular`, `React.js`, `Node.js`, `.NET`, `TypeScript`, … (13 total)                  |
| `PlatformEnum`            | `LinkedIn`, `GlassDoor`, `Drushim`, `Email`, `Referral`, … (12 total)                 |
| `FormEnum`                | `add`, `edit`, `remove`                                                               |
| `ROUTES`                  | `login`, `register`, `dashboard`, `activity`, `account`, `notFound`                   |
| `NotificationsStatusEnum` | `error`, `successlog`, `successreg`                                                   |
| `ActionLabels`            | `Dismiss`, `Close`, `Try Again`, `Ok`, `Thanks!`                                      |

---

## Component Architecture

- **All components are standalone** — no NgModules anywhere in the app.
- **Change detection**: `OnPush` on most components for performance.
- **Effects over lifecycle hooks**: Angular `effect()` is preferred over `ngOnInit` for reacting to signal changes.
- **Explicit imports**: Every component declares its own `imports: []` array.

---

## Build & Run

| Task                 | Command                             |
| -------------------- | ----------------------------------- |
| Install dependencies | `npm install`                       |
| Development server   | `ng serve`                          |
| Production build     | `npm run build`                     |
| Run tests            | `npm test` _(no runner configured)_ |
| Lint                 | _not configured_                    |

**Entry points:**

- Client: `src/main.ts`
- SSR: `src/main.server.ts` + `server.ts` (Express)

**Angular version:** 18.2.0
**Package manager:** npm
