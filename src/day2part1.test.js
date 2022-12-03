const { sum } = require("lodash");

const ROCK = { name: "ROCK", score: 1 };
const PAPER = { name: "PAPER", score: 2 };
const SCISSORS = { name: "SCISSORS", score: 3 };

const POINTS_FOR = {
  WIN: 6,
  DRAW: 3,
  LOSE: 0,
};

const opponentChoices = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
};

const myChoices = {
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
};

function totalScore(input) {
  const rounds = input.split("\n").map((r) => r.split(" "));

  return sum(rounds.map(parseRoundChoices).map(scoreOfRound));

  function parseRoundChoices([opponentsChoice, myChoice]) {
    return [opponentChoices[opponentsChoice], myChoices[myChoice]];
  }

  function scoreOfRound([opponentsChoice, myChoice]) {
    return scoreOfRoundOutcome() + myChoice.score;

    function scoreOfRoundOutcome() {
      if (isDraw()) return POINTS_FOR.DRAW;
      if (isWin()) return POINTS_FOR.WIN;
      return POINTS_FOR.LOSE;
    }

    function isDraw() {
      return opponentsChoice === myChoice;
    }

    function isWin() {
      return (
        (opponentsChoice === ROCK && myChoice === PAPER) ||
        (opponentsChoice === PAPER && myChoice === SCISSORS) ||
        (opponentsChoice === SCISSORS && myChoice === ROCK)
      );
    }
  }
}

test("total score", () => {
  const input = "A Y\n" + "B X\n" + "C Z";
  const result = totalScore(input);
  expect(result).toBe(15);
});
