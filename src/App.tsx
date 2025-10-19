import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"

import { AppSidebar } from "./components/sidebar/app-sidebar"
import { AppContent } from "./components/content/app-content"

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
