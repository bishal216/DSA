// src/components/string-matching/StringMatchingMetadataDisplay.tsx
//
// Algorithm-specific metadata panel (failure fn table, hash values, Z-array, etc.)

import type {
  AhoCorasickMetadata,
  BoyerMooreMetadata,
  KMPMetadata,
  RabinKarpMetadata,
  StringMatchingStep,
  ZAlgorithmMetadata,
} from "@/algorithms/types/string-matching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  step: StringMatchingStep | undefined;
  algorithm: string;
  pattern: string;
}

// ── KMP: failure function table ───────────────────────────────────────────────

function KMPDisplay({ meta, pattern }: { meta: KMPMetadata; pattern: string }) {
  if (!meta?.failureFunction) return null;
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Failure Function
      </h3>
      <div className="overflow-x-auto">
        <table className="text-xs font-mono border-collapse">
          <thead>
            <tr>
              <td className="px-2 py-1 text-muted-foreground">i</td>
              {pattern.split("").map((_, i) => (
                <td key={i} className="px-2 py-1 text-center w-7">
                  {i}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-2 py-1 text-muted-foreground">ch</td>
              {pattern.split("").map((ch, i) => (
                <td key={i} className="px-2 py-1 text-center w-7 font-bold">
                  {ch}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-muted-foreground">f[i]</td>
              {(meta.failureFunction ?? []).map((val, i) => (
                <td
                  key={i}
                  className="px-2 py-1 text-center w-7 rounded"
                  style={
                    i <= meta.computedUpTo
                      ? { backgroundColor: "#EFF6FF", color: "#1E3A5F" }
                      : { color: "#9CA3AF" }
                  }
                >
                  {i <= meta.computedUpTo ? val : "–"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Rabin-Karp: hash values ───────────────────────────────────────────────────

function RabinKarpDisplay({ meta }: { meta: RabinKarpMetadata }) {
  if (meta?.patternHash === undefined) return null;
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {[
        { label: "Pattern hash", value: meta.patternHash },
        { label: "Window hash", value: meta.windowHash },
        { label: "Base", value: meta.base },
        { label: "Modulus", value: meta.mod },
        { label: "Spurious hits", value: meta.spuriousHits },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="p-2 rounded border-l-[3px]"
          style={{
            backgroundColor: "#F9FAFB",
            borderLeftColor: "#E5E7EB",
            color: "#374151",
          }}
        >
          <div className="text-muted-foreground">{label}</div>
          <div className="font-mono font-bold">{value}</div>
        </div>
      ))}
    </div>
  );
}

// ── Boyer-Moore: bad character table ─────────────────────────────────────────

function BoyerMooreDisplay({ meta }: { meta: BoyerMooreMetadata }) {
  if (!meta) return null;
  const entries = Object.entries(meta.badCharTable ?? {});
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Bad Character Table{" "}
        {meta.shiftAmount > 0 && (
          <span className="normal-case text-amber-700 ml-1">
            → shift {meta.shiftAmount}
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {entries.length === 0 ? (
          <span className="text-xs text-muted-foreground">No entries yet</span>
        ) : (
          entries.map(([ch, idx]) => (
            <div
              key={ch}
              className="px-2 py-1 rounded border-l-[3px] text-xs font-mono"
              style={{
                backgroundColor: "#EFF6FF",
                borderLeftColor: "#93C5FD",
                color: "#1E3A5F",
              }}
            >
              '{ch}' → {idx}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Z-Algorithm: Z-array ─────────────────────────────────────────────────────

function ZAlgorithmDisplay({
  meta,
  pattern,
}: {
  meta: ZAlgorithmMetadata;
  pattern: string;
}) {
  if (!meta?.zArray) return null;
  // Only show the text portion of the Z-array (skip pattern + "$")
  const textZArr = (meta.zArray ?? []).slice(pattern.length + 1);
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Z-Array (text portion)
      </h3>
      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {textZArr.map((val, i) => (
            <div
              key={i}
              className="w-7 text-center text-xs font-mono rounded border"
              style={
                val === pattern.length
                  ? {
                      backgroundColor: "#F0FDF4",
                      borderColor: "#10B981",
                      color: "#065F46",
                      fontWeight: 700,
                    }
                  : val > 0
                    ? {
                        backgroundColor: "#EFF6FF",
                        borderColor: "#93C5FD",
                        color: "#1E3A5F",
                      }
                    : {
                        backgroundColor: "#F9FAFB",
                        borderColor: "#E5E7EB",
                        color: "#9CA3AF",
                      }
              }
            >
              {i <= meta.computedUpTo - (pattern.length + 1) ? val : "–"}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Bold green = full match (value = {pattern.length})
      </p>
    </div>
  );
}

// ── Aho-Corasick: automaton state ─────────────────────────────────────────────

function AhoCorasickDisplay({ meta }: { meta: AhoCorasickMetadata }) {
  if (!meta?.failureFn || !meta?.gotoFn) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Current state:</span>
        <span
          className="px-2 py-0.5 rounded border-l-[3px] font-mono font-bold"
          style={{
            backgroundColor: "#F5F3FF",
            borderLeftColor: "#C4B5FD",
            color: "#4C1D95",
          }}
        >
          {meta.currentState}
        </span>
        <span className="text-muted-foreground">
          Trie states: {Object.keys(meta.failureFn ?? {}).length}
        </span>
      </div>
      {meta.builtTrie && (
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Failure Links
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(meta.failureFn ?? []).map((target, state) => (
              <div
                key={state}
                className="px-2 py-0.5 rounded border-l-[3px] text-xs font-mono"
                style={{
                  backgroundColor: "#F5F3FF",
                  borderLeftColor: "#C4B5FD",
                  color: "#4C1D95",
                }}
              >
                {state} → {target}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StringMatchingMetadataDisplay({
  step,
  algorithm,
  pattern,
}: Props) {
  if (!step?.metadata) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Algorithm Details</CardTitle>
      </CardHeader>
      <CardContent>
        {algorithm === "kmp" && (
          <KMPDisplay meta={step.metadata as KMPMetadata} pattern={pattern} />
        )}
        {algorithm === "rabinKarp" && (
          <RabinKarpDisplay meta={step.metadata as RabinKarpMetadata} />
        )}
        {algorithm === "boyerMoore" && (
          <BoyerMooreDisplay meta={step.metadata as BoyerMooreMetadata} />
        )}
        {algorithm === "zAlgorithm" && (
          <ZAlgorithmDisplay
            meta={step.metadata as ZAlgorithmMetadata}
            pattern={pattern}
          />
        )}
        {algorithm === "ahoCorasick" && (
          <AhoCorasickDisplay meta={step.metadata as AhoCorasickMetadata} />
        )}
      </CardContent>
    </Card>
  );
}
