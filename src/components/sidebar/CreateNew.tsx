import { useCreateProjectMutation } from "../../features/projects/projectsApiSlice"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { SidebarDialogCreateProject } from "@/components/sidebar/projects/sidebar-dialog-create-project"

export const CreateNew = () => {
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
