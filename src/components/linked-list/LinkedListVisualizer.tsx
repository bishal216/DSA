import React, { useState, useEffect } from "react";
import {
  SinglyLinkedList,
  DoublyLinkedList,
  CircularLinkedList,
  ListType,
  AnyLinkedList,
  AnyListNode,
} from "@/utils/LinkedListNode";
import InsertOperations from "@/components/linked-list/InsertOperations";
import DeleteOperations from "@/components/linked-list//DeleteOperations";
import SearchOperations from "@/components/linked-list//SearchOperations";
import ActionButtons from "@/components/linked-list//ActionButtons";
import ListVisualization from "@/components/linked-list//ListVisualization";
import toast from "react-hot-toast";

// TEse
// import ReduxCollaposible from "@/components/ui/collapsible-card";
// Test
interface LinkedListVisualizerProps {
  listType: ListType;
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  listType = "singly",
}) => {
  // const [listType, _] = useState<ListType>(initialType);
  const [linkedList, setLinkedList] = useState<AnyLinkedList>(
    new SinglyLinkedList(),
  );
  const [nodes, setNodes] = useState<AnyListNode[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [insertPosition, setInsertPosition] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [deletePosition, setDeletePosition] = useState("");
  const [getIndexValue, setGetIndexValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  // const { toast } = useToast();

  useEffect(() => {
    // Create new list when type changes
    let newList: AnyLinkedList;
    switch (listType) {
      case "doubly":
        newList = new DoublyLinkedList();
        break;
      case "circular":
        newList = new CircularLinkedList();
        break;
      default:
        newList = new SinglyLinkedList();
    }

    // Initialize with some sample data
    newList.append(10);
    newList.append(20);
    newList.append(30);

    setLinkedList(newList);
    setNodes(newList.toArray());
    setSearchResult(null);
    setHighlightedNode(null);
  }, [listType]);

  const updateVisualization = () => {
    setNodes(linkedList.toArray());
  };

  const animateTraversal = async (
    stopAtPosition?: number,
    highlightFound: boolean = false,
  ) => {
    if (nodes.length === 0) return;

    setIsTraversing(true);
    setSearchResult(null);

    const targetPosition =
      stopAtPosition !== undefined
        ? Math.min(stopAtPosition, nodes.length - 1)
        : nodes.length - 1;

    for (let i = 0; i <= targetPosition; i++) {
      if (i < nodes.length) {
        setHighlightedNode(nodes[i].id);
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (stopAtPosition !== undefined && i === stopAtPosition) {
          if (highlightFound) {
            setSearchResult(nodes[i].id);
          }
          break;
        }
      }
    }

    if (stopAtPosition === undefined) {
      setHighlightedNode(null);
    } else {
      // Keep the last highlighted node visible for a moment
      await new Promise((resolve) => setTimeout(resolve, 400));
      setHighlightedNode(null);
    }

    setIsTraversing(false);
  };

  const animateTraversalToValue = async (
    stopAtValue?: number,
    highlightFound: boolean = false,
  ) => {
    if (nodes.length === 0) return;

    setIsTraversing(true);
    setSearchResult(null);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedNode(nodes[i].id);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (stopAtValue !== undefined && nodes[i].value === stopAtValue) {
        if (highlightFound) {
          setSearchResult(nodes[i].id);
        }
        break;
      }
    }

    if (stopAtValue === undefined) {
      setHighlightedNode(null);
    } else {
      // Keep the last highlighted node visible for a moment
      await new Promise((resolve) => setTimeout(resolve, 400));
      setHighlightedNode(null);
    }

    setIsTraversing(false);
  };

  const handleInsert = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to insert");
      return;
    }

    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const position = insertPosition ? parseInt(insertPosition, 10) : undefined;

    // Show traversal animation if inserting at a specific position and list is not empty
    if (position !== undefined && position > 0 && nodes.length > 0) {
      await animateTraversal(position - 1, false);
    }

    const result = linkedList.insert(value, position);

    if (result.success) {
      updateVisualization();
      toast.success(result.message);
      setInputValue("");
      setInsertPosition("");
    } else {
      toast.error(result.message);
    }
  };

  const handleAppend = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to append");
      return;
    }

    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    // Show traversal animation to the end before appending
    if (nodes.length > 0) {
      await animateTraversal();
    }

    const result = linkedList.append(value);
    updateVisualization();
    toast.success(result.message);
    setInputValue("");
  };

  const handleDelete = async () => {
    if (!deleteValue.trim()) {
      toast.error("Please enter a value to delete");
      return;
    }

    const value = parseInt(deleteValue, 10);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    // Show traversal animation to find the node before deleting
    await animateTraversalToValue(value, false);

    const result = linkedList.delete(value);

    updateVisualization();

    if (result.success) {
      toast.success(result.message);
      setDeleteValue("");
      setSearchResult(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteAtPosition = async () => {
    if (!deletePosition.trim()) {
      toast.error("Please enter a position to delete");
      return;
    }

    const position = parseInt(deletePosition, 10);
    if (isNaN(position)) {
      toast.error("Please enter a valid position number");
      return;
    }

    // Show traversal animation to find the position before deleting
    if (position > 0 && nodes.length > 0) {
      await animateTraversal(position, false);
    }

    const result = linkedList.deleteAtPosition(position);
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
      setDeletePosition("");
      setSearchResult(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteFirst = async () => {
    const result = linkedList.deleteFirst();
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
      setSearchResult(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteLast = async () => {
    // Show traversal animation to the end before deleting
    if (nodes.length > 1) {
      await animateTraversal(nodes.length - 1, false);
    }

    const result = linkedList.deleteLast();
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
      setSearchResult(null);
    } else {
      toast.error(result.message);
    }
  };
  const handleGetAtIndex = async () => {
    if (!getIndexValue.trim()) {
      toast.error("Please enter an index to get the node");
      return;
    }

    const index = parseInt(getIndexValue, 10);
    if (isNaN(index)) {
      toast.error("Please enter a valid index number");
      return;
    }

    // Show traversal animation to find the index
    if (index >= 0 && index < nodes.length) {
      await animateTraversal(index, true);
    }

    const result = linkedList.getAtIndex(index);

    if (result.success) {
      toast.success(`Found node at index ${index}: ${result.value}`);
    } else {
      setSearchResult(null);
      toast.error(result.message);
    }
  };

  const handleCheckEmpty = () => {
    const isEmpty = linkedList.isEmpty();
    toast.success(isEmpty ? "The list is empty" : "The list is not empty");
  };

  const handleGetLength = () => {
    const length = linkedList.getLength();
    toast.success(`The list contains ${length} node${length !== 1 ? "s" : ""}`);
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter a value to search");
      return;
    }

    const value = parseInt(searchValue, 10);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const result = linkedList.search(value);

    // Show traversal animation to find the node
    await animateTraversalToValue(value, result.found);

    if (result.found) {
      toast.success(`Found node with value: ${value}`);
    } else {
      setSearchResult(null);
      toast.error(`Node with value ${value} not found`);
    }
  };

  const handleTraverse = async () => {
    if (nodes.length === 0) {
      toast.error("The list is empty. Please add nodes first.");
      return;
    }

    await animateTraversal();

    toast.loading("Traversing the list...");
  };

  const handleClear = () => {
    linkedList.clear();
    updateVisualization();
    setSearchResult(null);
    setHighlightedNode(null);
    toast.success("List cleared successfully");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Visualization */}
      <ListVisualization
        linkedList={linkedList}
        nodes={nodes}
        highlightedNode={highlightedNode}
        searchResult={searchResult}
        isTraversing={isTraversing}
        listType={listType}
      />
      <div className="flex flex-col md:flex-row gap-6 *:basis-0 *:grow">
        {/* Insert Operations*/}

        <InsertOperations
          inputValue={inputValue}
          setInputValue={setInputValue}
          insertPosition={insertPosition}
          setInsertPosition={setInsertPosition}
          onInsert={handleInsert}
          onAppend={handleAppend}
          isTraversing={isTraversing}
        />

        <DeleteOperations
          deleteValue={deleteValue}
          setDeleteValue={setDeleteValue}
          deletePosition={deletePosition}
          setDeletePosition={setDeletePosition}
          onDelete={handleDelete}
          onDeleteAtPosition={handleDeleteAtPosition}
          onDeleteFirst={handleDeleteFirst}
          onDeleteLast={handleDeleteLast}
          isTraversing={isTraversing}
        />

        <SearchOperations
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          getIndexValue={getIndexValue}
          setGetIndexValue={setGetIndexValue}
          onSearch={handleSearch}
          onGetAtIndex={handleGetAtIndex}
          isTraversing={isTraversing}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        onTraverse={handleTraverse}
        onGetLength={handleGetLength}
        onCheckEmpty={handleCheckEmpty}
        onClear={handleClear}
        isTraversing={isTraversing}
      />
    </div>
  );
};
export default LinkedListVisualizer;
