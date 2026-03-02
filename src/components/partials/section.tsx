// src/components/partials/section.tsx
// Generic feature grid — used for Data Structures, Problems, and Algorithms.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FeatureConfig } from "@/config/feature-config";
import { PATHS } from "@/config/paths";
import { cn } from "@/utils/helpers";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<FeatureConfig["status"], string> = {
  active: "bg-success/10 text-success border-success/20",
  beta: "bg-warning/10 text-warning border-warning/20",
  "in-development": "bg-muted      text-muted-foreground border-border",
};

const STATUS_LABELS: Record<FeatureConfig["status"], string> = {
  active: "Active",
  beta: "Beta",
  "in-development": "Coming soon",
};

// ── Feature badge colours (theme-aware) ───────────────────────────────────────
const FEATURE_BADGE_STYLES = [
  "bg-primary/10 text-primary border-primary/20",
  "bg-info/10    text-info    border-info/20",
  "bg-success/10 text-success border-success/20",
  "bg-warning/10 text-warning border-warning/20",
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  items: FeatureConfig[];
  sectionID: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Section({ title, items, sectionID }: SectionProps) {
  return (
    <section
      id={sectionID}
      className="pt-24 pb-12 border-b border-border text-foreground"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.status === "in-development";
          const fullPath = `${PATHS.app}/${item.path}`;

          return (
            <Card
              key={item.id}
              className={cn(
                "flex flex-col border border-border bg-card shadow-sm transition-shadow",
                isDisabled ? "opacity-60" : "hover:shadow-md",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md border border-border bg-muted">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {item.title}
                    </CardTitle>
                  </div>
                  <Badge
                    className={cn(
                      "shrink-0 text-xs",
                      STATUS_STYLES[item.status],
                    )}
                  >
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 flex-1">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {item.description}
                </CardDescription>

                {item.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Includes
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.features.map((feature, i) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className={cn(
                            "text-xs",
                            FEATURE_BADGE_STYLES[
                              i % FEATURE_BADGE_STYLES.length
                            ],
                          )}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to={fullPath}
                  className="mt-auto"
                  aria-disabled={isDisabled}
                  tabIndex={isDisabled ? -1 : undefined}
                >
                  <Button
                    variant="dark"
                    className="w-full gap-2"
                    disabled={isDisabled}
                  >
                    {isDisabled ? "Coming Soon" : `Explore ${item.title}`}
                    {!isDisabled && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
