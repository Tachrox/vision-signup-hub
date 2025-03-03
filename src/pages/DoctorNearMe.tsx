
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const DoctorNearMe = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Doctors Near Me</h1>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorNearMe;
