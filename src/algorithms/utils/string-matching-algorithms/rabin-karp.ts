// src/algorithms/utils/string-matching-algorithms/rabinKarp.ts

import type { StringMatchingAlgorithmDefinition } from "@/algorithms/registry/string-matching-registry";
import type {
  CharState,
  RabinKarpMetadata,
  StringMatchingOptions,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";

const BASE = 31;
const MOD = 1_000_000_007;

function charCode(c: string): number {
  return c.charCodeAt(0) - 96; // a=1, b=2, ...
}

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
  patternHash: number,
  windowHash: number,
  spuriousHits: number,
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
  for (const i of activeIndices) textStates[i] = "active";
  for (const i of mismatchIndices) textStates[i] = "mismatch";

  const metadata: RabinKarpMetadata = {
    patternHash,
    windowHash,
    base: BASE,
    mod: MOD,
    spuriousHits,
  };

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

function rabinKarp({
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

  // Compute BASE^(m-1) mod MOD
  let h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * BASE) % MOD;

  // Compute initial hashes
  let patternHash = 0;
  let windowHash = 0;
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + charCode(pattern[i])) % MOD;
    windowHash = (windowHash * BASE + charCode(text[i])) % MOD;
  }

  steps.push(
    buildStep(
      "preprocess",
      `Rabin-Karp: pattern hash = ${patternHash}`,
      `BASE=${BASE}, MOD=${MOD}. Rolling hash lets us slide the window in O(1).`,
      0,
      n,
      m,
      [],
      [],
      [],
      patternHash,
      windowHash,
      0,
      true,
    ),
  );

  let spuriousHits = 0;

  for (let i = 0; i <= n - m; i++) {
    steps.push(
      buildStep(
        "compare",
        `Window [${i}..${i + m - 1}]: hash=${windowHash} vs pattern hash=${patternHash}`,
        windowHash === patternHash
          ? "Hash match — verifying character by character"
          : "Hash mismatch — skip window",
        i,
        n,
        m,
        windowHash === patternHash
          ? Array.from({ length: m }, (_, k) => i + k)
          : [],
        [],
        [...matches],
        patternHash,
        windowHash,
        spuriousHits,
      ),
    );

    if (windowHash === patternHash) {
      // Verify character by character
      let verified = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          verified = false;
          break;
        }
      }

      if (verified) {
        matches.push(i);
        steps.push(
          buildStep(
            "match",
            `Match confirmed at index ${i}!`,
            `Hash matched AND character verification passed`,
            i,
            n,
            m,
            [],
            [],
            [...matches],
            patternHash,
            windowHash,
            spuriousHits,
            true,
          ),
        );
      } else {
        spuriousHits++;
        steps.push(
          buildStep(
            "mismatch",
            `Spurious hit at ${i} — hash collision! Characters don't match`,
            `Spurious hits so far: ${spuriousHits}`,
            i,
            n,
            m,
            [],
            Array.from({ length: m }, (_, k) => i + k),
            [...matches],
            patternHash,
            windowHash,
            spuriousHits,
            true,
          ),
        );
      }
    }

    // Roll the hash forward
    if (i < n - m) {
      windowHash =
        (BASE * (windowHash - ((charCode(text[i]) * h) % MOD) + MOD) +
          charCode(text[i + m])) %
        MOD;

      steps.push(
        buildStep(
          "shift",
          `Rolling hash: removing '${text[i]}', adding '${text[i + m]}' → new hash=${windowHash}`,
          "O(1) hash update via rolling hash formula",
          i + 1,
          n,
          m,
          [],
          [],
          [...matches],
          patternHash,
          windowHash,
          spuriousHits,
        ),
      );
    }
  }

  steps.push(
    buildStep(
      "complete",
      matches.length > 0
        ? `Rabin-Karp complete — ${matches.length} match${matches.length !== 1 ? "es" : ""} at: [${matches.join(", ")}]`
        : "Rabin-Karp complete — no matches found",
      `${spuriousHits} spurious hit${spuriousHits !== 1 ? "s" : ""} (hash collisions requiring verification)`,
      0,
      n,
      m,
      [],
      [],
      [...matches],
      patternHash,
      windowHash,
      spuriousHits,
      true,
    ),
  );

  return steps;
}

export const definition: StringMatchingAlgorithmDefinition = {
  key: "rabinKarp",
  name: "Rabin-Karp",
  func: rabinKarp,
};
