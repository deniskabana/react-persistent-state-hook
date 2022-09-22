# react-persistent-state-hook
Hook that replaces React.useState with usePersistentState.

## How to use
Just download these 2 files and start using `const [value, setValue] = usePersistentState(JSONValidValue, 'unique-identifier', StorageTypes.session);` in your code. Examples are documented with JSDoc comments inside the actual code. See [here](https://github.com/deniskabana/react-persistent-state-hook/blob/main/usePersistentState.ts#L40) for more info.

## Limitations / potential future plans
- add overload for accepting params with a config object `(JSONValidValue, {...config}: Config)`
- add conditional persistence - allow disabling storage usage with a config key
- add config key to swallow errors silently without logging errors

## Why no NPM package?
I don't have time. I set up the repo just to share it with a few friends quickly.
