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
  const partitions = getAllPartitions(diceList);
  for (const [A, B] of partitions) {
    const forceA = getForce(A);
    const forceB = getForce(B);
    if (forceA === forceB) {
      return [A, B];
    }
  }
  throw new Error("No solution found");
}

export function getForce(diceList: Dice[]): number {
  // Nombre de traîtres et de héros
  const traitorCount = diceList.filter((d) => d.status === "traitor").length;
  const heroCount = diceList.filter((d) => d.status === "hero").length;
  const heroesToNeutralize = Math.min(traitorCount, heroCount);

  // Comptage des mages et des non-mages
  const mageCount = diceList.filter((d) => d.status === "mage").length;
  const nonMageCount = diceList.length - mageCount;

  // Somme des valeurs de base pour tous les dés non-mages
  let total = diceList
    .filter((d) => d.status !== "mage")
    .reduce((sum, d) => sum + StatusConfig[d.status].baseValue, 0);

  // Chaque héro neutralisé par un traître compte pour 0
  total -= heroesToNeutralize * StatusConfig.hero.baseValue;

  // Chaque mage vaut « nombre de dés non-mages »
  total += mageCount * nonMageCount;

  return total;
}

export function getAllPartitions<T>(arr: T[]): Array<[T[], T[]]> {
  const n = arr.length;
  const total = 1 << n; // 2^n combinaisons de masques binaires
  const result: Array<[T[], T[]]> = [];

  for (let mask = 0; mask < total; mask++) {
    const A: T[] = [];
    const B: T[] = [];
    for (let i = 0; i < n; i++) {
      // si le bit i de mask est à 1 → dans A, sinon dans B
      if (mask & (1 << i)) {
        A.push(arr[i]);
      } else {
        B.push(arr[i]);
      }
    }
    result.push([A, B]);
  }

  return result;
}
