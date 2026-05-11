import BottomNav from "../components/BottomNav";
import SideNav from "../components/SideNav";
import PageTransition from "../components/PageTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen">
      <SideNav />
      <div className="md:pl-[244px] min-h-screen relative">
        <PageTransition>{children}</PageTransition>
      </div>
      <BottomNav />
    </div>
  );
}
