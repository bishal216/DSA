// pages/SearchResults.tsx
import { useSearchParams } from "react-router-dom";
import { dataStructures, algorithms, commonProblems } from "@/context/data";
import { Link } from "react-router-dom";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  // Combine all data arrays into one for unified search
  const contextData = [...dataStructures, ...algorithms, ...commonProblems];

  // Filter results by matching query in any tag
  const results = contextData.filter((item) =>
    item.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No matching results found.</p>
      )}
    </div>
  );
}
