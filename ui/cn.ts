type ClassName = string | undefined | null | false;

export function cn(...classes: ClassName[]) {
  return classes.filter(Boolean).join(" ");
}