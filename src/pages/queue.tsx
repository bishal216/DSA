import QueueVisualizer from "@/components/queue/QueueVisualizer";

interface QueuePageProps {
  title: string;
  queueType: "linear" | "deque" | "circular";
}
const Queue = ({ title, queueType }: QueuePageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      </div>
      <QueueVisualizer queueType={queueType} />
    </div>
  );
};

export default Queue;
