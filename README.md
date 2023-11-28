<div align="center">

# react-persistent-state-hook

`usePersistentState(value, storageKey, options): [value, setValue, purgeValue]`

</div>

<div align="center">

[![Build status](https://img.shields.io/github/actions/workflow/status/deniskabana/react-persistent-state-hook/pr-and-main-tests.yml?branch=main&style=for-the-badge)](/actions/workflows/pr-and-main-tests.yml)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-persistent-state-hook?style=for-the-badge)](https://bundlephobia.com/package/react-persistent-state-hook?style=for-the-badge)
[![License](https://img.shields.io/github/license/deniskabana/react-persistent-state-hook?style=for-the-badge)](./LICENSE)
[![Version](https://img.shields.io/npm/v/react-persistent-state-hook?style=for-the-badge)](https://www.npmjs.com/package/react-persistent-state-hook)
[![status](https://img.shields.io/badge/status-production_ready-green?style=for-the-badge)](https://www.npmjs.com/package/react-persistent-state-hook)

💡🧠 A React `useState()` replacement with built-in persistence with [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). First-class TypeScript support 💪

</div>

```bash
yarn add react-persistent-state-hook # or npm, pnpm, bun, etc.
```

```typescript
// It works just like magic 🌟
const [name, setName] = usePersistentState("John", "user-name")

// For more safety, provide a UNIQUE storageKey (strongly recommended 💪)
const [name, setName] = usePersistentState("Billy", "ui/userAuth/name")

// For more versatility, use ENUMs as keys
const [name, setName] = usePersistentState("Tim", StorageKeys.USER_NAME)
```

---

**Table of contents:**

1. [Key Features](#key-features)
2. [Usage](#usage)
3. [Options API](#options-api)
4. [Roadmap](#roadmap)
5. [Contributing](#contributing)

---

### Key Features

**`usePersistentState` adds persistence to `React.useState` method:**

1. 🐣 **Plug'n'play with Minimal Configuration**:

   A simple replacement for `React.useState` hook - provide a unique key and you're good to go!

2. 🧠 **Data Persistence**:

   Store state values in `localStorage` or `sessionStorage`. Until version 2, we only support Web Storage API, but more are coming.

3. ♻️ **Platform-Agnostic**:

   `usePersistentState` gracefully handles scenarios where Web Storage is not available, behaving exactly like `React.useState`.

4. 📭 **No Dependencies**:

   Keep your project light - no dependencies and a single peer dependency (`react >= 16.8`).

5. 🧑‍💻 **First-class TypeScript Support**:

   Fully typed with TypeScript! 🎉

6. 🚧 **Roadmap for Continuous Improvement**:

   - The roadmap outlines upcoming features and enhancements, ensuring your state management needs are met.

7. 📚 **Documentation and Tutorials**:

   Straight-forward readme with examples and comprehensive JSDoc annotations for the hook and its options.

RPSH is committed to delivering a minimal and flexible solution for state management and persistence in React applications. Join me on this journey by contributing! 🚀

---

### Usage

Start by importing the hook:

```typescript
import { usePersistentState } from "react-persistent-state-hook"
```

#### Basic usage

```typescript
// Replace React.useState without breaking functionality - uses `localStorage`
const [count, setCount] = usePersistentState(0, "count")
const [count, setCount] = usePersistentState(() => 0, "count")

// Easy switching between local and session storages
const [count, setCount] = usePersistentState(0, "unique-key", "local")
const [count, setCount] = usePersistentState(0, "unique-key", "session")

// Configurable with options API
const [count, setCount] = usePersistentState(0, "unique-key", { verbose: true, persistent: false })
```

> 💡 Possible state management replacement (like context or Redux) with zero configuration in situations where data loss is acceptable (like UI preferences). ☝️

```typescript
// You can use prefixes to group related keys
const [count, setCount] = usePersistentState(0, { prefix: "homepage", storageKey: "count" })
```

#### Advanced usage

💡 You can create a custom `usePersistentState` hook with default options easily to share or persist configuration values across your application or different contexts:

```typescript
import { createPersistentStateHook } from "react-persistent-state-hook"

// Create your own hook with defaults
export const useMyPersistentState = createPersistentStateHook({
  storageType: "session",
  prefix: "homepage/pagination",
})

// Usage - you can still override default options
const [page, setPage] = useMyPersistentState(1, { storageKey: "page" })
```

---

### Options API

The Options API in `react-persistent-state-hook` allows you to tweak the behavior of the hook. More configuration options are coming soon in minor releases.

Breaking changes in the Options API or elsewhere in `react-persistent-state-hook` are only released in major versions 🤞

```typescript
type Options = {
  /** Print all warnings and errors in console. Overrides `silent` option.
   *  @default false */
  verbose: boolean

  /** The type of Web Storage API to use (either "session" or "local").
   *  @default "local" */
  storageType: StorageType

  /** Allow programatically enabling and disabling persistence in-place.
   *  @default true */
  persistent: boolean

  /** Allow the use of custom key prefix - group contexts or invalidate state version.
   *  @default "[rpsh]" */
  prefix: string
}
```

---

### Roadmap

#### Current Plans (`v1.0.0` Release):

- **Resolution Strategies ?**
  - Add option to always override with new value, prefer stored value, or use stored if new value is `undefined` (default)
- **1.0.0 Release 🎉**
  - Freeze the `main` branch and move development to `dev-v1.x` branches, that eventually get merged into `main` as PRs. We need to act responsible 👨‍🏫

#### Planned Improvements

- **More Storage Types**
  - Add support for `IndexedDB`, `AsyncStorage` (React Native), URL params, cookies, etc.
- **Even Smaller Footprint**
  - Reduce bundle size as much as possible
- **Custom Serialization and Deserialization Methods**
  - Add the ability to configure your own serialization and deserialization functions instead of relying on `JSON.stringify` and `JSON.parse` - for example to support `Date` and custom objects
- **Open-source Friendliness**
  - Add a `CONTRIBUTING.md` file to make it easier for contributors to get started, link to it from `README.md`
  - Provide a solid tutorial for contributors, set up PR template, issue template, etc.
- **Storage Adapters API**
  - Say goodbye to Web Storage API as a core feature and say hello to storage adapters API. More flexibility, more possibilities! 🔄
  - Implement Web Storage and in-memory storage as exported storage adapter functions / objects

---

### Contributing

[Start a new issue](https://github.com/deniskabana/react-persistent-state-hook/issues) whenever you have any questions, problems or suggestions! Or feel free to [open a pull request](https://github.com/deniskabana/react-persistent-state-hook/pulls) if you want to contribute. To increase the speed of getting your PR merged, please open an issue first to discuss your idea.

More info coming soon.
