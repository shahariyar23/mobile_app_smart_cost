export function formatTaka(amount: number) {
  return `৳${new Intl.NumberFormat('bn-BD', {maximumFractionDigits: 0}).format(amount)}`;
}
