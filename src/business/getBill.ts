export function getBill(movies: string[]) {
  const items: Map<
    string,
    {
      value: number;
      units: number;
    }
  > = new Map();

  for (const movie of movies) {
    const item = movie
      .replace(/\s{2,}/g, " ")
      .trim()
      .toLowerCase();
    if (!item) continue;

    const basePrice = item.startsWith("back to the future") ? 15 : 20;
    let elem = items.get(item);
    if (!elem) {
      elem = { units: 0, value: 0 };
      items.set(item, elem);
    }
    elem.units += 1;
    elem.value += basePrice;
  }

  const subTotal = {
    label: "sous total",
    type: "sub_total",
    value: Array.from(items.values()).reduce(
      (acc, curr) => acc + curr.value,
      0,
    ),
  };

  const titles = Array.from(items.keys());
  const backAll = titles.filter((x) => x.startsWith("back to the future"));
  const backDiscountRate =
    backAll.length >= 3 ? 0.2 : backAll.length >= 2 ? 0.1 : 0;
  const backTotalAmount = backAll.reduce(
    (acc, curr) => acc + (items.get(curr)?.value ?? 0),
    0,
  );

  const discounts = [];
  if (backDiscountRate) {
    discounts.push({
      label: `promo saga back to the future : ${backAll.length} volets`,
      value: Math.round(backTotalAmount * backDiscountRate),
    });
  }

  const total = {
    label: "total",
    value:
      subTotal.value - discounts.reduce((acc, curr) => acc + curr.value, 0),
  };

  return {
    items: Array.from(items.entries()).map(([k, v]) => ({ label: k, ...v })),
    subTotal,
    discounts,
    total,
  };
}
