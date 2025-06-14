import { Visualizer } from "@/components/search/Visualizer";
import { SearchControls } from "@/components/search/SearchControls";
import { SearchStats } from "@/components/search/SearchStats";
import { ArrayDisplay } from "@/components/search/ArrayDisplay";
import { Card } from "@/components/ui/card";
import { useSearchVisualization } from "@/algorithms/hooks/useSEARCHvisualizations";
const SearchVisualizer = () => {
  const {
    array,
    setArray,
    searchValue,
    setSearchValue,
    isSearching,
    setIsSearching,
    currentIndex,
    setCurrentIndex,
    foundIndex,
    setFoundIndex,
    searchAlgorithm,
    setSearchAlgorithm,
    speed,
    setSpeed,
    comparisons,
    setComparisons,
    visitedIndices,
    setVisitedIndices,
    eliminatedIndices,
    setEliminatedIndices,
  } = useSearchVisualization();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center">Searching Algorithms</h1>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
        {/* Array Display */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Visualization</h2>
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
  );
};

export default SearchVisualizer;
