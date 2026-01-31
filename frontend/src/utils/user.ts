const USER_ID_KEY = 'studyplanner.userId'

const generateFallbackId = () => {
  const values = new Uint8Array(16)
  crypto.getRandomValues(values)
  values[6] = (values[6] & 0x0f) | 0x40
  values[8] = (values[8] & 0x3f) | 0x80
  const hex = Array.from(values, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export const getUserId = () => {
  if (typeof window === 'undefined') {
    return ''
  }
  const existing = window.localStorage.getItem(USER_ID_KEY)
  if (existing) {
    return existing
  }
  const id = crypto.randomUUID?.() ?? generateFallbackId()
  window.localStorage.setItem(USER_ID_KEY, id)
  return id
}
