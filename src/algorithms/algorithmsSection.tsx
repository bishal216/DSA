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
    <section className="py-24 bg-gradient-card" id="algorithms">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Algorithm Visualizers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand complex algorithms through interactive visualizations.
            Each visualizer is designed to help you grasp the concepts step by
            step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ALGORITHM_ROUTE_CONFIG.map((visualizer) => {
            const IconComponent = visualizer.icon;
            return (
              <Card
                key={visualizer.id}
                className="group hover:shadow-elegant transition-all duration-300 bg-gradient-card border-border/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-primary rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground">
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
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {visualizer.description}
                  </CardDescription>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Features:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {visualizer.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link to={visualizer.path}>
                    <Button
                      variant="outline"
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
