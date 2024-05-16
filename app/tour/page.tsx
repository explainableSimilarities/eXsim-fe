import Footer from "../ui/footer";
import TourPage from "../ui/tour_page";

export default function Tour() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-50 dark:bg-slate-900">
      <TourPage />
      <Footer />
    </main>
  );
}
