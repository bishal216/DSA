// pages/Home.tsx
import { AlgorithmsSection } from "@/algorithms/algorithmsSection";
import Section from "@/components/partials/section";
import { commonProblems, dataStructures } from "@/config/data";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
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
