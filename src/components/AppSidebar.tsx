
import { History, LogOut, MapPin, Eye, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { LogoutConfirmation } from "./LogoutConfirmation";
import { isLoggedIn } from "@/services/storage";

const menuItems = [
  {
    title: "Disease Prediction",
    url: "/prediction",
    icon: Eye,
  },
  {
    title: "Patient History",
    url: "/history",
    icon: History,
  },
  {
    title: "Doctor Near Me",
    url: "/doctors",
    icon: MapPin,
  },
];

export function AppSidebar() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const userLoggedIn = isLoggedIn();

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Features</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {userLoggedIn ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setShowLogoutDialog(true)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5 text-red-500" />
                      <span className="text-red-500">Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to="/signin"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        <User className="h-5 w-5" />
                        <span>Sign In</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <LogoutConfirmation 
        open={showLogoutDialog} 
        onOpenChange={setShowLogoutDialog} 
      />
    </>
  );
}
