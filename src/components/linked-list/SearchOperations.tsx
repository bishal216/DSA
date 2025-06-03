import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye } from "lucide-react";

interface SearchOperationsProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  getIndexValue: string;
  setGetIndexValue: (value: string) => void;
  onSearch: () => void;
  onGetAtIndex: () => void;
  isTraversing: boolean;
}

const SearchOperations: React.FC<SearchOperationsProps> = ({
  searchValue,
  setSearchValue,
  getIndexValue,
  setGetIndexValue,
  onSearch,
  onGetAtIndex,
  isTraversing,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search & Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Input
            placeholder="Search value"
            aria-label="Search value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="number"
            disabled={isTraversing}
            className="sm:basis-2/3"
          />
          <Button
            onClick={onSearch}
            variant="outline"
            className="sm:basis-1/3"
            disabled={isTraversing}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Input
            placeholder="Get at index"
            aria-label="Get at index"
            value={getIndexValue}
            onChange={(e) => setGetIndexValue(e.target.value)}
            type="number"
            disabled={isTraversing}
            className="sm:basis-2/3"
          />
          <Button
            onClick={onGetAtIndex}
            variant="outline"
            className="sm:basis-1/3"
            disabled={isTraversing}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          Leave search value blank to skip search. Use "Get at index" to access
          by position.
        </p>
      </CardContent>
    </Card>
  );
};

export default SearchOperations;
