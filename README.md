<div align="center">

# react-persistent-state-hook

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
yarn add react-persistent-state-hook # or different package manager
```

```typescript
const [name, setName] = usePersistentState("John") // It just works 🎉
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

**`usePersistentState` offers a range of features that enhance and replace React's `useState()` method:**

1. 🐣 **Plug'n'play with Zero Configuration**:

   - A drop-in replacement for React's `useState` hook without breaking your code or changing your workflow. Provide a unique key to persist state values more reliably.

2. 🧠 **Data Persistence**:

   - Store state values in `localStorage` or `sessionStorage`. Until version 2, we only support Web Storage API, but more are coming.

3. ♻️ **Platform-Agnostic**:

   - `usePersistentState` gracefully handles scenarios where Web Storage is not available, behaving exactly like `useState`.

4. 📭 **No Dependencies**:

   - Keep your project light - no dependencies and a single peer dependency (`react >= 16.8`).

5. 🧑‍💻 **First-class TypeScript Support**:

   - Fully typed with TypeScript, providing the same type support as React's `useState` (including overloads).

6. 🚧 **Roadmap for Continuous Improvement**:

   - Our roadmap outlines upcoming features and enhancements, ensuring your state management needs are met.

7. 📚 **Documentation and Tutorials**:

   - Straight-forward readme with examples and comprehensive JSDoc annotations for the hook and its options (all types are exported).

8. Coming Soon - **Custom Storage Adapters**:

   - Allowing integration with libraries like Redux, React Native state APIs, or custom storage solutions.

9. Coming Soon - **React Native Support**:

   - Extend the benefits of state persistence to React Native projects by implementing a first-class `AsyncStorage` API adapter.

We're committed to delivering a minimal and flexible solution for state management and persistence in React applications. Join us on this journey by contributing! 🚀

_PS: We made our JSDoc annotation for the hook comprehensive - you don't have to leave your IDE to use this hook!_

---

### Usage

Start by importing the hook:

```typescript
import { usePersistentState } from "react-persistent-state-hook"
```

#### Basic usage

```typescript
// Replace React.useState and enjoy persistence with localStorage 🎉
const [count, setCount] = usePersistentState(0)
const [count, setCount] = usePersistentState(() => 0)

// Add a unique key for more reliable persistance
const [count, setCount] = usePersistentState(0, "local", { storageKey: "unique-key" })
```

> 💡 Possible state management replacement (like context or Redux) with zero configuration in situations where data loss is acceptable (like UI preferences). ☝️

#### Advanced usage

```typescript
// Easy switching between localStorage and sessionStorage
const [count, setCount] = usePersistentState(0, "session")
```

```typescript
// Configurable with options API
const [count, setCount] = usePersistentState(0, "session", { verbose: true })
```

```typescript
// A bit more robust example
const DEFAULT_UX_PREF = { perPage: 15, compact: true, fixedHeader: true }

const [tableUxPref, setTableUxPref] = usePersistentState<typeof DEFAULT_UX_PREF>({ ...DEFAULT_UX_PREF }, "local", {
  storageKey: "tableUxPref",
})
```

---

### Options API

The Options API in `react-persistent-state-hook` allows you to tweak the behavior of the hook. More configuration options are coming soon in minor releases.

Breaking changes in the Options API or elsewhere in `react-persistent-state-hook` are only released in major versions 🤞

```typescript
/** Options API to change behavior */
export type Options = {
  /** Print all warnings and errors in console. Overrides `silent` option.
   *  @default false */
  verbose: boolean

  /** A unique key used to store the state value in the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
   *  @default undefined */
  storageKey: string | undefined
}
```

_See source: [`src/usePersistentState.ts:23`](./src/usePersistentState.ts#L23)_

---

### Roadmap

#### Current Plans (`v1.0.0` Release):

> _🚧 Work in progress; Expected finish 09/2023_

- **Resolution Strategies**
  - Introduce options for handling conflicts when states have different types or structures. Choose from `prefer-stored`, `prefer-new`, `throw-invalid-type`, `merge-prefer-new` and `merge-prefer-stored` (for objects, otherwise `prefer-stored` is used)
  - Default to `merge-prefer-new` to help with type migrations, this falls back to `prefer-stored` for non-objects.
  - Add config keys - `resolutionStrategy` and `resolutionMethod` - that can be used to override the default resolution behavior
- **Generate Hook with Static Config**
  - Allow and prominently document custom hook implementation of `usePersistentState` with persistent config - `export const usePersistentState = createPersistentStateHook({ ...config })`
- **Conditional persistence**
  - Add a config key - `persist: false` - that can conditionally disable persistence for a specific state
- **1.0.0 Release 🎉**
  - Freeze the `main` branch and move development to `dev-v1.x` branches, that eventually get merged into `main` as PRs. We need to act responsible 👨‍🏫

#### Planned Improvements (`v1.x` Releases):

> _📝 To-do; Expected finish 10/2023_

- **Even Smaller Footprint**
  - Reduce bundle size as much as possible, for example by making exported JSDoc comments shorter (and only exporting main hook function JSDoc once - overload through union types)
- **Custom Serialization and Deserialization Functions**
  - Add the ability to configure your own serialization and deserialization functions instead of relying on `JSON.stringify` and `JSON.parse`
- **Open-source Friendliness**
  - Add a `CONTRIBUTING.md` file to make it easier for contributors to get started, link to it from `README.md`
  - Provide a solid tutorial for contributors, set up PR template, issue template, etc.

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

---

### Contributing

[Start a new issue](https://github.com/deniskabana/react-persistent-state-hook/issues) whenever you have any questions, problems or suggestions! Or feel free to [open a pull request](https://github.com/deniskabana/react-persistent-state-hook/pulls) if you want to contribute. To increase the speed of getting your PR merged, please open an issue first to discuss your idea.

More info coming soon.
