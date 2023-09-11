## react-persistent-state-hook

> React.useState() + BrowserStorage API persistence

```typescript
const [isOpen, setIsOpen] = usePersistentState(false, "unique-key")
```

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
- **SSR optimized** - will behave exactly like `useState` if storage is not available
- **No overhead** - 1 hook, 1 peer dependency - `React >= 16.8`
- **TypeScript support** - fully typed, behaves exactly like React's `useState`
- **Supports custom storage adapter** - compatible with any state management (coming soon...)

Simplify your state management - now you don't need context, redux and other state managers to remember unimportant states like UI preferences, user settings, etc. - store them for the session or forever with this hook!

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
// Replace React.useState safely without functionality changing
const [isOpen, setIsOpen] = usePersistentState(false)

// Add a key to persist the state during this session and retrieve
// an optional purge method to clear Storage for this key (without changing state)
const [count, setCount, purgeCount] = usePersistentState(0, "myCountUniqueKey")

// Works perfectly with function initializator and with local storage as well
const [count, setCount, purgeCount] = usePersistentState(() => 0, "myCountUniqueKey", "local")

// Fully typed usage with TypeScript works great as well
const [user, setUser, clearUser] = usePersistentState<{ name: string }>(defaultUser, AppKeys.User, StorageType.Session)
```

_More usage options and tutorials coming soon! (see Roadmap)_

---

### Roadmap

- Add a third return - option to clear storage for a key
- Add support for config API - `usePersistentState(initialState, key, sessionType, config?: PersistentStateConfig)`
  - Add support for custom storage API - `config.storage` (allows replacing of BrowserStorage)
  - Add conditional persistence - allow disabling storage usage with a config key
  - Add config key to swallow errors/warnings silently without logging to console
  - Add custom serialize and deserialize functions to use with JSON.stringify and JSON.parse
- Add custom storage API adapters as a USP and major feature - allows users to use redux, custom states, API comm, etc.
- Add storage versioning for when data structure changes (like redux-persist)
- Write more examples & tutorials and document everything in this roadmap
- Release 1.0.0 publicly
