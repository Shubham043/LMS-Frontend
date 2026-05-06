import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <div className="flex">
  <Sidebar />

  <div className="flex flex-col flex-1 ml-64">
    <Navbar />
    <main className="p-6 mt-16 overflow-auto h-screen">
      {children}
    </main>
  </div>
</div>
  );
}