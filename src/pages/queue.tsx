import QueueVisualizer from "@/components/queue/QueueVisualizer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { iconMap } from "@/utils/iconmap";
interface QueuePageProps {
  title: string;
  queueType: "linear" | "deque" | "circular";
}
const Queue = ({ title, queueType }: QueuePageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/">
          <iconMap.ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>
      </Button>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      </div>
      <QueueVisualizer queueType={queueType} />
    </div>
  );
};

export default Queue;
