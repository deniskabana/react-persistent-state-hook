# react-persistent-state-hook

<div align="center">

[![Build status](https://img.shields.io/github/actions/workflow/status/deniskabana/react-persistent-state-hook/pr-and-main-tests.yml?branch=main&style=for-the-badge)](/actions/workflows/pr-and-main-tests.yml)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-persistent-state-hook?style=for-the-badge)](https://bundlephobia.com/package/react-persistent-state-hook?style=for-the-badge)
[![License](https://img.shields.io/github/license/deniskabana/react-persistent-state-hook?style=for-the-badge)](./LICENSE)
[![Version](https://img.shields.io/npm/v/react-persistent-state-hook?style=for-the-badge)](https://www.npmjs.com/package/react-persistent-state-hook)
[![status](https://img.shields.io/badge/status-production_ready-green?style=for-the-badge)](https://www.npmjs.com/package/react-persistent-state-hook)

</div>

💡🧠 A React `useState()` replacement with built-in persistence with [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). First-class TypeScript support 💪

```bash
yarn add react-persistent-state-hook # or different package manager
```

```typescript
const [name, setName] = usePersistentState("John", "unique-key")
```

See [Roadmap](#roadmap) for future plans or read further to learn more about this magic 🧙‍♀️.

[Start a new issue](https://github.com/deniskabana/react-persistent-state-hook/issues) whenever you have any questions, problems or suggestions! Or feel free to [open a pull request](https://github.com/deniskabana/react-persistent-state-hook/pulls) if you want to contribute. To increase the speed of getting your PR merged, please open an issue first to discuss your idea.

---

### Key Features

**`usePersistentState` offers a range of features that enhance and replace React's `useState()` method:**

1. **Seamless Integration**:

   > A drop-in replacement for React's `useState` hook without breaking functionality.

2. **Data Persistence**:

   > Store state values in the Web Storage API (`localStorage` or `sessionStorage`). Until version 2, we only support Web Storage API as a core feature.

3. **Zero Configuration**:

   > Provide a unique `storageKey` to any state you want to persist. Optionally, configure storage type and other options.

4. **Platform-Agnostic**:

   > `usePersistentState` gracefully handles scenarios where Web Storage is not available, behaving exactly like `useState`.

5. **Minimal Dependencies**:

   > Keep your project lightweight with just one hook and one peer dependency (`react >= 16.8`). See [minzipped size](#react-persistent-state-hook) for details.

6. **TypeScript Support**:

   > Fully typed with TypeScript, providing the same type support as React's `useState`.

7. **Coming Soon 💡 - Custom Storage Adapters**:

   > Configure custom storage adapters, allowing integration with libraries like Redux, React Native state, or any custom storage solution.

8. **Coming Soon 💡 - React Native Support**:

   > Extend the benefits of state persistence to React Native projects with support for the `AsyncStorage` API.

9. **Roadmap for Continuous Improvement**:

   > Our roadmap outlines upcoming features and enhancements, ensuring your state management needs are met.

10. **Documentation and Tutorials**:
    > As we grow, expect more usage options, tutorials, and comprehensive documentation to make integration even smoother.

We're committed to delivering a minimal and flexible solution for state management and persistence in React applications. Join us on this journey by contributing! 🚀

_PS: We made our JSDoc annotation for the hook comprehensive - you don't have to leave your IDE to use this hook!_

---

### Usage

Start by importing the hook:

```typescript
import { usePersistentState } from "react-persistent-state-hook"
```

Basic usage

```typescript
// Replace React.useState without breaking functionality
const [count, setCount] = usePersistentState(0)
const [count, setCount] = usePersistentState(() => 0)

// Add a unique key to persist state - uses sessionStorage by default
const [count, setCount] = usePersistentState(0, "unique-key")
```

> 💡 Possible state management replacement (like context or Redux) with zero configuration in situations where data loss is acceptable (like UI preferences). ☝️

Advanced usage

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

```typescript
// Real world usage example:
const [theme, setTheme] = usePersistentState<Theme>(UIThemes.Light, StorageKeys.Theme, "local")
// or:
const [tableUxPref, setTableUxPref] = usePersistentState(
  { showHeader: true, showFooter: true, perPage: 15, compact: true, fixedHeader: true },
  StorageKeys.TableUxPref,
  "local",
)
```

Function signature for better understanding - this overload is used when the optional generic state type is provided in TS:

```typescript
usePersistentState<S>(
  initialState: S | (() => S),
  storageKey?: string,
  storageType?: StorageType,
  options?: Options,
): [S, Dispatch<SetStateAction<S>>, PurgeMethod]
```

_More usage options and tutorials coming soon! (see [Roadmap](#roadmap))_

---

### Options API

The Options API in `react-persistent-state-hook` allows you to tweak the behavior of the hook. More configuration options are coming soon in minor releases.

Breaking changes in the Options API or elsewhere in `react-persistent-state-hook` are only released in major versions 🤞

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

_See source: [`src/usePersistentState.ts:22`](./src/usePersistentState.ts#L22)_

---

### Roadmap

#### Current Plans (`v1.0.0` Release):

> _🚧 Work in progress; Expected finish 09/2023_

- **Resolution Strategies**
  - Introduce options for handling conflicts when states have different types or structures. Choose from `prefer-stored`, `prefer-new`, `throw-invalid-type`, `merge-prefer-new` and `merge-prefer-stored` (for objects, otherwise `prefer-stored` is used)
  - Default to `merge-prefer-new` to help with type migrations, this falls back to `prefer-stored` for non-objects.
  - Add a config key - `resolutionStrategy` - that can be used to override the default resolution strategy for a specific state
- **Generate Hook with Static Config**
  - Allow and prominently document custom hook implementation of `usePersistentState` with persistent config - `export const usePersistentState = createPersistentStateHook({ ...config })`
- **Conditional persistence**
  - Add a config key - `persist: false` - that can conditionally disable persistence for a specific state
- **1.0.0 Release 🎉**

#### Planned Improvements (`v1.x` Releases):

> _📝 To-do; Expected finish 10/2023_

- **Storage Versioning support**
  - Add storage versioning for when data structure changes (like redux-persist)
- **Custom Serialization and Deserialization Functions**
  - Add the ability to configure your own serialization and deserialization functions instead of relying on `JSON.stringify` and `JSON.parse`

#### Plans for Version 2:

> _📝 To-do; Expected finish 12/2023_

- **Storage adapters API**
  - Say goodbye to Web Storage API as a core feature and say hello to storage adapters API. More flexibility, more possibilities! 🔄
  - Implement Web Storage and in-memory storage as exported storage adapter functions / objects
- **React Native support**
  - Extend our magic to React Native projects with support for the `AsyncStorage` API
- **Simplified Usage**
  - Making it even easier with simplified usage. Just `const [name, setName] = usePersistentState("John")`, and we'll handle the rest based on your environment. It's like magic ✨ as long as you don't care about data safety!
  - Introduce a **breaking change** of the default types of storage 🚨
  - Implement automatic key-gen without any user input to make default storage automagically _(help potentially needed)_ work 🧑‍🔬
