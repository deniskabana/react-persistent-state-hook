import React from "react"
import { usePersistentState } from "../dist/index.esm"

export function Counter() {
  const [count, setCount] = usePersistentState(0, "my-count")

  return (
    <div style={{ margin: "auto", width: "fit-content" }}>
      <h4>Counter</h4>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}
