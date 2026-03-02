// src/pages/home.tsx
import Section from "@/components/partials/section";
import { ALGORITHM_CONFIG } from "@/config/algorithm-config";
import { commonProblems, dataStructures } from "@/config/data";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Section
        title="Algorithm Visualizers"
        items={ALGORITHM_CONFIG}
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
