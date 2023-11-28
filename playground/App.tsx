import React from "react"
import { Counter } from "./Counter"

export function App() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      <Counter />
      <Counter />
      <Counter />
    </div>
  )
}
