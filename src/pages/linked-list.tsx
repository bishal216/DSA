import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/context/iconmap";
import LinkedListVisualizer from "@/components/linked-list/LinkedListVisualizer";

interface LinkedListPageProps {
  title: string;
  listType: "singly" | "doubly" | "circular";
}

const LinkedListPage = ({ title, listType }: LinkedListPageProps) => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/">
              <iconMap.ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold  mb-4">{title}</h1>
          </div>
        </div>
        <LinkedListVisualizer listType={listType} />
      </div>
    </div>
  );
};

export default LinkedListPage;
