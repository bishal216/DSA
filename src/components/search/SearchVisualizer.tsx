import { useState } from "react";
import { Visualizer } from "@/components/search/Visualizer";
import { SearchControls } from "@/components/search/SearchControls";
import { SearchStats } from "@/components/search/SearchStats";
import { ArrayDisplay } from "@/components/search/ArrayDisplay";
import { Card } from "@/components/ui/card";

const SearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([
    1, 3, 5, 7, 9, 12, 15, 18, 21, 25, 28, 31, 35, 38, 42,
  ]);
  const [searchValue, setSearchValue] = useState<number>(15);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [searchAlgorithm, setSearchAlgorithm] = useState<"linear" | "binary">(
    "linear",
  );
  const [speed, setSpeed] = useState<number>(500);
  const [comparisons, setComparisons] = useState<number>(0);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([]);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            DSA Search Visualizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualize how Linear Search and Binary Search algorithms work
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Array Display */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Array Visualization
              </h2>
              <ArrayDisplay
                array={array}
                currentIndex={currentIndex}
                foundIndex={foundIndex}
                visitedIndices={visitedIndices}
                searchValue={searchValue}
                eliminatedIndices={eliminatedIndices}
                algorithm={searchAlgorithm}
              />
            </Card>
          </div>

          {/* Controls and Stats */}
          <div className="space-y-6">
            <SearchControls
              array={array}
              setArray={setArray}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchAlgorithm={searchAlgorithm}
              setSearchAlgorithm={setSearchAlgorithm}
              speed={speed}
              setSpeed={setSpeed}
              isSearching={isSearching}
              onStartSearch={() => {
                setIsSearching(true);
                setCurrentIndex(-1);
                setFoundIndex(-1);
                setComparisons(0);
                setVisitedIndices([]);
                setEliminatedIndices([]);
              }}
              onResetVisualization={() => {
                setCurrentIndex(-1);
                setFoundIndex(-1);
                setComparisons(0);
                setVisitedIndices([]);
                setEliminatedIndices([]);
                setIsSearching(false);
              }}
            />

            <SearchStats
              algorithm={searchAlgorithm}
              comparisons={comparisons}
              arrayLength={array.length}
              found={foundIndex !== -1}
              isSearching={isSearching}
            />
          </div>
        </div>

        <Visualizer
          array={array}
          searchValue={searchValue}
          algorithm={searchAlgorithm}
          speed={speed}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setCurrentIndex={setCurrentIndex}
          setFoundIndex={setFoundIndex}
          setComparisons={setComparisons}
          setVisitedIndices={setVisitedIndices}
          setEliminatedIndices={setEliminatedIndices}
        />
      </div>
    </div>
  );
};

export default SearchVisualizer;
