---
inclusion: auto
---

# React Best Practices

**Version 1.0.0**
Vercel Engineering
January 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring React and Next.js codebases. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React and Next.js applications, designed for AI agents and LLMs. Contains 40+ rules across 8 categories, prioritized by impact from critical (eliminating waterfalls, reducing bundle size) to incremental (advanced patterns). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated refactoring and code generation.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
3. [Server-Side Performance](#3-server-side-performance) — **HIGH**
4. [Client-Side Data Fetching](#4-client-side-data-fetching) — **MEDIUM-HIGH**
5. [Re-render Optimization](#5-re-render-optimization) — **MEDIUM**
6. [Rendering Performance](#6-rendering-performance) — **MEDIUM**
7. [JavaScript Performance](#7-javascript-performance) — **LOW-MEDIUM**
8. [Advanced Patterns](#8-advanced-patterns) — **LOW**

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Eliminating them yields the largest gains.

### 1.1 Check Cheap Conditions Before Async Flags

**Impact: HIGH (avoids unnecessary async work when a synchronous guard already fails)**

When a branch uses `await` for a flag or remote value and also requires a cheap synchronous condition, evaluate the cheap condition first.

```typescript
// Incorrect
const someFlag = await getFlag();
if (someFlag && someCondition) {
  /* ... */
}

// Correct
if (someCondition) {
  const someFlag = await getFlag();
  if (someFlag) {
    /* ... */
  }
}
```

### 1.2 Defer Await Until Needed

**Impact: HIGH (avoids blocking unused code paths)**

Move `await` operations into the branches where they're actually used.

```typescript
// Incorrect
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);
  if (skipProcessing) return { skipped: true };
  return processUserData(userData);
}

// Correct
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) return { skipped: true };
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

### 1.3 Dependency-Based Parallelization

**Impact: CRITICAL (2-10x improvement)**

For operations with partial dependencies, maximize parallelism.

```typescript
// Incorrect
const [user, config] = await Promise.all([fetchUser(), fetchConfig()]);
const profile = await fetchProfile(user.id);

// Correct
const userPromise = fetchUser();
const profilePromise = userPromise.then((user) => fetchProfile(user.id));
const [user, config, profile] = await Promise.all([userPromise, fetchConfig(), profilePromise]);
```

### 1.4 Prevent Waterfall Chains in API Routes

**Impact: CRITICAL (2-10x improvement)**

Start independent operations immediately, even if you don't await them yet.

```typescript
// Incorrect
const session = await auth();
const config = await fetchConfig();
const data = await fetchData(session.user.id);

// Correct
const sessionPromise = auth();
const configPromise = fetchConfig();
const session = await sessionPromise;
const [config, data] = await Promise.all([configPromise, fetchData(session.user.id)]);
```

### 1.5 Promise.all() for Independent Operations

**Impact: CRITICAL (2-10x improvement)**

When async operations have no interdependencies, execute them concurrently.

```typescript
// Incorrect
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();

// Correct
const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()]);
```

### 1.6 Strategic Suspense Boundaries

**Impact: HIGH (faster initial paint)**

Use Suspense boundaries to show wrapper UI faster while data loads.

```tsx
// Correct: wrapper shows immediately, data streams in
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <div>Footer</div>
    </div>
  );
}

async function DataDisplay() {
  const data = await fetchData();
  return <div>{data.content}</div>;
}
```

---

## 2. Bundle Size Optimization

**Impact: CRITICAL**

### 2.1 Avoid Barrel File Imports

**Impact: CRITICAL (200-800ms import cost)**

Import directly from source files instead of barrel files.

```tsx
// Incorrect
import { Check, X, Menu } from 'lucide-react';

// Correct (non-Next.js projects)
import Check from 'lucide-react/dist/esm/icons/check';
```

Libraries commonly affected: `lucide-react`, `@mui/material`, `@tabler/icons-react`, `react-icons`, `lodash`, `date-fns`.

### 2.2 Conditional Module Loading

**Impact: HIGH (loads large data only when needed)**

```tsx
function AnimationPlayer({ enabled, setEnabled }: Props) {
  const [frames, setFrames] = useState<Frame[] | null>(null);

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then((mod) => setFrames(mod.frames))
        .catch(() => setEnabled(false));
    }
  }, [enabled, frames, setEnabled]);

  if (!frames) return <Skeleton />;
  return <Canvas frames={frames} />;
}
```

### 2.3 Defer Non-Critical Third-Party Libraries

**Impact: MEDIUM (loads after hydration)**

Analytics, logging, and error tracking don't block user interaction. Load them after hydration with dynamic imports or `ssr: false`.

### 2.4 Dynamic Imports for Heavy Components

**Impact: CRITICAL (directly affects TTI and LCP)**

Use dynamic imports to lazy-load large components not needed on initial render.

### 2.5 Prefer Statically Analyzable Paths

**Impact: HIGH**

Use explicit maps or literal paths so the set of reachable files stays narrow and predictable.

```ts
// Incorrect
const Page = await import(PAGE_MODULES[pageName]);

