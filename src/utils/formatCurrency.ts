import { nbhy } from "~/utils/nbhy";

export function formatCurrency(
  value: number,
  opts?: ConstructorParameters<typeof Intl.NumberFormat>[1],
) {
  const formatted = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "eur",
    ...opts,
  }).format(value);

  return formatted.replaceAll(`-`, nbhy());
}
