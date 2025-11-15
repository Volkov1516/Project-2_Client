import { useState, type ChangeEvent } from "react"

import {
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../../features/projects/projectsApiSlice"
import { useCreateComponentMutation, useUpdateComponentMutation, useDeleteComponentMutation } from "@/features/components/componentsApiSlice"

import { SidebarMenuAction } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label as InputLabel } from "@/components/ui/label"
import { MoreHorizontal, Trash2, Star, Plus, Pencil } from "lucide-react"

interface DropdownProps {
  id: string
  type: 'project' | 'component'
  projectId: string
}

export const Dropdown = ({ id, type, projectId }: DropdownProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState<string>("My Component")
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateName, setUpdateName] = useState<string>("My Component")

  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [createComponent] = useCreateComponentMutation()
  const [updateComponent] = useUpdateComponentMutation()
  const [deleteComponent] = useDeleteComponentMutation()

  const toggleDelete = (open: boolean) => setIsDeleteOpen(open)
  const toggleCreate = (open: boolean) => setIsCreateOpen(open)
  const toggleUpdate = (open: boolean) => setIsUpdateOpen(open)

  const targetProjectId = type === "project" ? id : projectId

  const handleCreateNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateName(e.target.value)
  }

  const handleUpdateNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateName(e.target.value)
  }

  const handleDelete = (id: string, type: 'project' | 'component') => {
    if (type === "project") {
      handleDeleteProject(id)
    } else {
      handleDeleteComponent(id)
    }

    setIsDeleteOpen(false)
  }

  const handleUpdate = (id: string, type: 'project' | 'component') => {
    if (type === "project") {
      handleUpdateProject(id)
    } else {
      handleUpdateComponent(id)
    }

    setIsUpdateOpen(false)
    setUpdateName("My Component")
  }

  const handleUpdateProject = async (id: string) => {
    try {
      await updateProject({ id, data: { name: updateName } }).unwrap()
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
        name: createName.trim(),
        parentId: type === "component" ? id : null,
        projectId: targetProjectId,
      }).unwrap()
    } catch (err) {
      console.error(err)
    }

    setIsCreateOpen(false)
    setCreateName("My Component")
  }

  const handleUpdateComponent = async (id: string) => {
    try {
      await updateComponent({ id, data: { name: updateName } }).unwrap()
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
    <>
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
          <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
            <Plus className="text-muted-foreground" />
            <span>New Component</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
            <Pencil className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isUpdateOpen} onOpenChange={toggleUpdate}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <InputLabel htmlFor="name-1">Name</InputLabel>
              <Input
                id="name-1"
                name="name"
                value={updateName}
                onChange={handleUpdateNameChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleUpdate(id, type)} type="button">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isCreateOpen} onOpenChange={toggleCreate}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Component</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <InputLabel htmlFor="name-1">Name</InputLabel>
              <Input
                id="name-1"
                name="name"
                value={createName}
                onChange={handleCreateNameChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleCreateComponent(id)} type="button">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={toggleDelete}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleDelete(id, type)} type="button">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
