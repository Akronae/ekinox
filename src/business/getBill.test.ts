import { describe, expect, it } from "vitest";
import { getBill } from "./getBill";

describe("getBill", () => {
  it("exemple 1 : 3 volets Back to the Future → 20% de remise", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
    ]);

    expect(bill.subTotal.value).toBe(45);
    expect(bill.discounts).toHaveLength(1);
    expect(bill.discounts[0].value).toBe(9);
    expect(bill.total.value).toBe(36);
  });

  it("exemple 2 : 2 volets Back to the Future → 10% de remise", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 3",
    ]);

    expect(bill.subTotal.value).toBe(30);
    expect(bill.discounts).toHaveLength(1);
    expect(bill.discounts[0].value).toBe(3);
    expect(bill.total.value).toBe(27);
  });

  it("exemple 3 : 1 seul volet Back to the Future → pas de remise", () => {
    const bill = getBill(["Back to the Future 1"]);

    expect(bill.subTotal.value).toBe(15);
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(15);
  });

  it("exemple 4 : 4 films dont 2 fois le même volet → 20% sur l'ensemble", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
      "Back to the Future 2",
    ]);

    // 4 films × 15 = 60, remise 20% = 12, total = 48
    expect(bill.subTotal.value).toBe(60);
    expect(bill.discounts).toHaveLength(1);
    expect(bill.discounts[0].value).toBe(12);
    expect(bill.total.value).toBe(48);
  });

  it("exemple 5 : 3 volets Back to the Future + La chèvre (film hors saga)", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
      "La chèvre",
    ]);

    // 3 BTtF × 15 = 45, remise 20% = 9, + La chèvre 20 = 56
    expect(bill.subTotal.value).toBe(65);
    expect(bill.discounts).toHaveLength(1);
    expect(bill.discounts[0].value).toBe(9);
    expect(bill.total.value).toBe(56);
  });
});

describe("getBill — empty / whitespace", () => {
  it("tableau vide → sous-total 0, pas de remise, total 0", () => {
    const bill = getBill([]);

    expect(bill.items).toHaveLength(0);
    expect(bill.subTotal.value).toBe(0);
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(0);
  });

  it("chaînes vides ou uniquement composées d'espaces → ignorées", () => {
    const bill = getBill(["   ", "\t", ""]);

    expect(bill.items).toHaveLength(0);
    expect(bill.subTotal.value).toBe(0);
    expect(bill.total.value).toBe(0);
  });

  it("chaînes vides mélangées avec des films valides", () => {
    const bill = getBill(["", "Back to the Future 1", "   ", "La chèvre"]);

    expect(bill.items).toHaveLength(2);
    expect(bill.subTotal.value).toBe(35); // 15 + 20
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(35);
  });
});

describe("getBill — normalisation (casse, espaces)", () => {
  it("insensible à la casse (minuscules)", () => {
    const bill = getBill([
      "back to the future 1",
      "back to the future 2",
      "back to the future 3",
    ]);

    expect(bill.subTotal.value).toBe(45);
    expect(bill.discounts).toHaveLength(1);
    expect(bill.discounts[0].value).toBe(9);
    expect(bill.total.value).toBe(36);
  });

  it("insensible à la casse (majuscules)", () => {
    const bill = getBill([
      "BACK TO THE FUTURE 1",
      "BACK TO THE FUTURE 2",
      "BACK TO THE FUTURE 3",
    ]);

    expect(bill.subTotal.value).toBe(45);
    expect(bill.total.value).toBe(36);
  });

  it("mélange de casses → regroupés comme un seul titre", () => {
    const bill = getBill([
      "Back to the Future 1",
      "back to the future 1",
      "BACK TO THE FUTURE 1",
    ]);

    // 3 unités du même titre, 1 seul titre distinct → pas de remise
    expect(bill.items).toHaveLength(1);
    expect(bill.items[0].units).toBe(3);
    expect(bill.items[0].value).toBe(45); // 3 × 15
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(45);
  });

  it("espaces multiples réduits à un seul espace", () => {
    const bill = getBill([
      "Back   to   the   Future   1",
      "Back  to  the  Future  2",
    ]);

    expect(bill.items).toHaveLength(2);
    expect(bill.subTotal.value).toBe(30);
    expect(bill.discounts[0].value).toBe(3);
    expect(bill.total.value).toBe(27);
  });

  it("espaces en début et fin de chaîne → ignorés (trim)", () => {
    const bill = getBill([
      "  Back to the Future 1  ",
      "  Back to the Future 2  ",
      "  Back to the Future 3  ",
    ]);

    expect(bill.total.value).toBe(36);
  });

  it("espaces ET casse mélangés → normalisation complète", () => {
    const bill = getBill([
      "  BACK TO THE FUTURE  1  ",
      "  back to the future  2  ",
      "  Back   To   The   Future   3  ",
    ]);

    expect(bill.items).toHaveLength(3);
    expect(bill.total.value).toBe(36);
  });
});
describe("getBill — films hors saga uniquement", () => {
  it("un seul film hors saga → 20, pas de remise", () => {
    const bill = getBill(["La chèvre"]);

    expect(bill.subTotal.value).toBe(20);
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(20);
  });

  it("plusieurs films hors saga uniquement → pas de remise", () => {
    const bill = getBill(["La chèvre", "Les bronzés", "Le dîner de cons"]);

    expect(bill.subTotal.value).toBe(60); // 3 × 20
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(60);
  });

  it("film hors saga en double → pas de remise, prix ×2", () => {
    const bill = getBill(["La chèvre", "La chèvre"]);

    expect(bill.items).toHaveLength(1);
    expect(bill.items[0].units).toBe(2);
    expect(bill.items[0].value).toBe(40);
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(40);
  });
});

