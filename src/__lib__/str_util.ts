export const stripSuffix = (s: string, suffix: string) => {
  if (!s.endsWith(suffix)) return s;
  return s.substring(0, s.length - suffix.length);
}