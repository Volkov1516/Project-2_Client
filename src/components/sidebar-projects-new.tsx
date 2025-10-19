import { useCreateProjectMutation } from "../features/projects/projectsApiSlice"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { SidebarDialogCreateProject } from "@/components/sidebar-dialog-create-project"

export const SidebarContentProjectsNew = () => {
  const [createProject] = useCreateProjectMutation()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarDialogCreateProject createProject={createProject} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
