// src/algorithms/types/string-matching.ts

// ── Core step type ─────────────────────────────────────────────────────────────

export type StringMatchingStepType =
  | "initial"
  | "compare" // actively comparing text[i] vs pattern[j]
  | "match" // full pattern match found
  | "mismatch" // character mismatch — about to shift
  | "shift" // shifting pattern window
  | "preprocess" // building failure fn / bad char table / hash (major step)
  | "complete"; // algorithm finished

export type CharState =
  | "default"
  | "active" // currently being compared
  | "matched" // part of a confirmed full match
  | "mismatch" // mismatched character
  | "candidate"; // in the current window but not yet compared

// ── Per-algorithm metadata (for StepDisplay) ──────────────────────────────────

export interface KMPMetadata {
  failureFunction: number[]; // partial match table
  computedUpTo: number; // how much of the failure fn is built
}

export interface RabinKarpMetadata {
  patternHash: number;
  windowHash: number;
  base: number;
  mod: number;
  spuriousHits: number; // hash matches that were not real matches
}

export interface BoyerMooreMetadata {
  badCharTable: Record<string, number>;
  shiftAmount: number;
}

export interface ZAlgorithmMetadata {
  zArray: number[];
  computedUpTo: number;
}

export interface AhoCorasickMetadata {
  gotoFn: Record<number, Record<string, number>>;
  failureFn: number[];
  outputFn: Record<number, string[]>;
  currentState: number;
  builtTrie: boolean;
}

export type StringMatchingMetadata =
  | KMPMetadata
  | RabinKarpMetadata
  | BoyerMooreMetadata
  | ZAlgorithmMetadata
  | AhoCorasickMetadata;

// ── Step ──────────────────────────────────────────────────────────────────────

export interface StringMatchingStep {
  stepType: StringMatchingStepType;
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;

  // Text/pattern state
  textStates: Record<number, CharState>; // index → state
  patternStates: Record<number, CharState>; // index → state
  patternOffset: number; // where pattern window starts in text

  // Results
  matches: number[]; // confirmed match start positions

  // Algorithm-specific
  metadata?: StringMatchingMetadata;
}

// ── Algorithm options ─────────────────────────────────────────────────────────

export interface StringMatchingOptions {
  text: string;
  pattern: string;
}
