import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AlgorithmInfoProps {
  algorithm: "naive" | "kmp" | "boyer-moore";
}

export const AlgorithmInfo = ({ algorithm }: AlgorithmInfoProps) => {
  const algorithmData = {
    naive: {
      name: "Naive String Matching",
      timeComplexity: "O(nm)",
      spaceComplexity: "O(1)",
      description:
        "The naive approach checks for the pattern at every possible position in the text by comparing character by character.",
      howItWorks: [
        "Start from the first character of the text",
        "Compare pattern with text starting at current position",
        "If all characters match, record the match",
        "If any character doesn't match, move to next position",
        "Repeat until end of text is reached",
      ],
      pros: [
        "Simple to understand and implement",
        "No preprocessing required",
        "Works well for small texts and patterns",
      ],
      cons: [
        "Inefficient for large inputs",
        "Many redundant comparisons",
        "Poor worst-case performance",
      ],
    },
    kmp: {
      name: "Knuth-Morris-Pratt Algorithm",
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(m)",
      description:
        "KMP uses a failure function to skip characters efficiently, avoiding redundant comparisons by utilizing information from previous matches.",
      howItWorks: [
        "Preprocess pattern to build failure function",
        "Use failure function to skip unnecessary comparisons",
        "When mismatch occurs, use failure function to determine next position",
        "Never move backwards in the text",
        "Achieve linear time complexity",
      ],
      pros: [
        "Linear time complexity O(n + m)",
        "No backtracking in text",
        "Optimal for most practical cases",
      ],
      cons: [
        "Requires preprocessing",
        "More complex to implement",
        "Additional space for failure function",
      ],
    },
    "boyer-moore": {
      name: "Boyer-Moore Algorithm",
      timeComplexity: "O(nm) worst, O(n/m) average",
      spaceComplexity: "O(m + σ)",
      description:
        "Boyer-Moore scans from right to left and uses two rules (bad character and good suffix) to skip characters efficiently.",
      howItWorks: [
        "Preprocess pattern for bad character and good suffix rules",
        "Start comparison from right end of pattern",
        "On mismatch, use rules to determine how far to skip",
        "Bad character rule: skip based on mismatched character",
        "Good suffix rule: skip based on matched suffix",
      ],
      pros: [
        "Very fast on average case",
        "Can skip many characters at once",
        "Sublinear performance possible",
      ],
      cons: [
        "Complex preprocessing",
        "Worst case can be O(nm)",
        "Requires more memory for tables",
      ],
    },
  };

  const info = algorithmData[algorithm];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {info.name}
          </h3>
          <div className="flex gap-2 mb-3">
            <Badge variant="outline">Time: {info.timeComplexity}</Badge>
            <Badge variant="outline">Space: {info.spaceComplexity}</Badge>
          </div>
          <p className="text-sm text-slate-600">{info.description}</p>
        </div>

        <div>
          <h4 className="font-medium text-slate-700 mb-2">How it works:</h4>
          <ol className="text-sm text-slate-600 space-y-1">
            {info.howItWorks.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-blue-500 font-medium">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium text-green-700 mb-2">Advantages:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {info.pros.map((pro, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-red-700 mb-2">Disadvantages:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {info.cons.map((con, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
