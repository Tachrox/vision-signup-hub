
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Home = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Eye Care AI</h1>
          <p className="mt-4 text-gray-600">Select a feature from the sidebar to get started.</p>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Home;
