import { LinkedListControls } from "@/components/data-structures/linked-list/linked-list-controls";
import { LinkedListVisualizer } from "@/components/data-structures/linked-list/linked-list-visualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLinkedList } from "@/hooks/use-linked-list";
import type { ListType } from "@/types/types";
import { useState } from "react";

const LIST_TYPES: { value: ListType; label: string; description: string }[] = [
  {
    value: "singly",
    label: "Singly Linked List",
    description: "Each node points to the next. Traversal is one-directional.",
  },
  {
    value: "doubly",
    label: "Doubly Linked List",
    description: "Each node holds pointers to both next and previous nodes.",
  },
  {
    value: "circular",
    label: "Circular Linked List",
    description: "The tail node links back to the head, forming a cycle.",
  },
];

export default function LinkedListPage() {
  const [listType, setListType] = useState<ListType>("singly");

  const {
    inputValue,
    setInputValue,
    positionInput,
    setPositionInput,
    isRunning,
    displayStep,
    onStart,
    reset,
  } = useLinkedList(listType);

  const selected = LIST_TYPES.find((t) => t.value === listType)!;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">{selected.label}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {selected.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:items-stretch">
        {/* Left column — selector + visualizer */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">List Type</label>
                <Select
                  value={listType}
                  onValueChange={(v) => setListType(v as ListType)}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIST_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <LinkedListVisualizer
            nodes={displayStep.nodes}
            listType={listType}
            message={displayStep.message}
          />
        </div>

        {/* Right column — controls full height */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <LinkedListControls
              inputValue={inputValue}
              setInputValue={setInputValue}
              positionInput={positionInput}
              setPositionInput={setPositionInput}
              isRunning={isRunning}
              listType={listType}
              onStart={onStart}
              onReset={reset}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
