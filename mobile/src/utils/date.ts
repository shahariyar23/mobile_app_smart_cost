export function toISODate(date = new Date()) {
  return date.toISOString();
}

export function formatBanglaDate(value: string) {
  return new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
