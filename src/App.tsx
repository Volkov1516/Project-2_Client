import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"

import { AppSidebar } from "./components/app-sidebar"
import { AppContent } from "./components/app-content"

export const App = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
