import { useState, type ChangeEvent } from "react"
import { useCreateProjectMutation } from "../../../features/projects/projectsApiSlice"

import { SidebarGroupLabel, SidebarGroupAction } from "@/components/ui/sidebar"
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

import { Plus } from "lucide-react"

export const Label = () => {
  const [name, setName] = useState<string>("My Project")
  const [open, setOpen] = useState<boolean>(false)

  const [createProject] = useCreateProjectMutation()

  const handleCreateProject = async () => {
    if (name.trim().length === 0) {
      return
    }

    try {
      await createProject({
        name: name.trim(),
        ownerId: "Admin",
      }).unwrap()

      setOpen(false)
      setName("My Project")
    } catch (err) {
      console.error(err)
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  return (
    <>
      <SidebarGroupLabel asChild>
        <span className="select-none">Projects</span>
      </SidebarGroupLabel>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SidebarGroupAction title="Add Project">
            <Plus className="text-muted-foreground" />
            <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <InputLabel htmlFor="name-1">Name</InputLabel>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleCreateProject}
              disabled={name.trim().length === 0}
              type="button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
