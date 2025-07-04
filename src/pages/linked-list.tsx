import LinkedListVisualizer from "@/components/linked-list/LinkedListVisualizer";

interface LinkedListPageProps {
  title: string;
  listType: "singly" | "doubly" | "circular";
}

const LinkedListPage = ({ title, listType }: LinkedListPageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold  mb-4">{title}</h1>
        </div>
      </div>
      <LinkedListVisualizer listType={listType} />
    </div>
  );
};

export default LinkedListPage;
