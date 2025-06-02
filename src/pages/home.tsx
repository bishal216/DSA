// pages/Home.tsx
import Section from "@/components/partials/section";
import { dataStructures, algorithms, commonProblems } from "@/context/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="container mx-auto px-4 py-8">
        <Section
          title="Data Structures"
          items={dataStructures}
          sectionID="data-structures"
        />
        <Section title="Algorithms" items={algorithms} sectionID="algorithms" />
        <Section
          title="Common Problems"
          items={commonProblems}
          sectionID="common-problems"
        />
      </div>
    </div>
  );
}
