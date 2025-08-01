import React, { useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchProps {
  onSearch?: () => void; // Add onSearch prop
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = useCallback(() => {
    const trimmedQuery = debouncedQuery.trim();
    if (!trimmedQuery) return;

    setIsSearching(true);
    try {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      onSearch?.(); // Call onSearch callback if provided
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedQuery, navigate, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <div className="relative flex-1 text-gray-800 placeholder-gray-800">
        <Input
          type="text"
          placeholder="Search algorithms, structures..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
          disabled={isSearching}
          className="placeholder:text-dark"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleSearch}
        disabled={isSearching || !query.trim()}
        aria-label="Perform search"
      >
        {isSearching ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <CiSearch className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
