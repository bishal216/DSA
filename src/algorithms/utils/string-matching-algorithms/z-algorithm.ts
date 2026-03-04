// src/algorithms/utils/string-matching-algorithms/zAlgorithm.ts

import type {
  CharState,
  StringMatchingOptions,
  StringMatchingStep,
  ZAlgorithmMetadata,
} from "@/algorithms/types/string-matching";
import type { StringMatchingAlgorithmDefinition } from "@/algorithms/types/string-matching-registry";

function buildStep(
  stepType: StringMatchingStep["stepType"],
  message: string,
  subMessage: string,
  offset: number,
  textLen: number,
  patternLen: number,
  activeIndices: number[],
  mismatchIndices: number[],
  matches: number[],
  zArray: number[],
  computedUpTo: number,
  isMajorStep = false,
): StringMatchingStep {
  const textStates: Record<number, CharState> = {};
  const patternStates: Record<number, CharState> = {};

  for (let i = offset; i < offset + patternLen && i < textLen; i++)
    textStates[i] = "candidate";
  for (const m of matches) {
    for (let i = m; i < m + patternLen; i++) textStates[i] = "matched";
  }
  for (const i of activeIndices) textStates[i] = "active";
  for (const i of mismatchIndices) textStates[i] = "mismatch";

  const metadata: ZAlgorithmMetadata = { zArray: [...zArray], computedUpTo };

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

function zAlgorithm({
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

  // Concatenate: pattern + "$" + text
  const concat = pattern + "$" + text;
  const total = concat.length;
  const zArr = new Array<number>(total).fill(0);

  steps.push(
    buildStep(
      "preprocess",
      `Z-Algorithm: building Z-array on concatenated string "${pattern}$${text.slice(0, 8)}${text.length > 8 ? "…" : ""}"`,
      `Z[i] = length of longest substring starting at i that matches a prefix of the concat string. A match exists wherever Z[i] = ${m}.`,
      0,
      n,
      m,
      [],
      [],
      [],
      zArr,
      0,
      true,
    ),
  );

  let l = 0,
    r = 0;
  for (let i = 1; i < total; i++) {
    if (i < r) zArr[i] = Math.min(r - i, zArr[i - l]);

    while (i + zArr[i] < total && concat[zArr[i]] === concat[i + zArr[i]]) {
      zArr[i]++;
    }

    if (i + zArr[i] > r) {
      l = i;
      r = i + zArr[i];
    }

    const posInText = i - (m + 1); // position in original text
    const isMatch = zArr[i] === m;

    if (isMatch && posInText >= 0) {
      matches.push(posInText);
      steps.push(
        buildStep(
          "match",
          `Z[${i}] = ${zArr[i]} = pattern length → match at text[${posInText}]!`,
          `Substring starting at concat[${i}] matches full pattern`,
          posInText,
          n,
          m,
          [],
          [],
          [...matches],
          [...zArr],
          i,
          true,
        ),
      );
    } else if (i <= m) {
      // Still building the pattern portion of Z-array
      steps.push(
        buildStep(
          "preprocess",
          `Z[${i}] = ${zArr[i]} — still in pattern portion`,
          `Longest prefix match starting at concat[${i}] has length ${zArr[i]}`,
          0,
          n,
          m,
          [i],
          [],
          [...matches],
          [...zArr],
          i,
        ),
      );
    } else {
      steps.push(
        buildStep(
          "compare",
          `Z[${i}] = ${zArr[i]} — position ${posInText} in text`,
          zArr[i] > 0
            ? `Partial prefix match of length ${zArr[i]} (need ${m} for a full match)`
            : `No prefix match`,
          Math.max(0, posInText),
          n,
          m,
          zArr[i] > 0 ? [i] : [],
          zArr[i] === 0 ? [i] : [],
          [...matches],
          [...zArr],
          i,
        ),
      );
    }
  }

  steps.push(
    buildStep(
      "complete",
      matches.length > 0
        ? `Z-Algorithm complete — ${matches.length} match${matches.length !== 1 ? "es" : ""} at: [${matches.join(", ")}]`
        : "Z-Algorithm complete — no matches found",
      "All Z-values computed; positions where Z[i] = pattern length are matches",
      0,
      n,
      m,
      [],
      [],
      [...matches],
      [...zArr],
      total - 1,
      true,
    ),
  );

  return steps;
}

export const definition: StringMatchingAlgorithmDefinition = {
  key: "zAlgorithm",
  name: "Z-Algorithm",
  func: zAlgorithm,
};
