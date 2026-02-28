import Footer from "@/components/partials/footer";
import Navbar from "@/components/partials/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
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
        <div className="container mx-auto px-4 py-8 ">
          <Button variant="primary" className="mb-4 px-0">
            <Link to="/" className="flex items-center h-full w-full px-4">
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
