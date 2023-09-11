export const prefix = "[react-persistent-state-hook]:"
const prefixWithStyles = `%c${prefix}%c`
const styles = ["font-weight: bold", "font-weight: normal"]

// Functions that replace console.warn and console.error
// to simplify code

export function warn(message: string, logValue?: any): void {
  if (process.env.NODE_ENV === "production") return
  console.warn(prefixWithStyles + message, styles[0], styles[1])
  if (logValue) console.warn("Value related to the warning:", logValue)
}

export function error(message: string, logValue?: any): void {
  if (process.env.NODE_ENV === "production") return
  console.error(prefixWithStyles + message, styles[0], styles[1])
  if (logValue) console.error("Value related to the error:", logValue)
}
