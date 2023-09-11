# react-persistent-state-hook

<div align="center">

[![Build status](https://img.shields.io/github/actions/workflow/status/deniskabana/react-persistent-state-hook/pr-and-main-tests.yml?branch=main&style=for-the-badge)](/actions/workflows/pr-and-main-tests.yml)
[![Size](https://img.shields.io/bundlephobia/minzip/react-persistent-state-hook?style=for-the-badge)](https://bundlephobia.com/package/react-persistent-state-hook)
[![Version](https://img.shields.io/npm/v/react-persistent-state-hook?style=for-the-badge)](https://www.npmjs.com/package/react-persistent-state-hook)
[![License](https://img.shields.io/github/license/deniskabana/react-persistent-state-hook?style=for-the-badge)](./LICENSE)

</div>

💡🧠 A React `useState()` replacement with built-in persistence with [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

```bash
yarn add react-persistent-state-hook
# or
npm i -S react-persistent-state-hook
```

```typescript
const [name, setName] = usePersistentState("John", "unique-key")
```

See [Roadmap](#roadmap) for future plans or read further to learn more about this magic 🧙‍♀️.

---

### Features

- **Drop-in replacement** - for React's `useState` hook without changing functionality
- **Zero configuration** - provide a key, optionally provide a storage type and you're done
- **Platform-agnostic** - will behave exactly like `useState` if Web Storage API is not available
- **No extra overhead** - 1 hook, 1 peer dependency - `React >= 16.8`
- **TypeScript support** - fully typed, behaves exactly like React's `useState`

_Coming soon_ 💡

- Custom storage adapters (`config.storageAdapter`) - allows the use of redux, React Native state or any custom solution
- React Native support - `AsyncStorage` API
- and more... See [Roadmap](#roadmap)

---

### Usage

```typescript
// Replace React.useState without breaking functionality
const [count, setCount] = usePersistentState(0)
const [count, setCount] = usePersistentState(() => 0)
```

```typescript
// Add a unique key to persist state - uses sessionStorage by default
const [count, setCount] = usePersistentState(0, "unique-key")
```

> 💡 Possible Redux replacement with zero configuration (for small apps and UI options) ☝️

```typescript
// Easy switching between localStorage and sessionStorage
const [count, setCount] = usePersistentState(0, "unique-key", "local")
```

```typescript
// First-class TypeScript support replicating React.useState types and overloads 🎉
const [count, setCount] = usePersistentState<boolean>(0, Keys.Count)
```

```typescript
// Configurable with options API
const [count, setCount] = usePersistentState(0, "unique-key", { verbose: true })
```

_More usage options and tutorials coming soon! (see [Roadmap](#roadmap))_

---

### Options API

```typescript
/** Options API to change behavior */
export type Options = Partial<{
  /** Silently swallow all (even user) errors.
   *  @default process.env.NODE_ENV === "production" */
  silent: boolean

  /** Print all warnings and errors in console. Overrides `silent` option.
   *  @default false */
  verbose: boolean
}>
```

_Source: [usePersistentState.ts:22](./src/usePersistentState.ts#L22)_

---

### Roadmap

Current:

- Add config key for custom serialize and deserialize functions to use instead JSON.stringify and JSON.parse
- Add config key for resolution strategy when states are conflicting (i.e. different types or structure) - `merge`, `overwrite`, `throw`
- Add storage versioning for when data structure changes (like redux-persist)
- Write more examples, tutorials and document everything in this roadmap
- Release 1.0.0 publicly and add to Awesome React Hooks 🎉

After 1.0.0 release:

- Implement storage adapters API (`config.storageAdapter`) as a major feature
- Allow disabling storage usage with a config key (e.g. `persist: false`)

Plans for v2:

- Remove Web Storage API as a core feature and implement storage adapters API
- Add support for React Native - `AsyncStorage` API
- Allow and prominently document custom hook implementation of `usePersistentState` with persistent config, etc. (e.g. `export const usePersistentState = createPersistentStateHook({ ...config })`)
- Allow simplified usage `const [name, setName] = usePersistentState("John")`
  - Implement default storage mechanism that uses the best available storage in any environment with a graceful fallback
  - Implement automatic key-gen without user input _(discussion and help pending)_ - this allows "unsafe" usage without keys
