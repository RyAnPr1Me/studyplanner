export const isValidDate = (value: string) => {
  return !Number.isNaN(Date.parse(value))
}