// Correct
const PAGE_MODULES = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const;
const Page = await PAGE_MODULES[pageName]();
```

### 2.6 Preload Based on User Intent

**Impact: MEDIUM (reduces perceived latency)**

Preload heavy bundles on hover/focus before they're needed.

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    void import('./monaco-editor');
  };
  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  );
}
```

---

## 3. Server-Side Performance

**Impact: HIGH**

### 3.1 Authenticate Server Actions Like API Routes

Always verify authentication and authorization inside each Server Action.

### 3.2 Avoid Duplicate Serialization in RSC Props

Only pass fields that the client actually uses. Do transformations in client, not server.

### 3.3 Avoid Shared Module State for Request Data

Treat module scope on the server as process-wide shared memory, not request-local state.

### 3.4 Cross-Request LRU Caching

Use an LRU cache for data shared across sequential requests.

### 3.5 Hoist Static I/O to Module Level

Module-level code runs once when the module is first imported, not on every request.

### 3.6 Minimize Serialization at RSC Boundaries

Only pass fields that the client actually uses.

### 3.7 Parallel Data Fetching with Component Composition

Restructure with composition to parallelize data fetching.

### 3.8 Parallel Nested Data Fetching

Chain dependent fetches within each item's promise so a slow item doesn't block the rest.

### 3.9 Per-Request Deduplication with React.cache()

Use `React.cache()` for server-side request deduplication.

### 3.10 Use after() for Non-Blocking Operations

Schedule work that should execute after a response is sent.

---

## 4. Client-Side Data Fetching

**Impact: MEDIUM-HIGH**

### 4.1 Deduplicate Global Event Listeners

Use shared subscription patterns (SWR) to share global event listeners across component instances.

### 4.2 Use Passive Event Listeners for Scrolling Performance

Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling.

### 4.3 Use SWR/TanStack Query for Automatic Deduplication

Enable request deduplication, caching, and revalidation across component instances.

### 4.4 Version and Minimize localStorage Data

Add version prefix to keys and store only needed fields. Always wrap in try-catch.

---

## 5. Re-render Optimization

**Impact: MEDIUM**

### 5.1 Calculate Derived State During Rendering

If a value can be computed from current props/state, derive it during render.

```tsx
// Incorrect
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// Correct
const fullName = firstName + ' ' + lastName;
```

### 5.2 Defer State Reads to Usage Point

Don't subscribe to dynamic state if you only read it inside callbacks.

### 5.3 Don't Wrap Simple Expressions in useMemo

When an expression is simple and has a primitive result type, do not wrap it in `useMemo`.

### 5.4 Don't Define Components Inside Components

Defining a component inside another creates a new component type on every render causing remounts.

### 5.5 Extract Default Non-primitive Parameter Values to Constants

```tsx
// Incorrect
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: Props) {
  /* ... */
});

// Correct
const NOOP = () => {};
const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: Props) {
  /* ... */
});
```

### 5.6 Extract to Memoized Components

Extract expensive work into memoized components to enable early returns before computation.

### 5.7 Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

```tsx
// Incorrect
useEffect(() => {
  console.log(user.id);
}, [user]);

// Correct
useEffect(() => {
  console.log(user.id);
}, [user.id]);
```

### 5.8 Put Interaction Logic in Event Handlers

If a side effect is triggered by a specific user action, run it in that event handler, not via state + effect.

### 5.9 Split Combined Hook Computations

When a hook contains multiple independent tasks with different dependencies, split them.

### 5.10 Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values.

### 5.11 Use Functional setState Updates

When updating state based on the current state value, use the functional update form.

```tsx
// Incorrect
setItems([...items, ...newItems]);

// Correct
setItems((curr) => [...curr, ...newItems]);
```

### 5.12 Use Lazy State Initialization

Pass a function to `useState` for expensive initial values.

```tsx
// Incorrect
const [settings] = useState(JSON.parse(localStorage.getItem('settings') || '{}'));

// Correct
const [settings] = useState(() => JSON.parse(localStorage.getItem('settings') || '{}'));
```

### 5.13 Use Transitions for Non-Urgent Updates

