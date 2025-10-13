import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetComponentsQuery,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} from "./projectsApiSlice"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash, FolderKanban, Layers, Star } from "lucide-react"

const Projects = () => {
  const {
    data: projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectsQuery()
  const [createProject] = useCreateProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const {
    data: components,
    isLoading: isComponentsLoading,
    error: componentsError,
  } = useGetComponentsQuery()
  const [createComponent] = useCreateComponentMutation()
  const [updateComponent] = useUpdateComponentMutation()
  const [deleteComponent] = useDeleteComponentMutation()

  if (isProjectLoading || isComponentsLoading) {
    return <div>Загрузка...</div>
  }

  if (projectError || componentsError) {
    return <div>Ошибка загрузки данных.</div>
  }

  const handleCreateProject = async () => {
    try {
      await createProject({
        name: `Project ${String(Date.now())} 23123213123123123123123212312312`,
        ownerId: "Admin",
      }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateProject = async (id: string, name: string) => {
    try {
      await updateProject({ id, data: { name: `Updated ${name}` } }).unwrap()
    } catch (err) {
      console.error("Ошибка при обновлении проекта:", err)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id).unwrap()
    } catch (err) {
      console.error("Ошибка при удалении проекта:", err)
    }
  }

  const handleCreateComponent = async (id: string) => {
    try {
      await createComponent({
        name: `Component ${String(Date.now())}`,
        projectId: id,
      }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateComponent = async (id: string, name: string) => {
    try {
      await updateComponent({ id, data: { name: `Updated ${name}` } }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteComponent = async (id: string) => {
    try {
      await deleteComponent(id).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects?.map(project => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton>
                <FolderKanban />
                <span>{project.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleCreateProject}>
              <Plus />
              <span>Create New</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      {/*<Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-start cursor-pointer"
      >
        <Star size={16} />
        <span>Favorites</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-start cursor-pointer"
        onClick={handleCreateProject}
      >
        <Layers size={16} />
        <span>Projects</span>
        <Plus size={16} />
      </Button>
      <ul>
        {projects?.map(project => (
          <li key={project.id}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-start cursor-pointer"
            >
              <FolderKanban size={16} />

              {project.name}

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleCreateComponent(project.id)}
              >
                <Plus size={16} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleUpdateProject(project.id, project.name)}
              >
                <Edit size={16} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash size={16} />
              </Button>
            </Button>
          </li>
        ))}
      </ul>*/}
      {/*<Separator />
      <ul>
        {components?.map(component => (
          <li key={component.id}>
            {component.name}
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                handleUpdateComponent(component.id, component.name)
              }
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={() => handleDeleteComponent(component.id)}
            >
              <Trash size={16} />
            </Button>
          </li>
        ))}
      </ul>*/}
    </SidebarGroup>
  )
}

export default Projects
