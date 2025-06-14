import { Link } from "react-router-dom";
import { ALGORITHM_ROUTE_CONFIG } from "@/algorithms/config/routeConfig";

export function AlgorithmsSection() {
  return (
    <section
      id="algorithms"
      className="mb-24 p-6 rounded-xl bg-muted border shadow"
    >
      <h2 className="text-3xl font-bold mb-8 font-mono text-primary">
        Algorithms
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {ALGORITHM_ROUTE_CONFIG.map(({ path, title, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="group block border border-dashed rounded-lg p-5 bg-background hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold group-hover:underline">
                  {title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
