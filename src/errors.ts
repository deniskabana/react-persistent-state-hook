const prefix = "%c[react-persistent-state-hook]: %c"
const styles = ["font-weight: bold", "font-weight: normal"]

export function warn(message: string) {
  if (process.env.NODE_ENV === "production") return
  console.warn(prefix + message, styles[0], styles[1])
}

export function error(message: string) {
  if (process.env.NODE_ENV === "production") return
  console.error(prefix + message, styles[0], styles[1])
}
