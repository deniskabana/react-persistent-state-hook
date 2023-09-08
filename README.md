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

---

### Roadmap

- [ ] Add overload for accepting params with a config object `(JSONValidValue, {...config}: Config)`
- [ ] Add conditional persistence - allow disabling storage usage with a config key
- [ ] Add config key to swallow errors silently without logging errors to console
