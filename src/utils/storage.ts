export function getItem<T = any>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export function setItem(key: string, value: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

export function removeItem(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
} 