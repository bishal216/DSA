import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LinkedListVisualizer from "@/components/linked-list/LinkedListVisualizer";

const SinglyLinkedList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Singly Linked List
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each node contains data and a pointer to the next node in the
              sequence
            </p>
          </div>
        </div>
        <LinkedListVisualizer listType="singly" />
      </div>
    </div>
  );
};

export default SinglyLinkedList;
