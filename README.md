# react-persistent-state-hook
Hook that replaces React.useState with usePersistentState. Utilizes Browser Storage API, tested with Next.js - optimized for SSR/SSG and browser runtime.

## How to use
Just download these 2 files and start using `const [value, setValue] = usePersistentState(JSONValidValue, 'unique-identifier', StorageTypes.session);` in your code. Examples are documented with JSDoc comments inside the actual code. See [here](https://github.com/deniskabana/react-persistent-state-hook/blob/main/usePersistentState.ts#L40) for more info.

## Limitations / potential future plans
- add overload for accepting params with a config object `(JSONValidValue, {...config}: Config)`
- add conditional persistence - allow disabling storage usage with a config key
- add config key to swallow errors silently without logging errors

## What if you want a Vanilla JS version?
I'm sorry to hear that. You could do `$ npx tsc --init && npx tsc ./StorageHelper.ts ./usePersistentState.ts` and end up with an ugly, but working JS version.

## Why no NPM package?
I don't have time. I set up the repo just to share it with a few friends quickly.
