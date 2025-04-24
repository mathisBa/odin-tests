import { useState, useEffect } from "react";
import { Dice, StatusConfig, getForce } from "./modules/game";
import "./App.css";

export type StatusType =
  | "hero"
  | "captain"
  | "soldier"
  | "cursed"
  | "traitor"
  | "mage";

const ALL_STATUSES: StatusType[] = [
  "hero",
  "captain",
  "soldier",
  "cursed",
  "traitor",
  "mage",
];

/** tire n éléments aléatoires dans ALL_STATUSES */
function drawDice(n: number): Dice[] {
  const res: Dice[] = [];
  for (let i = 0; i < n; i++) {
    const status =
      ALL_STATUSES[Math.floor(Math.random() * ALL_STATUSES.length)];
    res.push({ status, baseValue: StatusConfig[status].baseValue });
  }
  return res;
}

type Group = "unassigned" | "A" | "B";

function App() {
  const [diceList, setDiceList] = useState<Dice[]>([]);
  const [assignment, setAssignment] = useState<Group[]>([]);
  const [message, setMessage] = useState<string>("");

  // au montage, on tire 7 dés
  useEffect(() => {
    const drawn = drawDice(7);
    setDiceList(drawn);
    setAssignment(Array(7).fill("unassigned"));
  }, []);

  /** cycle un dé entre unassigned → A → B → unassigned */
  const cycle = (idx: number) => {
    setAssignment((a) =>
      a.map((g, i) =>
        i === idx
          ? g === "unassigned"
            ? "A"
            : g === "A"
            ? "B"
            : "unassigned"
          : g
      )
    );
  };

  const validate = () => {
    const groupA = diceList.filter((_, i) => assignment[i] === "A");
    const groupB = diceList.filter((_, i) => assignment[i] === "B");
    if (groupA.length + groupB.length !== 7) {
      setMessage("Tous les dés doivent être dans A ou B.");
      return;
    }
    const sumA = getForce(groupA);
    const sumB = getForce(groupB);
    if (sumA === sumB) {
      setMessage(`Bravo ! Force A=${sumA}, B=${sumB}.`);
    } else {
      setMessage(`Raté : A=${sumA} vs B=${sumB}. Réessaie !`);
    }
  };

  const reset = () => {
    const drawn = drawDice(7);
    setDiceList(drawn);
    setAssignment(Array(7).fill("unassigned"));
    setMessage("");
  };

  return (
    <div className="App">
      <h1>Par Odin – Défi React</h1>
      <button onClick={reset}>Nouvelle tirage</button>
      <div className="boards">
        {["unassigned", "A", "B"].map((board) => (
          <div key={board} className="board" id={board}>
            <h2>{board === "unassigned" ? "À répartir" : `Groupe ${board}`}</h2>
            <div className="dice-row">
              {diceList.map(
                (d, i) =>
                  assignment[i] === board && (
                    <button
                      key={i}
                      onClick={() => cycle(i)}
                      className={`die ${d.status}`}
                    >
                      {d.status}
                    </button>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
      <button onClick={validate}>Valider</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
