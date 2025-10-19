import { Sidebar, SidebarContent } from "./ui/sidebar"

import { SidebarContentHeader } from "./sidebar-header"
import { SidebarContentFooter } from "./sidebar-footer"
import { SidebarContentFavorites } from "./sidebar-favorites"
import { SidebarContentProjects } from "./sidebar-projects"
import { SidebarContentProjectsNew } from "./sidebar-projects-new"

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContentHeader />
      <SidebarContent className="overflow-y-auto overflow-x-auto">
        <SidebarContentFavorites />
        <SidebarContentProjects />
        <SidebarContentProjectsNew />
      </SidebarContent>
      <SidebarContentFooter />
    </Sidebar>
  )
}
