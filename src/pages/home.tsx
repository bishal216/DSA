// pages/Home.tsx
import Section from "@/components/partials/section";
import { dataStructures, commonProblems } from "@/context/data";
import { AlgorithmsSection } from "@/algorithms/algorithmsSection";

import Theme from "@/components/partials/theme";
export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Theme />
      <AlgorithmsSection />
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