describe("getBill — seuils de remise", () => {
  it("2 volets distincts → 10% de remise (seuil exact)", () => {
    const bill = getBill(["Back to the Future 1", "Back to the Future 2"]);

    expect(bill.subTotal.value).toBe(30);
    expect(bill.discounts[0].value).toBe(3); // 10% de 30
    expect(bill.total.value).toBe(27);
  });

  it("3 volets distincts → 20% de remise (seuil exact)", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
    ]);

    expect(bill.total.value).toBe(36); // 45 - 9
  });

  it("4 volets distincts → toujours 20% (pas de palier supplémentaire)", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
      "Back to the Future 4",
    ]);

    expect(bill.subTotal.value).toBe(60);
    expect(bill.discounts[0].value).toBe(12); // 20% de 60
    expect(bill.total.value).toBe(48);
  });
});

describe("getBill — doublons / quantités", () => {
  it("même volet commandé 10 fois → 1 seul titre distinct, pas de remise", () => {
    const bill = getBill(Array(10).fill("Back to the Future 1"));

    expect(bill.items).toHaveLength(1);
    expect(bill.items[0].units).toBe(10);
    expect(bill.items[0].value).toBe(150); // 10 × 15
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(150);
  });

  it("même volet ×2 + 2 autres volets → 3 distincts, 20% de remise", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
    ]);

    // 4 unités à 15 = 60, 3 titres distincts → 20%
    expect(bill.subTotal.value).toBe(60);
    expect(bill.discounts[0].value).toBe(12);
    expect(bill.total.value).toBe(48);
  });

  it("même volet ×2 + 1 autre → 2 distincts, 10% de remise", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 1",
      "Back to the Future 2",
    ]);

    // 3 unités à 15 = 45, 2 titres distincts → 10%
    expect(bill.subTotal.value).toBe(45);
    // Math.round(45 * 0.1) = Math.round(4.5) = 5
    expect(bill.discounts[0].value).toBe(5);
    expect(bill.total.value).toBe(40);
  });

  it("même volet ×3 + même volet ×2 → 2 distincts, 10% de remise", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 1",
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 2",
    ]);

    // 5 unités à 15 = 75, 2 titres distincts → 10%
    expect(bill.subTotal.value).toBe(75);
    // Math.round(75 * 0.1) = Math.round(7.5) = 8
    expect(bill.discounts[0].value).toBe(8);
    expect(bill.total.value).toBe(67);
  });
});

describe("getBill — structure de sortie", () => {
  it("chaque item a les clés label, units, value", () => {
    const bill = getBill(["Back to the Future 1", "La chèvre"]);

    expect(bill.items).toHaveLength(2);
    for (const item of bill.items) {
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("units");
      expect(item).toHaveProperty("value");
      expect(typeof item.label).toBe("string");
      expect(typeof item.units).toBe("number");
      expect(typeof item.value).toBe("number");
    }
  });

  it("le label des items est en minuscules (normalisé)", () => {
    const bill = getBill(["  Back to the Future 1  "]);

    expect(bill.items[0].label).toBe("back to the future 1");
  });

  it("label de la remise mentionne le nombre de volets distincts", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 3",
    ]);

    expect(bill.discounts[0].label).toBe(
      "promo saga back to the future : 3 volets",
    );
  });

  it("label de remise correct avec doublons (2 distincts, 4 unités)", () => {
    const bill = getBill([
      "Back to the Future 1",
      "Back to the Future 1",
      "Back to the Future 2",
      "Back to the Future 2",
    ]);

    expect(bill.discounts[0].label).toBe(
      "promo saga back to the future : 2 volets",
    );
  });
});

describe("getBill — titres divers", () => {
  it("\"Back to the Future\" sans numéro → traité comme BTtF à 15", () => {
    const bill = getBill(["Back to the Future", "Back to the Future 1"]);

    expect(bill.subTotal.value).toBe(30);
    expect(bill.discounts[0].value).toBe(3); // 2 distincts → 10%
    expect(bill.total.value).toBe(27);
  });

  it("titre commençant par \"back to the future\" sans être un volet → quand même à 15", () => {
    const bill = getBill(["Back to the Future : le retour"]);

    expect(bill.subTotal.value).toBe(15);
    expect(bill.discounts).toHaveLength(0);
    expect(bill.total.value).toBe(15);
  });
});