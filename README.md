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

- [ ] Add support for config API - `usePersistentState(initialState, key, sessionType, config?: PersistentStateConfig)`
  - [ ] Add support for custom storage API - `config.storage` (allows replacing of BrowserStorage)
  - [ ] Add conditional persistence - allow disabling storage usage with a config key
  - [ ] Add config key to swallow errors/warnings silently without logging to console
  - [ ] Add custom serialize and deserialize functions to use with JSON.stringify and JSON.parse
- [ ] Add custom storage API as a USP and major feature - allows users to use redux, custom states, API comm, etc.
- [ ] Write tutorials about how to use every feature, what happens in SSR, and with options combinations etc.; Include warnings about improper usage.
