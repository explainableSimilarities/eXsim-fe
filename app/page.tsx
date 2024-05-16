import Footer from './ui/footer';
import SearchPageContainer from './ui/search_page_container';
import TourEntry from './ui/tour_entry';

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-50 dark:bg-slate-900">
      <SearchPageContainer/>
      <Footer/>
      <TourEntry page={0}/>
    </main>
  );
}
