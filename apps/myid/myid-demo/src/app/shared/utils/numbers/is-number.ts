
export function isNumber(n: unknown): boolean {
  if (typeof n === 'number') {
    return !isNaN(n) && isFinite(n);
  }
  if (typeof n === 'string' && n.trim() !== '') {
    return !isNaN(Number(n)) && isFinite(Number(n));
  }
  return false;
}
