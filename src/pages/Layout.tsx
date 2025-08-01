import { Outlet } from "react-router-dom";
import Navbar from "@/components/partials/navbar";
import Footer from "@/components/partials/footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RedirectHandler from "@/algorithms/components/redirectHandler";
import { ArrowLeft } from "lucide-react";
export function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow p-2 bg-primary-light">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow p-2 bg-primary-light">
        <RedirectHandler />
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" className="mb-4 py-2">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="size-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
