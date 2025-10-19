import { Sidebar, SidebarContent } from "../ui/sidebar"

import { Header } from "./Header"
import { Footer } from "./Footer"
import { Favorites } from "./Favorites"
import { Projects } from "./projects/Projects"
import { CreateNew } from "./CreateNew"

export const AppSidebar = () => {
  return (
    <Sidebar>
      <Header />
      <SidebarContent className="overflow-y-auto overflow-x-auto">
        <Favorites />
        <Projects />
        <CreateNew />
      </SidebarContent>
      <Footer />
    </Sidebar>
  )
}
