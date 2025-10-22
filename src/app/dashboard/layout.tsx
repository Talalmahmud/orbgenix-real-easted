import Header from "@/components/shared/header";
import Sidebar from "@/components/shared/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex w-full flex-col">
        <Header />
        <main className="w-full bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
