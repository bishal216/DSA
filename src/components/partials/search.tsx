import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/config/paths";
import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
interface SearchProps {
  onSearch?: () => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = useCallback(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) return;

    void navigate(`${PATHS.search}?q=${encodeURIComponent(trimmed)}`);
    onSearch?.();
  }, [debouncedQuery, navigate, onSearch]);

  return (
    <div className="flex items-stretch gap-[-1] w-full h-10 max-w-md rounded-md overflow-hidden">
      <div className="relative flex-1 text-dark placeholder-gray-800 bg-light h-full my-0">
        <Input
          type="text"
          placeholder="Search algorithms, structures..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          aria-label="Search"
          className="w-full h-full px-3 py-2 placeholder:text-dark border-none outline-none bg-transparent"
        />
      </div>

      <Button
        variant="primary"
        rounded="none"
        size="icon"
        className="h-full"
        onClick={handleSearch}
        disabled={!query.trim()}
        aria-label="Perform search"
      >
        <CiSearch className="h-5 w-5" />
      </Button>
    </div>
  );
}
