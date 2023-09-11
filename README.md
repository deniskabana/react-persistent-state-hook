## react-persistent-state-hook

> React.useState() + BrowserStorage API that works as a drop-in replacement for React.useState() with zero configuration

```typescript
const [options, setOptions] = usePersistentState({ per_page: 10 }, "unique-key")
```

See [Roadmap](#roadmap) for future plans

---

<div align="center">

![Build status](https://img.shields.io/github/actions/workflow/status/deniskabana/react-persistent-state-hook/pr-and-main-tests.yml?branch=main&style=for-the-badge)
![Size](https://img.shields.io/bundlephobia/minzip/react-persistent-state-hook?style=for-the-badge)
![Version](https://img.shields.io/npm/v/react-persistent-state-hook?style=for-the-badge)
![License](https://img.shields.io/github/license/deniskabana/react-persistent-state-hook?style=for-the-badge)

</div>

---

### Features

- **Drop-in replacement** - for React's `useState` hook without changing functionality
- **Zero configuration** - provide a key, optionally provide a storage type and you're done
- **Platform-agnostic** - will behave exactly like `useState` if BrowserStorage is not available
- **No extra overhead** - 1 hook, 1 peer dependency - `React >= 16.8`
- **TypeScript support** - fully typed, behaves exactly like React's `useState`

_Coming soon_ 💡

- Custom storage adapters (`config.storageAdapter`) - allows the use of redux, React Native state or any custom solution
- React Native support - `AsyncStorage` API
- and more... See [Roadmap](#roadmap)

---

### Usage

**1. Install library**

```bash
yarn add react-persistent-state-hook
# or
npm i -S react-persistent-state-hook
```

**2. Start coding!**

```typescript
// Replace React.useState without breaking functionality
const [count, setCount] = usePersistentState(0)
const [count, setCount] = usePersistentState(() => 0)
```

```typescript
// Add a unique key to persist state - uses localStorage by default
const [count, setCount] = usePersistentState(0, "unique-key")
```

> 💡 _Possible Redux replacement with zero configuration_ ☝️

```typescript
// Easy switching between localStorage and sessionStorage
const [count, setCount] = usePersistentState(0, "unique-key", "local")
```

```typescript
// First-class TypeScript support replicating React.useState types and overloads 🎉
const [count, setCount] = usePersistentState<boolean>(0, Keys.Count)
```

_More usage options and tutorials coming soon! (see [Roadmap](#roadmap))_

---

### Options API

Source: [usePersistentState.ts](./src/usePersistentState.ts#L18)

```typescript
/** Optional Options API for usePersistentState */
export type Options = Partial<{
  /** Print to console all warnings and errors. **Default**: `false` */
  verbose: boolean
  /** Silently swallow all (even user) errors. **Default**: `false` */
  silent: boolean
}>
```

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

- Remove BrowserStorage as a core feature and implement storage adapters API
- Add support for React Native - `AsyncStorage` API
- Allow and prominently document custom hook implementation of `usePersistentState` with persistent config, etc. (e.g. `export const usePersistentState = createPersistentStateHook({ ...config })`)
- Allow simplified usage `const [name, setName] = usePersistentState("John")`
  - Implement default storage mechanism that uses the best available storage in any environment with a graceful fallback
  - Implement automatic key-gen without user input _(discussion and help pending)_ - this allows "unsafe" usage without keys
