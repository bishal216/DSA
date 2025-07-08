import StackVisualizer from "@/components/stack/StackVisualizer";

const Stack = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Stack</h1>
      </div>
      <StackVisualizer />
    </div>
  );
};

export default Stack;
