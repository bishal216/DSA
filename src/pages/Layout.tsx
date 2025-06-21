import { Outlet } from "react-router-dom";
import Navbar from "@/components/partials/navbar";
import Footer from "@/components/partials/footer";
import FeedbackForm from "@/components/partials/feedback";
import { Link } from "react-router-dom";
import { iconMap } from "@/utils/iconmap";
import { Button } from "@/components/ui/button";
import RedirectHandler from "@/algorithms/components/redirectHandler";
export function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow p-2 mt-[80px]">
        <Outlet />
      </main>
      <FeedbackForm />
      <Footer />
    </div>
  );
}

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow p-2 mt-[80px]">
        <RedirectHandler />
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/">
              <iconMap.ArrowLeft className="size-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Outlet />
        </div>
      </main>
      <FeedbackForm />
      <Footer />
    </div>
  );
}
