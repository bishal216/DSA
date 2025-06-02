import React from "react";

interface LinkedListVisualizerProps {
  type: "singly" | "doubly"; // add more if needed
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  type,
}) => {
  return <div>{`This is a ${type} linked list visualizer.`}</div>;
};

export default LinkedListVisualizer;
