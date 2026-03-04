// src/algorithms/utils/string-matching-algorithms/ahoCorasick.ts
//
// Aho-Corasick multi-pattern search. For single-pattern mode we treat the
// pattern as a single-element pattern set.

import type { StringMatchingAlgorithmDefinition } from "@/algorithms/registry/string-matching-registry";
import type {
  AhoCorasickMetadata,
  CharState,
  StringMatchingOptions,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";

// ── Trie node ─────────────────────────────────────────────────────────────────

interface TrieNode {
  children: Record<string, number>; // char → state id
  failure: number;
  output: string[]; // patterns that end here (after failure links)
}

function buildAC(patterns: string[]): {
  goto: Record<number, Record<string, number>>;
  failure: number[];
  output: Record<number, string[]>;
  nodes: TrieNode[];
} {
  const nodes: TrieNode[] = [{ children: {}, failure: 0, output: [] }];

  // Build goto (trie)
  for (const pat of patterns) {
    let cur = 0;
    for (const ch of pat) {
      if (nodes[cur].children[ch] === undefined) {
        nodes.push({ children: {}, failure: 0, output: [] });
        nodes[cur].children[ch] = nodes.length - 1;
      }
      cur = nodes[cur].children[ch];
    }
    nodes[cur].output.push(pat);
  }

  // Build failure links via BFS
  const queue: number[] = [];
  for (const ch in nodes[0].children) {
    const s = nodes[0].children[ch];
    nodes[s].failure = 0;
    queue.push(s);
  }

  while (queue.length > 0) {
    const r = queue.shift()!;
    for (const ch in nodes[r].children) {
      const s = nodes[r].children[ch];
      queue.push(s);
      let state = nodes[r].failure;
      while (state !== 0 && nodes[state].children[ch] === undefined) {
        state = nodes[state].failure;
      }
      nodes[s].failure = nodes[state].children[ch] ?? 0;
      if (nodes[s].failure === s) nodes[s].failure = 0;
      nodes[s].output = [...nodes[s].output, ...nodes[nodes[s].failure].output];
    }
  }

  // Export as plain objects for metadata
  const gotoFn: Record<number, Record<string, number>> = {};
  const failureFn: number[] = [];
  const outputFn: Record<number, string[]> = {};
  for (let i = 0; i < nodes.length; i++) {
    gotoFn[i] = { ...nodes[i].children };
    failureFn[i] = nodes[i].failure;
    outputFn[i] = [...nodes[i].output];
  }

  return { goto: gotoFn, failure: failureFn, output: outputFn, nodes };
}

function ahoCorasick({
  text,
  pattern,
}: StringMatchingOptions): StringMatchingStep[] {
  const steps: StringMatchingStep[] = [];
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];

  if (m === 0) {
    steps.push({
      stepType: "complete",
      message: "Pattern is empty",
      subMessage: "",
      textStates: {},
      patternStates: {},
      patternOffset: 0,
      matches: [],
      isMajorStep: true,
    });
    return steps;
  }

  const {
    goto: gotoFn,
    failure: failureFn,
    output: outputFn,
    nodes,
  } = buildAC([pattern]);

  const makeMetadata = (
    state: number,
    built: boolean,
  ): AhoCorasickMetadata => ({
    gotoFn,
    failureFn,
    outputFn,
    currentState: state,
    builtTrie: built,
  });

  steps.push({
    stepType: "preprocess",
    message: `Aho-Corasick: building trie for pattern "${pattern}"`,
    subMessage: `Trie has ${nodes.length} states. Failure links allow O(n) text scan regardless of mismatches.`,
    isMajorStep: true,
    textStates: {},
    patternStates: {},
    patternOffset: 0,
    matches: [],
    metadata: makeMetadata(0, true),
  });

  steps.push({
    stepType: "preprocess",
    message: "Failure links computed — trie is ready. Beginning text scan.",
    subMessage:
      "Each character transitions the automaton; failure links handle mismatches without backtracking.",
    isMajorStep: true,
    textStates: {},
    patternStates: {},
    patternOffset: 0,
    matches: [],
    metadata: makeMetadata(0, true),
  });

  let state = 0;

  for (let i = 0; i < n; i++) {
    const ch = text[i];

    // Follow failure links until we find a transition or reach root
    while (state !== 0 && nodes[state].children[ch] === undefined) {
      state = nodes[state].failure;
    }
    state = nodes[state].children[ch] ?? 0;

    const textStates: Record<number, CharState> = {};
    const patternStates: Record<number, CharState> = {};

    for (const m_ of matches) {
      for (let k = m_; k < m_ + m; k++) textStates[k] = "matched";
    }
    textStates[i] = outputFn[state].length > 0 ? "active" : "candidate";

    // Highlight current automaton depth in pattern
    const depth = state; // state number ≈ depth in trie for single pattern
    for (let k = 0; k < Math.min(depth, m); k++) patternStates[k] = "candidate";

    if (outputFn[state].length > 0) {
      for (const matched of outputFn[state]) {
        const startIdx = i - matched.length + 1;
        matches.push(startIdx);
        for (let k = startIdx; k <= i; k++) textStates[k] = "matched";
      }

      steps.push({
        stepType: "match",
        message: `Match found ending at text[${i}] — start index ${i - m + 1}`,
        subMessage: `Automaton reached output state ${state}`,
        isMajorStep: true,
        textStates,
        patternStates,
        patternOffset: i - m + 1,
        matches: [...matches],
        metadata: makeMetadata(state, true),
      });
    } else {
      steps.push({
        stepType: "compare",
        message: `text[${i}]='${ch}' — automaton now at state ${state}`,
        subMessage:
          state === 0
            ? "Back to root (no prefix match)"
            : `Matched ${state} character${state !== 1 ? "s" : ""} of pattern so far`,
        isMajorStep: false,
        textStates,
        patternStates,
        patternOffset: Math.max(0, i - state + 1),
        matches: [...matches],
        metadata: makeMetadata(state, true),
      });
    }
  }

  steps.push({
    stepType: "complete",
    message:
      matches.length > 0
        ? `Aho-Corasick complete — ${matches.length} match${matches.length !== 1 ? "es" : ""} at: [${matches.join(", ")}]`
        : "Aho-Corasick complete — no matches found",
    subMessage: "Single linear pass through text — O(n + m + z) total",
    isMajorStep: true,
    textStates: Object.fromEntries(
      matches.flatMap((m_) =>
        Array.from({ length: m }, (_, k) => [m_ + k, "matched" as CharState]),
      ),
    ),
    patternStates: {},
    patternOffset: 0,
    matches: [...matches],
    metadata: makeMetadata(0, true),
  });

  return steps;
}

export const definition: StringMatchingAlgorithmDefinition = {
  key: "ahoCorasick",
  name: "Aho-Corasick",
  func: ahoCorasick,
};
