export interface Dice {
  status: "hero" | "captain" | "cursed" | "soldier" | "traitor" | "mage";
  baseValue: number;
}

export const StatusConfig: Record<
  Dice["status"],
  { baseValue: number; special?: string }
> = {
  hero: {
    baseValue: 3,
  },
  captain: {
    baseValue: 2,
  },
  soldier: {
    baseValue: 1,
  },
  cursed: {
    baseValue: -1,
  },
  traitor: {
    baseValue: 1,
    special: "neutralizeHero",
  },
  mage: {
    baseValue: 0,
  },
};

export function getSolution(diceList: Dice[]) {
  return [diceList, diceList];
}

export function getForce(diceList: Dice[]) {
  const force = diceList.reduce((acc, { status, baseValue }) => {
    if (status === "traitor") {
      return acc + baseValue - 3;
    }
    return acc + baseValue;
  }, 0);
  return force;
}
