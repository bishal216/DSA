import { Outlet } from "react-router-dom";
import Navbar from "@/components/partials/navbar";
import Footer from "@/components/partials/footer";
import FeedbackForm from "@/components/partials/feedback";
export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-2 mt-[80px]">
        <Outlet />
      </main>
      <FeedbackForm />
      <Footer />
    </div>
  );
}
