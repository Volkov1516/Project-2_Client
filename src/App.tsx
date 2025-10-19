import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"

import { AppSidebar } from "./components/sidebar"
import { AppContent } from "./components/content"

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
