// src/algorithms/utils/string-matching-algorithms/boyerMoore.ts

import type { StringMatchingAlgorithmDefinition } from "@/algorithms/registry/string-matching-registry";
import type {
  BoyerMooreMetadata,
  CharState,
  StringMatchingOptions,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";

function buildBadCharTable(pattern: string): Record<string, number> {
  const table: Record<string, number> = {};
  for (let i = 0; i < pattern.length - 1; i++) {
    table[pattern[i]] = i;
  }
  return table;
}

function buildStep(
  stepType: StringMatchingStep["stepType"],
  message: string,
  subMessage: string,
  offset: number,
  textLen: number,
  patternLen: number,
  activeTextIdx: number | null,
  activePatternIdx: number | null,
  mismatchIdx: number | null,
  matches: number[],
  badCharTable: Record<string, number>,
  shiftAmount: number,
  isMajorStep = false,
): StringMatchingStep {
  const textStates: Record<number, CharState> = {};
  const patternStates: Record<number, CharState> = {};

  for (let i = offset; i < offset + patternLen && i < textLen; i++) {
    textStates[i] = "candidate";
  }
  for (const m of matches) {
    for (let i = m; i < m + patternLen; i++) textStates[i] = "matched";
  }
  if (activeTextIdx !== null) textStates[activeTextIdx] = "active";
  if (activePatternIdx !== null) patternStates[activePatternIdx] = "active";
  if (mismatchIdx !== null) {
    textStates[mismatchIdx] = "mismatch";
    if (activePatternIdx !== null) patternStates[activePatternIdx] = "mismatch";
  }

  const metadata: BoyerMooreMetadata = { badCharTable, shiftAmount };

  return {
    stepType,
    message,
    subMessage,
    isMajorStep,
    textStates,
    patternStates,
    patternOffset: offset,
    matches: [...matches],
    metadata,
  };
}

function boyerMoore({
  text,
  pattern,
}: StringMatchingOptions): StringMatchingStep[] {
  const steps: StringMatchingStep[] = [];
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];

  if (m === 0 || m > n) {
    steps.push({
      stepType: "complete",
      message: "Pattern is empty or longer than text",
      subMessage: "",
      textStates: {},
      patternStates: {},
      patternOffset: 0,
      matches: [],
      isMajorStep: true,
    });
    return steps;
  }

  const badCharTable = buildBadCharTable(pattern);

  steps.push(
    buildStep(
      "preprocess",
      "Boyer-Moore: building bad character table",
      "bad_char[c] = last occurrence of c in pattern (excluding last char). Used to compute shift on mismatch.",
      0,
      n,
      m,
      null,
      null,
      null,
      [],
      badCharTable,
      0,
      true,
    ),
  );

  let i = 0; // offset of pattern in text

  while (i <= n - m) {
    steps.push(
      buildStep(
        "shift",
        `Aligning pattern at position ${i}`,
        "Boyer-Moore scans right-to-left within the window",
        i,
        n,
        m,
        null,
        null,
        null,
        [...matches],
        badCharTable,
        0,
        true,
      ),
    );

    let j = m - 1; // scan right-to-left
    let allMatched = true;

    while (j >= 0) {
      steps.push(
        buildStep(
          "compare",
          `Comparing text[${i + j}]='${text[i + j]}' with pattern[${j}]='${pattern[j]}'`,
          text[i + j] === pattern[j]
            ? "Match — continue left"
            : `Mismatch — apply bad character heuristic`,
          i,
          n,
          m,
          i + j,
          j,
          text[i + j] !== pattern[j] ? i + j : null,
          [...matches],
          badCharTable,
          0,
        ),
      );

      if (text[i + j] !== pattern[j]) {
        const badCharShift = j - (badCharTable[text[i + j]] ?? -1);
        const shift = Math.max(1, badCharShift);
        allMatched = false;

        steps.push(
          buildStep(
            "shift",
            `Bad character '${text[i + j]}' — shifting pattern by ${shift}`,
            badCharTable[text[i + j]] !== undefined
              ? `Last occurrence of '${text[i + j]}' in pattern at index ${badCharTable[text[i + j]]} — shift = ${j} - ${badCharTable[text[i + j]]} = ${badCharShift}`
              : `'${text[i + j]}' not in pattern — shift by full ${j + 1} positions`,
            i,
            n,
            m,
            i + j,
            j,
            i + j,
            [...matches],
            badCharTable,
            shift,
            true,
          ),
        );

        i += shift;
        break;
      }
      j--;
    }

    if (allMatched) {
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
          badCharTable,
          1,
          true,
        ),
      );
      i++;
    }
  }

  steps.push(
    buildStep(
      "complete",
      matches.length > 0
        ? `Boyer-Moore complete — ${matches.length} match${matches.length !== 1 ? "es" : ""} at: [${matches.join(", ")}]`
        : "Boyer-Moore complete — no matches found",
      "Bad character heuristic enables large jumps on mismatch",
      0,
      n,
      m,
      null,
      null,
      null,
      [...matches],
      badCharTable,
      0,
      true,
    ),
  );

  return steps;
}

export const definition: StringMatchingAlgorithmDefinition = {
  key: "boyerMoore",
  name: "Boyer-Moore",
  func: boyerMoore,
};
