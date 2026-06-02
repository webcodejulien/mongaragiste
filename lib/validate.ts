export function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()) }
export function isValidTime(t: string)  { return /^\d{2}:\d{2}$/.test(t) }
export function isValidPhone(p: string) { return !p || p.replace(/[\s\-\+\(\)]/g,'').length >= 8 }
export function sanitize(s: string)     { return s?.trim().slice(0, 500) ?? '' }
