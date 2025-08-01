import { ALGORITHM_ROUTE_CONFIG } from "@/algorithms/config/routeConfig";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const getBadgeColor = (idx: number) => {
  const colors = [
    "bg-green-100 text-green-800 border-green-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-red-100 text-red-800 border-red-200",
  ];
  return colors[idx % colors.length];
};

export function AlgorithmsSection() {
  return (
    <section
      className="pt-24 pb-12 border-b border-primary text-dark"
      id="algorithms"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Algorithm Visualizers
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            Understand complex algorithms through interactive visualizations.
            Each visualizer is designed to help you grasp the concepts step by
            step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALGORITHM_ROUTE_CONFIG.map((visualizer) => {
            const IconComponent = visualizer.icon;
            return (
              <Card
                key={visualizer.id}
                className="border-none bg-white shadow-xs shadow-primary "
              >
                <CardHeader className="h-[28%]">
                  <div className="flex flex-shrink-1 flex-row justify-between">
                    <div className="flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-dark rounded-md p-2 mr-4 border border-dark" />
                    </div>
                    <div className="flex-grow-1 ">
                      <CardTitle className="text-xl font-semibold text-dark  flex items-center ">
                        {visualizer.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col justify-between gap-4 h-[70%]">
                  <CardDescription className="text-dark leading-relaxed ">
                    {visualizer.description}
                  </CardDescription>

                  <div className="">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Visualize
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {visualizer.features.map((feature, index) => (
                        <Badge key={index} className={getBadgeColor(index)}>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link to={visualizer.path} className="mt-auto">
                    <Button
                      variant="dark"
                      className="w-full"
                      disabled={visualizer.status === "in-development"}
                    >
                      Visualize {visualizer.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
