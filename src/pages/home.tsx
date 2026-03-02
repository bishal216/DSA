// src/pages/home.tsx
import Section from "@/components/partials/section";
import { algorithm_config } from "@/config/algorithm-config";
import { commonProblems } from "@/config/common-problem-config";
import { dataStructures } from "@/config/data-structure-config";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Section
        title="Algorithm Visualizers"
        items={algorithm_config}
        sectionID="algorithms"
      />
      <Section
        title="Data Structures"
        items={dataStructures}
        sectionID="data-structures"
      />
      <Section
        title="Common Problems"
        items={commonProblems}
        sectionID="common-problems"
      />
    </div>
  );
}
