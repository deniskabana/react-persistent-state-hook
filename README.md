## react-persistent-state-hook

> React.useState() + BrowserStorage API persistence

---

### Features

- Direct replacement for React's `useState` API
- No configuration needed, just import and use
- Error-less functionality even in SSR - will behave exactly like `useState` if storage is not available
- No overhead - 1 hook, 1 peer dependency - React

---

### Usage

Install library

```bash
npm i -S react-persistent-state-hook
# or
yarn add react-persistent-state-hook
```

Start coding!

```tsx
// Drop-in replacement for React.useState() - just add key
const [count, setCount] = usePersistentState(0, "myCountUniqueKey")

// More robust usage
const [user, setUser] = usePersistentState<IUser>(userDataFromApi, "myUserUniqueKey", "sessionStorage")

// Fallback to React.useState() automatically if storage is not available or key not provided
const [isOpen, setIsOpen] = usePersistentState(false)
```

---

### Roadmap

- [ ] Add support for config API - `usePersistentState(initialState, key, sessionType, config?: PersistentStateConfig)`
  - [ ] Add support for custom storage API - `config.storage` (allows replacing of BrowserStorage)
  - [ ] Add conditional persistence - allow disabling storage usage with a config key
  - [ ] Add config key to swallow errors/warnings silently without logging to console
  - [ ] Add custom serialize and deserialize functions to use with JSON.stringify and JSON.parse
- [ ] Add custom storage API as a USP and major feature - allows users to use redux, custom states, API comm, etc.
- [ ] Write tutorials about how to use every feature, what happens in SSR, and with options combinations etc.; Include warnings about improper usage.
