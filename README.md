## react-persistent-state-hook

> React.useState() + BrowserStorage API persistence

---

<div align="center">

![Build status](https://img.shields.io/github/actions/workflow/status/deniskabana/react-persistent-state-hook/pr-and-main-tests.yml?branch=main&style=for-the-badge)
![Size](https://img.shields.io/bundlephobia/minzip/react-persistent-state-hook?style=for-the-badge)
![Version](https://img.shields.io/npm/v/react-persistent-state-hook?style=for-the-badge)
![License](https://img.shields.io/github/license/deniskabana/react-persistent-state-hook?style=for-the-badge)

</div>

---

### Features

- **Drop-in replacement** for React's `useState` hook
- **Zero configuration** - just use it
- **SSR optimized** - will behave exactly like `useState` if storage is not available
- **No overhead** - 1 hook, 1 peer dependency - React
- **TypeScript support** - fully typed

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
// Simple JS and TS usage
const [count, setCount] = usePersistentState(0, "myCountUniqueKey")

// More robust TS usage
const [user, setUser] = usePersistentState<IUser>(defaultUser, StorageKey.User, StorageType.Session)

// React.useState graceful fallback
const [isOpen, setIsOpen] = usePersistentState(false)
```

_More usage options and tutorials coming soon! (see Roadmap)_

---

### Roadmap

- Add a third return - option to clear storage for a key
- Add storage versioning for when data structure changes (like redux-persist)
- Add unit tests and switch to TDD
- Add support for config API - `usePersistentState(initialState, key, sessionType, config?: PersistentStateConfig)`
  - Add support for custom storage API - `config.storage` (allows replacing of BrowserStorage)
  - Add conditional persistence - allow disabling storage usage with a config key
  - Add config key to swallow errors/warnings silently without logging to console
  - Add custom serialize and deserialize functions to use with JSON.stringify and JSON.parse
- Add custom storage API as a USP and major feature - allows users to use redux, custom states, API comm, etc.
- Write more examples & tutorials and document everything in this roadmap
