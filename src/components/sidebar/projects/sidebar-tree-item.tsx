import {
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} from "../../../features/projects/projectsApiSlice"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuItem, SidebarMenuAction } from "@/components/ui/sidebar"
import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
  Star,
  Plus,
  Pencil,
} from "lucide-react"

export const SidebarTreeItem = ({ children }) => {
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [createComponent] = useCreateComponentMutation()
  const [updateComponent] = useUpdateComponentMutation()
  const [deleteComponent] = useDeleteComponentMutation()

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
    <SidebarMenuItem className="whitespace-nowrap flex max-w-[239px]">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover className="ml-auto">
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-lg">
          <DropdownMenuItem>
            <Star className="text-muted-foreground" />
            <span>Add To Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Plus className="text-muted-foreground" />
            <span>New Component</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
