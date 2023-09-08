const prefix = "%c[react-persistent-state-hook]: %c"
const styles = ["font-weight: bold", "font-weight: normal"]

// Functions that replace console.warn and console.error
// to simplify code

export function warn(message: string, logValue?: any): void {
  if (process.env.NODE_ENV === "production") return
  console.warn(prefix + message, styles[0], styles[1])
  if (logValue) console.warn("Value related to the warning:", logValue)
}

export function error(message: string, logValue?: any): void {
  if (process.env.NODE_ENV === "production") return
  console.error(prefix + message, styles[0], styles[1])
  if (logValue) console.error("Value related to the error:", logValue)
}
