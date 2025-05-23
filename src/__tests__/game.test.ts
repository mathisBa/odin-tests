// tests/army.test.ts
import { describe, expect, it } from "vitest";
import {
  Dice,
  getForce,
  getSolution,
  haveSameDice,
  StatusConfig,
} from "../modules/game";
import { challenges } from "../__mocks__/challenges";

describe("getForce", () => {
  describe("getForce – valeurs individuelles persos simples", () => {
    const cases: Array<{
      status: "hero" | "captain" | "soldier" | "cursed" | "traitor" | "mage";
      expected: number;
    }> = [
      { status: "hero", expected: 3 },
      { status: "captain", expected: 2 },
      { status: "soldier", expected: 1 },
      { status: "cursed", expected: -1 },
    ];

    cases.forEach(({ status, expected }) => {
      it(`une armée [${status}] → force = ${expected}`, () => {
        const diceList: Dice[] = [
          { status, baseValue: StatusConfig[status].baseValue },
        ];
        expect(getForce(diceList)).toBe(expected);
      });
    });
  });

  describe("getForce – traitor", () => {
    it("seul → +1", () => {
      const diceList: Dice[] = [{ status: "traitor", baseValue: 1 }];
      expect(getForce(diceList)).toBe(1);
    });

    it("avec un héros → traitor=1−3 et hero=3 → total=1", () => {
      const diceList: Dice[] = [
        { status: "traitor", baseValue: 1 },
        { status: "hero", baseValue: 3 },
      ];
      expect(getForce(diceList)).toBe(1 + 0);
    });

    it("avec plusieurs héros → neutralise un seul héros", () => {
      const diceList: Dice[] = [
        { status: "traitor", baseValue: 1 },
        { status: "hero", baseValue: 3 },
        { status: "hero", baseValue: 3 },
      ];
      expect(getForce(diceList)).toBe(1 + 0 + 3);
    });
    it("avec 2 traites → neutralise un deux héros", () => {
      const diceList: Dice[] = [
        { status: "traitor", baseValue: 1 },
        { status: "traitor", baseValue: 1 },
        { status: "hero", baseValue: 3 },
        { status: "hero", baseValue: 3 },
      ];
      expect(getForce(diceList)).toBe(1 + 1 + 0 + 0);
    });
    it("avec plusieurs héros → neutralise un seul héros", () => {
      const diceList: Dice[] = [
        { status: "traitor", baseValue: 1 },
        { status: "traitor", baseValue: 1 },
        { status: "hero", baseValue: 3 },
      ];
      expect(getForce(diceList)).toBe(1 + 1 + 0);
    });
  });

  describe("getForce – mage", () => {
    it("dans une armée mixte → chaque mage = nombre de non-mages", () => {
      const diceList: Dice[] = [
        { status: "mage", baseValue: 0 },
        { status: "soldier", baseValue: 1 },
        { status: "cursed", baseValue: -1 },
        { status: "hero", baseValue: 3 },
        { status: "mage", baseValue: 0 },
      ];
      // non-mages = soldier, cursed, hero = 3
      // forces individuelles = [3,1,-1,3,3]
      // total = 3+1-1+3+3 = 9
      expect(getForce(diceList)).toBe(9);
    });

    it("100% mages → 0", () => {
      const diceList: Dice[] = Array(5)
        .fill(0)
        .map(() => ({ status: "mage", baseValue: 0 }));
      expect(getForce(diceList)).toBe(0);
    });
  });

  describe("getForce – combinaisons complexes", () => {
    it("mix héros, capitaine, soldat, maudit, traître, mage", () => {
      const diceList: Dice[] = [
        { status: "hero", baseValue: 3 },
        { status: "captain", baseValue: 2 },
        { status: "soldier", baseValue: 1 },
        { status: "cursed", baseValue: -1 },
        { status: "traitor", baseValue: 1 },
        { status: "mage", baseValue: 0 },
      ];
      // non-mages = hero, captain, soldier, cursed, traitor = 5
      // forces = [3,2,1,-1,(1−3)=−2,5] => sum = 3+2+1-1-2+5 = 8
      expect(getForce(diceList)).toBe(8);
    });

    it("liste vide → 0", () => {
      expect(getForce([])).toBe(0);
    });
  });
});

describe("getSolution", () => {
  it("renvoie une solution simple", () => {
    const diceList: Dice[] = [
      { status: "soldier", baseValue: 1 },
      { status: "soldier", baseValue: 1 },
    ];

    const diceListResult: Dice[] = [{ status: "soldier", baseValue: 1 }];
    expect(getSolution(diceList)).toEqual([diceListResult, diceListResult]);
  });

  it("renvoie une erreur si impossible", () => {
    const diceList: Dice[] = [
      { status: "soldier", baseValue: 1 },
      { status: "hero", baseValue: 3 },
    ];
    expect(() => getSolution(diceList)).toThrowError("No solution found");
  });

  it("renvoie une solution simple pour [traitor, soldier]", () => {
    const traitor: Dice = { status: "traitor", baseValue: 1 };
    const soldier: Dice = { status: "soldier", baseValue: 1 };
    const [g1, g2] = getSolution([traitor, soldier]) as [Dice[], Dice[]];
    expect(getForce(g1)).toEqual(getForce([traitor]));
    expect(getForce(g2)).toEqual(getForce([soldier]));
  });
});

describe("Défis Par Odin (notice mockée)", () => {
  challenges.forEach(({ id, dice, solution }) => {
    it(`défi #${id} → doit renvoyer la partition attendue`, () => {
      const result = getSolution(dice);
      expect(result).not.toBeNull();

      const [g1, g2] = result!;

      expect(haveSameDice(g1, solution[0])).toBeTruthy;
      expect(haveSameDice(g2, solution[1])).toBeTruthy;
    });
  });
});
