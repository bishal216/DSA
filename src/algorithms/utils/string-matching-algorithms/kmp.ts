// src/algorithms/utils/string-matching-algorithms/kmp.ts

import type {
  CharState,
  KMPMetadata,
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
  mismatchIdx: number | null,
  matches: number[],
  failure: number[],
  computedUpTo: number,
  isMajorStep = false,
): StringMatchingStep {
  const textStates: Record<number, CharState> = {};
  const patternStates: Record<number, CharState> = {};

  for (let i = offset; i < offset + activePatternIdx! + 1 && i < textLen; i++) {
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

  const metadata: KMPMetadata = { failureFunction: [...failure], computedUpTo };

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

function buildFailureFunction(pattern: string): {
  failure: number[];
  steps: StringMatchingStep[];
} {
  const m = pattern.length;
  const failure = new Array<number>(m).fill(0);
  const steps: StringMatchingStep[] = [];

  steps.push({
    stepType: "preprocess",
    message:
      "KMP preprocessing: building failure function (partial match table)",
    subMessage:
      "failure[i] = length of longest proper prefix of pattern[0..i] that is also a suffix",
    isMajorStep: true,
    textStates: {},
    patternStates: {},
    patternOffset: 0,
    matches: [],
    metadata: { failureFunction: [...failure], computedUpTo: 0 },
  });

  let len = 0;
  let i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      failure[i] = len;
      steps.push({
        stepType: "preprocess",
        message: `failure[${i}] = ${len} — pattern[${i}]='${pattern[i]}' matches pattern[${len - 1}]='${pattern[len - 1]}'`,
        subMessage: `Prefix "${pattern.slice(0, len)}" is also a suffix of "${pattern.slice(0, i + 1)}"`,
        isMajorStep: false,
        textStates: {},
        patternStates: { [i]: "active", [len - 1]: "candidate" },
        patternOffset: 0,
        matches: [],
        metadata: { failureFunction: [...failure], computedUpTo: i },
      });
      i++;
    } else if (len > 0) {
      len = failure[len - 1];
    } else {
      failure[i] = 0;
      steps.push({
        stepType: "preprocess",
        message: `failure[${i}] = 0 — no proper prefix/suffix match`,
        subMessage: `pattern[${i}]='${pattern[i]}' — resetting`,
        isMajorStep: false,
        textStates: {},
        patternStates: { [i]: "mismatch" },
        patternOffset: 0,
        matches: [],
        metadata: { failureFunction: [...failure], computedUpTo: i },
      });
      i++;
    }
  }

  return { failure, steps };
}

function kmp({ text, pattern }: StringMatchingOptions): StringMatchingStep[] {
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

  const { failure, steps: prepSteps } = buildFailureFunction(pattern);
  steps.push(...prepSteps);

  steps.push({
    stepType: "preprocess",
    message: `Failure function complete: [${failure.join(", ")}]`,
    subMessage:
      "Now scanning text — mismatches will use the failure function to skip ahead",
    isMajorStep: true,
    textStates: {},
    patternStates: {},
    patternOffset: 0,
    matches: [],
    metadata: { failureFunction: [...failure], computedUpTo: m - 1 },
  });

  let i = 0; // text index
  let j = 0; // pattern index

  while (i < n) {
    const offset = i - j;

    steps.push(
      buildStep(
        "compare",
        `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`,
        text[i] === pattern[j]
          ? "Match — advance both pointers"
          : `Mismatch — use failure[${j - 1}]=${j > 0 ? failure[j - 1] : 0} to skip`,
        offset,
        n,
        m,
        i,
        j,
        text[i] !== pattern[j] ? i : null,
        [...matches],
        failure,
        m - 1,
      ),
    );

    if (text[i] === pattern[j]) {
      i++;
      j++;
    } else if (j > 0) {
      steps.push(
        buildStep(
          "shift",
          `Mismatch — jumping pattern to position ${failure[j - 1]} (saved ${j - failure[j - 1]} comparisons)`,
          `Skipping redundant comparisons using failure[${j - 1}]=${failure[j - 1]}`,
          i - failure[j - 1],
          n,
          m,
          i,
          failure[j - 1],
          null,
          [...matches],
          failure,
          m - 1,
          true,
        ),
      );
      j = failure[j - 1];
    } else {
      i++;
    }

    if (j === m) {
      const matchStart = i - j;
      matches.push(matchStart);
      steps.push(
        buildStep(
          "match",
          `Match found at index ${matchStart}!`,
          `text[${matchStart}..${matchStart + m - 1}] = "${pattern}"`,
          matchStart,
          n,
          m,
          null,
          null,
          null,
          [...matches],
          failure,
          m - 1,
          true,
        ),
      );
      j = failure[j - 1];
    }
  }

  steps.push(
    buildStep(
      "complete",
      matches.length > 0
        ? `KMP complete — ${matches.length} match${matches.length !== 1 ? "es" : ""} at: [${matches.join(", ")}]`
        : "KMP complete — no matches found",
      "KMP avoids redundant comparisons using the failure function",
      0,
      n,
      m,
      null,
      null,
      null,
      [...matches],
      failure,
      m - 1,
      true,
    ),
  );

  return steps;
}

export const definition: StringMatchingAlgorithmDefinition = {
  key: "kmp",
  name: "Knuth-Morris-Pratt (KMP)",
  func: kmp,
};
