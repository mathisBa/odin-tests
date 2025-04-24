// __mocks__/challenges.ts
import { Dice, StatusConfig } from "../modules/game";

/**
 * Helper pour générer un tableau de Dice à partir d'un tableau de status
 */
const makeDice = (statuses: string[]): Dice[] =>
  statuses.map((status) => ({
    status: status as
      | "hero"
      | "captain"
      | "cursed"
      | "soldier"
      | "traitor"
      | "mage",
    baseValue:
      StatusConfig[
        status as "hero" | "captain" | "cursed" | "soldier" | "traitor" | "mage"
      ].baseValue,
  }));

export const challenges: Array<{
  id: number;
  dice: Dice[];
  solution: [Dice[], Dice[]];
}> = [
  {
    id: 1,
    dice: makeDice([
      "hero",
      "hero",
      "hero",
      "captain",
      "soldier",
      "soldier",
      "soldier",
    ]),
    solution: [
      makeDice(["hero", "hero", "soldier"]),
      makeDice(["hero", "hero", "captain", "soldier"]),
    ],
  },
  // … et de même pour les défis 2 à 15
];
