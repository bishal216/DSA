// src/components/search/SearchStats.tsx

import { Badge } from "@/components/ui/badge";

interface SearchStatsProps {
  comparisons: number;
  found: boolean;
  isSearching: boolean;
  notFound?: boolean;
}

export function SearchStats({
  comparisons,
  found,
  isSearching,
  notFound,
}: SearchStatsProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between items-center">
        <span className="font-medium">Steps taken:</span>
        <span className="font-mono text-primary font-bold">{comparisons}</span>
      </div>

      {found && !isSearching && (
        <div className="flex justify-between items-center">
          <span className="font-medium">Result:</span>
          <Badge className="bg-emerald-500">Found!</Badge>
        </div>
      )}

      {notFound && !isSearching && (
        <div className="flex justify-between items-center">
          <span className="font-medium">Result:</span>
          <Badge variant="destructive">Not found</Badge>
        </div>
      )}
    </div>
  );
}
