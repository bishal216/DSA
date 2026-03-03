// src/pages/home.tsx
import Section from "@/components/partials/section";
import { algorithmConfigs } from "@/config/algorithm-config";
import { commonProblemConfigs } from "@/config/common-problem-config";
import { dataStructureConfigs } from "@/config/data-structure-config";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Section
        title="Algorithm Visualizers"
        items={algorithmConfigs}
        sectionID="algorithms"
      />
      <Section
        title="Data Structures"
        items={dataStructureConfigs}
        sectionID="data-structures"
      />
      <Section
        title="Common Problems"
        items={commonProblemConfigs}
        sectionID="common-problems"
      />
    </div>
  );
}
