import { Link, useSearchParams } from "react-router-dom";
import { dataStructures, commonProblems } from "@/context/data";
import { ALGORITHM_ROUTE_CONFIG } from "@/algorithms/config/routeConfig";

const APP_BASE_PATH = "/app";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  // Normalize algorithm route config
  const algorithms = ALGORITHM_ROUTE_CONFIG.map((item) => ({
    title: item.title,
    path: `${APP_BASE_PATH}/${item.path}`,
    tags: item.tags,
  }));

  const contextData = [...algorithms, ...dataStructures, ...commonProblems];

  if (!query) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Please enter a search query.
        </h1>
        <p className="text-gray-600">
          Try searching for topics like "stack", "graph", or "greedy".
        </p>
      </div>
    );
  }

  // Filter results by matching title or tags
  const results = contextData
    .filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
    )
    .sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Results for: <span className="text-purple-600">"{query}"</span>
      </h1>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                {item.title}
              </Link>

              {/* Highlight matched tags */}
              {item.tags && (
                <p className="text-sm text-gray-500 mt-1">
                  Tags:{" "}
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-block px-2 py-0.5 mr-1 rounded text-xs ${
                        tag.toLowerCase().includes(query)
                          ? "bg-yellow-200 font-semibold"
                          : "bg-gray-200"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No matching results found.</p>
      )}
    </div>
  );
}
