const { sum } = require("lodash");

const ROCK = { name: "ROCK", score: 1 };
const PAPER = { name: "PAPER", score: 2 };
const SCISSORS = { name: "SCISSORS", score: 3 };

const OUTCOME = {
  WIN: 6,
  DRAW: 3,
  LOSE: 0,
};

const opponentsChoices = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
};

const requiredOutcomes = {
  X: OUTCOME.LOSE,
  Y: OUTCOME.DRAW,
  Z: OUTCOME.WIN,
};

function totalScore(input) {
  const rounds = input.split("\n").map((r) => r.split(" "));
  return sum(
    rounds.map(parseRoundChoices).map(determineHandToPlay).map(scoreOfRound)
  );

  function parseRoundChoices([opponentsChoice, requiredOutcome]) {
    return [
      opponentsChoices[opponentsChoice],
      requiredOutcomes[requiredOutcome],
    ];
  }

  function determineHandToPlay([opponentsChoice, requiredOutcome]) {
    return [opponentsChoice, whatShouldIPlay()];

    function whatShouldIPlay() {
      if (requiredOutcome === OUTCOME.DRAW) {
        return opponentsChoice;
      } else if (requiredOutcome === OUTCOME.WIN) {
        if (opponentsChoice === ROCK) return PAPER;
        if (opponentsChoice === PAPER) return SCISSORS;
        if (opponentsChoice === SCISSORS) return ROCK;
      } else if (requiredOutcome === OUTCOME.LOSE) {
        if (opponentsChoice === ROCK) return SCISSORS;
        if (opponentsChoice === PAPER) return ROCK;
        if (opponentsChoice === SCISSORS) return PAPER;
      }
    }
  }

  function scoreOfRound([opponentsChoice, myChoice]) {
    return scoreOfRoundOutcome() + myChoice.score;

    function scoreOfRoundOutcome() {
      if (isDraw()) return OUTCOME.DRAW;
      if (isWin()) return OUTCOME.WIN;
      return OUTCOME.LOSE;
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
  expect(result).toBe(12);
});
