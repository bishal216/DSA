import SearchVisualizer from "@/components/search/SearchVisualizer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/utils/iconmap";
const SearchPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/">
          <iconMap.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </Button>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Search</h1>
      </div>
      <SearchVisualizer />
    </div>
  );
};

export default SearchPage;