Mark frequent, non-urgent state updates as transitions with `startTransition`.

### 5.14 Use useDeferredValue for Expensive Derived Renders

Keep input responsive while expensive computations lag behind.

### 5.15 Use useRef for Transient Values

When a value changes frequently and you don't need a re-render, store it in `useRef`.

---

## 6. Rendering Performance

**Impact: MEDIUM**

### 6.1 Animate SVG Wrapper Instead of SVG Element

Wrap SVG in a `<div>` and animate the wrapper for hardware acceleration.

### 6.2 CSS content-visibility for Long Lists

Apply `content-visibility: auto` to defer off-screen rendering.

### 6.3 Hoist Static JSX Elements

Extract static JSX outside components to avoid re-creation.

### 6.4 Optimize SVG Precision

Reduce SVG coordinate precision to decrease file size.

### 6.5 Prevent Hydration Mismatch Without Flickering

Use inline synchronous script to set DOM before React hydrates.

### 6.6 Suppress Expected Hydration Mismatches

Use `suppressHydrationWarning` for intentionally different server/client values.

### 6.7 Use Activity Component for Show/Hide

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle.

### 6.8 Use defer or async on Script Tags

Script tags without `defer` or `async` block HTML parsing.

### 6.9 Use Explicit Conditional Rendering

Use ternary operators instead of `&&` when condition can be `0` or `NaN`.

```tsx
// Incorrect: renders "0"
{
  count && <span>{count}</span>;
}

// Correct
{
  count > 0 ? <span>{count}</span> : null;
}
```

### 6.10 Use React DOM Resource Hints

Use `prefetchDNS`, `preconnect`, `preload`, `preloadModule`, `preinit`, `preinitModule` for resource optimization.

### 6.11 Use useTransition Over Manual Loading States

Use `useTransition` instead of manual `useState` for loading states.

---

## 7. JavaScript Performance

**Impact: LOW-MEDIUM**

### 7.1 Avoid Layout Thrashing

Avoid interleaving style writes with layout reads.

### 7.2 Build Index Maps for Repeated Lookups

Multiple `.find()` calls by the same key should use a Map.

### 7.3 Cache Property Access in Loops

Cache object property lookups in hot paths.

### 7.4 Cache Repeated Function Calls

Use a module-level Map to cache function results.

### 7.5 Cache Storage API Calls

`localStorage`, `sessionStorage` are synchronous and expensive. Cache reads in memory.

### 7.6 Combine Multiple Array Iterations

Multiple `.filter()` or `.map()` calls iterate multiple times. Combine into one loop.

### 7.7 Defer Non-Critical Work with requestIdleCallback

Schedule non-critical work during browser idle periods.

### 7.8 Early Length Check for Array Comparisons

Check lengths first before expensive array comparisons.

### 7.9 Early Return from Functions

Return early when result is determined to skip unnecessary processing.

### 7.10 Hoist RegExp Creation

Don't create RegExp inside render. Hoist to module scope or memoize.

### 7.11 Use flatMap to Map and Filter in One Pass

```typescript
// Incorrect: 2 iterations
const names = users.map((u) => (u.isActive ? u.name : null)).filter(Boolean);

// Correct: 1 iteration
const names = users.flatMap((u) => (u.isActive ? [u.name] : []));
```

### 7.12 Use Loop for Min/Max Instead of Sort

Finding min/max only requires O(n), not O(n log n) sort.

### 7.13 Use Set/Map for O(1) Lookups

Convert arrays to Set/Map for repeated membership checks.

### 7.14 Use toSorted() Instead of sort() for Immutability

`.sort()` mutates the array. Use `.toSorted()` for React state safety.

---

## 8. Advanced Patterns

**Impact: LOW**

### 8.1 Do Not Put Effect Events in Dependency Arrays

Effect Event functions intentionally change identity every render.

### 8.2 Initialize App Once, Not Per Mount

Use a module-level guard for app-wide initialization.

```tsx
let didInit = false;
function Comp() {
  useEffect(() => {
    if (didInit) return;
    didInit = true;
    loadFromStorage();
    checkAuthToken();
  }, []);
}
```

### 8.3 Store Event Handlers in Refs

Store callbacks in refs when used in effects that shouldn't re-subscribe.

### 8.4 useEffectEvent for Stable Callback Refs

Access latest values in callbacks without adding them to dependency arrays.

---

## References

- [react.dev](https://react.dev)
- [nextjs.org](https://nextjs.org)
- [swr.vercel.app](https://swr.vercel.app)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [Vercel Blog: How we optimized package imports](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Vercel Blog: How we made the dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
