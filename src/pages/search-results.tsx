import { algorithmConfigs } from "@/config/algorithm-config";
import { commonProblemConfigs } from "@/config/common-problem-config";
import { dataStructureConfigs } from "@/config/data-structure-config";
import type { FeatureConfig } from "@/config/feature-config";
import { Link, useSearchParams } from "react-router-dom";

// ── Search index ──────────────────────────────────────────────────────────────
// Built once at module level — never rebuilt on re-render.

const SEARCH_INDEX: FeatureConfig[] = [
  ...algorithmConfigs,
  ...dataStructureConfigs,
  ...commonProblemConfigs,
];

// ── Scoring ───────────────────────────────────────────────────────────────────

function score(item: FeatureConfig, query: string): number {
  const title = item.title.toLowerCase();
  if (title === query) return 3;
  if (title.startsWith(query)) return 2;
  if (title.includes(query)) return 1;
  return 0;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (!query) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground">
          Try searching for topics like "stack", "graph", or "greedy".
        </p>
      </div>
    );
  }

  const results = SEARCH_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query)),
  ).sort((a, b) => {
    const scoreDiff = score(b, query) - score(a, query);
    if (scoreDiff !== 0) return scoreDiff;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        Results for: <span className="text-primary font-mono">"{query}"</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((item) => (
            <li
              key={item.path}
              className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <Link
                to={`/app/${item.path}`}
                className="text-base font-semibold text-foreground hover:text-primary transition-colors"
              >
                {item.title}
              </Link>

              {item.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={
                      tag.toLowerCase().includes(query)
                        ? "inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary"
                        : "inline-block px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">
          No results for "{query}". Try a broader term.
        </p>
      )}
    </div>
  );
}
