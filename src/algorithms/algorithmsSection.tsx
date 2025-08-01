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

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "in-development":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "beta":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "planning":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "in-development":
      return "In Development";
    case "beta":
      return "Beta";
    case "planning":
      return "Planning";
    default:
      return "Unknown";
  }
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
              <Card key={visualizer.id} className="border-none">
                <CardHeader className="h-[30%]">
                  <div className="flex flex-shrink-1 flex-row justify-between">
                    <div className="flex items-center justify-center">
                      <IconComponent className="h-12 w-12 text-primary-light bg-primary-dark rounded-md p-2 mr-4" />
                    </div>
                    <div className="flex-grow-1">
                      <CardTitle className="text-xl font-semibold text-dark ">
                        {visualizer.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(visualizer.status)}
                        >
                          {getStatusText(visualizer.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col justify-between gap-4 h-[70%]">
                  <CardDescription className="text-dark leading-relaxed ">
                    {visualizer.description}
                  </CardDescription>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Features:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {visualizer.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs "
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link to={visualizer.path} className="mt-auto">
                    <Button
                      variant="primary"
                      className="w-full"
                      disabled={visualizer.status === "in-development"}
                    >
                      Explore {visualizer.title}
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
