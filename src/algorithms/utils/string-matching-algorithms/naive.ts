// src/algorithms/utils/string-matching-algorithms/naive.ts

import type {
  CharState,
  StringMatchingOptions,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";
import type { StringMatchingAlgorithmDefinition } from "@/algorithms/types/string-matching-registry";

function buildStep(
  stepType: StringMatchingStep["stepType"],
  message: string,
  subMessage: string,
  offset: number,
  textLen: number,
  patternLen: number,
  activeTextIdx: number | null,
  activePatternIdx: number | null,
  mismatchTextIdx: number | null,
  matches: number[],
  isMajorStep = false,
): StringMatchingStep {
  const textStates: Record<number, CharState> = {};
  const patternStates: Record<number, CharState> = {};

  // Mark current window as candidate
  for (let i = offset; i < offset + patternLen && i < textLen; i++) {
    textStates[i] = "candidate";
  }
  // Mark confirmed matches
  for (const m of matches) {
    for (let i = m; i < m + patternLen; i++) textStates[i] = "matched";
  }
  // Active comparison
  if (activeTextIdx !== null) textStates[activeTextIdx] = "active";
  if (activePatternIdx !== null) patternStates[activePatternIdx] = "active";
  if (mismatchTextIdx !== null) textStates[mismatchTextIdx] = "mismatch";

  return {
    stepType,
    message,
    subMessage,
    isMajorStep,
    textStates,
    patternStates,
    patternOffset: offset,
    matches: [...matches],
  };
}

function naive({ text, pattern }: StringMatchingOptions): StringMatchingStep[] {
  const steps: StringMatchingStep[] = [];
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];

  if (m === 0 || m > n) {
    steps.push(
      buildStep(
        "complete",
        "Pattern is empty or longer than text",
        "",
        0,
        n,
        m,
        null,
        null,
        null,
        [],
        true,
      ),
    );
    return steps;
  }

  steps.push(
    buildStep(
      "initial",
      `Naive search: text length ${n}, pattern length ${m}`,
      "Slide the pattern across the text one position at a time, comparing each character.",
      0,
      n,
      m,
      null,
      null,
      null,
      [],
      true,
    ),
  );

  for (let i = 0; i <= n - m; i++) {
    steps.push(
      buildStep(
        "shift",
        `Aligning pattern at text position ${i}`,
        `Checking window text[${i}..${i + m - 1}]`,
        i,
        n,
        m,
        null,
        null,
        null,
        [...matches],
        true,
      ),
    );

    let j = 0;
    let matched = true;

    while (j < m) {
      steps.push(
        buildStep(
          "compare",
          `Comparing text[${i + j}]='${text[i + j]}' with pattern[${j}]='${pattern[j]}'`,
          text[i + j] === pattern[j]
            ? "Match — continue"
            : "Mismatch — shift right",
          i,
          n,
          m,
          i + j,
          j,
          text[i + j] !== pattern[j] ? i + j : null,
          [...matches],
        ),
      );

      if (text[i + j] !== pattern[j]) {
        matched = false;
        break;
      }
      j++;
    }

    if (matched) {
      matches.push(i);
      steps.push(
        buildStep(
          "match",
          `Match found at index ${i}!`,
          `text[${i}..${i + m - 1}] = "${pattern}"`,
          i,
          n,
          m,
          null,
          null,
          null,
          [...matches],
          true,
        ),
      );
    }
  }

  steps.push(
    buildStep(
      "complete",
      matches.length > 0
        ? `Search complete — ${matches.length} match${matches.length !== 1 ? "es" : ""} found at: [${matches.join(", ")}]`
        : "Search complete — no matches found",
      `Checked ${n - m + 1} alignment${n - m + 1 !== 1 ? "s" : ""}`,
      n - m,
      n,
      m,
      null,
      null,
      null,
      [...matches],
      true,
    ),
  );

  return steps;
}

export const definition: StringMatchingAlgorithmDefinition = {
  key: "naive",
  name: "Naive / Brute Force",
  func: naive,
};
