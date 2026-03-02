import { ALGORITHM_CONFIG } from "@/config/algorithm-config";
import { commonProblems, dataStructures } from "@/config/data";
import { Link, useSearchParams } from "react-router-dom";
// ── Search index ──────────────────────────────────────────────────────────────
// Built once at module level — never rebuilt on re-render.
// All routes use the same /app/ prefix so links resolve correctly with HashRouter.

interface SearchItem {
  title: string;
  description: string;
  path: string;
  tags: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  ...ALGORITHM_CONFIG.map((item) => ({
    title: item.title,
    description: item.description,
    path: `/app/${item.path}`,
    tags: item.tags,
  })),
  ...dataStructures,
  ...commonProblems,
];

// ── Scoring ───────────────────────────────────────────────────────────────────
// Title match outranks tag match. Exact match outranks partial match.

function score(item: SearchItem, query: string): number {
  const title = item.title.toLowerCase();
  if (title === query) return 3; // exact title match
  if (title.startsWith(query)) return 2; // title prefix match
  if (title.includes(query)) return 1; // title partial match
  return 0; // tag-only match (already filtered in)
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

  // Filter then sort: higher score first, alphabetical within same score
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
                to={item.path}
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
