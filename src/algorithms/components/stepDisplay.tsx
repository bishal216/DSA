import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edge } from "../types/graph";

interface StepDisplayProps {
  description: string;
  currentEdge: Edge | null;
}

const StepDisplay: React.FC<StepDisplayProps> = ({
  description,
  currentEdge,
}) => {
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="">Current Step</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm ">{description}</p>
        {currentEdge && (
          <div className="mt-2 text-xs ">
            Current edge: {currentEdge.from}-{currentEdge.to} (weight:{" "}
            {currentEdge.weight})
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepDisplay;
