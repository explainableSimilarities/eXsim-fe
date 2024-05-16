
import ContactsPage from '../ui/contacts_page';
import Footer from '../ui/footer';
import TourEntry from '../ui/tour_entry';

export default function Contacts() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-50 dark:bg-slate-900">
      <ContactsPage/>
      <Footer/>
      <TourEntry page={0}/>
    </main>
  );
}
