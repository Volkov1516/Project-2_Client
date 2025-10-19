import { Sidebar, SidebarContent } from "../ui/sidebar"

import { Header } from "./Header"
import { Footer } from "./Footer"
import { Favorites } from "./Favorites"
import { Projects } from "./projects/Projects"

export const AppSidebar = () => {
  return (
    <Sidebar>
      <Header />
      <SidebarContent>
        <Favorites />
        <Projects />
      </SidebarContent>
      <Footer />
    </Sidebar>
  )
}
