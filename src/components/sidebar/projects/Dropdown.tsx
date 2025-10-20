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
import { SidebarMenuAction } from "@/components/ui/sidebar"
import { MoreHorizontal, Trash2, Star, Plus, Pencil } from "lucide-react"

export const Dropdown = ({ id, type }) => {
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [createComponent] = useCreateComponentMutation()
  const [updateComponent] = useUpdateComponentMutation()
  const [deleteComponent] = useDeleteComponentMutation()

  const handleDelete = (id, type) => {
    if (type === "project") {
      handleDeleteProject(id)
    } else {
      handleDeleteComponent(id)
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          showOnHover
          className="absolute right-1 top-1/2 -translate-y-1/2 group-hover/item:opacity-100 group-hover/item:visible"
        >
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg">
        <DropdownMenuItem onClick={() => console.log(type)}>
          <Star className="text-muted-foreground" />
          <span>Add To Favorites</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleCreateComponent(id)}>
          <Plus className="text-muted-foreground" />
          <span>New Component</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="text-muted-foreground" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDelete(id, type)}>
          <Trash2 className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
