import SummaryPageContainer from "../ui/summary_page_container";
import Footer from "../ui/footer";
import TourEntry from "../ui/tour_entry";

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-50 dark:bg-slate-900">
      <SummaryPageContainer id={params.id} />
      <Footer />
      <TourEntry page={2} />
    </main>
  );
}
