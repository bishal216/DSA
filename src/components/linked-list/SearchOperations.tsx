import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import ReduxCollapsible from "@/components/ui/collapsible-card";
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
    <ReduxCollapsible title="Search & Access Operations">
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-400 mb-0">
          You can search for a node by its value.
        </p>
        <div className="flex flex-row sm:items-center gap-2">
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
            <Search className="size-4" />
          </Button>
        </div>
        <hr className="my-4" />
        <p className="text-sm text-gray-400 mb-0">
          You can access a node at a specific index.
        </p>
        <div className="flex flex-row sm:items-center gap-2">
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
            <Eye className="size-4" />
          </Button>
        </div>
      </CardContent>
    </ReduxCollapsible>
  );
};

export default SearchOperations;
